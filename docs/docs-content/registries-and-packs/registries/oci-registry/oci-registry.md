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

The following table describes the authentication methods supported for each OCI registry type.

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

## Project-Level vs. System-Level Registries

OCI registries are typically added at the project level from the Tenant Admin scope. When a registry is added using this
method, it is available to all projects within the tenant.

If you are using self-hosted Palette or Palette VerteX, you can also add an OCI registry at the system level through the
[system console](../../../enterprise-version/system-management/system-management.md#access-the-system-console). All
tenants and all projects within those tenants can use the OCI registry once it is added at the system level. To learn
how to add an OCI through the system console, refer to the appropriate
[Palette](../../../enterprise-version/system-management/add-registry.md) or
[Palette Vertex](../../../vertex/system-management/add-registry.md) guide.

## OCI Packs Registry Configuration by Provider

<PartialsComponent category="oci-registry-configuration" name="oci-packs-registry-configuration-by-provider" />

## Limitations

- OCI Helm registries created before Palette version 4.5.0 do not support automatic synchronization. To enable automatic
  synchronization, you must re-register the OCI Helm registry with Palette.

## Next Steps

Review the appropriate guide to add an OCI registry to Palette based on the type of content you want to expose in
Palette. If your registry contains multiple content types that you want to use, you must add the registry for each type.

- [Add OCI Helm Registry](./add-oci-helm.md)

- [Add OCI Packs Registry](./add-oci-packs.md)

- [Add OCI Zarf Registry](./add-oci-zarf.md)
