# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build production site to ./dist/
npm run preview  # Preview production build locally
```

## Deployment

- **Hosting**: GitHub Pages at `prassanna.io`
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`
- **Build**: Node 18, `npm ci`, `npm run build`, deploys `./dist/` via `actions/deploy-pages@v4`
- **Custom Domain**: CNAME in `public/CNAME`, DNS configured on Namecheap

Pushing to `main` automatically deploys. No manual deployment steps needed.

## Architecture

### Stack
- **Astro 5.x** with React 19 integration, TailwindCSS, MDX
- **TypeScript** with strict config extending `astro/tsconfigs/strict`
- Dark/light theme via CSS class toggle with localStorage persistence

### Content Collections (`src/content/config.ts`)
Four collections with Zod schemas:
- **blog**: Articles with `series` (indexed categories) and `topics` (freeform tags)
- **podcasts**: Nested under show directories (e.g., `feed-forward/episode.md`)
- **projects**: Portfolio items with optional GitHub/external links
- **verses**: Poetry with minimal schema

Valid series for blog posts: `Machine Learning`, `MLOps`, `AI Agents`, `Python`, `Startups`, `Productivity`

### Component Patterns

**React-in-Astro wrapper pattern** for interactive components:
```
ComponentName.tsx        → React component with client-side logic
ComponentNameWrapper.astro → Astro wrapper that fetches data and passes to React
```
Examples: `ProjectGrid`, `TechTimeline`, `TechStack`, `ProtocolGrid`, `CommandMenu`

Hydration directives:
- `client:load` for immediately needed interactivity
- `client:visible` for below-fold animations (FadeIn, StaggerContainer)

### Theming System (`src/styles/global.css` + `tailwind.config.js`)

CSS variables define semantic colors:
```css
--color-background, --color-surface, --color-primary, --color-accent,
--color-text-main, --color-text-muted, --color-border, --color-subtle
```

Tailwind maps these: `bg-background`, `text-main`, `text-muted`, `border-subtle`, etc.

Theme toggle syncs via:
1. `localStorage.setItem('theme', 'dark'|'light')`
2. `document.documentElement.classList.toggle('dark')`
3. Custom event: `window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }))`

### Dynamic Routes

Blog, podcasts, projects, verses use `[slug].astro` with `getStaticPaths()`:
```typescript
export async function getStaticPaths() {
  const entries = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;  // Hide drafts in prod
  });
  return entries.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}
```

### Image Optimization

Custom plugins in `src/plugins/`:
- `remark-image-paths.mjs`: Normalizes relative image paths
- `rehype-image-optimizer.mjs`: Adds dimensions, lazy loading, wraps in `<figure>`

Images in `public/images/` are served statically. Use Astro's `<Image>` component for optimization.

### SEO Configuration

- Trailing slashes enforced (`trailingSlash: 'always'` in astro.config.mjs)
- Canonical URLs always use `prassanna.io` domain
- Redirects consolidated in `astro.config.mjs`
- Sitemap filtering excludes legacy URLs and non-indexed tag pages
- Redirect keys with spaces must use literal spaces, not `%20` — GitHub Pages resolves URL-encoded paths to space-named directories
- `projectSitemaps()` inline integration in `astro.config.mjs` appends project subsite sitemaps (phlow, modalkit, tracelet, cloudregion) to `sitemap-index.xml` at build time
- Several GitHub repos deploy docs to subpaths on `prassanna.io` via GitHub Pages (e.g. `/phlow/`, `/modalkit/`, `/tracelet/`, `/cloudregion/`, `/torale/`) — these are separate repos, not part of this build

### View Transitions

Uses Astro's `<ClientRouter />`. Scripts must listen to `astro:page-load` instead of `DOMContentLoaded`:
```typescript
document.addEventListener('astro:page-load', () => { /* reinitialize */ });
```

## Key Files

- `astro.config.mjs`: Site config, integrations, redirects, sitemap rules
- `src/layouts/Layout.astro`: Base layout with SEO, structured data, analytics
- `src/layouts/BlogPost.astro`: Blog article template with reading time, related posts
- `src/content/config.ts`: Content collection schemas
- `src/components/CommandMenu.tsx`: Cmd+K navigation (cmdk library)
- `src/components/NotionNav.astro`: Sticky table of contents for blog posts
