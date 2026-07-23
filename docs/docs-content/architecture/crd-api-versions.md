---
sidebar_label: "CRD API Versions"
title: "Custom Resource Definition API Versions"
description:
  "Reference for the API versions served by Palette Custom Resource Definitions in the cluster.spectrocloud.com API
  group, including the version support matrix, backward-compatibility guarantees, and recommended usage."
hide_table_of_contents: false
sidebar_position: 55
sidebar_custom_props:
  icon: ""
---

Palette manages workload clusters through Custom Resource Definitions (CRDs) in the `cluster.spectrocloud.com` API
group. Starting in Palette and Palette VerteX 4.9.33, these CRDs serve a new stable API version, `v1`, alongside the
existing `v1alpha1`. This page describes the two API versions, the compatibility guarantees between them, and which
version to use in new manifests.

## API Versions

- `cluster.spectrocloud.com/v1` - The new stable API version, introduced in 4.9.33. It is the stored version, which means
  that Palette persists all objects in `v1` format in the underlying `etcd` datastore.

- `cluster.spectrocloud.com/v1alpha1` - The legacy API version. It remains served for backward compatibility, so
  existing manifests, tooling, and integrations continue to work without change.

The following table lists the API versions served for each Palette and Palette VerteX release. Palette and Palette
VerteX share the same CRD API versions.

| Palette / VerteX version | `v1alpha1`                   | `v1`          | Storage version |
| ------------------------ | ---------------------------- | ------------- | --------------- |
| 4.9.27 and earlier       | Served                       | Not available | `v1alpha1`      |
| 4.9.33 and later          | Served (backward-compatible) | Served        | `v1`            |

There is currently no deprecation timeline for `v1alpha1`. Palette continues to serve both versions.

A Kubernetes conversion webhook translates objects between the two versions transparently at read and write time. No
manual migration is required for existing resources.

When you upgrade Palette or Palette VerteX to 4.9.33, all existing `v1alpha1` objects are read and re-served as `v1`
through the conversion webhook, and Palette re-persists them in `v1` format. No customer action is required for existing
resources.

:::info

The dual API surface supports the Palette Long Term Support (LTS) upgrade path, where cluster-side agents and resources
can lag the management plane by up to two LTS major versions (N-2). Older cluster-side components continue to reconcile
against the management plane after the management plane upgrades to 4.9.33.

:::

## Usage

The following 13 CRDs in the `cluster.spectrocloud.com` API group serve both `v1` (stored) and `v1alpha1` (served) in
4.9.33 and later:

- `SpectroCluster`
- `Pack`
- `ClusterProfile`
- `ClusterProfileArchive`
- `CustomCloudConfig`
- `AwsCloudConfig`
- `AzureCloudConfig`
- `GcpCloudConfig`
- `VsphereCloudConfig`
- `MaasCloudConfig`
- `CloudStackCloudConfig`
- `NestedCloudConfig`
- `EdgeNativeCloudConfig`

Update new manifests, tooling, and integrations to use `apiVersion: cluster.spectrocloud.com/v1`. Existing manifests
that reference `v1alpha1` remain fully supported and require no change.

The following legacy manifest is still supported but is not recommended for new resources.

```yaml title="Example legacy manifest"
apiVersion: cluster.spectrocloud.com/v1alpha1
kind: AwsCloudConfig
metadata:
  name: spectrocluster-sample
  namespace: cluster-123
```

The following manifest uses the recommended `v1` API version for new resources.

```yaml title="Example recommended manifest"
apiVersion: cluster.spectrocloud.com/v1
kind: AwsCloudConfig
metadata:
  name: spectrocluster-sample
  namespace: cluster-123
```
