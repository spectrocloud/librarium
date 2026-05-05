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

## May 3, 2026 - Release 4.9.5 {#release-notes-4-9-0}

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4-9-0}

#### Breaking Changes {#breaking-changes-4-9-0}

<!-- https://spectrocloud.atlassian.net/browse/PEM-10236 -->

- [AWS GovCloud](../clusters/public-cloud/aws/add-aws-accounts.md#aws-govcloud) and
  [Azure Government cloud](../clusters/public-cloud/azure/azure-cloud.md#azure-government-cloud) are now disabled in the
  Palette UI. To use AWS GovCloud or Azure Government cloud in Palette, you must do so via the
  [Palette API](/api/category/palette-api-v1/),
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs), or
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette);
  however, these methods will be removed in an [upcoming release](./announcements.md#upcoming-breaking-changes). To
  continue deploying and managing clusters using AWS GovCloud or Azure Government cloud, we recommend using
  [Palette VerteX](../vertex/vertex.md) instead.

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PCP-4778 -->

- <TpBadge /> Deployment of OpenShift clusters on MAAS using HyperShift host clusters is now supported. Refer to the
  [Create and Manage MAAS OpenShift
  Clusters](../clusters/data-center/maas/create-manage-maas-openshift-clusters-hypershift/create-manage-maas-openshift-clusters-hypershift.md)
  guide for more information.

<!-- https://spectrocloud.atlassian.net//browse/PCP-5570 -->
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

<!-- https://spectrocloud.atlassian.net/browse/PEM-9357 -->

- GitHub Container Registry (GHCR) is now a supported Open Container Initiative (OCI) Helm registry in Palette. Refer to
  [Add OCI Helm Registry](../registries-and-packs/registries/oci-registry/add-oci-helm.md) for details on how to add
  GHCRs to Palette and
  [Add a Helm Chart](../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-helm-addon.md) for
  how to use GHCR-sourced Helm charts in your clusters.

<!-- https://spectrocloud.atlassian.net/browse/DOC-2774 -->

- The `compute.zoneOperations.get` and `compute.zoneOperations.list` permissions have been added to GCP
  [Required IAM Permissions](../clusters/public-cloud/gcp/required-permissions.md). These permissions allow Palette to
  optimize the cluster creation process.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10389 -->

- Palette now supports
  [EKS Pod Identity](https://aws.amazon.com/blogs/containers/amazon-eks-pod-identity-a-new-way-for-applications-on-eks-to-obtain-iam-credentials/)
  for [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/) authentication. Refer to the
  [Configure EKS Pod Identity for ECR Registries](../clusters/public-cloud/aws/enable-pod-identity-ecr.md) guide for
  more information.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5801 -->

- Palette now supports the option to skip worker node upgrades on
  [MAAS](../clusters/data-center/maas/create-manage-maas-clusters.md) and
  [VMware vSphere](../clusters/data-center/vmware/create-manage-vmware-clusters.md) clusters. For example, if you have
  worker pools running critical databases or real-time processing services, you can enable this option to maintain
  service continuity during control plane upgrades, then schedule
  [worker node updates](../clusters/cluster-management/cluster-updates.md#trigger-worker-node-upgrade) during planned
  maintenance windows.

  The version difference between the control plane and worker nodes must not exceed the
  [N-3 minor version skew supported by Kubernetes](https://kubernetes.io/releases/version-skew-policy/). Palette
  enforces this during cluster profile updates and blocks you from updating if you attempt to exceed the N-3 threshold.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PEM-10373 -->

- The **Cloud Type** options for [imported clusters](../clusters/imported-clusters/imported-clusters.md) have been
  updated for clarity (**AWS IaaS**, **Azure IaaS**, **GCP IaaS**, and **Generic**). Users should now select **Generic**
  when importing AWS EKS-Anywhere, OpenShift, and VMware vSphere clusters.

<!-- https://spectrocloud.atlassian.net/browse/PEM-7095 -->

- The **Context** field on the cluster **Overview** tab now contains a hyperlink to the cluster's parent project. This
  link is available from the Tenant Admin scope only.

#### Deprecations and Removals

<!-- https://spectrocloud.atlassian.net//browse/PCP-5494 -->

- Amazon Linux 2 (AL2) AMIs have been disabled in Palette. You will not be able to create new EKS clusters with AL2
  worker nodes. For existing EKS clusters, you must create new worker nodes using AL2023 AMIs. Existing AL2 AMI worker
  nodes will no longer receive bug fixes or security patches. Refer to our
  [Scenario - Unable to Upgrade EKS Worker Nodes from AL2 to AL2023](../troubleshooting/cluster-deployment.md#scenario---unable-to-upgrade-eks-worker-nodes-from-al2-to-al2023)
  guide for help with migrating workloads.

  - In addition, Kubernetes upgrades to v1.33 and later are not supported on EKS clusters with AL2 worker nodes. If you
    want to upgrade your cluster to v1.33 or later, you must first migrate your workloads to AL2023 worker nodes.

<!-- https://spectrocloud.atlassian.net//browse/PE-8280 -->

- Support for Red Hat Enterprise Linux (RHEL) 8.x in Edge workflows has been deprecated, including FIPS-enabled
  configurations. Use RHEL 9.x or RHEL 10.x instead.

- Support for Ubuntu 20.04 in Edge workflows has been deprecated, including FIPS-enabled configurations. Use Ubuntu
  24.04, as it is FIPS 140-3 compliant.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10602 -->

- The internal [Ingress Nginx](https://www.kubernetes.dev/blog/2025/11/12/ingress-nginx-retirement/) controller used by
  Palette management plane services is now [deprecated](./announcements.md#deprecations). Traefik replaced Nginx as the
  default management cluster ingress controller starting with Palette 4.8.47. For self-hosted Palette environments
  [installed using Helm charts](../enterprise-version/install-palette/install-on-kubernetes/install-on-kubernetes.md),
  set `ingress.type` to `traefik` to avoid service disruptions. Refer to
  [Helm Configuration Reference](../enterprise-version/install-palette/install-on-kubernetes/palette-helm-ref.md) for
  more information.

  If you have made custom modifications to the Ingress Nginx configuration in your self-hosted environment, such as
  custom annotations, load balancer settings, or Transport Layer Security (TLS) configurations, these customizations may
  not carry over automatically and could affect your deployment. Review your ingress configuration before upgrading and
  [contact our Support team](https://support.spectrocloud.io/) if you need assistance migrating custom ingress settings
  to Traefik. For installations configured to use DNS, you must also update your records to point to the new Traefik
  `LoadBalancer` service after upgrading. Refer to the
  [Upgrade Palette on Kubernetes](../enterprise-version/upgrade/upgrade-k8s/non-airgap.md) guide for details.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10575 -->

- The `/clusterprofiles`[API endpoint](/api/introduction) is now deprecated. Use the `/dashboard/clusterprofiles`
  endpoint instead, which includes improved data retrieval capabilities.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PEM-10647 -->

- Fixed an issue that prevented clusters from being deployed when gRPC ports are blocked and WebSocket is used as a
  fallback.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10634 -->

- Fixed an issue that prevented clusters from being deployed or managed using
  [cluster templates](../cluster-templates/cluster-templates.md) if the cluster was scoped to a project different from
  the one the template was created in.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6470 -->

<!-- prettier-ignore-start -->

- Fixed an issue in [self-hosted Palette](../enterprise-version/enterprise-version.md) and [Palette VerteX](../vertex/vertex.md)
  that caused workload clusters deployed with <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> version 1.34.3 or later to fail
  to pull images through configured [registry mirrors](../enterprise-version/system-management/registry-override.md). 

<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PEM-10556 -->

- Fixed an issue that caused [cluster profile](../profiles/cluster-profiles/cluster-profiles.md) updates to fail with
  `Manifest <UID> is not found in the project` errors.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10448 -->
<!-- https://spectrocloud.atlassian.net/browse/PEM-10431 -->

- Fixed an issue that caused the Palette UI to crash when creating or editing
  [cluster profiles](../profiles/cluster-profiles/cluster-profiles.md) with empty or missing version fields.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10381 -->

- Fixed an issue that caused the **Save Changes** button to remain disabled when editing an imported
  [cluster profile](../profiles/cluster-profiles/cluster-profiles.md) containing an empty manifest.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6311 -->

- Fixed an issue that caused the Velero Helm release to fail when enabling
  [cluster backups](../clusters/cluster-management/backup-restore/backup-restore.md) using Azure as the backup storage
  location.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6310 -->

- Fixed an issue that prevented
  [backup storage location](../clusters/cluster-management/backup-restore/backup-restore.md) credential and
  configuration updates from being propagated to workload clusters, causing backups to fail.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10285 -->

- Fixed an issue that caused creating or updating [VMware vSphere](../clusters/data-center/vmware/vmware.md) node pools
  after initial cluster deployment to lose cluster-level datacenter, folder, and image template folder settings.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6217 -->

- Fixed an issue that caused EKS Pod Identity job failures in clusters using
  [image swap](../clusters/cluster-management/image-swap.md).

<!-- https://spectrocloud.atlassian.net/browse/PEM-9996 -->

- Fixed an issue that caused repeated false pack update notifications on
  [cluster profiles](../profiles/cluster-profiles/cluster-profiles.md) when no changes were made to the pack or profile.

<!-- https://spectrocloud.atlassian.net/browse/PCP-4372 -->

- Fixed an issue that caused cluster status fields to display Go pointer values instead of actual values.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.5 Palette release is 4.9.4.

:::

#### Features

#### Improvements

<!-- https://spectrocloud.atlassian.net//browse/PE-7582 -->
<!-- https://spectrocloud.atlassian.net//browse/PE-7583 -->

- [Local UI](../clusters/edge/local-ui/local-ui.md) now supports multiline and dropdown
  [cluster profile variable](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
  types. Dropdown profile variables are not supported for airgapped Local UI clusters.

<!-- https://spectrocloud.atlassian.net//browse/PE-8122 -->
<!-- https://spectrocloud.atlassian.net//browse/PE-7779 -->

- Pluggable Authentication Modules (PAM) policy enforcement is now enabled, including password expiry checks, which can
  be set using the `stylus.site.users[*].passwordExpiry`
  [user data](../clusters/edge/edge-configuration/installer-reference.md) field. For examples of configuring PAM via the
  Dockerfile, refer to
  [Build Edge Artifacts - Advanced workflow](../clusters/edge/edgeforge-workflow/palette-canvos/palette-canvos.md?difficulty=advanced_create_artifacts).

<!-- https://spectrocloud.atlassian.net//browse/PE-8215 -->
<!-- https://spectrocloud.atlassian.net//browse/PE-8512 -->

- Edge workflows have been updated to Kairos v4.0.3. Due to upstream changes, this update does not apply to
  [Unified Kernel Image (UKI)-based Trusted Boot images](../clusters/edge/trusted-boot/trusted-boot.md), which remain on
  Kairos v3.5.9. This does not impact functionality.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-373 -->

- The [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) ISOs now include
  `/opt/spectrocloud/bin` in the default `PATH`, making kubectl and Helm immediately available for debugging and
  operations.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PE-8328 -->

- Fixed an issue that caused nodes deleted via `kubectl` to remain visible in the Palette UI, resulting in duplicate
  entries when the node rejoined the cluster.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4-9-0) for more details.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PEM-10334 -->

- Fixed an issue that caused upgrading [self-hosted Palette VerteX](../vertex/vertex.md) installations earlier than
  4.6.12 to fail due to legacy MongoDB values.

### Automation

:::info

Check out the [CLI Tools](/downloads/cli-tools/) page to find the compatible version of the Palette CLI.

:::

#### Features

- Terraform version 0.29.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.29.0 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) is
  now available.

#### Improvements

- The Palette CLI [`content build`](../automation/palette-cli/commands/content.md#build) command now supports the
  environment variable `INCLUDE_COMPLIANCE_IMAGES`. When the variable is set to `true`, the resulting content bundle
  includes additional container images required for compliance scanning.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-255 -->

- The [Artifact Studio](../downloads/artifact-studio.md) UI has been refactored to refer to VerteX as
  [Palette VerteX](../vertex/vertex.md).

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PLT-2207 -->

- Fixed an issue that caused unnecessary in place updates on the
  [`spectrocloud_sso` Terraform resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/sso)
  when configuration had not changed.

### Docs and Education

- A new [Enable AI Workloads with the NVIDIA GPU Operator Pack](../ai-workloads/nvidia-gpu-operator.md) guide is now
  available. Follow it to verify that GPU workloads can run in your clusters.

<!-- https://spectrocloud.atlassian.net/browse/DOC-2598 -->

- <TpBadge /> The [Palette MCP Server](../automation/palette-mcp/palette-mcp.md) allows you to use Large Language Models
  (LLMs) to interact with the Palette API. Refer to the [Get Started with the Palette MCP
  Server](../tutorials/ai/palette-mcp/get-started-palette-mcp.md) and [Integrate Palette MCP in an Agentic
  Workflow](../tutorials/ai/palette-mcp/integrate-palette-mcp-agentic.md) tutorials to learn how to incorporate the
  Palette MCP server into your workflows.

<!-- https://spectrocloud.atlassian.net/browse/DOC-765 -->

- The [Security Advisories](../security-bulletins/security-advisories/security-advisories.md) page can now be followed
  using our [Security Advisories RSS feed](https://docs.spectrocloud.com/security-advisories.xml). Subscribe to it using
  your favorite application.

### Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-3974 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-3980 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4002 -->

| Pack Name                   | Layer      | Non-FIPS           | FIPS               | New Version |
| --------------------------- | ---------- | ------------------ | ------------------ | ----------- |
| Calico                      | CNI        | :x:                | :white_check_mark: | 3.31.5      |
| Calico Network Policy       | Add-on     | :white_check_mark: | :x:                | 3.31.5      |
| Cilium                      | CNI        | :white_check_mark: | :x:                | 1.19.3      |
| External Secrets            | Add-on     | :white_check_mark: | :x:                | 2.3.0       |
| Flannel                     | CNI        | :white_check_mark: | :x:                | 0.28.4      |
| Flux2                       | Add-on     | :white_check_mark: | :x:                | 2.18.3      |
| Istio                       | Add-on     | :white_check_mark: | :x:                | 1.29.2      |
| Open Observe                | Add-on     | :white_check_mark: | :x:                | 0.70.3      |
| Palette eXtended Kubernetes | Kubernetes | :white_check_mark: | :white_check_mark: | 1.35.3      |
| Palette eXtended Kubernetes | Kubernetes | :white_check_mark: | :white_check_mark: | 1.34.6      |
| Palette eXtended Kubernetes | Kubernetes | :white_check_mark: | :white_check_mark: | 1.33.10     |
| Prometheus Agent            | Add-on     | :white_check_mark: | :x:                | 29.2.1      |
| Prometheus Operator         | Add-on     | :white_check_mark: | :x:                | 83.5.0      |
| vSphere CSI                 | CSI        | :x:                | :white_check_mark: | 3.7.0       |

#### Pack Notes

<!-- https://spectrocloud.atlassian.net/browse/PEM-10660 -->
<!-- https://spectrocloud.atlassian.net/browse/DOC-2729 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4022 -->

- <TpBadge /> Headlamp is now available. It provides a web-based Kubernetes UI for cluster management and monitoring.
  Refer to the [Headlamp](../clusters/cluster-management/headlamp.md) guide for more information.

- The <VersionedLink text="KubeVirt" url="/integrations/packs/?pack=kubevirt" /> and
  <VersionedLink text="KubeVirt-CDI" url="/integrations/packs/?pack=kubevirt-cdi" /> packs are now deprecated.
