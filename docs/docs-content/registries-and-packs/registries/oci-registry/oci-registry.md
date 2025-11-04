---
sidebar_label: "OCI Registries"
title: "OCI Registries"
description: "Learn how to add your own OCI Registry to Palette"
icon: ""
hide_table_of_contents: false
sidebar_position: 70
---

Palette supports the configuration of multiple Open Container Initiative (OCI) registries. You can add a private OCI
registry to Palette and use OCI artifacts in your cluster profiles. Palette only supports custom OCI registries that are
hosting the following type of artifacts; Helm Charts, Zarf packages, and Packs.

Registries that comply with the OCI specification and support basic authentication are supported. OCI-compliant
registries with basic authentication are labeled as **Basic**. Palette also supports some third-party registry
providers, such as AWS ECR.

## Supported OCI Registries

The following type of OCI registries are supported:

| **Provider** | **Description**                  | **Basic** | **AWS ECR** |
| ------------ | -------------------------------- | --------- | ----------- |
| Helm         | OCI based Helm Chart registries. | ✅        | ✅          |
| Zarf         | OCI based Zarf registries.       | ✅        | ❌          |
| Packs        | OCI based Packs registries.      | ✅        | ✅          |

## Limitations

- Automatic synchronization is not supported for Zarf registries.

- OCI Helm registries created before Palette version 4.5.0 do not support automatic synchronization. To enable automatic
  synchronization, re-register the OCI Helm registry.

<br />

To add an OCI registry to Palette, refer to the respective guide for the OCI-type registry located in the
[Resources](#resources) section.

:::tip

If you are using self-hosted Palette or Palette VerteX, you can add an OCI registry at the system level scope. All
tenants can use the OCI registry once it is added to the system-level scope. To learn how to add an OCI registry at the
system level scope, refer to the
[Self-Hosted Add Registry](../../../self-hosted-setup/palette/system-management/add-registry.md) guide or the
[VerteX Add Registry](../../../self-hosted-setup/vertex/system-management/add-registry.md) guide.

:::

## Resources

- [Add OCI Helm Registry](./add-oci-helm.md)

- [Add OCI Packs Registry](./add-oci-packs.md)

- [Add OCI Zarf Registry](./oci-registry.md)
