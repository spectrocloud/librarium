---
sidebar_label: "GCP CAPI Override Reference"
title: "GCP CAPI Override Reference"
description: "Discover examples and references for overriding CAPI properties on GCP clusters."
icon: ""
hide_table_of_contents: false
tags: ["architecture", "capi", "cluster api", "advanced configuration", "gcp", "gke"]
---

This page provides examples and references for overriding Cluster API (CAPI) properties on GCP clusters using Cluster
API Provider GCP (CAPG).

## GCP IaaS

GCP IaaS clusters use the CAPG self-managed path. Cluster-level overrides target the `GCPCluster` resource, and
pool-level overrides target the `GCPMachineTemplate` resource.

| Level   | CAPI Kind            | API References                                                                                                                                         |
| ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| All     | -                    | [CAPG Book](https://cluster-api-gcp.sigs.k8s.io/introduction) <br /> \*Use with caution as this reference guide is not semantically versioned.         |
| Cluster | `GCPCluster`         | [v1.8.1 GCPCluster API types](https://github.com/kubernetes-sigs/cluster-api-provider-gcp/blob/v1.8.1/api/v1beta1/gcpcluster_types.go)                 |
| Pool    | `GCPMachineTemplate` | [v1.8.1 GCPMachineTemplate API types](https://github.com/kubernetes-sigs/cluster-api-provider-gcp/blob/v1.8.1/api/v1beta1/gcpmachinetemplate_types.go) |

### Examples

These examples demonstrate how to override CAPI properties using YAML directly targeting the underlying CAPG resources.

#### Cluster-Level

```yaml title="Set additional cluster labels"
gcpCluster:
  spec:
    additionalLabels:
      environment: dev
      team: platform
```

#### Pool-Level

`GCPMachineTemplate` has an extra level of nesting. The spec wraps a `template`, which contains another `spec` field
that holds the actual machine configuration. All pool-level GCP IaaS overrides use this structure.

```yaml title="Set additional network tags, shielded instance options, and instance metadata"
gcpMachineTemplate:
  spec:
    template:
      spec:
        additionalNetworkTags:
          - allow-cp-ingress
          - palette-control-plane
        shieldedInstanceConfig:
          secureBoot: Disabled
          virtualizedTrustedPlatformModule: Enabled
          integrityMonitoring: Enabled
        additionalMetadata:
          - key: serial-port-enable
            value: "false"
          - key: shutdown-script
            value: "echo 'shutting down'"
```

### Unsupported First-Class Properties

The following properties are not exposed as first-class properties in the
[supported interfaces for Palette](./override-capi-properties.md#supported-interfaces) but can be configured using
override. To learn more about the difference between first-class properties and override properties, refer to the
[First-Class Support vs. Override](./override-capi-properties.md#first-class-support-vs-override) section.

| CAPG Resource Type   | Properties                                                                                                                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GCPCluster`         | `controlPlaneEndpoint`, `loadBalancer`, `network.hostProject`, `network.loadBalancerBackendPort`, `network.mtu`, `resourceManagerTags`                                                                                                                                                                             |
| `GCPMachineTemplate` | `additionalDisks`, `additionalLabels`, `additionalMetadata`, `additionalNetworkTags`, `confidentialCompute`, `imageFamily`, `ipForwarding`, `onHostMaintenance`, `preemptible`, `provisioningModel`, `resourceManagerTags`, `rootDeviceType`, `rootDiskEncryptionKey`, `serviceAccounts`, `shieldedInstanceConfig` |

## GKE

GKE clusters use the CAPG managed-cluster path. Cluster-level overrides target `GCPManagedControlPlane` (and, if needed,
`GCPManagedCluster`), and pool-level overrides target `GCPManagedMachinePool`.

| Level   | CAPI Kind                | API References                                                                                                                                                     |
| ------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| All     | -                        | [CAPG Book](https://cluster-api-gcp.sigs.k8s.io/introduction) <br /> \*Use with caution as this reference guide is not semantically versioned.                     |
| Cluster | `GCPManagedControlPlane` | [v1.8.1 GCPManagedControlPlane API types](https://github.com/kubernetes-sigs/cluster-api-provider-gcp/blob/v1.8.1/exp/api/v1beta1/gcpmanagedcontrolplane_types.go) |
| Cluster | `GCPManagedCluster`      | [v1.8.1 GCPManagedCluster API types](https://github.com/kubernetes-sigs/cluster-api-provider-gcp/blob/v1.8.1/exp/api/v1beta1/gcpmanagedcluster_types.go)           |
| Pool    | `GCPManagedMachinePool`  | [v1.8.1 GCPManagedMachinePool API types](https://github.com/kubernetes-sigs/cluster-api-provider-gcp/blob/v1.8.1/exp/api/v1beta1/gcpmanagedmachinepool_types.go)   |

:::info

Cluster-level overrides on GKE can target either `gcpManagedControlPlane` or `gcpManagedCluster`. Most control plane and
cluster-wide settings live on `GCPManagedControlPlane`. Only supply `gcpManagedCluster` overrides when the field you
want to change is defined on the `GCPManagedCluster` resource.

:::

### Examples

These examples demonstrate how to override CAPI properties using YAML directly targeting the underlying CAPG managed
resources.

#### Cluster-Level

```yaml title="Set release channel, description, and authorized networks"
gcpManagedControlPlane:
  spec:
    releaseChannel: regular
    description: "gke cluster"
    master_authorized_networks_config:
      gcp_public_cidrs_access_enabled: true
```

#### Pool-Level

Managed node pools on GKE do not use the extra `template` nesting. Pool-level overrides map directly under
`gcpManagedMachinePool.spec`.

```yaml title="Set node pool management, node locations, labels, and disk type"
gcpManagedMachinePool:
  spec:
    management:
      autoRepair: true
      autoUpgrade: false
    nodeLocations:
      - us-east1-b
      - us-east1-c
    additionalLabels:
      environment: dev
      team: platform
    maxPodsPerNode: 64
    diskType: pd-ssd
```

### Unsupported First-Class Properties

The following properties are not exposed as first-class properties in the
[supported interfaces for Palette](./override-capi-properties.md#supported-interfaces) but can be configured using
override. To learn more about the difference between first-class properties and override properties, refer to the
[First-Class Support vs. Override](./override-capi-properties.md#first-class-support-vs-override) section.

| CAPG Resource Type       | Properties                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| `GCPManagedControlPlane` | `clusterNetwork`, `description`, `endpoint`, `master_authorized_networks_config`, `releaseChannel` |
