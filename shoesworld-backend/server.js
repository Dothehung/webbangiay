const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, password]);
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ message: 'Login successful', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving product' });
  }
});

app.post('/cart', async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    await db.query(
      `INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity`,
      [user_id, product_id, quantity]
    );
    res.json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

app.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      `SELECT c.id, c.quantity, p.name, p.price FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.put('/cart', async (req, res) => {
  const { id, quantity } = req.body;
  try {
    await db.query('UPDATE cart SET quantity = $1 WHERE id = $2', [quantity, id]);
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

app.delete('/cart/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM cart WHERE id = $1', [id]);
    res.json({ message: 'Item deleted from cart' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
});

app.listen(port, () => {
  console.log(`ShoesWorld backend running on port ${port}`);
});
