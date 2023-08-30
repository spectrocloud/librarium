#!/bin/bash

# List of branches to NOT create a Netlify preview
allowed_branches=("master" "version-*" "release-*" "backport-updates")

echo "Branch name: $HEAD"

# Read the environment variable
branch_name=$HEAD

# Initialize a flag to check if the branch is not allowed
not_allowed=0

# Compare $HEAD against the list
for allowed in "${allowed_branches[@]}"
do
  # Use double brackets and == for pattern matching
  if [[ "$branch_name" == $allowed ]]; then
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
