#!/bin/bash

# List of branches to NOT create a Netlify preview
allowed_branches=("master" "version-*", "release-*")

# Read the environment variable
branch_name=$BRANCH

# Initialize a flag to check if the branch is not allowed
not_allowed=0

# Compare $BRANCH against the list
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
  exit 0
else
  exit 1
fi
