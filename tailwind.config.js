/** @type {import('tailwindcss').Config} */
const greenAccent = {
  50: '#EEF4EF',
  100: '#DDE9DF',
  200: '#BDD2C1',
  300: '#9AB99F',
  400: '#779E80',
  500: '#588362',
  600: '#3E7754',
  700: '#356447',
  800: '#2C503A',
  900: '#233E2F',
  950: '#14291D',
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        blue: greenAccent,
        sky: greenAccent,
        indigo: greenAccent,
        cyan: greenAccent,
      },
    },
  },
  plugins: [],
}