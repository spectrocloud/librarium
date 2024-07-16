---
sidebar_label: "Node Labels"
title: "Node Labels"
description:
  "Learn how to apply labels to Palette clusters, and how to specify Namespace labels and annotations to Add-on packs
  and packs for Container Storage Interface (CSI) and Container Network Interface (CNI) drivers."
hide_table_of_contents: false
sidebar_position: 95
tags: ["clusters", "cluster management"]
---

You can constrain a Pod to only run on a particular set of Node(s). There are several ways to do this and the
recommended approaches such as, nodeSelector, node affinity, etc all use label selectors to facilitate the selection.
Generally, such constraints are unnecessary, as the scheduler will automatically do a reasonable placement (e.g. spread
your pods across nodes so as not place the pod on a node with insufficient free resources, etc.) but there are some
circumstances where you may want to control which node the pod deploys to - for example to ensure that a pod ends up on
a machine with an SSD attached to it, or to co-locate pods from two different services that communicate a lot into the
same availability zone.

Palette enables our users to Label the nodes of a control plane and worker pool by using key/value pairs. These labels
do not directly imply anything to the semantics of the core system but are intended to be used by users to drive use
cases where pod affinity to specific nodes is desired. Labels can be attached to node pools in a cluster during creation
and can be subsequently added and modified at any time. Each node pool can have a set of key/value labels defined. The
key must be unique across all node pools for a given cluster.

Labels are optional and can be specified in the **Additional Labels** field of the node pool configuration form. Specify
one or more values as 'key:value'. You can specify labels initially during cluster provisioning and update them any time
by editing a node pool from the **Nodes** tab of the cluster details page.

## Prerequisites

- A [Spectro Cloud](https://console.spectrocloud.com) account with the permissions to create cluster profiles and manage
  clusters. Refer to the [Roles and Permissions](../../user-management/palette-rbac/project-scope-roles-permissions.md)
  guide for more information.
- [Kubectl](https://kubernetes.io/docs/reference/kubectl/) or [K9s](https://k9scli.io/) installed locally.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Profiles**.

3. Create a cluster profile to deploy to a cloud of your choosing. Refer to the
   [Create a Full Profile](../../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md) guide for
   more information.

4. Add a manifest to your cluster profile with a custom workload of your choice. Refer to the
   [Add a Manifest](../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-manifest-addon.md).

5. Specify pod tolerations in the pod specification of your workload. Palette supports the `Equal` toleration operator.
   The toleration effect can be `NoExecute`, `NoSchedule` or `PreferNoSchedule`. Refer to the
   [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) page for more
   details.

   ```yaml
   tolerations:
     - key: "key1"
       operator: "Equal"
       value: "value1"
       effect: "NoExecute"
   ```

6. Save the changes made to your cluster profile.

7. Navigate to the left **Main Menu** and select **Clusters**.

8. Click on **Add New Cluster**.

9. Fill in the **Basic Information** for your cluster and click **Next**.

10. On the **Cluster Profile** tab, select the cluster profile you previously created. Click **Next**.

11. Select a **Region** and SSH Key on the **Cluster Config** tab and click **Next**.

12. On the **Nodes Config** tab, configure your control plane pool and worker pools by providing the instance type,
    availability zones and disk size.

13. The control plane pool and worker pool provide the **Taints (Optional)** section. Click on **Add New Taint** and
    provide the values specified in your cluster profile. Click on **Next**.

![Screenshot of adding taints during cluster creation](/clusters_cluster-management_taints_cluster-creation-taints.webp)

14. Accept the default settings on the **Cluster Settings** tab and click on **Validate**.

15. Click on **Finish Configuration** and deploy your cluster.

:::further

Refer to our [Deploy a Cluster](../../tutorials/cluster-deployment/public-cloud/deploy-k8s-cluster.md) tutorial for
detailed guidance on how to deploy a cluster with Palette using Amazon Web Services (AWS), Microsoft Azure, or Google
Cloud Platform (GCP) cloud providers.

:::

## Validate

You can follow these steps to validate that your taints and tolerations are applied successfully.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the cluster you deployed, and download the [kubeconfig](./kubeconfig.md) file.

![Screenshot of Kubeconfig file download](/clusters_cluster-management_taints_kubeconfig-download.webp)

4. Open a terminal window and set the environment variable `KUBECONFIG` to point to the kubeconfig file you downloaded.

   ```
   export KUBECONFIG=~/Downloads/admin.azure-cluster.kubeconfig
   ```

5. Confirm the cluster deployment process has scheduled your pods as expected. Remember that only pods with matching
   tolerations can be scheduled on nodes with configured taints.

   ```
   kubectl get pods --all-namespaces -o wide --watch
   ```

   :::tip

   For a more user-friendly experience, consider using [K9s](https://k9scli.io/) or a similar tool to explore your
   cluster workloads.

   :::
