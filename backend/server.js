const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB (with resilient fallback)
connectDB();

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/prediction', require('./routes/prediction'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/feedback', require('./routes/feedback'));

// Health & Root Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AurHeat Climate Intelligence & Early Warning Platform API',
    version: '1.0.0',
    timestamp: new Date()
  });
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>AurHeat API Server</title></head>
      <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; line-height: 1.6;">
        <h1 style="color: #38bdf8;">🔥 AurHeat Climate Intelligence Backend API</h1>
        <p>Production-ready Express & MongoDB server for Heatwave Monitoring, AI Risk Prediction, and Early Warning Advisories.</p>
        <h3>Available Endpoints:</h3>
        <ul>
          <li><code>GET /api/weather</code> - Live weather & climate metrics across Indian states/cities</li>
          <li><code>POST /api/prediction</code> - AI Heatwave Risk Score calculation & recommendations engine</li>
          <li><code>GET /api/alerts</code> - Active heatwave emergency alerts & advisory notices</li>
          <li><code>POST /api/auth/login</code> & <code>POST /api/auth/signup</code> - JWT Authentication</li>
          <li><code>GET /api/health</code> - System status & health monitoring</li>
        </ul>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 AurHeat Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
