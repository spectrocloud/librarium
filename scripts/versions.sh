#!/bin/bash

set -e

###################################################################################################
# This script is used to generate the versioned documentation for Spectro Cloud Docs.                      
# The script first loops through all version-* branches and runs the Docusaurus command `npm run docusaurus docs:version <version>`           
# to generate the versioned documentation.                                                        
# The version folders and their content are moved to a temp directory specified by you through the first argument to the script. 
# Once all the version folders are generated, the script moves the versioned folders from the temp directory to the root directory of the repository. 
# Lastly, a nodeJS script (update_docusaurs_config.js) is invoked to update the docusarus.config.js file.
# The docusarus.config.js file is updated to remove the default Docusarus banner for old versions that states it's no longer maintained.
# The script also updates the versions.json file to include the new versions.
# Last note. You can use the versionsOverride.json file to customize the versions label, banner, and other properties.
###################################################################################################                      

tempdir=$1
baseDir="$PWD" # Get the parent directory of the current directory

# Check if the temp directory is specified, otherwise use /tmp
if [ -z "$tempdir" ]; then
  tempdir="/tmp"
fi

echo "Temp directory: $tempdir"
echo "Base directory: $baseDir"
# List of version branches to exclude
exclude_branches=(version-3-4 version-4-0 version-4-1 version-4-2 version-4-3 version-4-4) # DO NOT ADD A COMMA BETWEEN THE BRANCHES. ADD A SPACE INSTEAD AND THE NEW VERSION STRING.
# exclude_branches=("version-3-4")

# Save the current branch name
current_branch=$(git branch --show-current)

# If current branch is empty, then use HEAD
if [ -z "$current_branch" ]; then
    current_branch=$HEAD
fi

echo "Current branch: $current_branch"
echo "HEAD Branch: $HEAD"


# Fetch all branches from the remote
git fetch -p origin
# Remove leading spaces and remote prefix (if any)
# Sort and remove duplicates.
branches=$(git branch -a | sed 's/ *//;s/remotes\/origin\///' | grep -E '^version-[0-9]+(-[0-9]+)*$' | sort | uniq)

# Loop through each branch to fetch it locally
for b in $branches; do
  # Fetch the remote branch to corresponding local branch
  git fetch origin $b:$b
done

# Make sure we are in a clean state for repeatable runs.
make clean-versions

# Remove the existing versioned directories in the temp directory.
rm -rf $tempdir/staging_docs
rm -rf $tempdir/staging_api_docs
rm -rf $tempdir/staging_sidebars
rm -rf $tempdir/staging_api_docs_sidebars
rm -rf $tempdir/staging_partials
rm -rf $tempdir/temp_versions.json
rm -rf $tempdir/temp_api_versions.json


# Create the staging directory for all the versions
mkdir -p $tempdir/staging_docs
mkdir -p $tempdir/staging_api_docs
mkdir -p $tempdir/staging_sidebars
mkdir -p $tempdir/staging_api_docs_sidebars
mkdir -p $tempdir/staging_partials
touch $tempdir/temp_versions.json
touch $tempdir/temp_api_versions.json
echo '[]' > $tempdir/temp_versions.json  # Initialize as an empty array if it doesn't exist
echo '[]' > $tempdir/temp_api_versions.json  # Initialize as an empty array if it doesn't exist


echo "Entering the loop to generate the versioned documentation"

