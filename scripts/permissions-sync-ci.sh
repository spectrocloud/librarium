#!/usr/bin/env bash

# This script compares permission files from two different repositories (Librarium and required-permissions-data).
# If differences are found, it updates the corresponding MDX file in Librarium.

# Exit on errors
set -e

echo "Starting permissions sync..."

# Set the repository paths and ensure they exist
repo_librarium="${GITHUB_WORKSPACE}"
repo_permissions="${PATH_PERMISSIONS:?Env variable PATH_PERMISSIONS in permissions-update.yaml is not set}"

if [[ ! -d "$repo_librarium" ]] || [[ ! -d "$repo_permissions" ]]; then
    echo "Error: One or both repositories are missing. Check paths and try again."
    exit 1
fi

# Load the mapping file and validate it exists
permissions_map=$repo_librarium/scripts/permissions-map.json

if [[ ! -f "$permissions_map" ]]; then
    echo "Error: Mapping file '$permissions_map' not found."
    exit 1
fi

# Track if the files are different with a temp file, as variables don't persist in subshells
echo "false" > found_changes.txt

# Read the JSON map and process the files
jq -r 'to_entries[] | "\(.key) \(.value)"' "$permissions_map" | while read -r json_file mdx_file; do
    
    # Validate the files exist
    if [[ ! -f "$repo_permissions/$json_file" || ! -f "$repo_librarium/$mdx_file" ]]; then
        echo "Warning: '$json_file' or '$mdx_file' missing. Skipping..."
        continue
    fi
    
    # Extract MDX (partials) header
    partials_header=$(awk '{print} /^```(json|yaml|yml)/ {exit}' $repo_librarium/$mdx_file)
    
    # Remove header and footer from MDX files, extract JSON content, and save it to a temp file
    awk 'f{if ($0 ~ /^```$/) exit; print} /^\s*```(json|yaml|yml)/ {f=1}' $repo_librarium/$mdx_file > mdx_extracted.json

    # Compare the extracted JSON with the source JSON
    if ! diff -q "$repo_permissions/$json_file" mdx_extracted.json; then       
        echo "true" > found_changes.txt
        echo "Changes detected in $json_file. Updating $mdx_file..."

        # Update the MDX file while keeping partials header and footer
        echo "$partials_header" > $repo_librarium/$mdx_file
        cat $repo_permissions/$json_file >> $repo_librarium/$mdx_file
        echo '```' >> $repo_librarium/$mdx_file
    fi

    # Clean up JSON temp files
    rm mdx_extracted.json
done

# Check if there are changes
found_changes=$(cat found_changes.txt)
rm found_changes.txt

# If changes were detected, export variable to GH Actions
if [ "$found_changes" = true ]; then
    echo "CHANGES_DETECTED=true" >> $GITHUB_ENV
    echo "✅ Permission files updated."
else
    echo "✅ No changes detected."
fi