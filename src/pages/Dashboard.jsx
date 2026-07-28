import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Activity, Search, RefreshCw, Download, Filter, MapPin, Thermometer, Droplets, Wind, Sun, ShieldAlert, Sparkles, Clock, Eye } from 'lucide-react';
import HeatMap from '../components/HeatMap';
import Modal from '../components/Modal';
import api from '../utils/api';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import { initialWeather } from '../data/seedData';

const tempTrendData = [
  { time: '06:00', temp: 34.2, heatIndex: 36.5, humidity: 55 },
  { time: '09:00', temp: 38.0, heatIndex: 41.2, humidity: 48 },
  { time: '12:00', temp: 43.5, heatIndex: 48.0, humidity: 36 },
  { time: '15:00', temp: 45.1, heatIndex: 50.4, humidity: 30 },
  { time: '18:00', temp: 41.8, heatIndex: 45.9, humidity: 38 },
  { time: '21:00', temp: 37.6, heatIndex: 40.1, humidity: 45 },
  { time: '00:00', temp: 35.0, heatIndex: 37.2, humidity: 50 },
];

const rainfallComparisonData = [
  { month: 'Mar', heatwaves: 4, rainfall: 15 },
  { month: 'Apr', heatwaves: 12, rainfall: 8 },
  { month: 'May', heatwaves: 28, rainfall: 2 },
  { month: 'Jun', heatwaves: 35, rainfall: 18 },
  { month: 'Jul', heatwaves: 18, rainfall: 85 },
  { month: 'Aug', heatwaves: 6, rainfall: 120 },
];

const anomalyData = [
  { year: '2021', anomaly: +0.45 },
  { year: '2022', anomaly: +0.78 },
  { year: '2023', anomaly: +0.92 },
  { year: '2024', anomaly: +1.15 },
  { year: '2025', anomaly: +1.40 },
  { year: '2026', anomaly: +1.85 },
];

const COLORS = ['#DC2626', '#F97316', '#EAB308', '#22C55E'];

