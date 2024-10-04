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

## October 12, 2024 - Release 4.5.0 - 4.5.X

This release of Palette features a new deployment model, Agent Mode, and contains several new improvements and
enhancements. Take a moment and review the breaking changes and deprecation messages to ensure you stay informed of
upcoming changes. We also have a new and improved [Getting Started](../getting-started/getting-started.md) series worth
checking out, especially if you have new users needing to get familiar with Palette. Check out the following sections to
learn more about the changes introduced in this release.

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.md) page for the latest security advisories.

### Palette Enterprise

#### Breaking Changes

- Due to Google's
  [decision to deprecate](https://cloud.google.com/artifact-registry/docs/transition/transition-from-gcr) the `gcr.io`
  container registry, we are adding a new image registry that Palette agents will use to pull images. The new registry
  is `us-docker.pkg.dev`. If you have network restrictions in place, ensure that the new registry is allowed. The new
  registry is available for use starting with this release. Refer to the
  [Proxy Requirements](../enterprise-version/install-palette/install-palette.md#proxy-requirements) for a complete list
  of domains that must be allowed.

#### Features

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
  login page now has improved visual feedback for login errors. If the username and password fields are empty, they will
  be highlighted in red.

- Several improvements have been introduced to the Palette UI in this release.These upgrades include better support for
  wider screens, optimized page width, ensuring headings are visible on all screen sizes, and other responsive design
  improvements. In addition, event and audit logs can now occupy the entire screen width.

- The difference editor during
  [cluster profile upgrades](../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md) received
  minor improvements to make it more user-friendly.

- Palette's internal database, MongoDB, has been upgraded to version 6.0.

#### Bug Fixes

#### Deprecations and Removals

- The [cluster group](../clusters/cluster-groups/cluster-groups.md), Beehive, will be sunset November 9, 2024. If you
  are using Palette SaaS and have virtual clusters in the Beehive cluster group, migrate the workload to new virtual
  clusters hosted in a self-managed cluster group before November 9, 2024. You can learn more about creating a new
  cluster group in the [Create and Manage Cluster Groups](../clusters/cluster-groups/create-cluster-group.md) guide.

#### Known Issues

### Edge

#### Features

#### Improvements

- You can now disable the webhook Edge hosts use to redirect image pulls to the appropriate locations depending on your
  Edge user data configuration. Turning off the default webhook allows you to use diverse registry setups, such as
  private authenticated registries and airgap domains. Check out the
  [Disable Webhook to Customize Image Pull Behavior](../clusters/edge/site-deployment/site-deployment.md) guide to learn
  more about this feature.

### Automation

- Terraform version 0.22.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).

- The Palette CLI commands `vmo migrate-vm` and `vmo import-ova` have received serveral improvements to better handle
  the migration and import of virtual machines to a VMO cluster. Refer to the
  [VMO](../automation/palette-cli/commands/vmo.md) reference page to learn more about these commands.

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

#### Kubernetes

#### CNI

#### CSI

#### Add-on Packs

#### FIPS Packs

#### Deprecations and Removals

- Check out the [Deprecated Packs](../integrations/deprecated-packs.md) page for a list of all deprecated packs.
