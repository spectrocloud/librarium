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
instead of a service principal and client secret. Managed identity accounts store no secret, so there is no secret to
create, store, or rotate. Azure issues short-lived tokens to the identities attached to the machines that need them.

Managed identity cloud accounts work through a self-hosted [Private Cloud Gateway (PCG)](../../pcg/pcg.md) that runs in
your Azure subscription. You can use them to deploy both Azure IaaS and AKS clusters.

## Managed Identities

You create the following user-assigned managed identities in Azure. Palette does not create them for you.

| **Identity**             | **Required For**        | **Purpose**                                                                                   |
| ------------------------ | ----------------------- | --------------------------------------------------------------------------------------------- |
| Management identity      | All clusters            | Attached to the PCG nodes. Palette uses it to validate the cloud account and create clusters. |
| Cluster identity         | Azure IaaS clusters     | Attached to the cluster nodes. The cluster uses it to access Azure after creation.            |
| AKS service identity     | AKS clusters            | AKS uses it to manage the Azure resources of the cluster.                                     |
| Kubelet identity         | AKS clusters            | Attached to every AKS node. The cluster uses it to access Azure after creation.               |
| Pool identity (optional) | Azure IaaS worker pools | An additional identity for the workloads in a worker pool.                                    |

Use the management identity for the PCG only. Do not use it as a cluster, Kubelet, or pool identity.

## Limitations

- Managed identity cloud accounts support Azure Commercial Cloud. They do not support Azure Government Secret cloud.
  <!-- TODO(PCP-3806) Chetan Patwal: list Azure Government once its verification finishes. -->

- You cannot change the authentication method of an existing cloud account, and Palette does not move existing clusters
  to managed identities. To use managed identities, add a new cloud account.

- You cannot change the cluster identity, the AKS service identity, or the Kubelet identity after you create a cluster.

- You cannot change the pool identities or the **Exclude cluster identity** setting of a worker pool after you create
  the pool. Worker pools that you add to an existing cluster can set them.

## Set Up Managed Identity Authentication

Create the management identity, deploy a PCG in Azure that carries it, and then add the cloud account.

### Prerequisites

- Tenant admin access to Palette.

- Permissions in your Azure subscription to create user-assigned managed identities and assign Azure roles.

