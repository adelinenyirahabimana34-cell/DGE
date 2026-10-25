const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Register client
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const emailTrimmed = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await db.query('SELECT id FROM users WHERE LOWER(email) = $1', [emailTrimmed]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role, phone, address)
       VALUES ($1, $2, $3, 'client', $4, $5)
       RETURNING id, name, email, role, phone, address, created_at`,
      [name.trim(), emailTrimmed, passwordHash, phone || null, address || null]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'dg_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Client registered successfully',
      token,
      user
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login (Client & Seller)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailTrimmed = email.trim().toLowerCase();
    const result = await db.query(
      'SELECT id, name, email, password_hash, role, phone, address FROM users WHERE LOWER(email) = $1',
      [emailTrimmed]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'dg_secret',
      { expiresIn: '7d' }
    );

    delete user.password_hash;

    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get Current User Profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Fetch me error:', err);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

module.exports = router;
