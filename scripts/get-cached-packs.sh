#!/bin/bash

# Enable error handling
set -e

echo "Starting fetch of cached packs..."

if command -v gh &> /dev/null
then
    echo "✅ GitHub CLI is installed."
else
    echo "❌ GitHub CLI is not installed."
    echo "Run 'brew install gh' to install it with Homebrew."
    exit 1
fi

if gh auth status &> /dev/null
then
    echo "✅ GitHub CLI is authenticated. "
else
    echo "❌ GitHub CLI is not authenticated."
    echo "Please log in by running 'gh auth login'."
    exit 1
fi

 # Find the latest packs upload workflow.
run_id=$(gh run list --workflow="packs_upload.yaml" --limit 1 --json databaseId | jq -r '.[0].databaseId')

# Remove any downloaded artifacts, should they exist.
rm -rf ./downloaded_artifacts
        
# Download the latest artifact to a new dir.
gh run download ${run_id} --name build-packs --dir ./downloaded_artifacts

echo "✅ Cached packs artifact downloaded."

# Ensure the correct folders exist.
mkdir -p .docusaurus/packs-integrations

# Move the files to their correct places in the checked out repository
mv downloaded_artifacts/.docusaurus/packs-integrations/* .docusaurus/packs-integrations 
mkdir -p static/img/packs
mv downloaded_artifacts/build/packs/* static/img/packs

# Clean up. 
rm -rf downloaded_artifacts

echo "✅ Completed fetch of cached packs." 
echo "⏭️ You can now execute make start or make build."
