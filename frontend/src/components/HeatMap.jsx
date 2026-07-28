import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Flame, Thermometer, Droplets, Wind, AlertTriangle, Users, Clock } from 'lucide-react';

// Fix Leaflet default icon paths in React bundle
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const getRiskColor = (riskLevel, temp) => {
  if (riskLevel === 'Extreme' || temp >= 44) return '#DC2626'; // Red
  if (riskLevel === 'High' || temp >= 40) return '#F97316';    // Orange
  if (riskLevel === 'Moderate' || temp >= 35) return '#EAB308';// Yellow
  return '#22C55E'; // Green
};

const HeatMap = ({ weatherData = [], onSelectState }) => {
  // Center of India map
  const defaultCenter = [22.5937, 78.9629];
  const defaultZoom = 5;

  return (
    <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-[400] glass-panel px-4 py-2.5 rounded-xl border border-slate-700/60 shadow-lg flex items-center gap-3">
        <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide uppercase">Live Regional Heat Index Map</h4>
          <p className="text-[10px] text-slate-400">Click state markers for micro-climate risk telemetry</p>
        </div>
      </div>

      {/* Risk Legend */}
      <div className="absolute bottom-4 right-4 z-[400] glass-panel px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg text-xs space-y-1.5">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Thermal Severity Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 shadow-sm shadow-red-500"></span>
          <span className="text-slate-200 font-medium text-[11px]">Extreme (≥44°C)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500"></span>
          <span className="text-slate-200 font-medium text-[11px]">High (40°C - 44°C)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500"></span>
          <span className="text-slate-200 font-medium text-[11px]">Moderate (35°C - 40°C)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500"></span>
          <span className="text-slate-200 font-medium text-[11px]">Safe (&lt;35°C)</span>
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {weatherData.map((item) => {
          const color = getRiskColor(item.riskLevel, item.temperature);
          return (
            <React.Fragment key={item.id || item._id || item.city}>
              {/* Outer pulsing circle indicator */}
              <CircleMarker
                center={[item.latitude, item.longitude]}
                radius={item.temperature >= 44 ? 22 : 16}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.35,
                  color: color,
                  weight: 2,
                }}
              />

              {/* Core interactive marker pin */}
              <CircleMarker
                center={[item.latitude, item.longitude]}
                radius={8}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.95,
                  color: '#ffffff',
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => {
                    if (onSelectState) onSelectState(item);
                  },
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[200px] font-sans text-slate-900">
                    <div className="flex items-center justify-between border-b pb-1.5 mb-2">
                      <div>
                        <h3 className="font-bold text-base leading-none">{item.city}</h3>
                        <span className="text-xs text-slate-500 font-medium">{item.state}</span>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white"
                        style={{ backgroundColor: color }}
                      >
                        {item.riskLevel}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 font-medium"><Thermometer className="w-3.5 h-3.5 text-red-500" /> Temperature:</span>
                        <strong className="text-slate-900">{item.temperature}°C</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 font-medium"><Flame className="w-3.5 h-3.5 text-orange-500" /> Heat Index:</span>
                        <strong className="text-orange-600">{item.heatIndex}°C</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 font-medium"><Droplets className="w-3.5 h-3.5 text-blue-500" /> Humidity:</span>
                        <span>{item.humidity}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 font-medium"><Users className="w-3.5 h-3.5 text-purple-500" /> At Risk Pop.:</span>
                        <span>{(item.populationAtRisk / 100000).toFixed(1)} Lakhs</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectState && onSelectState(item)}
                      className="w-full mt-3 bg-slate-900 text-white text-xs font-semibold py-1.5 rounded hover:bg-slate-800 transition-colors"
                    >
                      View Micro-Climate Metrics
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default HeatMap;
