/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#eef2ff',
          DEFAULT: '#6366f1', // Indigo
          dark: '#4338ca',
        }
      },
    },
  },
  plugins: [],
}