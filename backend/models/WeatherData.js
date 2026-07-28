const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  state: { type: String, required: true },
  city: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  windSpeed: { type: Number, required: true },
  heatIndex: { type: Number, required: true },
  uvIndex: { type: Number, required: true },
  aqi: { type: Number, required: true },
  rainfall: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['Safe', 'Moderate', 'High', 'Extreme'], default: 'Safe' },
  populationAtRisk: { type: Number, default: 100000 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeatherData', weatherDataSchema);
