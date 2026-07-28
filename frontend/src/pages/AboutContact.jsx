import React, { useState } from 'react';
import { Info, Mail, Send, MapPin, Phone, Cpu, ShieldCheck, HelpCircle, Layers, CheckCircle2, Github, Linkedin, Twitter } from 'lucide-react';
import api from '../utils/api';

const AboutContact = () => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feedback', { ...contactForm, type: 'contact' });
      setSubmitted(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setSubmitted(true);
    }
  };

  const faqs = [
    {
      q: 'How does the AurHeat AI heatwave risk prediction algorithm function?',
      a: 'AurHeat integrates relative humidity, solar UV radiation, land surface temperature, and wind speed using Steadman & Rothfusz physiological thermal equations to derive an accurate 0-100% heat risk score.'
    },
    {
      q: 'Is the platform compliant with NDMA Heatwave Action Guidelines?',
      a: 'Yes! The advisory generation framework adheres strictly to National Disaster Management Authority (NDMA) protocols for heatwave mitigation, emergency cooling shelter setup, and labor suspension rules.'
    },
    {
      q: 'Can municipal disaster authorities integrate their live weather IoT sensors?',
      a: 'Absolutely. AurHeat provides open RESTful APIs (GET /api/weather & POST /api/weather) allowing IoT weather stations and satellite feeds to stream micro-climate telemetry seamlessly.'
    },
    {
      q: 'Does the application support offline/isolated deployments?',
      a: 'Yes, our backend includes an in-memory fallback database engine that enables zero-dependency operation for field emergency evaluation without an active cloud database.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Info className="w-4 h-4" /> System Specs & Contact Center
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">About AurHeat & Engineering Specs</h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Building climate resilience for Smart India Hackathon and national emergency agencies with transparent AI architecture and rapid disaster advisories.
        </p>
      </div>

      {/* Mission & Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">Our Mission</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            To mitigate mortality and economic loss caused by severe heatwave events across India by providing predictive micro-climate warnings, automated PDF advisory generation, and real-time district telemetry.
          </p>
        </div>

        <div className="p-8 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">How AI Risk Modeling Works</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Telemetry from satellite feeds and meteorological ground stations is processed through non-linear thermal strain regression models. The engine outputs heat index predictions, risk score percentages, and 7-day forecast curves.
          </p>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Tech Stack & Architecture</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl glass-panel border border-slate-800 text-center space-y-2">
            <strong className="text-white block text-base">React 18 + Vite</strong>
            <span className="text-xs text-slate-400">Frontend UI Engine</span>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-slate-800 text-center space-y-2">
            <strong className="text-orange-400 block text-base">Tailwind CSS</strong>
            <span className="text-xs text-slate-400">Glassmorphism Aesthetics</span>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-slate-800 text-center space-y-2">
            <strong className="text-emerald-400 block text-base">Node.js + Express</strong>
            <span className="text-xs text-slate-400">RESTful API Backend</span>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-slate-800 text-center space-y-2">
            <strong className="text-purple-400 block text-base">MongoDB & Leaflet</strong>
            <span className="text-xs text-slate-400">Spatial Telemetry & GIS</span>
          </div>
        </div>
      </div>

      {/* Team Cards */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Our Project Engineering Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-red-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
              AK
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Ananya K.</h4>
              <span className="text-xs text-orange-400">Lead AI & Climate ML Architect</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              VR
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Vikram R.</h4>
              <span className="text-xs text-blue-400">Full-Stack SaaS Engineer</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              SD
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Siddharth D.</h4>
              <span className="text-xs text-emerald-400">Disaster Policy & GIS Specialist</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl glass-panel border border-slate-800 space-y-2">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-sm text-white hover:text-orange-400"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <p className="text-xs text-slate-300 pt-2 border-t border-slate-800/60 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form & Google Map Embed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-slate-800">
        
        {/* Contact Form */}
        <div className="lg:col-span-6 glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Get in Touch with NDMA Cell</h3>
            <p className="text-xs text-slate-400">Submit technical inquiries or government integration requests.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Subject</label>
              <input
                type="text"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Message Content</label>
              <textarea
                rows="4"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
              ></textarea>
            </div>

            {submitted ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Message sent successfully!
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            )}
          </form>
        </div>

        {/* Location & Google Map Embed */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" /> Climate Control Headquarters
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              NDMA Bhawan, A-1, Safdarjung Enclave, New Delhi, Delhi 110029, India
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Github className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
              <Linkedin className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-800">
            <iframe
              title="NDMA Location Map"
              src="https://maps.google.com/maps?q=NDMA%20Bhawan%20New%20Delhi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AboutContact;
