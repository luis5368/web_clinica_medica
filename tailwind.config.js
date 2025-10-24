/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ Esto es crucial
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
