#!/usr/bin/env bash
# Picks backport labels for a link fix, the way the weekly fix PRs do by hand.
# The Backport workflow cherry-picks the merged fix, so a version branch gets a
# label only when the patch applies there cleanly. A branch that still has a
# removed URL but where the patch does not apply needs a manual backport.
#
# Usage: backport-labels.sh <fix.patch> <oldest-branch> <out-dir>
# Writes <out-dir>/backport-labels.txt (one label per line) and
# <out-dir>/manual-backports.txt (one branch per line).
set -euo pipefail

patch=$(realpath "$1")
oldest=$2
out=$3
: > "$out/backport-labels.txt"
: > "$out/manual-backports.txt"

# URLs on removed lines that no added line keeps.
removed=$(mktemp)
grep -oE 'https?://[^][:space:]()"'"'"'<>`]+' <(grep -E '^-[^-]' "$patch") | sort -u > "$removed.old" || true
grep -oE 'https?://[^][:space:]()"'"'"'<>`]+' <(grep -E '^\+[^+]' "$patch") | sort -u > "$removed.new" || true
comm -23 "$removed.old" "$removed.new" > "$removed"

branches=$(git ls-remote --heads origin 'refs/heads/version-*' | sed 's|.*refs/heads/||' | sort -V)
for b in $branches; do
  # Supported branches only: $oldest and newer.
  [[ $(printf '%s\n%s\n' "$oldest" "$b" | sort -V | head -n 1) == "$oldest" ]] || continue
  git fetch --quiet --depth=1 origin "$b"
  index=$(mktemp)
  if GIT_INDEX_FILE=$index git read-tree FETCH_HEAD && GIT_INDEX_FILE=$index git apply --cached --check "$patch" 2> /dev/null; then
    echo "backport-$b" >> "$out/backport-labels.txt"
    echo "$b: the fix applies cleanly"
  elif [[ -s $removed ]] && git grep -q -F -f "$removed" FETCH_HEAD -- docs _partials; then
    echo "$b" >> "$out/manual-backports.txt"
    echo "$b: has a removed URL, but the fix does not apply cleanly"
  else
    echo "$b: nothing to backport"
  fi
  rm -f "$index"
done
rm -f "$removed" "$removed.old" "$removed.new"
