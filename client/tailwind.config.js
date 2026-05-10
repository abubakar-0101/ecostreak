/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D6A4F',
          50: '#f0faf5',
          100: '#dcf5e8',
          200: '#b9eacf',
          300: '#84d6ae',
          400: '#52B788',
          500: '#2D6A4F',
          600: '#256043',
          700: '#1e5038',
          800: '#1B4332',
          900: '#163628',
        },
        secondary: '#52B788',
        accent: '#95D5B2',
        eco: {
          bg: '#F8FAF5',
          text: '#1B4332',
          mint: '#95D5B2',
          gold: '#FFB703',
          red: '#E63946',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'modal': '24px',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(45, 106, 79, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(45, 106, 79, 0)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [],
}
