#!/bin/bash

# Enable error handling
set -e

# Create a list of all the images we have and save it to a json.
# Trim the path static/assets/docs/images.
find static/assets/docs/images -type f ! -name ".DS_STORE" ! -name ".DS_Store" | sed 's|static/assets/docs/images||g'  > all_images.json
image_count=$(wc -l < all_images.json)
echo "Detected $image_count webp assets in static/assets/docs/images..." 

# Fetch all branches
git fetch --all

# List all the version branches
branches="master"
version_branches=$(git branch -a | grep -E 'version-[0-9]+(-[0-9]+)*$')
for version_branch in $version_branches; do
    # Remove leading spaces and remote prefix (if any)
    version_branch=$(echo $version_branch | sed 's/ *//;s/remotes\/origin\///')

    branches+=" $version_branch"
done

echo "Evaluating the following branches for image usage: { $branches }"

for current_branch in $branches; do    
    git checkout $current_branch

    find docs -type f -name "*.md" -exec grep -Hn "\.webp" {} + > docs_used_images.json
    find _partials -type f -name "*.mdx" -exec grep -Hn "\.webp" {} + > partials_used_images.json
    cat docs_used_images.json partials_used_images.json > used_images.json

    line_number=1
    for img in $(cat all_images.json); do
        if grep -q $img used_images.json; then
            sed -i "${line_number}s|.*|${img},FOUND_USED|" all_images.json
        fi
        ((line_number++))
    done
done

# Remove all marked used files to make up the list 
sed '/FOUND_USED/d' all_images.json > unused_images.json
unused_image_count=$(wc -l < unused_images.json)
echo "Detected $unused_image_count unused webp assets in static/assets/docs/images that can be safely removed." 

# Clean up files
rm all_images.json
rm docs_used_images.json
rm partials_used_images.json
rm used_images.json
