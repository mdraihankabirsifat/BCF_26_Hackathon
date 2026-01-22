/**
 * Coffee Shop Server
 * Express server for Coffee Shop Hackathon
 */

const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 8000;

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'coffeeshop',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Coffee Shop Server is running',
    timestamp: new Date().toISOString()
  });
});

// POST /coffees - Create a new coffee product
app.post('/coffees', async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Basic validation
    if (!name || !price) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name and price are required'
      });
    }

    // Insert coffee into database
    const result = await pool.query(
      `INSERT INTO Coffees (name, description, price, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description || null, price, category || null]
    );

    res.status(201).json({
      success: true,
      message: 'Coffee created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating coffee:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Coffee Shop Server is running on http://0.0.0.0:${PORT}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /coffees - Create a new coffee product`);
});
