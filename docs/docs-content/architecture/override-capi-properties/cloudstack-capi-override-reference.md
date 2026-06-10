---
sidebar_label: "CloudStack CAPI Override Reference"
title: "CloudStack CAPI Override Reference"
description: "Discover examples and references for overriding CAPI properties on CloudStack clusters."
icon: ""
hide_table_of_contents: false
tags: ["architecture", "capi", "cluster api", "advanced configuration", "cloudstack"]
---

This page provides examples and references for overriding Cluster API (CAPI) properties on Apache CloudStack clusters
using the Cluster API Provider CloudStack (CAPC).

## CloudStack

Cluster-level overrides target the `CloudStackCluster` resource, and pool-level overrides target the
`CloudStackMachineTemplate` resource.

| Level   | CAPI Kind                   | API References                                                                                                                                                              |
| ------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All     | -                           | [CAPC Book](https://cluster-api-cloudstack.sigs.k8s.io/) <br /> \*Use with caution as this reference guide is not semantically versioned.                                   |
| Cluster | `CloudStackCluster`         | [v0.6.1 CloudStackCluster API types](https://github.com/kubernetes-sigs/cluster-api-provider-cloudstack/blob/v0.6.1/api/v1beta3/cloudstackcluster_types.go)                 |
| Pool    | `CloudStackMachineTemplate` | [v0.6.1 CloudStackMachineTemplate API types](https://github.com/kubernetes-sigs/cluster-api-provider-cloudstack/blob/v0.6.1/api/v1beta3/cloudstackmachinetemplate_types.go) |

### Examples

These examples demonstrate how to override CAPI properties using YAML directly targeting the underlying CAPC resources.

:::info

`CloudStackMachineTemplate` has an extra level of nesting. The spec wraps a `template`, which contains another `spec`
field that holds the actual machine configuration. All pool-level CloudStack overrides use this structure.

:::

#### Cluster-Level

```yaml title="Sync the cluster with CloudStack Kubernetes Service (CKS)"
cloudStackCluster:
  spec:
    syncWithACS: true
```

#### Pool-Level

`cloudstackMachineTemplate` has an extra level of nesting. The spec wraps a `template`, which contains another `spec`
field that holds the actual machine configuration. All pool-level CloudStack overrides use this structure.

:::warning

The pool-level top-level key is `cloudstackMachineTemplate` with a lowercase `s`, unlike the cluster-level
`cloudStackCluster` key.

:::

```yaml title="Set the SSH key and compute offering"
cloudstackMachineTemplate:
  spec:
    template:
      spec:
        sshKey: my-ssh-key
        offering:
          name: compute-offering-2
```

### Unsupported First-Class Properties

:::info

Learn more about the difference between first-class properties and override properties in the
[First-Class Support vs. Override](./override-capi-properties.md#first-class-support-vs-override) section.

:::

The following properties are not exposed as first-class properties in the
[supported interfaces for Palette](./override-capi-properties.md#supported-interfaces) but can be configured using
override.

| CAPC Resource Type          | Properties                                                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CloudStackCluster`         | None                                                                                                                                                          |
| `CloudStackMachineTemplate` | `affinity`, `cloudstackAffinityRef`, `uncompressedUserData`, `diskOffering.mountPath`, `diskOffering.device`, `diskOffering.filesystem`, `diskOffering.label` |
