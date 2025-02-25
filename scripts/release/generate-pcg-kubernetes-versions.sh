#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define cli related files
PCG_FILE="docs/docs-content/clusters/pcg/pcg.md"
PCG_TEMPLATE_FILE="scripts/release/templates/pcg-kubernetes-version.md"
PCG_PARAMETERISED_FILE="scripts/release/templates/pcg-kubernetes-version-output.md"
TABLE_OFFSET=2

generate_parameterised_file $PCG_TEMPLATE_FILE $PCG_PARAMETERISED_FILE

existing_pcg=$(search_line "pcg-k8s-$RELEASE_NAME" $PCG_FILE)
if [[ -n "$existing_pcg" && "$existing_pcg" -ne 0 ]]; then
    echo "ℹ️ PCG Kubernetes version for $RELEASE_NAME has already been generated in $PCG_FILE"
    replace_line $existing_pcg $PCG_PARAMETERISED_FILE $PCG_FILE
    echo "✅ Replaced PCG Kubernetes version entry in $PCG_FILE"
else
    insert_file_offset $TABLE_OFFSET "pcg-kubernetes-version-table" $PCG_PARAMETERISED_FILE $PCG_FILE
    echo "✅ Parameterised PCG Kubernetes version inserted into $PCG_FILE"
fi

cleanup $PCG_PARAMETERISED_FILE
