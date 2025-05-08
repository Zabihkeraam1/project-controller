/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#EFF6FF',
        'light-purple': '#F5F3FF',
        'light-green': '#ECFDF5',
      }
    },
  },
  plugins: [],
}

