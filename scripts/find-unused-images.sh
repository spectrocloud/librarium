#!/bin/bash

# Enable error handling
set -e

echo "Checking for unused image files in static/assets/docs/images folder..."

# Create a list of all the images we have and save it to a json.
# Trim the path static/assets/docs/images.
find static/assets/docs/images -type f ! -name ".DS_STORE" ! -name ".DS_Store" | sed 's|static/assets/docs/images||g'  > all_images.json

# Fetch all branches
git fetch --all

# List all the version branches
branches="master"
version_branches=$(git branch --list "version-[0-9]-[0-9]")
branches+=" $version_branches"

for current_branch in $branches; do
    echo "Current branch: $current_branch"
    git checkout origin/$current_branch

    find docs -type f -name "*.md" -exec grep -Hn "\.webp" {} + > docs_used_images.json
    find _partials -type f -name "*.mdx" -exec grep -Hn "\.webp" {} + > partials_used_images.json
    cat docs_used_images.json partials_used_images.json > used_images.json

    line_number=1
    for img in $(cat all_images.json); do
        if grep -q $img used_images.json; then
            sed -i .bak "${line_number}s|.*|${img},FOUND_USED|" all_images.json
        fi
        ((line_number++))
    done
    
done

# Remove all marked used files to make up the list 
sed '/FOUND_USED/d' all_images.json > unused_images.json

# Clean up files
rm all_images.json
rm all_images.json.bak
rm docs_used_images.json
rm partials_used_images.json
rm used_images.json
