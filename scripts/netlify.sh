#!/bin/bash

target_branch=$1
context=$CONTEXT

# Get current branch name
current_branch=$(git branch --show-current)

# Use HEAD if current_branch is empty
[ -z "$current_branch" ] && current_branch="$HEAD"

echo "Current branch name: $current_branch"
echo "Target branch name: $target_branch"
echo "Context: $context"

# Initialize allowed flag
allowed=0

# Check if context is branch-deploy and current branch matches version-*
if [[ "$context" == "branch-deploy" && "$current_branch" == version-* ]]; then
  allowed=1
fi

# Exit based on allowed flag
if [ $allowed -eq 1 ]; then
  echo "Allowed to create a Netlify preview"
  exit 0
else
  echo "Not allowed to create a Netlify preview"
  exit 1
fi
