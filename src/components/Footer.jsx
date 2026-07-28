import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Mail, Send, PhoneCall, ShieldCheck, ExternalLink, Heart } from 'lucide-react';
import api from '../utils/api';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await api.post('/feedback', { email: newsletterEmail, type: 'newsletter' });
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    } catch (err) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">Aur<span className="text-orange-500">Heat</span></span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Next-generation Climate Intelligence & Heatwave Early Warning Platform. Harnessing real-time satellite telemetry, predictive micro-climate modeling, and automated emergency advisory broadcasts to safeguard vulnerable populations across India.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Aligned with NDMA Heatwave Action Guidelines</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="hover:text-orange-400 transition-colors">Live Climate Map</Link></li>
              <li><Link to="/prediction" className="hover:text-orange-400 transition-colors">AI Risk Predictor</Link></li>
              <li><Link to="/alerts" className="hover:text-orange-400 transition-colors">Early Warning Alerts</Link></li>
              <li><Link to="/about" className="hover:text-orange-400 transition-colors">AI System Architecture</Link></li>
              <li><Link to="/admin" className="hover:text-orange-400 transition-colors">Admin Command Center</Link></li>
            </ul>
          </div>

          {/* Col 3: Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Emergency Support</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-4 h-4 text-red-400" />
                <span>National Emergency: <strong>112</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>Ambulance Service: <strong>108</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-4 h-4 text-orange-400" />
                <span>NDMA Control Room: <strong>1078</strong></span>
              </div>
              <p className="text-xs text-slate-500 pt-2">24/7 National Disaster Management Authority Support</p>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Stay Advisory-Ready</h4>
            <p className="text-xs text-slate-400">Subscribe for automated extreme heat warnings and daily district risk summaries.</p>
            <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter government / official email"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 text-white font-medium text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20"
              >
                <span>Subscribe Alerts</span>
                <Send className="w-3.5 h-3.5" />
              </button>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 font-medium">✓ Successfully subscribed to early warnings!</p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AurHeat Climate Intelligence SaaS. Built for Smart India Hackathon & Government Resilience.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-400">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-400">Terms of Advisory</Link>
            <span className="flex items-center gap-1">Crafted with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Climate Safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
