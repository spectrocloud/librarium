---
sidebar_label: "AWS CAPI Override Reference"
title: "AWS CAPI Override Reference"
description: "Discover examples and references for overriding CAPI properties on AWS clusters."
icon: ""
hide_table_of_contents: false
tags: ["architecture", "capi", "cluster api", "advanced configuration", "aws"]
---

This page provides examples and references for overriding Cluster API (CAPI) properties on AWS clusters using Cluster
API Provider AWS (CAPA).

## AWS IaaS

AWS IaaS clusters use the CAPA self-managed path. Cluster-level overrides target the `AWSCluster` resource, and
pool-level overrides target the `AWSMachineTemplate` resource.

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

`AWSMachineTemplate` has an extra level of nesting. The spec wraps a `template`, which contains another `spec` field
that holds the actual machine configuration. All pool-level AWS IaaS overrides use this structure.

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

## EKS

Amazon EKS clusters use the CAPA managed-cluster path. Cluster-level overrides target the `AWSManagedControlPlane`
resource, and pool-level overrides target the `AWSManagedMachinePool` resource.

| Level   | CAPI Kind                | API References                                                                                                                                                                  |
| ------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All     | -                        | [CAPA Book - CRD Reference](https://cluster-api-aws.sigs.k8s.io/crd/) <br /> \*Use with caution as this reference guide is not semantically versioned.                          |
| Cluster | `AWSManagedControlPlane` | [v2.7.1 AWSManagedControlPlane API types](https://github.com/kubernetes-sigs/cluster-api-provider-aws/blob/v2.7.1/controlplane/eks/api/v1beta2/awsmanagedcontrolplane_types.go) |
| Pool    | `AWSManagedMachinePool`  | [v2.7.1 AWSManagedMachinePool API types](https://github.com/kubernetes-sigs/cluster-api-provider-aws/blob/v2.7.1/exp/api/v1beta2/awsmanagedmachinepool_types.go)                |

### Examples

These examples demonstrate how to override CAPI properties using YAML directly targeting the underlying CAPA managed
resources.

#### Cluster-Level

```yaml title="Set additional tags on the cluster"
awsManagedControlPlane:
  spec:
    additionalTags:
      env: "dev"
```

```yaml title="Enable control plane logging"
awsManagedControlPlane:
  spec:
    logging:
      apiServer: true
      audit: true
```

#### Pool-Level

```yaml title="Set additional tags on the node pool"
awsManagedMachinePool:
  spec:
    additionalTags:
      passthrough-pool: worker-pool-1
```

```yaml title="Set the node group update configuration"
awsManagedMachinePool:
  spec:
    updateConfig:
      maxUnavailable: 1
```

### Unsupported First-Class Properties

:::info

Learn more about the difference between first-class properties and override properties in the
[First-Class Support vs. Override](./override-capi-properties.md#first-class-support-vs-override) section.

:::

The following properties are not exposed as first-class properties in the
[supported interfaces for Palette](./override-capi-properties.md#supported-interfaces) but can be configured using
override.

| CAPA Resource Type       | Properties                                                                                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AWSManagedControlPlane` | `secondaryCidrBlock`, `partition`, `imageLookupFormat`, `imageLookupOrg`, `imageLookupBaseOS`, `tokenMethod`, `restrictPrivateSubnets`, `vpcCni.env`, `addons`                      |
| `AWSManagedMachinePool`  | `availabilityZoneSubnetType`, `amiVersion`, `labels`, `taints`, `providerIDList`, `remoteAccess.sourceSecurityGroups`, `remoteAccess.public`, `awsLaunchTemplate` (partial support) |
| `AWSFargateProfile`      | `role`                                                                                                                                                                              |
