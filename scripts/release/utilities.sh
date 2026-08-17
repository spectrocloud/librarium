#!/bin/bash

# Utility function to generate parameterised files using placeholders and environment variables
# Params: 
# $1 - template file, input file
# $2 - parameterised, output file
generate_parameterised_file() {
    # Make a copy of the template file to parameterise
    cp "$1" "$2"

    # Loop through all environment variables
    for var in $(compgen -e); do
        # Strip quotes from all environment variables
        local value="${!var#\"}"; value="${value%\"}"       
        # Use placeholder format {{variable}}
        local placeholder="{{${var}}}"  

        # Replace placeholder in file
        sed -i '' "s|$placeholder|$value|g" "$2"
    done
}

# Local version of the above function that only replaces specified variables, to avoid unintended replacements
# Params: 
# $1 - template file, input file
# $2 - parameterised, output file
generate_parameterised_file_local_vars() {
  local template_file="$1"
  local output_file="$2"
  shift 2

  cp "$template_file" "$output_file"

  local var placeholder value_file tmp_file

  for var in "$@"; do
    placeholder="{{${var}}}"

    if ! grep -qF "$placeholder" "$output_file"; then
      echo "Warning: placeholder not found: $placeholder" >&2
      continue
    fi

    value_file="$(mktemp)"
    tmp_file="$(mktemp)"

    printf '%s' "${!var}" > "$value_file"

    awk -v placeholder="$placeholder" -v value_file="$value_file" '
      BEGIN {
        replacement = ""
        sep = ""

        while ((getline line < value_file) > 0) {
          replacement = replacement sep line
          sep = "\n"
        }

        close(value_file)
      }

      {
        while ((pos = index($0, placeholder)) > 0) {
          before = substr($0, 1, pos - 1)
          after = substr($0, pos + length(placeholder))
          $0 = before replacement after
        }

        print
      }
    ' "$output_file" > "$tmp_file"

    mv "$tmp_file" "$output_file"
    rm -f "$value_file"
  done
}

# Utility function to place a source file into a target file after the first line that contains the search param
# Params: 
# $1 - search term, example: linux/cli/palette
# $2 - source file to insert, example: parameterised file
# $3 - target file to insert into, example: release notes file
insert_file_after() {
    local TEMP_FILE="scripts/release/temp_file.md"

    # Process the target file line by line
    local inserted=false
    while IFS= read -r line; do
        echo "$line" >> "$TEMP_FILE"

        if [[ "$line" == *"$1"* && "$inserted" == false ]]; then
            echo "" >> "$TEMP_FILE"  # Insert a blank line
            cat "$2" >> "$TEMP_FILE"
            # Mark as inserted so things are only inserted once
            inserted=true
        fi
    done < "$3"

    # File traversed and search term not found
    if [[ "$inserted" == false ]]; then
        echo "❌ Search term $1 not found in file $3. Nothing will be inserted."
        exit 1
    fi

    # Replace original file with the updated one
    mv "$TEMP_FILE" "$3"
}

# Utility function to place a source file into a target file before the first line that contains the search param
# Params: 
# $1 - offset, example: 2
# $2 - search term, example: linux/cli/palette
# $3 - source file to insert, example: parameterised file
# $4 - target file to insert into, example: downloads file
insert_file_offset() {
    local TEMP_FILE="scripts/release/temp_file.md"
    # Process the file line by line until we find the search term
    local inserted=false
    local line_counter=0
    local target_line=0

    while IFS= read -r line || [[ -n "$line" ]]; do
        ((line_counter++))

        # Detect the first occurrence of the search term
        if [[ "$line" == *"$2"* && "$inserted" == false ]]; then
            target_line=$((line_counter + $1))  # Calculate target line for insertion
            inserted=true
        fi

        # Insert content at the target line count
        if [[ "$inserted" == true && "$line_counter" -eq "$target_line" ]]; then
            cat "$3" >> "$TEMP_FILE"
        fi

        echo "$line" >> "$TEMP_FILE"
    done < "$4"
    
    # File traversed and search term not found
    if [[ "$inserted" == false ]]; then
        echo "❌ Search term $2 not found in file $4. Nothing was inserted."
        exit 1
    fi

    # Replace the original file with the updated one
    mv "$TEMP_FILE" "$4"
}

