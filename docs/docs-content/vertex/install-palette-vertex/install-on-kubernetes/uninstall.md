---
sidebar_label: "Uninstallation"
title: "Uninstall VerteX"
description: "Learn how to uninstall a VerteX installation from your cluster using Helm charts."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["self-hosted", "enterprise"]
keywords: ["self-hosted", "enterprise"]
---

To uninstall VerteX from your cluster, you need to uninstall the following components: Reach system, VerteX management
plane, and Cert Manager. This uninstall process applies to both connected and airgap instances of self-hosted VerteX.

## Prerequisite

- An active self-hosted VerteX instance.

- Access to the Kubernetes cluster where VerteX is deployed.

- Permissions to perform delete actions on all relevant cluster resources.

- Helm is installed and available on your host machine.

- kubectl is installed and available on your host machine.

## Uninstall VerteX

1. Ensure you are using the appropriate context where VerteX is deployed.

   ```shell
   kubectl config current-context
   ```

2. Issue the following command to start uninstalling Reach. This will remove all resources related to Reach that are
   managed by Helm. However, some resources created by Helm hooks are not managed by Helm and will require additional
   manual intervention to remove.

   ```shell
   helm uninstall reach-system
   ```

3. Issue the following command to remove the remaining Reach system resources.

   ```shell
   kubectl get all,configmap,secret,serviceaccount,mutatingwebhookconfiguration,validatingwebhookconfiguration,clusterpodpreset --output=jsonpath='{range .items[?(@.metadata.annotations.helm\.sh/hook)]}{.kind}/{.metadata.name}{"\n"}{end}' --namespace reach-system | grep -v "ReplicaSet/" | xargs -r kubectl delete --namespace reach-system && kubectl delete ns reach-system && kubectl delete crd podpresets.reach.spectrocloud.com clusterpodpresets.reach.spectrocloud.com
   ```

4. Issue the following command to start uninstalling the VerteX management plane. Similar to Reach, this will only
   remove the resources managed by Helm and the remaining resources will require additional manual intervention.

   ```shell
   helm uninstall hubble
   ```

5. Issue the following command to remove the namespace and custom resource definitions related to VerteX management
   plane.

   ```shell
   kubectl delete ns hubble-system && kubectl delete crd spectroclusteractions.jet.cluster.spectrocloud.com
   ```

6. Finally, issue the following command to uninstall Cert Manager. Cert Manager does not reply on any Helm hooks and the
   Helm uninstall command will uninstall all related resources.

   ```shell
   helm uninstall cert-manager
   ```

## Validate

1. Connect to your cluster via kubectl.

2. Issue the following command to get a list of remaining namespaces. Confirm that all VerteX-related namespaces have
   been deleted.

   ```shell
   kubectl get namespaces
   ```

3. Issue the following command to retrieve all resources in your cluster across all namespaces. Confirm that no
   VerteX-related resources are remaining.

   ```shell
   kubectl get all --all-namespaces
   ```
