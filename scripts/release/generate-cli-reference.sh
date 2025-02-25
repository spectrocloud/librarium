#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define compatibility maxtrix related files
REFERENCE_FILE="docs/docs-content/registries-and-packs/spectro-cli-reference.md"
OSX_TEMPLATE_FILE="scripts/release/templates/cli-install-osx.md"
LINUX_TEMPLATE_FILE="scripts/release/templates/cli-install-linux.md"
VERSION_TEMPLATE_FILE="scripts/release/templates/cli-install-version.md"
OSX_PARAMETERISED_FILE="scripts/release/templates/cli-osx-output.md"
LINUX_PARAMETERISED_FILE="scripts/release/templates/cli-linux-output.md"
VERSION_PARAMETERISED_FILE="scripts/release/templates/cli-version-output.md"
SHELL_OFFSET=3

generate_parameterised_file $OSX_TEMPLATE_FILE $OSX_PARAMETERISED_FILE
generate_parameterised_file $LINUX_TEMPLATE_FILE $LINUX_PARAMETERISED_FILE
generate_parameterised_file $VERSION_TEMPLATE_FILE $VERSION_PARAMETERISED_FILE

existing_cli_osx=$(search_line "cli-osx-install" $REFERENCE_FILE)
if [[ -n "$existing_cli_osx" && "$existing_cli_osx" -ne 0 ]]; then
    replace_index=$((existing_cli_osx + $SHELL_OFFSET))
    replace_line $replace_index $OSX_PARAMETERISED_FILE $REFERENCE_FILE
    echo "✅ Updated OSX CLI install in $REFERENCE_FILE"
else 
    echo "❌ No cli-osx-install tag found in  $REFERENCE_FILE. Nothing was inserted."
fi

existing_cli_linux=$(search_line "cli-linux-install" $REFERENCE_FILE)
if [[ -n "$existing_cli_linux" && "$existing_cli_linux" -ne 0 ]]; then
    replace_index=$((existing_cli_linux + $SHELL_OFFSET))
    replace_line $replace_index $LINUX_PARAMETERISED_FILE $REFERENCE_FILE
    echo "✅ Updated Linux CLI install in $REFERENCE_FILE"
else 
    echo "❌ No cli-linux-install tag found in $REFERENCE_FILE. Nothing was inserted."
fi

existing_version_output=$(search_line "cli-version-output" $REFERENCE_FILE)
if [[ -n "$existing_version_output" && "$existing_version_output" -ne 0 ]]; then
    replace_index=$((existing_version_output + $SHELL_OFFSET))
    replace_line $replace_index $VERSION_PARAMETERISED_FILE $REFERENCE_FILE
    echo "✅ Updated version output in $REFERENCE_FILE"
else 
    echo "❌ No cli-version-output tag found in  $REFERENCE_FILE. Nothing was inserted."
fi

cleanup $OSX_PARAMETERISED_FILE
cleanup $LINUX_PARAMETERISED_FILE
cleanup $VERSION_PARAMETERISED_FILE
