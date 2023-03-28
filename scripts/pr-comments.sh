#!/bin/bash

# Obtain pull request number from environment variable
PR_NUMBER=$(jq --raw-output .pull_request.number "$GITHUB_EVENT_PATH")

# Set variables for GitHub API
ACCESS_TOKEN=$ACCESS_TOKEN
OWNER=spectrocloud
REPO=librarium

# Read JSON file contents into a variable
JSON_CONTENT=$(cat link_report.json)

# Format comment with JSON content
COMMENT="```
$JSON_CONTENT
```"

echo "Posting comment to pull request #$PR_NUMBER"

# Post comment to pull request using GitHub API
curl -X POST \
-H "Authorization: token $ACCESS_TOKEN" \
-d "{\"body\":\"$COMMENT\"}" \
"https://api.github.com/repos/$OWNER/$REPO/issues/$PR_NUMBER/comments"