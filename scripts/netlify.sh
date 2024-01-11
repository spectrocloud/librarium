#!/bin/bash

# List of branches to NOT create a Netlify preview
# Master branch does not need a preview
# Release branches get a preview through docs-latest.spectrocloud.com


# List of branches to NOT create an automatic Netlify preview. This also includes branch-deploy previews.
disallowed_branches=("master" "release-*")

# Get current branch name
current_branch=$(git branch --show-current)

# Use HEAD if current_branch is empty
[ -z "$current_branch" ] && current_branch="$HEAD"

echo "Branch name: $current_branch"

# Initialize not_allowed flag
not_allowed=0

# Compare current_branch against disallowed list
for disallowed in "${disallowed_branches[@]}"
do
  if [[ "$current_branch" == $disallowed ]]; then
    not_allowed=1
    break
  fi
done

# Exit based on not_allowed flag
if [ $not_allowed -eq 1 ]; then
  echo "Not allowed to create a Netlify preview"
  exit 0
else
  echo "Allowed to create a Netlify preview"
  exit 1
fi
