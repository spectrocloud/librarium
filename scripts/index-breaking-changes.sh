#!/bin/bash

# Import utility functions
source scripts/index-breaking-changes-utils.sh

set -e

DOCS_ROOT="$(git rev-parse --show-toplevel)"
RELEASE_NOTES_PATH="docs/docs-content/release-notes/release-notes.md"
OLD_RELEASE_NOTES_PATH="docs/docs-content/release-notes.md"
BREAKING_CHANGES_PARTIALS_PATH="_partials/breaking-changes"
ALL_VERSIONS_PATH="src/components/ReleaseNotesBreakingChanges/versions.json"
ARCHIVE_FILE_PATH="archiveVersions.json"

# Where to place worktrees (unique per run)
WORKTREES_DIR="$(mktemp -d -t librarium-worktrees-XXXXXX)"
echo "ℹ️ Using worktrees dir: $WORKTREES_DIR"

cleanup() {
  echo "🧹 Cleaning up worktrees..."
  git worktree prune || true
  rm -rf "$WORKTREES_DIR" || true
}
trap cleanup EXIT

# If ALL_VERSIONS_PATH file and BREAKING_CHANGES_PARTIALS_PATH directory already exist, skip the entire script.
# This is to speed up local development where we don't need to re-index every time.
if [ -f "$ALL_VERSIONS_PATH" ] && [ -d "$BREAKING_CHANGES_PARTIALS_PATH" ]; then
  echo "ℹ️ $ALL_VERSIONS_PATH file and $BREAKING_CHANGES_PARTIALS_PATH directory already exist. Skipping breaking change indexing."
  exit 0
fi

# Fetch all branches from the remote
# Pull *only* version-* branches into refs/remotes/origin/, shallow, skip tags,
# and explicitly exclude version-3-4 with a negative refspec.
git fetch --prune --no-tags --depth=1 origin \
  '+refs/heads/version-*:refs/remotes/origin/version-*'

# Get remote version branches (no locals, no HEAD), exclude version-3-4
branches="$(
  git for-each-ref \
    --format='%(refname:strip=3)' \
    --sort=refname \
    --exclude='refs/remotes/origin/version-3-4' \
    'refs/remotes/origin/version-*'
)"

# Remove files for repeatable runs.
rm -rf $BREAKING_CHANGES_PARTIALS_PATH
rm -f $ALL_VERSIONS_PATH
touch $ALL_VERSIONS_PATH
echo "[" >> $ALL_VERSIONS_PATH
# Create the directory in the main repo if it doesn't exist
mkdir -p $BREAKING_CHANGES_PARTIALS_PATH

