/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2b2b2b",
        secondary: "#1c1c1c",
        highlight1: { 1: "#f2ef8a", 2: "#ccc972" },
        highlight2: "#62e3b6",

      }
    },
  },
  plugins: [],
}
