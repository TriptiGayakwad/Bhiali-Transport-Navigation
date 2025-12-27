const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

// User registration
router.post('/register', async (req, res) => {
  try {
    const { email, phoneNumber, name, password } = req.body;
    
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR phone_number = $2',
      [email, phoneNumber]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await pool.query(`
      INSERT INTO users (email, phone_number, name, password_hash, preferences)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, phone_number, name, is_student, preferences, created_at
    `, [email, phoneNumber, name, hashedPassword, JSON.stringify({
      language: 'en',
      defaultTransportMode: 'bus',
      accessibilityNeeds: []
    })]);

    const user = result.rows[0];
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Remove password from response
    delete user.password_hash;

    res.json({
      user,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify student status
router.post('/verify-student', async (req, res) => {
  try {
    const { userId, studentId, institutionEmail } = req.body;
    
    // Simple validation (in production, integrate with institution APIs)
    const validDomains = ['bit.ac.in', 'dpsraipur.com', 'stthomas.ac.in'];
    const emailDomain = institutionEmail.split('@')[1];
    
    if (!validDomains.includes(emailDomain)) {
      return res.status(400).json({ error: 'Invalid institutional email domain' });
    }

    // Update user student status
    const result = await pool.query(`
      UPDATE users 
      SET is_student = true, student_id = $1, institution_email = $2
      WHERE id = $3
      RETURNING id, email, is_student, student_id, institution_email
    `, [studentId, institutionEmail, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Student status verified successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Student verification error:', error);
    res.status(500).json({ error: 'Student verification failed' });
  }
});

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT id, email, phone_number, name, is_student, student_id, 
             institution_email, preferences, created_at, last_login
      FROM users WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;