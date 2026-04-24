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

## May 3, 2026 - Release 4.9.0 {#release-notes-4-9-0}

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4-9-0}

#### Breaking Changes {#breaking-changes-4-9-0}

#### Features

<!-- https://spectrocloud.atlassian.net/browse/DOC-2726 -->

- The `iam:ListRoleTags` permission has been added to the
  [Core IAM Policies](../clusters/public-cloud/aws/required-iam-policies/core-iam-policies.md) as part of the
  **PaletteDeploymentPolicy**. This permission allows Palette to propagate tags to IAM Roles for Service Accounts (IRSA)
  roles it creates.

<!-- https://spectrocloud.atlassian.net/browse/PEM-7485 -->

- Kubeconfig file contents for workload clusters can now be copied to the clipboard by selecting the **Copy** icon
  beside the **Kubeconfig File** or **Admin Kubeconfig File** download link. Refer to our
  [Kubeconfig](../clusters/cluster-management/kubeconfig.md) and
  [Kubectl](../clusters/cluster-management/palette-webctl.md) guides for more information.

<!-- https://spectrocloud.atlassian.net/browse/DOC-2774 -->

- The `compute.zoneOperations.get` and `compute.zoneOperations.list` permissions have been added to GCP
  [Required IAM Permissions](../clusters/public-cloud/gcp/required-permissions.md). These permissions allow Palette to
  optimize the cluster creation process.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PEM-7095 -->

- The **Context** field on the cluster **Overview** tab now contains a hyperlink to the cluster's parent project. This
  link is available from the Tenant Admin scope only.

#### Deprecations and Removals

- Amazon Linux 2 (AL2) AMIs have been disabled in Palette. You will not be able to create new EKS clusters with AL2
  worker nodes. For existing EKS clusters, you must create new worker nodes using AL2023 AMIs. Existing AL2 AMI worker
  nodes will no longer receive bug fixes or security patches. Refer to our
  [Scenario - Unable to Upgrade EKS Worker Nodes from AL2 to AL2023](../troubleshooting/cluster-deployment.md#scenario---unable-to-upgrade-eks-worker-nodes-from-al2-to-al2023)
  guide for help with migrating workloads.

  - In addition, Kubernetes upgrades to v1.33 and later are not supported on EKS clusters with AL2 worker nodes. If you
    want to upgrade your cluster to v1.33 or later, you must first migrate your workloads to AL2023 worker nodes.

- Support for Red Hat Enterprise Linux (RHEL) 8.x in Edge workflows has been deprecated, including FIPS-enabled
  configurations. Use RHEL 9.x or RHEL 10.x instead.

- Support for Ubuntu 20.04 in Edge workflows has been deprecated, including FIPS-enabled configurations. Use Ubuntu
  24.04, as it is FIPS 140-3 compliant.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10602 -->

- Ingress Nginx, a
  [deprecated Kubernetes project](https://www.kubernetes.dev/blog/2025/11/12/ingress-nginx-retirement/), is now
  deprecated in Palette. Traefik is the default ingress controller for Palette management clusters starting with Palette
  4.8.47. For self-hosted Palette environments
  [installed using Helm charts](../enterprise-version/install-palette/install-on-kubernetes/install-on-kubernetes.md), set
  `ingress.type` to `traefik` to avoid service disruptions. Refer to
  [Helm Configuration Reference](../enterprise-version/install-palette/install-on-kubernetes/palette-helm-ref.md) for
  more information.

  If you have made custom modifications to the Ingress Nginx configuration in your self-hosted environment, such as
  custom annotations, load balancer settings, or Transport Layer Security (TLS) configurations, these customizations may not carry over
  automatically and could affect your deployment. Review your ingress configuration before upgrading and
  [contact our Support team](https://support.spectrocloud.io/) if you need assistance migrating custom ingress settings
  to Traefik. For installations configured to use DNS, you must also update your records to point to the new Traefik
  `LoadBalancer` service after upgrading. Refer to the
  [Upgrade Palette on Kubernetes](../enterprise-version/upgrade/upgrade-k8s/non-airgap.md) guide for details.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.0 Palette release is 4.9.0.

:::

#### Features

#### Improvements

- [Local UI](../clusters/edge/local-ui/local-ui.md) now supports multiline and dropdown
  [cluster profile variable](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
  types.
- Pluggable Authentication Modules (PAM) policy enforcement is now enabled, including password expiry checks, which can
  be set using the `stylus.site.users[*].passwordExpiry`
  [user data](../clusters/edge/edge-configuration/installer-reference.md) field. For examples of configuring PAM via the
  Dockerfile, refer to
  [Build Edge Artifacts - Advanced workflow](../clusters/edge/edgeforge-workflow/palette-canvos/palette-canvos.md?difficulty=advanced_create_artifacts).
- Edge workflows have been updated to Kairos v4.0.3. A [known issue](known-issues.md) prevents this update from applying
  to [Unified Kernel Image (UKI)-based Trusted Boot images](../clusters/edge/trusted-boot/trusted-boot.md), which remain
  on Kairos v3.5.9. This does not impact functionality.

#### Bug Fixes

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4-9-0) for more details.

### Automation

:::info

Check out the [CLI Tools](/downloads/cli-tools/) page to find the compatible version of the Palette CLI.

:::

#### Features

- Terraform version 4.9.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 4.9.0 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) is
  now available.

#### Improvements

- The Palette CLI [`content build`](../automation/palette-cli/commands/content.md#build) command now supports the
  environment variable `INCLUDE_COMPLIANCE_IMAGES`. When the variable is set to `true`, the resulting content bundle
  includes additional container images required for compliance scanning.

### Docs and Education

<!-- https://spectrocloud.atlassian.net/browse/DOC-2527 -->

- A new [Enable AI Workloads with the NVIDIA GPU Operator Pack](../ai-workloads/nvidia-gpu-operator.md) guide is now
  available. Follow it to verify that GPU workloads can run in your clusters.

<!-- https://spectrocloud.atlassian.net/browse/DOC-2598 -->

- <TpBadge /> The [Palette MCP Server](../automation/palette-mcp/palette-mcp.md) allows you to use Large Language Models
  (LLMs) to interact with the Palette API. Refer to the [Get Started with the Palette MCP
  Server](../tutorials/ai/palette-mcp/get-started-palette-mcp.md) and [Integrate Palette MCP in an Agentic
  Workflow](../tutorials/ai/palette-mcp/integrate-palette-mcp-agentic.md) tutorials to learn how to incorporate the
  Palette MCP server into your workflows.

### Packs

#### Pack Notes

#### OS

| Pack Name | New Version |
| --------- | ----------- |

#### Kubernetes

| Pack Name | New Version |
| --------- | ----------- |

#### CNI

| Pack Name | New Version |
| --------- | ----------- |

#### CSI

| Pack Name | New Version |
| --------- | ----------- |

#### Add-on Packs

| Pack Name | New Version |
| --------- | ----------- |

#### FIPS Packs

| Pack Name | New Version |
| --------- | ----------- |

#### Deprecations and Removals
