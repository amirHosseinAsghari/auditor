/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        dana: ["dana", "sans-serif"],
      },
      colors: {
        primary: "#335CFF",
        "primary-dark": "#2547D0",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
