#!/bin/bash

# Set variables for GitHub API
ACCESS_TOKEN=$ACCESS_TOKEN
OWNER=$OWNER
REPO=$REPO

# Get the branch name
BRANCH_NAME=$(basename "$GITHUB_REF")

# Get the pull request number for the branch
PR_NUMBER=$(curl -s -H "Authorization: token $ACCESS_TOKEN" \
"https://api.github.com/repos/$OWNER/$REPO/pulls?head=$BRANCH_NAME" | jq -r '.[0].number')

echo "Pull request number: $PR_NUMBER"

# Read JSON file contents into a variable
JSON_CONTENT=$(cat link_report.json)

# Format comment with JSON content
COMMENT="```
$JSON_CONTENT
```"

echo "Posting comment to pull request #$PR_NUMBER"

# Post comment to pull request using GitHub API
RESPONSE=$(curl -s -H "Authorization: token $ACCESS_TOKEN" \
-d "{\"body\":\"$COMMENT\"}" \
"https://api.github.com/repos/$OWNER/$REPO/issues/$PR_NUMBER/comments")

# Check if the response contains an error message
if [[ "$RESPONSE" == *"message"* ]]; then
  echo "Error posting comment to pull request"
  echo "$RESPONSE"
  exit 1
fi

echo "Comment posted successfully"