# Utility function to search for a line in a target file and return the line number
# Params: 
# $1 - search term, example: linux/cli/palette
# $2 - target file to insert into, example: downloads file
search_line() {
    local line_number=$(grep -m1 -n "${1}" "$2" | cut -d: -f1)
    echo "$line_number"
}

# Utility function to replace a line with a source file
# Params: 
# $1 - line number to replace
# $2 - source file to insert, example: parameterised file
# $3 - target file to insert into, example: downloads file
replace_line() {
  local line_number="$1"
  local source_file="$2"
  local target_file="$3"
  local tmp_file

  tmp_file="$(mktemp)"

  awk -v line_number="$line_number" -v source_file="$source_file" '
    NR == line_number {
      while ((getline line < source_file) > 0) {
        print line
      }
      close(source_file)
      next
    }
    { print }
  ' "$target_file" > "$tmp_file"

  mv "$tmp_file" "$target_file"
}

# Utility function to remove a file
# Params: 
# $1 - file name
cleanup() {
    rm $1
}

# Utility function to strip Super's inline citation markers from an answer, for example
# {[5](https://spectrocloud.atlassian.net/browse/PE-9154)} or {[1](url), [2](url)}. Super started
# appending these to sentences, and because the release scripts insert its answer verbatim they
# land in the published release notes. Any leading space is taken with the marker so a sentence it
# was appended to does not keep a trailing gap, and a line that held nothing but markers is dropped
# rather than left blank. Real Markdown links are untouched because they are not brace-wrapped.
# Reads the body on stdin, writes the stripped body to stdout.
strip_super_citations() {
    awk '
      {
        line = $0
        had_content = (line ~ /[^ \t]/)

        gsub(/[ \t]*\{[ \t]*(\[[0-9]+\](\([^()[:space:]]*\))?[,;[:space:]]*)+\}/, "", line)
        sub(/[ \t]+$/, "", line)

        if (line == "" && had_content) {
          next
        }

        print line
      }
    '
}

# Utility function to normalise a Markdown body returned by Super before it is written into the
# release notes. On top of stripping citation markers it puts a blank line either side of each
# standalone HTML comment and then reflows the prose with Prettier, so a `<!-- ticket URL -->`
# marker separates the bullets around it and list continuation lines are wrapped and indented.
#
# The blank lines have to be inserted before Prettier runs: while a comment sits directly under a
# bullet, CommonMark absorbs it into that list item as an HTML block and Prettier then preserves
# the whole list verbatim. Prettier also has to be told to use the Markdown parser, because
# .prettierrc maps *.md to the MDX parser, which never reflows prose - that is why neither
# `make format` nor a save in the editor corrects this after the fact.
#
# Consecutive comment lines are treated as one group and left packed together, matching how the
# release notes already carry several ticket URLs above a single bullet.
#
# Reads the body on stdin, writes the normalised body to stdout.
normalize_super_body() {
    local stripped_file formatted_file
    stripped_file="$(mktemp)"
    formatted_file="$(mktemp)"

    strip_super_citations | awk '
      {
        comment = ($0 ~ /^[ \t]*<!--.*-->[ \t]*$/)

        if (comment && !prev_comment && printed && prev != "") {
          print ""
        }

        if (!comment && prev_comment && $0 != "") {
          print ""
        }

        print
        prev = $0
        prev_comment = comment
        printed = 1
      }
    ' > "$stripped_file"

    if npx --no-install prettier --config .prettierrc --parser markdown "$stripped_file" > "$formatted_file" 2>/dev/null; then
        cat "$formatted_file"
    else
        echo "🟠 Prettier could not be run, so the Super response was inserted without prose wrapping. Run 'npm ci' and re-run this script, or wrap the new section by hand." >&2
        cat "$stripped_file"
    fi

    rm -f "$stripped_file" "$formatted_file"
}

