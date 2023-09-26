#!/bin/sh

while read local_ref local_sha remote_ref remote_sha
do
  branch=$(echo $local_ref | sed 's!refs/heads/!!')
  
  if [[ $branch == version-* ]]; then
    echo "🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫"
    echo "Pushing to the remote branch '$branch' is not allowed."
    echo "Branches that start with 'version-' are protected."
    echo "If you need to override this rule for version branch creation or manual cherry picking, use the --no-verify flag with the git commit command."
    echo "Ask the team if you need help or if you are unsure."
    exit 1
  fi
done