for branch in $branches; do
  echo "ℹ️ Checking branch: $branch"
  release_notes_path="$RELEASE_NOTES_PATH"
  if [[ $branch == *version-4-0* || $branch == *version-4-1* ]]; then
    release_notes_path="$OLD_RELEASE_NOTES_PATH"
  fi

  wt_path="$WORKTREES_DIR/$branch"
  git worktree add --force --detach "$wt_path" "origin/$branch"

  # Everything below runs isolated in the branch worktree
  # ALL FILES WRITTEN PAST THIS POINT ARE IN THE WORKTREE
  pushd "$wt_path" >/dev/null

  in_breaking_changes=false
  component_updates_range=""
  component_updates_identifier=""
  component_updates_title=""
  release_number=""
  # Variable to hold the current buffer text so that we can collapse versioned links on same line.
  buffer=""
  in_code_section=false
  partial_created=false
  # Read the release notes file line by line.
  while IFS= read -r line; do
    # If the line is an H2 that contains "Release", we extract the number and begin processing.
    if echo "$line" | grep -q "##.*Release"; then
      # If we were already processing a file, copy it to the current working directory.
      if [ "$partial_created" == "true" ]; then
        persist_partial_files "$release_number" "$component_updates_identifier" "$wt_path" "$BREAKING_CHANGES_PARTIALS_PATH" "$DOCS_ROOT"
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
      ## Reset component updates tracking variables for new release.
      component_updates_identifier=""
      component_updates_title=""
      component_updates_range=""

      popd >/dev/null  # leave the worktree to write to the file in the the main repo
      echo "\"$release_number\"," >> "$ALL_VERSIONS_PATH"
      pushd "$wt_path" >/dev/null # re-enter the worktree

      # New release version, set breaking changes to false.
      in_breaking_changes=false
      continue
    fi

    if echo "$line" | grep -qE '^##[[:space:]]+.*\bComponent Updates\b'; then
      # If we were already processing a file, copy it to the current working directory.
      if [ "$partial_created" == "true" ]; then
        persist_partial_files "$release_number" "$component_updates_identifier" "$wt_path" "$BREAKING_CHANGES_PARTIALS_PATH" "$DOCS_ROOT"
        partial_created=false
      fi

      # Use the heading identifier as the unique key for component updates.
      component_updates_identifier=$(echo "$line" | grep -Eo '\{#[^}]+\}' | tr -d '{}' | cut -c2-)
      component_updates_title=$(echo "$line" | grep -Eo '^##[[:space:]]+[A-Za-z]+[[:space:]][0-9]{1,2},[[:space:]][0-9]{4}' | cut -c4-)

      # Reset release number as we are in component updates now.
      release_number=""
      # New component updates section, set breaking changes to false.
      in_breaking_changes=false
      continue
    fi

    # THIS PHRASING MUST MATCH EXACTLY TO CATCH THE COMPONENT UPDATES RANGE.
    # I HAVE NO OTHER WAY TO UNIQUELY IDENTIFY THIS LINE.
    if [ -n "$component_updates_identifier" ] && echo "$line" | grep -qE '^The following components have been updated for Palette version [0-9]+(\.[0-9]+){2}([[:space:]]*[-–—][[:space:]]*[0-9]+(\.[0-9]+){2})?\.$'; then
      component_updates_range=$(
        echo "$line" |
        grep -Eo '[0-9]+(\.[0-9]+){2}([[:space:]]*[-–—][[:space:]]*[0-9]+(\.[0-9]+){2})?'
      )
      continue 
    fi

    # Find any breaking changes headings if we have detected the version heading.
    # Breaking changes MUST be H3 or more.
    if [ -n "$release_number" ] && echo "$line" | grep -iq '^###\+#*[[:space:]]*Breaking Changes'; then
      in_breaking_changes=true
      create_partials_file "$BREAKING_CHANGES_PARTIALS_PATH" "$release_number"
      partial_created=true
      continue
    fi

    # Also check for component updates breaking changes sections.
    if [ -n "$component_updates_identifier" ] && [ -n "$component_updates_range" ] && echo "$line" | grep -iq '^###\+#*[[:space:]]*Breaking Changes'; then
      in_breaking_changes=true
      create_partials_file_component_updates "$BREAKING_CHANGES_PARTIALS_PATH" "$component_updates_identifier" "$component_updates_range" "$component_updates_title"
      partial_created=true
      continue
    fi

    if [ "$in_breaking_changes" == "true" ]; then
      # If the line is empty, write the buffer then add it to the body as is without more processing.
      if [ -z "$line" ]; then
        # Flush the buffer if it has content.
        if [ -n "$buffer" ]; then
          add_breaking_changes_body "$release_number" "$component_updates_identifier" "$component_updates_range" "$buffer" "$wt_path" "$BREAKING_CHANGES_PARTIALS_PATH" "$ARCHIVE_FILE_PATH"
          buffer=""
        fi
        add_breaking_changes_body "$release_number" "$component_updates_identifier" "$component_updates_range" "$line" "$wt_path" "$BREAKING_CHANGES_PARTIALS_PATH" "$ARCHIVE_FILE_PATH"
        continue
      fi

      # If we are in breaking changes and the line is a heading then exit breaking changes mode. 
      if echo "$line" | grep -q '^[[:space:]]*#'; then
        in_breaking_changes=false
        # Flush the buffer if it has content.
        if [ -n "$buffer" ]; then
          add_breaking_changes_body "$release_number" "$component_updates_identifier" "$component_updates_range" "$buffer" "$wt_path" "$BREAKING_CHANGES_PARTIALS_PATH" "$ARCHIVE_FILE_PATH"
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

        add_breaking_changes_body "$release_number" "$component_updates_identifier" "$component_updates_range" "$line" "$wt_path" "$BREAKING_CHANGES_PARTIALS_PATH" "$ARCHIVE_FILE_PATH"
        continue
      fi

      # Don't strip any spacing or collapse lines while we are in the code section.
      if $in_code_section; then
        add_breaking_changes_body "$release_number" "$component_updates_identifier" "$component_updates_range" "$line" "$wt_path" "$BREAKING_CHANGES_PARTIALS_PATH" "$ARCHIVE_FILE_PATH"
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
            add_breaking_changes_body "$release_number" "$component_updates_identifier" "$component_updates_range" "$buffer" "$wt_path" "$BREAKING_CHANGES_PARTIALS_PATH" "$ARCHIVE_FILE_PATH"
            buffer=""
          fi
          # Normal line. Set the line as the buffer so it is ready for the next versioned link.
          buffer="$line"
        fi
        continue
      fi
    fi

  done < "$wt_path/$release_notes_path"

  # If we finished the file and have a left over partial, copy it to the current working directory.
  if [ "$partial_created" == "true" ]; then
    persist_partial_files "$release_number" "$component_updates_identifier" "$wt_path" "$BREAKING_CHANGES_PARTIALS_PATH" "$DOCS_ROOT"
    partial_created=false
  fi

  popd >/dev/null

  # Remove the worktree to keep the workspace small
  git worktree remove --force "$wt_path"
done

clean_files $BREAKING_CHANGES_PARTIALS_PATH

# Remove the last comma from the ALL_VERSIONS_PATH file
sed '$s/,\s*$//' $ALL_VERSIONS_PATH > temp && mv temp $ALL_VERSIONS_PATH
echo "]" >> $ALL_VERSIONS_PATH
git worktree prune
echo "✅ All branches checked."