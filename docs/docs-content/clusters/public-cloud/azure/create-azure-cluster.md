---
sidebar_label: "Create and Manage Azure IaaS Cluster"
title: "Create and Manage Azure IaaS Cluster"
description: "Learn how to deploy and manage Azure clusters with Palette."
hide_table_of_contents: false
tags: ["public cloud", "azure"]
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

## Prerequisites

- Access to an Azure cloud account.

- Palette integration with Azure account. Review [Register and Manage Azure Cloud Account](azure-cloud.md) for guidance.

- A Secure Shell (SSH) key pre-configured in your Azure environment. Refer to the
  [SSH Keys](../../cluster-management/ssh/ssh-keys.md) guide for more information about creating and managing SSH keys
  in Palette.

- An infrastructure cluster profile for Azure. Review
  [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)
  for guidance.

- To use custom storage accounts or containers, you must create them before you create your cluster. All custom storage
  accounts and containers will be listed on the Cluster config page during the cluster creation process. For information
  about use cases for custom storage, review [Azure Storage](./architecture.md#azure-storage).

  If you need help creating a custom storage account or container, check out the
  [Create a Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal)
  guide or the [Manage Blob Containers](https://learn.microsoft.com/en-us/azure/storage/blobs/blob-containers-portal).

- If you do not provide your own Virtual Network (VNet), Palette creates one for you with compute, network, and storage
  resources in Azure when it provisions Kubernetes clusters. To use a VNet that Palette creates, ensure there is
  sufficient capacity in the preferred Azure region to create the following resources:

  - Virtual CPU (vCPU)
  - VNet
  - Static Public IP addresses
  - Virtual Network Interfaces
  - Load Balancers
  - Virtual Hard Disk (VHD)
  - Managed Disks
  - Virtual Network Address Translation (NAT) Gateway

:::warning For static network deployments, you must have port 6443 open between Palette and the Workload cluster. Refer
to the [Network Ports](../../../architecture/networking-ports.md) documentation for detailed network architecture
diagrams and to learn more about the ports used for communication. :::

- To enable the `fullyPrivateAddressing` parameter and use a Private API Server load balancer, you need a self-hosted
  Private Cloud Gateway (PCG) deployed in Azure. Ensure the Azure cloud account selected is connected to a PCG. For more
  information on deploying PCGs, refer to [Private Cloud Gateway](../../pcg/pcg.md). To learn how to connect a PCG to an
  Azure cloud account, refer to the [Register and Manage Azure Cloud Account](./azure-cloud.md) guide.

- A Private DNS Zone is required to use the Private API Server load balancer. You also need to ensure the virtual
  networks used for the cluster support
  [Private DNS resolving](https://learn.microsoft.com/en-us/azure/dns/dns-private-resolver-overview). To learn more
  about Private DNS Zones, refer to
  [Private DNS Zones](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns).

<!-- prettier-ignore -->
- If you want to enable Azure Disk Encryption on your cluster, ensure you have created a Key Vault and Disk Encryption Set. Your cluster profile must also be configured to use the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> pack, and have the **Use Azure Disk Encryption** preset enabled.

  Review [Azure Disk Encryption](./azure-disk-encryption.md) for guidance.

## Deploy an Azure Cluster

Use the following steps to deploy an Azure cluster.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu**, select **Clusters** and click **Add New Cluster**.

4. In **Public Clouds**, under **Infrastructure Provider**, select **Azure IaaS**.

5. In the bottom-right corner, click **Start Azure IaaS Configuration**.

6. Fill out the following basic information and click **Next**.

   | **Field**         | **Description**                                                                                                                                                         |
   | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Cluster Name**  | A custom name for the cluster.                                                                                                                                          |
   | **Description**   | Use the description to provide context about the cluster.                                                                                                               |
   | **Tags**          | Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments. Example: `region:us-west`.         |
   | **Cloud Account** | If you already added your Azure account in Palette, select it from the **drop-down Menu**. Otherwise, click **Add New Account** and add your Azure account information. |

7. Select the Azure cluster profile you created and click **Next**. Palette displays the cluster profile layers.

8. Review the profile layers and customize parameters as desired in the YAML files that display when you select a layer.

9. To ensure that clusters with [static placement](#static-placement-settings) remain fully private, with no public IPs
   created for the control plane and worker nodes, add the following configuration to your Kubernetes layer.

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

   Toggle the **Private API Server LB** option to enable the use of a Private API Server load balancer and specify the
   [Private DNS Zone](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns) name you want to use.
   Select the desired **IP Allocation Method**. You can choose between **Static** and **Dynamic** IP allocation methods.
   If you select **Static**, you must provide a valid IP address.

<!-- prettier-ignore-start -->

10. To configure custom OpenID Connect (OIDC) for Azure clusters, refer to the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> pack additional details for further guidance.

    :::warning

    All the OIDC options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a
    Kubernetes role to users and groups, refer to
    [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings).

    :::

<!-- prettier-ignore-end -->

11. Click **Next** to continue.

12. Provide the cluster configuration information listed in the following table. If you are utilizing your own VNet,
    ensure you also provide information listed in the Static Placement Settings table. If you have custom storage
    accounts or containers available, you can attach them to the cluster. To learn more about attaching custom storage
    to a cluster, check out [Azure storage](../azure/architecture.md#azure-storage).

    :::warning

    If you enable the **Disable Properties** setting when
    [registering an Azure cloud account](./azure-cloud.md#add-azure-cloud-account), Palette cannot create network
    resources on your behalf. In this case, when creating clusters, you must manually specify their virtual network
    subnets and security groups.

    :::

    | **Parameter**             | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Subscription**          | Use the **drop-down Menu** to select the subscription that will be used to access Azure services.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | **Region**                | Use the **drop-down Menu** to choose the Azure region where you would like to provision the cluster.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    | **Resource Group**        | Select the name of the resource group that contains the Azure resources you will be accessing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | **Storage Account**       | Optionally, if you have a custom storage account available, you can use the **drop-down Menu** to select the storage account name. For information about use cases for custom storage, review [Azure Storage](../azure/architecture.md#azure-storage).                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | **Storage Container**     | Optionally, if you will be using a custom storage container, use the **drop-down Menu** to select it. For information about use cases for custom storage, review [Azure Storage](../azure/architecture.md#azure-storage).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | **SSH Key**               | The public SSH key for connecting to the nodes. SSH key pairs must be pre-configured in your Azure environment. The key you select is inserted into the provisioned VMs. For more information, review Microsoft's [Supported SSH key formats](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/mac-create-ssh-keys#supported-ssh-key-formats).                                                                                                                                                                                                                                                                                                                                                            |
    | **Static Placement**      | By default, Palette uses dynamic placement. This creates a new VNet for clusters with two subnets in different availability zones. Palette places resources in these clusters, manages the resources, and deletes them when the corresponding cluster is deleted.<br /><br />If you want to place resources into a pre-existing VNet, enable the **Static Placement** option, and fill out the input values listed in the [Static Placement](#static-placement-settings) table below. <br /> <br /> Select **Static Placement** for clusters where you want to use your network proxy configurations. To learn more about proxy configurations, check out [Proxy Configuration](./architecture.md#proxy-configuration). |
    | **Private API Server LB** | _This option is only available when deploying clusters through a [Self Hosted PCG](../../pcg/deploy-pcg-k8s.md)._ Configure a private API server load balancer to enable private connectivity to your Kubernetes cluster. When enabled, this exposes the Kubernetes control plane endpoint on an internal Azure load balancer. If enabling, provide the additional input values as listed in the [Private API Server LB Settings](#private-api-server-lb-settings) table.                                                                                                                                                                                                                                               |

    #### Static Placement Settings

    Each subnet allows you to specify the CIDR range and a security group.

    | **Parameter**              | **Description**                                             |
    | -------------------------- | ----------------------------------------------------------- |
    | **Network Resource Group** | The logical container for grouping related Azure resources. |
    | **Virtual Network**        | Select the VNet.                                            |
    | **CIDR Block**             | Select the IP address CIDR range.                           |
    | **Control Plane Subnet**   | Select the control plane subnet.                            |
    | **Worker Subnet**          | Select the worker network.                                  |

    #### Private API Server LB Settings

    :::warning

    Dynamic IP allocation is no longer supported for private API server load balancers. Select **Static** for **IP
    Allocation Method** and enter an IP address in **Static IP**.

    If you omit a static IP, cluster provisioning will fail.

    :::

    | **Parameter**                   | **Description**                                                                                                                                                                                                                                                                                                                  |
    | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Resource Group (Optional)**   | The Azure resource group that contains the **Private DNS zone** you want to use for the private API server load balancer. It can be different from the cluster’s own resource group. Leave blank to default to the selected cluster **Resource Group**.                                                                          |
    | **Private DNS zone (Optional)** | The existing private DNS zone that will hold the A record of the private endpoint. After you choose a resource group, the dropdown lists the zones in that resource group. Select an existing zone, or leave it blank. If left blank, Palette will create a new zone in the chosen resource group.                               |
    | **IP Allocation Method**        | How the load balancer virtual IP is assigned. <br /> - **Dynamic** (default) lets Azure pick the next free address in the subnet. _This option is no longer supported, you must assign a static IP._ <br /> - **Static** lets you choose a specific IP address for the load balancer that you supply in the **Static IP** field. |
    | **Static IP**                   | The private IP address to use only when **IP Allocation Method** is set to **Static**. The address must be unused and inside the subnet delegated for the private API server load balancer.                                                                                                                                      |

13. Click **Next** to continue.

14. Provide the following node pool and cloud configuration information. To learn more about node pools, review the
    [Node Pool](../../cluster-management/node-pool.md) guide.

    :::info

    By default, a control plane pool and one worker node pool are configured. You can add new worker pools to customize
    certain worker nodes for specialized workloads. For example, the default worker pool can be configured with the
    Standard_D2_v2 instance types for general-purpose workloads, and another worker pool with instance type
    Standard_NC12s_v3 can be configured for Graphics Processing Unit (GPU) workloads.

    :::

    #### Control Plane Pool Configuration Settings

    | **Parameter**                   | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Node pool name**              | A descriptive name for the node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | **Number of nodes in the pool** | Specify the number of nodes in the control plane pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
    | **Allow worker capability**     | Select this option to allow workloads to be provisioned on control plane nodes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | **Additional Labels**           | You can add optional labels to nodes in key-value format. To learn more, review [Node Labels](../../cluster-management/node-labels.md). Example: `environment:production`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    | **Taints**                      | You can apply optional taint labels to a node pool during cluster creation or edit taint labels on an existing cluster. Review the [Node Pool](../../cluster-management/node-pool.md) management page and [Taints and Tolerations](../../cluster-management/taints.md) page to learn more. Toggle the **Taint** button to create a taint label. When tainting is enabled, you need to provide a custom key-value pair. Use the **drop-down Menu** to choose one of the following **Effect** options:<br />**NoSchedule** - Pods are not scheduled onto nodes with this taint.<br />**PreferNoSchedule** - Kubernetes attempts to avoid scheduling pods onto nodes with this taint, but scheduling is not prohibited.<br />**NoExecute** - Existing pods on nodes with this taint are evicted. |

    #### Cloud Configuration Settings for Control Plane Pool

    | **Parameter**     | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Instance Type** | Select the instance type to use for all nodes in the node pool.                                                                                                                                                                                                                                                                                                                                                                     |
    | **Managed disk**  | Choose a storage option. For more information, refer to Microsoft's [Storage Account Overview](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview) reference. For information about Solid State Drive (SSD) disks, refer to [Standard SSD Disks for Azure Virtual Machine Workloads](https://azure.microsoft.com/en-us/blog/preview-standard-ssd-disks-for-azure-virtual-machine-workloads/) reference |
    | **Disk size**     | You can choose disk size based on your requirements. The default size is 60.                                                                                                                                                                                                                                                                                                                                                        |

    You can select **Remove** at right to remove the worker node if all you want is the control plane node.

    #### Worker Pool Configuration Settings

    | **Parameter**                   | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
    | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Node pool name**              | A descriptive name for the node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | **Enable Autoscaler**           | Scale the worker pool horizontally based on its per-node workload counts. The **Minimum size** specifies the lower bound of nodes in the pool, and the **Maximum size** specifies the upper bound. Setting both parameters to the same value results in a static node count. Refer to the Cluster API [autoscaler documentation](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/clusterapi/README.md) for more information on autoscaling.                                                                                                                                                                                                                                                                                                              |
    | **Number of nodes in the pool** | Specify the number of nodes in the worker pool. This field is hidden if **Enable Autoscaler** is toggled on.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | **Node repave interval**        | Optionally, you can specify the preferred time interval for Palette to perform a rolling upgrade on nodes when it detects a change in the Kubeadm configuration file.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | **Rolling update**              | These options allow you to control the sequence of operations during a node pool update. Choose the **Expand first** option to add new nodes with updated configurations to the node pool before the existing nodes are removed. Choose **Contract first** to remove existing nodes from the node pool before the new nodes with updated configurations are added.                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | **Additional Labels**           | You can add optional labels to nodes in key-value format. For more information about applying labels, review [Node Labels](../../cluster-management/node-labels.md). Example: `environment:production`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
    | **Taints**                      | You can apply optional taint labels to a node pool during cluster creation or edit taint labels on an existing cluster. To learn more, review the [Node Pool](../../cluster-management/node-pool.md) management page and [Taints and Tolerations](../../cluster-management/taints.md) page. Toggle the **Taint** button to create a taint label. When tainting is enabled, you need to provide a custom key-value pair. Use the **drop-down Menu** to choose one of the following **Effect** options:<br />**NoSchedule** - Pods are not scheduled onto nodes with this taint.<br />**PreferNoSchedule** - Kubernetes attempts to avoid scheduling pods onto nodes with this taint, but scheduling is not prohibited.<br />**NoExecute** - Existing pods on nodes with this taint are evicted. |

    #### Cloud Configuration Settings for Worker Pool

    You can copy cloud configuration settings from the control plane pool, but be aware that the instance type might not
    get copied if it does not have accessible availability zones.

    | **Parameter**          | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                      |
    | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Instance Type**      | Select the instance type to use for all nodes in the node pool.                                                                                                                                                                                                                                                                                                                                                                      |
    | **Managed disk**       | Choose a storage option. For more information, refer to Microsoft's [Storage Account Overview](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview) reference. For information about Solid State Drive (SSD) disks, refer to [Standard SSD Disks for Azure Virtual Machine Workloads](https://azure.microsoft.com/en-us/blog/preview-standard-ssd-disks-for-azure-virtual-machine-workloads/) reference. |
    | **Disk size**          | You can choose disk size based on your requirements. The default size is 60.                                                                                                                                                                                                                                                                                                                                                         |
    | **Availability zones** | The Availability Zones from which to select available servers for deployment. If you select multiple zones, Palette will deploy servers evenly across them as long as sufficient servers are available to do so.                                                                                                                                                                                                                     |

15. Click **Next** to continue.

16. Specify your preferred **OS Patching Schedule**.

17. Enable any scan options you want Palette to perform, and select a scan schedule. Palette provides support for
    Kubernetes configuration security, penetration testing, and conformance testing.

18. Schedule any backups you want Palette to perform. Review
    [Backup and Restore](../../cluster-management/backup-restore/backup-restore.md) for more information.

<!-- prettier-ignore-start -->

19. Role-Based Access Control (RBAC) configuration is required when you configure custom OIDC. You must map a set of
    users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to
    [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings). Refer to the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> pack additional details for an example.

<!-- prettier-ignore-end -->

20. Click **Validate** and review the cluster configuration and settings summary.

21. Click **Finish Configuration** to deploy the cluster. Provisioning Azure clusters can take several minutes.

The cluster details page contains the status and details of the deployment. Use this page to track the deployment
progress.

To learn how to remove a cluster and what to do if a force delete is necessary so you do not incur unexpected costs,
refer to [Cluster Removal](../../cluster-management/remove-clusters.md).

## Validate

You can validate your cluster is up and in **Running** state.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu**, select **Clusters**. The **Clusters** page displays a list of all available clusters
   that Palette manages.

4. Select the cluster you deployed to review its details page. Ensure the **Cluster Status** field contains the value
   **Running**.

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

## Resources

- [Register and Manage Azure Cloud Account](azure-cloud.md)

- [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)

- [Azure Storage](../azure/architecture.md#azure-storage)

- [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings)

<!-- prettier-ignore-start -->

- <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> pack

<!-- prettier-ignore-end -->

<!-- - [Get started with Autoscale in Azure](https://learn.microsoft.com/en-us/azure/azure-monitor/autoscale/autoscale-get-started)

- [Create Virtual Machines in a Scale Set Using Azure Portal](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/flexible-virtual-machine-scale-sets-portal) -->
