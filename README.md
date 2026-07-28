# 🔥 AurHeat — Climate Intelligence & Early Warning SaaS Platform

> **Production-Ready Full-Stack Web Application** for Heatwave Monitoring, Real-Time AI Risk Prediction, and Disaster Early Warning Advisories. Designed for Smart India Hackathon & Government Disaster Management Agencies.

---

## 🌟 Key Features

1. **Page 1 – Home (Landing Page)**: Hero section with animated heat particles, live warning ticker, statistics cards, features breakdown, NDMA partnership showcase, and testimonials.
2. **Page 2 – Live Climate Dashboard**:
   - Live Weather Metrics (Temp, Humidity, Wind Speed, Heat Index, UV Index, AQI).
   - **Interactive OpenStreetMap (Leaflet.js)** with risk color zones:
     - 🟢 Safe (< 35°C)
     - 🟡 Moderate (35°C - 40°C)
     - 🟠 High (40°C - 44°C)
     - 🔴 Extreme (≥ 44°C)
   - Recharts Suite (24h Trend, Heatwave Frequency vs Rainfall, Monthly Anomaly Area Chart, District Risk Pie Chart).
   - Filters by State/City/Date, Search bar, Refresh data, CSV & PDF export.
3. **Page 3 – AI Risk Prediction Module**:
   - Interactive ML Risk Calculator form (State, City, Temp, Humidity, Wind, Rain, UV Index).
   - Physiological Heat Risk Score (0-100%) with confidence meter.
   - Feature Weight Contributions chart & automated disaster recommendations.
   - Predictive 24h, 3-Day, and 7-Day forecast curves.
4. **Page 4 – Alerts & Early Warning Center**:
   - Real-time advisory cards with severity badges, timestamp, search, and severity filters.
   - Download Advisory PDF button & Emergency Helplines (112, 108, 1078).
   - Broadcast Notification Modal (SMS API, Email Alert, Push Broadcast).
5. **Page 5 – About & Contact**:
   - Mission, How AI Works flow diagram, Technology Stack Grid, Team Cards, FAQ Accordion, Contact Form (POST `/api/feedback`), Google Maps embed.
6. **Authentication & Admin Control**:
   - JWT Auth with bcrypt password hashing.
   - Demo Login presets (`admin@aurheat.gov.in` / `user@aurheat.com`).
   - Protected Admin Portal for alert CRUD management, weather telemetry input, user directory, and prediction history logs.

---

## 🏗️ Project Architecture

```
aurheat/
├── backend/
│   ├── config/db.js                 # MongoDB & In-Memory Fallback connection
│   ├── middleware/auth.js           # JWT & Admin verification
│   ├── models/                      # Mongoose schemas (User, WeatherData, Prediction, Alert, Feedback)
│   ├── routes/                      # API endpoints (/api/auth, /api/weather, /api/prediction, /api/alerts, /api/users, /api/feedback)
│   ├── seed/seedData.js             # Initial Indian district seed dataset
│   ├── server.js                    # Express application entry
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components font/         # Navbar, Footer, HeatMap, AlertCard, StatCard, Modal, ProtectedRoute
│   │   ├── context/                 # AuthContext & ThemeContext (Dark/Light Mode)
│   │   ├── pages/                   # Home, Dashboard, Prediction, Alerts, AboutContact, Login, Signup, Profile, AdminDashboard, NotFound
│   │   ├── utils/                   # Axios API client & CSV/PDF export helpers
│   │   ├── App.jsx                  # React Router DOM configuration
│   │   └── main.jsx
│   ├── tailwind.config.js           # Climate palette (#2563EB, #F97316, #DC2626, #22C55E)
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Optional: seeds MongoDB database if daemon is running
npm run dev      # Starts API server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:3000
```

---

## 🔑 Demo Credentials

- **Admin Account**: `admin@aurheat.gov.in` | Password: `admin123`
- **User Account**: `user@aurheat.com` | Password: `user123`
