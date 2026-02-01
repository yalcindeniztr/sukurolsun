/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Dark Theme Palette
        background: {
          DEFAULT: '#0f172a', // Slate 950
          softer: '#1e293b', // Slate 800
        },
        primary: {
          DEFAULT: '#0d9488', // Teal 600
          hover: '#0f766e',   // Teal 700
          light: '#2dd4bf',   // Teal 400 (Glow)
        },
        accent: {
          DEFAULT: '#d97706', // Amber 600 (Dark Gold)
          gold: '#f59e0b',    // Amber 500 (Bright Gold)
          glow: '#fcd34d',    // Amber 300
        },
        text: {
          DEFAULT: '#f8fafc', // Slate 50
          muted: '#94a3b8',   // Slate 400
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Scheherazade New"', 'serif'],
        display: ['Outfit', 'sans-serif'], // For Headings
      },
      boxShadow: {
        'glow-teal': '0 0 20px -5px rgba(45, 212, 191, 0.3)',
        'glow-gold': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
