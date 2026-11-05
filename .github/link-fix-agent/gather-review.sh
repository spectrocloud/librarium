#!/usr/bin/env bash
# Runs pr-review-buddy's Phase 1 and its Vale and VersionedLink checks on the
# working-tree diff, before the reviewer starts. The reviewer then needs no
# GitHub token and almost no shell. review-in-ci.md describes the outputs.
#
# Usage: gather-review.sh <review-dir> <pr-title>
set -euo pipefail

dir=$1
title=$2
mkdir -p "$dir/added"
git diff > "$dir/pr.diff"
files=()
while IFS= read -r f; do files+=("$f"); done < <(git diff --name-only)
jq -n --arg title "$title" '{title: $title, base: "master", files: $ARGS.positional}' --args "${files[@]}" > "$dir/pr.json"
: > "$dir/vale-errors.txt"
: > "$dir/vale-all.txt"
: > "$dir/versionedlink-splits.txt"

for f in "${files[@]}"; do
  [[ $f == *.md || $f == *.mdx ]] || continue
  added="$dir/added/${f//\//__}.txt"
  # PR-head line numbers of the lines the diff adds to this file.
  awk -v f="$f" '/^\+\+\+ /{cur=substr($0,7);next}
    /^@@/{split($3,a,/[+,]/);ln=a[2];next}
    /^\+/{if(cur==f)print ln;ln++;next}
    /^ /{ln++}' "$dir/pr.diff" > "$added"
  # Vale exits non-zero when it finds errors; keep only alerts on added lines.
  { vale --no-global --config .vale.ini --minAlertLevel=error --output=line "$f" || true; } \
    | awk -F: 'NR==FNR{ok[$1];next} ($2 in ok)' "$added" - >> "$dir/vale-errors.txt"
  { vale --no-global --config .vale.ini --output=line "$f" || true; } \
    | awk -F: 'NR==FNR{ok[$1];next} ($2 in ok)' "$added" - >> "$dir/vale-all.txt"
  # A paragraph that starts with <VersionedLink while the previous line ends mid-sentence.
  [[ $f == *.md ]] && awk 'FNR == 1 { blank = 0; last = "" }
    /^[[:space:]]*$/ { blank = 1; next }
    blank && /^[[:space:]]*<VersionedLink[[:space:]]/ && last != "" &&
      last !~ /(^[[:space:]]*#.*|[.:!?>|`]|---)[[:space:]]*$/ { print FILENAME ":" FNR ": " $0 }
    { blank = 0; last = $0 }' "$f" >> "$dir/versionedlink-splits.txt"
done

echo "Review inputs for ${#files[@]} files in $dir"
wc -l "$dir/vale-errors.txt" "$dir/vale-all.txt" "$dir/versionedlink-splits.txt"
