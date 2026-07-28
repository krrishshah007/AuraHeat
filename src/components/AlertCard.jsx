import React from 'react';
import { ShieldAlert, Thermometer, Flame, Clock, MapPin, Download, Send, Share2 } from 'lucide-react';
import { exportToPDF } from '../utils/exportUtils';

const AlertCard = ({ alert, onTriggerNotification }) => {
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'Extreme':
        return {
          badgeBg: 'bg-red-500/20 text-red-400 border-red-500/40',
          border: 'border-red-500/40',
          gradient: 'from-red-950/40 via-slate-900 to-slate-900',
          indicator: 'bg-red-600 animate-ping',
          text: 'text-red-400'
        };
      case 'High':
        return {
          badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          border: 'border-orange-500/40',
          gradient: 'from-orange-950/30 via-slate-900 to-slate-900',
          indicator: 'bg-orange-500',
          text: 'text-orange-400'
        };
      case 'Moderate':
        return {
          badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          border: 'border-amber-500/30',
          gradient: 'from-amber-950/20 via-slate-900 to-slate-900',
          indicator: 'bg-amber-500',
          text: 'text-amber-400'
        };
      default:
        return {
          badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          border: 'border-emerald-500/30',
          gradient: 'from-emerald-950/20 via-slate-900 to-slate-900',
          indicator: 'bg-emerald-500',
          text: 'text-emerald-400'
        };
    }
  };

  const style = getSeverityStyle(alert.severity);

  return (
    <div id={`alert-card-${alert._id}`} className={`p-6 rounded-2xl glass-panel bg-gradient-to-br ${style.gradient} border ${style.border} shadow-xl relative overflow-hidden group space-y-4`}>
      
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${style.indicator}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${style.indicator}`}></span>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${style.badgeBg}`}>
              {alert.severity} RISK ADVISORY
            </span>
          </div>
          <h3 className="text-lg font-bold text-white leading-snug group-hover:text-orange-400 transition-colors pt-1">
            {alert.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          <span>{alert.city}, {alert.state}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-red-500" />
          <div>
            <span className="text-slate-400 block text-[10px]">Ambient Temp</span>
            <span className="font-bold text-slate-100">{alert.temperature}°C</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <div>
            <span className="text-slate-400 block text-[10px]">Thermal Heat Index</span>
            <span className="font-bold text-orange-400">{alert.heatIndex}°C</span>
          </div>
        </div>
        <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
          <Clock className="w-4 h-4 text-slate-500" />
          <div>
            <span className="text-slate-400 block text-[10px]">Issued Time</span>
            <span className="text-slate-300 font-medium">
              {new Date(alert.issuedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Advisory Content */}
      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800">
        {alert.advisoryText}
      </p>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between gap-3 text-xs">
        <button
          onClick={() => exportToPDF(`alert-card-${alert._id}`, `AurHeat_Advisory_${alert.city}.pdf`)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span>Download PDF Advisory</span>
        </button>

        <button
          onClick={() => onTriggerNotification && onTriggerNotification(alert)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast Warning</span>
        </button>
      </div>

    </div>
  );
};

export default AlertCard;
