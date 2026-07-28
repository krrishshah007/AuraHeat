const express = require('express');
const router = express.Router();
const { getIsConnected } = require('../config/db');
const Alert = require('../models/Alert');
const { initialAlerts } = require('../seed/seedData');
const { auth, adminOnly } = require('../middleware/auth');

let mockAlerts = [...initialAlerts];

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const { severity, city, state } = req.query;

    if (getIsConnected()) {
      let filter = { active: true };
      if (severity) filter.severity = severity;
      if (city) filter.city = new RegExp(city, 'i');
      if (state) filter.state = new RegExp(state, 'i');

      const alerts = await Alert.find(filter).sort({ issuedAt: -1 });
      return res.json(alerts);
    } else {
      let filtered = [...mockAlerts];
      if (severity) {
        filtered = filtered.filter(a => a.severity.toLowerCase() === severity.toLowerCase());
      }
      if (city) {
        filtered = filtered.filter(a => a.city.toLowerCase().includes(city.toLowerCase()));
      }
      if (state) {
        filtered = filtered.filter(a => a.state.toLowerCase().includes(state.toLowerCase()));
      }
      filtered.sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
      return res.json(filtered);
    }
  } catch (error) {
    console.error('Alerts GET error:', error);
    res.status(500).json({ message: 'Error retrieving active climate alerts.' });
  }
});

// POST /api/alerts (Admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, city, state, severity, temperature, heatIndex, advisoryText } = req.body;

    if (!title || !city || !state || !severity || !advisoryText) {
      return res.status(400).json({ message: 'Title, City, State, Severity, and Advisory text are required.' });
    }

    const alertData = {
      title,
      city,
      state,
      severity,
      temperature: Number(temperature || 40),
      heatIndex: Number(heatIndex || temperature + 4),
      advisoryText,
      active: true,
      issuedAt: new Date()
    };

    if (getIsConnected()) {
      const alert = await Alert.create(alertData);
      return res.status(201).json(alert);
    } else {
      const newAlert = { _id: 'alert_' + Date.now(), ...alertData };
      mockAlerts.unshift(newAlert);
      return res.status(201).json(newAlert);
    }
  } catch (error) {
    console.error('Alert create error:', error);
    res.status(500).json({ message: 'Error creating heatwave alert advisory.' });
  }
});

// PUT /api/alerts/:id (Admin edit alert)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (getIsConnected()) {
      const updated = await Alert.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) return res.status(404).json({ message: 'Alert not found.' });
      return res.json(updated);
    } else {
      const idx = mockAlerts.findIndex(a => a._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Alert not found in store.' });
      mockAlerts[idx] = { ...mockAlerts[idx], ...updateData };
      return res.json(mockAlerts[idx]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating alert advisory.' });
  }
});

// DELETE /api/alerts/:id (Admin delete alert)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      await Alert.findByIdAndDelete(id);
      return res.json({ message: 'Alert successfully revoked/deleted.' });
    } else {
      mockAlerts = mockAlerts.filter(a => a._id !== id);
      return res.json({ message: 'Alert successfully revoked/deleted.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error removing alert advisory.' });
  }
});

module.exports = router;
