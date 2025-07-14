#!/bin/bash

# Convert all images in public/images/blog/agentic-mlops to WebP format
# Keeps the .webp extension for output files

SRC_DIR="public/images/blog/agentic-mlops"

# Supported input formats
for img in "$SRC_DIR"/*.{png,jpg,jpeg}; do
    # Skip if no files match
    [ -e "$img" ] || continue
    # Get the base name without extension
    base="${img%.*}"
    out_file="$base.webp"
    # Only convert if .webp does not already exist
    if [ ! -f "$out_file" ]; then
        echo "Converting $img to $out_file"
        cwebp -q 90 "$img" -o "$out_file"
    else
        echo "$out_file already exists, skipping."
    fi
done

echo "Conversion complete!" 