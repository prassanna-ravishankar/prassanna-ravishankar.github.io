import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)'],
        sans: ['var(--font-serif)'],
        mono: ['var(--font-mono)'],
        display: ['var(--font-serif)'],
      },
      // Old semantic names alias the design tokens in src/styles/tokens.css
      colors: {
        background: 'var(--paper)',
        surface: 'var(--paper-sunk)',
        primary: { DEFAULT: 'var(--indigo)', hover: 'var(--indigo)', light: 'var(--indigo)' },
        accent: { DEFAULT: 'var(--indigo)', hover: 'var(--indigo)' },
        main: 'var(--ink)',
        muted: 'var(--ink-muted)',
        border: 'var(--rule)',
        subtle: 'var(--rule)',
      },
    },
  },
  plugins: [
    typography,
  ],
}
