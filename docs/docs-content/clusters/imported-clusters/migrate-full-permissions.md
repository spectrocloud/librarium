---
sidebar_label: "Migrate to Full Permissions"
title: "Migrate to Full Permissions"
description: "Learn how to migrate an imported cluster from read-only mode to full-permissions mode."
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "imported clusters"]
---

Clusters imported in read-only mode can be migrated to full permission mode at any time. Migrating upgrades the Palette
agent's Role-Based Access Control (RBAC) permissions, which enables additional Day-2 operations such as deploying add-on
profiles, configuring RBAC bindings, running compliance scans, and scheduling backups. The agent also automatically
installs a metrics server if one is not already present on the cluster. For a full comparison of what each mode
supports, refer to [Import Modes](imported-clusters.md#import-modes).

## Prerequisites

- An imported cluster in read-only mode. Refer to the [Import a Cluster](cluster-import.md) guide to learn how to import
  a cluster into Palette.

- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed on your local workstation and configured to access your
  imported cluster.

## Migrate to Full Permissions

1. Log in to [Palette](https://spectrocloud.com).

2. From the left main menu, select **Clusters**.

3. Select your imported read-only cluster from the **Clusters** table.

4. On the cluster **Overview** tab, select **Migrate To Full Permissions**. Select **OK** to begin the migration
   process.

   ![The cluster details view highlighting migrate button](/clusters_imported-clusters_migrate-full-permissions_cluster-details-page.webp)

5. Copy the command displayed in the drawer. The command is customized for your cluster, as it contains the assigned
   cluster ID.

6. Open a terminal on your local workstation and verify you are in the correct
   [Kubernetes context](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_config/).

   ```shell
   kubectl config current-context
   ```

   ```shell title="Example output" hideClipboard
   kind-import-cluster-full
   ```

   If you are not in the correct Kubernetes context, switch to the proper context so you are interacting with the
   correct imported cluster when using kubectl. To do so, verify the contexts available in your current kubeconfig file.
   Your current context is indicated with an asterisk (`*`).

   ```shell
   kubectl config get-contexts
   ```

   ```shell title="Example output" hideClipboard
   CURRENT   NAME                          CLUSTER                       AUTHINFO                          NAMESPACE
   *         kind-import-cluster-full      kind-import-cluster-full      kind-import-cluster-full          default
             kind-import-cluster-read      kind-import-cluster-read      kind-import-cluster-palette       default
   ```

   Use the following command to switch to the appropriate context.

   ```shell
   kubectl config use-context <context-name>
   ```

   If the desired context is not part of your current kubeconfig file, set the `KUBECONFIG` variable to the path that
   contains the correct context, and set the context.

   ```shell
   export KUBECONFIG=<path-to-kubeconfig>
   kubectl config use-context <context-name>
   ```

7. Paste the command you copied in your terminal to start the migration.

   ```shell title="Example command" hideClipboard
   kubectl apply --filename https://api.dev.spectrocloud.com/v1/spectroclusters/69e67ccb13d6a6578fc2bdd3/import/manifest
   ```

   ```hideClipboard shell title="Example output"
   namespace/cluster-69e67ccb13d6a6578fc2bdd3 configured
   customresourcedefinition.apiextensions.k8s.io/awscloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/azurecloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/cloudstackcloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/clusterprofiles.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/customcloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/edgecloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/edgenativecloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/gcpcloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/maascloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/nestedcloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/packs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/spectroclusters.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/vspherecloudconfigs.cluster.spectrocloud.com configured
   serviceaccount/palette-manager created
   clusterrolebinding.rbac.authorization.k8s.io/palette-lite-cluster-admin-binding configured
   configmap/palette-version-info-g7bkcc8gf2 created
   priorityclass.scheduling.k8s.io/palette-spectro-cluster-critical configured
   deployment.apps/palette-lite-controller-manager created
   job.batch/palette-import-presetup-job created
   serviceaccount/cluster-management-agent unchanged
   clusterrole.rbac.authorization.k8s.io/cma-lite-cluster-least-privilege-role unchanged
   clusterrolebinding.rbac.authorization.k8s.io/cma-lite-cluster-least-privilege-binding configured
   configmap/log-parser-config unchanged
   configmap/upgrade-info-5tgb8c4chb unchanged
   configmap/version-info-5hkbtbgh44 unchanged
   priorityclass.scheduling.k8s.io/spectro-cluster-critical configured
   deployment.apps/cluster-management-agent-lite configured
   configmap/cluster-info unchanged
   configmap/hubble-info unchanged
   secret/hubble-secrets configured
   ```

8. The drawer disappears, and the **Profile**, **Workloads**, **Scan**, and **Backups** tabs are unlocked.

              ![A cluster details page with an imported cluster after a completed migration](/clusters_imported-clusters_migrate-full-permissions_cluster-details-page-import-complete.webp)

You have successfully migrated a read-only mode cluster to full permission mode.

## Validate

1. Log in to [Palette](https://spectrocloud.com).

2. From the left main menu, select **Clusters**.

3. From the **Clusters** table, select your imported cluster.

4. Verify that you can interact with the **Profile**, **Workloads**, **Scan**, and **Backups** tabs. The **Migrate To Full Permissions** button should also no longer be available. 

## Next Steps

Imported clusters in full permission mode allow you to perform additional Day-2 activities through Palette. You can also
deploy add-on cluster profiles to build upon your cluster's current functionality. Refer to the
[Attach an Add-on Profile](attach-add-on-profile.md) guide to learn more.
