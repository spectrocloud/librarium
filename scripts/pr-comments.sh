#!/bin/bash

# Set variables for GitHub API
ACCESS_TOKEN=$ACCESS_TOKEN
OWNER=$OWNER
REPO=$REPO

# Define emoji for each object
EMOJI1=":loudspeaker:"
EMOJI2=":robot:"
EMOJI3=":news:"

# Get the branch name
BRANCH_NAME=$(basename "$GITHUB_REF")

# Get the pull request number for the branch
PR_NUMBER=$(curl -s -H "Authorization: token $ACCESS_TOKEN" \
"https://api.github.com/repos/$OWNER/$REPO/pulls?head=$BRANCH_NAME" | jq -r '.[0].number')

# Check if PR number was found
if [[ -z "$PR_NUMBER" ]]; then
  echo "Error: Could not find pull request number for branch '$BRANCH_NAME'"
  exit 1
fi

echo "Pull request number: $PR_NUMBER"

# Read JSON file contents into a variable
JSON_CONTENT=$(jq '.' link_report.json)

echo "JSON content:"
echo "$JSON_CONTENT"

# Format comment with JSON content
COMMENT=""

# Loop through each object and add its contents to the comment
for object in $(echo "$JSON_CONTENT" | jq -c '.[]'); do
  COMMENT="$COMMENT\n$EMOJI1 Object:\n"
  fields=$(echo "$object" | jq -r 'keys[]')
  for field in $fields; do
    value=$(echo "$object" | jq -r ".$field")
    COMMENT="$COMMENT$EMOJI2 $field: $value\n"
  done
  COMMENT="$COMMENT$EMOJI3\n"
done

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
