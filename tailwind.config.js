/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Official GovTech palette
        navy: {
          DEFAULT: '#003366',
          dark: '#002347',
          light: '#0a4d8c',
          tint: '#e6eef5',
        },
        saffron: { DEFAULT: '#FF9933', dark: '#e07e1d', tint: '#fff3e6' },
        india: { green: '#138808', greenTint: '#e7f4e5' },
        critical: { DEFAULT: '#DC2626', tint: '#fde8e8' },
        panel: '#F8F9FA',
        ink: '#1f2937',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 1px 3px rgba(16,24,40,0.08), 0 1px 2px rgba(16,24,40,0.06)',
        float: '0 8px 24px -8px rgba(16,24,40,0.18)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'fade-in': 'fade-in 0.25s ease-out',
        'pulse-dot': 'pulse-dot 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
