const express = require('express');
const router = express.Router();
const { getIsConnected } = require('../config/db');
const Feedback = require('../models/Feedback');
const { auth, adminOnly } = require('../middleware/auth');

let mockFeedback = [];

// POST /api/feedback (Contact form / Newsletter)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, type } = req.body;

    if (!email || (type !== 'newsletter' && !message)) {
      return res.status(400).json({ message: 'Email and message content are required.' });
    }

    const payload = {
      name: name || 'Anonymous',
      email,
      subject: subject || (type === 'newsletter' ? 'Newsletter Subscription' : 'General Inquiry'),
      message: message || 'Subscribed to Climate Alert Updates',
      type: type || 'contact',
      createdAt: new Date()
    };

    if (getIsConnected()) {
      const entry = await Feedback.create(payload);
      return res.status(201).json({ message: 'Feedback received successfully.', data: entry });
    } else {
      const newEntry = { _id: 'fb_' + Date.now(), ...payload };
      mockFeedback.push(newEntry);
      return res.status(201).json({ message: 'Feedback received successfully.', data: newEntry });
    }
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ message: 'Error submitting feedback.' });
  }
});

// GET /api/feedback (Admin)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    if (getIsConnected()) {
      const items = await Feedback.find().sort({ createdAt: -1 });
      return res.json(items);
    } else {
      return res.json(mockFeedback);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving feedback messages.' });
  }
});

module.exports = router;
