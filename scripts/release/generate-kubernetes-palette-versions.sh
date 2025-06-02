#!/bin/bash

# Import utility functions
source scripts/release/utilities.sh

# Define files to modify
VERSIONS_FILE="_partials/self-hosted/_palette-vmware-kubernetes-versions.mdx"
VERTEX_VERSIONS_FILE="_partials/vertex/_palette-vmware-kubernetes-versions.mdx"
K8S_VERSIONS_FILE="_partials/_palette-kubernetes-versions.mdx"
VMWARE_TEMPLATE_FILE="scripts/release/templates/vmware-kubernetes-version.md"
VERTEX_VMWARE_TEMPLATE_FILE="scripts/release/templates/vertex-vmware-kubernetes-version.md"
KUBERNETES_TEMPLATE_FILE="scripts/release/templates/kubernetes-max-version.md"
VMWARE_PARAMETERISED_FILE="scripts/release/templates/vmware-kubernetes-version-output.md"
VERTEX_VMWARE_PARAMETERISED_FILE="scripts/release/templates/vertex-vmware-kubernetes-version-output.md"
KUBERNETES_PARAMETERISED_FILE="scripts/release/templates/kubernetes-max-version-output.md"
TABLE_OFFSET=2

if ! check_env "RELEASE_NAME" || 
   ! check_env "RELEASE_VERSION" || 
   ! check_env "RELEASE_VMWARE_KUBERNETES_VERSION" ||  
   ! check_env "RELEASE_VMWARE_OVA_URL" ||  
   ! check_env "RELEASE_VMWARE_FIPS_OVA_URL" ||
   ! check_env "RELEASE_HIGHEST_KUBERNETES_VERSION"; then
    echo "‼️  Skipping generate $VERSIONS_FILE due to missing environment variables. ‼️"
    exit 0
fi

generate_parameterised_file $VMWARE_TEMPLATE_FILE $VMWARE_PARAMETERISED_FILE
generate_parameterised_file $VERTEX_VMWARE_TEMPLATE_FILE $VERTEX_VMWARE_PARAMETERISED_FILE
generate_parameterised_file $KUBERNETES_TEMPLATE_FILE $KUBERNETES_PARAMETERISED_FILE

existing_vmware=$(search_line "vmware-k8s-$RELEASE_NAME" $VERSIONS_FILE)
if [[ -n "$existing_vmware" && "$existing_vmware" -ne 0 ]]; then
    echo "ℹ️ VMware Kubernetes version for $RELEASE_NAME has already been generated in $VERSIONS_FILE"
    replace_line $existing_vmware $VMWARE_PARAMETERISED_FILE $VERSIONS_FILE
    echo "✅ Replaced VMware Kubernetes version entry in $VERSIONS_FILE"
else
    insert_file_offset $TABLE_OFFSET "vmware-kubernetes-version-table" $VMWARE_PARAMETERISED_FILE $VERSIONS_FILE
    echo "✅ Parameterised VMware Kubernetes version inserted into $VERSIONS_FILE"
fi

existing_vertex_vmware=$(search_line "vmware-k8s-$RELEASE_NAME" $VERTEX_VERSIONS_FILE)
if [[ -n "$existing_vertex_vmware" && "$existing_vertex_vmware" -ne 0 ]]; then
    echo "ℹ️ VMware Kubernetes version for $RELEASE_NAME has already been generated in $VERTEX_VERSIONS_FILE"
    replace_line $existing_vertex_vmware $VERTEX_VMWARE_PARAMETERISED_FILE $VERTEX_VERSIONS_FILE
    echo "✅ Replaced VMware Kubernetes version entry in $VERTEX_VERSIONS_FILE"
else
    insert_file_offset $TABLE_OFFSET "vmware-kubernetes-version-table" $VERTEX_VMWARE_PARAMETERISED_FILE $VERTEX_VERSIONS_FILE
    echo "✅ Parameterised VMware Kubernetes version inserted into $VERTEX_VERSIONS_FILE"
fi

existing_kubernetes=$(search_line "k8s-max-$RELEASE_NAME" $K8S_VERSIONS_FILE)
if [[ -n "$existing_kubernetes" && "$existing_kubernetes" -ne 0 ]]; then
    echo "ℹ️ Kubernetes highest version entry for $RELEASE_NAME has already been generated in $K8S_VERSIONS_FILE"
    replace_line $existing_kubernetes $KUBERNETES_PARAMETERISED_FILE $K8S_VERSIONS_FILE
    echo "✅ Replaced Kubernetes highest version entry in $K8S_VERSIONS_FILE"
else
    insert_file_offset $TABLE_OFFSET "kubernetes-max-version-table" $KUBERNETES_PARAMETERISED_FILE $K8S_VERSIONS_FILE
    echo "✅ Parameterised Kubernetes highest version inserted into $K8S_VERSIONS_FILE"
fi

cleanup $VMWARE_PARAMETERISED_FILE
cleanup $VERTEX_VMWARE_PARAMETERISED_FILE
cleanup $KUBERNETES_PARAMETERISED_FILE
