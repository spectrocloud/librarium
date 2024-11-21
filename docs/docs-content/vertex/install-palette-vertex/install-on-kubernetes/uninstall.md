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

To uninstall VerteX from your cluster, you need to uninstall VerteX management plane and Cert Manager. Optionally, you
may have installed Image Swap and Reach system, which also need to be uninstalled. This uninstall process applies to
both connected and airgap instances of self-hosted VerteX.

:::warning

This installation process only applies to VerteX instances installed using Helm charts. If you used the Palette CLI to
install VerteX, this process does not apply.

:::

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

2. Issue the following command to start uninstalling the Vertex management plane. Similar to Reach, this will only
   remove the resources managed by Helm and the remaining resources will require additional manual intervention.

   ```shell
   helm uninstall hubble
   ```

3. Issue the following command to remove the namespace and custom resource definitions related to Vertex management
   plane.

   ```shell
   kubectl delete ns hubble-system || kubectl delete crd spectroclusteractions.jet.cluster.spectrocloud.com
   ```

4. Issue the following command to uninstall Cert Manager. Cert Manager does not reply on any Helm hooks and the Helm
   uninstall command will uninstall all related resources.

   ```shell
   helm uninstall cert-manager
   ```

5. (Optional) If you installed Reach, issue the following command to start uninstalling Reach. This will remove all
   resources related to Reach that are managed by Helm. However, some resources created by Helm hooks are not managed by
   Helm and will require additional manual intervention to remove.

   ```shell
   helm uninstall reach-system
   ```

6. (Optional) Issue the following commands to remove the remaining Reach system resources.

   ```shell
   kubectl delete ns reach-system
   kubectl delete crd podpresets.reach.spectrocloud.com clusterpodpresets.reach.spectrocloud.com
   kubectl delete mutatingwebhookconfiguration reach-mutating-webhook-configuration
   kubectl delete validatingwebhookconfiguration reach-validating-webhook-configuration
   kubectl delete clusterrolebinding reach-manager-rolebinding
   kubectl delete clusterrolebinding reach-proxy-rolebinding
   kubectl delete clusterrole reach-manager-role
   kubectl delete clusterrole reach-metrics-reader
   kubectl delete clusterrole reach-proxy-role
   ```

7. (Optional) If you installed Image Swap, issue the following command to remove the `image-swap` chart.

   ```shell
   helm uninstall image-swap
   ```

8. (Optional) Issue the following commands to remove the remaining resources related to `image-swap`.

   ```shell
   kubectl delete ns imageswap-system
   kubectl delete mutatingwebhookconfiguration imageswap-webhook
   kubectl delete csr imageswap.imageswap-system.cert-request
   ```

## Validate

1. Connect to your cluster via kubectl.

2. Issue the following command to get a list of remaining namespaces. Confirm that all VerteX-related namespaces have
   been deleted.

   ```shell
   kubectl get namespaces
   ```

3. Issue the following command to confirm that all charts have been uninstalled.

   ```shell
   helm ls
   ```

4. Issue the following command to retrieve all resources in your cluster across all namespaces. Confirm that no
   VerteX-related resources are remaining.

   ```shell
   kubectl get all --all-namespaces
   ```
