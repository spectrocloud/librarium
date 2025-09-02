#!/bin/bash

# Set variables for GitHub API
ACCESS_TOKEN=$ACCESS_TOKEN
DELAY=1  # seconds between requests
# Developer portal links to check with dots (.) escaped
DEVELOPER_PORTAL_LINKS=(
    "developers\.redhat\.com"
    "www\.intel\.com"
    "github\.com"
)
LINKS_FILE="all_links.txt"
BROKEN_LINKS_FILE="link_report_developer_portals.txt"
CACHE_FILE="developer_portal_cache.txt"
TOO_MANY_REQUESTS=429
MAX_RETRIES=5 # maximum number of retries for a single URL
RETRY_DELAY=10  # increment seconds to wait before retrying

# Create cache file if it doesn't exist
touch "$CACHE_FILE"
touch "$BROKEN_LINKS_FILE"
touch "$LINKS_FILE"

echo "⏭️ Starting checks for Developer Portal URLs in Docs."

# Find all Developer Portal links in the documentation /docs and /partials directories.
# Strip all parentheses and anchors from the links, as they will be heavily throttled by GitHub.
for portal in "${DEVELOPER_PORTAL_LINKS[@]}"; do
    grep -rHoE '\(https?://'"$portal"'/[^") ]+' \
        --include="*.md" \
        --include="*.mdx" \
        ./docs ./_partials | \
        sed 's/[()]//g' | \
        sed 's/#.*$//' >> "$LINKS_FILE"
done

if [[ -n "$ACCESS_TOKEN" ]]; then
    echo "🔏 Access token found. We will use it for authentication where possible."
else
    echo "🟡 Access token not found. You may be rate-limited by GitHub."
fi

# Function to make a request to the URL and get the status code for GitHub.
# Params:
# $1 - url
make_request_github () {
    url=$1
    status_code=""
    if [[ -n "$ACCESS_TOKEN" ]]; then
        status_code=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $ACCESS_TOKEN" -A "Spectro-URL-Checker" "$url")
    else
        status_code=$(make_request "$url")
    fi
    
    echo "$status_code"
}

# Function to make a request to the URL and get the status code.
# Params:
# $1 - url
make_request () {
    url=$1
    status_code=$(curl -s -o /dev/null -w "%{http_code}" -A "URL-Checker" "$url")
    echo "$status_code"
}

# Function to retry the URL request if it fails with a 429 status code.
# Params: 
# $1 - url
retry_url_get() {
    url=$1
    retries=0
    status_code=""

    while [[ $retries -lt $MAX_RETRIES ]]; do
        # Make the request and get the status code
        if [[ $url == *"github"* ]]; then
            status_code=$(make_request_github "$url")
        else
            status_code=$(make_request "$url")
        fi

        code=$(echo "$status_code" | cut -d' ' -f1)
        # Check if the status code is 429 (Too Many Requests)
        if [[ "$code" =~ ^[0-9]{3}$ && "$code" -eq $TOO_MANY_REQUESTS ]]; then
            # Calculate the delay based on the number of retries
            # This is a simple exponential backoff strategy.
            delay=$(( RETRY_DELAY * (retries + 1) ))
            echo "🔄 Rate limit hit for $url. Retrying in $delay seconds..." >&2
            sleep $delay
            ((retries++))
        else
            break
        fi
    done

    # If we exhausted all retries, return the last status code
    echo "$status_code"
}

# Function to get the status code of a URL, either from the cache or by making a request.
# Params: 
# $1 - url
get_url_status_code() {
    url=$1

    # Check if the URL is already in the cache
    cached_status=$(grep -F "$url" "$CACHE_FILE" | cut -d' ' -f1)
    if [[ -n "$cached_status" ]]; then
        echo "$cached_status"
        return 0
    fi

    # Not cached – call retry logic
    status_code=$(retry_url_get "$url")

    echo "$status_code $url" >> "$CACHE_FILE"
    echo "$status_code"
}

while IFS= read -r line; do
    # Skip empty lines
    [[ -z "$line" ]] && continue

    filename="${line%%:*}"  # everything before the first colon
    url="${line#*:}"        # everything after the first colon
    
    # Skip if the URL is empty
    [[ -z "$url" ]] && continue

    echo "Checking Developer Portal link: $url"

    # Get the status code, either from GH or from the cache
    status_code=$(get_url_status_code "$url")

    code=$(echo "$status_code" | cut -d' ' -f1)
    # Consider all statuses larger than 400 as errors
    if [[ "$code" =~ ^[0-9]{3}$ && "$code" -gt 400 ]]; then
        echo "$filename:$url" >> "$BROKEN_LINKS_FILE"
    fi 

    # Delay to avoid hitting rate limits on non-API endpoints. 
    sleep $DELAY
done < "$LINKS_FILE"

echo "✅ Completed checks for Developer Portal URLs in Docs."

# Cleanup
rm -f $LINKS_FILE
rm -f $CACHE_FILE

