---
sidebar_label: "Use Azure Managed Identities"
title: "Use Azure Managed Identities"
description:
  "Authenticate Palette to Azure with user-assigned managed identities instead of a service principal client secret."
hide_table_of_contents: false
tags: ["public cloud", "azure", "security"]
toc_max_heading_level: 3
sidebar_position: 15
---

You can authenticate an Azure cloud account in Palette with a
[user-assigned managed identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview)
instead of a service principal and client secret. Managed identity cloud accounts have no secret to create, store, or
rotate. Azure issues short-lived tokens to the identities attached to the machines that need them.

Managed identity cloud accounts work through a self-hosted [Private Cloud Gateway (PCG)](../../pcg/pcg.md) that runs in
your Azure subscription. You can use them to deploy both Azure IaaS and AKS clusters.

## Managed Identities

You create the following user-assigned managed identities in Azure. Palette does not create them for you.

| **Identity**             | **Used By**             | **Purpose**                                                                                   |
| ------------------------ | ----------------------- | --------------------------------------------------------------------------------------------- |
| Management identity      | All clusters            | Attached to the PCG nodes. Palette uses it to validate the cloud account and create clusters. |
| Cluster identity         | Azure IaaS clusters     | Attached to the cluster nodes. The cluster uses it to access Azure after creation.            |
| AKS service identity     | AKS clusters            | AKS uses it to manage the Azure resources of the cluster.                                     |
| Kubelet identity         | AKS clusters            | Attached to every AKS node. The cluster uses it to access Azure after creation.               |
| Pool identity (optional) | Azure IaaS worker pools | An additional identity for the workloads in a worker pool.                                    |

Use the management identity only on the nodes that host the PCG. Do not select it as the cluster, AKS service, Kubelet,
or pool identity of a cluster that Palette deploys.

## Limitations