# Loop through all local branches
for item in $branches; do

  echo "Checking branch: $item"
  
  # Check if the branch is in the exclude list
  if [[ " ${exclude_branches[@]} " =~ " ${item} " ]]; then
    echo "Skipping excluded branch: $item"
    continue
  fi
  
  echo "Found branch: $item"

  # Extract the version and replace '-' with '.'
  version=${item#version-}
  version=${version//-/.}

  # Append .x to the version
  versionX="$version.x"

  # Append .0 to the version
  version="$version.0"

  # Store in a variable
  extracted_version=$version
  extracted_versionX=$versionX
  echo "Extracted version: $extracted_version"

  # Add version to temp_versions.json and sort it
  jq --arg ver "$extracted_version" '. |= [$ver] + . | sort_by(. | split(".") | map(tonumber)) | reverse' $tempdir/temp_versions.json > $tempdir/temp.json && mv $tempdir/temp.json $tempdir/temp_versions.json
  jq --arg ver "$extracted_version" '. |= [$ver] + . | sort_by(. | split(".") | map(tonumber)) | reverse' $tempdir/temp_api_versions.json > $tempdir/temp_api.json && mv $tempdir/temp_api.json $tempdir/temp_api_versions.json

  # Switch to the version branch
  git checkout $item

  # Pull the latest changes 
  git pull origin $item

  # Generate the partials once we are on the version branch
  make generate-partials

  # Run the npm command
  echo "Running: npm run docusaurus docs:version $extracted_versionX"
  npm run docusaurus docs:version $extracted_versionX

  # Generate the API docs
  echo "Running: npm run generate-api-docs"
  npm run generate-api-docs

  echo "Running: npm run docusaurus docs:version:api $extracted_versionX"
  npm run docusaurus docs:version:api $extracted_versionX

  # Copy version docs content
  cp -R versioned_docs/version-$extracted_versionX $tempdir/staging_docs/
  cp -R versioned_sidebars/version-$extracted_versionX $tempdir/staging_sidebars/ || true
  cp versioned_sidebars/version-$extracted_versionX-sidebars.json $tempdir/staging_sidebars/version-$extracted_versionX-sidebars.json
  # Copy version API docs content
  cp -R api_versioned_docs/version-$extracted_versionX $tempdir/staging_api_docs/
  cp -R api_versioned_sidebars/version-$extracted_versionX $tempdir/staging_api_docs_sidebars/ || true
  cp api_versioned_sidebars/version-$extracted_versionX-sidebars.json $tempdir/staging_api_docs_sidebars/version-$extracted_versionX-sidebars.json
  # Copy the partials folder
  cp -R _partials $tempdir/staging_partials/version-$extracted_versionX

  rm -rf versioned_docs/
  rm -rf versioned_sidebars/
  rm -rf api_versioned_docs/
  rm -rf api_versioned_sidebars/

  rm versions.json
  rm api_versions.json

  # Remove API auto-generated files
  make clean-api

  # Switch back to the original branch
  git checkout $current_branch
  echo "Switched back to branch: $current_branch"
done

# Rename the staging directory to the expected Docusarus versioned directory names
cp -R $tempdir/staging_docs $baseDir/versioned_docs
cp -R $tempdir/staging_sidebars $baseDir/versioned_sidebars
cp -R $tempdir/staging_api_docs $baseDir/api_versioned_docs
cp -R $tempdir/staging_api_docs_sidebars $baseDir/api_versioned_sidebars
cp -R $tempdir/staging_partials/. $baseDir/versioned_partials

# Remove the existing versions.json if it exists
[ -e versions.json ] && rm versions.json
[ -e api_versions.json ] && rm api_versions.json

# Replace the last number with 'x' to indicate it's a version branch
jq '.[] |= (split(".")[:-1] | join(".")) + ".x"' $tempdir/temp_versions.json > $tempdir/temp.json && mv $tempdir/temp.json $tempdir/temp_versions.json
jq '.[] |= (split(".")[:-1] | join(".")) + ".x"' $tempdir/temp_api_versions.json > $tempdir/temp_api.json && mv $tempdir/temp_api.json $tempdir/temp_api_versions.json

# Rename temp_versions.json to versions.json
mv $tempdir/temp_versions.json $baseDir/versions.json
mv $tempdir/temp_api_versions.json $baseDir/api_versions.json

echo "Updating docusarus.config.js through the node script."
node $baseDir/scripts/update_docusarus_config.js $tempdir $baseDir

if [ $? -ne 0 ]; then
  echo "Error updating docusarus.config.js"
  exit 1
fi

mv $tempdir/temp.docusaurus.config.js $baseDir/docusaurus.config.js

echo "Versioned documentation generated successfully"

echo "Create the robots.txt file"

# Invoke the generated_robots.sh script
$baseDir/scripts/generate_robots.sh $baseDir/versions.json $baseDir/static

if [ $? -ne 0 ]; then
  echo "Error generating the robots.txt file"
  exit 1
fi

echo "robots.txt file generated successfully"