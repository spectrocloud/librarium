#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define files to modify
DOWNLOADS_FILE="docs/docs-content/downloads/cli-tools.md"
CLI_TEMPLATE_FILE="scripts/release/templates/palette-cli.md"
CLI_PARAMETERISED_FILE="scripts/release/cli-output.md"
TABLE_OFFSET=2

if ! check_env "RELEASE_NAME" || 
   ! check_env "RELEASE_PALETTE_CLI_VERSION" || 
   ! check_env "RELEASE_PALETTE_CLI_SHA" ; then
    echo "‼️  Skipping generate $DOWNLOADS_FILE due to missing environment variables. ‼️"
    exit 0
fi

generate_parameterised_file $CLI_TEMPLATE_FILE $CLI_PARAMETERISED_FILE

# Check if the cli for this Palette release has already been added
existing_cli=$(search_line "palette-cli-$RELEASE_NAME" $DOWNLOADS_FILE)
if [[ -n "$existing_cli" && "$existing_cli" -ne 0 ]]; then
    echo "ℹ️ CLI entry for $RELEASE_NAME has already been generated in $DOWNLOADS_FILE"
    replace_line $existing_cli $CLI_PARAMETERISED_FILE $DOWNLOADS_FILE
    echo "✅ Replaced CLI line entry in $DOWNLOADS_FILE"
else
    insert_file_offset $TABLE_OFFSET "palette-cli-version-table" $CLI_PARAMETERISED_FILE $DOWNLOADS_FILE
    echo "✅ Parameterised CLI changes inserted into $DOWNLOADS_FILE"
fi

cleanup $CLI_PARAMETERISED_FILE
