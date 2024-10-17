import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
      black: '#000',
      white: '#fff',
      primary: {
        1: 'var(--red-1)',
        2: 'var(--red-2)',
        3: 'var(--red-3)',
        4: 'var(--red-4)',
        5: 'var(--red-5)',
        6: 'var(--red-6)',
        7: 'var(--red-7)',
        8: 'var(--red-8)',
        9: 'var(--red-9)',
        10: 'var(--red-10)',
        11: 'var(--red-11)',
        12: 'var(--red-12)',
      },
      gray: {
        1: 'var(--sand-1)',
        2: 'var(--sand-2)',
        3: 'var(--sand-3)',
        4: 'var(--sand-4)',
        5: 'var(--sand-5)',
        6: 'var(--sand-6)',
        7: 'var(--sand-7)',
        8: 'var(--sand-8)',
        9: 'var(--sand-9)',
        10: 'var(--sand-10)',
        11: 'var(--sand-11)',
        12: 'var(--sand-12)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
