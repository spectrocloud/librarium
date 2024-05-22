#!/bin/bash

############################################
# This script checks if a Netlify context is for branch-deploy. 
# Netlify branch-deploy contexts are only allowed for branches that match version-*. This script is used in the Netlify build settings to determine if a preview should be created.
# This script is created to prevent both a build-preview and a branch-deploy preview from being created for the same branch at the same time.
############################################

target_branch=$1
context=$CONTEXT

# Get current branch name
current_branch=$(git branch --show-current)

# Use HEAD if current_branch is empty
[ -z "$current_branch" ] && current_branch="$HEAD"

echo "Current branch name: $current_branch"
echo "Context: $context"

# Initialize allowed flag
allowed=1

# Check if context is branch-deploy and current branch matches version-*
if [[ "$context" == "branch-deploy" ]]; then
  if [[ "$current_branch" == version-* ]]; then
    allowed=1
  else
    allowed=0
  fi
fi

# Exit based on allowed flag
if [ $allowed -eq 1 ]; then
  echo "Allowed to create a Netlify preview"
  exit 1
else
  echo "Not allowed to create a Netlify preview"
  exit 0
fi