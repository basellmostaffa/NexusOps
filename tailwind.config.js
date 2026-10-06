/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      colors: { ink: '#101828', fog: '#667085', line: '#e4e7ec', navy: '#102a43', coral: '#f9735b', mint: '#0ea88a' },
      boxShadow: { panel: '0 1px 3px rgba(16,24,40,.06), 0 1px 2px rgba(16,24,40,.03)' },
    },
  },
  plugins: [],
}
