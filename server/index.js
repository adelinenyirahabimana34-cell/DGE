const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const app = express();
// On Render, PORT is provided by environment (default 10000). Locally loaded from .env (5000).
const PORT = process.env.PORT || 10000;
const HOST = process.env.HOST || '0.0.0.0';

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
      health: '/health',
      apiHealth: '/api/health',
      products: '/api/products',
      categories: '/api/products/categories',
      auth: '/api/auth',
      orders: '/api/orders',
      seller: '/api/seller',
    },
  });
});

// Health check (supports both /health matching Render Blueprint and /api/health)
app.get(['/health', '/api/health'], (req, res) => {
  res.json({ status: 'ok', message: 'D&G E-Commerce API is running', timestamp: new Date().toISOString() });
});

// Direct APK download route for physical Android phones
app.get(['/download', '/app.apk'], (req, res) => {
  const apkPath = path.join(__dirname, '../DGECommerce.apk');
  res.download(apkPath, 'DGECommerce.apk');
});

// Mobile Install Landing Page
app.get(['/install', '/app'], (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Download D&G E-Commerce App</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #F7F8FA; color: #1A1A2E; padding: 24px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; justify-content: center; }
        .card { background: #FFFFFF; max-width: 420px; width: 100%; border-radius: 20px; padding: 32px 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); text-align: center; }
        .badge { display: inline-block; background: #E8F5E9; color: #1A5C38; font-weight: 700; font-size: 13px; padding: 6px 14px; border-radius: 20px; margin-bottom: 16px; }
        h1 { font-size: 26px; font-weight: 800; color: #1A5C38; margin-bottom: 8px; }
        p.subtitle { color: #6B7280; font-size: 14px; margin-bottom: 24px; }
        .btn-download { display: block; width: 100%; background: #1A5C38; color: #FFFFFF; text-decoration: none; font-size: 17px; font-weight: 700; padding: 16px 20px; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 14px rgba(26,92,56,0.3); }
        .btn-download:active { background: #0F3D24; }
        .steps { text-align: left; background: #F9FAFB; border-radius: 12px; padding: 16px; margin-top: 20px; font-size: 13px; color: #374151; line-height: 1.6; }
        .steps strong { color: #111827; }
        .step-item { margin-bottom: 8px; }
        .step-item:last-child { margin-bottom: 0; }
        .creds { margin-top: 16px; font-size: 12px; color: #6B7280; text-align: left; }
        .creds code { background: #E5E7EB; padding: 2px 6px; border-radius: 4px; color: #111827; font-size: 11px; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">🇷🇼 Rwamagana, Rwanda</span>
        <h1>D&G E-Commerce</h1>
        <p class="subtitle">Official Android Mobile App</p>
        <a href="/download" class="btn-download">📥 Download App (APK)</a>
        <div class="steps">
          <div class="step-item"><strong>1. Tap the green button</strong> above to download <code>DGECommerce.apk</code>.</div>
          <div class="step-item"><strong>2. Open the file</strong> when the download finishes.</div>
          <div class="step-item"><strong>3. Tap "Install"</strong> (if prompted, enable "Allow from this source").</div>
        </div>
        <div class="creds">
          <p><strong>Demo Accounts:</strong></p>
          <p>• Client: <code>client@dg.rw</code> / <code>client123</code></p>
          <p>• Seller: <code>seller@dg.rw</code> / <code>seller123</code></p>
        </div>
      </div>
    </body>
    </html>
  `);
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

app.listen(PORT, HOST, () => {
  console.log(`D&G E-Commerce API listening on ${HOST}:${PORT}`);
  console.log(`Health check ready at /health and /api/health`);
});
