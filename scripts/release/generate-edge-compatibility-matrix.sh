#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define Edge Compatibility Matrix related files
EDGE_COMPATIBILITY_MATRIX_FILE="${EDGE_COMPATIBILITY_MATRIX_FILE:-docs/docs-content/clusters/edge/edge-compatibility-matrix.md}"
EDGE_COMPATIBILITY_TEMPLATE_FILE="scripts/release/templates/edge-compatibility-matrix.md"
EDGE_COMPATIBILITY_PARAMETERISED_FILE="scripts/release/edge-compatibility-matrix-output.md"
TABLE_OFFSET=2

if ! check_env "RELEASE_NAME" ||
   ! check_env "RELEASE_VERSION" ||
   ! check_env "RELEASE_CANVOS" ||
   ! check_env "RELEASE_PALETTE_CLI_VERSION"; then
    echo "‼️  Skipping generate $EDGE_COMPATIBILITY_MATRIX_FILE due to missing environment variables. ‼️"
    exit 0
fi

if [[ "${RELEASE_EDGE_CLI_DEPRECATED}" == "true" ]]; then
    RELEASE_EDGE_CLI_STATUS="Deprecated. Use Palette CLI for supported workflows."
elif [[ -n "${RELEASE_EDGE_CLI_VERSION}" ]]; then
    RELEASE_EDGE_CLI_STATUS="$RELEASE_EDGE_CLI_VERSION"
else
    RELEASE_EDGE_CLI_STATUS="$RELEASE_CANVOS"
fi

export RELEASE_EDGE_CLI_STATUS

if [[ ! -f "$EDGE_COMPATIBILITY_MATRIX_FILE" ]]; then
    echo "❌ Edge Compatibility Matrix file $EDGE_COMPATIBILITY_MATRIX_FILE not found. Nothing was inserted."
    exit 1
fi

generate_parameterised_file $EDGE_COMPATIBILITY_TEMPLATE_FILE $EDGE_COMPATIBILITY_PARAMETERISED_FILE

existing_entry=$(search_line "edge-compat-$RELEASE_NAME" $EDGE_COMPATIBILITY_MATRIX_FILE)
if [[ -n "$existing_entry" && "$existing_entry" -ne 0 ]]; then
    echo "ℹ️ Edge Compatibility Matrix entry for $RELEASE_NAME has already been generated in $EDGE_COMPATIBILITY_MATRIX_FILE"
    replace_line $existing_entry $EDGE_COMPATIBILITY_PARAMETERISED_FILE $EDGE_COMPATIBILITY_MATRIX_FILE
    echo "✅ Replaced Edge Compatibility Matrix line entry in $EDGE_COMPATIBILITY_MATRIX_FILE"
else
    insert_file_offset $TABLE_OFFSET "Palette Release" $EDGE_COMPATIBILITY_PARAMETERISED_FILE $EDGE_COMPATIBILITY_MATRIX_FILE
    echo "✅ Parameterised Edge Compatibility Matrix changes inserted into $EDGE_COMPATIBILITY_MATRIX_FILE"
fi

cleanup $EDGE_COMPATIBILITY_PARAMETERISED_FILE
