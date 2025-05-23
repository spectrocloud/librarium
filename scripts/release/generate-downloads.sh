#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define files to modify
DOWNLOADS_FILE="docs/docs-content/downloads/cli-tools.md"
CLI_TEMPLATE_FILE="scripts/release/templates/palette-cli.md"
EDGE_CLI_TEMPLATE_FILE="scripts/release/templates/edge-cli.md"
CLI_PARAMETERISED_FILE="scripts/release/cli-output.md"
EDGE_CLI_PARAMETERISED_FILE="scripts/release/edge-cli-output.md"
TABLE_OFFSET=2

if ! check_env "RELEASE_NAME" || 
   ! check_env "RELEASE_PALETTE_CLI_VERSION" || 
   ! check_env "RELEASE_PALETTE_CLI_SHA" ||  
   ! check_env "RELEASE_EDGE_CLI_VERSION" ||  
   ! check_env "RELEASE_EDGE_CLI_SHA" ; then
    echo "‼️  Skipping generate $DOWNLOADS_FILE due to missing environment variables. ‼️"
    exit 0
fi

generate_parameterised_file $CLI_TEMPLATE_FILE $CLI_PARAMETERISED_FILE
generate_parameterised_file $EDGE_CLI_TEMPLATE_FILE $EDGE_CLI_PARAMETERISED_FILE

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

# Check if the cli for this Palette release has already been added
existing_edge_cli=$(search_line "edge-$RELEASE_NAME" $DOWNLOADS_FILE)
if [[ -n "$existing_edge_cli" && "$existing_edge_cli" -ne 0 ]]; then
    echo "ℹ️ Edge CLI entry for $RELEASE_NAME has already been generated in $DOWNLOADS_FILE"
    replace_line $existing_edge_cli $EDGE_CLI_PARAMETERISED_FILE $DOWNLOADS_FILE
    echo "✅ Replaced edge CLI line entry in $DOWNLOADS_FILE"
else
    insert_file_offset $TABLE_OFFSET "edge-version-table" $EDGE_CLI_PARAMETERISED_FILE $DOWNLOADS_FILE
    echo "✅ Parameterised edge CLI changes inserted into $DOWNLOADS_FILE"
fi

cleanup $CLI_PARAMETERISED_FILE
cleanup $EDGE_CLI_PARAMETERISED_FILE
