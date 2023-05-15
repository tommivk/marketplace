/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        loading: {
          "100%": {
            translate: "0 -100%",
            opacity: "0.1",
          }
        },
        blink: {
          "0%": {
            borderRight: "1px solid white",
          },
          "50%": {
            borderColor: "transparent",
          }
        },
        type: {
          "0%": {
            width: 0,
          },
          "100%": {
            width: "300px",
          }
        }
      },
      animation: {
        loader: "loading 0.6s infinite alternate",
        typewriter: "type 2s steps(40, end) 2 alternate, blink 2s infinite ease-in-out",
      }
    },
  },
  plugins: [],
}
