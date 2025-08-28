const {heroui} = require('@heroui/theme');
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [heroui()],
  content: [
    "./node_modules/@heroui/theme/dist/components/(date-picker|button|ripple|spinner|calendar|date-input|form|popover).js"
],
  theme: {
    extend: {},
  },
  darkMode: "class",
};