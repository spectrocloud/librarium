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
hosting the following type of artifacts: Helm charts, Zarf packages, and Packs.

Registries that comply with the OCI specification and support basic authentication are supported, although you can also
add registries that do not require authentication. OCI-compliant registries with basic authentication are labeled as
**Basic**. Palette also supports certain third-party registry providers, such as Amazon Elastic Container Registry
(ECR), Azure Container Registry (ACR), and GitHub Container Registry (GHCR).

## Supported Authentication Methods

The following table describes the different authentication methods supported based on the type of OCI registry.

| **Provider** | **Description**                 | **No Authentication** | **Basic (includes ACR)** |   **Amazon ECR**   |
| ------------ | ------------------------------- | :-------------------: | :----------------------: | :----------------: |
| **Helm**     | OCI-based Helm Chart registries |  :white_check_mark:   |    :white_check_mark:    | :white_check_mark: |
| **Zarf**     | OCI-based Zarf registries       |          :x:          |    :white_check_mark:    |        :x:         |
| **Packs**    | OCI-based Packs registries      |          :x:          |    :white_check_mark:    | :white_check_mark: |

:::info

Anonymous authentication is not supported for GHCR.

:::

## Verified OCI Registries

The following OCI registries have been verified by Palette. Other OCI registries may work but have not been verified.

- Amazon ECR
- ACR
- GHCR
- Harbor
- JFrog Artifactory

## Limitations

- OCI Helm registries created before Palette version 4.5.0 do not support automatic synchronization. To enable automatic
  synchronization, re-register the OCI Helm registry.

To add an OCI registry to Palette, refer to the respective guide for the OCI-type registry located in the
[Resources](#resources) section.

:::tip

If you are using self-hosted Palette or Palette VerteX, you can add an OCI registry at the system level scope. All
tenants can use the OCI registry once it is added to the system-level scope. To learn how to add an OCI registry at the
system level scope, refer to the
[Self-Hosted Add Registry](../../../enterprise-version/system-management/add-registry.md) guide or the
[VerteX Add Registry](../../../vertex/system-management/add-registry.md) guide.

:::

## OCI Packs Registry Configuration by Provider

<PartialsComponent category="oci-registry-configuration" name="oci-packs-registry-configuration-by-provider" />

## Resources

- [Add OCI Helm Registry](./add-oci-helm.md)

- [Add OCI Packs Registry](./add-oci-packs.md)

- [Add OCI Zarf Registry](./add-oci-zarf.md)
