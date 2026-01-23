/**
 * Coffee Shop Server
 * Express server for Coffee Shop Hackathon
 * Implements bonus point and discount system
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

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Coffee Shop Server is running',
    timestamp: new Date().toISOString()
  });
});

// ==================== COFFEE ENDPOINTS ====================

// GET /coffees - Get all coffee products
app.get('/coffees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Coffees ORDER BY created_at DESC');
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching coffees:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// GET /coffees/:id - Get a specific coffee by ID
app.get('/coffees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Coffees WHERE coffee_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Coffee not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching coffee:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// POST /coffees - Create a new coffee product
app.post('/coffees', async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || price === undefined || price === null) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name and price are required'
      });
    }

    if (price < 0) {
      return res.status(400).json({
        error: 'Invalid price',
        message: 'Price must be non-negative'
      });
    }

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

// PUT /coffees/:id - Update a coffee product
app.put('/coffees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    // Check if coffee exists
    const checkResult = await pool.query('SELECT * FROM Coffees WHERE coffee_id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Coffee not found'
      });
    }

    if (price !== undefined && price < 0) {
      return res.status(400).json({
        error: 'Invalid price',
        message: 'Price must be non-negative'
      });
    }

    const result = await pool.query(
      `UPDATE Coffees 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           category = COALESCE($4, category)
       WHERE coffee_id = $5
       RETURNING *`,
      [name || null, description || null, price || null, category || null, id]
    );

    res.json({
      success: true,
      message: 'Coffee updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating coffee:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// DELETE /coffees/:id - Delete a coffee product
app.delete('/coffees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM Coffees WHERE coffee_id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Coffee not found'
      });
    }

    res.json({
      success: true,
      message: 'Coffee deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting coffee:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// ==================== MEMBER ENDPOINTS ====================

// GET /members - Get all members
app.get('/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Members ORDER BY created_at DESC');
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// GET /members/:id - Get a specific member by ID
app.get('/members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Members WHERE member_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// POST /members - Register a new member
app.post('/members', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name and email are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO Members (name, email, phone)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, phone || null]
    );

    res.status(201).json({
      success: true,
      message: 'Member registered successfully',
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({
        error: 'Duplicate entry',
        message: 'Email already exists'
      });
    }
    console.error('Error creating member:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// ==================== PURCHASE ENDPOINT ====================
// POST /purchases - Process a purchase and calculate bonus points
// Business Rule: 1 point per 50 taka spent
app.post('/purchases', async (req, res) => {
  try {
    const { member_id, coffee_id, quantity = 1 } = req.body;

    if (!member_id || !coffee_id) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'member_id and coffee_id are required'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        error: 'Invalid quantity',
        message: 'Quantity must be greater than 0'
      });
    }

    // Check if member exists
    const memberResult = await pool.query('SELECT * FROM Members WHERE member_id = $1', [member_id]);
    if (memberResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Member not found'
      });
    }

    // Check if coffee exists
    const coffeeResult = await pool.query('SELECT * FROM Coffees WHERE coffee_id = $1', [coffee_id]);
    if (coffeeResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Coffee not found'
      });
    }

    const coffee = coffeeResult.rows[0];
    const totalAmount = parseFloat(coffee.price) * quantity;
    
    // Calculate bonus points: 1 point per 50 taka spent
    const pointsEarned = Math.floor(totalAmount / 50);
    
    const member = memberResult.rows[0];
    const newPointsBalance = member.loyalty_points + pointsEarned;

    // Start transaction
    await pool.query('BEGIN');

    try {
      // Update member's loyalty points
      await pool.query(
        'UPDATE Members SET loyalty_points = $1 WHERE member_id = $2',
        [newPointsBalance, member_id]
      );

      // Record transaction
      const transactionResult = await pool.query(
        `INSERT INTO LoyaltyTransactions (member_id, coffee_id, points_change, transaction_type, description)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          member_id,
          coffee_id,
          pointsEarned,
          'earned',
          `Purchase: ${quantity}x ${coffee.name} (${totalAmount} taka)`
        ]
      );

      await pool.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Purchase processed successfully',
        data: {
          purchase: {
            member_id: parseInt(member_id),
            coffee_id: parseInt(coffee_id),
            coffee_name: coffee.name,
            quantity: quantity,
            unit_price: parseFloat(coffee.price),
            total_amount: totalAmount
          },
          bonus_points: {
            earned: pointsEarned,
            previous_balance: member.loyalty_points,
            new_balance: newPointsBalance
          },
          transaction: transactionResult.rows[0]
        }
      });
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// ==================== REDEEM/DISCOUNT ENDPOINT ====================
// POST /redeem - Redeem points for discount
// Business Rule: 1 point = 1 taka discount
app.post('/redeem', async (req, res) => {
  try {
    const { member_id, points_to_redeem, purchase_amount } = req.body;

    if (!member_id || points_to_redeem === undefined || purchase_amount === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'member_id, points_to_redeem, and purchase_amount are required'
      });
    }

    if (points_to_redeem <= 0) {
      return res.status(400).json({
        error: 'Invalid points',
        message: 'Points to redeem must be greater than 0'
      });
    }

    if (purchase_amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount',
        message: 'Purchase amount must be greater than 0'
      });
    }

    // Check if member exists
    const memberResult = await pool.query('SELECT * FROM Members WHERE member_id = $1', [member_id]);
    if (memberResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Member not found'
      });
    }

    const member = memberResult.rows[0];

    if (member.loyalty_points < points_to_redeem) {
      return res.status(400).json({
        error: 'Insufficient points',
        message: `Member has ${member.loyalty_points} points, but trying to redeem ${points_to_redeem} points`
      });
    }

    // Calculate discount: 1 point = 1 taka
    const discountAmount = points_to_redeem;
    const finalAmount = Math.max(0, purchase_amount - discountAmount);
    const newPointsBalance = member.loyalty_points - points_to_redeem;

    // Start transaction
    await pool.query('BEGIN');

    try {
      // Update member's loyalty points
      await pool.query(
        'UPDATE Members SET loyalty_points = $1 WHERE member_id = $2',
        [newPointsBalance, member_id]
      );

      // Record transaction
      const transactionResult = await pool.query(
        `INSERT INTO LoyaltyTransactions (member_id, points_change, transaction_type, description)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          member_id,
          -points_to_redeem, // Negative for redemption
          'spent',
          `Redeemed ${points_to_redeem} points for ${discountAmount} taka discount on purchase of ${purchase_amount} taka`
        ]
      );

      await pool.query('COMMIT');

      res.status(200).json({
        success: true,
        message: 'Points redeemed successfully',
        data: {
          redemption: {
            points_redeemed: points_to_redeem,
            discount_amount: discountAmount,
            original_amount: purchase_amount,
            final_amount: finalAmount
          },
          points: {
            previous_balance: member.loyalty_points,
            redeemed: points_to_redeem,
            new_balance: newPointsBalance
          },
          transaction: transactionResult.rows[0]
        }
      });
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error processing redemption:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// ==================== TRANSACTION HISTORY ====================

// GET /members/:id/transactions - Get transaction history for a member
app.get('/members/:id/transactions', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if member exists
    const memberResult = await pool.query('SELECT * FROM Members WHERE member_id = $1', [id]);
    if (memberResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Member not found'
      });
    }

    const result = await pool.query(
      `SELECT lt.*, c.name as coffee_name, c.price as coffee_price
       FROM LoyaltyTransactions lt
       LEFT JOIN Coffees c ON lt.coffee_id = c.coffee_id
       WHERE lt.member_id = $1
       ORDER BY lt.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
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
  console.log(`   GET  /coffees - Get all coffees`);
  console.log(`   GET  /coffees/:id - Get coffee by ID`);
  console.log(`   POST /coffees - Create coffee`);
  console.log(`   PUT  /coffees/:id - Update coffee`);
  console.log(`   DELETE /coffees/:id - Delete coffee`);
  console.log(`   GET  /members - Get all members`);
  console.log(`   GET  /members/:id - Get member by ID`);
  console.log(`   POST /members - Register member`);
  console.log(`   POST /purchases - Process purchase (earn points)`);
  console.log(`   POST /redeem - Redeem points for discount`);
  console.log(`   GET  /members/:id/transactions - Get member transaction history`);
});