# Utility function to fetch a single file's raw contents from a (private) GitHub
# repository at a given ref, using a token-based REST call. Writes the raw file
# body to stdout. Requires the GITHUB_TOKEN environment variable.
# Params:
# $1 - repository, example: spectrocloud/nickfury
# $2 - ref (branch, tag, or SHA), example: v4.9.21
# $3 - file path within the repo, example: release/spectro_versions.txt
fetch_github_file() {
    local repo="$1"
    local ref="$2"
    local path="$3"

    if [[ -z "${GITHUB_TOKEN:-}" ]]; then
        echo "🟠 GITHUB_TOKEN is empty or not set; cannot fetch $repo/$path." >&2
        return 1
    fi

    curl -sfL \
        -H "Authorization: Bearer ${GITHUB_TOKEN}" \
        -H "Accept: application/vnd.github.raw" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        "https://api.github.com/repos/${repo}/contents/${path}?ref=${ref}"
}

# Utility function to read a "key=value" line from text on stdin and return the
# trimmed value of the first matching key.
# Params:
# $1 - key, example: stylus
# Usage: printf '%s' "$contents" | get_keyed_value stylus
get_keyed_value() {
    grep -m1 -E "^${1}=" | cut -d= -f2- | tr -d '[:space:]'
}

# Utility function to verify the presence of an environment variable
# Params:
# $1 - environment variable name
check_env() {
    local var_name="$1"

    if [[ -z "${!var_name}" ]]; then
        echo "🟠 '$var_name' is empty or not set."
        return 1
    fi

    return 0    
}

# Utility function to check whether the Super API currently accepts SUPER_API_TOKEN.
# Super only issues personal API keys, and a key returns HTTP 401 until its owner has
# signed in to https://app.super.work through SSO. The Super API has no unauthenticated
# health endpoint to probe - routing happens before authentication, so every other path
# returns 404 regardless of the token - so this sends a trivial question to the assistant.
# Params:
# $1 - Super assistant ID
# Returns 0 if Super accepts the token, 1 if Super rejects it.
check_super_auth() {
    local assistant_id="$1"
    local status

    status=$(curl -s --max-time 60 \
        --output /dev/null \
        --write-out '%{http_code}' \
        --request POST \
        --url https://api.super.work/v1/super \
        --header "Authorization: Bearer ${SUPER_API_TOKEN}" \
        --header "Content-Type: application/json" \
        --data "$(jq -n --arg question "Reply with the single word OK." --arg assistantID "$assistant_id" '{question: $question, assistantId: $assistantID}')" || echo "000")

    if [[ "$status" == "401" || "$status" == "403" ]]; then
        return 1
    fi

    # Any other status, including a network failure reported as 000, is left for the
    # calling script's own retry loop to handle.
    return 0
}

# Utility function to confirm Super authentication before a script does any other work,
# so a lapsed SSO session fails immediately instead of after every issue tracker call.
# In an interactive terminal, a rejected token opens Super so that the SSO login can be
# completed, waits, then checks again. There is no browser in CI, so the script stops.
# Params:
# $1 - Super assistant ID
# Returns 0 if Super accepts the token, 1 if the script should stop.
require_super_auth() {
    local assistant_id="$1"

    echo "Verifying that Super accepts SUPER_API_TOKEN..."

    if check_super_auth "$assistant_id"; then
        echo "✅ Super accepted SUPER_API_TOKEN."
        return 0
    fi

    if [[ ! -t 0 || -n "${CI:-}" ]]; then
        echo "❌ Super rejected SUPER_API_TOKEN (HTTP 401). Super API keys are personal and are only valid while their owner has a current SSO session. Sign in at https://app.super.work and run this job again." >&2
        return 1
    fi

    echo "🔐 Super rejected SUPER_API_TOKEN (HTTP 401). Your Super SSO session has lapsed."

    if command -v open >/dev/null 2>&1; then
        open "https://app.super.work"
    else
        echo "ℹ️  Sign in to Super at https://app.super.work."
    fi

    read -r -p "Press Enter once you have signed in to Super: "

    if check_super_auth "$assistant_id"; then
        echo "✅ Super accepted SUPER_API_TOKEN."
        return 0
    fi

    echo "❌ Super still rejects SUPER_API_TOKEN. Confirm that SUPER_API_TOKEN in your .env file matches a current key in your Super settings." >&2
    return 1
}
