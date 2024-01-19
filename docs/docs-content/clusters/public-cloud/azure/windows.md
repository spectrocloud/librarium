---
sidebar_label: "Running Windows Workloads"
title: "Running MS Windows Workloads on an Azure AKS Cluster"
description: "How to create and manage Windows Node Pools and run a Windows based application"
hide_table_of_contents: false
tags: ["public cloud", "azure"]
sidebar_position: 35
---


Palette supports the deployment of Microsoft Windows Applications on Azure AKS Clusters. Windows Applications require a Windows based Node Pool to run.  This section guides you on how to create an AKS Cluster with a Windows Node Pool and how to configure your Windows Application to be deployed to that Windows Node Pool


# Prerequisites

These prerequisites must be met before deploying a Windows Workload:

1. An AKS Cluster created as descibed in [Create and Manage Azure AKS CLuster](./aks.md) 

2. A Linux based Node Pool configured as the System Node Pool as described in [Create a System Node Pool](./aks#create-a-system-node-pool)

3. A second Windows based Node Pool Configured as described [Create a Windows Node Pool](#create-a-windows-node-pool)


## Create a Windows Node Pool 

 <Video title="azure-cluster-creation" src="/videos/clusters/public-cloud/azure/add-windows-node-pool.mp4"></Video>

The following steps need to be performed to to add Windows node pool to an existing AKS cluster:

1. If you have an existing AKS Cluster deployed go to **Clusters** and select the cluster.

2. Go to **Nodes** and click **New Node Pool**.

3. Provide a name in the **Node pool name** text box. When creating a node, it is good practice to include an identifying name that matches the node and OS in Azure. 


3. If auto-scaling is desired select **Enable Autoscaler**.

<br />

  :::info

  Do NOT select **System Node Pool**.  System Node Pools, must be Linux based and this option will remove the abilty to make the node pool Windows based 

  :::

  <br />

4. Enter **Number of nodes in the pool** or **Minimum size** and **Maximum Size** if you enabled Autoscaler.


5. Include **Additional Labels**. This is optional.

6. Enable **Taints**.  This is optional.


7. Select the **Instance type**. The cost details are present for review.

8. For **OS Type** select **Windows**.

9. Select the **Managed Disk** information and its size.

10. Select **Confirm**.

<br />

  :::info

  Palette **also** allows you to add a Windows Node Pool at the time of an AKS Cluster Creation. Follow [Create and Manage Azure AKS CLuster / Create and Remove Node Pools](./aks#create-and-remove-node-pools).  When creating additional node pools, select **OS Type** Windows to make the node pool Windows based.

  :::

<br />

## Create a Windows Node Pool 

The following steps need to be performed to to add Windows node pool to an existing AKS cluster:

1. If you have an existing AKS Cluster deployed go to **Clusters** and select the cluster.

2. Go to **Nodes** and click **New Node Pool**.

 

