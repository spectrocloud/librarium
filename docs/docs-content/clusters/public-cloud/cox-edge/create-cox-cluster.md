---
sidebar_label: "Create and Manage Cox IaaS Cluster"
title: "Create and Manage Cox IaaS Cluster"
description: "Learn how to add and manage a cluster deployed to Cox Edge."
hide_table_of_contents: false
sidebar_position: 10
tags: ["public cloud", "cox edge"]
---

Palette supports creating and managing Kubernetes clusters deployed to a Cox Edge account. This section guides you on how to create a Kubernetes cluster in Cox Edge that is managed by Palette.

## Prerequisites

- A [Spectro Cloud](https://console.spectrocloud.com) account.

- A [Cox Edge](https://portal.coxedge.com/login) account.

- A Cox Edge account registered in Palette. Check out the [Register and Manage Cox Edge Accounts](add-cox-edge-accounts.md) guide to learn how to register a Cox Edge account in Palette.

- A cluster profile for Cox Edge clusters. If you need guidance creating a cluster profile, check out [Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md).

## Create a Cluster

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to the left **Main Menu** and select **Clusters**.

3.  Click **+ Add New Cluster** and select **Deploy New Cluster**.

4.  Select **Cox Edge** from the list of infrastructure providers.

5.  Fill out the following input fields and click **Next**.

    - Cluster name: The name of the new cluster.
    - Description: A text value that explains the cluster.
    - Tags: Assign tags to the cluster.
    - Cloud Account: Select your Cox Edge account.

6.  Select a cluster profile that is compatible with Cox Edge. If you need guidance creating a cluster profile, check out [Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md).

:::warning

If you want to use the Kubernetes cluster autoscaler feature and you are using [Longhorn](../../../integrations/longhorn.md) for the storage container interface. Set the `charts.longhorn.defaultSettings.kubernetesClusterAutoscalerEnabled` parameter to `true`.

```yaml
charts:
  longhorn:
    defaultSettings:
      kubernetesClusterAutoscalerEnabled: true
```

:::

7. Review the cluster profile and all of its manifest files. Click **Next** to continue.

8. Fill out the following input fields and select **Next**.

   - SSH Keys: Select an SSH key pair or create a new key pair.
   - Load Balancer PoP: The location where you want to deploy the cluster compute resources.
   - Organization: The Cox Edge organization to target for the deployment.
   - Environment: The Cox Edge environment to deploy the compute resources.
   - Update worker pools in parallel: Enable this checkbox if you wish to update worker pool nodes in parallel.

9. Configure the master and worker node pools. The following input fields apply to Cox Edge master and worker node pools. For a description of input fields that are common across target platforms refer to the [Node Pools](../../cluster-management/node-pool.md) management page. Click **Next** when you are done.

  <br />

#### Master Pool configuration:

    - Cloud Configuration:

      - Deployment Name: The name to assign the Cox Edge deployment.
      - PoP: The Cox Edge location to target.
      - Instance Type: The compute size.
      - Network policies: The network rules to apply to the deployment. Review the list of required network policies in the [Network Rules](network-rules.md) documentation.

  <br />

:::warning

Use the network rules specified in the [Network Rules](network-rules.md) documentation. If you fail to add the required network rules, Palette will be unable to deploy the cluster to Cox Edge.

:::

#### Worker Pool configuration:

    - Cloud Configuration:
      - Deployment Name: The name to assign the Cox Edge deployment.
      - PoP: The Cox Edge location to target.
      - Instance Type: The compute size.
      - Network policies: The network rules to apply to the deployment. Review the list of required network policies in the [Network Rules](network-rules.md) documentation.

10. The settings page is where you can configure patching schedule, security scans, backup settings, set up role-based access control (RBAC), and enable [Palette Virtual Clusters](../../../devx/palette-virtual-clusters/palette-virtual-clusters.md). Review the settings and make changes if needed. Click **Validate**.

11. Review the settings summary and click **Finish Configuration** to deploy the cluster. Be aware that provisioning IaaS clusters can take several minutes.

The cluster details page contains the status and details of the deployment. Use this page to track the deployment progress.

## Validate

You can validate your cluster is up and running by reviewing the cluster details page. Navigate to the left **Main Menu** and click **Clusters**. The **Clusters** page contains a list of all available clusters Palette manages. Select the cluster to review its details page. Ensure the **Cluster Status** field contains the value **Running**.

## Delete a Cox Edge IaaS Cluster

When you delete a Cox Edge cluster, all instances and associated resources created for the cluster are removed. To delete a cluster, use the following steps.

1. Ensure you are in the correct project scope.

2. Navigate to the left **Main Menu** and click **Clusters**.

3. Select the cluster you want to delete.

4. Click the **Settings** drop-down menu and select **Delete Cluster**.

5. Click on **Delete Cluster**

6. Type the name of the cluster and click **OK**

The cluster status is updated to **Deleting** while cluster resources are being deleted. When all resources are successfully deleted, the cluster status is updated to **Deleted** and the cluster is removed from the list.

## Force Delete a Cluster

If a cluster is stuck in the **Deletion** state for a minimum of 15 minutes it becomes eligible for force deletion. You can force delete a cluster from the tenant and project admin scope.
To force delete a cluster follow the same steps outlined in [Delete a Cox Edge IaaS Cluster](#delete-a-cox-edge-iaas-cluster). However, after 15 minutes, a **Force Delete Cluster** option is available in the **Settings drop-down Menu**. The **Settings** drop-down menu provides you with an estimated time left before the force deletion becomes available.
