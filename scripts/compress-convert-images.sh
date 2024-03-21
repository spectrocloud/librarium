#!/bin/sh

# Compress and convert images to WebP format


# Check if any file in the folder is not in WebP format
if [[ $(find static/assets/docs/images/ -type f ! -name "*.webp") ]]; then
    echo "Warning: Some files in the folder are not in WebP format."

    echo "Compressing and converting images to WebP format..."
    webpconvert -r static/assets/docs/images/

    echo "Removing original images and renaming WebP images..."
    find static/assets/docs/images/ -type f \( -name "*.png.webp" -o -name "*.png" \) | while IFS= read -r file; do
        if [[ $file == *.png.webp ]]; then
            mv "$file" "${file%.png.webp}.webp"
        else
            rm "$file"
        fi
    done

    echo "Done."
    exit 0

else
    echo "All files in the folder are already in WebP format."
    exit 0
fi




