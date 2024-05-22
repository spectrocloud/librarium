#!/bin/bash

# Function to handle errors
handle_error() {
  echo "Error: $1"
  exit 1
}

# Check if NETLIFY_SITE_ID is set
if [ -z "$NETLIFY_SITE_ID" ]; then
  handle_error "NETLIFY_SITE_ID is not set."
fi

# Check if NETLIFY_AUTH_TOKEN is set
if [ -z "$NETLIFY_AUTH_TOKEN" ]; then
  handle_error "NETLIFY_AUTH_TOKEN is not set."
fi

# Check if GITHUB_BRANCH is set
if [ -z "$GITHUB_BRANCH" ]; then
  handle_error "GITHUB_BRANCH is not set."
fi

# Extract the allowed branches list
echo "Fetching allowed branches for site $NETLIFY_SITE_ID..."
response=$(curl --location --write-out "HTTPSTATUS:%{http_code}" --silent --output /tmp/curl_response \
  "https://api.netlify.com/api/v1/sites/$NETLIFY_SITE_ID" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $NETLIFY_AUTH_TOKEN")

http_code=$(grep -o "HTTPSTATUS:[0-9]*" <<< "$response" | cut -d: -f2)
content=$(sed -e "s/HTTPSTATUS:[0-9]*$//" /tmp/curl_response)

if [ "$http_code" -ne 200 ]; then
  handle_error "Failed to fetch allowed branches. HTTP status code: $http_code"
fi

allowed_branches=$(echo "$content" | jq '.build_settings.allowed_branches')

if [ -z "$allowed_branches" ]; then
  handle_error "Allowed branches list is empty."
fi

echo "Current allowed branches: $allowed_branches"

# Check if the current GitHub branch is already in the allowed branches list
if echo "$allowed_branches" | jq -e ". | index(\"$GITHUB_BRANCH\")" > /dev/null; then
  echo "The branch $GITHUB_BRANCH is already in the allowed branches list."
  exit 0
fi

# Append the current GitHub branch to the allowed branches list
allowed_branches=$(echo "$allowed_branches" | jq --arg branch "$GITHUB_BRANCH" '. + [$branch]') || handle_error "Could not append the branch to the allowed branches."

echo "Updated allowed branches: $allowed_branches"

# Update the build settings using the updated allowed branches
echo "Updating build settings for site $NETLIFY_SITE_ID..."
response=$(curl --location --write-out "HTTPSTATUS:%{http_code}" --silent --output /tmp/curl_response \
  --request PATCH "https://api.netlify.com/api/v1/sites/$NETLIFY_SITE_ID" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
  --data "{
      \"build_settings\": {
          \"branch\": \"master\",
          \"allowed_branches\": $allowed_branches
      }
  }")

http_code=$(grep -o "HTTPSTATUS:[0-9]*" <<< "$response" | cut -d: -f2)
content=$(sed -e "s/HTTPSTATUS:[0-9]*$//" /tmp/curl_response)

if [ "$http_code" -ne 200 ]; then
  handle_error "Failed to update Netlify settings. HTTP status code: $http_code"
fi

echo "Netlify logic completed successfully."
