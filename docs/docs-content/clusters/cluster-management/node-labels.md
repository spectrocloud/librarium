---
sidebar_label: "Node Labels"
title: "Node Labels"
description: "Learn how to apply node labels to Palette clusters."
hide_table_of_contents: false
sidebar_position: 95
tags: ["clusters", "cluster management"]
---

Node labels provide pods the ability to specify which nodes they should be scheduled on. This ability can be useful in
scenarios where pods should be co-located or executed on dedicated nodes. A common use case of node labels is to ensure
that certain workloads only execute on certain hardware configurations. Labels are optional configurations, as the
scheduler will automatically place pods across nodes.

:::tip

You can think of node labels as having the opposite effect to [Taints and Tolerations](./taints.md). Taints allow you to
mark nodes as not accepting certain pods, while node labels allow you to specify that your pods should only be scheduled
on certain nodes.

:::

Palette allows you to apply node labels during cluster provisioning. Once the cluster is in a healthy state, labels can
be modified on the **Nodes** tab of the cluster details page.

This guide covers the Palette UI flow.

:::info

Node labels can also be applied to node pools using our
[Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

:::

## Prerequisites

- A [Palette](https://console.spectrocloud.com) account with the permissions to create cluster profiles and manage
  clusters. Refer to the [Roles and Permissions](../../user-management/palette-rbac/project-scope-roles-permissions.md)
  guide for more information.
- [kubectl](https://kubernetes.io/docs/reference/kubectl/) or [K9s](https://k9scli.io/) installed locally.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Profiles**.

3. Create a cluster profile to deploy to your environment. Refer to the
   [Create a Full Profile](../../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md) guide for
   more information.

4. Add a manifest to your cluster profile with a custom workload of your choice. Refer to the
   [Add a Manifest](../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-manifest-addon.md)
   for additional guidance.

5. Add a node selector to the pod specification of your manifest. Refer to the
   [Assign Pods to Nodes](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/) official
   documentation page for more details.

   ```yaml
   nodeSelector:
     key1: value1
   ```

   :::info

   You can also specify a node by name by using the `nodeName: name` option on your pod specification. We recommend
   using a node selector, as it provides a more scalable and robust solution.

   When using packs or Helm charts, the `nodeSelector` or `nodeName` options can only be specified if they are exposed
   for configuration in the `values.yaml` file.

   :::

6. Save the changes made to your cluster profile.

7. Navigate to the left **Main Menu** and select **Clusters**.

8. Click on **Add New Cluster**.

9. Fill in the **Basic Information** for your cluster and click **Next**.

10. On the **Cluster Profile** tab, select the cluster profile you previously created. Click **Next**.

11. Select a **Subscription**, **Region**, and **SSH Key** on the **Cluster Config** tab. Click **Next**.

12. On the **Nodes Config** tab, configure your control plane pool and worker pools by providing the instance type,
    availability zones and disk size.

13. The control plane pool and worker pool provide the **Additional Labels (Optional)** section. Palette accepts labels
    in the `key:value` format. Fill in the labels corresponding to the values provided in your pod specification node
    selector. Click on **Next**.

    ![Screenshot of adding node labels during cluster creation](/clusters_cluster-management_node-labels_cluster-creation-labels.webp)

    :::info

    Node labels can also be updated on a deployed cluster by editing a worker node pool from the **Nodes** tab of the
    cluster details page.

    :::

14. Accept the default settings on the **Cluster Settings** tab and click on **Validate**.

15. Click on **Finish Configuration** and deploy your cluster.

    :::further

    Refer to our [Deploy a Cluster](../../tutorials/cluster-deployment/public-cloud/deploy-k8s-cluster.md) tutorial for
    detailed guidance on how to deploy a cluster with Palette using Amazon Web Services (AWS), Microsoft Azure, or
    Google Cloud Platform (GCP) cloud providers.

    :::

## Validate

You can follow these steps to validate that your node labels are applied successfully.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the cluster you deployed, and download the [kubeconfig](./kubeconfig.md) file.

   ![Screenshot of kubeconfig file download](/clusters_cluster-management_node-labels_kubeconfig-download.webp)

4. Open a terminal window and set the environment variable `KUBECONFIG` to point to the kubeconfig file you downloaded.

   ```
   export KUBECONFIG=~/Downloads/admin.azure-cluster.kubeconfig
   ```

5. Confirm the cluster deployment process has scheduled your pods as expected. Remember that only pods will be scheduled
   on nodes with labels matching their node selectors.

   ```
   kubectl get pods --all-namespaces --output wide --watch
   ```

   :::tip

   For a more user-friendly experience, consider using [K9s](https://k9scli.io/) or a similar tool to explore your
   cluster workloads.

   :::
