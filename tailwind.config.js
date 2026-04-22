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
  plugins: [
    function({ addBase }) {
      addBase({
        'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active, textarea:-webkit-autofill, textarea:-webkit-autofill:hover, textarea:-webkit-autofill:focus, textarea:-webkit-autofill:active, select:-webkit-autofill, select:-webkit-autofill:hover, select:-webkit-autofill:focus, select:-webkit-autofill:active': {
          '-webkit-box-shadow': '0 0 0 30px #0F0830 inset !important',
          '-webkit-text-fill-color': '#FBF5E6 !important',
          'transition': 'background-color 5000s ease-in-out 0s',
          'caret-color': '#FBF5E6',
        },
        'input:-webkit-autofill::first-line, textarea:-webkit-autofill::first-line': {
          'color': '#FBF5E6 !important',
        },
        'input:-moz-autofill, textarea:-moz-autofill, select:-moz-autofill': {
          '-moz-box-shadow': '0 0 0 30px #0F0830 inset !important',
          '-moz-text-fill-color': '#FBF5E6 !important',
        },
      });
    },
  ],
}
