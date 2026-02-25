/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0a1f16',
          softer: '#0f2e22',
        },
        primary: {
          DEFAULT: '#2dd4bf', // Teal 400 - Daha açık teal
          hover: '#14b8a6',  // Teal 500
          light: '#5eead4',  // Teal 300 (Glow)
        },
        accent: {
          DEFAULT: '#f59e0b', // Amber 500
          gold: '#fbbf24',    // Amber 400
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
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-teal': '0 0 30px -5px rgba(45, 212, 191, 0.35)',
        'glow-gold': '0 0 30px -5px rgba(245, 158, 11, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'depth': '0 20px 60px -15px rgba(0, 0, 0, 0.5)',
        'depth-light': '0 20px 60px -15px rgba(0, 0, 0, 0.1)',
        '3d': '0 4px 6px -1px rgba(0,0,0,0.3), 0 10px 30px -5px rgba(0,0,0,0.4)',
        '3d-hover': '0 8px 12px -2px rgba(0,0,0,0.3), 0 20px 50px -10px rgba(0,0,0,0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      }
    },
  },
  plugins: [],
}
