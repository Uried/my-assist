/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./assets/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        purple: {
          100: '#EDEDFF',
          300: '#B8B3FA',
          500: '#7C6FF7',
        },
        orange: {
          300: '#FAB89A',
          500: '#F47B4F',
        },
        yellow: {
          500: '#F5A623',
        },
        green: {
          500: '#34C759',
        },
        dark: {
          card: '#1B1B2F',
          deeper: '#12121E',
        },
        page: '#F0F0F5',
        input: '#F5F5FA',
      },
      borderRadius: {
        'sm': '10px',
        'md': '18px',
        'lg': '26px',
        'xl': '36px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 2px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 6px 24px rgba(0,0,0,0.10)',
        'dark': '0 4px 32px rgba(0,0,0,0.30)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
