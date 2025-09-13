import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vercel颜色系统
        vercel: {
          background: '#fafafa',
          foreground: '#171717',
          gray: {
            1000: 'hsla(0,0%,9%,1)',
            900: 'hsla(0,0%,13%,1)',
            800: 'hsla(0,0%,20%,1)',
            700: 'hsla(0,0%,40%,1)',
            600: 'hsla(0,0%,60%,1)',
            500: 'hsla(0,0%,80%,1)',
            400: 'hsla(0,0%,87%,1)',
            300: 'hsla(0,0%,93%,1)',
            200: 'hsla(0,0%,96%,1)',
            100: 'hsla(0,0%,98%,1)',
          },
          blue: {
            900: 'hsla(211,100%,42%,1)',
            500: '#0070f3',
          }
        }
      },
      fontFamily: {
        sans: ['Geist', 'Arial', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'sans-serif'],
      },
      fontSize: {
        'hero': '48px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    },
  },
  plugins: [],
};

export default config;