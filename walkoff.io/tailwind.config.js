/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'base-light': '#F0F0F0',
        'base': '#1E1E1E',
        'base-dark': '#121212',
        'surface-light': '#FFFFFF',
        'surface': '#2D2D2D',
        'surface-dark': '#1A1A1A',
        'primary': '#B22222',
        'primary-light': '#D25757',
        'primary-dark': '#8B0000',
        'secondary': '#00274D',
        'secondary-light': '#003A70',
        'secondary-dark': '#001B33',
        'accent': '#F5F5DC',
        'accent-light': '#FFFFF0',
        'accent-dark': '#D2B48C',
        'text-light': '#121212',
        'text': '#FFFFFF',
        'text-muted': '#A0A0A0',
      }
    },
  },
  plugins: [],
}
