---
sidebar_label: "Uninstallation"
title: "Uninstall Palette"
description: "Learn how to uninstall a Palette installation from your cluster using Helm charts."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["self-hosted", "enterprise"]
keywords: ["self-hosted", "enterprise"]
---

To uninstall Palette from your cluster, you need to uninstall several components: `reach-system`,
`spectro-management-plane`, and `cert-manager`.

## Prerequisite

- An active self-hosted Palette instance.

- Access to the Kubernetes cluster where Palette is deployed.

- Permissions to perform delete actions on all relevant cluster resources.

- Helm is installed and available on your host machine.

- kubectl is installed and available on your host machine.

## Uninstall Palette

1. Ensure you are using the appropriate context where Palette is deployed.

   ```shell
   kubectl config current-context
   ```

2. Issue the following command to start uninstalling reach. This will remove all resources related to reach that are
   managed by Helm. However, some resources created by Helm hooks are not managed by helm and will require additional
   manual intervention to remove.

   ```shell
   helm uninstall reach-system
   ```

3. Issue the following command to remove the remaining reach resources.

   ```shell
   kubectl get all,configmap,secret,serviceaccount,mutatingwebhookconfiguration,validatingwebhookconfiguration,clusterpodpreset --output=jsonpath='{range .items[?(@.metadata.annotations.helm\.sh/hook)]}{.kind}/{.metadata.name}{"\n"}{end}' --namespace reach-system | grep -v "ReplicaSet/" | xargs -r kubectl delete --namespace reach-system && kubectl delete ns reach-system && kubectl delete crd podpresets.reach.spectrocloud.com clusterpodpresets.reach.spectrocloud.com
   ```

4. Issue the following command to start uninstalling the Palette management plane. Similar to reach, this will only
   remove the resources managed by Helm and the remaining resources will require additional manual intervention.

   ```shell
   helm uninstall hubble
   ```

5. Issue the following command to remove the namespace and custom resource definition related to Palette management
   plane.

   ```shell
   kubectl delete ns hubble-system && kubectl delete crd spectroclusteractions.jet.cluster.spectrocloud.com
   ```

6. Finally, issue the following command to uninstall cert-manager. Cert-manager does not reply on any Helm hooks and the
   Helm uninstall command will uninstall all related resources.

   ```shell
   helm uninstall cert-manager
   ```

## Validate

1. Connect to your cluster via kubectl.

2. Issue the following command to get a list of remaining namespaces. Confirm that all Palette-related namespaces have
   been deleted.

   ```shell
   kubectl get namespaces
   ```

3. Issue the following command to retrieve all resources in your cluster across all namespaces. Confirm that no
   Palette-related resources are remaining.

   ```shell
   kubectl get all --all-namespaces
   ```
