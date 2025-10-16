const express = require('express');
const User = require('../models/User');
const router = express.Router();

let userModel;

// Initialize user model with database
function initAuthRoutes(db) {
  userModel = new User(db);
}

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Please provide email, password, and name' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Please provide a valid email address' 
      });
    }

    if (!userModel) {
      return res.status(500).json({ 
        error: 'Database not connected' 
      });
    }

    const user = await userModel.createUser(email, password, name);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.message === 'User already exists') {
      return res.status(409).json({ 
        error: 'An account with this email already exists' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to create account. Please try again.' 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Please provide email and password' 
      });
    }

    if (!userModel) {
      return res.status(500).json({ 
        error: 'Database not connected' 
      });
    }

    const user = await userModel.authenticateUser(email, password);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to login. Please try again.' 
    });
  }
});

// Get user profile (optional - for future use)
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userModel) {
      return res.status(500).json({ 
        error: 'Database not connected' 
      });
    }

    const user = await userModel.getUserById(userId);

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(404).json({ 
      error: 'User not found' 
    });
  }
});

module.exports = { router, initAuthRoutes };
