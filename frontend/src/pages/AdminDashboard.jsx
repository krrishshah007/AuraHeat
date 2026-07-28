import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Edit3, RefreshCw, Users, AlertTriangle, Thermometer, Cpu, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import Modal from '../components/Modal';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts', 'weather', 'users', 'predictions'
  const [alerts, setAlerts] = useState([]);
  const [weatherList, setWeatherList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [predictionsList, setPredictionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Modals state
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [alertForm, setAlertForm] = useState({
    title: '',
    city: '',
    state: '',
    severity: 'Extreme',
    temperature: 44.5,
    heatIndex: 49.2,
    advisoryText: ''
  });

  const [weatherModalOpen, setWeatherModalOpen] = useState(false);
  const [weatherForm, setWeatherForm] = useState({
    state: 'Delhi',
    city: 'New Delhi',
    temperature: 44.5,
    humidity: 38,
    windSpeed: 18.5,
    populationAtRisk: 18500000
  });

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [alertsRes, weatherRes, usersRes, predRes] = await Promise.allSettled([
        api.get('/alerts'),
        api.get('/weather'),
        api.get('/users'),
        api.get('/prediction')
      ]);

      if (alertsRes.status === 'fulfilled') setAlerts(alertsRes.value.data || []);
      if (weatherRes.status === 'fulfilled') setWeatherList(weatherRes.value.data || []);
      if (usersRes.status === 'fulfilled') setUsersList(usersRes.value.data || []);
      if (predRes.status === 'fulfilled') setPredictionsList(predRes.value.data || []);
    } catch (err) {
      console.log('Error loading admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Alert Save / Create / Update
  const handleSaveAlert = async (e) => {
    e.preventDefault();
    try {
      if (editingAlert) {
        await api.put(`/alerts/${editingAlert._id}`, alertForm);
        setSuccessMsg('Alert advisory updated successfully!');
      } else {
        await api.post('/alerts', alertForm);
        setSuccessMsg('New alert advisory published!');
      }
      setAlertModalOpen(false);
      setEditingAlert(null);
      loadAdminData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Alert Delete
  const handleDeleteAlert = async (id) => {
    if (!window.confirm('Are you sure you want to revoke and delete this emergency alert advisory?')) return;
    try {
      await api.delete(`/alerts/${id}`);
      setSuccessMsg('Alert advisory revoked.');
      loadAdminData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Add Weather Record
  const handleSaveWeather = async (e) => {
    e.preventDefault();
    try {
      await api.post('/weather', weatherForm);
      setSuccessMsg('District weather entry updated!');
      setWeatherModalOpen(false);
      loadAdminData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Admin Header */}
      <div className="glass-panel p-6 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/30 via-slate-900 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Government Admin Command Center</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">SECURE ACCESS</span>
            </div>
            <p className="text-xs text-slate-400">Manage heatwave advisories, district telemetry streams, and system users.</p>
          </div>
        </div>

        <button
          onClick={loadAdminData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'alerts' ? 'bg-red-500 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> Alert Management ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab('weather')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'weather' ? 'bg-orange-500 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <Thermometer className="w-4 h-4" /> Weather Telemetry ({weatherList.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> Platform Users ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'predictions' ? 'bg-purple-500 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" /> Prediction History ({predictionsList.length})
        </button>
      </div>

      {/* TAB 1: ALERTS MANAGEMENT */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Active Early Warning Advisories</h3>
            <button
              onClick={() => {
                setEditingAlert(null);
                setAlertForm({ title: '', city: '', state: '', severity: 'Extreme', temperature: 44.5, heatIndex: 49.2, advisoryText: '' });
                setAlertModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
            >
              <Plus className="w-4 h-4" /> Add Emergency Alert
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {alerts.map((alert) => (
              <div key={alert._id} className="p-4 rounded-xl glass-panel border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                      {alert.severity}
                    </span>
                    <strong className="text-white text-sm">{alert.title}</strong>
                  </div>
                  <p className="text-xs text-slate-400">{alert.city}, {alert.state} • Temp: {alert.temperature}°C (Heat Index: {alert.heatIndex}°C)</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingAlert(alert);
                      setAlertForm({
                        title: alert.title,
                        city: alert.city,
                        state: alert.state,
                        severity: alert.severity,
                        temperature: alert.temperature,
                        heatIndex: alert.heatIndex,
                        advisoryText: alert.advisoryText
                      });
                      setAlertModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAlert(alert._id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: WEATHER TELEMETRY INPUT */}
      {activeTab === 'weather' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">District Weather Telemetry Directory</h3>
            <button
              onClick={() => setWeatherModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
            >
              <Plus className="w-4 h-4" /> Add / Update Weather Entry
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">District / City</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Temp (°C)</th>
                  <th className="p-3">Humidity (%)</th>
                  <th className="p-3">Heat Index</th>
                  <th className="p-3">Risk Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                {weatherList.map((item) => (
                  <tr key={item.id || item._id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">{item.city}</td>
                    <td className="p-3">{item.state}</td>
                    <td className="p-3 font-semibold text-orange-400">{item.temperature}°C</td>
                    <td className="p-3">{item.humidity}%</td>
                    <td className="p-3 font-semibold text-red-400">{item.heatIndex}°C</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700">
                        {item.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USERS LIST */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Platform Registered Users</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {usersList.map((usr) => (
              <div key={usr._id} className="p-4 rounded-xl glass-panel border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-white text-sm block">{usr.name}</strong>
                  <span className="text-xs text-slate-400 block">{usr.email}</span>
                  <span className="text-[11px] text-slate-500">{usr.organization || 'Individual User'}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${usr.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {usr.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PREDICTIONS HISTORY */}
      {activeTab === 'predictions' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Recent AI Prediction Queries</h3>
          <div className="space-y-3 text-xs">
            {predictionsList.map((pred) => (
              <div key={pred._id} className="p-4 rounded-xl glass-panel border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-white text-sm block">{pred.city}, {pred.state}</strong>
                  <span className="text-slate-400">Temp: {pred.temperature}°C • Hum: {pred.humidity}%</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-orange-400 block">{pred.riskScore}% Risk</span>
                  <span className="text-[10px] text-slate-500">{new Date(pred.timestamp || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Alert Add/Edit */}
      <Modal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        title={editingAlert ? 'Edit Alert Advisory' : 'Create New Emergency Heat Advisory'}
      >
        <form onSubmit={handleSaveAlert} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Advisory Title</label>
            <input
              type="text"
              value={alertForm.title}
              onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">City</label>
              <input
                type="text"
                value={alertForm.city}
                onChange={(e) => setAlertForm({ ...alertForm, city: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">State</label>
              <input
                type="text"
                value={alertForm.state}
                onChange={(e) => setAlertForm({ ...alertForm, state: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Severity</label>
              <select
                value={alertForm.severity}
                onChange={(e) => setAlertForm({ ...alertForm, severity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500"
              >
                <option value="Extreme">Extreme</option>
                <option value="High">High</option>
                <option value="Moderate">Moderate</option>
                <option value="Safe">Safe</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Temp (°C)</label>
              <input
                type="number"
                step="0.1"
                value={alertForm.temperature}
                onChange={(e) => setAlertForm({ ...alertForm, temperature: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Heat Index (°C)</label>
              <input
                type="number"
                step="0.1"
                value={alertForm.heatIndex}
                onChange={(e) => setAlertForm({ ...alertForm, heatIndex: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Full Advisory Directives</label>
            <textarea
              rows="4"
              value={alertForm.advisoryText}
              onChange={(e) => setAlertForm({ ...alertForm, advisoryText: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-orange-500/20"
          >
            Publish Advisory Notice
          </button>
        </form>
      </Modal>

      {/* Modal: Weather Add */}
      <Modal
        isOpen={weatherModalOpen}
        onClose={() => setWeatherModalOpen(false)}
        title="Add / Update District Weather Entry"
      >
        <form onSubmit={handleSaveWeather} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">State</label>
              <input
                type="text"
                value={weatherForm.state}
                onChange={(e) => setWeatherForm({ ...weatherForm, state: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">City / District</label>
              <input
                type="text"
                value={weatherForm.city}
                onChange={(e) => setWeatherForm({ ...weatherForm, city: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={weatherForm.temperature}
                onChange={(e) => setWeatherForm({ ...weatherForm, temperature: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Humidity (%)</label>
              <input
                type="number"
                value={weatherForm.humidity}
                onChange={(e) => setWeatherForm({ ...weatherForm, humidity: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-orange-500/20"
          >
            Save Telemetry Record
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default AdminDashboard;
