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
#
# --match-sha <sha> asks for the reference set built from a specific commit, normally the
# base commit the pull request is merging into. When a matching set exists the visual diff
# shows only what the PR itself changed. When it does not, the script falls back to the
# newest usable set and says so, rather than failing or triggering a fresh capture, which
# would add roughly 30 minutes to the run. See DOC-3103 addendum.
CHECK_ONLY=false
MATCH_SHA=""
while [ $# -gt 0 ]; do
    case "$1" in
        --check-only) CHECK_ONLY=true; shift ;;
        --match-sha)
            # Guard the value explicitly. Without this, `--match-sha` as the final argument
            # makes `shift 2` fail on a single remaining positional, and `set -e` then kills
            # the script with no message at all.
            if [ $# -lt 2 ]; then
                echo "Error: --match-sha requires a commit SHA." >&2
                exit 1
            fi
            MATCH_SHA="$2"; shift 2 ;;
        *)            break ;;
    esac
done

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
# screenshot_capture.yaml's own run list.
#
# The original reason was that the workflow only ran through `workflow_call` from
# release.yaml, and a called workflow gets no entry under the callee's runs endpoint, so
# scoping the search to screenshot_capture.yaml found nothing but stale workflow_dispatch
# runs. See DOC-3103. That call is gone as of the DOC-3103 addendum and captures now run on
# push, which do get their own entries, so a scoped query would work today.
#
# Keep the repository-wide query anyway: it is agnostic about which trigger produced a set,
# so a workflow_dispatch capture and any future caller are both discoverable without
# touching this code.
ARTIFACTS=$(perform_curl "https://api.github.com/repos/$OWNER/$REPO/actions/artifacts?name=$ARTIFACT_NAME&per_page=100")

TOTAL_COUNT=$(echo "$ARTIFACTS" | jq -r '.total_count')
echo "Found $TOTAL_COUNT artifact(s) named '$ARTIFACT_NAME' in $OWNER/$REPO."

# GitHub keeps expired artifacts in the listing with "expired": true, and still advertises an
# archive_download_url for them. Downloading one returns 410 Gone, whose error body lands on
# disk as a file unzip cannot read, surfacing as a bare "exit code 9". Filter them out first.
#
# Selection is two-tier. The artifacts API already reports which commit each set was built
# from, in workflow_run.head_sha, so no artifact renaming is needed to key sets by commit.
# Prefer an exact match on the requested commit; otherwise take the newest usable set.
SELECTED=""
MATCH_KIND=""

if [ -n "$MATCH_SHA" ]; then
    SELECTED=$(echo "$ARTIFACTS" | jq -c --arg sha "$MATCH_SHA" '
        [.artifacts[]
         | select(.expired == false)
         | select(.workflow_run.head_sha == $sha)]
        | sort_by(.created_at) | reverse | .[0] // empty')
    [ -n "$SELECTED" ] && MATCH_KIND="exact"
fi

if [ -z "$SELECTED" ]; then
    SELECTED=$(echo "$ARTIFACTS" | jq -c '
        [.artifacts[] | select(.expired == false)]
        | sort_by(.created_at) | reverse | .[0] // empty')
    [ -n "$SELECTED" ] && [ -n "$MATCH_SHA" ] && MATCH_KIND="fallback"
    [ -n "$SELECTED" ] && [ -z "$MATCH_SHA" ] && MATCH_KIND="newest"
fi

if [ -z "$SELECTED" ]; then
    echo "No unexpired '$ARTIFACT_NAME' artifact is available ⛔"
    echo ""
    echo "Reference screenshots are produced by screenshot_capture.yaml, which runs on every"
    echo "push to master. Every candidate below has passed its 3-day retention window, so no"
    echo "capture has completed successfully in that time. Check that workflow's recent runs."
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
SOURCE_SHA=$(echo "$SELECTED" | jq -r '.workflow_run.head_sha // "unknown"')
DOWNLOAD_URL=$(echo "$SELECTED" | jq -r '.archive_download_url')

echo "Selected '$ARTIFACT_NAME' artifact ✅"
echo "  id:          $ARTIFACT_ID"
echo "  created:     $CREATED_AT"
echo "  expires:     $EXPIRES_AT"
echo "  size:        $SIZE_BYTES bytes"
echo "  source run:  $SOURCE_RUN"
echo "  built from:  $SOURCE_SHA"

# State plainly whether the diff is attributable to this PR alone. Without this line a
# reviewer cannot tell whether an unexpected visual change came from the PR or from master
# moving underneath it, which was the original complaint that motivated this work.
case "$MATCH_KIND" in
    exact)
        echo "  match:       EXACT, this set was built from the commit being merged into."
        echo "               Any difference in the report is attributable to this PR."
        ;;
    fallback)
        echo "  match:       FALLBACK, no set exists for the requested commit $MATCH_SHA."
        echo "               Differences may include changes made on master between"
        echo "               $SOURCE_SHA and $MATCH_SHA, not just this PR's changes."
        echo ""
        echo "               Before treating that as contamination, compare the two commits."
        echo "               screenshot_capture.yaml skips commits touching only .github/**,"
        echo "               because they build a byte-identical site. If everything between"
        echo "               them is workflow-only, this set is still a correct reference and"
        echo "               the diff is attributable to this PR after all."
        ;;
    newest)
        echo "  match:       NEWEST, no specific commit was requested."
        ;;
esac

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
