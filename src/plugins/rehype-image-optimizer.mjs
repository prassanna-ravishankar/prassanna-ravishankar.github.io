import { visit } from 'unist-util-visit';
import sizeOf from 'image-size';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Get actual image dimensions from the file system
 */
function getImageDimensions(src) {
  try {
    // Skip external images
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return null;
    }

    // Build the path - images are in public directory
    const imagePath = path.join(process.cwd(), 'public', src);

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return null;
    }

    const dimensions = sizeOf(imagePath);
    return {
      width: dimensions.width,
      height: dimensions.height
    };
  } catch (error) {
    return null;
  }
}

/**
 * A rehype plugin that transforms markdown images to use optimized img tags with actual dimensions
 */
export function rehypeImageOptimizer() {
  return (tree) => {
    let processedCount = 0;

    visit(tree, 'element', (node, index, parent) => {
      // Only process img elements
      if (node.tagName !== 'img') return;

      // Get the src and alt attributes
      const src = node.properties.src;
      const alt = node.properties.alt || '';

      if (!src) return;

      processedCount++;

      // Get actual image dimensions
      const dimensions = getImageDimensions(src);

      // Use actual dimensions if available, otherwise fall back to reasonable defaults
      let width = 1200;  // Better default for modern displays
      let height = 800;

      if (node.properties.width && node.properties.height) {
        width = node.properties.width;
        height = node.properties.height;
      } else if (dimensions) {
        width = dimensions.width;
        height = dimensions.height;
      }

      // Create an optimized img node (stay within HTML for Markdown)
      const imageNode = {
        type: 'element',
        tagName: 'img',
        properties: {
          ...node.properties,
          width,
          height,
          loading: 'lazy',
          class: 'w-full h-auto rounded-md'
        },
        children: node.children
      };

      // Create a figure element
      const figureNode = {
        type: 'element',
        tagName: 'figure',
        properties: { class: 'my-6' },
        children: [
          imageNode
        ]
      };

      // Add figcaption if alt text exists
      if (alt) {
        figureNode.children.push({
          type: 'element',
          tagName: 'figcaption',
          properties: { class: 'text-center text-sm text-gray-600 dark:text-gray-400 mt-2' },
          children: [{ type: 'text', value: alt }]
        });
      }

      // Replace the img node with the figure node
      if (parent) {
        parent.children[index] = figureNode;
      }
    });

    if (processedCount > 0) {
      console.log(`[rehype-image-optimizer] Processed ${processedCount} images`);
    }
  };
} 