const Dashboard = () => {
  const [weatherList, setWeatherList] = useState(initialWeather);
  const [filteredWeather, setFilteredWeather] = useState(initialWeather);
  const [selectedStateFilter, setSelectedStateFilter] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateDetail, setSelectedStateDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date().toLocaleTimeString());

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/weather');
      if (res.data && res.data.length > 0) {
        setWeatherList(res.data);
      }
    } catch (err) {
      console.log('Using initial weather dataset.');
    } finally {
      setLoading(false);
      setLastUpdatedTime(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = [...weatherList];
    if (selectedStateFilter) {
      result = result.filter(w => w.state.toLowerCase() === selectedStateFilter.toLowerCase());
    }
    if (selectedCityFilter) {
      result = result.filter(w => w.city.toLowerCase() === selectedCityFilter.toLowerCase());
    }
    if (searchQuery) {
      result = result.filter(w =>
        w.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredWeather(result);
  }, [selectedStateFilter, selectedCityFilter, searchQuery, weatherList]);

  // Summary Metrics
  const avgTemp = (filteredWeather.reduce((acc, curr) => acc + curr.temperature, 0) / (filteredWeather.length || 1)).toFixed(1);
  const maxTempObj = filteredWeather.reduce((prev, current) => (prev.temperature > current.temperature) ? prev : current, filteredWeather[0] || initialWeather[0]);
  const totalPeopleAtRisk = filteredWeather.reduce((acc, curr) => acc + (curr.populationAtRisk || 0), 0);
  const extremeCount = filteredWeather.filter(w => w.riskLevel === 'Extreme' || w.temperature >= 44).length;

  const pieData = [
    { name: 'Extreme Risk', value: filteredWeather.filter(w => w.riskLevel === 'Extreme' || w.temperature >= 44).length },
    { name: 'High Risk', value: filteredWeather.filter(w => w.riskLevel === 'High' || (w.temperature >= 40 && w.temperature < 44)).length },
    { name: 'Moderate Risk', value: filteredWeather.filter(w => w.riskLevel === 'Moderate' || (w.temperature >= 35 && w.temperature < 40)).length },
    { name: 'Safe', value: filteredWeather.filter(w => w.riskLevel === 'Safe' || w.temperature < 35).length },
  ];

  return (
    <div id="dashboard-container" className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-orange-500 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Live Climate Monitoring Dashboard</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time heat index telemetry across Indian districts • Last refreshed: <span className="text-slate-200 font-semibold">{lastUpdatedTime}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchWeatherData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>

          <button
            onClick={() => exportToCSV(filteredWeather, 'AurHeat_Climate_Telemetry.csv')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl glass-panel bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Average Ambient Temp</span>
            <Thermometer className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-3xl font-black text-white">{avgTemp}°C</div>
          <p className="text-[11px] text-slate-400">Across {filteredWeather.length} monitored cities</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-gradient-to-br from-red-950/40 via-slate-950 to-slate-950 border border-red-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-red-400 font-bold">
            <span>Highest Temp Record</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-black text-red-400">{maxTempObj?.temperature}°C</div>
          <p className="text-[11px] text-slate-400">{maxTempObj?.city}, {maxTempObj?.state} (Heat Index: {maxTempObj?.heatIndex}°C)</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Population at Risk</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-400">{(totalPeopleAtRisk / 10000000).toFixed(2)} Cr</div>
          <p className="text-[11px] text-slate-400">High thermal stress exposure</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Extreme Hazard Zones</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{extremeCount} Districts</div>
          <p className="text-[11px] text-slate-400">Under active Red / Orange advisories</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search state or city..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedStateFilter}
            onChange={(e) => setSelectedStateFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
          >
            <option value="">All Indian States</option>
            {Array.from(new Set(weatherList.map(w => w.state))).map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <select
            value={selectedCityFilter}
            onChange={(e) => setSelectedCityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
          >
            <option value="">All Cities</option>
            {Array.from(new Set(weatherList.map(w => w.city))).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {(selectedStateFilter || selectedCityFilter || searchQuery) && (
            <button
              onClick={() => { setSelectedStateFilter(''); setSelectedCityFilter(''); setSearchQuery(''); }}
              className="text-xs text-orange-400 font-bold hover:underline shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Map */}
      <HeatMap
        weatherData={filteredWeather}
        onSelectState={(stateData) => setSelectedStateDetail(stateData)}
      />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: 24-Hour Temperature & Heat Index Trend */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">24-Hour Diurnal Thermal Strain Trend</h3>
            <span className="text-xs text-slate-400">Peak Heat at 15:00 hrs</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} unit="°C" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="temp" name="Ambient Temp (°C)" stroke="#F97316" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="heatIndex" name="Heat Index (°C)" stroke="#DC2626" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Heatwave Frequency vs Rainfall Comparison */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Heatwaves vs Monthly Monsoon Rainfall</h3>
            <span className="text-xs text-slate-400">2026 Season Analysis</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rainfallComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                <Legend />
                <Bar dataKey="heatwaves" name="Heatwave Days" fill="#DC2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rainfall" name="Rainfall (mm)" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Monthly Climate Anomaly Trend */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Decadal Land Surface Anomaly Trend</h3>
            <span className="text-xs text-red-400 font-bold">+1.85°C Deviation</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={anomalyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} unit="°C" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                <Area type="monotone" dataKey="anomaly" name="Thermal Anomaly (°C)" stroke="#F97316" fill="#F97316" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Regional Risk Severity Distribution */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">District Risk Level Breakdown</h3>
            <span className="text-xs text-slate-400">Current Active Data</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Micro-Climate Metric State Details Modal */}
      <Modal
        isOpen={!!selectedStateDetail}
        onClose={() => setSelectedStateDetail(null)}
        title={`Micro-Climate Telemetry: ${selectedStateDetail?.city}, ${selectedStateDetail?.state}`}
      >
        {selectedStateDetail && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-widest block font-bold">Severity Status</span>
                <span className="text-xl font-extrabold text-white">{selectedStateDetail.riskLevel} Thermal Hazard</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-orange-500">{selectedStateDetail.temperature}°C</span>
                <span className="text-xs text-slate-400 block">Heat Index: {selectedStateDetail.heatIndex}°C</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Relative Humidity</span>
                <strong className="text-slate-100 text-sm">{selectedStateDetail.humidity}%</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Wind Velocity</span>
                <strong className="text-slate-100 text-sm">{selectedStateDetail.windSpeed} km/h</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Solar UV Index</span>
                <strong className="text-purple-400 text-sm">{selectedStateDetail.uvIndex} / 12</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Air Quality (AQI)</span>
                <strong className="text-amber-400 text-sm">{selectedStateDetail.aqi} AQI</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Precipitation</span>
                <strong className="text-blue-400 text-sm">{selectedStateDetail.rainfall} mm</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Population Exposure</span>
                <strong className="text-slate-100 text-sm">{(selectedStateDetail.populationAtRisk / 100000).toFixed(1)} Lakhs</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs space-y-2">
              <h4 className="font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Advisory Action Directives
              </h4>
              <p className="text-slate-300 leading-relaxed">
                High thermal strain detected for {selectedStateDetail.city}. Maintain hydration, avoid physical labor during peak hours, and check elderly population.
              </p>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default Dashboard;
