/** @type {import('tailwindcss').Config} */
import { defineConfig } from 'tailwindcss'
import scrollbarHide from 'tailwind-scrollbar-hide'

export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // <-- THIS is very important
  ],
  theme: {
    extend: {
      colors: {
        netflixBlack: '#141414',
        netflixRed: '#E50914',
        netflixGray: '#333333',
        netflixWhite: '#ffffff',
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    scrollbarHide
  ],
})
