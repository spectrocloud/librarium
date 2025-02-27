#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define files to modify
INSTALL_FILE="docs/docs-content/automation/palette-cli/install-palette-cli.md"
INSTALL_TEMPLATE_FILE="scripts/release/templates/palette-cli-install-version.md"
INSTALL_PARAMETERISED_FILE="scripts/release/templates/palette-cli-install-version-output.md"
SHELL_OFFSET=3

if ! check_env "RELEASE_PALETTE_CLI_VERSION" ; then
    echo "‼️  Skipping generate $INSTALL_FILE due to missing environment variables. ‼️"
    exit 0
fi

generate_parameterised_file $INSTALL_TEMPLATE_FILE $INSTALL_PARAMETERISED_FILE

existing_cli_version=$(search_line "palette-cli-version-output" $INSTALL_FILE)
if [[ -n "$existing_cli_version" && "$existing_cli_version" -ne 0 ]]; then
    replace_index=$((existing_cli_version + $SHELL_OFFSET))
    replace_line $replace_index $INSTALL_PARAMETERISED_FILE $INSTALL_FILE
    echo "✅ Updated Palette CLI version output in $INSTALL_FILE"
else 
    echo "❌ No palette-cli-version-output tag found in $INSTALL_FILE. Nothing was inserted."
fi

cleanup $INSTALL_PARAMETERISED_FILE
