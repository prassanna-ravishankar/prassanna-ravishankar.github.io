#!/bin/bash

echo "Converting WebP files to proper .webp extensions..."

# Find all PNG files that are actually WebP format
find public/images -name "*.png" -exec sh -c '
    if file "$1" | grep -q "Web/P image"; then
        echo "Converting: $1"
        # Get the directory and filename without extension
        dir=$(dirname "$1")
        base=$(basename "$1" .png)
        
        # Rename to .webp
        mv "$1" "$dir/$base.webp"
        
        echo "  Renamed to: $dir/$base.webp"
        
        # Update markdown references
        echo "  Updating references..."
        find src/content -name "*.md" -exec sed -i "" "s|/images/${1#public/images/}|/images/${dir#public/images}/$base.webp|g" {} \;
        
        # Also check for any other references in src/
        find src -name "*.astro" -o -name "*.jsx" -o -name "*.ts" -o -name "*.js" -exec sed -i "" "s|\"${1#public}\"|\"${dir#public}/$base.webp\"|g" {} \;
        
    fi
' _ {} \;

echo "Conversion complete!"
echo ""
echo "Updated files:"
find public/images -name "*.webp" | wc -l | xargs echo "WebP files:"
echo ""
echo "Checking for any remaining WebP-content PNG files:"
find public/images -name "*.png" -exec sh -c 'if file "$1" | grep -q "Web/P image"; then echo "Still WebP: $1"; fi' _ {} \;