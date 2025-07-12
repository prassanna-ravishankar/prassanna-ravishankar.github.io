#!/bin/bash

# Replace large PNG files with their WebP counterparts
# This will keep the same filename but with much smaller file sizes

echo "Replacing large PNG files with WebP versions..."

find public/images -name "*.png" -size +1M | while read png_file; do
    # Get the corresponding WebP file
    webp_file="${png_file%.png}.webp"
    
    if [ -f "$webp_file" ]; then
        echo "Replacing $png_file with $webp_file"
        
        # Get file sizes for comparison
        original_size=$(ls -lh "$png_file" | awk '{print $5}')
        webp_size=$(ls -lh "$webp_file" | awk '{print $5}')
        
        echo "  Size reduction: $original_size -> $webp_size"
        
        # Backup the original (optional)
        # mv "$png_file" "${png_file}.backup"
        
        # Replace PNG with WebP but keep the .png extension
        cp "$webp_file" "$png_file"
        
        echo "  ✅ Replaced successfully"
    else
        echo "  ⚠️  WebP version not found for $png_file"
    fi
done

echo "Replacement complete!"
echo "Checking final sizes of large images:"
find public/images -name "*.png" -size +500k -exec ls -lh {} \;