import { visit } from 'unist-util-visit';

/**
 * A rehype plugin that transforms markdown images to use Astro's Image component
 */
export function rehypeImageOptimizer() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Only process img elements
      if (node.tagName !== 'img') return;
      
      // Get the src and alt attributes
      const src = node.properties.src;
      const alt = node.properties.alt || '';
      
      if (!src) return;
      
      // Create a new Image node
      const imageNode = {
        type: 'element',
        tagName: 'Image',
        properties: {
          ...node.properties,
          width: node.properties.width || 800,
          height: node.properties.height || 600,
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
  };
} 