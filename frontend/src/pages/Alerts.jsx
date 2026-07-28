import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, Filter, Download, Send, PhoneCall, Mail, MessageSquare, Bell, CheckCircle2, RefreshCw } from 'lucide-react';
import AlertCard from '../components/AlertCard';
import Modal from '../components/Modal';
import api from '../utils/api';
import { initialAlerts } from '../data/seedData';

const Alerts = () => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filteredAlerts, setFilteredAlerts] = useState(initialAlerts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedAlertForBroadcast, setSelectedAlertForBroadcast] = useState(null);
  const [broadcastType, setBroadcastType] = useState('sms'); // 'sms', 'email', 'push'
  const [recipientContact, setRecipientContact] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/alerts');
      if (res.data && res.data.length > 0) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.log('Using initial alerts dataset.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    let result = [...alerts];
    if (searchQuery) {
      result = result.filter(a =>
        a.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedSeverity) {
      result = result.filter(a => a.severity.toLowerCase() === selectedSeverity.toLowerCase());
    }
    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
    } else if (sortBy === 'severity') {
      const severityMap = { Extreme: 4, High: 3, Moderate: 2, Safe: 1 };
      result.sort((a, b) => (severityMap[b.severity] || 0) - (severityMap[a.severity] || 0));
    }
    setFilteredAlerts(result);
  }, [searchQuery, selectedSeverity, sortBy, alerts]);

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setSelectedAlertForBroadcast(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Alerts & Early Warning Center</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Active disaster warnings, NDMA heat advisories, and emergency broadcast dispatches.
            </p>
          </div>
        </div>

        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
        >
          <RefreshCw className={`w-4 h-4 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Alerts</span>
        </button>
      </div>

      {/* Control Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active warnings by district or city..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
          >
            <option value="">All Severity Levels</option>
            <option value="Extreme">🔴 Extreme Risk</option>
            <option value="High">🟠 High Risk</option>
            <option value="Moderate">🟡 Moderate Risk</option>
            <option value="Safe">🟢 Safe</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500"
          >
            <option value="latest">Sort by Latest Time</option>
            <option value="severity">Sort by Highest Severity</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Alerts + Emergency Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Alerts Cards Column */}
        <div className="lg:col-span-8 space-y-5">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <AlertCard
                key={alert._id}
                alert={alert}
                onTriggerNotification={(a) => setSelectedAlertForBroadcast(a)}
              />
            ))
          ) : (
            <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 space-y-3">
              <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No active alerts found matching criteria.</h3>
              <p className="text-xs text-slate-500">Try adjusting your severity filter or search parameters.</p>
            </div>
          )}
        </div>

        {/* Emergency Contacts & Notifications Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Emergency Helplines Box */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 bg-slate-950/60 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-red-500" /> National Emergency Helplines
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="block text-white text-sm">112</strong>
                  <span className="text-slate-400">National Emergency Response</span>
                </div>
                <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 font-bold text-[10px]">Toll-Free</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="block text-white text-sm">108</strong>
                  <span className="text-slate-400">Medical Ambulance Services</span>
                </div>
                <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 font-bold text-[10px]">24/7 Dispatch</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="block text-white text-sm">1078</strong>
                  <span className="text-slate-400">NDMA Climate Control Room</span>
                </div>
                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 font-bold text-[10px]">Disaster HQ</span>
              </div>
            </div>
          </div>

          {/* Quick Disaster Directives */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-400" /> Standard Heatwave Protocols
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Drink Oral Rehydration Salts (ORS), lassi, or lemon water frequently.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Wear light-colored, loose cotton clothing and protect your head with a hat/cloth.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Avoid hard manual labor outdoors during 11:30 AM to 3:30 PM peak window.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Broadcast Notification Modal Placeholder */}
      <Modal
        isOpen={!!selectedAlertForBroadcast}
        onClose={() => setSelectedAlertForBroadcast(null)}
        title={`Broadcast Warning Advisory: ${selectedAlertForBroadcast?.city}`}
      >
        {selectedAlertForBroadcast && (
          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Target Advisory</span>
              <strong className="text-white text-sm">{selectedAlertForBroadcast.title}</strong>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Broadcast Channel Placeholder</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBroadcastType('sms')}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 border ${
                    broadcastType === 'sms' ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> SMS API
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastType('email')}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 border ${
                    broadcastType === 'email' ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email Alert
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastType('push')}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 border ${
                    broadcastType === 'push' ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" /> Push Broadcast
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Recipient Phone / Email / Topic</label>
              <input
                type="text"
                value={recipientContact}
                onChange={(e) => setRecipientContact(e.target.value)}
                placeholder={broadcastType === 'sms' ? '+91 9876543210' : 'district-disaster-cell@gov.in'}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            {broadcastSent ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Broadcast Successfully Triggered!
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-wider text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Trigger Emergency Dispatch
              </button>
            )}
          </form>
        )}
      </Modal>

    </div>
  );
};

export default Alerts;
