---
sidebar_label: "Azure CAPI Override Reference"
title: "Azure CAPI Override Reference"
description: "Discover examples and references for overriding CAPI properties on Azure clusters."
icon: ""
hide_table_of_contents: false
tags: ["architecture", "capi", "cluster api", "advanced configuration", "azure"]
---

This page provides examples and references for overriding Cluster API (CAPI) properties on Azure clusters using Cluster
API Provider Azure (CAPZ).

## Azure AKS

| Level   | CAPI Kind                  | API References                                                                                                                                                         |
| ------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All     | -                          | [CAPZ Book - API Reference](https://capz.sigs.k8s.io/reference/reference) <br /> \*Use with caution as this reference guide is not semantically versioned.             |
| Cluster | `AzureManagedControlPlane` | [v1.18.0 AzureManagedControlPlane API types](https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/v1.18.0/api/v1beta1/azuremanagedcontrolplane_types.go) |
| Pool    | `AzureManagedMachinePool`  | [v1.18.0 AzureManagedMachinePool API types](https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/v1.18.0/api/v1beta1/azuremanagedmachinepool_types.go)   |

### Examples

These examples demonstrate how to override CAPI properties using YAML directly targeting the underlying CAPZ resources.

#### Cluster-Level

```yaml title="Enable OpenID Connect (OIDC) issuer and workload identity"
azureManagedControlPlane:
  spec:
    autoUpgradeProfile:
      upgradeChannel: patch
    oidcIssuerProfile:
      enabled: true
    securityProfile:
      workloadIdentity:
        enabled: true
```

```yaml title="Set DNS prefix for control plane FQDN"
azureManagedControlPlane:
  spec:
    dnsPrefix: aksdemo-updated
```

#### Pool-Level

```yaml title="Set max pods, OS disk type, and disable node public IPs"
azureManagedMachinePool:
  spec:
    maxPods: 30
    kubeletDiskType: OS
    enableNodePublicIP: false
```

```yaml title="Set VM size, OS disk size, and node labels"
azureManagedMachinePool:
  spec:
    sku: Standard_D8s_v5
    osDiskSizeGB: 256
    nodeLabels:
      env: test
      updated: "true"
```

```yaml title="Set the node pool OS SKU to Azure Linux"
azureManagedMachinePool:
  spec:
    asoManagedClustersAgentPoolPatches:
      - '{"spec":{"osSKU":"AzureLinux"}}' # Other values include Ubuntu and Windows2022
```

:::info

The OS SKU is also exposed as a first-class **OS SKU** field on the node pool configuration in Palette, which is the
recommended way to set it. Refer to [Create and Manage Azure AKS Cluster](../../clusters/public-cloud/azure/aks.md) for
details.

The OS SKU is immutable after the node pool is created, overriding it on an existing node pool has no effect.

:::

### Encryption

#### Host Encryption

Host encryption encrypts the OS and temporary disks on the underlying VM host using platform-managed keys. You can
configure it at the pool level using the `enableEncryptionAtHost` field on `AzureManagedMachinePool`.

:::warning

`enableEncryptionAtHost` is immutable and must be set when the node pool is first created. It cannot be enabled or
disabled on an existing pool.

:::

```yaml title="Enable host encryption on a node pool"
azureManagedMachinePool:
  spec:
    enableEncryptionAtHost: true
```

#### Disk Encryption Sets

CAPZ v1.18.0 does not expose a first-class
[Disk Encryption Set (DES)](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption) field for AKS node
pools. The supported workaround is to use the `asoManagedClusterPatches` field on `AzureManagedControlPlane`, which
applies a JSON merge patch directly to the underlying Azure Service Operator (ASO) `ManagedCluster` resource.

:::warning

The `asoManagedClusterPatches` field is intended for advanced use only. To avoid misconfiguration that conflicts with
CAPZ's normal operation, test changes in a non-production environment before applying them to a production cluster.

:::

```yaml title="Enable disk encryption set at the cluster level"
azureManagedControlPlane:
  spec:
    asoManagedClusterPatches:
      - '{"spec": {"diskEncryptionSetReference":
        "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Compute/diskEncryptionSets/<disk-encryption-set-name>"}}'
```

### Known Immutable Fields

The following fields become immutable after an AKS cluster is created. Attempting to disable them via override after
they have been enabled results in an error. You must revert the override change to clear the error and allow the cluster
to reconcile.

| Field                    | CAPI Kind                  | Notes                                                            |
| ------------------------ | -------------------------- | ---------------------------------------------------------------- |
| `aadProfile`             | `AzureManagedControlPlane` | Cannot be disabled once enabled.                                 |
| `oidcIssuerProfile`      | `AzureManagedControlPlane` | Cannot be disabled once enabled.                                 |
| `enableEncryptionAtHost` | `AzureManagedMachinePool`  | Must be set at node pool creation. Cannot be changed afterwards. |

### Unsupported First-Class Properties

:::info

Learn more about the difference between first-class properties and override properties in the
[First-Class Support vs. Override](./override-capi-properties.md#first-class-support-vs-override) section.

:::

The following properties are not exposed as first-class properties in the
[supported interfaces for Palette](./override-capi-properties.md#supported-interfaces) but can be configured using
override.

| CAPZ Resource Type         | Properties                                                                                                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AzureManagedControlPlane` | `controlPlaneEndpoint`, `fleetsMember`, `fqdnSubdomain`, `securityProfile` (partial support)                                                                                        |
| `AzureManagedMachinePool`  | `additionalTags`, `name`, `nodeLabels`, `taints`, `osDiskType`, `enableUltraSSD`, `enableNodePublicIP`, `nodePublicIPPrefixID`, `scaleSetPriority`, `scaleDownMode`, `spotMaxPrice` |
