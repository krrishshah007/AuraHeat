/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        climate: {
          cyan: '#00F2FE',
          electricBlue: '#3B82F6',
          violet: '#6366F1',
          coral: '#FF512F',
          orange: '#F97316',
          red: '#EF4444',
          emerald: '#10B981',
          amber: '#F59E0B',
          obsidian: '#060B19',
          navy: '#0B1329',
          cardDark: 'rgba(15, 23, 42, 0.75)',
          borderDark: 'rgba(255, 255, 255, 0.1)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'climate-gradient': 'linear-gradient(135deg, #00F2FE 0%, #3B82F6 40%, #F97316 75%, #FF512F 100%)',
        'heat-gradient': 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
        'cool-gradient': 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-heat': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(249, 115, 22, 0.4)' },
          '100%': { boxShadow: '0 0 35px rgba(255, 81, 47, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
