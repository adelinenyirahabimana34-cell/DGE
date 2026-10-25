const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Create order (Client)
router.post('/', authenticateToken, requireRole('client'), async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { items, delivery_address, phone_number, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!delivery_address || !phone_number) {
      return res.status(400).json({ error: 'Delivery address and phone number are required' });
    }

    await client.query('BEGIN');

    let totalAmount = 0;
    const validatedItems = [];

    // Verify stock and compute total from database
    for (const item of items) {
      const prodRes = await client.query('SELECT id, title, price, stock FROM products WHERE id = $1 FOR UPDATE', [item.product_id]);
      if (prodRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Product ID ${item.product_id} not found` });
      }

      const product = prodRes.rows[0];
      const qty = parseInt(item.quantity, 10);
      if (qty <= 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Invalid quantity for ${product.title}` });
      }

      if (product.stock < qty) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Insufficient stock for ${product.title}. Available: ${product.stock}` });
      }

      const unitPrice = parseFloat(product.price);
      const itemTotal = unitPrice * qty;
      totalAmount += itemTotal;

      validatedItems.push({
        product_id: product.id,
        title: product.title,
        quantity: qty,
        unit_price: unitPrice,
        total_price: itemTotal
      });

      // Deduct stock
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [qty, product.id]);
    }

    // Insert order
    const orderRes = await client.query(
      `INSERT INTO orders (client_id, total_amount, status, delivery_address, phone_number, notes)
       VALUES ($1, $2, 'Pending', $3, $4, $5)
       RETURNING *`,
      [req.user.id, totalAmount, delivery_address.trim(), phone_number.trim(), notes || '']
    );

    const order = orderRes.rows[0];

    // Insert order items
    for (const item of validatedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_title, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.product_id, item.title, item.quantity, item.unit_price, item.total_price]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        ...order,
        items: validatedItems
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Server error placing order' });
  } finally {
    client.release();
  }
});

// Get orders (Role-based: client gets own orders, seller gets all customer orders)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = `
      SELECT o.*, u.name as client_name, u.email as client_email,
        (SELECT json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'product_title', oi.product_title,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price,
            'image_url', p.image_url
          )
        ) FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = o.id
        ) as items
      FROM orders o
      JOIN users u ON o.client_id = u.id
    `;
    const params = [];

    if (req.user.role === 'client') {
      params.push(req.user.id);
      query += ` WHERE o.client_id = $1`;
    }

    query += ' ORDER BY o.created_at DESC';

    const result = await db.query(query, params);
    res.json({ orders: result.rows });
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// Get single order details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT o.*, u.name as client_name, u.email as client_email,
        (SELECT json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'product_title', oi.product_title,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price,
            'image_url', p.image_url
          )
        ) FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = o.id
        ) as items
      FROM orders o
      JOIN users u ON o.client_id = u.id
      WHERE o.id = $1
    `;
    const params = [id];

    if (req.user.role === 'client') {
      params.push(req.user.id);
      query += ` AND o.client_id = $2`;
    }

    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order: result.rows[0] });
  } catch (err) {
    console.error('Fetch order detail error:', err);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

// Update order status (Seller only: Pending -> Confirmed -> Shipped -> Delivered / Cancelled)
router.put('/:id/status', authenticateToken, requireRole('seller'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validMap = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    const normalizedStatus = validMap[status?.toLowerCase()];
    if (!normalizedStatus) {
      return res.status(400).json({ error: 'Invalid status. Must be one of: Pending, Confirmed, Shipped, Delivered, Cancelled' });
    }

    const result = await db.query(
      `UPDATE orders
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [normalizedStatus, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: `Order status updated to ${status}`,
      order: result.rows[0]
    });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
