#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define compatibility maxtrix related files
COMPONENT_FILE="docs/docs-content/component.md"
CLI_TEMPLATE_FILE="scripts/release/compatibility-cli-template.md"
EDGE_CLI_TEMPLATE_FILE="scripts/release/compatibility-edge-cli-template.md"
CLI_PARAMETERISED_FILE="scripts/release/compatibility-cli-output.md"
EDGE_CLI_PARAMETERISED_FILE="scripts/release/compatibility-edge-cli-output.md"
TABLE_OFFSET=2

generate_parameterised_file $CLI_TEMPLATE_FILE $CLI_PARAMETERISED_FILE
generate_parameterised_file $EDGE_CLI_TEMPLATE_FILE $EDGE_CLI_PARAMETERISED_FILE

# Check if the cli for this Palette release has already been added
search_line "cli-$RELEASE_NAME" $COMPONENT_FILE
existing_cli=$?
if [[ -n "$existing_cli" && "$existing_cli" -ne 0 ]]; then
    echo "ℹ️ CLI entry for $RELEASE_NAME has already been generated in $COMPONENT_FILE"
    replace_line $existing_cli $CLI_PARAMETERISED_FILE $COMPONENT_FILE
    echo "✅ Replaced CLI line entry in $COMPONENT_FILE"
else
    insert_file_offset $TABLE_OFFSET "cli-compatibility-table" $CLI_PARAMETERISED_FILE $COMPONENT_FILE
    echo "✅ Parameterised CLI changes inserted into $COMPONENT_FILE"
fi

search_line "edge-$RELEASE_NAME" $COMPONENT_FILE
existing_edge_cli=$?
if [[ -n "$existing_edge_cli" && "$existing_edge_cli" -ne 0 ]]; then
    echo "ℹ️ Edge CLI entry for $RELEASE_NAME has already been generated in $COMPONENT_FILE"
    replace_line $existing_edge_cli $EDGE_CLI_PARAMETERISED_FILE $COMPONENT_FILE
    echo "✅ Replaced CLI line entry in $COMPONENT_FILE"
else
    insert_file_offset $TABLE_OFFSET "edge-cli-compatibility-table" $EDGE_CLI_PARAMETERISED_FILE $COMPONENT_FILE
    echo "✅ Parameterised edge CLI changes inserted into $COMPONENT_FILE"
fi

cleanup $CLI_PARAMETERISED_FILE
cleanup $EDGE_CLI_PARAMETERISED_FILE