- Managed identity cloud accounts support Azure Commercial cloud in Palette and Palette VerteX, and
  [Azure Government cloud](./azure-cloud.md#azure-government-cloud) in Palette VerteX. They do not support Azure
  Government Secret cloud.

- You cannot change the authentication method or the PCG of an existing cloud account, and Palette does not move
  existing clusters to managed identities. To use managed identities, add a new cloud account.

- You cannot change the cluster identity, the AKS service identity, or the Kubelet identity after you create a cluster.

- You cannot change the pool identities or the **Exclude cluster identity** setting of a worker pool after you create
  the pool. You can set them on new worker pools that you add to an existing cluster.

## Set Up Managed Identity Authentication

Create the management identity, attach it to the nodes of a Kubernetes cluster in Azure, deploy a PCG to that cluster,
and then add the cloud account. You can also add managed identity cloud accounts with the
[Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs).

### Prerequisites

- Tenant admin access to Palette or Palette VerteX.

- Permissions in your Azure subscription to create user-assigned managed identities and assign Azure roles.

- A Kubernetes cluster in Azure with at least three nodes to host the PCG, or permissions to create one. The cluster
  must meet the requirements in
  [Deploy a PCG to an Existing Kubernetes Cluster](../../pcg/deploy-pcg-k8s.md#prerequisites).

- If the PCG uses a proxy, `169.254.169.254` added to its `NO_PROXY` list, so that the PCG can reach the
  [Azure Instance Metadata Service (IMDS)](https://learn.microsoft.com/en-us/azure/virtual-machines/instance-metadata-service).

- No component on the PCG nodes that intercepts IMDS requests, such as `aad-pod-identity`.

### Assign Roles to the Management Identity

Assign the following roles to the management identity.

| **Role**                         | **Scope**                                                                                                                                                                     |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Contributor**                  | The subscription, or each resource group where you create clusters. Refer to [Limit Permissions](#limit-permissions).                                                         |
| **Reader**                       | The subscription. Required for AKS clusters. It also lets you browse resource groups, networks, and virtual machine sizes in Palette. Refer to [AKS Clusters](#aks-clusters). |
| **Managed Identity Operator**    | Each cluster, Kubelet, AKS service, and pool identity that is outside the scope of the **Contributor** role.                                                                  |
| **Network Contributor**          | The VNet resource group, if it is outside the scope of the **Contributor** role.                                                                                              |
| **Private DNS Zone Contributor** | Your private DNS zones. Required only for private clusters.                                                                                                                   |

To look up Microsoft Entra admin groups for AKS clusters that use
[Microsoft Entra ID integration](./enable-iam-features-aks/enable-microsoft-entra-id-aks.md), the management identity
also needs the Microsoft Graph `Group.Read.All` permission.

### Deploy the PCG and Add the Cloud Account

1. In Azure, create the management identity and assign the roles in
   [Assign Roles to the Management Identity](#assign-roles-to-the-management-identity).

2. Attach the management identity to every node of the Kubernetes cluster that hosts the PCG.

   - On AKS, set it as the Kubelet identity when you create the cluster. The control plane identity of the cluster needs
     the **Managed Identity Operator** role on the management identity. For example, use the following command.

     ```shell
     az aks create --resource-group <resource-group> --name <cluster-name> \
       --assign-identity <control-plane-identity-id> --assign-kubelet-identity <management-identity-id>
     ```

     Replace `<resource-group>` and `<cluster-name>` with the resource group and name of the AKS cluster, and
     `<control-plane-identity-id>` and `<management-identity-id>` with the resource IDs of the identities.

   - On virtual machines or virtual machine scale sets, assign it as a user-assigned identity on each virtual machine or
     scale set.

3. Deploy a self-hosted PCG to the cluster. Refer to
   [Deploy a PCG to an Existing Kubernetes Cluster](../../pcg/deploy-pcg-k8s.md). Wait until the **Cluster Status** of
   the PCG is **Running**.

4. Add an Azure cloud account, and select **Managed identity** as the **Authentication method**. Refer to
   [Azure Commercial Cloud](./azure-cloud.md#azure-commercial-cloud) or
   [Azure Government Cloud](./azure-cloud.md#azure-government-cloud).

5. In **Private Cloud Gateway**, select the PCG that you deployed. In **Managed identity client ID**, enter the client
   ID of the management identity.

6. Select **Validate**. When the message **Credentials validated** is displayed, select **Confirm**.

   If validation fails, check that the management identity is attached to every PCG node and that it has the roles in
   [Assign Roles to the Management Identity](#assign-roles-to-the-management-identity).

### Validate

1. Log in to [Palette](https://console.spectrocloud.com) or Palette VerteX as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Cloud Accounts**.

4. Confirm that the new cloud account is listed in the **Azure** section.

## Assign Identities to Clusters

When you deploy a cluster with a managed identity cloud account, select its identities in the cluster configuration
step. Palette lists the user-assigned managed identities that the PCG can access.

### Azure IaaS Clusters

| **Identity**     | **Where to Set It**                                                       | **Required** |
| ---------------- | ------------------------------------------------------------------------- | ------------ |
| Cluster identity | **Cluster identity**, in the cluster configuration                        | Yes          |
| Pool identity    | **User-assigned identities**, in the cloud configuration of a worker pool | No           |

Assign the following roles.

| **Identity** | **Role**                            | **Scope**                                                                                     |
| ------------ | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| Cluster      | **Contributor**                     | The cluster resource group.                                                                   |
| Cluster      | **Network Contributor**             | The Virtual Network (VNet) resource group, if it is separate from the cluster resource group. |
| Cluster      | **Managed Identity Operator**       | Itself and any pool identities that are outside its **Contributor** scope.                    |
| Pool         | The roles that your workloads need. | The resources that your workloads access.                                                     |

You can also turn on **Exclude cluster identity** for a worker pool so that its nodes have only the pool identities
attached. If you do, taint the pool. Refer to
[Taint Worker Pools That Exclude the Cluster Identity](#taint-worker-pools-that-exclude-the-cluster-identity).

For the procedure, refer to [Create and Manage Azure IaaS Cluster](./create-azure-cluster.md).

### Taint Worker Pools That Exclude the Cluster Identity

When you turn on **Exclude cluster identity** for a worker pool, the nodes of that pool do not have the cluster identity
attached. Palette management components authenticate to Azure as the cluster identity, so they cannot get a token on
these nodes. The same applies to any add-on that uses the cluster identity. If Kubernetes schedules one of these
components on the pool, the component fails. Palette does not keep these components off the pool, so add a
[taint](../../cluster-management/taints.md) to the pool.

1. When you create the pool, select **Add New Taint** and enter the following values.

   | **Parameter** | **Value**                                                      |
   | ------------- | -------------------------------------------------------------- |
   | **Key**       | A key that you own, such as `example.com/no-cluster-identity`. |
   | **Value**     | `true`                                                         |
   | **Effect**    | `NoSchedule`                                                   |

   Do not use `PreferNoSchedule`. Kubernetes treats it as a preference and can still schedule pods on the pool.

   If the pool already exists, add the taint to it. `NoSchedule` does not evict pods that already run on the pool, so
   use `NoExecute`, or restart those pods after you add the taint.

2. Add a toleration that matches the taint to the workloads that must run on the pool, typically the workloads that use
   the pool identities. To keep them on the pool, also add a node selector or node affinity.

3. Keep at least one worker pool whose nodes have the cluster identity attached, with enough capacity for the Palette
   management components.

Some DaemonSets tolerate every taint, so they still run on the pool and keep working without the cluster identity. These
include the Container Network Interface (CNI) plugin, `kube-proxy`, the Azure cloud node manager, and the Container
Storage Interface (CSI) node plugin.

### AKS Clusters

| **Identity**         | **Where to Set It**                                    | **Required**                                       |
| -------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| AKS service identity | **AKS service identity**, in the cluster configuration | Yes                                                |
| Kubelet identity     | **Kubelet identity**, in the cluster configuration     | Yes. It must differ from the AKS service identity. |

Assign the following roles before you create the cluster, because a role assignment can take up to 60 minutes to become
active.

| **Identity** | **Role**                         | **Scope**                                                                                               |
| ------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| AKS service  | **Managed Identity Operator**    | The Kubelet identity.                                                                                   |
| AKS service  | **Network Contributor**          | The AKS subnet or its VNet, and any route table or network security group attached to that subnet.      |
| AKS service  | **Network Contributor**          | Any other resource group that contains public IP addresses or subnets for your `LoadBalancer` services. |
| AKS service  | **Private DNS Zone Contributor** | Your custom private DNS zone. Required only for private clusters.                                       |
| Kubelet      | **Contributor**                  | The cluster resource group.                                                                             |
| Kubelet      | **Network Contributor**          | The VNet resource group, if it is separate from the cluster resource group.                             |
| Kubelet      | **Reader**                       | The subscription.                                                                                       |

AKS creates the node pools in a separate node resource group when it creates the cluster, so you cannot assign roles on
that resource group in advance. Palette reads the node pools in this resource group, so the management identity and the
Kubelet identity both need the **Reader** role on the subscription. Without it, the cluster stays at
`worker nodes are creating`.

The AKS service identity needs the **Network Contributor** role on the AKS subnet even when the VNet is in the cluster
resource group.

For the procedure, refer to [Create and Manage Azure AKS Cluster](./aks.md).

## Limit Permissions

Assigning the **Contributor** role on the whole subscription is the quickest setup. To give the identities less access,
use the following approach.

1. Create the resource group of each cluster in advance, and assign the management identity the **Contributor** role on
   that resource group. The **Contributor** role on a resource group cannot create new resource groups. If the VNet is
   in a different resource group, also assign the management identity the **Network Contributor** role there.

2. Create the identities in the cluster resource group. Assign the cluster identity or the Kubelet identity the
   **Contributor** role on that resource group only. If the VNet is in a different resource group, also assign the
   **Network Contributor** role on the VNet resource group. For AKS clusters, also assign the AKS service identity the
   **Network Contributor** role on the AKS subnet.

3. If an identity is outside the cluster resource group, assign the management identity the **Managed Identity
   Operator** role on it. Also assign the role to the cluster identity for Azure IaaS clusters, or to the AKS service
   identity for AKS clusters. Refer to
   [Assign Roles to the Management Identity](#assign-roles-to-the-management-identity) and
   [Assign Identities to Clusters](#assign-identities-to-clusters).

4. For AKS clusters, assign the management identity and the Kubelet identity the **Reader** role on the subscription.
   Refer to [AKS Clusters](#aks-clusters). For Azure IaaS clusters, the role is optional. It lets you browse resource
   groups, networks, and virtual machine sizes outside your resource groups in Palette.

5. _(Optional)_ For stronger isolation, use one cluster identity per resource group. A shared identity is simpler, but
   it can reach every resource group where it has a role.

## Change the Management Identity

You can change the management identity of a cloud account.

1. Attach the new identity to every PCG node, and assign it the roles in
   [Assign Roles to the Management Identity](#assign-roles-to-the-management-identity).

2. Log in to [Palette](https://console.spectrocloud.com) or Palette VerteX as a tenant admin.

3. From the left main menu, select **Tenant Settings**.

4. From the **Tenant Settings Menu**, select **Cloud Accounts**.

5. In the **Azure** section, select the three-dot menu next to the cloud account, and then select **Edit**.

6. In **Managed identity client ID**, enter the client ID of the new identity. You cannot change the authentication
   method or the PCG.

7. Select **Validate**. When the message **Credentials validated** is displayed, select **Confirm**.
