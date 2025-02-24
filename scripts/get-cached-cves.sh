#!/bin/bash


# Enable error handling
set -e

echo "Starting fetch of cached cves..."

if command -v gh &> /dev/null
then
    echo "✅ GitHub CLI is installed."
else
    echo "❌ GitHub CLI is not installed."
    echo "ℹ️ Use 'brew install gh' to install it with Homebrew."
    exit 1
fi

if gh auth status &> /dev/null
then
    echo "✅ GitHub CLI is authenticated. "
else
    echo "❌ GitHub CLI is not authenticated."
    echo "ℹ️ Please log in with 'gh auth login'."
    exit 1
fi
 # Find the latest cves upload workflow.

run_id=$(gh run list --workflow="post_release.yaml" --status=success --limit 1 --json databaseId | jq -r '.[0].databaseId')

# Remove any downloaded artifacts, should they exist.
rm -rf ./downloaded_artifacts

# Download the latest artifact to a new dir.
gh run download ${run_id} --name security-bulletins --dir ./downloaded_artifacts
echo "✅ Cached CVEs artifact downloaded."

# Ensure the correct folders exist.
mkdir -p .docusaurus/security-bulletins/default

# Move the files to their correct places in the checked out repository
mv downloaded_artifacts/data.json .docusaurus/security-bulletins/default/data.json

# Clean up. 
rm -rf downloaded_artifacts

echo "✅ Completed fetch of cached CVEs." 
echo "⏭️ You can now execute 'make start' or 'make build'."