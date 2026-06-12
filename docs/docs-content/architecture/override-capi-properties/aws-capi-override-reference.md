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

### Node Pool Launch Template

You can customize the launch template of an EKS managed node group by overriding the `awsLaunchTemplate` field of the
`AWSManagedMachinePool` resource. This lets you set properties such as a custom AMI, instance type, and additional
volumes.

:::warning

Before you override `awsLaunchTemplate`, you must
[Enable Nodepool Customization](../../clusters/public-cloud/aws/eks.md#cloud-configuration-settings). This option
directs Palette to provision the node group with a custom, user-managed launch template. Without it, the node group uses
a launch template that CAPA manages, and launch template fields are rejected.

You can enable this option when you create the cluster (Day-0) or on an active cluster (Day-2). You do not need to
supply any values for the optional fields that appear when you click the **Enable Nodepool Customization** toggle.

:::

When you reference a custom AMI through `awsLaunchTemplate.ami.id`, also set the pool's `amiType` to `CUSTOM`. AWS
requires the node group AMI type to be `CUSTOM` whenever the launch template specifies an explicit image ID.

```yaml title="Set a custom AMI, instance type, and data volume"
awsManagedMachinePool:
  spec:
    amiType: CUSTOM
    awsLaunchTemplate:
      ami:
        id: ami-00b365be53e09d355
      instanceType: m5.2xlarge
      nonRootVolumes:
        - deviceName: /dev/sdf
          size: 80
          type: gp3
```

If you override `awsLaunchTemplate` while node pool customization is disabled, the override is rejected and a cluster
event similar to the following appears.

```shell hideClipboard title="Example cluster event when node pool customization is disabled"
instanceType cannot be specified with a CAPA-managed launch template
```

### Node Pool AWS Tags

You can apply AWS custom tags at the node pool level on EKS clusters by overriding the `additionalTags` field of the
`AWSManagedMachinePool` resource. This is useful for cost allocation, ownership, and automation tags that need to differ
per node pool, such as a per-customer or per-team tag on a dedicated pool.

#### Cluster-Level and Node-Pool-Level Tags Are Additive

EKS supports AWS tags at two levels, and the two sets are merged rather than replaced.

| Level         | Override Target                         | Applies To                                                              |
| ------------- | --------------------------------------- | ----------------------------------------------------------------------- |
| **Cluster**   | `awsManagedControlPlane.additionalTags` | All resources that the cluster creates, including every node pool.      |
| **Node pool** | `awsManagedMachinePool.additionalTags`  | Only the managed node group for that pool and its associated resources. |

:::info

Node-pool-level tags are additive to the cluster-level tags. The resources for a node pool receive the union of both
sets. If the same key is set at both levels, the node-pool value takes precedence.

:::

##### Example

Consider the following example overrides.

```yaml title="Cluster-level override"
awsManagedControlPlane:
  spec:
    additionalTags:
      env: prod
```

```yaml title="Node-pool-level override"
awsManagedMachinePool:
  spec:
    additionalTags:
      customer: spectro
```

The managed node group for that pool, and its associated Auto Scaling group, receive both tags:

- `env: prod`
- `customer: spectro`

Other node pools that do not set `additionalTags` receive the cluster-level tag only (`env: prod`).

#### Tag Propagation

Tags resolved for a node pool are applied to the EKS managed node group and to the Auto Scaling group that backs it.
Amazon EKS and EC2 Auto Scaling then propagate Auto Scaling group tags to the EC2 instances launched in the pool,
according to the standard AWS tag-propagation rules.

Cluster-level tags continue to apply to all cluster resources, such as the `AWSManagedControlPlane`, networking
resources, and every node pool, regardless of any node-pool overrides.

#### Add, Update, and Delete Tags

The override YAML is the source of truth for the tags at each level. Palette reconciles the resolved tag set onto the
node group and Auto Scaling group on each reconcile, so you manage tags by editing the override YAML.

| Operation  | How to perform it                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------- |
| **Add**    | Add the key/value pair under `additionalTags`.                                                     |
| **Update** | Change the value of an existing key under `additionalTags`.                                        |
| **Delete** | Remove the key from `additionalTags`. The tag is removed from the resources on the next reconcile. |

#### Supported Tag Formats

Palette does not validate tag keys or values against AWS constraints. Tags must conform to the
[AWS tag requirements](https://docs.aws.amazon.com/tag-editor/latest/userguide/tagging.html), such as the per-resource
tag limit and the key and value length and character restrictions.

Avoid the following reserved prefixes that AWS and EKS manage:

- `aws:`
- `kubernetes.io/`
- `eks:`

AWS rejects an invalid tag during reconciliation, and the failure surfaces as a warning cluster event. Refer to
[Error Handling](./override-capi-properties.md#error-handling) for details.

#### Day-0 and Day-2 Workflows

You can set node-pool tags when you create a cluster (Day-0) or on a running cluster (Day-2).

- **Day-0** - Provide the node-pool override YAML in the node pool configuration before you deploy the cluster. The
  resolved tags are applied when the managed node group is created.

- **Day-2** - Edit the node-pool override YAML on the running cluster. Palette reconciles the change onto the existing
  node group.

  :::warning

  On EKS, any override change to a node pool, including a tag-only change, triggers a rolling upgrade (repave) of that
  pool, which temporarily reduces pool capacity. Plan Day-2 tag changes during a maintenance window. Refer to
  [Repave Behavior](./override-capi-properties.md#repave-behavior) for details.

  :::

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
