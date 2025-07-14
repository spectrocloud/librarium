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

- An active Azure cloud account integrated with Palette. Review
  [Register and Manage Azure Cloud Account](./azure-cloud.md) for guidance.

- A Secure Shell (SSH) key that you have pre-configured in your Azure environment. Only RSA SSH keys are supported for Azure AKS clusters deployed using Palette. Refer to the
  [SSH Keys](../../cluster-management/ssh/ssh-keys.md) guide for more information about creating and managing SSH keys
  in Palette.

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

:::warning

For static network deployments, you must have port 6443 open between Palette and the workload cluster. Refer to the
[Network Ports](../../../architecture/networking-ports.md) documentation for detailed network architecture diagrams and
to learn more about the ports used for communication.

:::

## Deploy an Azure AKS Cluster

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Ensure you are in the correct project scope.

3.  From the left **Main Menu** select **Clusters** > **Add New Cluster** > **Deploy New Cluster**.

4.  Under **Cloud**, select **Azure** and click **Start Azure Configuration**.

5.  Fill out the following basic information and click **Next**.

    | **Field**         | **Description**                                                                                                                                                              |
    | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Cluster Name**  | A custom name for the cluster.                                                                                                                                               |
    | **Description**   | Use the description to provide context about the cluster.                                                                                                                    |
    | **Tags**          | Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments. Example: `region:us-west`.              |
    | **Cloud Account** | If you have already added your Azure account in Palette, select it from the **drop-down Menu**. Otherwise, click **Add New Account** and add your Azure account information. |

6.  Under **Managed Kubernetes**, select **Azure AKS** and select your Azure AKS cluster profile.

<!-- prettier-ignore-start -->

7.  Palette displays the cluster profile layers. Review the profile layers and customize parameters as desired in the
    YAML editor that displays when you click on **Values** after selecting a layer.

    You can configure custom OpenID Connect (OIDC) for Azure clusters at the Kubernetes layer. Check out the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" />
    pack additional details for more information.

    :::warning

    All OIDC options require you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a
    Kubernetes role to users and groups, refer to
    [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings).

    :::

<!-- prettier-ignore-end -->

8.  If you want to configure Pod and Service CIDR, populate the following configuration template and add the
    configuration to your Kubernetes cluster profile layer.

    ```yaml
    pack:
      podCIDR: "<pod-cidr>"
      serviceClusterIpRange: "<service-cidr>"
    ```

