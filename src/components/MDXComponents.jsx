import { Image } from 'astro:assets';

export function img({ src, alt, ...props }) {
  // Handle both absolute and relative paths
  const imageSrc = src.startsWith('/') ? src : `/images/blog/${src}`;
  
  return (
    <figure className="my-6">
      <img 
        src={imageSrc} 
        alt={alt || ''} 
        className="w-full h-auto rounded-md"
        {...props}
      />
      {alt && <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">{alt}</figcaption>}
    </figure>
  );
} 