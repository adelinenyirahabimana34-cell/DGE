const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Seller Dashboard Summary
// GET /api/seller/summary
router.get('/summary', authenticateToken, requireRole('seller'), async (req, res) => {
  try {
    // Total orders and revenue
    const orderStats = await db.query(`
      SELECT
        COUNT(*)::int                     AS total_orders,
        COALESCE(SUM(total_amount), 0)    AS total_revenue,
        COUNT(*) FILTER (WHERE status = 'Pending')::int   AS pending_count,
        COUNT(*) FILTER (WHERE status = 'Confirmed')::int AS confirmed_count,
        COUNT(*) FILTER (WHERE status = 'Shipped')::int   AS shipped_count,
        COUNT(*) FILTER (WHERE status = 'Delivered')::int AS delivered_count,
        COUNT(*) FILTER (WHERE status = 'Cancelled')::int AS cancelled_count
      FROM orders
    `);

    // Total products listed
    const productStats = await db.query(`
      SELECT COUNT(*)::int AS total_products,
             COALESCE(SUM(stock), 0)::int AS total_stock
      FROM products
      WHERE seller_id = $1
    `, [req.user.id]);

    // Recent 5 orders
    const recentOrders = await db.query(`
      SELECT o.id, o.total_amount, o.status, o.created_at,
             u.name AS client_name
      FROM orders o
      JOIN users u ON o.client_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    res.json({
      summary: {
        ...orderStats.rows[0],
        ...productStats.rows[0],
        recent_orders: recentOrders.rows
      }
    });
  } catch (err) {
    console.error('Seller summary error:', err);
    res.status(500).json({ error: 'Failed to retrieve seller summary' });
  }
});

module.exports = router;
