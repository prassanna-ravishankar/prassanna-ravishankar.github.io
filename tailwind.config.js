import typography from '@tailwindcss/typography';

const serif = ['Newsreader', '"Iowan Old Style"', 'Georgia', 'serif'];
const mono = ['"IBM Plex Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'];
const rgb = (v) => `rgb(var(${v}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Reading voice. `sans` and `display` map here too so older pages pick up the new type.
        serif,
        sans: serif,
        display: serif,
        // Structure voice: nav, labels, names of things built, dates, code.
        mono,
      },
      colors: {
        background: rgb('--color-background'),
        surface: rgb('--color-surface'),
        raised: rgb('--color-raised'),
        primary: {
          DEFAULT: rgb('--color-primary'),
          hover: rgb('--color-primary-hover'),
          light: rgb('--color-primary-light'),
        },
        'on-primary': rgb('--color-on-primary'),
        'indigo-soft': rgb('--color-indigo-soft'),
        accent: {
          DEFAULT: rgb('--color-accent'),
          hover: rgb('--color-accent-hover'),
        },
        marigold: {
          DEFAULT: rgb('--color-marigold'),
          soft: rgb('--color-marigold-soft'),
        },
        main: rgb('--color-text-main'),
        muted: rgb('--color-text-muted'),
        border: rgb('--color-border'),
        'rule-strong': rgb('--color-rule-strong'),
        subtle: rgb('--color-subtle'),
      },
      borderRadius: {
        DEFAULT: '4px',
      },
      maxWidth: {
        measure: '36rem',
        reading: '50rem',
        wide: '64rem',
      },
    },
  },
  plugins: [typography],
};
