#!/bin/bash

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

# Output the COMMENT variable in Markdown format to the comment file
echo -e "${COMMENT}" > comment.md
