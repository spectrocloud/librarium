#!/bin/sh

# Compress and convert images to WebP format

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
