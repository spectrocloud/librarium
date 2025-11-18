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

## November 22, 2025 - Release 4.8.X {#release-notes-4.8.0}

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4.8.0}

#### Breaking Changes {#breaking-changes-4.8.0}

- When creating EKS clusters, the default **Amazon Machine Image (AMI) Type** is now Amazon Linux 2023 (AL2023) Standard
  AMI. This change aligns with the [upcoming deprecation of Amazon Linux 2 (AL2) AMIs](./announcements.md#deprecations).
  A deprecation warning now appears for AL2 AMIs in the **Amazon Machine Image (AMI) Type** drop-down menu within
  [Cloud Configuration Settings](../clusters/public-cloud/aws/eks.md#cloud-configuration-settings).

- [System configuration API endpoints](/api/v1/system) can now only be accessed using privileged
  [authorization tokens](../user-management/authentication/authorization-token.md). These API endpoints expose critical
  system details, so access to them is strictly enforced. Users with general access authorization tokens are no longer
  able to access these endpoints.

- All Palette and VerteX [Clouds API endpoints](/api/v1/clouds) now require
  [authorization tokens](../user-management/authentication/authorization-token.md) for all requests. Existing
  integrations must be updated to provide valid authorization tokens, as unauthenticated API calls will now fail.

#### Features

- [EKS Pod Identity](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html) is now a supported
  authentication method for AWS cloud accounts. This secure authentication mechanism allows Kubernetes pods to assume
  IAM roles with temporary, automatically refreshed credentials, eliminating the need for long-lived AWS credentials.

  This method is only available for self-hosted Palette and Palette VerteX instances deployed on Amazon EKS clusters.
  Refer to the [Add AWS Accounts](../clusters/public-cloud/aws/add-aws-accounts.md) guide for more information.

- [Cluster profile variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/create-cluster-profile-variables.md)
  now support the multiline input type and the Base64 format. This improvement allows users to leverage cluster profile
  variables for use cases such as saving multiline YAML specifications and storing encoded keys for use during cluster
  creation.

#### Improvements

- Project tags are now displayed in the **Project Overview** page and the **Tenant Admin > Projects** page in Palette.
  This improvement allows users to identify projects based on their tags. Refer to the
  [Project Tags](../tenant-settings/projects/projects.md#project-tags) section for more information.

- Palette now provides the ability to upgrade the [vCluster version](https://www.vcluster.com/releases/en/changelog) of
  your virtual clusters, allowing you to leverage newly introduced features without having to create new cluster groups
  or migrate workloads. Refer to the [Upgrade Cluster Groups](../clusters/cluster-groups/vcluster-upgrades.md) guide for
  further information.

- Palette has now implemented a mechanism for evacuating and migrating the control planes
  [MAAS clusters using LXD VMs](../clusters/data-center/maas/create-manage-maas-lxd-clusters.md), reducing
  high-availability risks during host repaves. This improvement is critical for Day-2 lifecycle operations such as
  upgrades or repaves.

- The [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) now included the latest
  Terminal User Interface (TUI). For more details, refer to
  [Initial Edge Host Configuration with Palette TUI](../clusters/edge/site-deployment/site-installation/initial-setup.md).

<!-- prettier-ignore-start -->

- Certificate renewal for clusters provisioned using <VersionedLink text="Palette Optimized K3S" url="/integrations/packs/?pack=edge-k3s"/> and <VersionedLink text="RKE2" url="/integrations/packs/?pack=kubernetes-rke2"/> has been enhanced to support triggering externally from Kubernetes. This is applicable for both edge and public cloud clusters.

<!-- prettier-ignore-end -->

#### Bug Fixes

- Fixed an issue that caused
  [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) to sometimes create an
  inconsistent number of LINSTOR resources.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.8.X Palette release is 4.8.X.

:::

#### Improvements

- The Terminal User Interface (TUI) is now always enabled and features a new landing page that displays system
  information. It also adds support for configuring Virtual Local Area Networks (VLANs). The `stylus.includeTui` flag in
  `user-data` has been deprecated as a result of these changes. For more details, refer to
  [Initial Edge Host Configuration with Palette TUI](../clusters/edge/site-deployment/site-installation/initial-setup.md).

- [CanvOS](https://github.com/spectrocloud/CanvOS) now provides support for FIPS-compiled Ubuntu 22.04. This is
  specifically important for users who want to enforce FIPS 140-3 compliance.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4.8.0) for more details.

### Automation

:::info

Check out the [CLI Tools](/downloads/cli-tools/) page to find the compatible version of the Palette CLI.

:::

#### Features

- Terraform version 0.25.3 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.25.3 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) is
  now available.

### Docs and Education

- The new [Find Breaking Changes for Palette Upgrades](./breaking-changes.md) page contains an interactive component
  that allows users to list breaking changes between two Palette releases. Use it as guidance for upgrading dedicated
  SaaS or self-hosted Palette and Palette VerteX installations.

### Packs

#### Pack Notes

<!-- prettier-ignore-start -->

- The <VersionedLink text="Nginx" url="/integrations/packs/?pack=nginx" /> pack is now deprecated. Users should migrat to the new Kgateway pack.

- The <VersionedLink text="Harbor" url="/integrations/packs/?pack=harbor" /> pack version 1.16.2 now supports password auto-generation.

<!-- prettier-ignore-end -->

| Pack Name                 | Layer  | Non-FIPS           | FIPS | New Version |
| ------------------------- | ------ | ------------------ | ---- | ----------- |
| Crossplane                | Add-on | :white_check_mark: | :x:  | 2.0.1       |
| External Secrets Operator | Add-on | :white_check_mark: | :x:  | 0.20.4      |
| Flux2                     | Add-on | :white_check_mark: | :x:  | 2.17.1      |
| Kgateway                  | Add-on | :white_check_mark: | :x:  | 2.2.1       |
| Prometheus Agent          | Add-on | :white_check_mark: | :x:  | 27.42.1     |
| Prometheus - Grafana      | Add-on | :white_check_mark: | :x:  | 79.0.1      |
| Reloader                  | Add-on | :white_check_mark: | :x:  | 1.4.10      |
| Ubuntu (vSphere)          | OS     | :white_check_mark: | :x:  | 24.04       |
| Ubuntu (Azure)            | OS     | :white_check_mark: | :x:  | 24.04       |
