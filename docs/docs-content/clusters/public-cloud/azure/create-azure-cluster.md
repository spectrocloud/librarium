---
sidebar_label: "Create and Manage Azure IaaS Cluster"
title: "Create and Manage Azure IaaS Cluster"
description: "Learn how to deploy and manage Azure clusters with Palette."
hide_table_of_contents: false
tags: ["public cloud", "azure"]
toc_max_heading_level: 5
sidebar_position: 20
---

Palette supports creating and managing Kubernetes clusters deployed to an Azure account. This section guides you on how
to create an IaaS Kubernetes cluster in Azure that Palette manages.

## Limitations

- If the `fullyPrivateAddressing` parameter is set to `true`, the control plane and worker nodes in your cluster must
  still have outbound access to the internet, including the [Microsoft Container Registry](https://mcr.microsoft.com/),
  to download updates, patches, and the necessary container images.

- Once the `fullyPrivateAddressing` parameter is set for your cluster, you cannot change its value. Changing the
  parameter value will result in errors until you return the value to its original configuration.

### Azure Government Secret Limitations

:::preview

:::

- You must use Palette VerteX to deploy clusters in Azure Government Secret cloud. Multi-tenant Palette SaaS and
  self-hosted Palette instances do not support Azure Government Secret cloud.

- Clusters deployed in [Azure Government Secret](./azure-cloud.md#azure-government-secret-cloud) cloud must use
  [static placement](#static-placement-settings) and a
  [private API server load balancer](#private-api-server-lb-settings) with a static IP.

- <PartialsComponent category="azure" name="azure-secret-os-layer" />

## Prerequisites

- An active [Azure cloud account](https://portal.azure.com/) with sufficient resource limits and permissions to
  provision compute, network, and security resources in the desired clouds and regions. Refer to our Azure
  [Required Permissions](./required-permissions.md) guide for more information. If deploying a cluster to
  [Azure Government Secret](./azure-cloud.md#azure-government-secret-cloud) cloud, you must have the required
  permissions for [static placement](./required-permissions.md#iaas-static-placement).

- Palette integration with Azure account. Review the [Register and Manage Azure Cloud Account](./azure-cloud.md) guide
  for more information.

- A Secure Shell (SSH) key pre-configured in your Azure environment. Refer to the
  [SSH Keys](../../cluster-management/ssh/ssh-keys.md) guide for more information about creating and managing SSH keys
  in Palette.

- An
  [infrastructure cluster profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)
  or [full cluster profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md) for
  Azure.

- To use custom storage accounts or containers, you must create them before you create your cluster. All custom storage
  accounts and containers will be listed on the **Cluster config** page during the cluster creation process. For
  information about use cases for custom storage, review our [Azure Storage](./architecture.md#azure-storage)
  documentation.

  If you need help creating a custom storage account or container, check out the Azure
  [Create a Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal)
  or [Manage Blob Containers](https://learn.microsoft.com/en-us/azure/storage/blobs/blob-containers-portal) guide.

<!-- prettier-ignore-start -->

- If you do not provide your own Virtual Network (VNet), Palette creates one for you with compute, network, and storage
  resources in Azure when it provisions Kubernetes clusters. To use a VNet that Palette creates, ensure there is
  sufficient capacity in the preferred Azure region to create the following resources:

  - Virtual CPUs (vCPUs)
  - VNets
  - Static public IP addresses
  - Virtual network interfaces
  - Load balancers
  - Virtual Hard Disks (VHDs)
  - Managed disks
  - Virtual Network Address Translation (NAT) gateways
  <br />

  :::warning

  For static network deployments, you must have port 6443 open between Palette and the workload cluster. Refer to the
  [Network Ports](../../../architecture/networking-ports.md) documentation for detailed network architecture diagrams
  and to learn more about the ports used for communication.

  :::

<!-- prettier-ignore-end -->

- To enable the `fullyPrivateAddressing` parameter and use a private API server load balancer, you need a self-hosted
  Private Cloud Gateway (PCG) deployed in Azure. Ensure the Azure cloud account selected is connected to a PCG. For more
  information on deploying PCGs, refer to [Private Cloud Gateway](../../pcg/pcg.md). To learn how to connect a PCG to an
  Azure cloud account, refer to the [Register and Manage Azure Cloud Account](./azure-cloud.md) guide.

- A private DNS zone is required to use the private API server load balancer. You also need to ensure the virtual
  networks used for the cluster support
  [private DNS resolution](https://learn.microsoft.com/en-us/azure/dns/dns-private-resolver-overview). To learn more
  about private DNS zones, refer to the Azure
  [Private DNS Zones](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns) guide.

<!-- prettier-ignore-start -->

- If you want to enable Azure Disk Encryption on your cluster, ensure you have created a Key Vault and Disk Encryption Set. Your cluster profile must also be configured to use the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> pack and have the **Use Azure Disk Encryption** preset enabled. Review our [Azure Disk Encryption](./azure-disk-encryption.md) guide for more information.

<!-- prettier-ignore-end -->

## Deploy an Azure Cluster

Take the following steps to deploy an Azure cluster.

1. Log in to [Palette](https://console.spectrocloud.com) or Palette VerteX.

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Clusters > Create Cluster**.

4. In **Public Clouds**, under **Infrastructure Provider**, select **Azure IaaS**.

5. In the bottom-right corner, select **Start Azure IaaS Configuration**.

6. Complete the following information. Select **Next** when finished.

   | **Field**         | **Description**                                                                                                                                                                                                                                                                     |
   | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Cluster Name**  | Enter a custom name for the cluster.                                                                                                                                                                                                                                                |
   | **Description**   | (Optional) Provide context about the cluster.                                                                                                                                                                                                                                       |
   | **Tags**          | (Optional) Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments. Example: `region:us-west`.                                                                                                          |
   | **Cloud Account** | Select the appropriate Azure account under which to deploy the cluster. If the account is not there, select **Add New Account**, and provide your Azure account information. For more information, refer to our [Register and Manage Azure Cloud Accounts](./azure-cloud.md) guide. |

7. Choose the appropriate Azure IaaS [cluster profile](../../../profiles/cluster-profiles/cluster-profiles.md) and
   select **Next**. Palette displays the cluster profile layers.

8. Review the profile layers. Make changes to a layer's YAML configuration file as needed. When finished, select
   **Next**.

   For ease of reuse and to persist changes across clusters using the same cluster profile, we recommend
   [updating](../../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) and
   [versioning your cluster profile](../../../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md)
   rather than making inline changes.

   :::warning

   <PartialsComponent category="azure" name="azure-secret-os-layer" />

   :::

<!-- prettier-ignore-start -->

9. To ensure that clusters with a [static placement](#static-placement-settings) remain fully private, with no public
   IPs created for the control plane and worker nodes, add the following configuration to the Kubernetes layer of your
   [cluster profile](../../../profiles/cluster-profiles/cluster-profiles.md).

   <details>

   <summary> Static Placement Kubernetes Configuration </summary>

   Add the following configuration to the Kubernetes layer of your
   [cluster profile](../../../profiles/cluster-profiles/cluster-profiles.md).

   ```yaml
   cloud:
     azure:
       fullyPrivateAddressing: true
   ```

   If you set the `fullyPrivateAddressing` property to `false` or leave it blank, Palette will create outbound load
   balancers for the control plane and worker nodes and assign public IPs to them.

   Consider the following limitations:

   - If the `fullyPrivateAddressing` parameter is set to `true`, the control plane and worker nodes in your cluster must
     still have outbound access to the internet, including the
     [Microsoft Container Registry](https://mcr.microsoft.com/), to download updates, patches, and the necessary
     container images.

   - Once the `fullyPrivateAddressing` parameter is set for your cluster, you cannot change its value. Changing the
     parameter value will result in errors until you return the value to its original configuration.

   <br />

   Toggle the **Private API Server LB** option to enable the use of a private API server load balancer and specify the
   [private DNS zone](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns) you want to use.
   Only **Static** IP allocation is allowed, which requires a valid IP address.

   </details>

10.  To configure custom OpenID Connect (OIDC) for Azure clusters, refer to the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> pack additional details for further guidance.

        :::warning

        All the OIDC options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a
        Kubernetes role to users and groups, refer to
        [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings).

        :::

<!-- prettier-ignore-end -->

11. Provide the cluster configuration information listed in the following table. If you are utilizing your own VNet,
    ensure you also provide information listed in the [Static Placement Settings](#static-placement-settings) table. If
    you have custom storage accounts or containers available, you can attach them to the cluster. To learn more about
    attaching custom storage to a cluster, refer to our [Azure Storage](../azure/architecture.md#azure-storage) section.

    :::warning

    If you enabled the **Disable Properties** setting when [registering an Azure cloud account](./azure-cloud.md),
    Palette cannot create network resources on your behalf. In this case, when creating clusters, you must manually
    specify their virtual network subnets and security groups.

    :::

    | **Parameter**                    | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Subscription**                 | Choose the subscription that will be used to access Azure services.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
    | **Region**                       | Choose the Azure region to provision the cluster.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | **Resource Group**               | Select the name of the resource group that contains the Azure resources you will be accessing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
    | **Storage account (Optional)**   | (Optional) Use a storage account, if desired. For information about custom storage use cases, refer to our [Azure Storage](../azure/architecture.md#azure-storage) documentation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | **Storage container (Optional)** | (Optional) Use a custom storage container, if desired. For information about custom storage use cases, refer to our [Azure Storage](../azure/architecture.md#azure-storage) documentation.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | **SSH Key**                      | Select the public SSH key to use when connecting to the nodes. The SSH key pairs displayed are pulled from the Azure cloud account being used to deploy the cluster. The key you select is inserted into the provisioned VMs. For more information, review Microsoft's [Supported SSH key formats](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/mac-create-ssh-keys#supported-ssh-key-formats).                                                                                                                                                                                                                                   |
    | **Static Placement**             | (Optional) By default, Palette uses dynamic placement. Select this option to place resources into a pre-existing VNet, and complete the fields listed in the [Static Placement](#static-placement-settings) table. **Static Placement** must be enabled for clusters where you want to use network proxy configurations and for clusters deployed in [Azure Government Secret](../../../clusters/public-cloud/azure/azure-cloud.md) cloud. To learn more about proxy configurations, check out [Proxy Configuration](./architecture.md#proxy-configuration).                                                                                        |
    | **Private API Server LB**        | (Optional) Select this option to configure a private API server load balancer and enable private connectivity to your Kubernetes cluster, and complete the fields listed in the [Private API Server LB Settings](#private-api-server-lb-settings) table. The option **Private API Server LB** exposes the Kubernetes control plane endpoint on an internal Azure load balancer. <br /> <br /> This option is available only when deploying clusters through a [self-hosted PCG](../../pcg/deploy-pcg-k8s.md). This option must be enabled if deploying clusters to [Azure Government Secret](./azure-cloud.md#azure-government-secret-cloud) cloud. |

    ### Static Placement Settings

    Each subnet allows you to specify the CIDR range and a security group.

    | **Parameter**              | **Description**                                                        |
    | -------------------------- | ---------------------------------------------------------------------- |
    | **Network Resource Group** | Select the the logical container for grouping related Azure resources. |
    | **Virtual Network**        | Select the VNet.                                                       |
    | **CIDR Block**             | Select the IP address CIDR range.                                      |
    | **Control Plane Subnet**   | Select the control plane subnet.                                       |
    | **Worker Subnet**          | Select the worker network.                                             |

    ### Private API Server LB Settings

    The option to enable a private API server load balancer is available only when deploying clusters through a
    [self-hosted PCG](../../pcg/deploy-pcg-k8s.md).

    :::warning

    **Private API Server LB** must be enabled if deploying clusters to
    [Azure Government Secret](./azure-cloud.md#azure-government-secret-cloud) cloud.

    :::

    | **Parameter**                           | **Description**                                                                                                                                                                                                                                                                                                                                  |
    | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Resource Group for Private DNS Zone** | Select the Azure resource group that contains the private DNS zone you want to use for the private API server load balancer. The DNS zone resource group can be different from the cluster resource group. If left blank, Palette uses the cluster's **Resource Group**.                                                                         |
    | **Private DNS zone (Optional)**         | (Optional) Select an existing private DNS zone that will hold the A record of the private endpoint. The options displayed in the drop-down depend on your **Resource Group for Private DNS Zone** selection. If left blank, Palette creates a new private DNS zone in the selected **Resource Group for Private DNS Zone**.                      |
    | **IP Allocation Method**                | Choose how the load balancer virtual IP is assigned: <br /> <br /> - **Static** (default) - Choose a specific IP address for the load balancer that you supply in the **Static IP** field. <br /> - **Dynamic** (disabled) - Azure picks the next free address in the subnet. _This option is no longer supported. You must assign a static IP._ |
    | **Static IP**                           | The private, static IP address to use for the load balancer. The address must be unused and inside the subnet delegated for the private API server load balancer.                                                                                                                                                                                |

12. Select **Next** to continue.

13. Provide the following node pool and cloud configuration information. To learn more about node pools, review the
    [Node Pool](../../cluster-management/node-pool.md) guide.

    :::info

    Palette configures one control plane pool and one worker node pool by default. You can add new worker pools to
    customize certain worker nodes for specialized workloads. For example, the default worker pool can be configured
    with the Standard_D2_v2 instance types for general-purpose workloads, and another worker pool with instance type
    Standard_NC12s_v3 can be configured for Graphics Processing Unit (GPU) workloads.

    :::

    #### Control Plane Pool Configuration Settings

    | **Parameter**                          | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
    | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Node pool name**                     | Enter a descriptive name for the control plane node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | **Number of nodes in the pool**        | Specify the number of nodes in the control plane pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | **Allow worker capability (Optional)** | (Optional) Allow workloads to be provisioned on control plane nodes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | **Additional Labels (Optional)**       | (Optional) Add optional [node labels](../../cluster-management/node-labels.md) to nodes using key-value format. Example: `environment:production`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | **Taints (Optional)**                  | (Optional) Apply optional taint labels to a node pool during cluster creation or edit taint labels on an existing cluster. Select **Add New Taint** to create a taint label, and complete the following fields: <br /> <br /> - **Key** - Enter the key in the taint key-value pair. <br /> - **Value** - Enter the value in the taint key-value pair. <br /> - **Effect** - Choose from among the following **Effect** options: **NoSchedule**, **PreferNoSchedule**, and **NoExecute**. <br /> <br /> - **NoSchedule** - Pods are not scheduled onto nodes with this taint. <br /> - **PreferNoSchedule** - Kubernetes attempts to avoid scheduling pods onto nodes with this taint, but scheduling is not prohibited. <br /> - **NoExecute** - Existing pods are evicted from nodes with this taint. <br /> <br /> Review our [Node Pool](../../cluster-management/node-pool.md) and [Taints and Tolerations](../../cluster-management/taints.md) guides to learn more. |

    ##### Cloud Configuration Settings

    | **Parameter**     | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Instance Type** | Select the instance type to use for all nodes in the node pool.                                                                                                                                                                                                                                                                                                                                                                                                               |
    | **Managed disk**  | Choose a storage option. Available options are **Standard SSD LRS**, **Standard LRS**, **Premium LRS**, and **Standard SSD ZRS**. Refer to Microsoft's [Storage Account Overview](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview) and [Standard SSD Disks for Azure Virtual Machine Workloads](https://azure.microsoft.com/en-us/blog/preview-standard-ssd-disks-for-azure-virtual-machine-workloads/) reference pages for more information. |
    | **Disk size**     | Enter the size of the disk based on your requirements. The default size is 60 GB.                                                                                                                                                                                                                                                                                                                                                                                             |

    #### Worker Pool Configuration Settings

    :::tip

    Select **Remove** on the right side of the page to remove the worker node pool if you only want a control plane
    pool.

    :::

    | **Parameter**                       | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
    | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Node pool name**                  | Enter a descriptive name for the worker node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | **Enable Autoscaler**               | Scale the worker pool horizontally based on its per-node workload counts. Enabling this option displays the fields **Minimum size** and **Maximum size**. <br /> <br /> - **Minimum size** - Specify the lower bound of nodes in the pool. <br /> - **Maximum size** - Specify the upper bound of nodes in the pool. <br /><br /> Setting the **Minimum size** and **Maximum size** to the same value results in a static node count. Refer to the Cluster API [autoscaler documentation](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/clusterapi/README.md) for more information on autoscaling.                                                                                                                                                                                                                                                                                                                                 |
    | **Node repave interval (Optional)** | (Optional) Specify the preferred time interval for Palette to perform a rolling upgrade on nodes when it detects a change in the kubeadm configuration file.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | **Number of nodes in the pool**     | Specify the number of nodes in the worker pool. This field is hidden if **Enable Autoscaler** is toggled on.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | **Rolling update**                  | Control the sequence of operations during a node pool update. <br /><br /> - **Expand First** (default) - Add new nodes with updated configurations to the node pool before the existing nodes are removed. <br /> - **Contract First** - Remove existing nodes from the node pool before the new nodes with updated configurations are added.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | **Additional Labels (Optional)**    | (Optional) Add optional [node labels](../../cluster-management/node-labels.md) to nodes using key-value format. Example: `environment:production`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | **Taints (Optional)**               | (Optional) Apply optional taint labels to a node pool during cluster creation or edit taint labels on an existing cluster. Select **Add New Taint** to create a taint label, and complete the following fields: <br /> <br /> - **Key** - Enter the key in the taint key-value pair. <br /> - **Value** - Enter the value in the taint key-value pair. <br /> - **Effect** - Choose from among the following **Effect** options: **NoSchedule**, **PreferNoSchedule**, and **NoExecute**. <br /> <br /> - **NoSchedule** - Pods are not scheduled onto nodes with this taint. <br /> - **PreferNoSchedule** - Kubernetes attempts to avoid scheduling pods onto nodes with this taint, but scheduling is not prohibited. <br /> - **NoExecute** - Existing pods are evicted from nodes with this taint. <br /> <br /> Review our [Node Pool](../../cluster-management/node-pool.md) and [Taints and Tolerations](../../cluster-management/taints.md) guides to learn more. |

    ##### Cloud Configuration Settings

    :::tip

    Select **Copy from Control Plane Pool** on the right side of the screen to copy the
    [control plane's cloud configuration settings](#cloud-configuration-settings) to your worker node pool. Note that
    the **Instance Type** may not be copied if it does not have accessible availability zones. If you select
    **Availability zones** prior to selecting **Copy from Control Plane Pool**, the availability zones are cleared and
    must be reselected.

    :::

    | **Parameter**          | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Instance Type**      | Select the instance type to use for all nodes in the node pool.                                                                                                                                                                                                                                                                                                                                                                                                               |
    | **Managed disk**       | Choose a storage option. Available options are **Standard SSD LRS**, **Standard LRS**, **Premium LRS**, and **Standard SSD ZRS**. Refer to Microsoft's [Storage Account Overview](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview) and [Standard SSD Disks for Azure Virtual Machine Workloads](https://azure.microsoft.com/en-us/blog/preview-standard-ssd-disks-for-azure-virtual-machine-workloads/) reference pages for more information. |
    | **Disk size**          | Enter the size of the disk based on your requirements. The default size is 60 GB.                                                                                                                                                                                                                                                                                                                                                                                             |
    | **Availability zones** | Select the availability zones where you want to deploy your worker nodes. If you select multiple zones, Palette will distribute the nodes evenly across the chosen zones, provided sufficient capacity is available.                                                                                                                                                                                                                                                          |

14. Select **Next** to continue.

<!-- prettier-ignore-start -->

15. On the **Optional cluster settings** page, select from among the items on the left menu to configure additional
    options. Refer to applicable guide for additional information.

    | **Left Menu Item** | **Additional Information** |
    | --- | --- |
    | **Manage machines** | [OS Patching](../../cluster-management/os-patching.md) |
    | **Schedule scans** | [Compliance Scan](../../cluster-management/compliance-scan.md#configuration-security) |
    | **Schedule backups** | [Backup and Restore](../../cluster-management/backup-restore/backup-restore.md) |
    | **RBAC** | - [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings) <br /> - <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> | 

<!-- prettier-ignore-end -->

16. Select **Validate** to review the cluster configuration and settings summary.

17. Select **Finish Configuration** to deploy the cluster. Provisioning can take several minutes.

To monitor the status of your cluster deployment, from the left main menu, select **Clusters** and choose your cluster.
The cluster **Overview** tab displays the status and health of your cluster, as well as deployment details. Refer to the
**Events** tab to monitor the deployment in real time.

:::warning

If you experience network traffic issues when deploying a cluster to Azure Government Secret cloud, check the status of
your `coredns` pods. If they are failing, you may need to make additional modifications to the OS layer of your cluster
profile. For more information, refer to our
[Troubleshooting](../../../troubleshooting/cluster-deployment.md#scenario---coredns-pods-stuck-in-azure-government-secret-clusters)
guide.

:::

## Validate

Use the following steps to You can validate your cluster is up and in **Running** state.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Clusters**. The **Clusters** page displays a list of all available clusters that
   Palette manages.

4. Select the cluster you deployed. On the **Overview** tab, ensure the **Cluster Status** is **Running** and that the
   cluster has a **Health** status of **Healthy**.

## Next Steps

Once your cluster is running, perform [Day-2](../../cluster-management/cluster-management.md) operations as needed,
including [Kubernetes upgrades](../../cluster-management/cluster-updates.md),
[node pool operations](../../cluster-management/node-pool.md), and
[cluster profile updates](../../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md). For
guidance on deleting your cluster, refer to our [Cluster Removal](../../cluster-management/remove-clusters.md) guide.

<!--
## Configure Autoscaling in Azure Portal

Azure Autoscale allows you to provision nodes to support workload demand on your application. Within [Azure Portal](https://portal.azure.com/#home), you can scale out VMs to handle increases in load or scale in VMs when they are not needed. Azure VMs autoscale using a *virtual machine scale set*, which you create. The scale set serves as a virtual machine pool. For more information, review Microsoft's [Overview of Autoscale in Azure](https://learn.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-overview).

:::warning

To use Custom Autoscale capability, the following details apply with regard to scale sets:

- You must create a virtual machine scale set. To learn how, review Microsoft's [Create Virtual Machines in a Scale Set Using Azure Portal](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/flexible-virtual-machine-scale-sets-portal) guide.

- Ensure you create the scale set within the same resource group you specified during cluster creation in Palette.

- When creating a scale set, ensure you specify the same Availability Zone (AZ) in the region you specified during cluster creation in Palette.

:::

Once you create your scale set, you can find it by navigating to the **Azure services** home page, selecting **Virtual machine scale sets**, and using the search field.

Basic autoscaling options are available for host-based scaling when you create your scale set. However, to create custom autoscale rules based on metrics or a schedule, use **Custom autoscale**. To learn how you can scale resources based on metrics you define, refer to Microsoft's [Get started with Autoscale in Azure](https://learn.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-get-started) reference guide.

![Screenshot with an arrow that points to the Custom Autoscale option in Azure portal.](/clusters_publiccloud_azure_custom-autoscale.webp)

When scaling based on a metric, you add a rule to scale out VMs and a matching rule to scale in VMs when they are no longer needed.

:::warning

A [Microsoft video](https://learn.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-get-started?WT.mc_id=Portal-Microsoft_Azure_Monitoring#discover-the-autoscale-settings-in-your-subscription) in [Get started with Autoscale in Azure](https://learn.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-get-started) recommends adding matching scale-in and scale-out rules to avoid extra costs that could be incurred for unused provisioned resources.

:::


![Screenshot of scaling options with arrows pointing to the "Scale based on metric" option and the link to add a rule.](/clusters_publiccloud_azure_add-rule.webp)

:::tip

The link to access the Add Rules page is displayed within a caution message in the **Rules** section of the scale set resource page.

::: -->
