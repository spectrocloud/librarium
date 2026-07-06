---
sidebar_label: "vSphere CAPI Override Reference"
title: "vSphere CAPI Override Reference"
description: "Discover examples and references for overriding CAPI properties on vSphere clusters."
icon: ""
hide_table_of_contents: false
tags: ["architecture", "capi", "cluster api", "advanced configuration", "vsphere"]
---

This page provides examples and references for overriding Cluster API (CAPI) properties on VMware vSphere clusters
using CAPV, the Cluster API provider implementation for vSphere.

## vSphere

Cluster-level overrides target the `VSphereCluster` resource, and pool-level overrides target the
`VSphereMachineTemplate` resource.

| Level   | CAPI Kind                | API References                                                                                                                                                        |
| ------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster | `VSphereCluster`         | [v1.12.0 VSphereCluster API types](https://github.com/kubernetes-sigs/cluster-api-provider-vsphere/blob/v1.12.0/apis/v1beta1/vspherecluster_types.go)                 |
| Pool    | `VSphereMachineTemplate` | [v1.12.0 VSphereMachineTemplate API types](https://github.com/kubernetes-sigs/cluster-api-provider-vsphere/blob/v1.12.0/apis/v1beta1/vspheremachinetemplate_types.go) |

:::warning

The top-level keys for both vSphere resources are all-lowercase `vsphereCluster` and `vsphereMachineTemplate`. These
keys do not follow the camelCase-of-Kind rule that most other providers use, so watch for the casing when constructing
override YAML.

:::

### Examples

These examples demonstrate how to override CAPI properties using YAML directly targeting the underlying CAPV resources.

#### Cluster-Level

```yaml title="Disable Cluster Modules"
vsphereCluster:
  spec:
    disableClusterModule: true
```

#### Pool-Level

`VSphereMachineTemplate` has an extra level of nesting. The spec wraps a `template`, which contains another `spec` field
that holds the actual machine configuration. All pool-level vSphere overrides use this structure.

```yaml title="Set power-off mode and CPU count"
vsphereMachineTemplate:
  spec:
    template:
      spec:
        powerOffMode: hard
        numCPUs: 4
```

### Unsupported First-Class Properties

:::info

Learn more about the difference between first-class properties and override properties in the
[First-Class Support vs. Override](./override-capi-properties.md#first-class-support-vs-override) section.

:::

The following properties are not exposed as first-class properties in the
[supported interfaces for Palette](./override-capi-properties.md#supported-interfaces) but can be configured using
override.

| CAPV Resource Type       | Properties                                                                                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VSphereCluster`         | `thumbprint`, `clusterModules`, `disableClusterModule`                                                                                                                                |
| `VSphereMachineTemplate` | `snapshot`, `server`, `thumbprint`, `numCoresPerSocket`, `additionalDisksGiB`, `dataDisks`, `customVMXKeys`, `tagIDs`, `pciDevices`, `os`, `hardwareVersion`, `network.routes`, `network`, `preferredAPIServerCidr` |
