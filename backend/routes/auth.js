const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getIsConnected } = require('../config/db');
const User = require('../models/User');
const { initialUsers } = require('../seed/seedData');
const { auth } = require('../middleware/auth');

// In-Memory store fallback
let mockUsers = [...initialUsers];

const generateToken = (id, role, name, email) => {
  return jwt.sign(
    { id, role, name, email },
    process.env.JWT_SECRET || 'aurheat_climate_secret_key_2026_super_secure_token',
    { expiresIn: '7d' }
  );
};

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role, organization, location } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    if (getIsConnected()) {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        organization: organization || 'Individual',
        location: location || 'India'
      });

      const token = generateToken(user._id, user.role, user.name, user.email);

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organization: user.organization,
          location: user.location
        }
      });
    } else {
      // In-memory fallback
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
      }

      const newUser = {
        _id: 'user_' + Date.now(),
        name,
        email,
        password, // stored plain or hashed in memory
        role: role || 'user',
        organization: organization || 'Individual',
        location: location || 'India',
        createdAt: new Date()
      };

      mockUsers.push(newUser);

      const token = generateToken(newUser._id, newUser.role, newUser.name, newUser.email);

      return res.status(201).json({
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          organization: newUser.organization,
          location: newUser.location
        }
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    if (getIsConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials. User not found.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials. Incorrect password.' });
      }

      const token = generateToken(user._id, user.role, user.name, user.email);

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organization: user.organization,
          location: user.location
        }
      });
    } else {
      // In-Memory
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        // Allow demo login credentials or dynamically accept password for demo ease
        if (email === 'admin@aurheat.gov.in') {
          const adminUser = mockUsers[0];
          const token = generateToken(adminUser._id, adminUser.role, adminUser.name, adminUser.email);
          return res.json({ token, user: adminUser });
        } else if (email === 'user@aurheat.com') {
          const demoUser = mockUsers[1];
          const token = generateToken(demoUser._id, demoUser.role, demoUser.name, demoUser.email);
          return res.json({ token, user: demoUser });
        }
        return res.status(400).json({ message: 'Invalid credentials. User not found.' });
      }

      const token = generateToken(user._id, user.role, user.name, user.email);
      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organization: user.organization || 'Individual',
          location: user.location || 'India'
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Current user profile
router.get('/me', auth, async (req, res) => {
  try {
    if (getIsConnected()) {
      const user = await User.findById(req.user.id).select('-password');
      return res.json(user);
    } else {
      const user = mockUsers.find(u => u._id === req.user.id || u.email === req.user.email);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      }
      return res.json(req.user);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile.' });
  }
});

module.exports = router;
