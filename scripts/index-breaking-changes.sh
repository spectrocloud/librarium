#!/bin/bash

set -e

RELEASE_NOTES_PATH="docs/docs-content/release-notes/release-notes.md"
OLD_RELEASE_NOTES_PATH="docs/docs-content/release-notes.md"
BREAKING_CHANGES_PARTIALS_PATH="_partials/breaking-changes"
ALL_VERSIONS_PATH="src/components/ReleaseNotesBreakingChanges/versions.json"
WORKING_DIR=$(pwd)

# Where to place worktrees (unique per run)
WORKTREES_DIR="$(mktemp -d -t librarium-worktrees-XXXXXX)"
echo "Using worktrees dir: $WORKTREES_DIR"

cleanup() {
  echo "Cleaning up worktrees..."
  git worktree prune || true
  rm -rf "$WORKTREES_DIR" || true
}
trap cleanup EXIT

# Function to create partials file for breaking changes
# Params:
# $1 - release number, example: 4.0.0
create_partials_file () {
  release_number=$1
  replaced=$(echo "$release_number" | tr '.' '_')  # Replace dots with underscores as they cause errors in partials
  filename="$BREAKING_CHANGES_PARTIALS_PATH/br_$replaced.mdx"

  # Create the directory if it doesn't exist
  mkdir -p $BREAKING_CHANGES_PARTIALS_PATH

  # Create file if it doesn't exist
  if [ ! -f "$filename" ]; then
    {
      echo "---"
      echo "partial_category: breaking-changes"
      echo "partial_name: $release_number"
      echo "---"
      echo ""
    } >> "$filename"
  fi
}

