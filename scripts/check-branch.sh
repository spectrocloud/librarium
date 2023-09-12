#!/bin/sh

zero_commit="0000000000000000000000000000000000000000"

while read local_ref local_sha remote_ref remote_sha
do
  if [ "$remote_sha" = "$zero_commit" ]; then
    branch=$(echo $local_ref | sed 's!refs/heads/!!')

    if [[ $branch == version-* ]]; then
      echo "Branch names starting with 'version-' are not allowed."
      echo "If you need to override for version branch creation, use the ---no-verify flag."
      exit 1
    fi
  fi
done
