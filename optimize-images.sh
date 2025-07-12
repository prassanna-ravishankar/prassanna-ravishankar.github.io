#!/bin/bash

# Image optimization script for prassanna.io
# Converts large PNGs to WebP format for better performance

echo "Starting image optimization..."

# Find all PNG files larger than 1MB and convert to WebP
find public/images -name "*.png" -size +1M | while read file; do
    echo "Processing: $file"
    
    # Get directory path
    dir=$(dirname "$file")
    filename=$(basename "$file" .png)
    
    # Convert to WebP if WebP doesn't already exist
    webp_file="$dir/$filename.webp"
    if [ ! -f "$webp_file" ]; then
        npx sharp-cli -i "$file" -o "$dir/" -f webp -q 80
        
        # Check file sizes
        original_size=$(ls -lh "$file" | awk '{print $5}')
        new_size=$(ls -lh "$webp_file" | awk '{print $5}')
        echo "  $original_size -> $new_size"
    else
        echo "  WebP already exists, skipping"
    fi
done

# Also compress remaining large JPEGs
find public/images -name "*.jpg" -o -name "*.jpeg" | while read file; do
    size=$(stat -f%z "$file")
    if [ $size -gt 500000 ]; then  # > 500KB
        echo "Compressing JPEG: $file"
        npx sharp-cli -i "$file" -o "$file" -q 85 --progressive
    fi
done

echo "Image optimization complete!"
echo "Summary of WebP files created:"
find public/images -name "*.webp" -exec ls -lh {} \;