9.  If you want to [use a managed identity](https://learn.microsoft.com/en-us/azure/aks/use-managed-identity), populate
    the following configuration template and add the configuration to your Kubernetes cluster profile layer.

    - `providerID` – User-assigned identity ID in the format
      `azure:///subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}`

      ```yaml
      managedControlPlane:
        userAssignedIdentities:
          - providerID: "<provider-id>"
          - providerID: "<provider-id-2>"
      ```

10. If you want to integrate with Microsoft Entra ID (formerly Azure Active Directory), populate the following
    configuration template and add the configuration to your Kubernetes cluster profile layer.

    ```yaml
    managedControlPlane:
      aadProfile:
        managed: true
        adminGroupObjectIDs:
          - <admin-group-object-id>
          - <admin-group-object-id-2>
    ```

    Additionally, if you want to disable
    [local accounts](https://learn.microsoft.com/en-us/azure/aks/manage-local-accounts-managed-azure-ad), add the
    `disableLocalAccounts: true` entry to your Kubernetes cluster profile layer within the
    `managedControlPlane.aadProfile` section.

    ```yaml {7}
    managedControlPlane:
      aadProfile:
        managed: true
        adminGroupObjectIDs:
          - <admin-group-object-id>
          - <admin-group-object-id-2>
        disableLocalAccounts: true
    ```

11. If you want to add a custom AKS add-on profile, populate the following configuration template and add the
    configuration to your Kubernetes cluster profile layer.

    ```yaml
    managedControlPlane:
      addonProfiles:
        - name: add-on
          enabled: true
          config:
            mapString: string
    ```

    Consider the following example configuration for `omsagent` for reference, where:

    - `logAnalyticsWorkspaceResourceID` is the Log Analytics workspace resource ID, in the format
      `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}`

      ```yaml
      managedControlPlane:
        addonProfiles:
          - name: omsagent
            enabled: true
            config:
              logAnalyticsWorkspaceResourceID: "<log-analytics-workspace-resource-id>"
      ```

12. Click **Next** to continue.

13. Configure your Azure AKS cluster using the following table for reference.

    :::warning

    If you enable the **Disable Properties** setting when
    [registering an Azure cloud account](./azure-cloud.md#add-azure-cloud-account), Palette cannot create network
    resources on your behalf. In this case, every time you deploy a cluster, you must manually specify its virtual
    network subnets and security groups.

    :::

    | **Parameter**              | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
    | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Subscription**           | Use the **drop-down Menu** to select the subscription that will be used to access Azure services.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
    | **Region**                 | Use the **drop-down Menu** to choose the Azure region where you would like to provision the cluster.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | **Resource Group**         | Select the name of the resource group that contains the Azure resources you will be accessing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | **Storage Account**        | Optionally, if you have a custom storage account available, you can use the **drop-down Menu** to select the storage account name. For information about use cases for custom storage, review [Azure Storage](../azure/architecture.md#azure-storage).                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
    | **Storage Container**      | Optionally, if you are using a custom storage container, use the **drop-down Menu** to select it. For information about use cases for custom storage, review [Azure Storage](../azure/architecture.md#azure-storage).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
    | **SSH Key**                | The public SSH key for connecting to the nodes. SSH key pairs must be pre-configured in your Azure environment. Only RSA SSH keys are supported for Azure AKS clusters deployed using Palette. The key you select is inserted into the provisioned VMs. For more information, review Microsoft's [Supported SSH key formats](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/mac-create-ssh-keys#supported-ssh-key-formats).                                                                                                                                                                                                                                                                                                                                                           |
    | **Enable Private Cluster** | Whether the control plane or API server should have internal IP addresses. Refer to the [Create a private AKS cluster](https://learn.microsoft.com/en-us/azure/aks/private-clusters?tabs=azure-portal) guide for more information.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | **Static Placement**       | By default, Palette uses dynamic placement. This creates a new VNet for clusters with two subnets in different availability zones. Palette places resources in these clusters, manages the resources, and deletes them when the corresponding cluster is deleted.<br /><br />If you want to place resources into a pre-existing VNet, enable the **Static Placement** option and fill out the input values listed in the [Static Placement](#static-placement-settings) table below. <br /> <br /> Select **Static Placement** for clusters where you want to use your network proxy configurations. To learn more about proxy configurations, check out [Proxy Configuration](./architecture.md#proxy-configuration). |

    #### Static Placement Settings

    Each subnet allows you to specify the CIDR range and a security group.

    | **Parameter**              | **Description**                                             |
    | -------------------------- | ----------------------------------------------------------- |
    | **Network Resource Group** | The logical container for grouping related Azure resources. |
    | **Virtual Network**        | Select the VNet.                                            |
    | **CIDR Block**             | Select the IP address CIDR range.                           |
    | **Control Plane Subnet**   | Select the control plane subnet.                            |
    | **Worker Subnet**          | Select the worker network.                                  |

14. Click **Next** to continue.

15. Provide the following node pool and cloud configuration information. To learn more about node pools, review the
    [Node Pool](../../cluster-management/node-pool.md) guide.

    #### System Node Pool

    To deploy an AKS cluster, you need to have at least one system node pool, which will manage the pods necessary to
    deploy a Kubernetes cluster, like the control plane and etcd. To add a system node pool, add a worker node pool and
    select the **System Node Pool** checkbox.

    :::info

    A system pool must have at least one node for development purposes. We recommend having between one and three nodes
    for high availability in production environments. You can configure a static node count with the **Number of nodes
    in the pool** parameter or a dynamic node count with the **Enable Autoscaler** parameter.

    :::

    The following table describes how to configure a system node pool.

    | **Parameter**                   | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Node pool name**              | A descriptive name for the node pool.                                                                                                                                                                                                                                                                                                                                                                                                              |
    | **Enable Autoscaler**           | Scale the worker pool horizontally based on its per-node workload counts. The **Minimum size** specifies the lower bound of nodes in the pool, and the **Maximum size** specifies the upper bound. Setting both parameters to the same value results in a static node count. Refer to the Azure AKS [autoscaler documentation](https://learn.microsoft.com/en-us/azure/aks/cluster-autoscaler?tabs=azure-cli) for more information on autoscaling. |
    | **System Node Pool**            | Sets the pool to be a system node pool.                                                                                                                                                                                                                                                                                                                                                                                                            |
    | **Number of nodes in the pool** | A statically defined number of nodes in the system pool. This field is hidden if **Enable Autoscaler** is toggled on.                                                                                                                                                                                                                                                                                                                              |
    | **Additional Labels**           | Optional node labels in the key-value format. To learn more, review [Node Labels](../../cluster-management/node-labels.md). Example: `environment:production`.                                                                                                                                                                                                                                                                                     |

    #### System Node Pool Cloud Configuration

    The following table describes how to configure the Azure Cloud for a system node pool.

    | **Parameter**     | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                      |
    | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Instance Type** | Select the instance type to use for all nodes in the system node pool.                                                                                                                                                                                                                                                                                                                                                               |
    | **Managed disk**  | Choose a storage option. For more information, refer to Microsoft's [Storage Account Overview](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview) reference. For information about Solid State Drive (SSD) disks, refer to [Standard SSD Disks for Azure Virtual Machine Workloads](https://azure.microsoft.com/en-us/blog/preview-standard-ssd-disks-for-azure-virtual-machine-workloads/) reference. |
    | **Disk size**     | You can choose disk size based on your requirements. The default size is **60**.                                                                                                                                                                                                                                                                                                                                                     |

    #### Worker Node Pool

    The following table describes how to configure a worker node pool.

    | **Parameter**                   | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Node pool name**              | A descriptive name for the node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | **Enable Autoscaler**           | Whether Palette should scale the pool horizontally based on its per-node workload counts. If enabled, instead of the **Number of nodes in the pool** parameter, you will have to configure the **Minimum size** and **Maximum size** parameters, which will allow AKS to adjust the node pool size based on the workload. You can set the node count to a minimum of zero and a maximum of 1000. Setting both parameters to the same value results in a static node count.                                                                                                                                                                                                                                                  |
    | **System Node Pool**            | Sets the pool to be a system node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | **Number of nodes in the pool** | A statically defined number of nodes in the system pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    | **Additional Labels**           | Optional node labels in the key-value format. To learn more, review [Node Labels](../../cluster-management/node-labels.md). Example: `environment:production`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
    | **Taints**                      | You can apply optional taint labels to a worker node pool. Review the [Node Pool](../../cluster-management/node-pool.md) and [Taints and Tolerations](../../cluster-management/taints.md) guides to learn more.<br/><br/>Toggle the **Taint** button to create a taint label. When tainting is enabled, you need to provide a custom key-value pair. Use the **drop-down Menu** to choose one of the following **Effect** options:<br />- **NoSchedule**—Pods are not scheduled onto nodes with this taint.<br />- **PreferNoSchedule**—Kubernetes attempts to avoid scheduling pods onto nodes with this taint, but scheduling is not prohibited.<br />- **NoExecute**—Existing pods on nodes with this taint are evicted. |

    #### Worker Node Pool Cloud Configuration

    The following table describes how to configure the Azure Cloud for a worker node pool.

    | **Parameter**     | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                      |
    | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Instance Type** | Select the instance type to use for all nodes in the worker node pool. You must allocate at least 2 vCPUs and 4 GB RAM across all worker nodes.                                                                                                                                                                                                                                                                                      |
    | **OS Type**       | Select the Operating System (OS) for the worker nodes, either **Linux** or **Windows**. This option is not available for system node pools as they can only be deployed on Linux. Refer to [System and user node pools](https://learn.microsoft.com/en-us/azure/aks/use-system-pools?tabs=azure-cli#system-and-user-node-pools) in the Azure documentation for further details.                                                      |
    | **Managed disk**  | Choose a storage option. For more information, refer to Microsoft's [Storage Account Overview](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview) reference. For information about Solid State Drive (SSD) disks, refer to [Standard SSD Disks for Azure Virtual Machine Workloads](https://azure.microsoft.com/en-us/blog/preview-standard-ssd-disks-for-azure-virtual-machine-workloads/) reference. |
    | **Disk size**     | You can choose disk size based on your requirements. The default size is **60**.                                                                                                                                                                                                                                                                                                                                                     |

16. Click **Next** to continue.

17. Specify your preferred **OS Patching Schedule**.

18. Enable any scan options you want Palette to perform, and select a scan schedule. Palette provides support for
    Kubernetes configuration security, penetration testing, and conformance testing.

19. Schedule any backups you want Palette to perform. Review
    [Backup and Restore](../../cluster-management/backup-restore/backup-restore.md) for more information.

<!-- prettier-ignore-start -->

20. If you're using custom OIDC, configure the Role-Based Access Control (RBAC). You must map a set of users or groups
    to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to
    [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings). Refer to the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" />
    pack additional details for an example.

<!-- prettier-ignore-end -->

21. Click **Validate** and review the cluster configuration and settings summary.

22. Click **Finish Configuration** to deploy the cluster. Provisioning Azure AKS clusters can take several minutes.

The cluster details page contains the status and details of the deployment. Use this page to track the deployment
progress.

To learn how to remove a cluster and what to do if a force delete is necessary so you do not incur unexpected costs,
refer to [Cluster Removal](../../cluster-management/remove-clusters.md).

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu**, select **Clusters**. The **Clusters** page lists all available clusters that Palette
   manages.

4. Select the Azure AKS cluster you deployed to review its details. Ensure the **Cluster Status** field displays the
   value **Running**.

## Resources

- [Register and Manage Azure Cloud Account](azure-cloud.md)

- [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)

- [Azure Storage](../azure/architecture.md#azure-storage)

<!-- prettier-ignore-start -->

- <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> pack

<!-- prettier-ignore-end -->

- [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings)
