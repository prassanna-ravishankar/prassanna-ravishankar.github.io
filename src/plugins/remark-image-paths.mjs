import { visit } from 'unist-util-visit';

/**
 * A remark plugin that transforms image paths to use the correct path
 */
export function remarkImagePaths() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      const src = node.url;
      
      // Skip external URLs
      if (src.startsWith('http://') || src.startsWith('https://')) {
        return;
      }
      
      // Handle relative paths
      if (!src.startsWith('/')) {
        // For blog-specific images, use the blog directory
        if (src.includes('blog/post')) {
          // Extract the post number and image name
          const match = src.match(/blog\/post(\d+)\/(.+)/);
          if (match) {
            const [, postNum, imageName] = match;
            // Map post numbers to blog post slugs
            const postMap = {
              '2': 'ml-fragmentation',
              '3': 'full-stack-ml'
            };
            const slug = postMap[postNum];
            if (slug) {
              node.url = `/images/blog/${slug}/${imageName}`;
            }
          }
        } else {
          // For other relative paths, make them absolute
          node.url = `/${src}`;
        }
      }
    });
  };
} 