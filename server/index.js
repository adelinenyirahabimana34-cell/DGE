require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route for browser & Render health check
app.get('/', (req, res) => {
  res.json({
    name: 'D&G E-Commerce API',
    status: 'online',
    version: '1.0.0',
    store: 'D&G Retail Store, Rwamagana, Rwanda',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/products/categories',
      auth: '/api/auth',
      orders: '/api/orders',
      seller: '/api/seller',
    },
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'D&G E-Commerce API is running', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/seller', require('./routes/seller'));

// Categories are under products router at /api/products/categories
// already wired above

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`D&G E-Commerce API listening on port ${PORT} (0.0.0.0)`);
  console.log(`Health check ready at /api/health`);
});
