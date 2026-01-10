---
sidebar_label: "Taints and Tolerations"
title: "Taints and Tolerations"
description: "Learn how to apply taints and tolerations Palette clusters."
hide_table_of_contents: false
sidebar_position: 100
tags: ["clusters", "cluster management"]
---

Taints provide nodes with the ability to repel a set of pods, allowing you to mark nodes as unavailable for certain
pods. A common use case of taints is to prevent pods from being scheduled on nodes undergoing maintenance. Tolerations
are applied to pods and allow the pods to schedule onto nodes with matching taints. Once configured, nodes do not accept
any pods that do not tolerate the taints.

:::tip

You can think of taints as having the opposite effect to [Node Labels](./node-labels.md). Taints allow you to mark nodes
as not accepting certain pods, while node labels allow you to specify that your pods should only be scheduled on certain
nodes.

:::

Palette allows you to apply taints during cluster provisioning. Once the cluster is in a healthy state, taints can be
modified on the **Nodes** tab of the cluster details page.

This guide covers the Palette UI flow.

:::info

Taints can also be applied to node pools using the Spectro Cloud
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

5. Add pod tolerations to the pod specification of your manifest. Refer to the
   [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) official
   documentation page for more details.

   :::tip

   By default, Palette will not remove pods with the toleration key `node.kubernetes.io/unschedulable` set to
   `NoSchedule`. For more information, refer to the [Pod Drainage Toleration](./node-pool.md#pod-drainage-toleration)
   section

   :::

   - Specify a custom **key** and custom **value**.
   - Palette supports the `Equal` **operator**.
   - The **effect** defines what will happen to the pods that do not tolerate a taint. Kubernetes provides three taint
     effects.

     | **Effect**         | **Description**                                                                                                                      |
     | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
     | `NoSchedule`       | Pods that cannot tolerate the node taint will not be scheduled to the node.                                                          |
     | `PreferNoSchedule` | The system will avoid placing a non-tolerant pod to the tainted node but is not guaranteed.                                          |
     | `NoExecute`        | New pods will not be scheduled on the node, and existing pods on the node, if any,will be evicted if they do not tolerate the taint. |

     ```yaml
     tolerations:
     - key: "key1"
        operator: "Equal"
        value: "value1"
        effect: "NoExecute"
     ```

     :::info

     When using packs or Helm charts, tolerations can only be specified if they are exposed for configuration in the
     `values.yaml` file.

     :::

6. Save the changes made to your cluster profile.

7. Navigate to the left **Main Menu** and select **Clusters**.

8. Click on **Add New Cluster**.

9. Fill in the **Basic Information** for your cluster and click **Next**.

10. On the **Cluster Profile** tab, select the cluster profile you previously created. Click **Next**.

11. Select a **Subscription**, **Region**, and **SSH Key** on the **Cluster Config** tab. Click **Next**.

12. On the **Nodes Config** tab, configure your control plane pool and worker pools by providing the instance type,
    availability zones and disk size.

13. The control plane pool and worker pool provide the **Taints (Optional)** section. Click on **Add New Taint** and
    fill in the toleration values specified in your cluster profile. Click on **Next**.

    ![Screenshot of adding taints during cluster creation](/clusters_cluster-management_taints_cluster-creation-taints.webp)

    :::info

    Taints can also be updated on a deployed cluster by editing a worker node pool from the **Nodes** tab of the cluster
    details page.

    :::

14. Accept the default settings on the **Cluster Settings** tab and click on **Validate**.

15. Click on **Finish Configuration** and deploy your cluster.

    :::further

    Refer to our [Getting Started](/getting-started/) tutorials for detailed guidance on how to deploy a cluster with
    Palette using Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) cloud providers.

    :::

## Validate

You can follow these steps to validate that your taints and tolerations are applied successfully.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the cluster you deployed, and download the [kubeconfig](./kubeconfig.md) file.

   ![Screenshot of kubeconfig file download](/clusters_cluster-management_taints_kubeconfig-download.webp)

4. Open a terminal window and set the environment variable `KUBECONFIG` to point to the kubeconfig file you downloaded.

   ```
   export KUBECONFIG=~/Downloads/admin.azure-cluster.kubeconfig
   ```

5. Confirm the cluster deployment process has scheduled your pods as expected. Remember that only pods with matching
   tolerations can be scheduled on nodes with configured taints.

   ```
   kubectl get pods --all-namespaces --output wide --watch
   ```

   :::tip

   For a more user-friendly experience, consider using [K9s](https://k9scli.io/) or a similar tool to explore your
   cluster workloads.

   :::

6. Verify that the taint have been applied correctly. You can retrieve the `<node-name>` from the output of step 5. 

   ```
   kubectl describe nodes <node-name> --all-namespaces | grep -i taint
   ```