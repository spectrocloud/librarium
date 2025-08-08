#!/bin/bash

BRANCH_NAME=$(git symbolic-ref --short HEAD)

# Don't allow commits to branches that contain "release" in their name
DISALLOWED_PATTERNS=(".*release.*")

for pattern in "${DISALLOWED_PATTERNS[@]}"; do
  if [[ "$BRANCH_NAME" =~ $pattern ]]; then
    echo "❌ Commit blocked: '$BRANCH_NAME' contains the word release."
    echo "ℹ️ Rename your branch using the command git branch -m and commit again."
    exit 1
  fi
done
    echo "✅ Branch name '$BRANCH_NAME' is valid."