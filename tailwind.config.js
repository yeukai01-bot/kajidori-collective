/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#dde7ff',
          600: '#1e3a5f',
          700: '#162d4a',
          800: '#0f1f35',
          900: '#0a1628',
        },
        gold: {
          400: '#f5c842',
          500: '#e6b800',
        }
      }
    },
  },
  plugins: [],
}
