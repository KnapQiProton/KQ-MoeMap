/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yostar: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a9f6',
          500: '#0e8ce8',
          600: '#026fc6',
          700: '#0358a0',
          800: '#074b83',
          900: '#0c3f6d',
          950: '#082848',
        },
        moe: {
          pink: '#FF85A2',
          pastel: '#FCE4EC',
          lavender: '#E8EAFF',
          sky: '#E1F5FE',
          mint: '#E8F5E9',
          gold: '#FFF9C4',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-pink': '0 0 20px -3px rgba(255, 133, 162, 0.4)',
        'glow-blue': '0 0 20px -3px rgba(56, 169, 246, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
