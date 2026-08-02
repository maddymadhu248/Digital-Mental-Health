/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sky: '#E3F2FD',
        mint: '#E8F5E9',
        brand: '#1E88E5',
        accent: '#43A047'
      }
    }
  },
  plugins: []
};
