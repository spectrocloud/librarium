---
sidebar_label: "Create and Manage Azure AKS Cluster"
title: "Create and Manage Azure AKS Cluster"
description: "Learn how to deploy Azure Kubernetes Service clusters in Palette."
hide_table_of_contents: false
tags: ["public cloud", "azure", "aks"]
sidebar_position: 30
---

Palette supports creating and managing Azure Kubernetes Service (AKS) clusters deployed to an Azure account. This guide
explains how you can create an Azure AKS cluster managed by Palette.

## Prerequisites

- An active Azure cloud account.

- Palette integration with an Azure cloud account. Review [Register and Manage Azure Cloud Account](./azure-cloud.md)
  for guidance.

- A Secure Shell (SSH) key pre-configured in your Azure environment. Refer to the
  [SSH Keys](../../cluster-management/ssh-keys.md) guide for more information about creating and managing SSH keys in
  Palette.

- An infrastructure cluster profile for Azure. Review
  [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)
  for guidance.

- To use custom storage accounts or containers, you must create them before you create your cluster. For information
  about use cases for custom storage, review [Azure Storage](./architecture.md#azure-storage).

  :::tip

  If you need help creating a custom storage account or container, check out the
  [Create a Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal)
  and the [Manage Blob Containers](https://learn.microsoft.com/en-us/azure/storage/blobs/blob-containers-portal) guides.

  :::

- To enable OIDC with Microsoft Entra ID, you need to configure Entra ID with Palette. Review the
  [Enable SSO with Microsoft Entra ID](../../../user-management/saml-sso/palette-sso-with-entra-id.md) guide for more
  information.

- Optionally, a Virtual Network (VNet). If you do not provide a VNet, Palette creates one for you with compute, network,
  and storage resources in Azure when it provisions Kubernetes clusters.

  To use a VNet that Palette creates, ensure there is sufficient capacity in your preferred Azure region to create the
  following resources:

  - Virtual CPU (vCPU)
  - VNet
  - Static Public IP addresses
  - Virtual Network Interfaces
  - Load Balancers
  - Virtual Hard Disk (VHD)
  - Managed Disks
  - Virtual Network Address Translation (NAT) Gateway

## Deploy an Azure AKS Cluster

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Ensure you are in the correct project scope.

3.  From the left **Main Menu**, select **Clusters** and click **Add New Cluster**.

4.  In **Public Clouds**, under **Infrastructure Provider**, select **Azure AKS**.

5.  In the bottom-right corner, click **Start Azure AKS Configuration**.

6.  Fill out the following basic information and click **Next**.

    | **Field**         | **Description**                                                                                                                                                         |
    | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Cluster Name**  | A custom name for the cluster.                                                                                                                                          |
    | **Description**   | Use the description to provide context about the cluster.                                                                                                               |
    | **Tags**          | Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments. Example: `region:us-west`.         |
    | **Cloud Account** | If you already added your Azure account in Palette, select it from the **drop-down Menu**. Otherwise, click **Add New Account** and add your Azure account information. |

7.  Select the Azure cluster profile you created and click **Next**. Palette displays the cluster profile layers.

8.  Review the profile layers and customize parameters as desired in the YAML files that display when you select a
    layer.

    You can configure custom OpenID Connect (OIDC) for Azure clusters at the Kubernetes layer. Check out
    [Configure OIDC Identity Provider](../../../integrations/kubernetes.md#configure-oidc-identity-provider) for more
    information.

    :::warning

    All OIDC options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a
    Kubernetes role to users and groups, refer to
    [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings).

    :::

9.  Click **Next** to continue.

10. Configure your Azure AKS cluster using the following table for reference.

    :::warning

    If you enable the **Disable Properties** setting when
    [registering an Azure cloud account](./azure-cloud.md#add-azure-cloud-account), Palette cannot create network
    resources on your behalf. In this case, every time you deploy a cluster, you must manually specify its virtual
    network subnets and security groups,

    :::

    | **Parameter**                       | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Subscription**                    | Use the **drop-down Menu** to select the subscription that will be used to access Azure services.                                                                                                                                                                                                                                                                                                                                                                                           |
    | **Region**                          | Use the **drop-down Menu** to choose the Azure region where you would like to provision the cluster.                                                                                                                                                                                                                                                                                                                                                                                        |
    | **Resource Group**                  | Select the name of the resource group that contains the Azure resources you will be accessing.                                                                                                                                                                                                                                                                                                                                                                                              |
    | **Storage Account**                 | Optionally, if you have a custom storage account available, you can use the **drop-down Menu** to select the storage account name. For information about use cases for custom storage, review [Azure Storage](../azure/architecture.md#azure-storage).                                                                                                                                                                                                                                      |
    | **Storage Container**               | Optionally, if you will be using a custom storage container, use the **drop-down Menu** to select it. For information about use cases for custom storage, review [Azure Storage](../azure/architecture.md#azure-storage).                                                                                                                                                                                                                                                                   |
    | **SSH Key**                         | The public SSH key for connecting to the nodes. SSH key pairs must be pre-configured in your Azure environment. The key you select is inserted into the provisioned VMs. For more information, review Microsoft's [Supported SSH key formats](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/mac-create-ssh-keys#supported-ssh-key-formats).                                                                                                                                |
    | **Enable Private Cluster**          | Whether the control plane or API server should have internal IP addresses. Refer to the [Create a private AKS cluster](https://learn.microsoft.com/en-us/azure/aks/private-clusters?tabs=azure-portal) guide for more information.                                                                                                                                                                                                                                                          |
    | **Static Placement**                | By default, Palette uses dynamic placement. This creates a new VNet for clusters with two subnets in different Availability Zones (AZs). Palette places resources in these clusters, manages the resources, and deletes them when the corresponding cluster is deleted.<br /><br />If you want to place resources into a pre-existing VNet, enable the **Static Placement** option, and fill out the input values listed in the [Static Placement](#static-placement-settings) table below. |
    | **Update worker pools in parallel** | If enabled, allows you to efficiently manage various types of workloads by performing simultaneous updates on multiple worker pools.                                                                                                                                                                                                                                                                                                                                                        |

    #### Static Placement Settings

    Each subnet allows you to specify the CIDR range and a security group.

    | **Parameter**              | **Description**                                             |
    | -------------------------- | ----------------------------------------------------------- |
    | **Network Resource Group** | The logical container for grouping related Azure resources. |
    | **Virtual Network**        | Select the VNet.                                            |
    | **CIDR Block**             | Select the IP address CIDR range.                           |
    | **Security Group Name**    | Select the security group name.                             |
    | **Control Plane Subnet**   | Select the control plane subnet.                            |
    | **Worker Subnet**          | Select the worker network.                                  |

11. Click **Next** to continue.

12. Provide the following node pool and cloud configuration information. To learn more about node pools, review the
    [Node Pool](../../cluster-management/node-pool.md) guide.

    #### System Node Pool

    To deploy an AKS cluster, you need to have at least one system node pool, which will run the pods necessary to run a
    Kubernetes cluster, like the control plane and etcd. To add a system node pool, add a worker node pool and select
    the **System Node Pool** checkbox.

    :::info

    A system pool must have at least one node for development purposes. We recommend having at least three nodes for
    high availability in production environments. You can configure a static node count with the **Number of nodes in
    the pool** parameter or a dynamic node count with the **Enable Autoscaler** parameter.

    :::

    The following table describes how to configure a system node pool.

    | **Parameter**                   | **Description**                                                                                                                                                                                                                                                                                                          |
    | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Node pool name**              | A descriptive name for the node pool.                                                                                                                                                                                                                                                                                    |
    | **Enable Autoscaler**           | Whether Palette should scale the pool horizontally based on its per-node workload counts. If enabled, instead of the **Number of nodes in the pool** parameter, you will have to configure the **Minimum size** and **Maximum size** parameters which will allow AKS to adjust the node pool size based on the workload. |
    | **System Node Pool**            | Sets the pool to be a system node pool.                                                                                                                                                                                                                                                                                  |
    | **Number of nodes in the pool** | A statically defined number of nodes in the system pool.                                                                                                                                                                                                                                                                 |
    | **Additional Labels**           | Optional node labels in the key-value format. To learn more, review [Apply Labels to Nodes](../../cluster-management/taints.md#labels). Example: `environment:production`.                                                                                                                                               |

    #### System Node Pool Cloud Configuration

    | **Parameter**     | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Instance Type** | Select the instance type to use for all nodes in the system node pool.                                                                                                                                                                                                                                                                                                                                                              |
    | **Managed disk**  | Choose a storage option. For more information, refer to Microsoft's [Storage Account Overview](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview) reference. For information about Solid State Drive (SSD) disks, refer to [Standard SSD Disks for Azure Virtual Machine Workloads](https://azure.microsoft.com/en-us/blog/preview-standard-ssd-disks-for-azure-virtual-machine-workloads/) reference |
    | **Disk size**     | You can choose disk size based on your requirements. The default size is **60**.                                                                                                                                                                                                                                                                                                                                                    |

    #### Worker Node Pool

    The following table describes how to configure a worker node pool.

    | **Parameter**                   | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Node pool name**              | A descriptive name for the node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
    | **Enable Autoscaler**           | Whether Palette should scale the pool horizontally based on its per-node workload counts. If enabled, instead of the **Number of nodes in the pool** parameter, you will have to configure the **Minimum size** and **Maximum size** parameters which will allow AKS to adjust the node pool size based on the workload.                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | **System Node Pool**            | Sets the pool to be a system node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | **Number of nodes in the pool** | A statically defined number of nodes in the system pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | **Additional Labels**           | Optional node labels in the key-value format. To learn more, review [Apply Labels to Nodes](../../cluster-management/taints.md#labels). Example: `environment:production`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | **Taints**                      | You can apply optional taint labels to a worder node pool. Review the [Node Pool](../../cluster-management/node-pool.md) and [Apply Taints to Nodes](../../cluster-management/taints.md#apply-taints-to-nodes) guides to learn more.<br/><br/>Toggle the **Taint** button to create a taint label. When tainting is enabled, you need to provide a custom key-value pair. Use the **drop-down Menu** to choose one of the following **Effect** options:<br />- **NoSchedule**—Pods are not scheduled onto nodes with this taint.<br />- **PreferNoSchedule**—Kubernetes attempts to avoid scheduling pods onto nodes with this taint, but scheduling is not prohibited.<br />- **NoExecute**—Existing pods on nodes with this taint are evicted. |

    #### Worker Node Pool Cloud Configuration

---

## Node Pools

This section guides you to through configuring Node Pools. As you set up the cluster, the **Nodes config** section will
allow you to customize node pools. AKS Clusters are comprised of System and User node pools, and all pool types can be
configured to use the Autoscaler, which scales out pools horizontally based on per node workload counts.

A complete AKS cluster contains the following:

1. As a mandatory primary **System Node Pool**, this pool will run the pods necessary to run a Kubernetes cluster, like
   the control plane and etcd. All system pools must have at least a single node for a development cluster; one (1) node
   is enough for high availability production clusters, and three (3) or more is recommended.

2. **Worker Node** pools consist of one (1) or more per workload requirements. Worker node pools can be sized to zero
   (0) nodes when not in use.

## Create a System Node Pool

1. Each cluster requires at least one (1) system node pool. To define a pool as a system pool, check the box labeled
   **System Node Pool**.

   :::info

   Identifying a Node Pool as a System Pool will deactivate taints, and the operating system options within the cluster.
   You can not to taint or change the node OS from Linux. Refer to the
   [Azure AKS Documentation](https://docs.microsoft.com/en-us/azure/aks/use-system-pools?tabs=azure-cli#system-and-user-node-pools")
   for more details on pool limitations.

   :::

2. Provide a name in the **Node pool name** text box. When creating a node, it is good practice to include an
   identifying name that matches the node in Azure.

3. Add the **Desired size**. You can start with three for multiple nodes.

4. Include **Additional Labels**. This is optional.

5. In the **Azure Cloud Configuration** section, add the **Instance type**. The cost details are present for review.

6. Enter the **Managed Disk** information and its size.

7. If you are including additional or multiple nodes to make a node pool, click the **Add Worker Pool** button to create
   the next node.

## Configure Node Pools

In all types of node pools, configure the following.

1.  Provide a name in the **Node pool name** text box. When creating a node, it is good practice to include an
    identifying name.

    :::info

    Windows cluster names are limited to six characters.

    :::

2.  Provide how many nodes the pool will contain by adding the count to the box labeled **Number of nodes in the pool**.
    Configure each pool to use the autoscaler controller. There are more details on how to configure that below.

3.  Alternative to a static node pool count, you can enable the autoscaler controller, click **Enable Autoscaler** to
    change to the **Minimum size** and **Maximum size** fields which will allow AKS to increase or decrease the size of
    the node pool based on workloads. The smallest size of a dynamic pool is zero (0), and the maximum is one thousand
    (1000); setting both to the same value is identical to using a static pool size.

4.  Provide any additional Kubernetes labels to assign to each node in the pool. This section is optional; you can use a
    `key:value` structure. Press your space bar to add additional labels and click the **X** with your mouse to remove
    unwanted labels.

5.  In the **Azure Cloud Configuration** section:

    - Provide instance details for all nodes in the pool with the **Instance type** dropdown. The cost details are
      present for review.

      :::info

      New worker pools may be added if you want to customize specific worker nodes to run specialized workloads. As an
      example, the default worker pool may be configured with the _Standard_D2_v2_ instance types for general-purpose
      workloads, and another worker pool with the instance type _Standard_NC12s_v3_ can be configured to run GPU
      workloads.

      :::

    - Provide the disk type via the **Managed Disk** dropdown and the size in Gigabytes (GB) in the **Disk size** field.

      :::info

      A minimum allocation of _two (2)_ CPU cores is required across all worker nodes.

      A minimum allocation of _4Gi_ of memory is required across all worker nodes.

      :::

- When you are done setting up all node pools, click **Next** to go to the **Settings** page to **Validate** and finish
  the cluster deployment wizard.

  :::info

  Keep an eye on the **Cluster Status** once you click **Finish Configuration** as it will start as _Provisioning_.
  Deploying an AKS cluster does take a considerable amount of time to complete, and the **Cluster Status** in Palette
  will say _Ready_ when it is complete and ready to use.

  :::

## Validate

## Resources

- [Use Kubernetes RBAC with Azure AD integration](https://learn.microsoft.com/en-us/azure/aks/azure-ad-rbac?tabs=portal)

- [Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/)
