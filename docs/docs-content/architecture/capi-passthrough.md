---
sidebar_label: "CAPI Passthrough"
title: "Cluster API (CAPI) Passthrough"
description:
  "Learn how to use CAPI passthrough to configure native Cluster API provider properties that Palette does not expose
  natively."
icon: ""
hide_table_of_contents: false
sidebar_position: 70
tags: ["architecture", "capi", "cluster api", "advanced configuration"]
---

:::preview

:::

Palette uses [Cluster API (CAPI)](https://cluster-api.sigs.k8s.io/) and its cloud-specific provider extensions to
provision and manage Kubernetes clusters. When provisioning a cluster, Palette populates only a curated subset of the
properties supported by the underlying CAPI objects. For most use cases, this is sufficient.

However, some advanced or provider-specific configurations — such as custom instance metadata options, agent pool OS
disk settings, or OIDC issuer configuration — exist in the CAPI provider spec but are not surfaced in the Palette UI or
API.

CAPI passthrough is a feature that lets you supply arbitrary YAML directly targeting the underlying CAPI provider
objects at both the cluster level and the node pool level. This allows you to configure any property supported by the
CAPI provider version in use, without waiting for Palette to add native support for each field.

:::warning

CAPI passthrough is an advanced feature intended for experienced users. Supplying invalid or conflicting configuration
can result in cluster provisioning failures, unexpected node pool repaves, or degraded cluster behavior. Use with
caution and test changes in a non-production environment first.

:::

## Supported Providers

CAPI passthrough is currently supported for the following infrastructure types. Passthrough fields must be valid for the
listed provider API version.

| Provider  | CAPI Provider | Version                                                                                       | Reference Docs                                    |
| --------- | ------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| AWS IaaS  | CAPA          | [v2.7.1](https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases/tag/v2.7.1)     | [CAPA book](https://cluster-api-aws.sigs.k8s.io/) |
| Azure AKS | CAPZ          | [v1.18.0](https://github.com/kubernetes-sigs/cluster-api-provider-azure/releases/tag/v1.18.0) | [CAPZ book](https://capz.sigs.k8s.io/)            |

## Supported Interfaces

Passthrough can be configured through the following Spectro Cloud / Palette interfaces:

- [Palette UI](https://console.spectrocloud.com/)
- [Palette API](/api/introduction/)
- [Spectro Cloud Terraform Provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs)
- [Palette Crossplane Provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette/)

## How Passthrough Works

You supply a raw YAML string that describes the properties you want to set on the underlying CAPI object. Palette
applies this as an [RFC 7396 JSON merge patch](https://datatracker.ietf.org/doc/html/rfc7396) to the CAPI object it has
already built. Palette converts the YAML to JSON before applying the merge patch.

:::info

Passthrough values always override values that Palette sets natively as it is applied last in the merge patch process.
If there are any conflicts between passthrough and native values, the passthrough value wins.

:::

The YAML you provide maps directly to the specification of the target CAPI object. For example, if you are targeting the
`AWSCluster` object, your passthrough YAML should use the same field names and structure as the `AWSCluster` spec. You
can refer to the CAPI provider API reference documentation for the correct field names and structure.

```yaml hideClipboard
awsCluster:
  spec:
    controlPlaneLoadBalancer:
      loadBalancerType: nlb
      preserveClientIP: true
      targetGroupIPType: ipv4
    additionalTags:
      env: test
      owner: qa
```

Palette routes the passthrough to the correct CAPI object based on the cluster type or the pool type. You do not need to
specify the object type (for example, `AWSClusterTemplate` or `AWSMachineTemplate`) as the
[supported interfaces](#supported-interfaces) provide a passthrough field for each type.

For example, in the Palette UI, the cluster-level passthrough field is provided on the cluster configuration step and
the pool-level passthrough field is provided on the node pool configuration step.

### Cluster-Level vs. Pool-Level Passthrough

| Level       | Where it is set                      | What it targets                                                                                                          |
| ----------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Cluster** | Cloud configuration (cluster config) | The primary cluster-scoped CAPI control plane or infrastructure object (e.g., `AWSCluster`, `AzureManagedControlPlane`). |
| **Pool**    | Node pool configuration              | The CAPI machine pool or machine template object for that node pool.                                                     |

Both levels can be used independently or together on the same cluster.

## Important Behaviors and Limitations

Before using passthrough, review the following behaviors.

### Repave Behavior

Changes to passthrough on an existing cluster may trigger a node pool repave (rolling replacement of nodes):

- **Self-managed clusters** — Any passthrough change produces a new machine template hash, automatically triggering a
  rolling update.

- **Managed clusters** — Passthrough changes are detected via a stored hash annotation. A repave warning is always shown
  when you update passthrough since the impact cannot be predicted in advance.

  - **AKS** — Any passthrough change triggers a rolling upgrade, even for parameters that would otherwise support inline
    updates.

:::caution

Updating passthrough on a running cluster may trigger a node pool repave, which will temporarily reduce cluster
capacity. Plan passthrough changes during a maintenance window.

:::

### Array Replacement

RFC 7396 merge patch replaces arrays in their entirety. For example, if you set `spec.taints`, this replaces _all_
taints on the node group, including any that Palette set. Combine your desired values with any existing values Palette
configures.

### Passthrough always overrides

Passthrough values override values from all other input sources: Palette's native defaults, `nodeConfig`,
`clusterConfig`, pack values, and cloud items. If a field is set through any of these sources and also set in
passthrough, the passthrough value always wins.

### UI does not reflect overridden values

The Palette UI displays the values you entered in the standard fields, not the values actually applied to the cluster
after passthrough. For example, if you set an instance type of `n1-standard-2` in the UI but override it to
`n2-standard-4` via passthrough, the cluster will use `n2-standard-4` but the UI will continue to display
`n1-standard-2`. To verify what is actually applied, check the passthrough configuration directly.

## How to Discover CAPI Passthrough Fields

TBA

## Cloud Provider Reference Examples

The following sections describe which underlying CAPI object each supported provider targets and provide example
passthrough YAML.

### Amazon Web Services — IaaS (Self-Managed)

| Level   | CAPI Object          | API Reference                                                                                                                                   |
| ------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster | `AWSCluster`         | [AWSCluster API types](https://github.com/kubernetes-sigs/cluster-api-provider-aws/blob/v2.7.1/api/v1beta2/awscluster_types.go)                 |
| Pool    | `AWSMachineTemplate` | [AWSMachineTemplate API types](https://github.com/kubernetes-sigs/cluster-api-provider-aws/blob/v2.7.1/api/v1beta2/awsmachinetemplate_types.go) |

```yaml title="Cluster-level example — Set cluster tags on AWSCluster"
spec:
  tags:
    environment: production
    team: backend
```

```yaml title="Pool-level example — Require IMDSv2 on AWSMachineTemplate"
spec:
  template:
    spec:
      instanceMetadataOptions:
        httpTokens: required
        httpPutResponseHopLimit: 1
```

### Microsoft Azure — AKS (Managed)

| Level   | CAPI Object                | API Reference                                                                                                                                                  |
| ------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster | `AzureManagedControlPlane` | [AzureManagedControlPlane API types](https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/v1.18.0/api/v1beta1/azuremanagedcontrolplane_types.go) |
| Pool    | `AzureManagedMachinePool`  | [AzureManagedMachinePool API types](https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/v1.18.0/api/v1beta1/azuremanagedmachinepool_types.go)   |

```yaml title="Cluster-level example — Enable OIDC issuer on AzureManagedControlPlane"
spec:
  oidcIssuerProfile:
    enabled: true
```

```yaml title="Pool-level example — Set OS disk type on AzureManagedMachinePool"
spec:
  osDiskType: Ephemeral
```

## Unsupported First-Class Properties

[TBA](https://spectrocloud.atlassian.net/wiki/spaces/ENGINEERIN/pages/3675717667/Passthrough+CAPI+Properties#Cloud-wise-properties-currently-not-supported)

## First-Class Support vs. Passthrough

Passthrough is intentionally an escape hatch, not a replacement for native Palette configuration. Palette applies the
following guidelines when deciding whether to support a feature natively or via passthrough:

| Approach                 | When it applies                                                                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Native (first-class)** | Strategic, broadly needed features; compliance or security features that require an auditable UI; features requiring Palette-managed cloud metadata (e.g., dynamic subnet selection) |
| **Passthrough**          | Long-tail or niche per-tenant configurations; provider fields that evolve frequently upstream; features that do not meet the criteria for native support                             |

## Resources

- [Cluster API documentation](https://cluster-api.sigs.k8s.io/)
- [CAPA book — AWS provider reference](https://cluster-api-aws.sigs.k8s.io/)
- [CAPZ book — Azure provider reference](https://capz.sigs.k8s.io/)

## Troubleshooting

### No Semantic Validation

Palette only validates that the passthrough is valid YAML. It does not validate field names, types, or values against
the CAPI provider schema. Invalid fields will produce Warning events on the cluster (see
[Error handling](#error-handling) below).

### Error Handling

If Palette cannot apply the passthrough (for example, due to a type mismatch between your YAML and the CAPI schema), it
logs a `Warning` cluster event that identifies the problematic field paths. The cluster continues to reconcile using the
pre-passthrough object, so a bad passthrough value does not stall provisioning or updates.
