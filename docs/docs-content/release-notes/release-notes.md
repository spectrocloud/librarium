---
sidebar_label: "Release Notes"
title: "Release Notes"
description: "Spectro Cloud release notes for Palette and its sub-components."
hide_table_of_contents: false
sidebar_position: 0
sidebar_custom_props:
  icon: "audits"
tags: ["release-notes"]
---

<ReleaseNotesVersions />

## October 26, 2024 - Release 4.5.4

### Breaking Changes

- Edge [content bundles](../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md) created with the
  latest version of the Edge CLI, version `4.5.5`, are incompatible with Palette agent versions before `4.5.4` due to a
  new format schema. If you are using an older version of the Palette agent, use the Edge CLI version `4.5.3` or earlier
  to create content bundles. To download the latest version of the Edge CLI, visit the
  [Downloads](../spectro-downloads.md#palette-edge-cli) page.

### Improvements

<!-- prettier-ignore -->
- <VersionedLink text="BYOOS Edge OS" url="/integrations/packs/?pack=edge-native-byoi" /> pack version 2.0.0 is now available with support for [agent mode deployment](../deployment-modes/agent-mode/agent-mode.md).

- Cluster [Profile variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables.md) marked as hidden now include the ability to be mutable, hidden, and read-only.

- [Edge content bundles](../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md) will now retain tags and image signatures. In the past, tags and signatures were stripped when the content bundle was created. Use the latest version of the Edge CLI to create content bundles that retain tags and signatures. To download the latest version of the Edge CLI, visit the
  [Downloads](../spectro-downloads.md#palette-edge-cli) page.

- Support for multiple authenticated external registries with domain mapping capabilities is now available for Edge clusters. Refer to the [External Registries](../clusters/edge/edge-configuration/installer-reference.md#multiple-external-registries) section in the Edge Installer Configuration Reference page for more information.

### Bug Fixes

- Resolved an issue where Edge nodes removed from a cluster remained in the Palette UI after a node delete operation was
  completed.

- Fixed an issue with Palette agent version 4.4.10 was unable to connect to the Palette management plane due to a gRPC
  connection error.

- Fixed an upgrade error causing clusters on K3s version 1.29 to fail to upgrade to a newer version.

- Fixed an issue where pack names containing the `/` character did not fail validation during pack creation.

- Fixed an issue where clusters, without prior backups, using Velero and Restic, were unable to accept resource quotas.

- Resolved an issue where CoreDNS was not upgraded during a Kubernetes upgrade.

- Fixed an issue where [system macros](../registries-and-packs/pack-constraints.md#pack-macros) were causing errors
  during cluster profile downloads.

## October 13, 2024 - Release 4.5.0 - 4.5.3

This release of Palette features a new deployment model, Agent Mode, and contains several new improvements and
enhancements. Take a moment and review the breaking changes and deprecation messages to ensure you stay informed of
upcoming changes. We also have a new and improved [Getting Started](../getting-started/getting-started.md) series worth
checking out, especially if you have new users who need to get familiar with Palette. Check out the following sections
to learn more about the changes introduced in this release.

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.md) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4-5-3}

#### Breaking Changes

- Due to Google's
  [decision to deprecate](https://cloud.google.com/artifact-registry/docs/transition/transition-from-gcr) the `gcr.io`
  container registry, we are adding a new image registry that Palette agents will use to pull images. The new registry
  is `us-docker.pkg.dev`. If you have network restrictions in place, ensure that the new registry is allowed. The new
  registry is available for use starting with this release. Refer to the
  [Proxy Requirements](../enterprise-version/install-palette/install-palette.md#proxy-requirements) for a complete list
  of domains that must be allowed.

#### Features

- <TpBadge /> A new deployment model is available in Palette, Agent Mode. Agent mode allows you to use your preferred
  security-hardened Operating System (OS) or immutable OS and machine without sharing cloud provider credentials with
  Palette. The Palette agent is downloaded and installed on the machine, and the machine is then registered with
  Palette. The new model provides more flexibility for customers who want to use their own OS and manage the
  infrastructure provisioning process. In this release, the first supported use case for agent mode is Edge deployments.
  Check out the [Agent Mode](../deployment-modes/agent-mode/agent-mode.md) section to learn more about this new
  deployment model. This feature is only available to Palette Enterprise, and is not available in Palette VerteX.

#### Improvements

- You can now use OIDC user information endpoints to retrieve user information from your designated Identity Provider
  (IdP), such as roles and groups. This improvement allows you to automate the synchronization of user roles and groups
  in Palette with your IdP. Refer to [OIDC](../user-management/saml-sso/saml-sso.md) to learn more about enabling OIDC
  integration in Palette.

- Palette now supports automatic synchronization for OCI Helm registries. Previously, you had to trigger the
  synchronization process manually. With this release, you can enable automatic synchronization for OCI Helm registries.
  This feature is only available to new OCI Helm registries added to Palette. Existing OCI Helm registries will continue
  to require manual synchronization. Re-register existing OCI Helm registries to take advantage of automatic
  synchronization. Refer to the [Add OCI Helm Registry](../registries-and-packs/registries/oci-registry/add-oci-helm.md)
  guide to learn more about adding an OCI Helm registry.

- The self-hosted Palette [system console](../enterprise-version/system-management/system-management.md#system-console)
  login page has now improved visual feedback for login errors. If the username and password fields are empty, they will
  be highlighted in red.

- Several improvements have been introduced to the Palette UI in this release.These upgrades include better support for
  wider screens, optimized page width, ensuring headings are visible on all screen sizes, and other responsive design
  improvements. In addition, event and audit logs can now occupy the entire screen width.

- The difference editor during
  [cluster profile upgrades](../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) received
  minor improvements to make it more user-friendly.

- Palette's internal database, MongoDB, has been upgraded to version 6.0.

#### Deprecations and Removals

- The [cluster group](../clusters/cluster-groups/cluster-groups.md), Beehive, will be sunset on November 9, 2024. As of
  the 4.5.0 release, you are no longer able to deploy any new virtual clusters into Beehive. If you are using Palette
  SaaS and have virtual clusters in the Beehive cluster group, migrate the workload to new virtual clusters hosted in a
  self-managed cluster group before November 9, 2024. You can learn more about creating a new cluster group in the
  [Create and Manage Cluster Groups](../clusters/cluster-groups/create-cluster-group.md) guide.

### Edge

#### Features

- You can now use LocalUI to facilitate user authentication for applications deployed onto Edge clusters. Application
  developers can use the JWT token provided by LocalUI to authenticate users for their applications hosted in the Edge
  cluster. The LocalUI provides a shared public key to each Edge host that you can use to verify the JWT token produced
  by LocalUI. This feature enables a single authentication source for applications deployed onto your Edge cluster.
  Check out the [Share Local UI Authentication](../clusters/edge/local-ui/cluster-management/share-auth.md) guide to
  learn more about this feature.

#### Improvements

- You can now disable the webhook Edge hosts use to redirect image pulls to the appropriate locations depending on your
  Edge user data configuration. Turning off the default webhook allows you to use diverse registry setups, such as
  private authenticated registries and airgap domains. Check out the
  [Disable Webhook to Customize Image Pull Behavior](../clusters/edge/site-deployment//deploy-custom-registries/webhook-disable.md)
  guide to learn more about this feature.

#### Bug Fixes

<!-- prettier-ignore -->
- Fixed an issue where the <VersionedLink text="Harbor" url="/integrations/packs/?pack=harbor-edge-native-config" /> pack's SSL certificate was not updated when a new certificate was specified in the pack YAML configuration.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4-5-3) for more details.

### Automation

- Terraform version 0.21.5 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

### Docs and Education

- The [Getting Started](../getting-started/getting-started.md) section of the documentation has been updated to provide
  a more comprehensive guide for new users to get started with Palette. In the Getting Started section, you can now find
  guides featuring AWS, Azure, GCP, and VMware vSphere. The sections have been updated with new tutorials and feature
  the fictional company Spacetastic to help you understand how to use Palette to manage your infrastructure.

- A new tutorial for Edge is now available. The
  [Deploy an Edge Cluster on VirtualBox](../tutorials/edge/deploy-cluster-virtualbox.md) tutorial provides a
  step-by-step guide to deploying an Edge cluster on VirtualBox. This tutorial is great for new users who want to learn
  more about Edge and gain hands-on experience without needing access to physical hardware.

### Packs

#### Pack Notes

<!-- prettier-ignore -->
- NVIDIA has released a software update for the NVIDIA Container Toolkit and NVIDIA GPU Operator that addresses a
  critical vulnerability, [NVIDIA CVE-2024-0132](https://nvidia.custhelp.com/app/answers/detail/a_id/5582), that affects
  the NVIDIA Container Toolkit versions v1.16.1 or earlier. To address this vulnerability, we recommend you upgrade to the latest <VersionedLink text="NVIDIA GPU Operator" url="/integrations/packs/?pack=nvidia-gpu-operator" /> pack version v24.6.2.

#### OS

| Pack Name | New Version |
| --------- | ----------- |
| BYOS      | 2.0.0       |

#### Kubernetes

| Pack Name | New Version |
| --------- | ----------- |
| K3s       | 1.28.14     |
| K3s       | 1.29.9      |
| K3s       | 1.30.5      |
| Microk8s  | 1.28        |

#### CNI

| Pack Name  | New Version |
| ---------- | ----------- |
| Calico     | 3.28.2      |
| Custom CNI | 1.0.0       |

#### CSI

| Pack Name           | New Version |
| ------------------- | ----------- |
| AWS EBS             | 1.35.0      |
| Custom CSI          | 1.0.0       |
| Portworx w/Operator | 3.1.5       |
| Rook Ceph           | 1.14.9      |

#### Add-on Packs

| Pack Name                 | New Version |
| ------------------------- | ----------- |
| AWS ALB                   | 2.8.3       |
| Cillium Tetragon          | 1.2.0       |
| Dex                       | 2.39.1      |
| ExternalDNS               | 0.15.0      |
| External Secrets Operator | 0.10.3      |
| Istio                     | 1.23.1      |
| Kong                      | 2.41.1      |
| Nginx                     | 1.11.2      |
| Spectro Proxy             | 1.5.4       |
| Vault                     | 0.28.1      |

#### FIPS Packs

| Pack Name | New Version |
| --------- | ----------- |
| AWS EBS   | 1.35.0      |
| Calico    | 3.28.2      |

#### Deprecations and Removals

- Check out the [Deprecated Packs](../integrations/deprecated-packs.md) page for a list of all deprecated packs.
