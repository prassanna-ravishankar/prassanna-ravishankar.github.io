import { visit } from 'unist-util-visit';

/**
 * Wraps highlighted code blocks in the design system's CodeBlock markup:
 * <figure class="pr-code"><figcaption>lang · Copy</figcaption><pre>…</pre></figure>.
 * The Copy button is wired up client-side in BlogPost.astro.
 */
export function rehypeCodeFigure() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index === undefined) return;
      if (parent.tagName === 'figure') return;

      const lang = node.properties?.dataLanguage;
      const label = lang && lang !== 'plaintext' ? String(lang) : '';

      parent.children[index] = {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['pr-code'] },
        children: [
          {
            type: 'element',
            tagName: 'figcaption',
            properties: { className: ['pr-code-head', 'pr-meta'] },
            children: [
              { type: 'element', tagName: 'span', properties: {}, children: [{ type: 'text', value: label }] },
              {
                type: 'element',
                tagName: 'button',
                properties: { type: 'button', className: ['pr-code-copy', 'pr-focus'] },
                children: [{ type: 'text', value: 'Copy' }],
              },
            ],
          },
          node,
        ],
      };
      return 'skip';
    });
  };
}
