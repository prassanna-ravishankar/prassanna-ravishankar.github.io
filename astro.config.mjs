// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
// Image optimization plugins
import { remarkImagePaths } from './src/plugins/remark-image-paths.mjs';
import { rehypeImageOptimizer } from './src/plugins/rehype-image-optimizer.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://prassanna.io',
  
  // Force trailing slashes for consistency (prevents duplicate content)
  trailingSlash: 'always',
  
  redirects: {
    // Legacy blog URL redirects
    '/blog/2019-05-29-pipenv-pyenv': '/blog/pipenv-pyenv/',
    '/blog/ml-fragmentation-redirect': '/blog/ml-fragmentation/',
    '/blog/ml-fragmentation-2': '/blog/ml-fragmentation/',
    '/blog/full-stack-ml-3': '/blog/full-stack-ml/',
    '/blog/2022-10-15-full-stack-ml': '/blog/full-stack-ml/',
    '/blog/pyenv-and-pipenv-for-the-perfect-python-environment': '/blog/pipenv-pyenv/',
    '/blog/future-tech-framework': '/blog/future-tech-framework/',

    // Legacy project redirects (ambi-alert is now torale)
    '/ambi-alert': '/projects/torale/',
    '/projects/ambi-alert': '/projects/torale/',

    // Old tag pages redirect to tags index
    '/tags/Digital%20India': '/tags/',
    '/tags/Building%20in%20Public': '/tags/',
    '/tags/Product%20Localization': '/tags/',
    '/tags/ML%20Training%20Infrastructure': '/tags/',
    '/tags/Experiments': '/tags/',
    '/tags/Agent%20Orchestration': '/tags/',
  },
  
  integrations: [
    tailwind(),
    mdx({
      extendMarkdownConfig: true,
      smartypants: true,
      gfm: true,
      optimize: true,
    }), 
    sitemap({
      filter: (page) => {
        // Exclude URLs with .md or .md/ (prevents source file leaks)
        if (page.match(/\.md\/?$/)) return false;

        // Exclude URLs with query parameters
        if (page.includes('?')) return false;

        // Exclude legacy redirect sources from sitemap
        if (/^\/ambi-alert\/?$/.test(page)) return false;
        if (page.includes('/projects/ambi-alert')) return false;
        if (page.includes('/blog/2019-05-29-pipenv-pyenv')) return false;
        if (page.includes('/blog/ml-fragmentation-redirect')) return false;
        if (page.includes('/blog/ml-fragmentation-2')) return false;
        if (page.includes('/blog/full-stack-ml-3')) return false;
        if (page.includes('/blog/2022-10-15-full-stack-ml')) return false;
        if (page.includes('/blog/pyenv-and-pipenv-for-the-perfect-python-environment')) return false;

        // Exclude old date-based patterns
        if (page.match(/\/blog\/\d{4}-\d{2}-\d{2}-/)) return false;

        // Exclude partytown and other technical directories
        if (page.includes('~partytown')) return false;
        if (page.includes('/_astro/')) return false;

        // Exclude non-existent podcast episodes (if any)
        if (page.includes('/podcasts/ml-engineering-challenges') ||
            page.includes('/podcasts/deep-learning-frameworks')) return false;

        // Only include valid series tag pages (6 series)
        // Valid series: Machine Learning, MLOps, AI Agents, Python, Startups, Productivity
        if (page.includes('/tags/')) {
          const validSeriesPatterns = [
            '/tags/Machine%20Learning/',
            '/tags/MLOps/',
            '/tags/AI%20Agents/',
            '/tags/Python/',
            '/tags/Startups/',
            '/tags/Productivity/',
            '/tags/', // Allow the index page
          ];
          // Check if it's the index or a valid series page
          const isValidTagPage = validSeriesPatterns.some(pattern =>
            page.endsWith(pattern) || page === 'https://prassanna.io/tags/'
          );
          if (!isValidTagPage) return false;
        }

        return true;
      },
      customPages: [
        'https://prassanna.io/blog/',
        'https://prassanna.io/podcasts/',
        'https://prassanna.io/projects/',
        'https://prassanna.io/verses/',
      ],
      // Add lastmod, changefreq, and priority for better SEO
      serialize(item) {
        // Determine priority and changefreq based on URL pattern
        let priority = 0.5;
        let changefreq = 'monthly';

        if (item.url === 'https://prassanna.io/') {
          priority = 1.0;
          changefreq = 'weekly';
        } else if (item.url.includes('/blog/')) {
          priority = item.url.endsWith('/blog/') ? 0.9 : 0.8;
          changefreq = item.url.endsWith('/blog/') ? 'weekly' : 'monthly';
        } else if (item.url.includes('/podcasts/')) {
          priority = item.url.endsWith('/podcasts/') ? 0.9 : 0.7;
          changefreq = 'monthly';
        } else if (item.url.includes('/projects/')) {
          priority = item.url.endsWith('/projects/') ? 0.8 : 0.7;
          changefreq = 'monthly';
        } else if (item.url.includes('/about')) {
          priority = 0.9;
          changefreq = 'monthly';
        } else if (item.url.includes('/tags/')) {
          // Series pages get higher priority (only 6 of them now)
          priority = item.url.endsWith('/tags/') ? 0.7 : 0.8;
          changefreq = 'weekly';
        }

        return {
          ...item,
          changefreq,
          priority,
          // Add lastmod as current date (in production, you'd use actual file modification dates)
          lastmod: new Date().toISOString(),
        };
      }
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
        // Add required iframe attributes for accessibility compliance
        sandboxParent: 'body',
        // Configure iframe attributes
        lib: "/~partytown/",
      },
    }),
  ],
  
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    },
    // Image optimization plugins
    remarkPlugins: [remarkImagePaths],
    rehypePlugins: [rehypeImageOptimizer],
  },
  
  // Enable image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }
});