# Function to add breaking changes body to the partials file
# Params:
# $1 - release number, example: 4.0.0
# $2 - body text of the breaking change
add_breaking_changes_body() {
  release_number=$1
  replaced=$(echo "$release_number" | tr '.' '_')
  filename="$BREAKING_CHANGES_PARTIALS_PATH/br_$replaced.mdx"
  new_line=$2

  # If line is empty just append it and return
  if [ -z "$new_line" ]; then
    echo >> "$filename"   # ensures file ends with a newline
    return
  fi

  # Loop: replace one Markdown link per pass, repeat until none remain
  while :; do
    # Extract prefix, first match, and suffix using awk (portable on macOS)
    IFS=$'\n' read -r prefix match suffix < <(
      awk '{
        if (match($0, /\[[^]]+\]\([^)]*\)/)) {
          pre = substr($0, 1, RSTART-1)
          m   = substr($0, RSTART, RLENGTH)
          post= substr($0, RSTART+RLENGTH)
          print pre "\n" m "\n" post
        } else {
          print ""; print ""; print ""
        }
      }' <<< "$new_line"
    )

    # No match -> we're done
    [[ -n "$match" ]] || break

    # Pull link_text and full_link from the matched [text](target)
    link_text=$(echo "$match"   | sed -E 's/^\[([^]]+)\]\(.*\)$/\1/')
    full_link=$(echo "$match"   | sed -E 's/^\[[^]]+\]\(([^)]*)\)$/\1/')

    # Default: keep the original match (so we always advance the loop)
    replacement="$match"

    # Only transform if not external (http/https) and not an image ending in .webp
    if [[ $full_link != http* && $full_link != *.webp ]]; then
      # Normalize path
      clean_link="$full_link"

      # Strip leading ../ or /
      [[ $clean_link == ../* ]] && clean_link="${clean_link:3}"
      [[ $clean_link == /*  ]] && clean_link="${clean_link:1}"

      # Drop #fragment
      clean_link="${clean_link%%#*}"

      # Drop .md / .mdx extensions
      clean_link="${clean_link%.md}"
      clean_link="${clean_link%.mdx}"

      # Remove duplicate last segment if it equals previous (e.g., foo/foo.md)
      IFS='/' read -r -a segments <<< "$clean_link"
      len=${#segments[@]}
      if (( len >= 2 )) && [[ "${segments[len-1]}" == "${segments[len-2]}" ]]; then
        unset 'segments[len-1]'
        clean_link=$(IFS='/'; echo "${segments[*]}")
      fi

      link_url="/$clean_link"
      replacement="<VersionedLink text=\"$link_text\" url=\"$link_url\" />"
    fi

    # Rebuild the line, advancing past the processed match
    new_line="${prefix}${replacement}${suffix}"
  done

  echo "$new_line" >> "$filename"
}

# Function to clean up files by removing multiple blank lines.
clean_files() {
  for file in $BREAKING_CHANGES_PARTIALS_PATH/*.mdx; do
    # Replace multiple blank lines with a single blank line
    awk 'NF { blank=0 } !NF { if (!blank) print ""; blank=1; next } { print }' "$file" > tmpfile && mv tmpfile "$file"
  done
}

# If ALL_VERSIONS_PATH file and BREAKING_CHANGES_PARTIALS_PATH directory already exist, skip the entire script.
# This is to speed local development where we don't need to re-index every time.
if [ -f "$ALL_VERSIONS_PATH" ] && [ -d "$BREAKING_CHANGES_PARTIALS_PATH" ]; then
  echo "$ALL_VERSIONS_PATH file and $BREAKING_CHANGES_PARTIALS_PATH directory already exist. Skipping breaking change indexing."
  exit 0
fi

# Save the current branch name
current_branch=$(git branch --show-current)

# If current branch is empty, then use master
if [ -z "$current_branch" ]; then
    current_branch="master"
fi

echo "Current branch: $current_branch"

# Fetch all branches from the remote
git fetch --prune origin

# Get remote version branches (no locals, no HEAD), exclude version-3-4
branches="$(git for-each-ref --format='%(refname:strip=3)' 'refs/remotes/origin/version-*' \
  | grep -v '^HEAD$' \
  | grep -v '^version-3-4$' \
  | sort -u)"

# Remove files for repeatable runs.
rm -rf $BREAKING_CHANGES_PARTIALS_PATH
rm -f $ALL_VERSIONS_PATH
touch $ALL_VERSIONS_PATH
echo "[" >> $ALL_VERSIONS_PATH

for branch in $branches; do
  echo "Checking branch: $branch"
  release_notes_path="$RELEASE_NOTES_PATH"
  if [ "$branch" = "version-4-0" ] || [ "$branch" = "version-4-1" ]; then
    release_notes_path="$OLD_RELEASE_NOTES_PATH"
  fi

  wt_path="$WORKTREES_DIR/$b"
  # Ensure the local branch exactly matches the remote tip (-B resets/creates)
  # This prevents drift and avoids detached HEADs.
  git worktree add --force -B "$b" "$wt_path" "origin/$b"

  # Everything below runs isolated in the branch worktree
  pushd "$wt_path" >/dev/null

  in_breaking_changes=false
  release_number=""
  # Variable to hold the current buffer text so that we can collapse versioned links on same line.
  buffer=""
  in_code_section=false
  partial_created=false
  # Read the release notes file line by line.
  while IFS= read -r line; do
    # If the line is an H2 that contains "Release", we extract the number and begin processing.
    if echo "$line" | grep -q "##.*Release"; then
      # If we were already processing a release and file, copy it to the current working directory.
      if [ -n "$release_number" ] && [ "$partial_created" == "true" ]; then
        replaced=$(echo "$release_number" | tr '.' '_')
        filename="$BREAKING_CHANGES_PARTIALS_PATH/br_$replaced.mdx"
        cp "$filename" "$WORKING_DIR/$filename"
        partial_created=false
      fi
      release_number=$(
        echo "$line" |
        cut -c4- |
        sed -E 's/\{#.*\}//' |                                   # Remove markdown anchor fragments
        sed -E 's/.*Release[[:space:]]+//' |                     # Remove everything before 'Release'
        sed -E 's/.* -[[:space:]]*([0-9]+\.[0-9]+\.[0-9]+).*/\1/' |  # Extract last version in range
        sed -E 's/^([0-9]+\.[0-9]+\.[0-9]+).*/\1/'               # Extract version if no range
      )
      echo "\"$release_number\"," >> "$ALL_VERSIONS_PATH"
      # New release version, set breaking changes to false.
      in_breaking_changes=false
      continue
    fi

    # Find any breaking changes headings if we have detected the version heading.
    # Breaking changes MUST be H3 or more.
    if [ -n "$release_number" ] && echo "$line" | grep -iq '^###\+#*[[:space:]]*Breaking changes'; then
      in_breaking_changes=true
      create_partials_file $release_number
      partial_created=true
      continue
    fi
    
    if [ -n "$release_number" ] && $in_breaking_changes; then
      
      # If the line is empty, write the buffer then add it to the body as is without more processing.
      if [ -z "$line" ]; then
        # Flush the buffer if it has content.
        if [ -n "$buffer" ]; then
          add_breaking_changes_body "$release_number" "$buffer"
          buffer=""
        fi
        add_breaking_changes_body "$release_number" "$line"
        continue
      fi

      # If we are in breaking changes and the line is a heading then exit breaking changes mode. 
      if echo "$line" | grep -q '^[[:space:]]*#'; then
        in_breaking_changes=false
        # Flush the buffer if it has content.
        if [ -n "$buffer" ]; then
          add_breaking_changes_body "$release_number" "$buffer"
          buffer=""
        fi
        continue
      fi

      # If we are in breaking changes and the line starts a code block don't collapse or strip spaces.
      if echo "$line" | grep -q '^[[:space:]]*```'; then
        # Toggle in_code_section
        if [[ "$in_code_section" == "true" ]]; then
          in_code_section="false"
        else
          in_code_section="true"
        fi

        add_breaking_changes_body "$release_number" "$line"
        continue
      fi

      # Don't strip any spacing or collapse lines while we are in the code section.
      if $in_code_section; then
        add_breaking_changes_body "$release_number" "$line"
        continue
      fi

      # If the line is prettier-ignore-start or prettier-ignore-end skip it.
      if echo "$line" | grep -q '^[[:space:]]*<!-- prettier-ignore-start -->'; then
        continue
      fi
      if echo "$line" | grep -q '^[[:space:]]*<!-- prettier-ignore-end -->'; then
        continue
      fi
      if echo "$line" | grep -q '^[[:space:]]*<!--prettier-ignore-start-->'; then
        continue
      fi
      if echo "$line" | grep -q '^[[:space:]]*<!--prettier-ignore-end-->'; then
        continue
      fi

      # If we are in breaking changes and the line is not a heading then process it.
      if echo "$line" | grep -q '^[[:space:]]*[^#]'; then
        # If the line starts with <VersionedLink> then strip leading whitespace and add it to the buffer.
        if echo "$line" | grep -q '^[[:space:]]*<VersionedLink'; then
          append_line=$(echo "$line" | sed 's/^[[:space:]]*//')
          # If the buffer is not empty add a space before appending the new line. Else just set line value.
          if [ -n "$buffer" ]; then
            buffer="$buffer $append_line"
          else
            buffer="$append_line"
          fi
        else 
          # Not a VersionedLink line so we need to flush the buffer if it has content.
          if [ -n "$buffer" ]; then
            add_breaking_changes_body "$release_number" "$buffer"
            buffer=""
          fi
          # Normal line. Set the line as the buffer so it is ready for the next versioned link.
          buffer="$line"
        fi
        continue
      fi
    fi

  done < "$wt_path/$release_notes_path"

  popd >/dev/null

  # Remove the worktree to keep the workspace small
  git worktree remove --force "$wt_path"
  git branch -D "$branch" || true
done

clean_files

# Remove the last comma from the ALL_VERSIONS_PATH file
sed '$s/,\s*$//' $ALL_VERSIONS_PATH > temp && mv temp $ALL_VERSIONS_PATH
echo "]" >> $ALL_VERSIONS_PATH
git worktree prune
echo "All branches checked. Current branch restored to: $current_branch"