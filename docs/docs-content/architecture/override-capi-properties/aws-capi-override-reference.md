---
sidebar_label: "AWS CAPI Override Reference"
title: "AWS CAPI Override Reference"
description: "Discover examples and references for overriding CAPI properties on AWS clusters."
icon: ""
hide_table_of_contents: false
tags: ["architecture", "capi", "cluster api", "advanced configuration", "aws"]
---

This page provides examples and references for overriding Cluster API (CAPI) properties on AWS clusters.

## AWS IaaS

| Level   | CAPI Kind            | API References                                                                                                                                         |
| ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| All     | -                    | [CAPA Book - CRD Reference](https://cluster-api-aws.sigs.k8s.io/crd/) <br /> \*Use with caution as this reference guide is not semantically versioned. |
| Cluster | `AWSCluster`         | [v2.7.1 AWSCluster API types](https://github.com/kubernetes-sigs/cluster-api-provider-aws/blob/v2.7.1/api/v1beta2/awscluster_types.go)                 |
| Pool    | `AWSMachineTemplate` | [v2.7.1 AWSMachineTemplate API types](https://github.com/kubernetes-sigs/cluster-api-provider-aws/blob/v2.7.1/api/v1beta2/awsmachinetemplate_types.go) |

### Examples

These examples demonstrate how to override CAPI properties using YAML directly targeting the underlying CAPA resources.

#### Cluster-Level

```yaml title="Set cluster tags"
awsCluster:
  spec:
    additionalTags:
      environment: production
      team: backend
```

```yaml title="Enable cross-zone load balancing and disable host rewrite"
awsCluster:
  spec:
    controlPlaneLoadBalancer:
      crossZoneLoadBalancing: true
      disableHostsRewrite: true
```

#### Pool-Level

```yaml title="Set network interface type and disable uncompressed user data"
awsMachineTemplate:
  spec:
    template:
      spec:
        instanceType: m5.xlarge
        networkInterfaceType: interface
        uncompressedUserData: false
        capacityReservationPreference: None
```

```yaml title="Set root volume size and type"
awsMachineTemplate:
  spec:
    template:
      spec:
        instanceType: m5.xlarge
        rootVolume:
          size: 120
          type: gp3
```

### Unsupported First-Class Properties

:::info

Learn more about the difference between first-class properties and override properties in the
[First-Class Support vs. Override](./override-capi-properties.md#first-class-support-vs-override) section.

:::

The following properties are not exposed as first-class properties in the
[supported interfaces for Palette](./override-capi-properties.md#supported-interfaces) but can be configured using
override.

| CAPA Resource Type   | Properties                                                                                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AWSCluster`         | `partition`, `secondaryControlPlaneLoadBalancer`                                                                                                                                                                                           |
| `AWSMachineTemplate` | `placementGroupName`, `tenancy`, dedicated host fields, `networkInterfaces` (beyond single-subnet pattern), `nonRootVolumes`, cloudInit/ignition blocks, `cpuOptions` (not available in v2.7.1), `privateDnsName`, `capacityReservationId` |
