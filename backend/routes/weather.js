const express = require('express');
const router = express.Router();
const { getIsConnected } = require('../config/db');
const WeatherData = require('../models/WeatherData');
const { initialWeather } = require('../seed/seedData');
const { auth, adminOnly } = require('../middleware/auth');

let mockWeather = [...initialWeather];

// GET /api/weather
router.get('/', async (req, res) => {
  try {
    const { state, city, riskLevel } = req.query;

    if (getIsConnected()) {
      let filter = {};
      if (state) filter.state = new RegExp(state, 'i');
      if (city) filter.city = new RegExp(city, 'i');
      if (riskLevel) filter.riskLevel = riskLevel;

      const data = await WeatherData.find(filter).sort({ temperature: -1 });
      return res.json(data);
    } else {
      let filtered = [...mockWeather];
      if (state) {
        filtered = filtered.filter(w => w.state.toLowerCase().includes(state.toLowerCase()));
      }
      if (city) {
        filtered = filtered.filter(w => w.city.toLowerCase().includes(city.toLowerCase()));
      }
      if (riskLevel) {
        filtered = filtered.filter(w => w.riskLevel.toLowerCase() === riskLevel.toLowerCase());
      }
      filtered.sort((a, b) => b.temperature - a.temperature);
      return res.json(filtered);
    }
  } catch (error) {
    console.error('Weather fetch error:', error);
    res.status(500).json({ message: 'Error retrieving climate weather dataset.' });
  }
});

// POST /api/weather (Admin add or update weather data)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { state, city, latitude, longitude, temperature, humidity, windSpeed, heatIndex, uvIndex, aqi, rainfall, riskLevel, populationAtRisk } = req.body;

    if (!state || !city || temperature === undefined) {
      return res.status(400).json({ message: 'State, city, and temperature are required fields.' });
    }

    const calculatedRiskLevel = riskLevel || (temperature >= 44 ? 'Extreme' : temperature >= 40 ? 'High' : temperature >= 35 ? 'Moderate' : 'Safe');

    if (getIsConnected()) {
      const weatherRecord = await WeatherData.findOneAndUpdate(
        { state, city },
        {
          latitude: latitude || 20.5937,
          longitude: longitude || 78.9629,
          temperature,
          humidity: humidity || 40,
          windSpeed: windSpeed || 15,
          heatIndex: heatIndex || temperature + 3,
          uvIndex: uvIndex || 8,
          aqi: aqi || 150,
          rainfall: rainfall || 0,
          riskLevel: calculatedRiskLevel,
          populationAtRisk: populationAtRisk || 1000000,
          lastUpdated: new Date()
        },
        { new: true, upsert: true }
      );
      return res.status(201).json(weatherRecord);
    } else {
      const existingIdx = mockWeather.findIndex(w => w.state.toLowerCase() === state.toLowerCase() && w.city.toLowerCase() === city.toLowerCase());
      const newRecord = {
        id: existingIdx >= 0 ? mockWeather[existingIdx].id : 'w_' + Date.now(),
        state,
        city,
        latitude: latitude || 20.5937,
        longitude: longitude || 78.9629,
        temperature: Number(temperature),
        humidity: Number(humidity || 40),
        windSpeed: Number(windSpeed || 15),
        heatIndex: Number(heatIndex || temperature + 3),
        uvIndex: Number(uvIndex || 8),
        aqi: Number(aqi || 150),
        rainfall: Number(rainfall || 0),
        riskLevel: calculatedRiskLevel,
        populationAtRisk: Number(populationAtRisk || 1000000),
        lastUpdated: new Date()
      };

      if (existingIdx >= 0) {
        mockWeather[existingIdx] = newRecord;
      } else {
        mockWeather.push(newRecord);
      }
      return res.status(201).json(newRecord);
    }
  } catch (error) {
    console.error('Add weather error:', error);
    res.status(500).json({ message: 'Error adding weather data.' });
  }
});

module.exports = router;
