#!/bin/bash

# List of branches to NOT create a Netlify preview
# Master branch does not need a preview
# Release branches get a preview through docs-latest.spectrocloud.com


# List of branches to NOT create an automatic Netlify preview. This also includes branch-deploy previews.
disallowed_branches=("master" "release-*")
target_branch=$TARGET_BRANCH

# Get current branch name
current_branch=$(git branch --show-current)

# Use HEAD if current_branch is empty
[ -z "$current_branch" ] && current_branch="$HEAD"

echo "Branch name: $current_branch"
echo "Target branch: $target_branch"
echo "Head" $HEAD
echo "Branch" $BRANCH
echo "Review ID": $REVIEW_ID

# Initialize not_allowed flag
not_allowed=0

# Compare current_branch against disallowed list
for disallowed in "${disallowed_branches[@]}"
do
  if [[ "$disallowed" == *"*" ]]; then
    # Handle wildcard match for current_branch
    prefix="${disallowed%-*}"
    if [[ "$current_branch" == "$prefix"* ]]; then
      not_allowed=1
      break
    fi
  else
    # Exact match for current_branch
    if [[ "$current_branch" == "$disallowed" ]]; then
      not_allowed=1
      break
    fi
  fi
done

# Compare target_branch against disallowed list
for disallowed in "${disallowed_branches[@]}"
do
  if [[ "$disallowed" == *"*" ]]; then
    # Handle wildcard match for target_branch
    prefix="${disallowed%-*}"
    if [[ "$target_branch" == "$prefix"* ]]; then
      not_allowed=1
      break
    fi
  else
    # Exact match for target_branch
    if [[ "$target_branch" == "$disallowed" ]]; then
      not_allowed=1
      break
    fi
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