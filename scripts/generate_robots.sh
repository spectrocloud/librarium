#!/bin/bash

set -euo pipefail

# Read the JSON array values into a Bash array
disallowed_versions=($(jq -r '.[]' ../versions.json))

# Echo contents of the disallowed_versions array
echo "Disallowed versions: ${disallowed_versions[@]}"

# Create or truncate the robots.txt file
: > robots.txt

# Append User-agent statement to the robots.txt file
echo "User-agent: *" >> robots.txt

# Loop through each version and append the modified Disallow statements to the robots.txt file
for version in "${disallowed_versions[@]}"; do
    # Escape forward slashes for sed
    version_escaped=$(echo "$version" | sed 's/\//\\\//g')
    # Append the modified Disallow statements to the robots.txt file
    echo "Disallow: /${version_escaped}/" >> robots.txt
done

# Append the Allow statement to the robots.txt file
echo "Allow: /$" >> robots.txt

# Append the Sitemap statement to the robots.txt file
echo "Sitemap: https://docs.spectrocloud.com/sitemap.xml" >> robots.txt

# Overwrite the existing robots.txt file with the newly generated one
mv robots.txt ../static/robots.txt
