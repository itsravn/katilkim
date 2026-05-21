/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgdark: '#000000',
        bgsurface: 'rgba(28, 28, 30, 0.6)',
      }
    },
  },
  plugins: [],
}
