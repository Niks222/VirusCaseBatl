/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#0c0e18',
          card: '#151829',
          cardHover: '#1c2037',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(99, 102, 241, 0.15)',
        },
        brand: {
          purple: '#6b46ff',
          neon: '#8b5cf6',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          gold: '#f59e0b',
          pink: '#ec4899',
        },
        rarity: {
          common: '#94a3b8',
          rare: '#38bdf8',
          epic: '#a855f7',
          legendary: '#f59e0b',
          mythic: '#ef4444',
          nft: '#10b981'
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
