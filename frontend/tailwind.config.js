/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add this line
  ],
  theme: {
    extend: {
      colors: {
        customPrimary: '#286fb4',
        customPrimaryHover: '#134678',
      },
      height: {
        navbarMinus: 'calc(100vh - 3.5rem)', // Custom height utility
      },
      width: {
        sidbarMinus: 'calc(100vw - 14rem)', // Custom height utility
        rem24: '24-rem',
      },
    },
  },
  plugins: [],
}

