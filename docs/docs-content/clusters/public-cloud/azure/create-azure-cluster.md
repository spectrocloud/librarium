---
sidebar_label: "Create and Manage Azure IaaS Cluster"
title: "Create and Manage Azure IaaS Cluster"
description: "Learn how to deploy and manage Azure clusters with Palette."
hide_table_of_contents: false
tags: ["public cloud", "azure"]
sidebar_position: 20
---


Palette supports creating and managing Kubernetes clusters deployed to an Azure account. This section guides you on how to create a Kubernetes cluster in Azure that Palette manages.


## Prerequisites

- Access to an Azure cloud account.

- Palette integration with Azure account. Review [Create an Azure Cloud account](azure-cloud.md) for guidance.

- An infrastructure cluster profile for Azure. Review [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) for guidance.

- If you do not provide your own Virtual Network (VNet), Palette creates one for you with compute, network, and storage resources in Azure when it provisions Kubernetes clusters. Ensure there is sufficient capacity in the preferred Azure region to create the following resources. Note that Palette does not create these resources if you specify an existing VNet. 
    - Virtual CPU (vCPU)
    - VNet
    - Static Public IP addresses 
    - Azure Virtual Private Network (VPN) Gateway
    - Load balancers
    - VNet Network Address Translation (NAT) Gateway

  <br />

<!-- <video title="azure-cluster-creation" src="/videos/clusters/public-cloud/azure/azure.mp4"></video> -->

## Deploy an Azure Cluster

Use the following steps to deploy an Azure cluster.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu** select **Clusters**, and click on the **Add New Cluster** button.

4. Select **Deploy New Cluster** on the next page that Palette displays. This will allow you to deploy a cluster using your own cloud account.

5. Select **Azure** and click on the **Start Azure Configuration** button.

