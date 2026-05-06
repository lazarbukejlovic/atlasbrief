/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAFAF7',
        'sky-soft': '#E8F4FD',
        'sky-accent': '#3B82F6',
        'sky-mid': '#60A5FA',
        sand: '#D4A853',
        'sand-light': '#F5E6C8',
        'sand-dark': '#B8892E',
        navy: '#1E2D4A',
        'navy-light': '#2D4163',
        'navy-muted': '#4A5E7A',
        slate: '#64748B',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 4px 24px rgba(30,45,74,0.08)',
        card: '0 2px 16px rgba(30,45,74,0.07)',
        'card-hover': '0 8px 32px rgba(30,45,74,0.14)',
        soft: '0 1px 8px rgba(30,45,74,0.06)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};
