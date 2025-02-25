#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define cli related files
DOWNLOADS_FILE="docs/docs-content/spectro-downloads.md"
CLI_TEMPLATE_FILE="scripts/release/templates/cli.md"
EDGE_CLI_TEMPLATE_FILE="scripts/release/templates/edge-cli.md"
CLI_PARAMETERISED_FILE="scripts/release/cli-output.md"
EDGE_CLI_PARAMETERISED_FILE="scripts/release/edge-cli-output.md"

generate_parameterised_file $CLI_TEMPLATE_FILE $CLI_PARAMETERISED_FILE
generate_parameterised_file $EDGE_CLI_TEMPLATE_FILE $EDGE_CLI_PARAMETERISED_FILE

# Check if the cli for this Palette release has already been added
existing_cli=$(search_line "cli-$RELEASE_NAME" $DOWNLOADS_FILE)
if [[ -n "$existing_cli" && "$existing_cli" -ne 0 ]]; then
    echo "ℹ️ CLI entry for $RELEASE_NAME has already been generated in $DOWNLOADS_FILE"
    replace_line $existing_cli $CLI_PARAMETERISED_FILE $DOWNLOADS_FILE
    echo "✅ Replaced CLI line entry in $DOWNLOADS_FILE"
else
    insert_file_before "linux/cli/palette" $CLI_PARAMETERISED_FILE $DOWNLOADS_FILE
    echo "✅ Parameterised CLI changes inserted into $DOWNLOADS_FILE"
fi

# Check if the cli for this Palette release has already been added
existing_edge_cli=$(search_line "edge-$RELEASE_NAME" $DOWNLOADS_FILE)
if [[ -n "$existing_edge_cli" && "$existing_edge_cli" -ne 0 ]]; then
    echo "ℹ️ Edge CLI entry for $RELEASE_NAME has already been generated in $DOWNLOADS_FILE"
    replace_line $existing_edge_cli $EDGE_CLI_PARAMETERISED_FILE $DOWNLOADS_FILE
    echo "✅ Replaced edge CLI line entry in $DOWNLOADS_FILE"
else
    insert_file_before "cli/linux/palette-edge" $EDGE_CLI_PARAMETERISED_FILE $DOWNLOADS_FILE
    echo "✅ Parameterised edge CLI changes inserted into $DOWNLOADS_FILE"
fi

cleanup $CLI_PARAMETERISED_FILE
cleanup $EDGE_CLI_PARAMETERISED_FILE