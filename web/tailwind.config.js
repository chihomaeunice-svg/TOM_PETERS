/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'tp-cream': '#FAF8F5',
        'tp-silk': '#F0EBE3',
        'tp-beige': '#E8E0D5',
        'tp-tan': '#D4B896',
        'tp-gold': '#C9A96E',
        'tp-gold-dark': '#A8833A',
        'tp-taupe': '#8C7B6B',
        'tp-charcoal': '#1C1C1E',
        'tp-border': '#E0D8CE',
        'tp-success': '#27AE60',
        'tp-warning': '#E67E22',
        'tp-error': '#C0392B',
        'tp-sage': '#A8B5A0',
        'tp-rose': '#D4A5A5',
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
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
