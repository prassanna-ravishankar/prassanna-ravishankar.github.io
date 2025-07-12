#!/bin/bash

echo "Fixing WebP references in content files..."

# Update all .png references to .webp for files that now exist as .webp
find public/images -name "*.webp" | while read webp_file; do
    # Get the corresponding PNG path
    png_path="${webp_file%.webp}.png"
    
    # Convert to relative paths for replacement
    webp_relative="/images/${webp_file#public/images/}"
    png_relative="/images/${png_path#public/images/}"
    
    echo "Updating references: $png_relative -> $webp_relative"
    
    # Update in all content files
    find src/content -name "*.md" -exec sed -i "" "s|${png_relative}|${webp_relative}|g" {} \;
done

echo "Reference updates complete!"