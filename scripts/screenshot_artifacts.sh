#!/bin/bash

####################################################################################################
# This script downloads the most recent unexpired "screenshots" artifact, which holds the reference
# screenshots that visual comparison tests are diffed against.
# The assumption is that this script is executed in a GitHub Actions environment.
# The artifact is unzipped into a folder named "screenshots" by default, dropped one level above the
# script location, or into the folder passed as the first argument.
# The script requires the GITHUB_TOKEN environment variable to be set with a valid GitHub token,
# and the calling job needs `actions: read` permission. Otherwise the artifacts cannot be downloaded.
####################################################################################################

set -e

# --check-only verifies that a usable artifact exists and exits without downloading it.
# Callers use this as a cheap preflight so a missing reference set fails one job early
# rather than failing every shard after each has already built and downloaded. See DOC-3103.
CHECK_ONLY=false
if [ "$1" = "--check-only" ]; then
    CHECK_ONLY=true
    shift
fi

DESTINATION_FOLDER=$1

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
ARTIFACT_NAME="screenshots"
UNZIP_FOLDER="${DESTINATION_FOLDER:-screenshots}"

perform_curl() {
    local url=$1
    local http_code
    # Deliberately no -f: on an error status we want the response body kept so the message
    # below can quote GitHub's own explanation instead of just a bare curl exit code.
    http_code=$(curl -sS -w "%{http_code}" -o temp_response.txt \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" "$url")
    if [ "$http_code" != "200" ]; then
        echo "Error: HTTP $http_code for $url" >&2
        cat temp_response.txt >&2
        rm -f temp_response.txt
        exit 1
    fi
    jq '.' < temp_response.txt
    rm -f temp_response.txt
}

# Fetch every artifact named "screenshots" across the repository.
#
# This deliberately queries the repository-wide artifacts endpoint rather than
# screenshot_capture.yaml's own run list. That workflow is invoked through `workflow_call`
# from release.yaml on a schedule, and a called workflow does not get its own entry under
# the callee's runs endpoint. Scoping the search to screenshot_capture.yaml therefore only
# ever finds manual workflow_dispatch runs, whose artifacts have usually expired, while
# fresh scheduled artifacts sit unused. See DOC-3103.
ARTIFACTS=$(perform_curl "https://api.github.com/repos/$OWNER/$REPO/actions/artifacts?name=$ARTIFACT_NAME&per_page=100")

TOTAL_COUNT=$(echo "$ARTIFACTS" | jq -r '.total_count')
echo "Found $TOTAL_COUNT artifact(s) named '$ARTIFACT_NAME' in $OWNER/$REPO."

# GitHub keeps expired artifacts in the listing with "expired": true, and still advertises an
# archive_download_url for them. Downloading one returns 410 Gone, whose error body lands on
# disk as a file unzip cannot read, surfacing as a bare "exit code 9". Filter them out first.
SELECTED=$(echo "$ARTIFACTS" | jq -c '
    [.artifacts[] | select(.expired == false)]
    | sort_by(.created_at) | reverse | .[0] // empty')

if [ -z "$SELECTED" ]; then
    echo "No unexpired '$ARTIFACT_NAME' artifact is available ⛔"
    echo ""
    echo "Reference screenshots are produced by screenshot_capture.yaml, which release.yaml"
    echo "calls on a schedule. Every candidate below has passed its retention window, which"
    echo "means that schedule has not produced a usable artifact recently."
    echo ""
    echo "Most recent '$ARTIFACT_NAME' artifacts:"
    echo "$ARTIFACTS" | jq -r '.artifacts | sort_by(.created_at) | reverse | .[0:5][]
        | "  id=\(.id) created=\(.created_at) expires=\(.expires_at) expired=\(.expired)"'
    exit 1
fi

ARTIFACT_ID=$(echo "$SELECTED" | jq -r '.id')
CREATED_AT=$(echo "$SELECTED" | jq -r '.created_at')
EXPIRES_AT=$(echo "$SELECTED" | jq -r '.expires_at')
SIZE_BYTES=$(echo "$SELECTED" | jq -r '.size_in_bytes')
SOURCE_RUN=$(echo "$SELECTED" | jq -r '.workflow_run.id // "unknown"')
DOWNLOAD_URL=$(echo "$SELECTED" | jq -r '.archive_download_url')

echo "Selected '$ARTIFACT_NAME' artifact ✅"
echo "  id:         $ARTIFACT_ID"
echo "  created:    $CREATED_AT"
echo "  expires:    $EXPIRES_AT"
echo "  size:       $SIZE_BYTES bytes"
echo "  source run: $SOURCE_RUN"

if [ "$CHECK_ONLY" = true ]; then
    echo "Check-only mode: a usable reference set exists, skipping download."
    exit 0
fi

DOWNLOAD_PATH="artifact.zip"
echo "Downloading '$ARTIFACT_NAME' artifact from $DOWNLOAD_URL..."
# -f here so an HTTP error, for example a 410 on an artifact that expired between the listing
# call and this one, fails immediately with a clear message rather than writing the error body
# to artifact.zip and failing later inside unzip.
if ! curl -sS -f -L \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        -o "$DOWNLOAD_PATH" "$DOWNLOAD_URL"; then
    echo "Error downloading '$ARTIFACT_NAME' artifact $ARTIFACT_ID ⛔"
    rm -f "$DOWNLOAD_PATH"
    exit 1
fi

# Confirm the payload really is a readable archive before handing it to unzip, so a truncated
# or unexpected response is reported as such instead of as an opaque unzip exit code.
if ! unzip -tq "$DOWNLOAD_PATH" >/dev/null 2>&1; then
    echo "Downloaded file is not a readable zip archive ⛔"
    ls -l "$DOWNLOAD_PATH"
    echo "First bytes of the response:"
    head -c 200 "$DOWNLOAD_PATH" | tr -d '\0'
    echo ""
    rm -f "$DOWNLOAD_PATH"
    exit 1
fi

echo "'$ARTIFACT_NAME' artifact downloaded to $DOWNLOAD_PATH"
unzip_artifact "$DOWNLOAD_PATH" "$UNZIP_FOLDER"
