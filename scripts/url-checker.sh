#!/bin/bash

# Set variables for GitHub API and Slack webhook
ACCESS_TOKEN=$ACCESS_TOKEN
OWNER=$OWNER
REPO=$REPO
SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL

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
JSON_CONTENT=$(cat link_report.json)

# Check if JSON file is empty
if [[ -z "$JSON_CONTENT" ]]; then
  echo "No broken links found"
  exit 0
fi

# Initialize counter for broken links
BROKEN_LINK_COUNT=0

# Format comment with JSON content
COMMENT=":loudspeaker: Broken External Docs Links in Production Report :spectro: \n\n This is the weekly report of broken links in production. Please review the report and make the required changes. \n\n *Note*: Some links may be false positives due to redirects behavior.\n\n"

# Loop through the "links" array and concatenate each item into the COMMENT variable
for link in $(echo "${JSON_CONTENT}" | jq -r '.links[] | @base64'); do
    url=$(echo "${link}" | base64 --decode | jq -r '.url')
    state=$(echo "${link}" | base64 --decode | jq -r '.state')
    parent=$(echo "${link}" | base64 --decode | jq -r '.parent')

    # Increment counter for broken links if status is not "200"
    if [[ "$status" != "200" ]]; then
      ((BROKEN_LINK_COUNT++))
    fi

    COMMENT="${COMMENT}\n\n:link: Broken URL: ${url}  \n:red_circle: State: ${state}  \n:arrow_up: Parent Page: ${parent}\n\n"
done

# Check if no broken links are found
if [[ "$BROKEN_LINK_COUNT" -eq 0 ]]; then
  COMMENT=":tada: No broken external links found in the production report :tada:\n\nGreat job team! Keep up the good work!\n\nSource: :github: - librarium"
else
  # Add broken link count to the comment
  COMMENT="${COMMENT}\n\n Total count of broken URLs: ${BROKEN_LINK_COUNT}\n\n Source: :github: - librarium"
fi

# Post the comment to the Slack webhook
curl -X POST -H 'Content-type: application/json' --data "{\"text\":\"${COMMENT}\"}" $SLACK_WEBHOOK_URL

if [[ "${DEBUG}" == "true" ]]; then
    echo "GitHub API URL: ${GITHUB_API_URL}"
    echo "Pull Request Number: ${PR_NUMBER}"
    echo "Repository Owner: ${REPO_OWNER}"
    echo "Repository Name: ${REPO_NAME}"
    echo "JSON content:"
    echo "$json"
    echo "COMMENT content:"
    echo "$COMMENT"
fi

echo "Posting comment to pull request #$PR_NUMBER to Slack webhook"