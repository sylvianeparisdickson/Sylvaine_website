/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'charcoal': '#121212',
        'terracotta': '#8D462F',
        'forest': '#1A3E2D',
        'cream': {
          50: '#FDFBF7',
          100: '#FAF5EB',
          200: '#F5E6D3',
          light: '#FDFBF7',
          DEFAULT: '#F5E6D3',
        },
        'rose-gold': {
          50: '#FDF2F2',
          100: '#FCE8E8',
          200: '#F8D1D1',
          300: '#F3B5B5',
          400: '#E8B4B8',
          500: '#D4A5A5',
          600: '#B88F8F',
          700: '#9C7676',
          800: '#805E5E',
          900: '#644949',
          light: '#E8B4B8',
          DEFAULT: '#D4A5A5',
          dark: '#B88F8F',
        },
        'champagne': {
          50: '#FDF9F4',
          100: '#FBEFE4',
          200: '#F7E0C9',
          300: '#F3D0AE',
          400: '#F5E6D3',
          500: '#E8D5C4',
          600: '#D4C4B0',
          700: '#BFAE9C',
          800: '#A99888',
          900: '#938274',
          light: '#F5E6D3',
          DEFAULT: '#E8D5C4',
          dark: '#D4C4B0',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'rose-gold-gradient': 'linear-gradient(135deg, #E8B4B8 0%, #D4A5A5 50%, #B88F8F 100%)',
        'champagne-gradient': 'linear-gradient(135deg, #F5E6D3 0%, #E8D5C4 50%, #D4C4B0 100%)',
        'velvet-dark': 'linear-gradient(180deg, #121212 0%, #1a1a1a 50%, #0d0d0d 100%)',
      },
      boxShadow: {
        'rose-glow': '0 0 30px rgba(212, 165, 165, 0.3)',
        'champagne-glow': '0 0 30px rgba(232, 213, 196, 0.3)',
      },
    },
  },
  plugins: [],
}
