#!/bin/bash

####################################################################################################
# This script is used to download the latest screenshots captured by the screenshot_capture workflow.
# The assumption is that this script is executed in a GitHub Actions environment.
# The script fetches the latest workflow run for the specified workflow file and repository.
# It then downloads the first artifact from the latest run and unzips it to a specified folder.
# The unzipped folder is named "screenshots" by default and dropped one level above the script location.
# The script requires the GITHUB_TOKEN environment variable to be set with a valid GitHub token.
# Otherwise the artifacts cannot be downloaded.
####################################################################################################


set -e

# Function to unzip the artifact
unzip_artifact() {
    local zip_file=$1
    local destination_folder=$2 # Use passed variable for folder name

    echo "Unzipping $zip_file to $destination_folder..."
    mkdir -p "$destination_folder"
    unzip -o "$zip_file" -d "$destination_folder"
    echo "Artifact unzipped successfully."
    rm -f "$zip_file"
}

# Ensure GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo "GitHub token (GITHUB_TOKEN) not provided. Please set the GITHUB_TOKEN environment variable."
  exit 1
fi


OWNER="${GITHUB_REPOSITORY_OWNER:-spectrocloud}"
REPO_NAME="${GITHUB_REPOSITORY#*/}"  
REPO="${REPO_NAME:-librarium}"
WORKFLOW_FILE="screenshot_capture.yaml"
UNZIP_FOLDER="screenshots" 


perform_curl() {
    local url=$1
    response=$(curl -s -f -w "%{http_code}" -o temp_response.txt -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" "$url")
    http_code=$(tail -n1 temp_response.txt) 
    if [ "$response" != "200" ]; then
        echo "Error: HTTP response $http_code for $url"
        cat temp_response.txt 
        rm temp_response.txt
        exit 1
    fi
    jq '.' < temp_response.txt
    rm temp_response.txt
}

# Fetch the latest workflow run for the specified workflow
LATEST_RUN=$(perform_curl "https://api.github.com/repos/$OWNER/$REPO/actions/workflows/$WORKFLOW_FILE/runs" | jq '.workflow_runs[0]')

# Extract status, conclusion, and artifacts_url
STATUS=$(echo $LATEST_RUN | jq -r '.status')
CONCLUSION=$(echo $LATEST_RUN | jq -r '.conclusion')
ARTIFACTS_URL=$(echo $LATEST_RUN | jq -r '.artifacts_url')

# Check if the status is "completed" and the conclusion is "success"
if [[ "$STATUS" == "completed" && "$CONCLUSION" == "success" ]]; then
    echo "The latest workflow run is completed successfully."

    # Fetch artifacts details
    ARTIFACTS=$(perform_curl "$ARTIFACTS_URL")

    # Parse and display artifact information
    ARTIFACTS_COUNT=$(echo $ARTIFACTS | jq '.total_count')
    echo "Found $ARTIFACTS_COUNT artifact(s)."
  
    if [[ "$ARTIFACTS_COUNT" -gt 0 ]]; then
        # Loop through each artifact and print details
        echo $ARTIFACTS | jq -c '.artifacts[]' | while read -r ARTIFACT; do
            NAME=$(echo $ARTIFACT | jq -r '.name')
            DOWNLOAD_URL=$(echo $ARTIFACT | jq -r '.archive_download_url')
            SIZE=$(echo $ARTIFACT | jq -r '.size_in_bytes')
            CREATED_AT=$(echo $ARTIFACT | jq -r '.created_at')
            EXPIRES_AT=$(echo $ARTIFACT | jq -r '.expires_at')

            echo "Artifact: $NAME"
            echo "Size: $SIZE bytes"
            echo "Created at: $CREATED_AT"
            echo "Expires at: $EXPIRES_AT"
            echo "Download URL: $DOWNLOAD_URL"
            echo "--------------------------------"
        done

        # Download the first artifact
        DOWNLOAD_URL=$(echo $ARTIFACTS | jq -r '.artifacts[0].archive_download_url')

        if [ ! -z "$DOWNLOAD_URL" ] && [ "$DOWNLOAD_URL" != "null" ]; then
            DOWNLOAD_PATH="artifact.zip"

            echo "Downloading artifact from $DOWNLOAD_URL..."
            if ! curl -L -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" -o "$DOWNLOAD_PATH" "$DOWNLOAD_URL"; then
                echo "Error downloading artifact."
                exit 1
            fi
            echo "Artifact downloaded to $DOWNLOAD_PATH"
            unzip_artifact "$DOWNLOAD_PATH" "$UNZIP_FOLDER"
        else
            echo "No artifact download URL found."
        fi
    else
        echo "No artifacts found."
    fi
else
    echo "The latest workflow run has not completed successfully."
    exit 1
fi
