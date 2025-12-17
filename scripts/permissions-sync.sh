#!/bin/bash

# This script compares IAM permission files from two different repositories:
# - Librarium (target repository)
# - required-permissions-data (source of truth repository)
# If any differences are detected between the files, it updates the corresponding MDX file in the Librarium repository.

# Exit if a command fails
set -e

echo "Starting permissions sync..."

# Define the paths to the repositories and ensure the required variables are set
repo_librarium="${GITHUB_WORKSPACE}"
repo_permissions="${PATH_PERMISSIONS:?Env variable PATH_PERMISSIONS in permissions-update.yaml is not set}"

# Check if both repository paths are valid directories
if [[ ! -d "$repo_librarium" ]] || [[ ! -d "$repo_permissions" ]]; then
    echo "Error: One or both repositories are missing. Check the paths and try again."
    exit 1
fi

# Define the path to the JSON mapping file and check if it exists
permissions_map=$repo_librarium/scripts/permissions-map.json
if [[ ! -f "$permissions_map" ]]; then
    echo "Error: Mapping file '$permissions_map' not found."
    exit 1
fi

# Track if any changes are detected with a temp file, as variables don't persist in subshells
echo "false" > found_changes.txt

# Process each entry in the JSON map: each entry consists of a source file and the corresponding MDX file
jq -r 'to_entries[] | "\(.key) \(.value)"' "$permissions_map" | while read -r source_file mdx_file; do
    
    # Check if both the source file and the target MDX file exist
    if [[ ! -f "$repo_permissions/$source_file" || ! -f "$repo_librarium/$mdx_file" ]]; then
        echo "Warning: '$source_file' or '$mdx_file' missing. Skipping..."
        continue
    fi
    
    # Save the MDX file's partials header
    partials_header=$(awk '{print} /^```(json|yaml|yml|text)/ {exit}' $repo_librarium/$mdx_file)
    
    # Remove the header and footer from the MDX file to isolate the content and save it to a file
    awk 'f{if ($0 ~ /^```$/) exit; print} /^\s*```(json|yaml|yml|text)/ {f=1}' $repo_librarium/$mdx_file > mdx_extracted_content.txt

    # Compare the extracted MDX content with the source file
    if ! diff -q "$repo_permissions/$source_file" mdx_extracted_content.txt; then       
        echo "true" > found_changes.txt
        echo "Changes detected in $source_file. Updating $mdx_file..."

        # Update the MDX file with the source content
        echo "$partials_header" > $repo_librarium/$mdx_file
        cat $repo_permissions/$source_file >> $repo_librarium/$mdx_file
        echo '```' >> $repo_librarium/$mdx_file
    fi

    # Clean up the temp file
    rm mdx_extracted_content.txt
done

# Check if any changes were detected
found_changes=$(cat found_changes.txt)
rm found_changes.txt

# If changes were detected, export the result as a variable for GitHub Actions
if [ "$found_changes" = true ]; then
    echo "CHANGES_DETECTED=true" >> $GITHUB_ENV
    echo "✅ Permission files updated."
else
    echo "✅ No changes detected."
fi