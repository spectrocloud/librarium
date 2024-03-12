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

  To use a VNet that Palette creates, ensure there is sufficient capacity in the preferred Azure region to create the
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

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu**, select **Clusters** and click **Add New Cluster**.

4. In **Public Clouds**, under **Infrastructure Provider**, select **Azure AKS**.

5. In the bottom-right corner, click **Start Azure AKS Configuration**.

6. Fill out the following basic information and click **Next**.

   | **Field**         | **Description**                                                                                                                                                         |
   | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Cluster Name**  | A custom name for the cluster.                                                                                                                                          |
   | **Description**   | Use the description to provide context about the cluster.                                                                                                               |
   | **Tags**          | Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments. Example: `region:us-west`.         |
   | **Cloud Account** | If you already added your Azure account in Palette, select it from the **drop-down Menu**. Otherwise, click **Add New Account** and add your Azure account information. |

7. Select the Azure cluster profile you created and click **Next**. Palette displays the cluster profile layers.

---

Update worker pools in parallel Enable this option to efficiently manage various types of workloads by performing
simultaneous updates on multiple worker pools.

---

1. If you already have a profile to use, go to **Cluster** > **Add a New Cluster** > **Deploy New Cluster** and select
   an Azure cloud. If you do not have a profile to use, review the
   [Creating a Cluster Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md)
   page for guidance on profile types to create.

2. Fill the basic cluster profile information such as **Name**, **Description**, **Tags** and **Cloud Account**.

3. In the **Cloud Account** dropdown list, select the Azure Cloud account or create a new one. See the
   [Creating an Azure Cloud Account](azure-cloud.md) section above.

4. Next, in the **Cluster profile** tab from the **Managed Kubernetes** list, pick **AKS**, and select the AKS cluster
   profile definition.

5. Review the **Parameters** for the selected cluster profile definitions. By default, parameters for all packs are set
   with values defined in the cluster profile.

6. Complete the **Cluster config** section with the information for each parameter listed below.

   | **Parameter**        | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Subscription**     | Select the subscription which is to be used to access Azure Services.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | **Region**           | Select a region in Azure in where the cluster should be deployed.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
   | **Resource Group**   | Select the resource group in which the cluster should be deployed.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | **SSH Key**          | The public SSH key for connecting to the nodes. Review Microsoft's [supported SSH](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/mac-create-ssh-keys#supported-ssh-key-formats) formats.                                                                                                                                                                                                                                                                                               |
   | **Static Placement** | By default, Palette uses dynamic placement. This creates a new VNet for the cluster that contains two subnets in different Availability Zones (AZs). Palette places resources in these clusters, manages the resources, and deletes them when the corresponding cluster is deleted.<br /><br />If you want to place resources into a pre-existing VNet, enable the **Static Placement** option, and fill out the input values listed in the [Static Placement](#static-placement-settings) table below. |

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

   :::warning

   If you enable the **Disable Properties** setting when
   [registering an Azure cloud account](./azure-cloud.md#add-azure-cloud-account), Palette cannot create network
   resources on your behalf. In this case, every time you deploy a cluster, you must manually specify their virtual
   network subnets and security groups,

   :::

7. Click **Next** to configure the node pools.

   The [maximum number](https://learn.microsoft.com/en-us/azure/aks/configure-azure-cni#maximum-pods-per-node) of pods
   per node in an AKS cluster is 250. If you don't specify maxPods when creating new node pools, then the default value
   of 30 is applied. You can edit this value from the Kubernetes configuration file at any time by editing the
   `maxPodPerNode` value. Refer to the snippet below:

   ```
   managedMachinePool:
     maxPodPerNode: 30
   ```

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

## Create and Remove Node Pools

During cluster creation, you will default to a single pool.

1. To add additional pools, click **Add Node Pool**.

2. Provide any additional Kubernetes labels to assign to each node in the pool. This section is optional, and you can
   use a `key:value` structure, press your space bar to add additional labels, and click the **X** with your mouse to
   remove unwanted labels.

3. To remove a pool, click **Remove** across from the title for each pool.

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

## Configure Azure Active Directory

The Azure Active Directory (AAD) could be enabled while creating and linking the Azure Cloud account for the Palette
Platform, using a simple check box. Once the cloud account is created, you can create the Azure AKS cluster. The
AAD-enabled AKS cluster will have its Admin _kubeconfig_ file created and can be downloaded from our Palette UI as the
'Kubernetes config file'. You need to manually create the user's _kubeconfig_ file to enable AAD completely. The
following are the steps to create the custom user _kubeconfig_ file:

1. Go to the Azure console to create the Groups in Azure AD to access the Kubernetes RBAC and Azure AD control access to
   cluster resources.

2. After you create the groups, create users in the Azure AD.

3. Create custom Kubernetes roles and role bindings for the created users and apply the roles and role bindings, using
   the Admin _kubeconfig_ file.

   :::info

   The above step can also be completed using Spectro RBAC pack available under the Authentication section of Add-on
   Packs.

   :::

4. Once the roles and role bindings are created, these roles can be linked to the Groups created in Azure AD.

5. The users can now access the Azure clusters with the complete benefits of AAD. To get the user-specific _kubeconfig_
   file, please run the following command:

   ```bash
   az aks get-credentials --resource-group <resource-group> --name <cluster-name>
   ```

## Resources

- [Use Kubernetes RBAC with Azure AD integration](https://learn.microsoft.com/en-us/azure/aks/azure-ad-rbac?tabs=portal)

- [Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/)
