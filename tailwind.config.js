module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        'corporate': {
          primary: '#6366F1', // Фиолетовый
          light: '#6366F1/10', // Светлый фиолетовый
          bg: '#FDF2F8', // Светло-розовый фон
        },
        'notion-gray': {
          light: '#F7F6F3',
          DEFAULT: '#E6E6E6',
          dark: '#D3D3D3',
        },
        'notion-text': {
          DEFAULT: '#37352F',
          light: '#6B6B6B',
        },
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      spacing: {
        'sidebar': '250px',
      },
      boxShadow: {
        'notion': '0 1px 3px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 