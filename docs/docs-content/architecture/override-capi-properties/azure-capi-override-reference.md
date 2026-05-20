---
sidebar_label: "Azure CAPI Override Reference"
title: "Azure CAPI Override Reference"
description: "Discover examples and references for overriding CAPI properties on Azure clusters."
icon: ""
hide_table_of_contents: false
tags: ["architecture", "capi", "cluster api", "advanced configuration", "azure"]
---

This page provides examples and references for overriding Cluster API (CAPI) properties on Azure clusters.

## Azure AKS

| Level   | CAPI Kind                  | API References                                                                                                                                                         |
| ------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All     | -                          | [CAPZ Book - API Reference](https://capz.sigs.k8s.io/reference/reference) <br /> \*Use with caution as this reference guide is not semantically versioned.             |
| Cluster | `AzureManagedControlPlane` | [v1.18.0 AzureManagedControlPlane API types](https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/v1.18.0/api/v1beta1/azuremanagedcontrolplane_types.go) |
| Pool    | `AzureManagedMachinePool`  | [v1.18.0 AzureManagedMachinePool API types](https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/v1.18.0/api/v1beta1/azuremanagedmachinepool_types.go)   |

### Examples

These examples demonstrate how to override CAPI properties using YAML directly targeting the underlying CAPZ resources.

#### Cluster-Level

```yaml title="Set auto-upgrade channel, enable OIDC issuer, and enable workload identity"
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

```yaml title="Set Max Pods, Kubelet disk type, and disable public IPs"
azureManagedMachinePool:
  spec:
    maxPods: 30
    kubeletDiskType: OS
    enableNodePublicIP: false
```

```yaml title="Set VM size, OS disk size, and node labels"
azureManagedMachinePool:
  spec:
    vmSize: Standard_D8s_v5
    osDiskSizeGB: 256
    nodeLabels:
      env: test
      updated: "true"
```

### Known Immutable Fields

The following fields become immutable after an AKS cluster is created. Attempting to disable them via override after
they have been enabled will result in an error. You must revert the override change to clear the error and allow the
cluster to reconcile.

| Field               | CAPI Kind                  | Notes                            |
| ------------------- | -------------------------- | -------------------------------- |
| `aadProfile`        | `AzureManagedControlPlane` | Cannot be disabled once enabled. |
| `oidcIssuerProfile` | `AzureManagedControlPlane` | Cannot be disabled once enabled. |

### Unsupported First-Class Properties

:::info

Learn more about the difference between first-class properties and override properties in the
[First-Class Support vs. Override](./override-capi-properties.md#first-class-support-vs-override) section.

:::

The following properties have not been exposed as first-class properties in the
[supported interfaces for Palette](./override-capi-properties.md#supported-interfaces) but can be configured using
override.

| CAPZ Resource Type         | Properties                                                                                                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AzureManagedControlPlane` | `controlPlaneEndpoint`, `fleetsMember`, `fqdnSubdomain`, `securityProfile` (partial support)                                                                                        |
| `AzureManagedMachinePool`  | `additionalTags`, `name`, `nodeLabels`, `taints`, `osDiskType`, `enableUltraSSD`, `enableNodePublicIP`, `nodePublicIPPrefixID`, `scaleSetPriority`, `scaleDownMode`, `spotMaxPrice` |
