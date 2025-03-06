import { Image } from 'astro:assets';

export const components = {
  img: ({ src, alt, ...props }) => {
    // Handle both absolute and relative paths
    const imageSrc = src.startsWith('/') ? src : `/images/blog/${src}`;
    
    return (
      <figure className="my-6">
        <Image 
          src={imageSrc} 
          alt={alt || ''} 
          width={800}
          height={600}
          className="w-full h-auto rounded-md"
          {...props}
        />
        {alt && <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">{alt}</figcaption>}
      </figure>
    );
  }
}; 