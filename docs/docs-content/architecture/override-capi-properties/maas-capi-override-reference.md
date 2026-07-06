---
sidebar_label: "MAAS CAPI Override Reference"
title: "MAAS CAPI Override Reference"
description: "Discover examples and references for overriding CAPI properties on MAAS clusters."
icon: ""
hide_table_of_contents: false
tags: ["architecture", "capi", "cluster api", "advanced configuration", "maas"]
---

This page provides examples and references for overriding Cluster API (CAPI) properties on Metal as a Service (MAAS)
clusters using the Cluster API Provider MAAS (CAPMAAS).

:::info

Overriding CAPI properties is not supported on
[MAAS HyperShift host clusters](../../clusters/data-center/maas/create-manage-maas-openshift-clusters-hypershift/create-hypershift-host-cluster.md)
or
[HyperShift-hosted OpenShift workload clusters](../../clusters/data-center/maas/create-manage-maas-openshift-clusters-hypershift/create-openshift-workload-cluster.md).
The override toggles in the Palette UI have no effect on these cluster types.

:::

## MAAS

Cluster-level overrides target the `MaasCluster` resource, and pool-level overrides target the `MaasMachineTemplate`
resource.

| Level   | CAPI Kind             | API References                                                                                                                                         |
| ------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cluster | `MaasCluster`         | [v0.6.1 MaasCluster API types](https://github.com/spectrocloud/cluster-api-provider-maas/blob/v0.6.1/api/v1beta1/maascluster_types.go)                 |
| Pool    | `MaasMachineTemplate` | [v0.6.1 MaasMachineTemplate API types](https://github.com/spectrocloud/cluster-api-provider-maas/blob/v0.6.1/api/v1beta1/maasmachinetemplate_types.go) |

### Examples

These examples demonstrate how to override CAPI properties using YAML directly targeting the underlying CAPMAAS
resources.

#### Cluster-Level

```yaml title="Set the LXD network bridge for a passthrough deployment"
maasCluster:
  spec:
    lxdConfig:
      networkBridge: passthrough-dev
```

#### Pool-Level

`MaasMachineTemplate` has an extra level of nesting. The spec wraps a `template`, which contains another `spec` field
that holds the actual machine configuration. All pool-level MAAS overrides use this structure.

```yaml title="Select machines by MAAS tag"
maasMachineTemplate:
  spec:
    template:
      spec:
        tags:
          - pcp
```

### Unsupported First-Class Properties

:::info

Learn more about the difference between first-class properties and override properties in the
[First-Class Support vs. Override](./override-capi-properties.md#first-class-support-vs-override) section.

:::

The following properties are not exposed as first-class properties in the
[supported interfaces for Palette](./override-capi-properties.md#supported-interfaces) but can be configured using
override.

| CAPMAAS Resource Type | Properties |
| --------------------- | ---------- |
| `MaasCluster`         | None       |
| `MaasMachineTemplate` | None       |
