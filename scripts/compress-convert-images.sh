#!/bin/bash

# Enable error handling
set -e

echo "Checking for files not in WebP format in static/assets/docs/images/ folder..."

# Find files that are not in WebP format and are not .DS_STORE files
non_webp_files=$(find static/assets/docs/images/ -type f ! -name "*.webp" ! -name "*.gif" -not -name ".DS_STORE")
# Check if there are any non-WebP files
if [[ -n "$non_webp_files" ]]; then
    echo "Warning: Some files in the folder are not in WebP format."
    echo "Non-WebP files:"
    echo "$non_webp_files"
    echo

    # Iterate over each non-WebP file and call webpconvert
    while IFS= read -r file; do
        echo "Converting $file to WebP format..."
        webpconvert "$file"
    done <<< "$non_webp_files"

    echo "Removing original images and renaming WebP images..."
    find static/assets/docs/images/ -type f \( -name "*.png.webp" -o -name "*.png" -o -name "*.jpg.webp" -o -name "*.jpg" -o -name "*.jpeg.webp" -o -name "*.jpeg" \) | while IFS= read -r file; do
        if [[ $file == *.png* ]]; then
            mv "$file" "${file%.png*}.webp"
        elif [[ $file == *.jpg* || $file == *.jpeg* ]]; then
            mv "$file" "${file%.jpg*}.webp"
        fi
    done

    echo "Done."
    exit 0

else
    echo "All files in the folder are already in WebP format."
    exit 0
fi
