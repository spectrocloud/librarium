---
sidebar_label: "MAAS CAPI Override Reference"
title: "MAAS CAPI Override Reference"
description: "Discover examples and references for overriding CAPI properties on MAAS clusters."
icon: ""
hide_table_of_contents: false
tags: ["architecture", "capi", "cluster api", "advanced configuration", "maas"]
---

This page provides examples and references for overriding Cluster API (CAPI) properties on MAAS clusters using the
Cluster API Provider MAAS (CAPMAAS).

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

### Disk Erase on Machine Release

When Palette removes a node from a MAAS cluster, for example, during a repave, it releases the machine back to MAAS. The
`eraseDisksOnRelease` field of the `MaasCluster` resource controls whether Palette asks MAAS to erase the machine's
disks during the release. Set this field in a cluster-level override. The following table describes the supported
values.

| Value    | Behavior                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `none`   | Default. Palette does not request a disk erase.                                                                               |
| `full`   | MAAS overwrites each disk in full.                                                                                            |
| `quick`  | MAAS removes the disk signatures and writes zeros to the first and last 2 MiB of each disk.                                   |
| `secure` | MAAS uses the secure erase feature of each drive. If a drive does not support secure erase, MAAS overwrites the disk in full. |

```yaml title="Erase disks when Palette releases a machine"
maasCluster:
  spec:
    eraseDisksOnRelease: full
```

:::warning

MAAS erases every disk that the machine can access, including Storage Area Network (SAN) volumes that are still attached
to the node. Use `none` on clusters whose nodes attach SAN volumes.

:::

Palette applies overrides as a merge patch, so removing `eraseDisksOnRelease` from the override does not turn off disk
erase on a cluster where you already set it. To turn off disk erase, set the value to `none`.

If your MAAS region is configured to erase disks when it releases machines, MAAS erases them even when
`eraseDisksOnRelease` is `none`. Refer to the MAAS documentation for the disk erase settings of your region.

### Unsupported First-Class Properties

All first-class properties are supported. To learn more about the difference between first-class properties and override
properties, refer to the
[First-Class Support vs. Override](./override-capi-properties.md#first-class-support-vs-override) section.
