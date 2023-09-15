/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ["./dist/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
          saffron: '#E7BB41',
          keppel: '#44BBA4',
          platinum: '#E7E5DF',
          timberwolf: '#D3D0CB',
          onyx: '#393E41'
      }
    },
  },
  variants: {
      extend: {
          display: ['dark'],
    }
  },
  plugins: [],
}

