/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fb-blue': '#2874f0',
        'fb-yellow': '#fb641b',
        'fb-white': '#ffffff',
        'fb-gray': '#f0f2f5',
      },
    },
  },
  plugins: [],
}
