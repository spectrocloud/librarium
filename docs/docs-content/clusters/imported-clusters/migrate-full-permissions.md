---
sidebar_label: "Migrate to Full Permissions"
title: "Migrate to Full Permissions"
description: "Learn how to migrate an imported cluster from read-only mode to full-permissions mode."
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "imported clusters"]
---

## Prerequisites

* An imported cluster in read-only mode. Refer to the [Import a Cluster](cluster-import.md) guide to learn how to import a cluster into Palette.


* Ensure [kubectl](https://kubernetes.io/docs/tasks/tools/) is installed and available in your local workstation.


- Access to your cluster environment through kubectl. 


## Migrate to Full Permissions

1. Log in to [Palette](https://spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.



3. Select your imported cluster from the cluster list.


4. From the cluster details page, click on **Migrate To Full Permissions** to start the migration process. A prompt will ask you to confirm your decision. Select **OK**.

  <br />

  ![The cluster details view with an arrow pointing to the migrate button](/clusters_imported-clusters_migrate-full-permissions_cluster-details-page.png)

  <br />

5. A side view drawer will slide out from the right side of the cluster details page. Copy the displayed command to your clipboard.



6. Open a terminal on your local workstation and validate you are in the correct Kubernete context. You can use the following command to verify the Kubernetes context. If you find yourself in an incorrect Kubernetes context, switch to the proper context so you are interacting with the imported cluster when using kubectl.

  <br />

  ```shell
  kubectl config current-context
  ```

7. Issue the command you copied in your terminal to start the migration. Your terminal output will look similar to the example output below.

  <br />

  ```hideClipboard shell
  namespace/cluster-6495ea8d4c39b720c58a5f5f configured
  serviceaccount/cluster-management-agent unchanged
  clusterrolebinding.rbac.authorization.k8s.io/cma-lite-cluster-admin-binding created
  configmap/log-parser-config unchanged
  configmap/upgrade-info-8kfc2m8mt8 unchanged
  configmap/version-info-kbk5hk992f unchanged
  secret/spectro-image-pull-secret unchanged
  priorityclass.scheduling.k8s.io/spectro-cluster-critical configured
  deployment.apps/cluster-management-agent-lite configured
  configmap/cluster-info unchanged
  configmap/hubble-info unchanged
  secret/hubble-secrets configured
  customresourcedefinition.apiextensions.k8s.io/awscloudconfigs.cluster.spectrocloud.com created
  customresourcedefinition.apiextensions.k8s.io/azurecloudconfigs.cluster.spectrocloud.com created
  customresourcedefinition.apiextensions.k8s.io/clusterprofiles.cluster.spectrocloud.com created
  customresourcedefinition.apiextensions.k8s.io/coxedgecloudconfigs.cluster.spectrocloud.com created
  customresourcedefinition.apiextensions.k8s.io/edgecloudconfigs.cluster.spectrocloud.com created
  customresourcedefinition.apiextensions.k8s.io/edgenativecloudconfigs.cluster.spectrocloud.com created
  customresourcedefinition.apiextensions.k8s.io/gcpcloudconfigs.cluster.spectrocloud.com created
  customresourcedefinition.apiextensions.k8s.io/libvirtcloudconfigs.cluster.spectrocloud.com created
  customresourcedefinition.apiextensions.k8s.io/maascloudconfigs.cluster.spectrocloud.com created
  customresourcedefinition.apiextensions.k8s.io/nestedcloudconfigs.cluster.spectrocloud.com created
  customresourcedefinition.apiextensions.k8s.io/openstackcloudconfigs.cluster.spectrocloud.com created
  customresourcedefinition.apiextensions.k8s.io/packs.cluster.spectrocloud.com created
  customresourcedefinition.apiextensions.k8s.io/spectroclusters.cluster.spectrocloud.com created
  customresourcedefinition.apiextensions.k8s.io/tencentcloudconfigs.cluster.spectrocloud.com created
  customresourcedefinition.apiextensions.k8s.io/vspherecloudconfigs.cluster.spectrocloud.com created
  serviceaccount/palette-manager created
  clusterrolebinding.rbac.authorization.k8s.io/palette-lite-cluster-admin-binding created
  configmap/palette-version-info-dd8mkdffbt created
  priorityclass.scheduling.k8s.io/palette-spectro-cluster-critical created
  deployment.apps/palette-lite-controller-manager created
  job.batch/palette-import-presetup-job created
  ```

  
8. In a few minutes, the side drawer will disappear, and the **Profile**, **Workloads**, **Scan**, and **Backups** tabs will become unlocked and available for interaction.

  <br />

  ![A cluster details page with an imported cluster after a completed migration](/clusters_imported-clusters_migrate-full-permissions_cluster-details-page-import-complete.png)


You now have successfully migrated a read-only mode cluster to full-permissions mode. Imported clusters in full-permissions mode allow Palette to manage more Day-2 activities. You can also now deploy add-on cluster profiles to the cluster. Refer to the [Attach an Add-on Profile](attach-add-on-profile.md) guide to learn more.

## Validate

1. Log in to [Palette](https://spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select your imported cluster from the cluster list.


4. Review the **Cluster Status** row from the cluster details view. A successful cluster import displays cluster status as **Running**.