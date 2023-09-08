#!/bin/bash

tempdir=$1
baseDir=$(pwd)

# List of version branches to exclude
exclude_branches=("version-3-4" ) # DO NOT ADD A COMMA BETWEEN THE BRANCHES. ADD A SPACE INSTEAD AND THE NEW VERSION STRING.

# Save the current branch name
current_branch=$(git branch --show-current)

# Fetch all branches
git fetch

# Remove the existing versioned directories in the temp directory.
rm -rfv $tempdir/staging_docs
rm -rfv $tempdir/staging_sidebars
rm -rfv $tempdir/temp_versions.json


# Create the staging directory for all the versions
mkdir -p $tempdir/staging_docs
mkdir -p $tempdir/staging_sidebars
touch $tempdir/temp_versions.json
echo '[]' > $tempdir/temp_versions.json  # Initialize as an empty array if it doesn't exist

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
    jq --arg ver "$extracted_version" '. |= [$ver] + . | sort_by(. | split(".") | map(tonumber)) | reverse' $tempdir/temp_versions.json > temp.json && mv temp.json $tempdir/temp_versions.json

    # Switch to the version branch
    git checkout $branch

    # Pull the latest changes 
    git pull origin $branch

    # Run the npm command
    echo "Running: npm run docusaurus docs:version $extracted_version"
    npm run docusaurus docs:version $extracted_version

    # Check if the npm command was successful, otherwise exit
    if [ $? -ne 0 ]; then
      echo "Error running npm command"
      exit 1
    fi

    # Copy the generated files to the staging directory
    echo "Copying files to staging directory"
    mkdir -p $tempdir/staging_docs/version-$extracted_version
    mkdir -p $tempdir/staging_sidebars/version-$extracted_version
    
    cp -R versioned_docs/version-$extracted_version/* $tempdir/staging_docs/version-$extracted_version
    cp -R versioned_sidebars/version-$extracted_version/* $tempdir/staging_sidebars/version-$extracted_version

    rm -rfv versioned_docs/
    rm -rfv versioned_sidebars/
    rm temp.json

    # Switch back to the original branch
    git checkout $current_branch
  fi
done

# Rename the staging directory to the expected Docusarus versioned directory names
cp -R $tempdir/staging_docs $baseDir/versioned_docs
cp -$ $tempdir/staging_sidebars $baseDir/versioned_sidebars

# Remove the existing versions.json if it exists
[ -e versions.json ] && rm versions.json

# Rename temp_versions.json to versions.json
mv temp_versions.json $baseDir/versions.json

# node update_docusarus_config.js
