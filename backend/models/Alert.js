const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  severity: { type: String, enum: ['Safe', 'Moderate', 'High', 'Extreme'], required: true },
  temperature: { type: Number, required: true },
  heatIndex: { type: Number, required: true },
  advisoryText: { type: String, required: true },
  active: { type: Boolean, default: true },
  issuedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);
