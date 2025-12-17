---
sidebar_label: "Deploy Windows Workloads"
title: "Deploy Microsoft Windows Workloads on an Azure AKS Cluster"
description:
  "How to create and manage Windows Node Pools and deploy a Windows-based application on an Azure AKS Cluster."
hide_table_of_contents: false
tags: ["public cloud", "azure"]
sidebar_position: 35
---

Palette supports the deployment of Microsoft Windows applications on [Azure AKS clusters](../azure/aks.md). For the
Windows applications to work, Palette requires a Windows-based node pool created within the cluster. This section guides
you on creating a Windows node pool within an existing AKS cluster managed by Palette and configuring your Windows
application to be deployed to that node pool.

## Prerequisites

- An AKS cluster created as described in the [Create and Manage Azure AKS Cluster](./aks.md) guide.

- A Linux-based node pool configured as the system node pool as described in the
  [Create and Manage Azure AKS Cluster](../azure/aks.md) guide.

- A Windows node pool configured as described in the [Create a Windows Node Pool](#create-a-windows-node-pool) section.

## Enablement

### Create a Windows Node Pool

Follow the steps below to create a Windows node pool within an existing AKS cluster. Refer to the
[Node Pools](../../cluster-management/node-pool.md) page for more information about node pool configuration.

:::info

Palette also allows you to add a Windows node pool during the creation of an AKS cluster. Refer to the
[Node Pool](../../cluster-management/node-pool.md) guide to learn more.

:::

1. Log in to Palette, navigate to the left **Main Menu**, and click on **Clusters**.

2. Select your Azure AKS cluster.

3. Navigate to the **Nodes** tab and click on **New Node Pool**.

4. Provide a name for your node pool. When naming a node pool, it is good practice to include a name that matches the
   node and operating system (OS) in Azure.

5. If auto-scaling is necessary, enable the **Enable Autoscaler** option.

   :::warning

   Do not select the **System Node Pool** option. System node pools must be Linux-based, and choosing this option will
   remove the ability to create a Windows node pool.

   :::

6. Enter the **Number of nodes in the pool**, or set the **Minimum Size** and **Maximum Size** if you have enabled
   Autoscaler.

7. Include **Additional Labels** if desired. This step is optional.

8. Enable **Taints**. This step is also optional.

9. Choose the **Instance type**. Once selected, the cost details will be displayed.

10. For the **OS Type**, choose **Windows**.

11. Select the **Managed Disk** information and its size.

12. Last, click on **Confirm** to create the Windows node pool.

The video below showcases the process of creating a Windows node pool within an existing AKS cluster.

<br />

<Video title="add-windows-node-pool" src="/videos/clusters/public-cloud/azure/add-windows-node-pool.mp4"></Video>

<br />

### Create an Add-on Profile with a Windows Workload

After creating your Windows node pool, use the following steps to create an add-on cluster profile with a Windows
workload.

13. Follow the
    [Add a Manifest to an Add-on Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-manifest-addon.md)
    guide to create an add-on cluster profile with a custom manifest.

14. Use the manifest provided below for a sample ASP.NET application. Alternatively, use your own Windows application
    manifest. It is essential to include in the `spec` block of the manifest the
    `nodeSelector: "kubernetes.io/os": windows` specification. This specification is required for Kubernetes to know
    that the application needs to be deployed on a Windows node.

    ```yaml {20-22}
    apiVersion: v1
    kind: Namespace
    metadata:
      name: win-pack
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      namespace: win-pack
      name: sample
      labels:
        app: sample
    spec:
      replicas: 1
      template:
        metadata:
          name: sample
          labels:
            app: sample
        spec:
          nodeSelector:
            "kubernetes.io/os": windows
          containers:
            - name: sample
              image: mcr.microsoft.com/dotnet/framework/samples:aspnetapp
              resources:
                limits:
                  cpu: 1
                  memory: 800M
              ports:
                - containerPort: 80
      selector:
        matchLabels:
          app: sample
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: sample
      namespace: win-pack
    spec:
      type: LoadBalancer
      ports:
        - protocol: TCP
          port: 80
      selector:
        app: sample
    ```

### Deploy a Windows Add-on Profile to an Existing AKS Cluster

Lastly, after creating your add-on cluster profile, attach it to your AKS cluster that has the previously created
Windows node pool. Follow the steps outlined in the
[Attach an Add-on Profile](../../../clusters/imported-clusters/attach-add-on-profile.md#attach-an-add-on-profile) guide
to attach your add-on cluster profile to the AKS cluster.

## Validate

1. In Palette, navigate to the left **Main Menu** and select **Clusters**.

2. Next, click on your AKS cluster, which will open the cluster's **Overview** page.

3. Click on the exposed **Services** URL to access the Windows application landing page.
