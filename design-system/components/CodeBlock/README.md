# CodeBlock
A code listing on `paper-sunk` with the filename (or language) and a Copy button in a mono header.

- Provide `code`, plus `filename` or `lang`. The filename wins when both are given.
- Width is capped at `measure`, and long lines scroll horizontally. Don't wrap code.
- The Copy button reads "Copy" and changes to "Copied" for 1.6 seconds.
- Inline code (`<code>` in prose) is 0.85em mono on `paper-sunk`, styled by bundle.css within `.pr-root`.
