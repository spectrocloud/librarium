#!/bin/bash

# Obtain pull request number from environment variable if available
if [ -n "$GITHUB_EVENT_PATH" ]; then
  PR_NUMBER=$(jq --raw-output .pull_request.number "$GITHUB_EVENT_PATH")
fi

# If pull request number is not available, retrieve it from the GitHub API
if [ -z "$PR_NUMBER" ]; then
  # Get the branch name from the GITHUB_REF environment variable
  branch_name=$(echo $GITHUB_REF | awk -F'/' '{print $3}')

  # Use the GitHub API to retrieve information about the pull request
  pull_request=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" "https://api.github.com/repos/$OWNER/$REPO/pulls?head=$GITHUB_REPOSITORY:$branch_name")

  # Extract the pull request number from the API response
  PR_NUMBER=$(echo $pull_request | jq -r '.[0].number')
fi

# Print the pull request number if it is not null
if [ ! -z "$PR_NUMBER" ]; then
  echo "Posting comment to pull request #$PR_NUMBER"

  # Read JSON file contents into a variable
  JSON_CONTENT=$(cat link_report.json)

  # Format comment with JSON content
  COMMENT="```
$JSON_CONTENT
```"

  # Post comment to pull request using GitHub API
  curl -X POST \
  -H "Authorization: token $ACCESS_TOKEN" \
  -d "{\"body\":\"$COMMENT\"}" \
  "https://api.github.com/repos/$OWNER/$REPO/issues/$PR_NUMBER/comments"
else
  echo "No pull request number available"
fi
