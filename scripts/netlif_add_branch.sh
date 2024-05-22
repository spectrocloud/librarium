#!/bin/bash

# Check if SITE_ID is set
if [ -z "$SITE_ID" ]; then
  echo "Error: SITE_ID is not set."
  exit 1
fi

# Check if NETLIFY_TOKEN is set
if [ -z "$NETLIFY_TOKEN" ]; then
  echo "Error: NETLIFY_TOKEN is not set."
  exit 1
fi

# Check if GITHUB_BRANCH is set
if [ -z "$GITHUB_BRANCH" ]; then
  echo "Error: GITHUB_BRANCH is not set."
  exit 1
fi

# Extract the allowed branches list
echo "Fetching allowed branches for site $SITE_ID..."
allowed_branches=$(curl --location "https://api.netlify.com/api/v1/sites/$SITE_ID" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $NETLIFY_TOKEN" | jq '.build_settings.allowed_branches')

if [ -z "$allowed_branches" ]; then
  echo "Error: Could not fetch allowed branches."
  exit 1
fi

echo "Current allowed branches: $allowed_branches"

# Append the current GitHub branch to the allowed branches list
allowed_branches=$(echo $allowed_branches | jq --arg branch "$GITHUB_BRANCH" '. + [$branch]')

echo "Updated allowed branches: $allowed_branches"

# Update the build settings using the updated allowed branches
echo "Updating build settings for site $SITE_ID..."
curl --location --request PATCH "https://api.netlify.com/api/v1/sites/$SITE_ID" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $NETLIFY_TOKEN" \
  --data "{
      \"build_settings\": {
          \"branch\": \"master\",
          \"allowed_branches\": $allowed_branches
      }
  }"
