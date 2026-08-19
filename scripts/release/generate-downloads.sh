#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define files to modify
DOWNLOADS_FILE="${DOWNLOADS_FILE:-docs/docs-content/downloads/cli-tools.md}"
CLI_TEMPLATE_FILE="scripts/release/templates/palette-cli.md"
CLI_PARAMETERISED_FILE="scripts/release/cli-output.md"
TABLE_OFFSET=2

if ! check_env "RELEASE_NAME" ||
   ! check_env "RELEASE_VERSION" ||
   ! check_env "RELEASE_PALETTE_CLI_VERSION" ||
   ! check_env "RELEASE_PALETTE_CLI_SHA" ; then
    echo "‼️  Skipping generate $DOWNLOADS_FILE due to missing environment variables. ‼️"
    exit 0
fi

# Only the variables the template uses are substituted, and through awk rather than
# sed, because `sed -i ''` is BSD-only and this script also runs on a Linux runner.
generate_parameterised_file_local_vars \
    "$CLI_TEMPLATE_FILE" "$CLI_PARAMETERISED_FILE" \
    RELEASE_NAME RELEASE_VERSION RELEASE_PALETTE_CLI_VERSION RELEASE_PALETTE_CLI_SHA

# Check if the cli for this Palette release has already been added. The search has to
# match the anchor the template actually emits, "<!-- cli-<name> -->", and include the
# closing " -->" so a shorter release name such as "4.9.4" does not substring-match an
# existing "4.9.48" row.
existing_cli=$(search_line "cli-$RELEASE_NAME -->" $DOWNLOADS_FILE)
if [[ -n "$existing_cli" && "$existing_cli" -ne 0 ]]; then
    echo "ℹ️ CLI entry for $RELEASE_NAME has already been generated in $DOWNLOADS_FILE"
    replace_line $existing_cli $CLI_PARAMETERISED_FILE $DOWNLOADS_FILE
    echo "✅ Replaced CLI line entry in $DOWNLOADS_FILE"
else
    insert_file_offset $TABLE_OFFSET "palette-cli-version-table" $CLI_PARAMETERISED_FILE $DOWNLOADS_FILE
    echo "✅ Parameterised CLI changes inserted into $DOWNLOADS_FILE"
fi

cleanup $CLI_PARAMETERISED_FILE
