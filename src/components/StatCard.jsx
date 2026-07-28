import React from 'react';

const StatCard = ({ title, value, unit = '', subtitle, icon: Icon, color = 'blue', trend, badge }) => {
  const colorStyles = {
    blue: {
      bg: 'from-blue-500/10 via-blue-600/5 to-transparent',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/10 text-blue-400',
      valueColor: 'text-blue-400',
    },
    orange: {
      bg: 'from-orange-500/10 via-orange-600/5 to-transparent',
      border: 'border-orange-500/20',
      iconBg: 'bg-orange-500/10 text-orange-400',
      valueColor: 'text-orange-400',
    },
    red: {
      bg: 'from-red-500/10 via-red-600/5 to-transparent',
      border: 'border-red-500/20',
      iconBg: 'bg-red-500/10 text-red-400',
      valueColor: 'text-red-400',
    },
    emerald: {
      bg: 'from-emerald-500/10 via-emerald-600/5 to-transparent',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      valueColor: 'text-emerald-400',
    },
    purple: {
      bg: 'from-purple-500/10 via-purple-600/5 to-transparent',
      border: 'border-purple-500/20',
      iconBg: 'bg-purple-500/10 text-purple-400',
      valueColor: 'text-purple-400',
    }
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className={`relative p-5 rounded-2xl glass-panel bg-gradient-to-br ${style.bg} border ${style.border} shadow-xl hover:translate-y-[-2px] transition-all duration-300 group`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
          <div className="flex items-baseline gap-1 mt-2">
            <h3 className={`text-3xl font-extrabold tracking-tight ${style.valueColor}`}>{value}</h3>
            {unit && <span className="text-base font-semibold text-slate-400">{unit}</span>}
          </div>
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-xl ${style.iconBg} border border-white/5 group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-400 font-medium">{subtitle}</span>}
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
              {badge}
            </span>
          )}
          {trend && (
            <span className={`font-bold ${trend.startsWith('+') ? 'text-red-400' : 'text-emerald-400'}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
