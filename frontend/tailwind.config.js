/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: '#1e40af', // Keep existing custom color
        // OVERRIDE Indigo to map to Avani/Sage Earth Tones
        indigo: {
          50: '#fffbf5',  // Very light cream
          100: '#f5e6d3', // Beige
          200: '#e6d0b3',
          300: '#d4a081',
          400: '#b8866f',
          500: '#8a6144', // <--- PRIMARY BRAND COLOR (Bronze)
          600: '#8a6144', // <--- PRIMARY ACTION (Mapped to Bronze)
          700: '#6b4d36',
          800: '#433020', // Dark Brown
          900: '#2a1d13',
          950: '#1a110a',
        }
      },
    },
  },
  plugins: [],
}