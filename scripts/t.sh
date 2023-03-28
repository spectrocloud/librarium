#!/bin/bash
# set -x

# Set the GitHub API endpoint URL
GITHUB_API_URL="https://api.github.com"

# Set the pull request number and repository owner and name based on the environment variables
ACCESS_TOKEN=
OWNER=spectrocloud
REPO=librarium
PR_NUMBER=1209

# Read the JSON file
json=$(cat link_report.json)

# Initialize the COMMENT variable with an h1 title header
COMMENT="# Broken Links Report"

# Loop through the "links" array and concatenate each item into the COMMENT variable
for link in $(echo "${json}" | jq -r '.links[] | @base64'); do
    url=$(echo "${link}" | base64 --decode | jq -r '.url')
    status=$(echo "${link}" | base64 --decode | jq -r '.status')
    state=$(echo "${link}" | base64 --decode | jq -r '.state')
    parent=$(echo "${link}" | base64 --decode | jq -r '.parent')
    COMMENT="${COMMENT}\n\n:link: [${url}](${url})  \n:traffic_light: Status: ${status}  \n:bookmark_tabs: State: ${state}  \n:arrow_up: Parent: ${parent}\n---"
done

# Post the COMMENT variable to the pull request as a comment
RESPONSE=$(curl -sSL -H "Authorization: token ${ACCESS_TOKEN}" -H "Content-Type: application/json" -d "{\"body\":\"${COMMENT}\"}" -X POST "${GITHUB_API_URL}/repos/${OWNER}/${REPO}/issues/${PR_NUMBER}/comments")

# Check if the response contains an error message
if [[ "$RESPONSE" == *"message"* ]]; then
  echo "Error posting comment to pull request"
  echo "$RESPONSE"
  exit 1
fi