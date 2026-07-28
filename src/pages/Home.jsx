import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ShieldAlert, Cpu, Activity, Users, MapPin, ArrowRight, CheckCircle2, Award, Zap, ChevronRight, BarChart3, Globe2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import api from '../utils/api';

const Home = () => {
  const [stats, setStats] = useState({
    citiesMonitored: 12,
    populationAtRisk: '8.4 Cr',
    activeAlerts: 4,
    heatwaveEvents: 142
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [weatherRes, alertsRes] = await Promise.all([
          api.get('/weather'),
          api.get('/alerts')
        ]);
        if (weatherRes.data && weatherRes.data.length) {
          const totalPop = weatherRes.data.reduce((acc, curr) => acc + (curr.populationAtRisk || 0), 0);
          setStats(prev => ({
            ...prev,
            citiesMonitored: weatherRes.data.length,
            populationAtRisk: (totalPop / 10000000).toFixed(1) + ' Cr',
            activeAlerts: alertsRes.data ? alertsRes.data.length : 4
          }));
        }
      } catch (err) {
        console.log('Using default home stats.');
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 space-y-24 pb-20 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Glow ambient background graphics */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/20 via-orange-600/30 to-red-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Live Heatwave Emergency Ticker */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel bg-gradient-to-r from-red-500/10 via-orange-500/10 to-transparent border border-red-500/30 shadow-lg text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-bold text-red-400 uppercase tracking-wider">Live Telemetry Active</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-200 font-medium">Extreme Thermal Alert: Northern Plains & NCR Region (45.1°C)</span>
            <Link to="/alerts" className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-0.5 ml-1">
              View Advisories <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Hero Heading & Copy */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Climate Intelligence for <br />
            <span className="gradient-text">Heatwave Monitoring & Early Warning</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
            A state-of-the-art SaaS platform empowering disaster management agencies, municipal authorities, and citizens with real-time satellite telemetry, AI risk scoring, and automated emergency advisories.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-95 text-white font-bold text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 group transition-all"
            >
              <Activity className="w-5 h-5" />
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/prediction"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-base border border-slate-700/80 flex items-center justify-center gap-2 transition-all"
            >
              <Cpu className="w-5 h-5 text-orange-400" />
              <span>Check AI Heat Risk</span>
            </Link>
          </div>
        </div>

        {/* Stats Section Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Heatwave Events Logged"
            value={stats.heatwaveEvents}
            unit="Incidents"
            subtitle="Monitored since 2026 season"
            icon={Flame}
            color="red"
            badge="Critical"
          />
          <StatCard
            title="Population at Risk"
            value={stats.populationAtRisk}
            subtitle="High thermal vulnerability"
            icon={Users}
            color="orange"
            trend="+12.4% vs 2025"
          />
          <StatCard
            title="Cities Monitored"
            value={stats.citiesMonitored}
            unit="Districts"
            subtitle="Real-time telemetry coverage"
            icon={MapPin}
            color="blue"
            badge="Active"
          />
          <StatCard
            title="Active Early Advisories"
            value={stats.activeAlerts}
            unit="Advisories"
            subtitle="Emergency NDMA dispatches"
            icon={ShieldAlert}
            color="emerald"
          />
        </div>

      </section>

      {/* 2. AI PREDICTION HIGHLIGHT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl glass-panel bg-gradient-to-r from-slate-900 via-slate-900/90 to-orange-950/30 border border-slate-800 relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Predictive Micro-Climate Intelligence
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              AI-Powered Risk Scoring & 7-Day Forecasting Engine
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Our machine learning algorithm analyzes relative humidity, wind speed vectoring, solar radiation UV indices, and land surface temperature to calculate precise physiological risk scores (0-100%).
            </p>

            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Steadman & Rothfusz Heat Index Mathematical Modeling</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Automated Disaster Action Directives for Municipal Bodies</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>24-Hour, 3-Day & 7-Day Micro-Climate Forecast Curves</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/prediction"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all"
              >
                <span>Launch Prediction Simulator</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Graphic Card Preview */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-bold text-white">Jaipur District, Rajasthan</span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-xs font-black bg-red-500/20 text-red-400 border border-red-500/30">96% EXTREME RISK</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Thermal Strain Probability Score</span>
                <span className="font-bold text-red-400">96.4%</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 h-full w-[96%]"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Ambient Temp</span>
                <strong className="text-white text-base">45.1°C</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Heat Index</span>
                <strong className="text-orange-400 text-base">50.4°C</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">UV Index</span>
                <strong className="text-purple-400 text-base">12 Extreme</strong>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. PLATFORM FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Platform Capabilities</h2>
          <p className="text-slate-400 text-sm sm:text-base">Comprehensive climate monitoring built for disaster response teams and city planners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Interactive OpenStreetMap</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Color-coded regional heat zone markers across Indian states with micro-climate detail popups and population vulnerability tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Early Warning Advisories</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Real-time emergency broadcast center supporting instant PDF advisory downloads, SMS, Email, and Push notification triggers.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Recharts Analytics Suite</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Granular temperature trends, heatwave occurrence frequencies, rainfall comparisons, and monthly climate anomaly distributions.
            </p>
          </div>
        </div>
      </section>

      {/* 4. GOVERNMENT INITIATIVES & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl glass-panel bg-slate-900 border border-slate-800 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Resilience Standards</span>
              <h3 className="text-2xl font-bold text-white">National Heat Action Plan Integration</h3>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              <span className="text-xs font-semibold text-slate-300">Certified for Smart India Hackathon & Government Implementation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <p className="italic text-slate-300">
                "AurHeat's early warning predictions allowed our municipal disaster response team in Rajasthan to dispatch water tankers and establish cooling centers 48 hours prior to severe heatwave spikes."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center text-xs">ND</div>
                <div>
                  <strong className="block text-white text-xs">Dr. R. K. Saxena</strong>
                  <span className="text-[11px] text-slate-500">State Disaster Management Cell</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <p className="italic text-slate-300">
                "The physiological risk scoring equation combined with automated PDF advisory downloads streamlines our public safety announcements during peak summer months."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-blue-400 font-bold flex items-center justify-center text-xs">CR</div>
                <div>
                  <strong className="block text-white text-xs">Priya Mukherjee</strong>
                  <span className="text-[11px] text-slate-500">Urban Climate Policy Researcher</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
