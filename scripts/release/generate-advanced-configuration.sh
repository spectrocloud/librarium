#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define files to modify
CONFIGURATION_FILE="docs/docs-content/registries-and-packs/advanced-configuration.md"
END_TEMPLATE_FILE="scripts/release/templates/registry-reference-end.md"
MID_TEMPLATE_FILE="scripts/release/templates/registry-reference-mid.md"
END_PARAMETERISED_FILE="scripts/release/templates/registry-reference-end-output.md"
MID_PARAMETERISED_FILE="scripts/release/templates/registry-reference-mid-output.md"

if ! check_env "RELEASE_REGISTRY_VERSION"; then
    echo "‼️  Skipping generate $CONFIGURATION_FILE due to missing environment variables. ‼️"
    exit 0
fi

generate_parameterised_file $END_TEMPLATE_FILE $END_PARAMETERISED_FILE
generate_parameterised_file $MID_TEMPLATE_FILE $MID_PARAMETERISED_FILE

existing_ref_end=$(search_line "registry-reference-end" $CONFIGURATION_FILE)
if [[ -n "$existing_ref_end" && "$existing_ref_end" -ne 0 ]]; then
    replace_index=$((existing_ref_end + 11 ))
    replace_line $replace_index $END_PARAMETERISED_FILE $CONFIGURATION_FILE
    echo "✅ Updated registry reference end tag in $CONFIGURATION_FILE"
else 
    echo "❌ No registry-reference-end tag found in $CONFIGURATION_FILE. Nothing was inserted."
fi

existing_ref_mid=$(search_line "registry-reference-mid" $CONFIGURATION_FILE)
if [[ -n "$existing_ref_mid" && "$existing_ref_mid" -ne 0 ]]; then
    replace_index=$((existing_ref_mid + 8 ))
    replace_line $replace_index $MID_PARAMETERISED_FILE $CONFIGURATION_FILE
    echo "✅ Updated registry reference mid tag in $CONFIGURATION_FILE"
else 
    echo "❌ No registry-reference-mid tag found in $CONFIGURATION_FILE. Nothing was inserted."
fi

cleanup $END_PARAMETERISED_FILE
cleanup $MID_PARAMETERISED_FILE
