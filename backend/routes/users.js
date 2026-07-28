const express = require('express');
const router = express.Router();
const { getIsConnected } = require('../config/db');
const User = require('../models/User');
const { initialUsers } = require('../seed/seedData');
const { auth, adminOnly } = require('../middleware/auth');

let mockUsers = [...initialUsers];

// GET /api/users (Admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    if (getIsConnected()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json(users);
    } else {
      const sanitized = mockUsers.map(u => {
        const { password, ...rest } = u;
        return rest;
      });
      return res.json(sanitized);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving platform users.' });
  }
});

module.exports = router;
