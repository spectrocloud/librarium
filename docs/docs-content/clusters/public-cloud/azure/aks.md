---
sidebar_label: "Create and Manage Azure AKS Cluster"
title: "Create and Manage Azure AKS Cluster"
description: "The methods of creating clusters for a speedy deployment on any CSP"
hide_table_of_contents: false
tags: ["public cloud", "azure"]
sidebar_position: 30
---

Palette supports creating and managing Kubernetes clusters deployed to an Azure subscription. This section guides you on
how to create an IaaS Kubernetes cluster in Azure that is managed by Palette.

Azure clusters can be created under the following scopes:

- Tenant admin

- Project Scope - This is the recommended scope.

Be aware that clusters that are created under the **Tenant Admin** scope are not visible under Project scope .

## Prerequisites

These prerequisites must be met before deploying an AKS workload cluster:

1. You need an active Azure cloud account with sufficient resource limits and permissions to provision compute, network,
   and security resources in the desired regions.

2. You will need to have permissions to deploy clusters using the AKS service on Azure.

3. Register your Azure cloud account in Palette as described in the [Creating an Azure Cloud Account](./azure-cloud.md)
   section below.

4. You should have a cluster profile created in Palette for AKS.

5. Associate an SSH key pair to the cluster worker node.

<br />

## Additional Prerequisites

There are additional prerequisites if you want to set up Azure Active Directory integration for the AKS cluster:

1. A Tenant Name must be provided as part of the Azure cloud account creation in Palette.

2. For the Azure client used in the Azure cloud account, these API permissions have to be provided:

   |                 |                                       |
   | --------------- | ------------------------------------- |
   | Microsoft Graph | Group.Read.All (Application Type)     |
   | Microsoft Graph | Directory.Read.All (Application Type) |

3. You can configure these permissions from the Azure cloud console under **App registrations** > **API permissions**
   for the specified application.

:::info

Palette **also** enables the provisioning of private AKS clusters via a private cloud gateway (Self Hosted PCGs). The
Self-Hosted PCG is an AKS cluster that needs to be launched manually and linked to an Azure cloud account in Palette
Management Console. [Click here for more..](gateways.md)

:::

<Video title="azure-cluster-creation" src="/videos/clusters/public-cloud/azure/aks.mp4"></Video>

To create an Azure cloud account you need the following Azure account information:

- Client ID
- Tenant ID
- Client Secret
- Tenant Name (optional)
- Toggle `Connect Private Cloud Gateway` option and select the [Self-Hosted PCG](gateways.md) already created from the
  drop-down menu to link it to the cloud account.

**Note:**

For existing cloud account go to `Edit` and toggle the `Connect Private Cloud Gateway` option to select the created
gateway from the drop down menu.

For Azure cloud account creation, we first need to create an Azure Active Directory (AAD) application that can be used
with role-based access control. Follow the steps below to create a new AAD application, assign roles, and create the
client secret:

<br />

1. Follow the steps described
   [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application)
   to create a new Azure Active Directory application. Note down your ClientID and TenantID.

2. On creating the application, assign a minimum required
   [ContributorRole](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor). To
   assign any type of role, the user must have a minimum role of
   [UserAccessAdministrator](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator).
   Follow the
   [Assign Role To Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application)
   link learn more about roles.

3. Follow the steps described in the
   [Create an Application Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret)
   section to create the client application secret. Store the Client Secret safely as it will not be available as plain
   text later.

## Deploy an AKS Cluster

<br />

<Video title="aks-cluster-creation" src="/videos/clusters/public-cloud/cloud-accounts/azure.mp4"></Video>

The following steps need to be performed to provision a new cluster:

<br />

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

<br />

