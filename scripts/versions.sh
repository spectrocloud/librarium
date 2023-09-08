#!/bin/bash

set -e

###################################################################################################
# This script is used to generate the versioned documentation for Docusaurus.                      
# The script first loops through all version-* branches and runs the Docusaurus command            
# to generate the versioned documentation.                                                        
# The version folders and their content are moved to a temp directory specified by you through the first argument to the script. 
# Once all the version folder are generated, the script moves the versioned folders from the temp directory to the root directory. 
# Lastly, a nodeJS script is run to update the docusarus.config.js file.
# The docusarus.config.js file is updated to remove the default Docusarus banner for old versions that states it's no longer maintained. 
# The script also updates the versions.json file to include the new versions.
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
exclude_branches=("version-3-4") # DO NOT ADD A COMMA BETWEEN THE BRANCHES. ADD A SPACE INSTEAD AND THE NEW VERSION STRING.
# exclude_branches=("version-3-4")

# Save the current branch name
current_branch=$(git branch --show-current)

# Fetch all branches from the remote
git fetch -p origin
branches=$(git branch -a | grep -E 'version-[0-9]+(-[0-9]+)*$')

# Loop through each branch to fetch it locally
for branch in $branches; do
  # Remove leading spaces and remote prefix (if any)
  branch=$(echo $branch | sed 's/ *//;s/remotes\/origin\///')

  # Fetch the remote branch to corresponding local branch
  git fetch origin $branch:$branch
done


# Remove the existing versioned directories in the temp directory.
rm -rf $tempdir/staging_docs
rm -rf $tempdir/staging_sidebars
rm -rf $tempdir/temp_versions.json


# Create the staging directory for all the versions
mkdir -p $tempdir/staging_docs
mkdir -p $tempdir/staging_sidebars
touch $tempdir/temp_versions.json
echo '[]' > $tempdir/temp_versions.json  # Initialize as an empty array if it doesn't exist


echo "Entering the loop to generate the versioned documentation"

# Loop through all local branches
for branch in $(git branch --format '%(refname:short)'); do

  echo "Checking branch: $branch"
  
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
    # Replace the last number with 'x' to indicate it's a version branch
    jq '.[] |= (split(".")[:-1] | join(".")) + ".x"' $tempdir/temp_versions.json > $tempdir/temp.json && mv $tempdir/temp.json $tempdir/temp_versions.json


    # Switch to the version branch
    git checkout $branch

    # Pull the latest changes 
    git pull origin $branch

    # Run the npm command
    echo "Running: npm run docusaurus docs:version $extracted_versionX"
    npm run docusaurus docs:version $extracted_versionX


    # Copy the generated files to the staging directory
    echo "Copying files to staging directory"
    mkdir -p $tempdir/staging_docs/version-$extracted_versionX
    mkdir -p $tempdir/staging_sidebars/version-$extracted_versionX
    
    cp -R versioned_docs/version-$extracted_versionX $tempdir/staging_docs/version-$extracted_versionX
    cp -R versioned_sidebars/version-$extracted_versionX $tempdir/staging_sidebars/version-$extracted_versionX
    cp versioned_sidebars/version-{$extracted_versionX}-sidebars.json $tempdir/staging_sidebars/version-{$extracted_versionX}-sidebars.json


    rm -rf versioned_docs/
    rm -rf versioned_sidebars/

    rm versions.json

    # Switch back to the original branch
    git checkout $current_branch
  fi
done

# Rename the staging directory to the expected Docusarus versioned directory names
cp -R $tempdir/staging_docs $baseDir/versioned_docs
cp -R $tempdir/staging_sidebars $baseDir/versioned_sidebars

# Remove the existing versions.json if it exists
[ -e versions.json ] && rm versions.json

# Rename temp_versions.json to versions.json
mv $tempdir/temp_versions.json $baseDir/versions.json

echo "Updating docusarus.config.js through the node script."
node $baseDir/scripts/update_docusarus_config.js $tempdir $baseDir

if [ $? -ne 0 ]; then
  echo "Error updating docusarus.config.js"
  exit 1
fi

mv $tempdir/temp.docusaurus.config.js $baseDir/docusaurus.config.js

echo "Versioned documentation generated successfully"