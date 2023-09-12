#!/bin/bash

# List of branches to NOT create a Netlify preview
# Master branch does not need a preview
# Release branches get a preview through docs-latest.spectrocloud.com
disallowed_branches=("master" "release-*","version-*")

echo "Branch name: $HEAD"

# Read the environment variable
branch_name=$HEAD

# Initialize a flag to check if the branch is not allowed
not_allowed=0

# Compare $HEAD against the list
for disallowed in "${disallowed_branches[@]}"
do
  # Use double brackets and == for pattern matching
  if [[ "$branch_name" == $disallowed ]]; then
    not_allowed=1
    break
  fi
done

# Exit accordingly
if [ $not_allowed -eq 1 ]; then
  echo "Not allowed to create a Netlify preview"
  exit 0
else
  echo "Allowed to create a Netlify preview"
  exit 1
fi
