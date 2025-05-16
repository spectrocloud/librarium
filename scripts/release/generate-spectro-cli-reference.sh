#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define compatibility maxtrix related files
REFERENCE_FILE="docs/docs-content/registries-and-packs/spectro-cli-reference.md"
PARTIALS_FILE="_partials/_spectro-cloud-cli-tool-download.mdx"
OSX_TEMPLATE_FILE="scripts/release/templates/spectro-cli-install-osx.md"
LINUX_TEMPLATE_FILE="scripts/release/templates/spectro-cli-install-linux.md"
VERSION_TEMPLATE_FILE="scripts/release/templates/spectro-cli-install-version.md"
OSX_PARAMETERISED_FILE="scripts/release/templates/spectro-cli-osx-output.md"
LINUX_PARAMETERISED_FILE="scripts/release/templates/spectro-cli-linux-output.md"
VERSION_PARAMETERISED_FILE="scripts/release/templates/spectro-cli-version-output.md"
SHELL_OFFSET=3

if ! check_env "RELEASE_SPECTRO_CLI_VERSION" ; then
    echo "‼️  Skipping generate $REFERENCE_FILE due to missing environment variables. ‼️"
    exit 0
fi

generate_parameterised_file $OSX_TEMPLATE_FILE $OSX_PARAMETERISED_FILE
generate_parameterised_file $LINUX_TEMPLATE_FILE $LINUX_PARAMETERISED_FILE
generate_parameterised_file $VERSION_TEMPLATE_FILE $VERSION_PARAMETERISED_FILE

existing_cli_osx=$(search_line "spectro-cli-osx-install" $PARTIALS_FILE)
if [[ -n "$existing_cli_osx" && "$existing_cli_osx" -ne 0 ]]; then
    replace_index=$((existing_cli_osx + $SHELL_OFFSET))
    replace_line $replace_index $OSX_PARAMETERISED_FILE $PARTIALS_FILE
    echo "✅ Updated OSX Spectro CLI install in $PARTIALS_FILE"
else 
    echo "❌ No spectro-cli-osx-install tag found in  $PARTIALS_FILE. Nothing was inserted."
fi

existing_cli_linux=$(search_line "spectro-cli-linux-install" $PARTIALS_FILE)
if [[ -n "$existing_cli_linux" && "$existing_cli_linux" -ne 0 ]]; then
    replace_index=$((existing_cli_linux + $SHELL_OFFSET))
    replace_line $replace_index $LINUX_PARAMETERISED_FILE $PARTIALS_FILE
    echo "✅ Updated Linux Spectro CLI install in $PARTIALS_FILE"
else 
    echo "❌ No spectro-cli-linux-install tag found in $PARTIALS_FILE. Nothing was inserted."
fi

existing_version_output=$(search_line "spectro-cli-version-output" $REFERENCE_FILE)
if [[ -n "$existing_version_output" && "$existing_version_output" -ne 0 ]]; then
    replace_index=$((existing_version_output + $SHELL_OFFSET))
    replace_line $replace_index $VERSION_PARAMETERISED_FILE $REFERENCE_FILE
    echo "✅ Updated Spectro CLI version output in $REFERENCE_FILE"
else 
    echo "❌ No spectro-cli-version-output tag found in  $REFERENCE_FILE. Nothing was inserted."
fi

cleanup $OSX_PARAMETERISED_FILE
cleanup $LINUX_PARAMETERISED_FILE
cleanup $VERSION_PARAMETERISED_FILE
