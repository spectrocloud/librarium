#!/bin/bash

############################################
# This script checks if a Netlify context is for branch-deploy. 
# Netlify branch-deploy contexts are only allowed for branches that match version-*. This script is used in the Netlify build settings to determine if a preview should be created.
# This script is created to prevent both a build-preview and a branch-deploy preview from being created for the same branch at the same time.
# In the CI/CD pipeline, the scripts netlify_add_branch.sh and netlify_remove_branch.sh are used to manage the allowed branches list in the Netlify build settings.
# The allowed branches list is used to determine which branches are allowed to create a Netlify preview for the purpose on enabling the Netlify Collab drawer.
# By default, only deploy previews targeting the production branch are allowed, unless manually specified in the Netlify site settings. The scripts netlify_add_branch.sh and netlify_remove_branch.sh handle this responsiblity.

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

# Check if context is production and current branch is master or main. If so, exit with a 0  status code.
# This is to prevent a builds for the production branch from creating a branch-deploy preview.
if [[ "$context" == "production" && ("$current_branch" == "master" || "$current_branch" == "main") ]]; then
  exit 0
fi



# Check if context is branch-deploy and current branch matches version-*
if [[ "$context" == "branch-deploy" ]]; then
  if [[ "$current_branch" == version-* ]]; then
    allowed=1
  else
    allowed=0
  fi
fi

# Exit based on allowed flag
# Netlify has inverse exit codes. 1 is allowed, 0 is not allowed.
if [ $allowed -eq 1 ]; then
  echo "Allowed to create a Netlify preview"
  exit 1
else
  echo "Not allowed to create a Netlify preview"
  exit 0
fi