/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tikera-green': '#4ade80',
        'tikera-dark-green': '#22c55e',
        'tikera-bg': '#0f172a',
        'tikera-card': '#1e293b',
        'tikera-light': '#f8fafc',
        'tikera-gray': '#334155',
      },
    },
  },
  plugins: [],
} 