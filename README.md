# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

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

## 🔧 SEO & Indexing Fixes (2025)

### Issues Resolved:
- **Fixed URL consistency**: All URLs now use `www.prassanna.io` domain consistently
- **Removed .md extensions**: Podcast episode URLs no longer contain `.md` extensions
- **Complete sitemap**: All content is now properly included in the sitemap
- **Proper redirects**: 301 redirects are configured correctly
- **robots.txt**: Updated to prevent crawling of .md extension URLs

### For Google Search Console:
- Submit the updated sitemap: `https://www.prassanna.io/sitemap-index.xml`
- Request re-indexing of previously problematic URLs
- Monitor for any remaining 404 errors

## 📁 Project Structure

```
/
├── public/
│   └── images/
├── src/
│   ├── components/
│   ├── content/
│   │   ├── blog/
│   │   ├── podcasts/
│   │   ├── projects/
│   │   └── verses/
│   ├── layouts/
│   ├── pages/
│   └── styles/
└── package.json
```

## 🎯 Content Types

- **Blog Posts**: Technical articles and thoughts
- **Podcasts**: Feed Forward and Startup RX episodes
- **Projects**: Open source and personal projects
- **Verses**: Poetry and philosophical musings

## 🛠 Built With

- [Astro](https://astro.build/) - Static site generator
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [MDX](https://mdxjs.com/) - Content authoring