6. Fill out the following basic information, and click **Next** to continue.

  | **Field** | **Description** |
  |-----------|-----------------|
  | **Cluster Name**| A custom name for the cluster. |
  | **Description**| Use the description to provide context about the cluster.|
  | **Tags**| Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments. Example: `region:france south`|
  | **Cloud Account** | If you already added your AWS account in Palette, select it from the **drop-down Menu**. Otherwise, click on **Add New Account** and add your Azure account information. |

  To learn how to add an Azure account, review the [Register and Manage Azure Cloud Account](azure-cloud.md#enable-azure-cloud-account-registration-to-palette) guide.


7. Select the Azure cluster profile you created, and click on **Next**. Palette displays the cluster profile layers.


8. Review the profile layers and customize parameters as desired in the YAML files that display when you select a layer. You can configure custom OpenID Connect (OIDC) for Azure clusters at the Kubernetes layer. Check out ??? if you need more guidance. <<< Need reference here to OIDC info. >>>


9. Click on **Next** to continue.


10. Provide the cluster configuration information listed in the following table.

  If you have custom storage accounts or a storage container available, you can attach them to the cluster. To learn more about attaching custom storage to a cluster, check out [Azure storage](architecture#azure-storage).

  :::caution

  If the Azure account is registered with **Disable Properties** and **Static Placement** options enabled, then Palette will not import the network information from your Azure account. You can manually input the information for the **Control Plane Subnet** and the **Worker Network**, but be aware that drop-down menu selections will be empty. To learn more about these settings and certain requirements to use them, refer to [Disable Properties](azure-cloud.md#disable-properties). 

  :::

  |**Parameter**| **Description**|
  |-------------|---------------|
  | **Subscription** | Use the **drop-down Menu** to select the subscription that will be used to access Azure services.|
  | **Region** | Use the **drop-down Menu** to choose the Azure region where you would like to provision the cluster.|
  | **Resource Group** | Select the name of the resource group that contains the Azure resources you will be accessing.|
  | **Storage Account** | Optionally, if you have a custom storage account available, you can use the **drop-down Menu** to select the storage account name. For information about use cases for custom storage, review [Azure Storage](architecture#azure-storage).|
  | **Storage Container**| Optionally, if you will be using a custom storage container, use the **drop-down Menu** to select it. For information about use cases for custom storage, review [Azure Storage](architecture#azure-storage).|
  | **SSH Key** | The public SSH key for connecting to the nodes. SSH key pairs must be pre-configured in your Azure environment. The key you select is inserted into the provisioned VMs. For more information, review Microsoft's [Supported SSH key formats](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/mac-create-ssh-keys#supported-ssh-key-formats). |
  | **Static Placement** | By default, Palette uses dynamic placement. This creates a new Virtual Network (VNet) for the cluster that contains two subnets in different Availability Zones (AZs). Palette places resources in these clusters, manages the resources, and deletes them when the corresponding cluster is deleted.<br /><br />If you want to place resources into pre-existing VNets, enable the **Static Placement** option, and fill out the input values listed in the [Static Placement](#static-placement-table) table below.|

    - Static Placement Settings

    | **Parameter**              | **Description** |
    |------------------------|------------------------------------------------------------|
    | **Network Resource Group** | The logical container for grouping related Azure resources. |
    | **Virtual Network**        | Use the **drop-down Menu** to select the virtual network. |
    | **CIDR Block**             | Use the **drop-down Menu** to select the CIDR address.    |
    | **Control Plane Subnet**   | Use the **drop-down Menu** to select the control plane network. |
    | **Worker Network**         | Use the **drop-down Menu** to select the worker network. |



<!-- #### Private API Server LB Table


| **Parameter**            | **Description**|
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| **Private DNS Zone**   | Optionally select the DNS Zone from the drop-down menu. If you do not select a DNS Zone, one will be generated and assigned.|
| **IP Allocation Method** | Allocate an available IP from the private endpoint VNet. Review the [IP Allocation Method Table](#ip-allocation-method-table) below for more details.| -->

<!-- ##### IP Allocation Method Table

| **Parameter**            | **Description** |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| **Dynamic**              | Use Dynamic Host Configuration Protocol (DHCP) to dynamically allocates IP addresses from the available Virtual Network IP CIDR range.|
| **Static**               | You can specify a static IP address from the available Virtual Network IP range.| -->


11. Click on **Next** to continue.

12. Provide the following node pool and cloud configuration information. To learn more about the configuration options, review the [Node Pool](../../cluster-management/node-pool.md) documentation page.

  :::info

  By default, a master pool and one worker node pool are configured. You can add new worker pools to customize certain worker nodes to run specialized workloads. For example, the default worker pool may be configured with the Standard_D2_v2 instance types for general-purpose workloads, and another worker pool with instance type Standard_NC12s_v3 can be configured to run GPU workloads.

  :::


    - Master Pool Configuration Settings
    
    |**Parameter**| **Description**|
    |-------------|----------------|
    |**Node pool name** | A descriptive name for the node pool.|
    |**Number of nodes in the pool** | Specify the number of nodes in the worker pool.|
    |**Allow worker capability** | ??? |
    |**Additional Labels** | You can add optional labels to nodes in key-value format. For more information about applying labels, review [Apply Labels to Nodes](../../cluster-management/taints.md/#apply-labels-to-nodes).  Example: `"environment": "production"` |
    |**Taints** | You can apply optional taint labels to a node pool during cluster creation or edit taint labels on an existing cluster. Review the [Node Pool](../../cluster-management/node-pool.md) management page and [Apply Taints to Nodes](../../cluster-management/taints.md/#apply-taints-to-nodes) page to learn more. Toggle the **Taint** button to create a taint label. When tainting is enabled, you need to provide a custom key-value pair. Use the **drop-down Menu** to choose one of the following **Effect** options:<br />**NoSchedule** - Pods are not scheduled onto nodes with this taint.<br />**PreferNoSchedule** - Kubernetes attempts to avoid scheduling pods onto nodes with this taint, but scheduling is not prohibited.<br />**NoExecute** - Existing pods on nodes with this taint are evicted.| 

    - Cloud Configuration settings for master pool
    
    |**Parameter**| **Description**|
    |-------------|----------------|
    <!-- | **Instance Option** | Choose a pricing method:<br />**On-Demand** instances provide stable and uninterrupted compute capacity at a higher cost.<br />**Spot** instances allow you to bid for unused EC2 capacity at a lower cost.<br />We recommend you base your choice on your application's requirements. |  -->
    |**Instance Type** | Select the instance type to use for all nodes in the node pool.|
    |**Managed disk** | Choose a storage option. For more information, refer to Microsoft's [Storage Account Overview](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview) reference. For information about Solid State Drive (SSD) disks, refer to [Standard SSD Disks for Azure Virtual Machine Workloads](https://azure.microsoft.com/en-us/blog/preview-standard-ssd-disks-for-azure-virtual-machine-workloads/) reference |
    |**Root Disk size** | You can choose disk size based on your requirements. The default size is `60`. |

    <<< You can Remove worker node if all you want is control plane - why would you do this? >>>
    <<< When configuring the worker-pool, you can copy configuration settings from the Master Pool >>>

    - Worker Pool Configuration Settings
    
    |**Parameter**| **Description**|
    |-------------|----------------|
    |**Node pool name** | A descriptive name for the node pool.|
    |**Number of nodes in the pool** | Specify the number of nodes in the worker pool.|
    |**Node repave interval** | Optionally, you can specify the preferred time interval for Palette to perform a rolling upgrade on nodes when it detects a change in the kubeadm config. |
    |**Rolling update** | These options allow you to control the sequence of operations during a node pool update. Choose the **Expand first** option to add new nodes with the updated configurations to the node pool before the existing, old nodes are removed. Choose **Contract first** to remove existing nodes from the node pool before the new nodes with the updated configurations are added. |
    |**Additional Labels** | You can add optional labels to nodes in key-value format. For more information about applying labels, review [Apply Labels to Nodes](../../cluster-management/taints.md/#apply-labels-to-nodes).  Example: `"environment": "production"` |
    |**Taints** | You can apply optional taint labels to a node pool during cluster creation or edit taint labels on an existing cluster. Review the [Node Pool](../../cluster-management/node-pool.md) management page and [Apply Taints to Nodes](../../cluster-management/taints.md/#apply-taints-to-nodes) page to learn more. Toggle the **Taint** button to create a taint label. When tainting is enabled, you need to provide a custom key-value pair. Use the **drop-down Menu** to choose one of the following **Effect** options:<br />**NoSchedule** - Pods are not scheduled onto nodes with this taint.<br />**PreferNoSchedule** - Kubernetes attempts to avoid scheduling pods onto nodes with this taint, but scheduling is not prohibited.<br />**NoExecute** - Existing pods on nodes with this taint are evicted.| 

    - Cloud Configuration settings for worker pool
    
    |**Parameter**| **Description**|
    |-------------|----------------|
    |**Instance Type** | Select the instance type to use for all nodes in the node pool.|
    |**Managed disk** | Choose a storage option. For more information, refer to Microsoft's [Storage Account Overview](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview) reference. For information about Solid State Drive (SSD) disks, refer to [Standard SSD Disks for Azure Virtual Machine Workloads](https://azure.microsoft.com/en-us/blog/preview-standard-ssd-disks-for-azure-virtual-machine-workloads/) reference |
    |**Disk size** | You can choose disk size based on your requirements. The default size is `60`. |
    |**Availability zones** | Select up to three availability zones. |

    :::info
    
    You can add new worker pools if you need to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the m3.large instance types for general-purpose workloads, and another worker pool with instance type g2.2xlarge can be configured to run GPU workloads. <<< modify this for Azure. See previous example for wording. >>
    
    :::

13. Click on **Next** to continue.

14. Specify your preferred **OS Patching Schedule** for EKS-managed machines.

15. Enable any scan options you want Palette to perform, and select a scan schedule. Palette provides support for Kubernetes configuration security, penetration testing, and conformance testing.

16. Schedule any backups you want Palette to perform. Review [Backup and Restore](../../cluster-management/backup-restore/backup-restore.md) for more information.

17. RBAC configuration is required when you configure custom OIDC. You must map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to [Create Role Bindings](../../cluster-management/cluster-rbac.md/#create-role-bindings). Refer to [Use RBAC with OIDC](../../../integrations/kubernetes.md/#use-rbac-with-oidc) for an example.

18. Click on the **Validate** button and review the cluster configuration and settings summary. 

19. Click **Finish Configuration** to deploy the cluster. 

  The cluster details page of the cluster contains the status and details of the deployment. Use this page to track the deployment progress.
  
  :::info
  
  Provisioning Azure clusters can take several minutes. <<< Fix in AWS. >>>
  
  :::


<!-- The cluster details page of the cluster contains the status and details of the deployment. Use this page to track the deployment progress. -->

## Validate

You can validate your cluster is up and running by reviewing the cluster details page. Navigate to the left **Main Menu** and click on **Clusters**. The **Clusters** page contains a list of all available clusters managed by Palette. Click on the row for the cluster you wish to review its details page. Ensure the **Cluster Status** field contains the value **Running**.
## Deleting an Azure IaaS Cluster

The deletion of an Azure IaaS cluster results in the removal of all instances and associated resources created for the cluster. To perform a cluster deletion, use the following steps.


1. Ensure you are in the correct project scope.


2. Navigate to the left **Main Menu** and click on **Clusters**


3. Click on the cluster that you want to remove.


4. Click on the **Settings** drop-down menu.


5. Click on **Delete Cluster**


6. Type in the name of the cluster and click on **OK**

The cluster status is updated to **Deleting** while cluster resources are being deleted. Once all resources are successfully deleted, the cluster status is updated to **Deleted** and is removed from the list of clusters.

## Force Delete a Cluster

If a cluster is stuck in the **Deletion** state for a minimum of 15 minutes it becomes eligible for force deletion. You can force delete a cluster from the tenant and project admin scope.
To force delete a cluster follow the same steps outlined in [Deleting an Azure IaaS Cluster](#deleting-an-azure-iaas-cluster). However, after 15 minutes, a **Force Delete Cluster** option is available in the **Settings** drop-down menu. The **Settings** drop-down menu will provide you with an estimated time left before the force deletion becomes available..

<br />

:::caution


A force delete can result in resources Palette provisioned being missed in the removal process. Verify there are no remaining Palette provisioned resources such as:

- Virtual Network (VNet)
- Static Public IPs
- Virtual Network Interfaces
- Load Balancers
- VHD
- Managed Disks
- Virtual Network Gateway

Failure in removing provisioned resources can result in unexpected costs.

:::

## Validate

To validate the Azure cluster creation and deletion status

1. Log in to [Palette](https://console.spectrocloud.com).


2. Click on **Cluster** on the left **Main Menu**


4. Click on the check box **Deleted only** to view all the clusters deleted in the last 72 hours.
