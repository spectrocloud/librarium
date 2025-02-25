#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define compatibility maxtrix related files
REGISTRY_FILE="docs/docs-content/registries-and-packs/spectro-cli-reference.md"
OSX_TEMPLATE_FILE="scripts/release/templates/registry-osx.md"
LINUX_TEMPLATE_FILE="scripts/release/templates/registry-linux.md"
VERSION_TEMPLATE_FILE="scripts/release/templates/registry-version.md"
OSX_PARAMETERISED_FILE="scripts/release/templates/registry-osx-output.md"
LINUX_PARAMETERISED_FILE="scripts/release/templates/registry-linux-output.md"
VERSION_PARAMETERISED_FILE="scripts/release/templates/registry-version-output.md"
SHELL_OFFSET=3

generate_parameterised_file $OSX_TEMPLATE_FILE $OSX_PARAMETERISED_FILE
generate_parameterised_file $LINUX_TEMPLATE_FILE $LINUX_PARAMETERISED_FILE
generate_parameterised_file $VERSION_TEMPLATE_FILE $VERSION_PARAMETERISED_FILE

search_line "registry-osx-install" $REGISTRY_FILE
existing_registry_osx=$?
if [[ -n "$existing_registry_osx" && "$existing_registry_osx" -ne 0 ]]; then
    replace_index=$((existing_registry_osx + $SHELL_OFFSET))
    replace_line $replace_index $OSX_PARAMETERISED_FILE $REGISTRY_FILE
    echo "✅ Updated OSX registry install in $REGISTRY_FILE"
fi

search_line "registry-linux-install" $REGISTRY_FILE
existing_registry_linux=$?
if [[ -n "$existing_registry_linux" && "$existing_registry_linux" -ne 0 ]]; then
    replace_index=$((existing_registry_linux + $SHELL_OFFSET))
    replace_line $replace_index $LINUX_PARAMETERISED_FILE $REGISTRY_FILE
    echo "✅ Updated Linux registry install in $REGISTRY_FILE"
fi

search_line "registry-version-output" $REGISTRY_FILE
existing_version_output=$?
if [[ -n "$existing_version_output" && "$existing_version_output" -ne 0 ]]; then
    replace_index=$((existing_version_output + $SHELL_OFFSET))
    replace_line $replace_index $VERSION_PARAMETERISED_FILE $REGISTRY_FILE
    echo "✅ Updated version output in $REGISTRY_FILE"
fi

cleanup $OSX_PARAMETERISED_FILE
cleanup $LINUX_PARAMETERISED_FILE
cleanup $VERSION_PARAMETERISED_FILE
