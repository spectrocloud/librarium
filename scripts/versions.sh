#!/bin/bash

# List of version branches to exclude
exclude_branches=("version-3-4" ) # DO NOT ADD A COMMA BETWEEN THE BRANCHES. ADD A SPACE INSTEAD AND THE NEW VERSION STRING.

# Save the current branch name
current_branch=$(git branch --show-current)

# Fetch all branches
git fetch

# Create the staging directory for all the versions
mkdir -p staging_docs
mkdir -p staging_sidebars
touch temp_versions.json
echo '[]' > temp_versions.json  # Initialize as an empty array if it doesn't exist

# Loop through all local branches
for branch in $(git branch --format '%(refname:short)'); do
  
  # Check if the branch is in the exclude list
  if [[ " ${exclude_branches[@]} " =~ " ${branch} " ]]; then
    echo "Skipping excluded branch: $branch"
    continue
  fi
  
  # Check if the branch name starts with 'version-' followed by numbers
  if [[ $branch =~ ^version-[0-9]+(-[0-9]+)*$ ]]; then
    echo "Found branch: $branch"

    # Extract the version and replace '-' with '.'
    version=${branch#version-}
    version=${version//-/.}

    # Append .0 to the version
    version="$version.0"

    # Store in a variable
    extracted_version=$version
    echo "Extracted version: $extracted_version"

    # Add version to temp_versions.json and sort it
    jq --arg ver "$extracted_version" '. |= [$ver] + . | sort_by(. | split(".") | map(tonumber)) | reverse' temp_versions.json > temp.json && mv temp.json temp_versions.json

    # Switch to the version branch
    git checkout $branch

    # Run the npm command
    echo "Running: npm run docusaurus docs:version $extracted_version"
    # npm run docusaurus docs:version $extracted_version

    # Copy the generated files to the staging directory
    echo "Copying files to staging directory"
    # mv versioned_docs/version-$extracted_version/* staging_docs/
    # mv versioned_sidebars/version-$extracted_version/* staging_sidebars/

    # Switch back to the original branch
    git checkout $current_branch
  fi
done

# Rename the staging directory to the expected Docusarus versioned directory names
# mv staging_docs versioned_docs
# mv staging_sidebars versioned_sidebars

# Remove the existing versions.json if it exists
[ -e versions.json ] && rm versions.json

# Rename temp_versions.json to versions.json
mv temp_versions.json versions.json
