# Prassanna Ravishankar's Personal Website

This is the source code for my personal website built with [Astro](https://astro.build/).

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 SEO Optimizations (July 2025)

### Performance & Core Web Vitals:
- **Image Optimization**: Converted 64 PNG files to WebP format (90%+ size reduction)
- **Sharp Integration**: Enabled Astro's image optimization service
- **Lazy Loading**: Implemented progressive image loading

### Technical SEO:
- **Consolidated Redirects**: All URL redirects managed in `astro.config.mjs`
- **Structured Data**: JSON-LD schema for articles and website
- **Meta Tags**: Complete OpenGraph, Twitter Cards, and SEO meta tags
- **Sitemap**: Auto-generated XML sitemap with proper filtering
- **robots.txt**: Optimized for search engine crawling

### Google Search Console:
- Fixed redirect issues and 404 errors
- Improved page load speeds significantly
- Enhanced mobile Core Web Vitals scores

## 📁 Project Structure

```
/
├── public/
│   ├── images/           # Optimized WebP images
│   ├── robots.txt
│   └── favicon.svg
├── src/
│   ├── components/       # Reusable Astro components
│   ├── content/          # Content collections
│   │   ├── blog/         # Technical articles
│   │   ├── podcasts/     # Feed Forward & Startup RX episodes
│   │   ├── projects/     # Portfolio projects
│   │   └── verses/       # Poetry and philosophy
│   ├── layouts/          # Page layouts
│   ├── pages/            # Static pages and dynamic routes
│   ├── plugins/          # Image optimization plugins
│   └── styles/           # Global styles
├── astro.config.mjs      # Astro configuration with redirects
└── package.json
```

## 🎯 Content Types

- **Blog Posts**: Technical articles on ML, AI agents, and software engineering
- **Podcasts**: Feed Forward and Startup RX episodes
- **Projects**: Open source tools and personal projects
- **Verses**: Poetry and philosophical musings

## 🛠 Built With

- [Astro](https://astro.build/) - Static site generator with content collections
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [MDX](https://mdxjs.com/) - Enhanced markdown for content authoring
- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing

## 📈 Performance Features

- **WebP Images**: All images converted to WebP format for optimal loading
- **Lazy Loading**: Progressive image loading for better Core Web Vitals
- **SEO Optimized**: Complete meta tags, structured data, and sitemap
- **Mobile First**: Responsive design with dark mode support

## 🚦 Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

---

Built with ❤️ by [Prassanna Ravishankar](https://prassanna.io)
