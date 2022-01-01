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
        secondary: colors.indigo
      }
    },
  },
  plugins: [require('@tailwindcss/forms'),],
}
