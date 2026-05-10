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
        // Earth palette
        'green-deep':  '#2D5016',
        'green-mid':   '#4A7C2F',
        'green-light': '#8DB87A',
        'cream':       '#F5F0E8',
        'bark':        '#6B4C2A',
        'sky-eco':     '#C8DDE8',
        'leaf-shadow': '#E8F0E0',
        // Semantic
        primary: {
          DEFAULT: '#4A7C2F',
          50:  '#F0F7EA',
          100: '#DCEFD0',
          200: '#B8DFA1',
          300: '#8DB87A',
          400: '#6A9E52',
          500: '#4A7C2F',
          600: '#3A6320',
          700: '#2D5016',
          800: '#1F380D',
          900: '#122106',
        },
        secondary: '#8DB87A',
        accent:    '#A8C99A',
        eco: {
          bg:     '#F5F0E8',
          card:   '#FDFAF4',
          text:   '#2D5016',
          muted:  '#5A6B4A',
          bark:   '#6B4C2A',
          gold:   '#C9960A',
          red:    '#B5432A',
          sky:    '#C8DDE8',
        }
      },
      fontFamily: {
        // Headings — nature journal
        serif: ['Lora', 'Playfair Display', 'Georgia', 'serif'],
        // Body — warm and readable
        sans:  ['DM Sans', 'Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card':  '14px',
        'modal': '20px',
        '2xl':   '16px',
        '3xl':   '20px',
      },
      boxShadow: {
        // Warm-tinted only — no cold gray shadows
        'earth-sm': '0 1px 4px  rgba(45,80,22,0.06)',
        'earth-md': '0 2px 16px rgba(45,80,22,0.08)',
        'earth-lg': '0 6px 32px rgba(45,80,22,0.12)',
        'bark':     '0 2px 16px rgba(107,76,42,0.10)',
      },
      animation: {
        'leaf-sway':     'leafSway 3s ease-in-out infinite',
        'leaf-pulse':    'leafPulse 2.5s ease-in-out infinite',
        'leaf-count':    'leafCount 0.8s ease',
        'float':         'float 5s ease-in-out infinite',
        'shimmer':       'shimmer 1.8s infinite',
        'calendar-fill': 'calendarFill 0.4s ease forwards',
        'tip-fade':      'tipFadeIn 0.6s ease forwards',
        'grow-bar':      'growBar 1.2s ease-in-out',
        'vine-grow':     'vineGrow 1.4s ease-in-out forwards',
      },
      keyframes: {
        leafSway: {
          '0%, 100%': { transform: 'rotate(-4deg) scale(1)' },
          '50%':       { transform: 'rotate(4deg) scale(1.05)' },
        },
        leafPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(74,124,47,0.30)' },
          '50%':       { boxShadow: '0 0 0 10px rgba(74,124,47,0)' },
        },
        leafCount: {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        calendarFill: {
          from: { transform: 'scale(0.75)', opacity: '0' },
          to:   { transform: 'scale(1)',    opacity: '1' },
        },
        tipFadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        growBar: {
          from: { width: '0' },
        },
        vineGrow: {
          from: { strokeDashoffset: '340' },
          to:   { strokeDashoffset: 'var(--vine-offset, 0)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [],
}
