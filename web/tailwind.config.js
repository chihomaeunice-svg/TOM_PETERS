/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'tp-cream': '#F9F6F2',
        'tp-silk': '#F0E9E1',
        'tp-beige': '#E4DCD3',
        'tp-tan': '#C8B09A',
        'tp-gold': '#B98E6A',
        'tp-gold-dark': '#8F6843',
        'tp-taupe': '#7A6A5A',
        'tp-charcoal': '#111214',
        'tp-border': '#DDD5CC',
        'tp-success': '#27AE60',
        'tp-warning': '#E67E22',
        'tp-error': '#C0392B',
        'tp-sage': '#A8B5A0',
        'tp-rose': '#D4A5A5',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A96E 0%, #A8833A 100%)',
        'cream-gradient': 'linear-gradient(180deg, #FAF8F5 0%, #F0EBE3 100%)',
      },
      boxShadow: {
        luxe: '0 8px 30px rgba(28, 28, 30, 0.06)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'pulse-soft': 'pulseSoft 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
