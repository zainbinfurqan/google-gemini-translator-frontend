/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        tada: 'tada 1s ease-in-out',
      },
      keyframes: {
        tada: {
          '5%, 40%, 60%, 80%, 100%': { transform: 'scale(1)' },
          '5%': { transform: 'scale(1.1) rotate(0deg) ' },
        },
      },
    },
    
  },
  plugins: [],
}

