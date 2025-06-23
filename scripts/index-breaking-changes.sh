#!/bin/bash

set -e

RELEASE_NOTES_PATH="docs/docs-content/release-notes/release-notes.md"
OLD_RELEASE_NOTES_PATH="docs/docs-content/release-notes.md"
BREAKING_CHANGES_PARTIALS_PATH="_partials/breaking-changes"

# Function to create partials file for breaking changes
# Params:
# $1 - release number, example: 4.0.0
create_partials_file () {
  release_number=$1
  filename="$BREAKING_CHANGES_PARTIALS_PATH/br_$release_number.mdx"
  
  # Create the directory if it doesn't exist
  mkdir -p $BREAKING_CHANGES_PARTIALS_PATH

  # Create file if it doesn't exist
  if [ ! -f "$filename" ]; then
    {
      echo "---"
      echo "partial_category: breaking-changes"
      echo "partial_name: $release_number"
      echo "---"
      echo ""
    } >> "$filename"
  fi
}

# Function to add breaking changes body to the partials file
# Params:
# $1 - release number, example: 4.0.0
# $2 - body text of the breaking change
add_breaking_changes_body() {
  release_number=$1
  filename="$BREAKING_CHANGES_PARTIALS_PATH/br_$release_number.mdx"
  line=$2
  new_line="$line"

  # Loop through all markdown-style links
  while [[ "$new_line" == *"["*"]("*")"* ]]; do
    # Extract link text
    link_text="${new_line#*\[}"
    link_text="${link_text%%]*}"

    # Extract full link target (everything inside the first (...))
    temp="${new_line#*](}"
    full_link="${temp%%)*}"

    # Skip full external links (http, https)
    if [[ "$full_link" == http* ]]; then
      break  # or use `continue` if inside a larger loop
    fi

    # Normalize: remove leading ../ if present
    if [[ "$full_link" == ../* ]]; then
      clean_link="${full_link:3}"
    elif [[ "$full_link" == /* ]]; then
      clean_link="${full_link:1}"  # remove leading /
    else
      clean_link="$full_link"
    fi

    # Remove any #fragment
    clean_link="${clean_link%%#*}"

    # Remove .md or .mdx extensions
    clean_link="${clean_link%.md}"
    clean_link="${clean_link%.mdx}"

    # Build JSX
    link_url="/$clean_link"

    # Remove duplicate path segments for sections. 
    # For example, enterprise-version/enterprise-version.md
    IFS='/' read -ra segments <<< "$clean_link"
    len=${#segments[@]}
    if (( len >= 2 )) && [[ "${segments[len-1]}" == "${segments[len-2]}" ]]; then
      unset 'segments[len-1]'
      clean_link=$(IFS='/'; echo "${segments[*]}")
      link_url="/$clean_link"
    fi

    markdown_link="[$link_text]($full_link)"
    jsx_link="<VersionedLink text=\"$link_text\" url=\"$link_url\" />"

    # Replace first instance only
    new_line="${new_line/"$markdown_link"/$jsx_link}"
  done

  echo "$new_line" >> "$filename"
}

# Function to clean up files by removing multiple blank lines.
clean_files() {
  for file in $BREAKING_CHANGES_PARTIALS_PATH/*.mdx; do
    echo "Cleaning $file"
    # Replace multiple blank lines with a single blank line
    awk 'NF { blank=0 } !NF { if (!blank) print ""; blank=1; next } { print }' "$file" > tmpfile && mv tmpfile "$file"
  done
}

# Save the current branch name
current_branch=$(git branch --show-current)

# If current branch is empty, then use master
if [ -z "$current_branch" ]; then
    current_branch="master"
fi

echo "Current branch: $current_branch"

# Fetch all branches from the remote
git fetch -p origin

# Remove leading spaces and remote prefix (if any)
# Sort and remove duplicates.
# Exclude the version-3-4 branch.
branches=$(
    git branch -a | 
    sed 's/ *//;s/remotes\/origin\///' | 
    grep -E '^version-[0-9]+(-[0-9]+)*$' | 
    grep -v '^version-3-4$' | 
    sort | 
    uniq
)

# Loop through each branch to fetch it locally
for b in $branches; do
  # Fetch the remote branch to corresponding local branch
  git fetch origin $b:$b
done

echo $branches

# Make sure we are in a clean state for repeatable runs.
rm -rf $BREAKING_CHANGES_PARTIALS_PATH

for branch in $branches; do
  echo "Checking branch: $branch"
  release_notes_path="$RELEASE_NOTES_PATH"
  if [ "$branch" = "version-4-0" ] || [ "$branch" = "version-4-1" ]; then
    release_notes_path="$OLD_RELEASE_NOTES_PATH"
  fi

  # Switch to the version branch
  git checkout "$branch"

  # Pull the latest changes 
  git pull origin "$branch"

  in_breaking_changes=false
  release_number=""
  # Read the release notes file line by line.
  while IFS= read -r line; do
    # If the line is an H2 that contains "Release", we extract the number and begin processing.
    if echo "$line" | grep -q "##.*Release"; then
      release_number=$(
        echo "$line" |
        cut -c4- |
        sed -E 's/\{#.*\}//' |                                   # Remove markdown anchor fragments
        sed -E 's/.*Release[[:space:]]+//' |                     # Remove everything before 'Release'
        sed -E 's/.* -[[:space:]]*([0-9]+\.[0-9]+\.[0-9]+).*/\1/' |  # Extract last version in range
        sed -E 's/^([0-9]+\.[0-9]+\.[0-9]+).*/\1/' |               # Extract version if no range
        tr '.' '_'          # Replace dots with underscores as they cause errors in partials 
      )
      # New release version, set breaking changes to false.
      in_breaking_changes=false
      continue
    fi

    # Find any breaking changes headings if we have detected the version heading.
    # Breaking changes must be H3 or more.
    if [ -n "$release_number" ] && echo "$line" | grep -iq '^###\+#*[[:space:]]*Breaking changes'; then
      in_breaking_changes=true
      create_partials_file $release_number
      continue
    fi

    if [ -n "$release_number" ] && $in_breaking_changes; then
      # If we are in breaking changes and the line is a heading then exit breaking changes mode. 
      if echo "$line" | grep -q '^[[:space:]]*#'; then
        in_breaking_changes=false
        continue
      fi
      
      add_breaking_changes_body "$release_number" "$line"
    fi

  done < "$release_notes_path"
done

clean_files

git checkout "$current_branch"
echo "All branches checked. Current branch restored to: $current_branch"
