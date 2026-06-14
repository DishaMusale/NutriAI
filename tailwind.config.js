/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2E7D1F',
        primaryDark: '#005A00',
        background: '#F4F1E3',
        accent: '#D8D3A8',
        text: '#1a1a1a',
      },
      boxShadow: {
        soft: '0 4px 32px rgba(46,125,31,0.10)',
        glow: '0 0 24px rgba(46,125,31,0.22)',
      },
    },
  },
  plugins: [],
}
