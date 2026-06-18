---
sidebar_label: "Override Cluster API Properties"
title: "Override Cluster API (CAPI) Properties"
description:
  "Learn how to override Cluster API (CAPI) properties and configure advanced settings not exposed by Palette."
icon: ""
hide_table_of_contents: false
tags: ["architecture", "capi", "cluster api", "advanced configuration"]
---

:::preview

:::

Palette uses [Cluster API (CAPI)](https://cluster-api.sigs.k8s.io/) and its cloud-specific provider extensions to
provision and manage Kubernetes clusters. When provisioning a cluster, Palette populates only a curated subset of the
properties supported by the underlying CAPI objects. For most use cases, this is sufficient. However, some advanced or
provider-specific configurations exist in the CAPI provider spec but are not surfaced in the Palette UI or API.

You can override these properties by supplying YAML directly targeting the underlying CAPI provider objects at both the
cluster level and the node pool level. This allows you to configure any property supported by the CAPI provider version
in use, without waiting for Palette to add native support for each field.

:::warning

Overriding CAPI properties is an advanced feature intended for experienced users. Supplying invalid or conflicting
configuration can result in cluster provisioning failures, unexpected node pool repaves, or degraded cluster behavior.
Use with caution and test changes in a non-production environment first.

:::

## Supported Providers

Overriding CAPI properties is currently supported for the following infrastructure types. Override fields must be valid
for the listed provider API version.

| Provider   | CAPI Implementation | Version                                                                                          | Reference Docs                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AWS IaaS   | CAPA                | [v2.7.1](https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases/tag/v2.7.1)        | - [CAPA book](https://cluster-api-aws.sigs.k8s.io/) <br /> - [v2.7.1 AWSCluster Types](https://github.com/kubernetes-sigs/cluster-api-provider-aws/blob/v2.7.1/api/v1beta2/awscluster_types.go) <br /> - [v2.7.1 AWSMachineTemplate Types](https://github.com/kubernetes-sigs/cluster-api-provider-aws/blob/v2.7.1/api/v1beta2/awsmachinetemplate_types.go)                                                    |
| AWS EKS    | CAPA                | [v2.7.1](https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases/tag/v2.7.1)        | - [CAPA book](https://cluster-api-aws.sigs.k8s.io/) <br /> - [v2.7.1 AWSManagedControlPlane Types](https://github.com/kubernetes-sigs/cluster-api-provider-aws/blob/v2.7.1/controlplane/eks/api/v1beta2/awsmanagedcontrolplane_types.go) <br /> - [v2.7.1 AWSManagedMachinePool Types](https://github.com/kubernetes-sigs/cluster-api-provider-aws/blob/v2.7.1/exp/api/v1beta2/awsmanagedmachinepool_types.go) |
| Azure IaaS | CAPZ                | [v1.18.0](https://github.com/kubernetes-sigs/cluster-api-provider-azure/releases/tag/v1.18.0)    | - [CAPZ book](https://capz.sigs.k8s.io/) <br /> - [v1.18.0 AzureCluster Types](https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/v1.18.0/api/v1beta1/azurecluster_types.go) <br /> - [v1.18.0 AzureMachineTemplate Types](https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/v1.18.0/api/v1beta1/azuremachinetemplate_types.go)                                               |
| Azure AKS  | CAPZ                | [v1.18.0](https://github.com/kubernetes-sigs/cluster-api-provider-azure/releases/tag/v1.18.0)    | - [CAPZ book](https://capz.sigs.k8s.io/) <br /> - [v1.18.0 AzureManagedControlPlane Types](https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/v1.18.0/api/v1beta1/azuremanagedcontrolplane_types.go) <br /> - [v1.18.0 AzureManagedMachinePool Types](https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/v1.18.0/api/v1beta1/azuremanagedmachinepool_types.go)                 |
| CloudStack | CAPC                | [v0.6.1](https://github.com/kubernetes-sigs/cluster-api-provider-cloudstack/releases/tag/v0.6.1) | - [CAPC book](https://cluster-api-cloudstack.sigs.k8s.io/) <br /> - [v0.6.1 CloudStackCluster Types](https://github.com/kubernetes-sigs/cluster-api-provider-cloudstack/blob/v0.6.1/api/v1beta3/cloudstackcluster_types.go) <br /> - [v0.6.1 CloudStackMachineTemplate Types](https://github.com/kubernetes-sigs/cluster-api-provider-cloudstack/blob/v0.6.1/api/v1beta3/cloudstackmachinetemplate_types.go)   |

## Supported Interfaces

Overriding CAPI properties can be implemented through the following Spectro Cloud / Palette interfaces:

- [Palette UI](https://console.spectrocloud.com/)
- [Palette API](/api/introduction/)
- [Spectro Cloud Terraform Provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs)
- [Palette Crossplane Provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette/)

## How Overrides Work

You supply a raw YAML string that describes the properties you want to set on the underlying CAPI object. Palette
converts the YAML to JSON and applies it as an
[RFC 7396 JSON merge patch](https://datatracker.ietf.org/doc/html/rfc7396) to the CAPI object it has already built.

The YAML you provide maps directly to the specification of the target CAPI object. For example, if you want to set the
control plane load balancer type with additional cluster tags on an AWS IaaS cluster, provide an override YAML that maps
to `awsCluster.spec`.

```yaml hideClipboard title="Example AWSCluster override YAML"
awsCluster:
  spec:
    controlPlaneLoadBalancer:
      loadBalancerType: nlb
      preserveClientIP: true
    additionalTags:
      env: test
      owner: qa
```

:::info

Override values always take precedence over values that Palette sets natively, as it is applied last in the merge patch
process. If there are any conflicts between override and native values, the override value is applied.

:::

### Where Overrides are Set

The location where you set the override depends on the level of the CAPI object you want to target.

You can set cluster and node pool overrides together on the same cluster.

#### Cluster Overrides

<Tabs groupId="cluster-state">
<TabItem label="New clusters" value="new">

Set the override during the **Cluster Config** step.

</TabItem>
<TabItem label="Existing clusters" value="existing">

Set the override in the **Settings > Cluster Configuration** drawer for the cluster.

</TabItem>
</Tabs>

#### Node Pool Overrides

<Tabs groupId="cluster-state">
<TabItem label="New clusters" value="new">

Set the override during the **Nodes Config** step.

</TabItem>
<TabItem label="Existing clusters" value="existing">

Navigate to the cluster's **Nodes** tab and click the **Edit** option for the relevant node pool to set the override.

</TabItem>
</Tabs>

### Key Format

The top-level key is always the camelCase form of the CAPI Kind. All nested keys are either based on the `json` struct
tags in the provider's Go types or, if no `json` tag is present, they are derived from the camelCase version of the
field name.

The following table lists example top-level keys and nested keys.

| CAPI Kind / Nested Keys    | Override Key Format        |
| -------------------------- | -------------------------- |
| `AWSCluster`               | `awsCluster`               |
| `ControlPlaneLoadBalancer` | `controlPlaneLoadBalancer` |
| `AzureManagedMachinePool`  | `azureManagedMachinePool`  |
| `VMSwappiness`             | `vmSwappiness`             |

:::info

An exception to the camelCase rule is `CloudStackMachineTemplate`, which uses a lowercase `s` in the top-level key
(`cloudstackMachineTemplate`). This is a historical artifact and requires special attention when constructing override
YAML for CloudStack.

:::

You can learn about the available CAPI kinds, nested keys, and their structure by reviewing the
[reference docs](#supported-providers) for the target CAPI provider. For example, to find the key for control plane load
balancer type on AWS, review the `AWSCluster` API types and look for the relevant field.

```go hideClipboard title="ControlPlaneLoadBalancer excerpt from AWSCluster API types"
type AWSClusterSpec struct {
    ...
	  // ControlPlaneLoadBalancer is optional configuration for customizing control plane behavior.
	  // +optional
	  ControlPlaneLoadBalancer *AWSLoadBalancerSpec `json:"controlPlaneLoadBalancer,omitempty"`
    ...
}
```

Refer to [References and Examples](#references-and-examples) for more example override YAML snippets and their
corresponding CAPI fields.

### Override YAML Structure

The structure of your override YAML maps directly to the Go struct definitions in the provider's types files. To
construct valid override YAML, use the following steps.

1. Start with the top-level key.

   Use the CAPI Kind for your target resource, converted to [camelCase](#key-format).

   ```yaml hideClipboard title="Example top-level key for AWSCluster"
   awsCluster:
   ```

   ```yaml hideClipboard title="Example top-level key for AzureManagedMachinePool"
   azureManagedMachinePool:
   ```

   <details>

   <summary> Note on CloudStackMachineTemplate top-level key </summary>

   An exception to the camelCase rule is `CloudStackMachineTemplate`, which uses a lowercase `s` in the top-level key
   (`cloudstackMachineTemplate`).

   ```yaml hideClipboard title="Example top-level key for CloudStackMachineTemplate"
   cloudstackMachineTemplate:
   ```

   </details>

2. Add `spec`.

   All configurable properties sit under `spec`. Your YAML always begins with the top-level key followed by `spec`.

3. Locate the field in the Spec struct.

   Open the provider's types file and find the Spec struct for your resource. For example, `AWSClusterSpec` in
   `awscluster_types.go`. Find the field you want to set and read its `json` struct tag for the key name.

   ```go hideClipboard title="AWSClusterSpec excerpt"
   type AWSClusterSpec struct {
       // AdditionalTags is an optional set of tags to add to AWS resources.
       // +optional
       AdditionalTags Tags `json:"additionalTags,omitempty"`
   }
   ```

   This maps to the following override YAML.

   ```yaml hideClipboard
   awsCluster:
     spec:
       additionalTags:
         key: value
   ```

4. Follow nested struct references.

   When a field's type is another struct, navigate into that struct to find its fields. For example,
   `ControlPlaneLoadBalancer` in `AWSClusterSpec` is of type `*AWSLoadBalancerSpec`.

   ```go hideClipboard title="AWSClusterSpec and AWSLoadBalancerSpec excerpts"
   // AWSClusterSpec
   ControlPlaneLoadBalancer *AWSLoadBalancerSpec `json:"controlPlaneLoadBalancer,omitempty"`

   // AWSLoadBalancerSpec
   type AWSLoadBalancerSpec struct {
       CrossZoneLoadBalancing bool `json:"crossZoneLoadBalancing"`
   }
   ```

   This maps to the following override YAML.

   ```yaml hideClipboard
   awsCluster:
     spec:
       controlPlaneLoadBalancer:
         crossZoneLoadBalancing: true
   ```

5. Handle inline struct embeddings.

   Some Spec structs embed another struct with `json:",inline"`. This promotes the embedded struct's fields to the same
   level and no additional key is needed. For example, `AzureManagedControlPlaneSpec` embeds
   `AzureManagedControlPlaneClassSpec` inline.

   ```go hideClipboard title="AzureManagedControlPlaneSpec excerpt"
   type AzureManagedControlPlaneSpec struct {
       AzureManagedControlPlaneClassSpec `json:",inline"`
       ...
   }
   ```

   Fields defined in `AzureManagedControlPlaneClassSpec` appear directly under `azureManagedControlPlane.spec`, without
   an additional nesting key.

6. For node pool overrides on self-managed clusters, apply the extra `template` nesting.

   Self-managed clusters (for example, AWS IaaS) back their node pools with a machine template resource. These machine
   template specs wrap the actual machine configuration in a `template` field, so pool-level overrides require an
   additional `template` level in the YAML.

   ```yaml hideClipboard title="Example AWSMachineTemplate override YAML with nested template field"
   awsMachineTemplate:
     spec:
       template:
         spec:
           instanceType: m5.xlarge
   ```

## Important Behaviors

Before overriding CAPI properties, review the following behaviors that apply when you configure a cluster or node pool.

### Repave Behavior

:::warning

Overriding CAPI properties on an existing cluster is likely to trigger a
[node pool repave](../../clusters/cluster-management/node-pool.md#repave-behavior-and-configuration), which temporarily
reduces cluster capacity. Plan override changes during a maintenance window.

- **Azure AKS** & **AWS EKS** - Any override change to a node pool triggers a rolling upgrade of that pool, even for
  parameters that would otherwise support inline updates.

:::

When you _disable_ the **Override Cluster API node pool configuration** toggle on a node pool that already has an
override, Palette reverts the overridden fields to the values it manages natively. This might trigger a repave of the
node pool, depending on which fields change.

- A repave occurs if the reversion changes a field that Palette uses to decide when to repave a node pool. Palette
  maintains a fixed, provider-specific list of repave-triggering fields. For example, on AWS IaaS, these fields include
  the instance type, SSH key name, root volume size, and AMI ID.

- A repave does not occur if the reversion changes only fields that are not repave-triggering, such as metadata. For
  example, AWS additional tags and CloudStack details are not on the list, so reverting them does not trigger a repave.

### Override Always Wins

Override values take precedence over values from all other input sources, such as:

- Palette's native defaults
- Cluster configuration
- Node pool configuration
- Pack values

If a field is set through any of these sources and also set in override, the override value is always applied.

### Array Replacement

RFC 7396 merge patch replaces arrays in their entirety. For example, if you set `azureManagedMachinePool.spec.taints`,
this replaces _all_ taints on the node pool, including any that Palette set.

Combine your desired values with any existing values Palette configures.

### Immutable Fields

Some CAPI provider fields are immutable after a cluster is created and cannot be changed on Day-2. Palette does not
validate whether a field is immutable, so it is your responsibility to check the relevant provider's CAPI spec or cloud
provider API documentation before applying an override to an existing cluster.

If you attempt to update an immutable field, behavior depends on the cloud provider. The provider may return an error,
which Palette surfaces as a warning cluster event (refer to [Error Handling](#error-handling)), or the cloud provider
may silently accept the value without applying it.

### Palette UI does not Reflect Overridden Values

The Palette UI displays the values you entered in the standard fields, not the values actually applied to the cluster
after an override. For example, if you set an instance type of `n1-standard-2` in the UI but override it to
`n2-standard-4` in the override configuration, the cluster uses `n2-standard-4` and the UI continues to display
`n1-standard-2`.

To verify what is actually applied, check the override configuration directly.

## First-Class Support vs. Override

The following table describes the guidelines for when we want to support a feature natively or leave it to an override.

| Approach                 | When it applies                                                                                                                                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Native (first-class)** | - Strategic, broadly needed features. <br /> - Compliance or security features that require an auditable UI. <br /> - Features requiring Palette-managed cloud metadata (for example, dynamic subnet selection). |
| **Override**             | - Niche per-tenant configurations. <br /> - Provider fields that evolve frequently upstream. <br /> - Features that do not meet the criteria for native support.                                                 |

## Troubleshooting

### No Semantic Validation

Palette only checks that the override YAML format is valid. It does not validate field names, types, or values against
the CAPI provider schema, and it does not check whether a field is immutable. Invalid fields produce warning events on
the cluster (refer to [Error Handling](#error-handling)).

### Error Handling

If Palette cannot apply the override, it logs a warning cluster event that identifies the problematic field paths. The
cluster continues to reconcile using the pre-override object, so a bad override value does not stall provisioning or
updates.

```shell hideClipboard title="Example warning event for invalid override field"
Failed to get/apply cloudconfig from hubble. admission webhook "vawscloudconfig.kb.io" denied the request: cluster API override on pool "control-plane-pool" has invalid fields under key "awsMachineTemplate": error unmarshaling JSON: while decoding JSON: json: unknown field "deviceNam"
```

## References and Examples

- [AWS CAPI Override Reference](./aws-capi-override-reference.md)

- [Azure CAPI Override Reference](./azure-capi-override-reference.md)

- [CloudStack CAPI Override Reference](./cloudstack-capi-override-reference.md)
