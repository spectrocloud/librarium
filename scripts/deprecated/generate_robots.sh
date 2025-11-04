#!/bin/bash

###################################################################################################
# This script is used to generate the robots.txt file for Spectro Cloud Docs.                     
# The script uses the auto-generated versions.json file to generate the Disallow statements for the robots.txt file.
# This script is invoked by the versions.sh script.
###################################################################################################      

set -euo pipefail

baseDir="$PWD"
versionFile=$1
destinationFolder=$2

# Read the JSON array values into a Bash array
disallowed_versions=($(jq -r '.[]' $versionFile))

# Echo contents of the disallowed_versions array
echo "Disallowed versions: ${disallowed_versions[@]}"

# Create or truncate the robots.txt file
: > robots.txt

# Add content to block AI bots
cat $baseDir/scripts/ai_robots.txt >> robots.txt
echo "" >> robots.txt

# Append User-agent statement to the robots.txt file
echo "User-agent: *" >> robots.txt


for version in "${disallowed_versions[@]}"; do
    # Escape forward slashes for sed
    version_escaped=$(echo "$version" | sed 's/\//\\\//g')
    # Append the modified Disallow statements to the robots.txt file
    echo "Disallow: /${version_escaped}/" >> robots.txt
    echo "Disallow: /api/${version_escaped}" >> robots.txt
done

# Append the Allow statement to the robots.txt file
echo "Allow: /$" >> robots.txt

# Append the sitemap statement to the robots.txt file
echo "Sitemap: https://docs.spectrocloud.com/sitemap.xml" >> robots.txt

# Overwrite the existing robots.txt file with the newly generated one
mv robots.txt $destinationFolder/robots.txt
