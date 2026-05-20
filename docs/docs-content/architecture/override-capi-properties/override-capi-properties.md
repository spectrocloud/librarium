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

You can override these properties by supplying arbitrary YAML directly targeting the underlying CAPI provider objects at
both the cluster level and the node pool level. This allows you to configure any property supported by the CAPI provider
version in use, without waiting for Palette to add native support for each field.

:::warning

Overriding CAPI properties is an advanced feature intended for experienced users. Supplying invalid or conflicting
configuration can result in cluster provisioning failures, unexpected node pool repaves, or degraded cluster behavior.
Use with caution and test changes in a non-production environment first.

:::

## Supported Providers

Overriding CAPI properties is currently supported for the following infrastructure types. Override fields must be valid
for the listed provider API version.

| Provider  | CAPI Provider | Version                                                                                       | Reference Docs                                                                                                                                                                                                                                                                                                                                                                                 |
| --------- | ------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AWS IaaS  | CAPA          | [v2.7.1](https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases/tag/v2.7.1)     | - [CAPA book](https://cluster-api-aws.sigs.k8s.io/) <br /> - [v2.7.1 AWSCluster Types](https://github.com/kubernetes-sigs/cluster-api-provider-aws/blob/v2.7.1/api/v1beta2/awscluster_types.go) <br /> - [v2.7.1 AWSMachineTemplate Types](https://github.com/kubernetes-sigs/cluster-api-provider-aws/blob/v2.7.1/api/v1beta2/awsmachinetemplate_types.go)                                    |
| Azure AKS | CAPZ          | [v1.18.0](https://github.com/kubernetes-sigs/cluster-api-provider-azure/releases/tag/v1.18.0) | - [CAPZ book](https://capz.sigs.k8s.io/) <br /> - [v1.18.0 AzureManagedControlPlane Types](https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/v1.18.0/api/v1beta1/azuremanagedcontrolplane_types.go) <br /> - [v1.18.0 AzureManagedMachinePool Types](https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/v1.18.0/api/v1beta1/azuremanagedmachinepool_types.go) |

## Supported Interfaces

Overriding CAPI properties can be implemented through the following Spectro Cloud / Palette interfaces:

- [Palette UI](https://console.spectrocloud.com/)
- [Palette API](/api/introduction/)
- [Spectro Cloud Terraform Provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs)
- [Palette Crossplane Provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette/)

## How Overrides Work

You supply a raw YAML string that describes the properties you want to set on the underlying CAPI object. Palette
applies this as an [RFC 7396 JSON merge patch](https://datatracker.ietf.org/doc/html/rfc7396) to the CAPI object it has
already built. Palette converts the YAML to JSON before applying the merge patch.

:::info

Override values always take precedence over values that Palette sets natively as it is applied last in the merge patch
process. If there are any conflicts between override and native values, the override value wins.

:::

The YAML you provide maps directly to the specification of the target CAPI object. For example, if you want to set the
control plane load balancer type with additional cluster tags on an AWS IaaS cluster, you would provide override YAML
that maps to `awsCluster.spec`.

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

### Key Format

The top-level key is always the camelCase form of the CAPI Kind. All nested keys follow the same camelCase convention
and are often defined by the `json` struct tags in the provider's Go types.

The following table lists example top-level keys and nested keys.

| CAPI Kind / Nested Keys    | Override Key Format        |
| -------------------------- | -------------------------- |
| `AWSCluster`               | `awsCluster`               |
| `ControlPlaneLoadBalancer` | `controlPlaneLoadBalancer` |
| `AzureManagedMachinePool`  | `azureManagedMachinePool`  |
| `VMSwappiness`             | `vmSwappiness`             |

You can discover the available CAPI Kind and nested keys and their structure by reviewing the
[reference docs](#supported-providers) for the target CAPI provider. For example, to find the key for control plane load
balancer type on AWS, review the `AWSCluster` API types and look for the relevant field:

```go hideClipboard title="ControlPlaneLoadBalancer excerpt from AWSCluster API types"
type AWSClusterSpec struct {
    ...
	  // ControlPlaneLoadBalancer is optional configuration for customizing control plane behavior.
	  // +optional
	  ControlPlaneLoadBalancer *AWSLoadBalancerSpec `json:"controlPlaneLoadBalancer,omitempty"`
    ...
}
```

### How to Discover CAPI Override Fields

_TBA - May be covered by [Key Format](#key-format)._

### Cluster-Level vs. Pool-Level Override

| Level       | Where it is set                   | What it targets                                                           | Top-Level Key Examples                          |
| ----------- | --------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------- |
| **Cluster** | Cluster-level cloud configuration | The primary cluster-scoped CAPI control plane or infrastructure resource. | `awsCluster`, `azureManagedControlPlane`        |
| **Pool**    | Node pool configuration           | The CAPI machine pool or machine template object for that node pool.      | `awsMachineTemplate`, `azureManagedMachinePool` |

Both levels can be used independently or together on the same cluster.

## Important Behaviors

Before overriding CAPI properties, review the following behaviors that apply when you configure a cluster or node pool.

### Repave Behavior

:::caution

Using an override on an existing cluster may trigger a
[node pool repave](../../clusters/cluster-management/node-pool.md#repave-behavior-and-configuration), which will
temporarily reduce cluster capacity. Plan override changes during a maintenance window.

:::

The following behaviors apply when you update an existing cluster with an override:

- **Infrastructure as a Service (IaaS) clusters** — Any override change produces a new machine template hash,
  automatically triggering a rolling update.

- **Managed Kubernetes clusters** — Override changes are detected via a stored hash annotation. A repave warning is
  always shown when you apply an override since the impact cannot be predicted in advance.

  - **AKS** — Any override change triggers a rolling upgrade, even for parameters that would otherwise support inline
    updates.

### Override Always Wins

Override values take precedence over values from all other input sources, such as:

- Palette's native defaults
- Cluster configuration
- Node pool configuration
- Pack values

If a field is set through any of these sources and also set in override, the override value always wins.

### Array Replacement

RFC 7396 merge patch replaces arrays in their entirety. For example, if you set `azureManagedMachinePool.spec.taints`,
this replaces _all_ taints on the node pool, including any that Palette set.

Combine your desired values with any existing values Palette configures.

### Immutable Fields

Some CAPI provider fields are immutable after a cluster is created and cannot be changed on day 2. Palette does not
validate whether a field is immutable, so it is your responsibility to check the relevant provider's CAPI spec or cloud
provider API documentation before applying an override to an existing cluster.

If you attempt to update an immutable field, behavior depends on the cloud provider. The provider may return an error,
which Palette surfaces as a `Warning` cluster event (see [Error Handling](#error-handling)), or it may silently accept
the value without applying it.

### Palette UI does not Reflect Overridden Values

The Palette UI displays the values you entered in the standard fields, not the values actually applied to the cluster
after an override. For example, if you set an instance type of `n1-standard-2` in the UI but override it to
`n2-standard-4` in the override configuration, the cluster will use `n2-standard-4` and the UI will continue to display
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

Palette only validates that the override YAML format is valid. It does not validate field names, types, or values
against the CAPI provider schema, and it does not check whether a field is immutable. Invalid fields will produce
Warning events on the cluster (see [Error Handling](#error-handling)).

### Error Handling

If Palette cannot apply the override, it logs a `Warning` cluster event that identifies the problematic field paths. The
cluster continues to reconcile using the pre-override object, so a bad override value does not stall provisioning or
updates.

## References and Examples

- [AWS CAPI Override Reference](./aws-capi-override-reference.md)

- [Azure AKS CAPI Override Reference](./azure-capi-override-reference.md)