The [maximum number](https://learn.microsoft.com/en-us/azure/aks/configure-azure-cni#maximum-pods-per-node) of pods per
node in an AKS cluster is 250. If you don't specify maxPods when creating new node pools, then the default value of 30
is applied. You can edit this value from the Kubernetes configuration file at any time by editing the `maxPodPerNode`
value. Refer to the snippet below:

<br />

```
managedMachinePool:
  maxPodPerNode: 30
```

## Node Pools

This section guides you to through configuring Node Pools. As you set up the cluster, the **Nodes config** section will
allow you to customize node pools. AKS Clusters are comprised of System and User node pools, and all pool types can be
configured to use the Autoscaler, which scales out pools horizontally based on per node workload counts.

A complete AKS cluster contains the following:

<br />

1. As a mandatory primary **System Node Pool**, this pool will run the pods necessary to run a Kubernetes cluster, like
   the control plane and etcd. All system pools must have at least a single node for a development cluster; one (1) node
   is enough for high availability production clusters, and three (3) or more is recommended.

2. **Worker Node** pools consist of one (1) or more per workload requirements. Worker node pools can be sized to zero
   (0) nodes when not in use.

<br />

## Create and Remove Node Pools

During cluster creation, you will default to a single pool.

<br />

1. To add additional pools, click **Add Node Pool**.

2. Provide any additional Kubernetes labels to assign to each node in the pool. This section is optional, and you can
   use a `key:value` structure, press your space bar to add additional labels, and click the **X** with your mouse to
   remove unwanted labels.

3. To remove a pool, click **Remove** across from the title for each pool.

<br />

## Create a System Node Pool

1. Each cluster requires at least one (1) system node pool. To define a pool as a system pool, check the box labeled
   **System Node Pool**.
   <br />

:::info

Identifying a Node Pool as a System Pool will deactivate taints, and the operating system options within the cluster.
You can not to taint or change the node OS from Linux. Refer to the
[Azure AKS Documentation](https://docs.microsoft.com/en-us/azure/aks/use-system-pools?tabs=azure-cli#system-and-user-node-pools")
for more details on pool limitations.

:::

<br />

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

<br />

1.  Provide a name in the **Node pool name** text box. When creating a node, it is good practice to include an
    identifying name.

**Note:** Windows clusters have a name limitation of six (6) characters.

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

- Provide instance details for all nodes in the pool with the **Instance type** dropdown. The cost details are present
  for review.

<br />

:::info

New worker pools may be added if you want to customize specific worker nodes to run specialized workloads. As an
example, the default worker pool may be configured with the <i>Standard_D2_v2</i> instance types for general-purpose
workloads, and another worker pool with the instance type <i>Standard_NC12s_v3</i> can be configured to run GPU
workloads.

:::

<br />

- Provide the disk type via the **Managed Disk** dropdown and the size in Gigabytes (GB) in the **Disk size** field.

:::info

A minimum allocation of <i>two (2)</i> CPU cores is required across all worker nodes.

A minimum allocation of <i>4Gi</i> of memory is required across all worker nodes.

:::

<br />

- When are done setting up all node pools, click **Next** to go to the **Settings** page to **Validate** and finish the
  cluster deployment wizard.

**Note**: Keep an eye on the **Cluster Status** once you click **Finish Configuration** as it will start as
_Provisioning_. Deploying an AKS cluster does take a considerable amount of time to complete, and the **Cluster Status**
in Palette will say _Ready_ when it is complete and ready to use.

<br />

## Configure an Azure Active Directory

The Azure Active Directory (AAD) could be enabled while creating and linking the Azure Cloud account for the Palette
Platform, using a simple check box. Once the cloud account is created, you can create the Azure AKS cluster. The
AAD-enabled AKS cluster will have its Admin _kubeconfig_ file created and can be downloaded from our Palette UI as the
'Kubernetes config file'. You need to manually create the user's _kubeconfig_ file to enable AAD completely. The
following are the steps to create the custom user _kubeconfig_ file:

<br />

1. Go to the Azure console to create the Groups in Azure AD to access the Kubernetes RBAC and Azure AD control access to
   cluster resources.

2. After you create the groups, create users in the Azure AD.

3. Create custom Kubernetes roles and role bindings for the created users and apply the roles and role bindings, using
   the Admin _kubeconfig_ file.

<br />

:::info

The above step can also be completed using Spectro RBAC pack available under the Authentication section of Add-on Packs.

:::

<br />

4. Once the roles and role bindings are created, these roles can be linked to the Groups created in Azure AD.

5. The users can now access the Azure clusters with the complete benefits of AAD. To get the user-specific _kubeconfig_
   file, please run the following command:

`az aks get-credentials --resource-group <resource-group> --name <cluster-name>`

<br />

## Resources

- [Use Kubernetes RBAC with Azure AD integration](https://learn.microsoft.com/en-us/azure/aks/azure-ad-rbac?tabs=portal)

- [Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/)
