---
sidebar_label: "CAPI Passthrough"
title: "Cluster API (CAPI) Passthrough"
description:
  "Learn how to use CAPI passthrough to configure native Cluster API provider properties that Palette does not expose
  natively."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["architecture", "capi", "cluster api", "advanced configuration"]
---

:::preview

:::

Palette uses [Cluster API (CAPI)](https://cluster-api.sigs.k8s.io/) and its cloud-specific provider extensions (CAPx) to
provision and manage Kubernetes clusters. When provisioning a cluster, Palette populates only a curated subset of the
properties supported by the underlying CAPI objects. For most use cases, this is sufficient.

However, some advanced or provider-specific configurations — such as custom instance metadata options, agent pool OS
disk settings, or OIDC issuer configuration — exist in the CAPI provider spec but are not surfaced in the Palette UI or
API.

**CAPI passthrough** is an escape-hatch feature that lets you supply arbitrary YAML directly targeting the underlying
CAPI provider objects at both the cluster level and the node pool level. This allows you to configure any property
supported by the CAPx provider version in use, without waiting for Palette to add native support for each field.

## How Passthrough Works

You supply a raw YAML string that describes the properties you want to set on the underlying CAPI object. Palette
applies this as an [RFC 7396 JSON merge patch](https://datatracker.ietf.org/doc/html/rfc7396) to the CAPI object it has
already built. Because the passthrough is applied **last**, passthrough values always override values that Palette sets
natively.

The YAML you provide maps directly to the spec of the target CAPI object. For example, to require IMDSv2 on an
`AWSMachineTemplate`, your passthrough YAML would be:

```yaml
spec:
  template:
    spec:
      instanceMetadataOptions:
        httpTokens: required
        httpPutResponseHopLimit: 1
```

Palette routes the passthrough to the correct CAPI object based on the cluster type (for cluster-level passthrough) or
the pool type (for pool-level passthrough). You do not need to specify the object type — the routing is handled
internally.

### Cluster-Level vs. Pool-Level Passthrough

| Level       | Where it is set                      | What it targets                                                                                                         |
| ----------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **Cluster** | Cloud configuration (cluster config) | The primary cluster-scoped CAPI control plane or infrastructure object (e.g., `AWSCluster`, `AzureManagedControlPlane`) |
| **Pool**    | Machine pool configuration           | The CAPI machine pool or machine template object for that node pool                                                     |

Both levels can be used independently or together on the same cluster.

## Important Behaviors and Limitations

Before using passthrough, review the following behaviors.

**Array replacement** — RFC 7396 merge patch replaces arrays in their entirety. For example, if you set `spec.taints`,
this replaces _all_ taints on the node group, including any that Palette set. Combine your desired values with any
existing values Palette configures.

**No semantic validation** — Palette only validates that the passthrough is valid YAML. It does not validate field
names, types, or values against the CAPI provider schema. Invalid fields will produce Warning events on the cluster (see
[Error handling](#error-handling) below).

**Passthrough always overrides** — Any field you set via passthrough overrides the value Palette sets natively for that
same field. If both Palette and passthrough set the same field, the passthrough value wins.

**Supported interfaces** — Passthrough can be configured through the Palette UI, API, Terraform provider, and Crossplane
provider.

### Repave Behavior

Changes to passthrough on an existing cluster may trigger a node pool repave (rolling replacement of nodes):

- **Self-managed clusters (AWS IaaS)** — Any passthrough change produces a new machine template hash, automatically
  triggering a rolling update.
- **Managed clusters (AKS)** — Passthrough changes are detected via a stored hash annotation. A repave warning is always
  shown when you update passthrough since the impact cannot be predicted in advance.

:::caution

Updating passthrough on a running cluster may trigger a node pool repave, which will temporarily reduce cluster
capacity. Plan passthrough changes during a maintenance window.

:::

### Error Handling

If Palette cannot apply the passthrough (for example, due to a type mismatch between your YAML and the CAPI schema), it
logs a `Warning` cluster event that identifies the problematic field paths. The cluster continues to reconcile using the
pre-passthrough object, so a bad passthrough value does not stall provisioning or updates.

## Cloud Provider Reference

The following sections describe which underlying CAPI object each supported provider targets and provide example
passthrough YAML.

### Supported Providers

- **AWS IaaS**
- **Azure AKS**

---

### Amazon Web Services — IaaS (Self-Managed)

Cluster-level passthrough targets the `AWSCluster` object. Pool-level passthrough targets the `AWSMachineTemplate`
object for each node pool.

**Pool-level example — require IMDSv2:**

```yaml
spec:
  template:
    spec:
      instanceMetadataOptions:
        httpTokens: required
        httpPutResponseHopLimit: 1
```

---

### Microsoft Azure — AKS (Managed)

Cluster-level passthrough targets the `AzureManagedControlPlane` object. Pool-level passthrough targets the
`AzureManagedMachinePool` object for each agent pool.

**Cluster-level example — enable OIDC issuer:**

```yaml
spec:
  oidcIssuerProfile:
    enabled: true
```

**Pool-level example — set OS disk type:**

```yaml
spec:
  osDiskType: Ephemeral
```

## First-Class Support vs. Passthrough

Passthrough is intentionally an escape hatch, not a replacement for native Palette configuration. Palette applies the
following guidelines when deciding whether to support a feature natively or via passthrough:

| Approach                 | When it applies                                                                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Native (first-class)** | Strategic, broadly needed features; compliance or security features that require an auditable UI; features requiring Palette-managed cloud metadata (e.g., dynamic subnet selection) |
| **Passthrough**          | Long-tail or niche per-tenant configurations; provider fields that evolve frequently upstream; features that do not meet the criteria for native support                             |

If you find yourself relying on passthrough for a configuration you consider critical, consider opening a feature
request so Palette can evaluate adding native support.

## Resources

- [Cluster API documentation](https://cluster-api.sigs.k8s.io/)
- [AWS CAPA API reference](https://cluster-api-aws.sigs.k8s.io/reference/api)
- [Azure CAPZ API reference](https://capz.sigs.k8s.io/reference/api)
- [GCP CAPG API reference](https://cluster-api-gcp.sigs.k8s.io/)
