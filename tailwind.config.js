/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sapi: {
          void: '#06030E',
          navy: '#0F0830',
          midnight: '#1A1540',
          gold: '#C9963A',
          paleGold: '#EDD98A',
          parchment: '#FBF5E6',
          muted: '#FFFFFF',
          emerald: '#28A868',
          amber: '#F0C050',
          crimson: '#C03058',
          bronze: 'rgba(107,69,8,0.22)',
          blue: '#4A7AE0',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['system-ui', 'sans-serif'],
      },
      maxWidth: {
        'container': '1100px',
      },
      letterSpacing: {
        'extra-wide': '0.18em',
        'super-wide': '0.2em',
      },
      borderColor: {
        'sapi-bronze': 'rgba(107,69,8,0.22)',
      }
    },
  },
  plugins: [],
}
