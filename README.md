# prassanna.io

Personal website and blog built with Astro, React, and TailwindCSS. Features technical articles on ML/MLOps, project portfolio, podcasts, and poetry.

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:4321
npm run build        # Build to ./dist/
npm run preview      # Preview production build
```

## Tech Stack

- **Astro 5.x** - Static site generator with content collections
- **React 19** - Interactive components (command palette, grids, timelines)
- **TailwindCSS** - Utility-first styling with custom theme
- **MDX** - Enhanced markdown with embedded components
- **TypeScript** - Strict type checking
- **Framer Motion** - Animations
- **Sharp** - Image optimization (WebP conversion)

## Project Structure

```
src/
├── components/          # UI components
│   ├── ui/              # Primitives (Card, Button, Badge, FadeIn)
│   ├── CommandMenu.tsx  # Cmd+K navigation palette
│   ├── ProjectGrid.tsx  # Featured projects display
│   ├── TechStack.tsx    # Skills visualization
│   └── *.astro          # Astro components + React wrappers
├── content/             # Content collections
│   ├── blog/            # Technical articles
│   ├── projects/        # Portfolio items
│   ├── podcasts/        # Episode metadata
│   └── verses/          # Poetry
├── layouts/             # Page templates
├── pages/               # Routes
├── plugins/             # Custom remark/rehype plugins
└── styles/              # Global CSS + theme variables
```

## Content Collections

Four collections defined in `src/content/config.ts` with Zod schemas:

| Collection | Description | Key Fields |
|------------|-------------|------------|
| **blog** | Technical articles | `series`, `topics`, `draft` |
| **projects** | Portfolio items | `github`, `link`, `featured` |
| **podcasts** | Episode metadata | `externalLinks`, `guests`, `duration` |
| **verses** | Poetry | Minimal schema |

Valid blog series: `Machine Learning`, `MLOps`, `AI Agents`, `Python`, `Startups`, `Productivity`

## Key Features

### Command Palette (Cmd+K)
Site-wide navigation with keyboard shortcuts. Built with [cmdk](https://cmdk.paco.me/).

### Dark/Light Theme
CSS variable-based theming with localStorage persistence. Toggle syncs via custom events.

### React-in-Astro Pattern
Interactive components use wrapper pattern:
```
ComponentName.tsx        → React component
ComponentNameWrapper.astro → Fetches data, passes to React
```

### Image Optimization
- Custom plugins normalize paths and add dimensions
- All images converted to WebP
- Lazy loading with CLS prevention

### SEO
- JSON-LD structured data (Website, Article, Breadcrumb schemas)
- Auto-generated sitemap with priority rules
- Canonical URLs with enforced trailing slashes
- Complete OpenGraph and Twitter Card meta

## Deployment

Automatically deploys to GitHub Pages on push to `main`:

1. GitHub Actions builds with Node 18
2. Deploys `./dist/` via `actions/deploy-pages@v4`
3. Custom domain: `prassanna.io` (CNAME in `public/`)

## Configuration Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Integrations, redirects, sitemap rules |
| `tailwind.config.js` | Theme extension, custom colors |
| `src/content/config.ts` | Collection schemas |
| `CLAUDE.md` | Development guidelines |

## License

MIT