- A Kubernetes cluster in Azure with at least three nodes, to host the PCG. The PCG must meet the requirements in
  [Deploy a PCG to an Existing Kubernetes Cluster](../../pcg/deploy-pcg-k8s.md#prerequisites).

- If the PCG uses a proxy, `169.254.169.254` in its `NO_PROXY` list, so that the PCG can reach the
  [Azure Instance Metadata Service (IMDS)](https://learn.microsoft.com/en-us/azure/virtual-machines/instance-metadata-service).

- No component that intercepts IMDS requests on the PCG nodes, such as `aad-pod-identity`.

### Assign Roles to the Management Identity

Assign the following roles to the management identity.

| **Role**                         | **Scope**                                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Contributor**                  | The subscription, or each resource group where you create clusters. Refer to [Limit Permissions](#limit-permissions). |
| **Managed Identity Operator**    | Each cluster, Kubelet, AKS service, and pool identity that is outside the scope of the **Contributor** role.          |
| **Private DNS Zone Contributor** | Your private DNS zones. Required only for private clusters.                                                           |

To look up Microsoft Entra admin groups for AKS clusters that use
[Microsoft Entra ID integration](./enable-iam-features-aks/enable-microsoft-entra-id-aks.md), the management identity
also needs the Microsoft Graph `Group.Read.All` permission.

### Deploy the PCG and Add the Cloud Account

1. In Azure, create the management identity and assign the roles in
   [Assign Roles to the Management Identity](#assign-roles-to-the-management-identity).

2. Attach the management identity to every node of the Kubernetes cluster that hosts the PCG.

   - On AKS, set it as the Kubelet identity of the cluster, for example with
     `az aks create --assign-identity <control-plane-identity-id> --assign-kubelet-identity <management-identity-id>`.
     The control plane identity of the cluster needs the **Managed Identity Operator** role on the management identity.

   - On virtual machines or virtual machine scale sets, assign it as a user-assigned identity on each virtual machine.

   Replace `<control-plane-identity-id>` and `<management-identity-id>` with the resource IDs of the identities.

3. Deploy a self-hosted PCG to the cluster. Refer to
   [Deploy a PCG to an Existing Kubernetes Cluster](../../pcg/deploy-pcg-k8s.md). Wait until the PCG is ready.

4. Add an Azure cloud account and select **Managed identity** as the **Authentication method**. Select the PCG that you
   deployed, and enter the client ID of the management identity in **Managed identity client ID**. Refer to
   [Register and Manage Azure Cloud Accounts](./azure-cloud.md#azure-commercial-cloud).

### Validate

1. In the cloud account form, select **Validate**. Palette validates the managed identity client ID through the PCG.

2. If validation fails, check that the management identity is attached to every PCG node and that it has the roles in
   [Assign Roles to the Management Identity](#assign-roles-to-the-management-identity).

## Assign Identities to Clusters

When you deploy a cluster with a managed identity cloud account, select its identities in the cluster configuration
step. Palette lists the user-assigned managed identities that the PCG can access, and looks up their client IDs.

### Azure IaaS Clusters

| **Identity**     | **Where to Set It**                                                       | **Required** |
| ---------------- | ------------------------------------------------------------------------- | ------------ |
| Cluster identity | **Cluster identity**, in the cluster configuration                        | Yes          |
| Pool identity    | **User-assigned identities**, in the cloud configuration of a worker pool | No           |

Assign the following roles.

| **Identity** | **Role**                            | **Scope**                                                                   |
| ------------ | ----------------------------------- | --------------------------------------------------------------------------- |
| Cluster      | **Contributor**                     | The cluster resource group.                                                 |
| Cluster      | **Network Contributor**             | The VNet resource group, if it is separate from the cluster resource group. |
| Cluster      | **Managed Identity Operator**       | Itself and any pool identities that are outside its **Contributor** scope.  |
| Pool         | The roles that your workloads need. | Not applicable.                                                             |

A worker pool can also turn on **Exclude cluster identity**, so that its nodes carry only the pool identities. Taint
these pools. Refer to
[Taint Worker Pools That Exclude the Cluster Identity](#taint-worker-pools-that-exclude-the-cluster-identity).

For the procedure, refer to [Create and Manage Azure IaaS Cluster](./create-azure-cluster.md).

### Taint Worker Pools That Exclude the Cluster Identity

When you turn on **Exclude cluster identity** for a worker pool, the nodes of that pool do not carry the cluster
identity. Palette management components authenticate to Azure as the cluster identity, so they cannot get a token on
these nodes. The same applies to any add-on that uses the cluster identity. If Kubernetes schedules one of these
components on the pool, the component fails. Palette does not keep these components off the pool, so add a
[taint](../../cluster-management/taints.md) to the pool.

1. When you create the pool, add a taint in **Taints**. You cannot change **Exclude cluster identity** after you create
   the pool, so add the taint at the same time.

   | **Parameter** | **Value**                                                      |
   | ------------- | -------------------------------------------------------------- |
   | **Key**       | A key that you own, such as `example.com/no-cluster-identity`. |
   | **Value**     | `true`                                                         |
   | **Effect**    | `NoSchedule`                                                   |

   Do not use `PreferNoSchedule`. Kubernetes treats it as a preference and can still schedule pods on the pool.

2. Add a matching toleration to the workloads that must run on the pool, and a node selector or node affinity so that
   they run only there. These are typically workloads that use the pool identities.

3. Keep at least one worker pool that carries the cluster identity, with enough capacity for the Palette management
   components.

DaemonSets that tolerate every taint still run on the pool, such as the CNI, `kube-proxy`, the Azure cloud node manager,
and the CSI node plugin. These keep working on pools that exclude the cluster identity.

A `NoSchedule` taint that you add to an existing pool does not move the pods that already run on it. Use `NoExecute` to
evict them, or restart them after you add the taint.

### AKS Clusters

| **Identity**         | **Where to Set It**                                    | **Required**                                       |
| -------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| AKS service identity | **AKS service identity**, in the cluster configuration | Yes                                                |
| Kubelet identity     | **Kubelet identity**, in the cluster configuration     | Yes. It must differ from the AKS service identity. |

Assign the following roles.

| **Identity** | **Role**                         | **Scope**                                                                                               |
| ------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| AKS service  | **Managed Identity Operator**    | The Kubelet identity.                                                                                   |
| AKS service  | **Network Contributor**          | The AKS subnet or its VNet, and any route table or network security group attached to that subnet.      |
| AKS service  | **Network Contributor**          | Any other resource group that contains public IP addresses or subnets for your `LoadBalancer` services. |
| AKS service  | **Private DNS Zone Contributor** | Your custom private DNS zone. Required only for private clusters.                                       |
| Kubelet      | **Contributor**                  | The cluster resource group.                                                                             |
| Kubelet      | **Network Contributor**          | The VNet resource group, if it is separate from the cluster resource group.                             |

AKS grants the AKS service identity the **Contributor** role on the node resource group, but on nothing outside it. The
AKS service identity needs the **Network Contributor** role on the AKS subnet even when the VNet is in the cluster
resource group. Assign all roles before you create the cluster, because role assignments can take up to 60 minutes to
take effect.

For the procedure, refer to [Create and Manage Azure AKS Cluster](./aks.md).

### Configure Identities With the Palette API

To create clusters with the [Palette API](/api/introduction), set the identities by resource ID under
`spec.cloudConfig.managedIdentity`. The following example sets the cluster identity of an Azure IaaS cluster in a
`POST /v1/spectroclusters/azure` request.

```json
"managedIdentity": {
  "clusterIdentity": {
    "resourceId": "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>"
  }
}
```

For AKS clusters, a `POST /v1/spectroclusters/aks` request sets `aksServiceIdentity` and `kubeletIdentity` instead.

```json
"managedIdentity": {
  "aksServiceIdentity": { "resourceId": "<aks-service-identity-resource-id>" },
  "kubeletIdentity": { "resourceId": "<kubelet-identity-resource-id>" }
}
```

Replace the placeholders with the resource IDs of your identities. Pool identities, `excludeClusterIdentity`, and pool
taints go in the `cloudConfig` and `poolConfig` of each entry in `spec.machinepoolconfig`.

## Limit Permissions

Assigning the **Contributor** role on the whole subscription is the quickest setup. To give the identities less access,
use the following approach.

1. Create the resource group of each cluster in advance, and assign the management identity the **Contributor** role on
   that resource group. The **Contributor** role on a resource group cannot create new resource groups. If the VNet is
   in a different resource group, also assign the management identity the **Network Contributor** role there.

2. Assign the cluster identity or the Kubelet identity the **Contributor** role on that resource group only. If the VNet
   is shared, also assign the **Network Contributor** role on the VNet resource group. For AKS clusters, also assign the
   AKS service identity the **Network Contributor** role on the AKS subnet.

3. Keep the identities in the same resource group, or assign the **Managed Identity Operator** role on them where they
   are.

4. To browse resource groups, networks, and virtual machine sizes outside those resource groups in Palette, assign the
   **Reader** role on the subscription.

5. For stronger isolation, use one cluster identity per resource group. A shared identity is simpler, but it can reach
   every resource group where it has a role.

## Change the Management Identity

You can change the management identity of a cloud account. Attach the new identity to every PCG node and assign it the
roles in [Assign Roles to the Management Identity](#assign-roles-to-the-management-identity). Then edit the cloud
account in **Tenant Settings** > **Cloud Accounts**, and enter the client ID of the new identity in **Managed identity
client ID**. You cannot change the **Authentication method** or the **Private Cloud Gateway** of an existing cloud
account.
