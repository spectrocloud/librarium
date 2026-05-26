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
    sed -i '' "${1}r $2" "$3" && sed -i '' "${1}d" "$3"
}

# Utility function to remove a file
# Params: 
# $1 - file name
cleanup() {
    rm $1
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
