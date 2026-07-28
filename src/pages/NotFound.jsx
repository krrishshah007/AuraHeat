import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-red-600 p-0.5 mx-auto shadow-2xl">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Flame className="w-10 h-10 text-orange-500 animate-bounce" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black gradient-text">404</h1>
          <h2 className="text-2xl font-bold text-white">Climate Metric Page Not Found</h2>
          <p className="text-xs text-slate-400">
            The requested telemetry endpoint or page does not exist or has been relocated by system admin.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Safety Hub
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
