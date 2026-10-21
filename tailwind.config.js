/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 40px rgba(15, 23, 42, 0.08)',
        card: '0 2px 8px -2px rgba(15, 23, 42, 0.06), 0 12px 24px -6px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 24px 48px -12px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(99, 102, 241, 0.18)',
        glow: '0 0 30px -5px rgba(99, 102, 241, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};
