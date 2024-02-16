---
sidebar_label: "Running Windows Workloads"
title: "Running MS Windows Workloads on an Azure AKS Cluster"
description: "How to create and manage Windows Node Pools and run a Windows based application"
hide_table_of_contents: false
tags: ["public cloud", "azure"]
sidebar_position: 35
---

Palette supports the deployment of Microsoft Windows Applications on Azure AKS Clusters. Windows Applications require a
Windows based Node Pool to run. This section guides you on how to create an AKS Cluster with a Windows Node Pool and how
to configure your Windows Application to be deployed to that Windows Node Pool

## Prerequisites

These prerequisites must be met before deploying a Windows Workload:

1. An AKS Cluster created as descibed in [Create and Manage Azure AKS CLuster](./aks.md)

2. A Linux based Node Pool configured as the System Node Pool as described in
   [Create a System Node Pool](./aks#create-a-system-node-pool)

3. A second Windows based Node Pool Configured as described [Create a Windows Node Pool](#create-a-windows-node-pool)

## Create a Windows Node Pool

<Video title="add-windows-node-pool" src="/videos/clusters/public-cloud/azure/add-windows-node-pool.mp4"></Video>

The following steps need to be performed to to add Windows node pool to an existing AKS cluster:

1. If you have an existing AKS Cluster deployed go to **Clusters** and select the cluster.

2. Go to **Nodes** and click **New Node Pool**.

3. Provide a name in the **Node pool name** text box. When creating a node, it is good practice to include an
   identifying name that matches the node and OS in Azure.

4. If auto-scaling is desired select **Enable Autoscaler**.

<br />

:::info

Do NOT select **System Node Pool**. System Node Pools, must be Linux based and this option will remove the abilty to
make the node pool Windows based

:::

<br />

4. Enter **Number of nodes in the pool** or **Minimum size** and **Maximum Size** if you enabled Autoscaler.

5. Include **Additional Labels**. This is optional.

6. Enable **Taints**. This is optional.

7. Select the **Instance type**. The cost details are present for review.

8. For **OS Type** select **Windows**.

9. Select the **Managed Disk** information and its size.

10. Select **Confirm**.

<br />

:::info

Palette **also** allows you to add a Windows Node Pool at the time of an AKS Cluster Creation. Follow
[Create and Manage Azure AKS CLuster / Create and Remove Node Pools](./aks#create-and-remove-node-pools). When creating
additional node pools, select **OS Type** Windows to make the node pool Windows based.

:::

<br />

## Create an Add-on Profile with a Windows Workload

<br />

<Video title="add-win-profile" src="/videos/clusters/public-cloud/azure/add-win-profile.mp4"></Video>

{" "}

<br />
<br />

:::info

Kubernetes does not automatically know if an application is Windows based and should be placed on a Windows node. When
defining a Windows Application in a Profile you will need to add a manifest with  
 **nodeSelector: "kubernetes.io/os": windows**, so Kubernetes will place that application on a Windows node.

:::

<br />

1. Follow
   [Add a manifest to an add-on profile ](../../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-manifest-addon.md#add-manifest-to-add-on-profile)
   to create a cluster profile with a custom manifest.

2. Use the manifest below, which is for a sample asp.net app or use your own Windows application manifest. Defining
   **spec** of **nodeSelector: "kubernetes.io/os": windows** is required for Kubernetes to know to application needs to
   be place on a Windows Node.

   ```yaml
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

## Deploy a Windows add-on profile to an existing cluster

<br />

<Video title="deploy-windows-pack" src="/videos/clusters/public-cloud/azure/deploy-windows-pack.mp4"></Video>

{" "}

<br />
<br />
<br />

:::info

The existing cluster must have an existing Windows Node Pool to be able to sucessfully deploy a Windows workload.

:::

<br />

1. Follow
   [Attach on Add-on Profile](../../../clusters/imported-clusters/attach-add-on-profile.md#attach-an-add-on-profile) to
   deploy the Windows application using the pack you created.
