#!/usr/bin/env bash
set -euo pipefail

echo "Current branch: $(git rev-parse --abbrev-ref HEAD)"
WORKING_DIR=$(pwd)

# Always start from a clean main repo
git fetch --prune origin

# Get remote version branches (no locals, no HEAD), exclude version-3-4
mapfile -t branches < <(
  git for-each-ref --format='%(refname:strip=3)' refs/remotes/origin/version-* \
  | grep -v '^HEAD$' \
  | grep -v '^version-3-4$' \
  | sort -u
)

echo "Found ${#branches[@]} version branches:"
printf '  - %s\n' "${branches[@]}"

# Where to place worktrees (unique per run)
WORKTREES_DIR="$(mktemp -d -t librarium-worktrees-XXXXXX)"
echo "Using worktrees dir: $WORKTREES_DIR"

cleanup() {
  # Best-effort cleanup on exit
  echo "Cleaning up worktrees…"
  git worktree prune || true
  rm -rf "$WORKTREES_DIR" || true
}
trap cleanup EXIT

# Optional: force consistent Node/npm in CI (Netlify)
# export NODE_VERSION=20.14.0
# export NPM_VERSION=10.8.1

for b in "${branches[@]}"; do
  echo "==== Processing $b ===="

  wt_path="$WORKTREES_DIR/$b"
  # Ensure the local branch exactly matches the remote tip (-B resets/creates)
  # This prevents drift and avoids detached HEADs.
  git worktree add --force -B "$b" "$wt_path" "origin/$b"

  # Everything below runs isolated in the branch’s worktree
  pushd "$wt_path" >/dev/null

  touch file-$b.txt
  echo "This is branch $b" > file-$b.txt
  cp file-$b.txt "$WORKING_DIR/scripts/file-$b.txt" 
  popd >/dev/null

  # Remove the worktree to keep the workspace small
  git worktree remove --force "$wt_path"

  # Optionally delete the local branch created by -B above (CI-friendly)
  git branch -D "$b" || true

done

# Final tidy
git worktree prune
echo "All branches processed."
