const { pool } = require('./db');
const bcrypt = require('bcryptjs');

async function initDb() {
  console.log('Connecting to Neon PostgreSQL and creating database schema...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'seller')),
        phone VARCHAR(30),
        address VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(80) UNIQUE NOT NULL,
        description TEXT,
        icon VARCHAR(50) DEFAULT 'tag'
      );
    `);

    // 3. Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        seller_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        price NUMERIC(12, 2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total_amount NUMERIC(12, 2) NOT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled')),
        delivery_address TEXT NOT NULL,
        phone_number VARCHAR(30) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Order Items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
        product_title VARCHAR(200) NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price NUMERIC(12, 2) NOT NULL,
        total_price NUMERIC(12, 2) NOT NULL
      );
    `);

    console.log('Tables verified and created successfully.');

    // Seed Categories if empty
    const catCheck = await client.query('SELECT COUNT(*) FROM categories');
    if (parseInt(catCheck.rows[0].count, 10) === 0) {
      console.log('Seeding categories...');
      await client.query(`
        INSERT INTO categories (name, description, icon) VALUES
        ('Electronics', 'Phones, accessories, chargers & sound devices', 'phone-portrait-outline'),
        ('Clothing & Fashion', 'Men, women, and kids apparel & shoes', 'shirt-outline'),
        ('Home & Kitchen', 'Household essentials, cookware & living', 'home-outline'),
        ('Groceries & Food', 'Fresh staples, drinks & daily essentials', 'nutrition-outline'),
        ('Beauty & Personal Care', 'Skincare, perfumes & grooming', 'sparkles-outline');
      `);
    }

    // Seed Demo Users if empty
    const userCheck = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCheck.rows[0].count, 10) === 0) {
      console.log('Seeding demo client and seller accounts...');
      const sellerPw = await bcrypt.hash('seller123', 10);
      const clientPw = await bcrypt.hash('client123', 10);

      await client.query(`
        INSERT INTO users (name, email, password_hash, role, phone, address) VALUES
        ('D&G Store Manager', 'seller@dg.rw', $1, 'seller', '+250 788 123 456', 'Rwamagana Commercial Center, Rwanda'),
        ('Keza Divine', 'client@dg.rw', $2, 'client', '+250 789 987 654', 'Rwamagana Town, Sector Muhazi, Rwanda');
      `, [sellerPw, clientPw]);
    }

    // Seed Products if empty
    const prodCheck = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(prodCheck.rows[0].count, 10) === 0) {
      console.log('Seeding initial products for D&G E-Commerce in Rwamagana...');
      const sellerRes = await client.query("SELECT id FROM users WHERE role = 'seller' LIMIT 1");
      const sellerId = sellerRes.rows[0]?.id || null;

      const catRes = await client.query('SELECT id, name FROM categories');
      const catMap = {};
      catRes.rows.forEach(c => { catMap[c.name] = c.id; });

      const sampleProducts = [
        {
          title: 'Samsung Galaxy A15 (128GB)',
          desc: 'Reliable 4G smartphone with 50MP triple camera and 5000mAh battery. Official warranty included.',
          price: 215000,
          stock: 14,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80'
        },
        {
          title: 'Oraimo Fast Charger Type-C (20W)',
          desc: 'High-speed dual port power adapter for smartphones and tablets. Safe fast charging.',
          price: 18000,
          stock: 45,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80'
        },
        {
          title: 'Wireless Bluetooth Headset Extra Bass',
          desc: 'Over-ear comfortable noise-isolating wireless headset with up to 25 hours playtime.',
          price: 32000,
          stock: 20,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
        },
        {
          title: 'Classic African Print Shirt (Kitenge)',
          desc: 'Tailored vibrant Rwandan Kitenge print long sleeve shirt, perfect for smart-casual wear.',
          price: 25000,
          stock: 18,
          category: 'Clothing & Fashion',
          image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80'
        },
        {
          title: 'Casual Canvas Sneakers',
          desc: 'Durable and breathable everyday low-top walking sneakers for unisex all-day comfort.',
          price: 35000,
          stock: 22,
          category: 'Clothing & Fashion',
          image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80'
        },
        {
          title: 'Stainless Steel Electric Kettle 2.0L',
          desc: 'Fast boil cordless kettle with automatic shut-off and boil-dry protection.',
          price: 22000,
          stock: 15,
          category: 'Home & Kitchen',
          image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'
        },
        {
          title: 'Thermal Insulated Water Flask 1L',
          desc: 'Keeps drinks hot for 12 hours or cold for 24 hours. Leakproof double-wall steel.',
          price: 14000,
          stock: 30,
          category: 'Home & Kitchen',
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80'
        },
        {
          title: 'Pure Rwandan Mountain Coffee (500g)',
          desc: 'Premium single-origin Arabica ground coffee grown in the high altitudes of Rwanda.',
          price: 12500,
          stock: 40,
          category: 'Groceries & Food',
          image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80'
        }
      ];

      for (const p of sampleProducts) {
        await client.query(`
          INSERT INTO products (seller_id, category_id, title, description, price, stock, image_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          sellerId,
          catMap[p.category] || null,
          p.title,
          p.desc,
          p.price,
          p.stock,
          p.image
        ]);
      }
    }

    await client.query('COMMIT');
    console.log('Database initialization & seeding completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during database initialization:', err);
    throw err;
  } finally {
    client.release();
    pool.end();
  }
}

initDb();
