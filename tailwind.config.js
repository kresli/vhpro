const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.teal,
        secondary: "#1f2937"
      }
    },
  },
  plugins: [require('@tailwindcss/forms'),],
}
