const { pool } = require('../db');

async function run() {
  const cats = [
    ['Clothes', 'Men, women, and kids traditional and modern clothing', 'shirt-outline'],
    ['Shoes', 'Sneakers, formal shoes, sandals, and boots', 'walk-outline'],
    ['Bags', 'Handbags, backpacks, laptop bags, and luggage', 'briefcase-outline'],
    ['Household Equipment', 'Kitchen appliances, cookware, and home items', 'home-outline'],
    ['Jewellery', 'Rings, necklaces, bracelets, and watches', 'diamond-outline'],
    ['Cosmetics', 'Skin care, body lotions, fragrances, and makeup', 'sparkles-outline'],
  ];

  for (const [name, desc, icon] of cats) {
    await pool.query(
      `INSERT INTO categories (name, description, icon) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (name) DO NOTHING`,
      [name, desc, icon]
    );
  }

  // Also seed some sample products for these categories if none exist
  const sellerRes = await pool.query("SELECT id FROM users WHERE role = 'seller' LIMIT 1");
  const sellerId = sellerRes.rows[0]?.id || null;

  const catRows = await pool.query('SELECT id, name FROM categories');
  const catMap = {};
  catRows.rows.forEach(c => { catMap[c.name] = c.id; });

  const sampleProducts = [
    {
      title: 'Kitenge African Print Dress',
      description: 'Handmade Rwandan tailored Kitenge dress with elegant modern fit and vibrant East African patterns.',
      price: 28000,
      stock: 15,
      category_name: 'Clothes',
      image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'Leather Safari Casual Shoes',
      description: 'Durable genuine leather everyday walking shoes crafted for comfort and style.',
      price: 35000,
      stock: 12,
      category_name: 'Shoes',
      image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'Handcrafted Sisal Agaseke Tote Bag',
      description: 'Traditional Rwandan Agaseke weave market tote bag, eco-friendly and stylish.',
      price: 18500,
      stock: 20,
      category_name: 'Bags',
      image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'Electric Stainless Steel Kettle 1.8L',
      description: 'Fast boiling energy efficient automatic cut-off kettle for tea and coffee.',
      price: 22000,
      stock: 18,
      category_name: 'Household Equipment',
      image_url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'Handmade Brass Beaded Necklace',
      description: 'Authentic Rwandan handcrafted bead and brass necklace piece, perfect for gifting.',
      price: 14000,
      stock: 25,
      category_name: 'Jewellery',
      image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'Natural Shea Butter & Aloe Body Cream 250ml',
      description: 'Deeply moisturizing skin lotion enriched with Rwandan natural botanical extracts.',
      price: 8500,
      stock: 30,
      category_name: 'Cosmetics',
      image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60'
    }
  ];

  for (const p of sampleProducts) {
    const catId = catMap[p.category_name];
    if (catId) {
      const exists = await pool.query('SELECT id FROM products WHERE title = $1', [p.title]);
      if (exists.rows.length === 0) {
        await pool.query(
          `INSERT INTO products (seller_id, category_id, title, description, price, stock, image_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [sellerId, catId, p.title, p.description, p.price, p.stock, p.image_url]
        );
      }
    }
  }

  const allCats = await pool.query('SELECT id, name FROM categories ORDER BY id');
  console.log('Categories updated successfully:', allCats.rows);

  const allProds = await pool.query('SELECT id, title, price, stock FROM products ORDER BY id');
  console.log('Total Products in DB:', allProds.rows.length);

  await pool.end();
}

run().catch(e => {
  console.error('Error updating categories:', e);
  process.exit(1);
});
