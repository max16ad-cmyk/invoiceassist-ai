/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#e7f6fd",
          100: "#d9f0fb",
          200: "#beeafb",
          300: "#9cdcf6",
          400: "#7cccef",
          500: "#58b7e2",
          600: "#2aa2d5",
          700: "#1e7ead",
          800: "#175a82",
          900: "#0b3b57"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2,18,46,.06)"
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem'
      }
    }
  },
  plugins: []
};
