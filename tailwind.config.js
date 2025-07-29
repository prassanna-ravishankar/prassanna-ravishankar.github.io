/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      colors: {
        // Elegant, sophisticated color palette inspired by calv.info
        'neutral': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        'accent': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Sophisticated grays for content
        'content': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // Base typography - clean and minimal
            color: theme('colors.neutral.700'),
            lineHeight: '1.6',
            fontSize: '1rem',
            fontFamily: theme('fontFamily.sans').join(', '),
            
            // Elegant heading hierarchy with perfect scale
            h1: {
              color: theme('colors.neutral.900'),
              fontWeight: '600',
              fontSize: '2.25rem', // 36px
              lineHeight: '1.2',
              marginTop: '0',
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
            },
            h2: {
              color: theme('colors.neutral.800'),
              fontWeight: '600',
              fontSize: '1.875rem', // 30px
              lineHeight: '1.3',
              marginTop: '2.5rem',
              marginBottom: '1rem',
              letterSpacing: '-0.01em',
            },
            h3: {
              color: theme('colors.neutral.800'),
              fontWeight: '600',
              fontSize: '1.5rem', // 24px
              lineHeight: '1.4',
              marginTop: '2rem',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em',
            },
            h4: {
              color: theme('colors.neutral.700'),
              fontWeight: '600',
              fontSize: '1.25rem', // 20px
              lineHeight: '1.4',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            },
            
            // Clean paragraph styling
            p: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              lineHeight: '1.7',
              color: theme('colors.neutral.600'),
            },
            
            // Subtle, elegant links
            a: {
              color: theme('colors.accent.600'),
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.accent.700'),
                textDecoration: 'underline',
              },
            },
            
            // Minimal blockquotes
            blockquote: {
              borderLeftColor: theme('colors.neutral.300'),
              borderLeftWidth: '4px',
              backgroundColor: theme('colors.neutral.50'),
              padding: '1.25rem',
              borderRadius: '0.375rem',
              margin: '1.5rem 0',
              fontStyle: 'normal',
              '& p': {
                margin: '0',
                color: theme('colors.neutral.700'),
                fontSize: '1rem',
                lineHeight: '1.6',
              },
            },
            
            // Clean code styling
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              fontWeight: '500',
              backgroundColor: theme('colors.neutral.100'),
              color: theme('colors.neutral.800'),
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              border: '1px solid',
              borderColor: theme('colors.neutral.200'),
            },
            
            // Minimal pre blocks
            pre: {
              backgroundColor: theme('colors.neutral.900'),
              color: theme('colors.neutral.100'),
              padding: '1.25rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              border: '1px solid',
              borderColor: theme('colors.neutral.800'),
            },
            
            // Clean lists
            ul: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              paddingLeft: '1.5rem',
            },
            ol: {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              paddingLeft: '1.5rem',
            },
            li: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
              lineHeight: '1.6',
            },
            
            // Minimal tables
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            th: {
              backgroundColor: theme('colors.neutral.50'),
              color: theme('colors.neutral.800'),
              fontWeight: '600',
              padding: '0.75rem',
              borderBottom: '1px solid',
              borderBottomColor: theme('colors.neutral.300'),
              textAlign: 'left',
            },
            td: {
              padding: '0.75rem',
              borderBottom: '1px solid',
              borderBottomColor: theme('colors.neutral.200'),
              verticalAlign: 'top',
            },
            
            // Subtle horizontal rules
            hr: {
              borderColor: theme('colors.neutral.300'),
              borderWidth: '1px',
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            
            // Clean images
            img: {
              borderRadius: '0.5rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            
            // Subtle emphasis
            strong: {
              color: theme('colors.neutral.800'),
              fontWeight: '600',
            },
            em: {
              color: theme('colors.neutral.700'),
              fontStyle: 'italic',
            },
          },
        },
        
        // Elegant dark mode
        invert: {
          css: {
            color: theme('colors.neutral.300'),
            
            h1: {
              color: theme('colors.neutral.100'),
            },
            h2: {
              color: theme('colors.neutral.200'),
            },
            h3: {
              color: theme('colors.neutral.200'),
            },
            h4: {
              color: theme('colors.neutral.300'),
            },
            
            p: {
              color: theme('colors.neutral.300'),
            },
            
            a: {
              color: theme('colors.accent.400'),
              '&:hover': {
                color: theme('colors.accent.300'),
              },
            },
            
            blockquote: {
              backgroundColor: theme('colors.neutral.800'),
              borderLeftColor: theme('colors.neutral.600'),
              '& p': {
                color: theme('colors.neutral.300'),
              },
            },
            
            code: {
              backgroundColor: theme('colors.neutral.800'),
              color: theme('colors.neutral.200'),
              borderColor: theme('colors.neutral.600'),
            },
            
            pre: {
              backgroundColor: theme('colors.neutral.900'),
              color: theme('colors.neutral.100'),
              borderColor: theme('colors.neutral.700'),
            },
            
            th: {
              backgroundColor: theme('colors.neutral.800'),
              color: theme('colors.neutral.200'),
              borderBottomColor: theme('colors.neutral.600'),
            },
            td: {
              borderBottomColor: theme('colors.neutral.700'),
            },
            
            hr: {
              borderColor: theme('colors.neutral.600'),
            },
            
            strong: {
              color: theme('colors.neutral.200'),
            },
            em: {
              color: theme('colors.neutral.300'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 