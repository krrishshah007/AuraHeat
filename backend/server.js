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

app.get('/api', (req, res) => {
  res.json({
    message: '🔥 AurHeat Climate Intelligence Backend API operational on Vercel',
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 AurHeat Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
}

module.exports = app;
