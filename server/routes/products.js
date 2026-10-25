const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json({ categories: result.rows });
  } catch (err) {
    console.error('Fetch categories error:', err);
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

// Get all products (with optional search and category filter)
router.get('/', async (req, res) => {
  try {
    const { search, category, seller_id } = req.query;
    let query = `
      SELECT p.*, c.name as category_name, u.name as seller_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      query += ` AND (p.title ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
    }

    if (category && category !== 'all') {
      params.push(category);
      // Can be category id or category name
      if (!isNaN(category)) {
        query += ` AND p.category_id = $${params.length}`;
      } else {
        query += ` AND c.name ILIKE $${params.length}`;
      }
    }

    if (seller_id) {
      params.push(seller_id);
      query += ` AND p.seller_id = $${params.length}`;
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await db.query(query, params);
    res.json({ products: result.rows });
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT p.*, c.name as category_name, u.name as seller_name, u.phone as seller_phone
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.seller_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product: result.rows[0] });
  } catch (err) {
    console.error('Fetch product by ID error:', err);
    res.status(500).json({ error: 'Failed to retrieve product details' });
  }
});

// Create product (Seller only)
router.post('/', authenticateToken, requireRole('seller'), async (req, res) => {
  try {
    const { title, description, price, stock, category_id, image_url } = req.body;

    if (!title || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Title, price, and stock are required' });
    }

    const result = await db.query(
      `INSERT INTO products (seller_id, category_id, title, description, price, stock, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.user.id,
        category_id || null,
        title.trim(),
        description || '',
        parseFloat(price),
        parseInt(stock, 10),
        image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
      ]
    );

    res.status(201).json({
      message: 'Product created successfully',
      product: result.rows[0]
    });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (Seller only)
router.put('/:id', authenticateToken, requireRole('seller'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, stock, category_id, image_url } = req.body;

    // Verify ownership or existence
    const existing = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const current = existing.rows[0];

    const updated = await db.query(
      `UPDATE products
       SET title = $1, description = $2, price = $3, stock = $4, category_id = $5, image_url = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [
        title !== undefined ? title.trim() : current.title,
        description !== undefined ? description : current.description,
        price !== undefined ? parseFloat(price) : current.price,
        stock !== undefined ? parseInt(stock, 10) : current.stock,
        category_id !== undefined ? category_id : current.category_id,
        image_url !== undefined ? image_url : current.image_url,
        id
      ]
    );

    res.json({
      message: 'Product updated successfully',
      product: updated.rows[0]
    });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (Seller only)
router.delete('/:id', authenticateToken, requireRole('seller'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', id: result.rows[0].id });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
