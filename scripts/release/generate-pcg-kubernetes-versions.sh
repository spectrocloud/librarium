#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define files to modify
PCG_FILE="docs/docs-content/clusters/pcg/pcg.md"
PCG_TEMPLATE_FILE="scripts/release/templates/pcg-kubernetes-version.md"
PCG_PARAMETERISED_FILE="scripts/release/templates/pcg-kubernetes-version-output.md"
TABLE_OFFSET=2

if ! check_env "RELEASE_NAME" || 
   ! check_env "RELEASE_VERSION" ||  
   ! check_env "RELEASE_PCG_KUBERNETES_VERSION" ; then
    echo "‼️  Skipping generate $PCG_FILE due to missing environment variables. ‼️"
    exit 0
fi

generate_parameterised_file $PCG_TEMPLATE_FILE $PCG_PARAMETERISED_FILE

# The anchor is matched with its closing " -->" so a release name cannot substring-match a
# longer one, matching the row for another release and overwriting it. RELEASE_NAME is a
# named release such as 4.10.0 or 4.10.a today, but generate-patch-release-notes.sh passes a
# patch version through the same scripts, where 4.9.5 and 4.9.51 can both hold a row.
existing_pcg=$(search_line "pcg-k8s-$RELEASE_NAME -->" $PCG_FILE)
if [[ -n "$existing_pcg" && "$existing_pcg" -ne 0 ]]; then
    echo "ℹ️ PCG Kubernetes version for $RELEASE_NAME has already been generated in $PCG_FILE"
    replace_line $existing_pcg $PCG_PARAMETERISED_FILE $PCG_FILE
    echo "✅ Replaced PCG Kubernetes version entry in $PCG_FILE"
else
    insert_file_offset $TABLE_OFFSET "pcg-kubernetes-version-table" $PCG_PARAMETERISED_FILE $PCG_FILE
    echo "✅ Parameterised PCG Kubernetes version inserted into $PCG_FILE"
fi

cleanup $PCG_PARAMETERISED_FILE
