export const initialWeather = [
  { id: '1', state: 'Delhi', city: 'New Delhi', latitude: 28.6139, longitude: 77.2090, temperature: 44.5, humidity: 38, windSpeed: 18.5, heatIndex: 49.2, uvIndex: 11, aqi: 280, rainfall: 0, riskLevel: 'Extreme', populationAtRisk: 18500000 },
  { id: '2', state: 'Gujarat', city: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, temperature: 43.2, humidity: 42, windSpeed: 14.0, heatIndex: 47.8, uvIndex: 10, aqi: 195, rainfall: 0, riskLevel: 'High', populationAtRisk: 8200000 },
  { id: '3', state: 'Rajasthan', city: 'Jaipur', latitude: 26.9124, longitude: 75.7873, temperature: 45.1, humidity: 30, windSpeed: 21.0, heatIndex: 50.4, uvIndex: 12, aqi: 230, rainfall: 0, riskLevel: 'Extreme', populationAtRisk: 4000000 },
  { id: '4', state: 'Maharashtra', city: 'Nagpur', latitude: 21.1458, longitude: 79.0882, temperature: 42.8, humidity: 45, windSpeed: 12.5, heatIndex: 46.5, uvIndex: 9, aqi: 160, rainfall: 0, riskLevel: 'High', populationAtRisk: 2900000 },
  { id: '5', state: 'Telangana', city: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, temperature: 39.8, humidity: 55, windSpeed: 11.0, heatIndex: 43.0, uvIndex: 8, aqi: 140, rainfall: 2.5, riskLevel: 'Moderate', populationAtRisk: 6800000 },
  { id: '6', state: 'Tamil Nadu', city: 'Chennai', latitude: 13.0827, longitude: 80.2707, temperature: 38.5, humidity: 72, windSpeed: 16.0, heatIndex: 45.2, uvIndex: 9, aqi: 110, rainfall: 5.0, riskLevel: 'Moderate', populationAtRisk: 7000000 },
  { id: '7', state: 'West Bengal', city: 'Kolkata', latitude: 22.5726, longitude: 88.3639, temperature: 40.5, humidity: 68, windSpeed: 10.5, heatIndex: 48.1, uvIndex: 9, aqi: 210, rainfall: 1.2, riskLevel: 'High', populationAtRisk: 14800000 },
  { id: '8', state: 'Uttar Pradesh', city: 'Lucknow', latitude: 26.8467, longitude: 80.9462, temperature: 43.8, humidity: 36, windSpeed: 15.2, heatIndex: 47.9, uvIndex: 10, aqi: 260, rainfall: 0, riskLevel: 'Extreme', populationAtRisk: 3800000 },
  { id: '9', state: 'Bihar', city: 'Patna', latitude: 25.5941, longitude: 85.1376, temperature: 42.6, humidity: 48, windSpeed: 13.0, heatIndex: 46.8, uvIndex: 9, aqi: 240, rainfall: 0, riskLevel: 'High', populationAtRisk: 2500000 },
  { id: '10', state: 'Karnataka', city: 'Bengaluru', latitude: 12.9716, longitude: 77.5946, temperature: 32.5, humidity: 60, windSpeed: 18.0, heatIndex: 34.0, uvIndex: 6, aqi: 85, rainfall: 12.0, riskLevel: 'Safe', populationAtRisk: 12000000 }
];

export const initialAlerts = [
  {
    _id: 'alert_1',
    title: 'RED ALERT: Severe Heatwave Emergency in Northern Plains',
    city: 'Jaipur',
    state: 'Rajasthan',
    severity: 'Extreme',
    temperature: 45.1,
    heatIndex: 50.4,
    advisoryText: 'Red alert issued for Jaipur and adjoining districts. Ambient temperatures exceeding 45°C with severe heat index (>50°C). Outdoor manual labor suspended between 11:00 AM and 4:00 PM. Emergency cooling centers operational.',
    active: true,
    issuedAt: new Date().toISOString()
  },
  {
    _id: 'alert_2',
    title: 'ORANGE ALERT: High Temperature Warning for Capital Region',
    city: 'New Delhi',
    state: 'Delhi',
    severity: 'Extreme',
    temperature: 44.5,
    heatIndex: 49.2,
    advisoryText: 'High risk heat condition in NCR. Vulnerable population (children and seniors) advised to remain indoors. Hydration distribution points activated across major transit hubs.',
    active: true,
    issuedAt: new Date().toISOString()
  },
  {
    _id: 'alert_3',
    title: 'ORANGE ALERT: Extreme Thermal Discomfort in Eastern UP & Bihar',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    severity: 'High',
    temperature: 43.8,
    heatIndex: 47.9,
    advisoryText: 'Elevated humidity combined with 43°C temperatures creating severe physiological stress. Avoid direct sunlight exposure. Water tankers dispatched to high-density settlements.',
    active: true,
    issuedAt: new Date().toISOString()
  }
];
