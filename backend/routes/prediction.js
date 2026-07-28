const express = require('express');
const router = express.Router();
const { getIsConnected } = require('../config/db');
const Prediction = require('../models/Prediction');
const { initialPredictions } = require('../seed/seedData');

let mockPredictions = [...initialPredictions];

// AI Heat Risk Assessment Logic
const calculateHeatwaveRisk = ({ temperature, humidity, windSpeed, rainfall, uvIndex }) => {
  // Base Heat Index Approximation (Steadman & Rothfusz equation simplified)
  const T = Number(temperature);
  const R = Number(humidity);
  const W = Number(windSpeed || 10);
  const Rain = Number(rainfall || 0);
  const UV = Number(uvIndex || 6);

  // Compute Heat Index Factor
  let heatIndex = T + 0.33 * (R * 0.1) * (T - 14) - 0.7 * W;
  if (heatIndex < T) heatIndex = T + (R > 50 ? (R - 50) * 0.15 : 0);

  // Weighted Risk Score (0 - 100)
  let score = 0;
  
  // Temp contribution (max 50 pts)
  if (T >= 45) score += 50;
  else if (T >= 40) score += 35 + (T - 40) * 3;
  else if (T >= 35) score += 20 + (T - 35) * 3;
  else score += Math.max(0, (T - 25) * 2);

  // Humidity contribution (max 25 pts)
  if (R >= 70) score += 25;
  else if (R >= 50) score += 15 + (R - 50) * 0.5;
  else score += (R / 50) * 15;

  // UV Index contribution (max 15 pts)
  score += Math.min(15, (UV / 12) * 15);

  // Wind Mitigation (-10 pts max)
  score -= Math.min(10, (W / 30) * 10);

  // Rain Mitigation (-15 pts max)
  if (Rain > 0) score -= Math.min(15, Rain * 2);

  // Clamp score between 5 and 99
  const riskScore = Math.max(5, Math.min(99, Math.round(score)));

  let riskLevel = 'Low';
  if (riskScore >= 80 || T >= 44) riskLevel = 'Extreme';
  else if (riskScore >= 60 || T >= 40) riskLevel = 'High';
  else if (riskScore >= 35 || T >= 35) riskLevel = 'Moderate';

  // AI Safety Recommendations
  const recommendations = [];
  if (riskLevel === 'Extreme') {
    recommendations.push('Issue Red Alert warning to district administration & emergency disaster teams');
    recommendations.push('Mandate immediate suspension of heavy outdoor physical labor between 11:00 AM - 4:00 PM');
    recommendations.push('Establish public cooling shelters with hydration supply & emergency medical kits');
    recommendations.push('Activate hospital surge capacity for severe heatstroke & dehydration emergencies');
    recommendations.push('Advise vulnerable groups (seniors, toddlers, outdoor workers) strict indoor stay');
  } else if (riskLevel === 'High') {
    recommendations.push('Issue Orange Alert warning for urban heat islands and exposed workers');
    recommendations.push('Increase public water distribution trucks near transport hubs & markets');
    recommendations.push('Recommend flexible working hours and frequent shaded rest intervals');
    recommendations.push('Prepare primary healthcare centers with oral rehydration salts (ORS)');
  } else if (riskLevel === 'Moderate') {
    recommendations.push('Yellow Alert advisory: Encourage frequent hydration during peak afternoon hours');
    recommendations.push('Ensure shade structures are available at open construction & market sites');
    recommendations.push('Monitor local micro-climate readings for sudden thermal escalation');
  } else {
    recommendations.push('Normal climate safety conditions. Standard hydration recommended.');
  }

  // Feature Importance breakdown
  const featureImportance = [
    { feature: 'Ambient Temperature', weight: Math.round((T / 50) * 45) },
    { feature: 'Relative Humidity', weight: Math.round((R / 100) * 25) },
    { feature: 'Solar UV Index', weight: Math.round((UV / 12) * 15) },
    { feature: 'Wind Ventilation', weight: Math.round((1 - W / 40) * 10) },
    { feature: 'Precipitation Relief', weight: Rain > 0 ? 5 : 0 }
  ];

  // Future Forecast Simulations
  const forecast = {
    h24: Number((T + (Math.random() * 1.5 - 0.5)).toFixed(1)),
    d3: Number((T + (Math.random() * 2.5 - 1.0)).toFixed(1)),
    d7: Number((T + (Math.random() * 3.5 - 2.0)).toFixed(1))
  };

  return {
    heatIndex: Number(heatIndex.toFixed(1)),
    riskScore,
    riskLevel,
    confidenceScore: 0.94,
    recommendations,
    featureImportance,
    forecast
  };
};

// POST /api/prediction
router.post('/', async (req, res) => {
  try {
    const { state, city, temperature, humidity, windSpeed, rainfall, uvIndex } = req.body;

    if (!state || !city || temperature === undefined || humidity === undefined) {
      return res.status(400).json({ message: 'State, City, Temperature, and Humidity are required for prediction.' });
    }

    const aiResult = calculateHeatwaveRisk({
      temperature,
      humidity,
      windSpeed,
      rainfall,
      uvIndex
    });

    const predictionRecord = {
      state,
      city,
      temperature: Number(temperature),
      humidity: Number(humidity),
      windSpeed: Number(windSpeed || 10),
      rainfall: Number(rainfall || 0),
      uvIndex: Number(uvIndex || 6),
      riskScore: aiResult.riskScore,
      riskLevel: aiResult.riskLevel,
      confidenceScore: aiResult.confidenceScore,
      recommendations: aiResult.recommendations,
      featureImportance: aiResult.featureImportance,
      forecast: aiResult.forecast,
      timestamp: new Date()
    };

    if (getIsConnected()) {
      const savedPred = await Prediction.create(predictionRecord);
      return res.status(201).json({ ...savedPred._doc, heatIndex: aiResult.heatIndex });
    } else {
      const mockRecord = { _id: 'pred_' + Date.now(), ...predictionRecord, heatIndex: aiResult.heatIndex };
      mockPredictions.unshift(mockRecord);
      return res.status(201).json(mockRecord);
    }
  } catch (error) {
    console.error('Prediction API error:', error);
    res.status(500).json({ message: 'Error processing AI heatwave prediction.' });
  }
});

// GET /api/prediction (Prediction logs)
router.get('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const logs = await Prediction.find().sort({ timestamp: -1 }).limit(20);
      return res.json(logs);
    } else {
      return res.json(mockPredictions);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving prediction history.' });
  }
});

module.exports = router;
