#!/bin/bash

# Function to create partials file for breaking changes
# Params:
# $1 - breaking changes partials path
# $2 - release number, example: 4.0.0
create_partials_file () {
  breaking_changes_partials_path=$1
  release_number=$2
  replaced=$(echo "$release_number" | tr '.' '_')  # Replace dots with underscores as they cause errors in partials
  filename="$breaking_changes_partials_path/br_$replaced.mdx"

  # Create the directory if it doesn't exist
  mkdir -p "$breaking_changes_partials_path"

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

# Function to create partials file for breaking changes in component updates
# Params:
# $1 - breaking changes partials path
# $2 - component updates identifier, example: component-updates-october-2025-41
# $3 - component updates range, example: 4.7.21 - 4.7.23
# $4 - component updates title, example: October 31, 2025
create_partials_file_component_updates () {
  breaking_changes_partials_path=$1
  component_updates_identifier=$2
  component_updates_range=$(echo "$3" | tr -d ' ') # Remove spaces from range
  component_updates_title=$4
  filename="$breaking_changes_partials_path/br_component_updates_$component_updates_identifier.mdx"

  # Create the directory if it doesn't exist
  mkdir -p "$breaking_changes_partials_path"

  # Create file if it doesn't exist
  if [ ! -f "$filename" ]; then
    {
      echo "---"
      echo "partial_category: breaking-changes"
      echo "partial_name: $component_updates_identifier-TITLE-{$component_updates_title}-RANGE-$component_updates_range"
      echo "---"
      echo ""
    } >> "$filename"
  fi
}

# Function to save the partials file to the main repo
# Params:
# $1 - release number, example: 4.0.0
# $2 - worktree path
# $3 - source directory
# $4 - destination directory
persist_partials_file_main_repo() {
    release_number=$1
    wt_path=$2
    src_dir=$3
    dest_dir=$4

    replaced=$(echo "$release_number" | tr '.' '_')
    filename="$src_dir/br_$replaced.mdx"
    
    popd >/dev/null  # leave the worktree to save the file to the main repo
    cp "$wt_path/$filename" "$dest_dir/$filename"
    pushd "$wt_path" >/dev/null # re-enter the worktree
}

# Function to save the partials component updates file to the main repo
# Params:
# $1 - component updates identifier, example: component-updates-october-2025-41 
# $2 - worktree path
# $3 - source directory
# $4 - destination directory
persist_partials_component_updates_file_main_repo() {
    component_updates_identifier=$1
    wt_path=$2
    src_dir=$3
    dest_dir=$4

    filename="$src_dir/br_component_updates_$component_updates_identifier.mdx"

    popd >/dev/null  # leave the worktree to save the file to the main repo
    cp "$wt_path/$filename" "$dest_dir/$filename"
    pushd "$wt_path" >/dev/null # re-enter the worktree
}

# Function to persist files if needed
#1 - release number
#2 - component updates identifier
#3 - worktree path
#4 - breaking changes partials path
#5 - docs root
persist_partial_files () {
    release_number=$1
    component_updates_identifier=$2
    wt_path=$3
    BREAKING_CHANGES_PARTIALS_PATH=$4
    DOCS_ROOT=$5
    # If we were already processing a release and file, copy it to the current working directory.
    if [ -n "$release_number" ] ; then
    persist_partials_file_main_repo "$release_number" "$wt_path" "$BREAKING_CHANGES_PARTIALS_PATH" "$DOCS_ROOT"
    fi
    # If we were already processing a component update and file, copy it to the current working directory.
    if [ -n "$component_updates_identifier" ] ; then
    persist_partials_component_updates_file_main_repo "$component_updates_identifier" "$wt_path" "$BREAKING_CHANGES_PARTIALS_PATH" "$DOCS_ROOT"
    fi
}

# Function to find legacy domain from archiveVersions.json
# Outputs: a single matching legacy domain
# $1 - release version, example: v4.5.3
# $2 - worktree path
# $3 - archiveVersions.json path
find_legacy_domain() {
  release_version=$1
  wt_path=$2
  archive_versions_path=$3
  popd >/dev/null  # leave the worktree to look up file

  # release_version like "4.7.10"
  local release_maj; release_maj=$(echo "$release_version" | cut -d . -f1)
  local release_min; release_min=$(echo "$release_version" | cut -d . -f2)

  # Read key/value as TSV (array) and keep the loop in the current shell
  while IFS=$'\t' read -r name url; do
    # name like "v4.7.x" or "v3.4.x and prior"
    local entry_maj; entry_maj=$(echo "$name" | cut -d . -f1 | sed 's/^v//')
    local entry_min; entry_min=$(echo "$name" | cut -d . -f2)

    if [[ "$release_maj" == "$entry_maj" && "$release_min" == "$entry_min" ]]; then
      echo "$url"
      return 0   # exits the surrounding function as intended
    fi
  done < <(jq -r 'to_entries[] | [.key, .value] | @tsv' "$archive_versions_path")

  pushd "$wt_path" >/dev/null # re-enter the worktree

}

# Function to add breaking changes body to the partials file
# Params:
# $1 - release number, example: 4.0.0
# $2 - component updates identifier, example: component-updates-october-2025-41
# $3 - component updates range, example: 4.7.21 - 4.7.23
# $4 - body text of the breaking change
# $5 - worktree path
# $6 - breaking changes partials path
# $7 - archiveVersions.json path
add_breaking_changes_body() {
  release_number=$1
  component_updates_identifier=$2
  component_updates_range=$3
  new_line=$4
  wt_path=$5
  breaking_changes_partials_path=$6
  archive_file_path=$7
  filename=""
  legacy_domain=""
  if [ -n "$release_number" ]; then
    replaced=$(echo "$release_number" | tr '.' '_')
    filename="$breaking_changes_partials_path/br_$replaced.mdx"
    legacy_domain=$(find_legacy_domain "$release_number" "$wt_path" "$archive_file_path")
  fi
  if [ -n "$component_updates_identifier" ]; then
    filename="$breaking_changes_partials_path/br_component_updates_$component_updates_identifier.mdx"
    first_version=$(echo "$component_updates_range" | grep -Eo '^[0-9]+(\.[0-9]+){2}')
    legacy_domain=$(find_legacy_domain "$first_version" "$wt_path" "$archive_file_path")
  fi

  # If line is empty just append it and return
  if [ -z "$new_line" ]; then
    echo >> "$filename"   # ensures file ends with a newline
    return
  fi

  # Extract link text: [text](...)
  link_text=$(
    printf '%s\n' "$new_line" \
    | grep -E '\[[^]]+\]\([^)]*\)' \
    | sed -n -E 's/.*\[([^]]*)\]\(((<[^>]+>)|([^ )][^)]*))( "([^"]*)")?\).*/\1/p'
  )

  # Extract URL (supports <angle-bracket URLs> and optional "title")
  link_url=$(
    printf '%s\n' "$new_line" \
    | grep -E '\[[^]]+\]\([^)]*\)' \
    | sed -n -E 's/.*\[[^]]*\]\(((<[^>]+>)|([^ )][^)]*))( "([^"]*)")?\).*/\1/p' \
    | sed -E 's/^<([^>]+)>$/\1/'   # drop angle brackets if present
  )

  if [ -z "$link_text" ] || [ -z "$link_url" ]; then
    # No links found, just append the line as is
    echo "$new_line" >> "$filename"
    return
  fi

  if [[ $link_url == http* || $link_url == *.webp ]]; then
    # It's an external image link, just append the line as is
    echo "$new_line" >> "$filename"
    return
  fi

  # Start the link replacement process
  prefix="${new_line%%\[*}"  # Text before the link
  suffix="${new_line#*\)}"   # Text after the link
  clean_link="$link_url"

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

  replacement="[$link_text]($legacy_domain/$clean_link)"
  # Rebuild the line
  new_line="${prefix}${replacement}${suffix}"

  echo "$new_line" >> "$filename"
}

# Function to clean up files by removing multiple blank lines.
# $1 - breaking changes partials path
clean_files() {
  breaking_changes_partials_path=$1
  for file in $breaking_changes_partials_path/*.mdx; do
    # Replace multiple blank lines with a single blank line
    awk 'NF { blank=0 } !NF { if (!blank) print ""; blank=1; next } { print }' "$file" > tmpfile && mv tmpfile "$file"
  done
}