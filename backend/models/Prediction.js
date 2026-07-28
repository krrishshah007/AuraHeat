const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  state: { type: String, required: true },
  city: { type: String, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  windSpeed: { type: Number, required: true },
  rainfall: { type: Number, required: true },
  uvIndex: { type: Number, required: true },
  riskScore: { type: Number, required: true }, // e.g. 92%
  riskLevel: { type: String, enum: ['Low', 'Moderate', 'High', 'Extreme'], required: true },
  confidenceScore: { type: Number, default: 0.94 },
  recommendations: [{ type: String }],
  forecast: {
    h24: { type: Number },
    d3: { type: Number },
    d7: { type: Number }
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);
