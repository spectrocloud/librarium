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

## August 17, 2026 - Release 4.9.46

<!-- PATCH RELEASE TICKET: DOC-3113 -->

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PVM-976 -->

- The Palette Virtual Machine Orchestrator (VMO) pack now uses the FIPS build of the `spectro-kubectl` image for every
  Helm hook and job that it ships. The FIPS image is also included in the pack's image list, so airgap content bundles
  carry it.

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PE-9154 -->

- Fixed a race condition between k3s service startup and Palette Edge cluster configuration writes that caused cluster
  DNS to fail on slow-network boots, preventing Harbor and Harbor-dependent add-ons from coming up.

<!-- https://spectrocloud.atlassian.net/browse/PE-9239 -->

- Fixed an image reference mismatch between `docker.io` and `index.docker.io` in containerd 2.1.4 that caused Longhorn
  manager and driver-deployer pods to enter `ImagePullBackOff` on edge appliances without outbound Docker Hub access.

<!-- https://spectrocloud.atlassian.net/browse/PE-9263 -->

- Fixed an issue where content bundles uploaded via the Local UI were not synced, leaving packs and images unavailable
  after a successful upload.

<!-- https://spectrocloud.atlassian.net/browse/PVM-1035 -->

- Fixed an issue where upgrading the `virtual-machine-orchestrator` pack failed with an `invalid ownership metadata`
  error on clusters that already carried VMO Role-Based Access Control (RBAC) objects without Helm ownership metadata.
  The pack now applies the required metadata to those objects in a pre-upgrade hook, so Helm adopts them instead of
  stopping the upgrade. Refer to [Troubleshooting the VMO Pack](../vm-management/vmo-pack/troubleshooting.md) for the
  manual procedure that applies when you upgrade to a pack version that predates this fix.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.46 Palette release is 4.9.37.

:::

### Automation

:::info

The [Palette CLI](../automation/palette-cli/palette-cli.md) version corresponding to the 4.9.46 Palette release is
4.9.19. Refer to [CLI Tools](/downloads/cli-tools/) for the download URL and checksum.

:::

## August 14, 2026 - Component Updates {#component-updates-2026-33}

<!-- COMPONENT UPDATES TICKET: DOC-3104 -->
<!-- RELEASE DATE: August 14, 2026 -->
<!-- RELEASE MANAGEMENT APPLIANCE: 4.9.44 -->
<!-- RELEASE ARTIFACT STUDIO: - -->
<!-- RELEASE TERRAFORM VERSION: - -->

The following components have been updated for Palette version 4.9.5 - 4.9.44.

| Component                                                                                             | Version |
| ----------------------------------------------------------------------------------------------------- | ------- |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) | 4.9.44  |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)        | 4.9.44  |

<!-- BEGIN COMPONENT UPDATES BODY: DOC-3104. DO NOT DELETE. -->

### Deprecations and Removals

<!-- https://spectrocloud.atlassian.net/browse/PAC-4496 -->
<!-- prettier-ignore-start -->

- The **Spectro Kubernetes Dashboard** and **Kubernetes Dashboard** packs have moved to the _Disabled_ deprecation stage, as the upstream projects are archived. These packs are no longer available for selection when you create a cluster profile. You can still launch new clusters from existing cluster profiles that contain either pack, and active clusters are not affected. Both packs are scheduled for removal from Palette on November 14, 2026. Refer to [Pack Deprecations](../integrations/maintenance-policy.md#pack-deprecations) for a description of each deprecation stage.

<!-- prettier-ignore-end -->

<!-- END COMPONENT UPDATES BODY: DOC-3104. DO NOT DELETE. -->

### Packs

<!-- BEGIN PACKS LIST BODY: DOC-3104. DO NOT DELETE. -->
<!-- prettier-ignore-start -->

| Pack Name | Layer | Non-FIPS | FIPS | New Version |
| --------- | ----- | -------- | ---- | ----------- |
| <VersionedLink text="argo-cd" url="/integrations/packs/?pack=argo-cd" /> | `addon` | :white_check_mark: | :x: | 10.3.2 |
| <VersionedLink text="aws-alb" url="/integrations/packs/?pack=aws-alb" /> | `addon` | :white_check_mark: | :x: | 3.5.0 |
| <VersionedLink text="cni-flannel" url="/integrations/packs/?pack=cni-flannel" /> | `cni` | :white_check_mark: | :x: | 0.28.9 |
| <VersionedLink text="csi-azure" url="/integrations/packs/?pack=csi-azure" /> | `csi` | :white_check_mark: | :x: | 1.34.5 |
| <VersionedLink text="csi-local-path-provisioner" url="/integrations/packs/?pack=csi-local-path-provisioner" /> | `csi` | :white_check_mark: | :x: | 0.0.37 |
| <VersionedLink text="csi-local-path-provisioner-addon" url="/integrations/packs/?pack=csi-local-path-provisioner-addon" /> | `addon` | :white_check_mark: | :x: | 0.0.37 |
| <VersionedLink text="csi-longhorn" url="/integrations/packs/?pack=csi-longhorn" /> | `csi` | :white_check_mark: | :x: | 1.12.0 |
| <VersionedLink text="csi-longhorn-addon" url="/integrations/packs/?pack=csi-longhorn-addon" /> | `addon` | :white_check_mark: | :x: | 1.12.0 |
| <VersionedLink text="csi-portworx-generic" url="/integrations/packs/?pack=csi-portworx-generic" /> | `csi` | :white_check_mark: | :x: | 3.6.2 |
| <VersionedLink text="csi-rook-ceph-helm" url="/integrations/packs/?pack=csi-rook-ceph-helm" /> | `csi` | :white_check_mark: | :x: | 1.20.3 |
| <VersionedLink text="csi-rook-ceph-helm-addon" url="/integrations/packs/?pack=csi-rook-ceph-helm-addon" /> | `addon` | :white_check_mark: | :x: | 1.20.3 |
| <VersionedLink text="csi-vsphere-csi" url="/integrations/packs/?pack=csi-vsphere-csi" /> | `csi` | :white_check_mark: | :white_check_mark: | 3.7.3 |
| <VersionedLink text="external-secrets-operator" url="/integrations/packs/?pack=external-secrets-operator" /> | `addon` | :white_check_mark: | :x: | 2.9.0 |
| <VersionedLink text="headlamp" url="/integrations/packs/?pack=headlamp" /> | `addon` | :white_check_mark: | :x: | 0.44.0 |
| <VersionedLink text="piraeus-operator" url="/integrations/packs/?pack=piraeus-operator" /> | `csi` | :white_check_mark: | :x: | 2.10.8-rev1 |
| <VersionedLink text="piraeus-operator-addon" url="/integrations/packs/?pack=piraeus-operator-addon" /> | `addon` | :white_check_mark: | :x: | 2.10.8-rev1 |
| <VersionedLink text="portworx-add-on" url="/integrations/packs/?pack=portworx-add-on" /> | `addon` | :white_check_mark: | :x: | 3.6.2 |
| <VersionedLink text="prometheus-agent" url="/integrations/packs/?pack=prometheus-agent" /> | `addon` | :white_check_mark: | :x: | 29.24.0 |
| <VersionedLink text="prometheus-operator" url="/integrations/packs/?pack=prometheus-operator" /> | `addon` | :white_check_mark: | :x: | 88.3.0 |
| <VersionedLink text="reloader" url="/integrations/packs/?pack=reloader" /> | `addon` | :white_check_mark: | :x: | 1.4.21 |
| <VersionedLink text="traefik" url="/integrations/packs/?pack=traefik" /> | `addon` | :white_check_mark: | :x: | 41.2.0 |
| <VersionedLink text="zot-registry" url="/integrations/packs/?pack=zot-registry" /> | `addon` | :x: | :white_check_mark: | 0.1.117-rev2 |

<!-- prettier-ignore-end -->

<!-- END PACKS LIST BODY: DOC-3104. DO NOT DELETE. -->

## August 12, 2026 - Release 4.9.44

The following component updates are applicable to this release:

- [August 14, 2026 - Component Updates](#component-updates-2026-33) <!-- omit in toc -->

<!-- PATCH RELEASE TICKET: DOC-3110 -->

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PCP-7384 -->

- Fixed an issue where the CAPMAAS power-state reconciler incorrectly treated transient BMC query failures (error or
  unknown states) as "powered off," causing healthy running nodes to be unexpectedly power-cycled.

## August 11, 2026 - Release 4.9.43

<!-- PATCH RELEASE TICKET: DOC-3099 -->

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PEM-11528 -->

- Applied security fixes for the 4.9.43 release train to improve platform security posture.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11618 -->

- AWS Marketplace subscription flow now calls `ResolveCustomer` and `GetEntitlements` at the initial redirect, before
  registration, ensuring entitlement data is captured correctly and enabling the contract-priced listing to pass AWS
  buyer-experience validation.

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PCP-7357 -->

- Fixed an issue where Nutanix cluster deployments became stuck in a `CrashLoopBackOff` because the
  `palette-controller-manager` did not reinstall `cert-manager` when the `Certificate` CRD was missing from a partial
  install.

<!-- https://spectrocloud.atlassian.net/browse/PCP-7360 -->

- Fixed a `kubectl` output-streaming deadlock in Jet that caused reconcile workers to hang indefinitely when a manifest
  apply failed with an oversized `stderr` payload, leaving cluster provisioning stuck at `InstallingManifests` with no
  error surfaced to the UI.

<!-- https://spectrocloud.atlassian.net/browse/PCP-7369 -->

- Fixed an issue where the CMA-bundled Kyverno reconciler incorrectly adopted and attempted to upgrade
  customer-installed Kyverno add-on packs, causing an infinite Helm upgrade and rollback loop.

<!-- https://spectrocloud.atlassian.net/browse/PE-9255 -->

- Fixed an issue where Stylus created the `SpectroCluster` CRD with an incorrect pack type of `oci` instead of `ociPack`
  for OS packs, causing `palette-lite` to misclassify the pack as a Helm chart and produce transient `403` errors during
  cluster bring-up.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11659 -->

- Fixed an increase in `msgbroker` service errors and pod restarts introduced in 4.9.38 caused by invalid broker
  authentication token signature validation.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2336 -->

- Fixed vSphere PCG deployments behind a whitelist proxy hanging at `WaitingForKubeadmInit` due to the proxy CA
  certificate never being written to the control-plane VM, which caused containerd image pull failures with an x509
  certificate verification error.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.43 Palette release is 4.9.36.

:::

### Automation

:::info

The [Palette CLI](../automation/palette-cli/palette-cli.md) version corresponding to the 4.9.43 Palette release is
4.9.18. Refer to [CLI Tools](/downloads/cli-tools/) for the download URL and checksum.

:::

## August 7, 2026 - Component Updates {#component-updates-2026-32}

<!-- COMPONENT UPDATES TICKET: DOC-3087 -->
<!-- RELEASE DATE: August 7, 2026 -->
<!-- RELEASE MANAGEMENT APPLIANCE: 4.9.41 -->
<!-- RELEASE ARTIFACT STUDIO: 0 -->
<!-- RELEASE TERRAFORM VERSION: 0 -->

The following components have been updated for Palette version 4.9.5 - 4.9.41.

| Component                                                                                             | Version |
| ----------------------------------------------------------------------------------------------------- | ------- |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) | 4.9.41  |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)        | 4.9.41  |

<!-- BEGIN COMPONENT UPDATES BODY: DOC-3087. DO NOT DELETE. -->

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PAC-4415 -->

- The Kyverno pack has been upgraded from v1.12.2 to v1.18, bringing the latest Kyverno policy engine capabilities and
  security improvements to your cluster profiles.

<!-- END COMPONENT UPDATES BODY: DOC-3087. DO NOT DELETE. -->

### Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-4508 -->
<!-- BEGIN PACKS LIST BODY: DOC-3087. DO NOT DELETE. -->
<!-- prettier-ignore-start -->

| Pack Name | Layer | Non-FIPS | FIPS | New Version |
| --------- | ----- | -------- | ---- | ----------- |
| <VersionedLink text="argo-cd" url="/integrations/packs/?pack=argo-cd" /> | `addon` | :white_check_mark: | :x: | 10.2.3 |
| <VersionedLink text="aws-alb" url="/integrations/packs/?pack=aws-alb" /> | `addon` | :white_check_mark: | :x: | 3.4.3 |
| <VersionedLink text="cert-manager" url="/integrations/packs/?pack=cert-manager" /> | `addon` | :white_check_mark: | :white_check_mark: | 1.21.1 |
| <VersionedLink text="cni-cilium-oss" url="/integrations/packs/?pack=cni-cilium-oss" /> | `cni` | :white_check_mark: | :x: | 1.20.0 |
| <VersionedLink text="csi-aws-ebs" url="/integrations/packs/?pack=csi-aws-ebs" /> | `csi` | :white_check_mark: | :white_check_mark: | 1.63.1 |
| <VersionedLink text="edge-k3s" url="/integrations/packs/?pack=edge-k3s" /> | `K8S` | :white_check_mark: | :x: | 1.33.13 |
| <VersionedLink text="edge-k3s" url="/integrations/packs/?pack=edge-k3s" /> | `K8S` | :white_check_mark: | :x: | 1.35.6 |
| <VersionedLink text="edge-k8s" url="/integrations/packs/?pack=edge-k8s" /> | `K8S` | :white_check_mark: | :white_check_mark: | 1.36.2 |
| <VersionedLink text="edge-rke2" url="/integrations/packs/?pack=edge-rke2" /> | `K8S` | :white_check_mark: | :white_check_mark: | 1.33.13 |
| <VersionedLink text="edge-rke2" url="/integrations/packs/?pack=edge-rke2" /> | `K8S` | :white_check_mark: | :white_check_mark: | 1.35.6 |
| <VersionedLink text="harbor" url="/integrations/packs/?pack=harbor" /> | `addon` | :white_check_mark: | :x: | 1.19.2 |
| <VersionedLink text="kubernetes-aks" url="/integrations/packs/?pack=kubernetes-aks" /> | `K8S` | :white_check_mark: | :white_check_mark: | 1.36 |
| <VersionedLink text="kubernetes-eks" url="/integrations/packs/?pack=kubernetes-eks" /> | `K8S` | :white_check_mark: | :white_check_mark: | 1.36 |
| <VersionedLink text="prometheus-agent" url="/integrations/packs/?pack=prometheus-agent" /> | `addon` | :white_check_mark: | :x: | 29.21.0 |
| <VersionedLink text="prometheus-operator" url="/integrations/packs/?pack=prometheus-operator" /> | `addon` | :white_check_mark: | :x: | 88.1.5 |
| <VersionedLink text="traefik" url="/integrations/packs/?pack=traefik" /> | `addon` | :white_check_mark: | :x: | 41.1.0 |

<!-- prettier-ignore-end -->

<!-- END PACKS LIST BODY: DOC-3087. DO NOT DELETE. -->

## August 6, 2026 - Release 4.9.41

The following component updates are applicable to this release:

- [August 7, 2026 - Component Updates](#component-updates-2026-32) <!-- omit in toc -->

<!-- PATCH RELEASE TICKET: DOC-3088 -->

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PCP-7347 -->

- Fixed an issue where the outgoing `palette-controller-manager` pod during a rolling upgrade would re-apply its older
  baked `palette-webhook` manifest, downgrading the webhook and permanently stalling cluster reconciliation.

<!-- https://spectrocloud.atlassian.net/browse/PCP-7341 -->

- Fixed a panic in `palette-lite` that caused add-on pack deployments and cluster profile attachments to silently fail
  on imported clusters using the generic cloud provider.

## July 30, 2026 - Release 4.9.38

The following component updates are applicable to this release:

- [August 7, 2026 - Component Updates](#component-updates-2026-32) <!-- omit in toc -->

<!-- COMPONENT UPDATES TICKETS: DOC-3029, DOC-3020 -->
<!-- RELEASE DATE: July 30, 2026 -->
<!-- RELEASE MANAGEMENT APPLIANCE: 4.9.36 -->
<!-- RELEASE ARTIFACT STUDIO: 4.9.19 -->
<!-- RELEASE TERRAFORM VERSION: 0.29.9 -->

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise

#### Upgrade Notes

<!-- https://spectrocloud.atlassian.net/browse/DOC-2999 -->

- Direct Enterprise Cluster (EC) binary and Palette Management Appliance upgrades from any `4.8.x` release to `4.9.23`
  or later are not supported. The `4.8.x` series ships Kubernetes `1.32.9`, and `4.9.23` and later ship Kubernetes
  `1.34.6`; a single Palette upgrade cannot cross more than one Kubernetes minor version. To reach `4.9.23` or later
  from `4.8.x`, upgrade in two steps.

  1. Upgrade to a `4.9.x` release on Kubernetes `1.33.10`. We recommend `4.9.14`.
  2. After the cluster returns to a healthy state, upgrade to the target `4.9.23` or later release.

  Before starting any Palette upgrade, compare the Kubernetes version of your current release with that of the target
  release. If the delta is two or more minor versions, plan an intermediate upgrade. This constraint does not apply to
  Palette installed via Helm on a customer-managed Kubernetes cluster. For the version-to-Kubernetes mapping and full
  guidance, refer to
  [Kubernetes Version Constraint](../enterprise-version/upgrade/upgrade.md#kubernetes-version-constraint).

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PCP-6527 -->

- Overriding Cluster API (CAPI) properties is now supported on
  [GCP IaaS](../clusters/public-cloud/gcp/create-gcp-iaas-cluster.md),
  [GKE](../clusters/public-cloud/gcp/create-gcp-gke-cluster.md),
  [vSphere](../clusters/data-center/vmware/create-manage-vmware-clusters.md), and
  [MAAS](../clusters/data-center/maas/create-manage-maas-clusters.md) clusters. This allows you to configure advanced
  provider-specific settings not natively exposed by Palette by supplying YAML that targets the underlying CAPI provider
  objects directly. For more information, refer to
  [Override Cluster API (CAPI) Properties](../architecture/override-capi-properties/override-capi-properties.md).

<!-- https://spectrocloud.atlassian.net/browse/PCOM-699 -->

- You can now configure the Spectro Cloud image pull secret for security-hardened images during Day-0 setup of the
  [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md). Provide the value
  through the optional **Image pull secret** profile variable in the **Profile Config** step of Local UI. For more
  information, refer to
  [Configure Image Pull Secret](../enterprise-version/system-management/configure-image-pull-secret.md).

<!-- https://spectrocloud.atlassian.net/browse/DOC-2974 -->

- You can now configure the Spectro Cloud image pull secret for security-hardened images during Day-0 installations
  performed with the Palette CLI, including
  [Palette](../enterprise-version/install-palette/install-on-vmware/install.md),
  [Palette VerteX](../vertex/install-palette-vertex/install-on-vmware/install.md), and
  [Private Cloud Gateway](../clusters/pcg/deploy-pcg/deploy-pcg.md) deployments. For more information, refer to
  [Configure Image Pull Secret](../enterprise-version/system-management/configure-image-pull-secret.md).

- [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) version 4.9.36 are now
  available.

<!-- https://spectrocloud.atlassian.net/browse/DOC-3037 -->
<!-- https://spectrocloud.atlassian.net/browse/PCOM-824 -->

- The [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) now install from a
  smaller **Appliance ISO** paired with a separately downloaded **Content bundle**. The full **Appliance ISO with
  Content** is only available for versions prior to 4.9.36. Refer to
  [Install the Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [Install the VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) for the
  updated installation steps, and to [Artifact Studio](../downloads/artifact-studio.md) for a description of each
  artifact and the MOK Key for Secure Boot per release version.

- [Artifact Studio](../downloads/artifact-studio.md) version 4.9.19 is now available.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PCP-7135 -->

- [Overriding Cluster API (CAPI) properties](../architecture/override-capi-properties/override-capi-properties.md) for
  AWS, Azure, and CloudStack clusters has exited Tech Preview and is now ready for production workloads.

<!-- https://spectrocloud.atlassian.net/browse/PEM-7412 -->

- The [VM Migration Assistant](../vm-management/vm-migration-assistant/create-vm-migration-assistant-profile.md) service
  console now supports authentication with **Custom** OpenID Connect Identity Providers (IdPs), such as Okta or Azure
  Active Directory, alongside Palette OIDC. To enable OIDC, follow the
  [Custom OIDC steps](../vm-management/rbac/configure_OIDC.md#configure-custom-oidc-for-vm-migration-assistant) in your
  third-party IdP.

<!-- https://spectrocloud.atlassian.net/browse/DOC-3008 -->

- Self-hosted installations and upgrades of Palette and Palette VerteX now require Helm client **v3.14.0 or later**.
  Older Helm clients do not wait for pre-upgrade hook resources to finish terminating before recreating them, which can
  cause the `hubble-system` namespace to be deleted mid-upgrade and result in MongoDB data loss. Refer to
  [Install on Kubernetes](../enterprise-version/install-palette/install-on-kubernetes/install.md) and
  [Upgrade Palette Installed with Kubernetes](../enterprise-version/upgrade/upgrade-k8s/non-airgap.md) for the updated
  prerequisites.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6398 -->

- Palette now uses Helm `v4.2.x` internally to install and upgrade Helm-based packs on managed clusters, updated from
  Helm `v3.19.x`. The change is transparent to Palette-managed workflows and requires no user action. Palette validates
  the upgrade path for both new clusters and existing clusters that reach `4.9.38` through a Palette upgrade, and
  Spectro Cloud validates all shipped packs against the new version.

  If you author or maintain your own Helm-based packs, or run `helm` directly against Palette-managed releases, note the
  following Helm 4 changes:

  - Helm 4 rejects fields that are not declared in a Custom Resource Definition (CRD) schema, instead of silently
    discarding them. Server-side apply converts the manifest to a typed object against the CRD's structural schema
    before pruning, so an undeclared field fails the release with
    `failed to create typed patch object (...): <path>: field not declared in schema`. In Helm 3, the API server pruned
    the same field and emitted only a warning, so the release succeeded but the setting never took effect. Audit your
    pack values for stale or misnamed keys before you upgrade to Palette `4.9.38`.

  - Helm 4 removes `helm list --all` and its short-form alias `-a`. `helm list` now reports releases in any status by
    default.

  - `helm upgrade` and `helm rollback` default to `--server-side=auto`, which reuses the apply method of the previous
    revision. A release created by Helm 3 continues to use client-side apply until you explicitly pass
    `--server-side=true`.

  - Helm 4 rejects a chart whose rendered output is empty when a post-renderer is configured, failing with
    `post-renderer "<name>" produced empty output`. This happens when every resource in the chart is gated behind a
    condition that evaluates to `false`. Helm 3 accepted this and recorded the release with no resources.

<!-- https://spectrocloud.atlassian.net/browse/PCP-7101 -->

- [MAAS clusters](../clusters/data-center/maas/create-manage-maas-clusters.md) now support non-Ubuntu operating systems,
  such as Red Hat Enterprise Linux (RHEL), Rocky Linux, and SUSE Linux Enterprise Server (SLES), through the
  [Bring Your Own OS (BYOOS)](../integrations/generic-byoi.mdx#maas-byoos-configuration) pack. Reference a custom image
  with `osImageOverride` as an HTTP(S) URL or the name of an existing MAAS image, and specify `osName` and `osVersion`
  so MAAS recognizes the operating system. This applies to Palette and VerteX, including airgap deployments.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6837 -->

- Custom Resource Definitions (CRDs) in the `cluster.spectrocloud.com` API group now serve a stable `v1` API version
  alongside the existing `v1alpha1`. Existing manifests, tooling, and integrations that reference `v1alpha1` continue to
  work without change. Refer to [Custom Resource Definition API Versions](../architecture/crd-api-versions.md) for more
  information.

<!-- https://spectrocloud.atlassian.net/browse/DOC-2885 -->

- The [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) have exited Tech
  Preview and are now supported for production use. A formal backup and restore procedure is documented for both
  appliances. Refer to
  [Backup and Restore the Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance-backup-restore.md)
  and
  [Backup and Restore the VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance-backup-restore.md).

<!-- https://spectrocloud.atlassian.net/browse/DOC-2885 -->

- The installation steps for the
  [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) now document the
  `LB_HOW` environment variable on the `piraeus-operator` pack, which controls how the Distributed Replicated Block
  Device (DRBD) kernel module is loaded. A new `compile` mode builds the module from source using Dynamic Kernel Module
  Support (DKMS) for OS images that ship with matching kernel headers; the default `shipped_modules` mode remains
  recommended and is the only mode compatible with Secure Boot.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-757 -->

- The [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) installer now features
  a redesigned configuration form that organizes variables into named sections (networking, credentials, certificates,
  and appliance-specific groups) instead of a single flat list. Network interface fields are pre-populated from the host
  environment, TLS certificate fields support one-click generation, and inline validation prevents misconfigured
  deployments from proceeding. The same form renders during day-two operations with all fields pre-filled from the
  current cluster configuration, and only changed fields are updated on submit.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-777 -->

- vCluster is now available at version 0.27.3 in [Artifact Studio](../downloads/artifact-studio.md). Users can deploy
  the updated vCluster ZST package when building virtual cluster environments through Palette.

<!-- https://spectrocloud.atlassian.net/browse/PAC-3652 -->

- Palette eXtended Kubernetes (PXK) versions 1.34 and 1.35 are now available for use with the CAPI Image Builder,
  enabling customers to build CAPI images for the latest supported Kubernetes versions.

<!-- https://spectrocloud.atlassian.net/browse/PAC-4320 -->

- Updated Kubernetes pack versions are available for Palette clusters.

#### Deprecations and Removals

<!-- https://spectrocloud.atlassian.net/browse/PEM-8489 -->

- Emails sent by Palette and VerteX now include a hyperlink to the tenant URL on the tenant name in every template. When
  the same or similar tenant names exist across multiple Palette or VerteX instances, or across regional SaaS instances,
  this makes it clear which tenant the email refers to.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11093 -->

- Palette and VerteX management services now maintain stable memory usage, preventing the gradual memory growth
  previously. Internal cache-invalidation traffic has also been reduced by removing unnecessary acknowledgments on
  broadcast messages, which lowers broker load.

<!-- https://spectrocloud.atlassian.net/browse/PEM-1257 -->

- Removing a Spectro-managed namespace from a cluster's **RBAC** settings or from a **Workspace** now prompts you to
  confirm the action, preventing accidental deletion.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PCP-6689 -->

- Fixed an issue that prevented Kubernetes v1.36 clusters from being created and blocked upgrades from v1.35 to v1.36.
  The Cluster API (CAPI) provider set the `ControlPlaneKubeletLocalMode` feature gate, which was removed in Kubernetes
  v1.36 after graduating to general availability in v1.35, causing `kubeadm` initialization to fail. Palette no longer
  sets this feature gate on v1.36 clusters.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9998 -->

- Fixed an issue in the Palette YAML editor where the **Presets** and **Variables** actions could be hidden behind the
  editor content as you scrolled through a YAML document. The actions now remain visible while scrolling in cluster
  profile creation and edit, cluster creation, and cluster overview flows.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9689 -->

- Fixed an issue where the JSON Web Token (JWT) session token for the Palette and VerteX web UI remained valid after a
  user logged out, which meant the token could still be used to access protected endpoints. Palette and VerteX now
  revoke the JWT on logout and check every request against the revocation list before granting access.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11509 -->

- Fixed an issue where downloading the kubeconfig for an EKS cluster from the Palette UI could fail even though the
  kubeconfig had been uploaded to the management plane and the cluster agent was connected. The management plane now
  recovers the OIDC kubeconfig client registration when it has drifted out of sync, so you can download the kubeconfig
  from the Palette UI as expected.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11429 -->

- Fixed an issue where validating an OCI Helm registry that pointed to a large Harbor project timed out at the 60-second
  server deadline because Palette enumerated the entire catalog to check credentials. Validation now performs a
  lightweight probe that completes in under a second regardless of the number of repositories in the project.

<!-- https://spectrocloud.atlassian.net/browse/PCP-7086 -->

- Fixed an issue where updates to the internal `reach-controller-manager` Deployment did not reach existing management
  clusters because the Deployment was rendered as a Helm pre-install hook and skipped on `helm upgrade`. The Deployment
  is now managed as a standard chart resource so subsequent upgrades apply changes in place.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11299 -->

- Fixed an issue where a pack registry sync could stay in an `InProgress` state for hours when a downstream dependency,
  such as the internal message broker or the upstream OCI registry, stopped responding. Broadcast and registry calls now
  use bounded timeouts, so a stalled dependency causes the sync to fail cleanly and the sync-recovery scheduler resumes
  it on the next interval rather than leaving the registry stuck.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11294 -->

- Fixed an issue where the `maxSurge` and `maxUnavailable` rolling-update overrides for managed Kubernetes clusters
  (AKS, EKS, and GKE) accepted values that the managed control plane never honored, causing confusion. These overrides
  have been removed from the UI, API, Palette Terraform provider, and Palette Crossplane provider for managed Kubernetes
  clusters. Rolling-update configuration remains available for infrastructure-provider clusters.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11286 -->

- Fixed an issue where the teams summary API returned HTTP 500 when a team referenced a user that no longer existed. The
  **Update Team** API now validates every user ID in the request, and the teams summary API skips references to deleted
  users instead of failing.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6938 -->

- Fixed an issue where an AKS system node pool provisioned with an OS SKU of `AzureLinux` was created as Ubuntu on first
  boot and then repaved to Azure Linux on the next reconcile, forcing an unnecessary node roll. The system node pool now
  boots directly with the requested OS SKU, matching the behavior of user node pools.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11154 -->

- Fixed an issue where syncing an OCI Helm registry indexed zero charts when the charts were stored at the repository
  root of the project. The sync now indexes charts at both the project root and nested paths, so OCI Helm registries
  whose charts live at the top level can be synced without additional configuration.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6927 -->

- Fixed an issue where the internal `image-swap` and `reach-controller-manager` pods tolerated the Kubernetes cordon
  taint, which prevented EKS managed node-group upgrades from draining the old nodes and caused EKS to roll the upgrade
  back. These pods no longer tolerate the cordon taint, so managed node-group upgrades complete without rollback.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6924 -->

- Fixed an issue where the `palette-webhook` pod on the Palette and Palette VerteX management cluster tolerated the
  Kubernetes cordon taint, which prevented EKS managed node-group upgrades of the management cluster from draining the
  old nodes and caused EKS to roll the upgrade back. The pod no longer tolerates the cordon taint, so managed node-group
  upgrades of the management cluster complete without rollback.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6895 -->

- Fixed an issue where Palette OS images could fail to boot on Dell PowerEdge servers configured with certain BOSS-N1
  RAID controllers, causing the host to hang on a black screen after the GRUB menu. Refreshed OS images now use a newer
  Linux kernel that supports this hardware.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6935 -->

- Fixed an issue in Palette VerteX where installing the `reach-system` Helm chart alongside `image-swap` failed with
  `ImagePullBackOff` on the `reach-controller-manager` pod, because the chart pointed to non-FIPS images while the
  VerteX airgap bundle only shipped the FIPS variants. The chart now references the FIPS image path that matches the
  airgap bundle.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.38 Palette release is 4.9.34.

:::

#### Upgrade Notes {#upgrade-notes-edge-4-9-c}

<!-- https://spectrocloud.atlassian.net/browse/DOC-3062 -->

- Edge clusters that use an in-cluster image registry serve a TLS certificate with a one-year validity period. On `zot`
  pack version `0.1.89` or earlier, and on `harbor` pack version `1.19.0` or earlier, this certificate does not renew
  automatically and must be rotated manually before each 365-day expiration. When the certificate expires, registry
  connectivity breaks. Clusters can no longer pull images, and workload deployments, scale-out operations, node
  replacements, and cluster repaves fail until the certificate is replaced. At remote or unattended sites, recovery
  often requires on-site intervention during an unplanned outage.

  Palette now supports automatic TLS certificate rotation for both registries through cert-manager integration. After
  you upgrade to `zot` pack version `0.1.89-rev2` or `harbor` pack version `1.19.0-rev1`, cert-manager renews the
  certificate automatically 15 days before it expires, which removes the annual manual rotation and the outage risk that
  comes with missing it.

  We recommend upgrading during your next scheduled maintenance window, prioritizing the clusters closest to one year
  since deployment or since their last manual certificate rotation. The upgrade involves a pack version change and a pod
  restart, so validate it on a non-production cluster first. For upgrade instructions, refer to
  [Enable Automatic TLS Certificate Rotation on the Zot Primary Registry](../clusters/edge/site-deployment/deploy-custom-registries/enable-zot-cert-rotation.md)
  and
  [Enable Automatic TLS Certificate Rotation on the Harbor Primary Registry](../clusters/edge/site-deployment/deploy-custom-registries/enable-harbor-cert-rotation.md).
  If you need help identifying affected clusters, contact [support@spectrocloud.com](mailto:support@spectrocloud.com).

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PE-8687 -->

- Edge hosts can now select a Linux bridge as the management interface in
  [Local UI](../clusters/edge/local-ui/host-management/configure-network-interfaces.md#configure-the-management-interface),
  in addition to physical NICs, bonds, and VLAN child interfaces. You can select a bridge whether or not it has an IP
  address. This supports [VM Launchpad](../vm-management/vm-launchpad/install.md) appliance topologies, where management
  traffic terminates on the bridge itself.

<!-- https://spectrocloud.atlassian.net/browse/PE-8975 -->

- A new [`stylus.applianceType`](../clusters/edge/edge-configuration/installer-reference.md) user data field lets you
  identify an Edge host as an appliance and specify its variant. Supported values are `palette`, `vertex`, `paletteai`,
  `vertexai`, `vm-launchpad`, `vm-launchpad-vertex`, `ai-launchpad`, and `ai-launchpad-vertex`. When set, the value is
  also returned in the [`GET /v1/edge-mgmt/settings`](/api/edge-v1/v-1-settings/) response. The field is omitted for
  regular Edge hosts.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PE-8773 -->

- The **Create Bridge** and **Create Bond** forms in
  [Local UI](../clusters/edge/local-ui/host-management/configure-network-interfaces.md) now include a **None**
  configuration type for L2-only network devices that carry no IP address. Use this option when the bridge or bond
  terminates L3 traffic elsewhere, such as on a VLAN sub-interface or on guest VMs.

<!-- https://spectrocloud.atlassian.net/browse/PE-8845 -->

- When you create a cluster from [Local UI](../clusters/edge/local-ui/cluster-management/create-cluster.md) using an
  Edge installer ISO that contains embedded content and a cluster definition, the **Create cluster** wizard now selects
  **embedded config** by default instead of **Import config**.

<!-- https://spectrocloud.atlassian.net/browse/PE-8718 -->

- Local UI now guides operators through the correct redeploy path after a cluster deletion on Edge hosts with an
  `applianceType` of `paletteai`, `vertexai`, `vm-launchpad`, `vm-launchpad-vertex`, `ai-launchpad`, or
  `ai-launchpad-vertex`. The delete confirmation warns that deletion erases the on-appliance content bundle and reminds
  you to save it off the appliance first. After deletion, Local UI directs you to re-upload the content bundle from the
  [Content](../clusters/edge/local-ui/cluster-management/upload-content-bundle.md) page or reinstall the appliance with
  an installer ISO that contains embedded content. The **Import config** option is hidden for these appliance types
  because uploading a cluster configuration is not a valid recovery path in this mode. For more information, refer to
  [Delete a Cluster](../clusters/edge/local-ui/cluster-management/delete-cluster.md) and
  [Create Local Cluster](../clusters/edge/local-ui/cluster-management/create-cluster.md).

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PE-9096 -->

- Fixed an issue on Palette Edge clusters where the internal `palette-lite-controller-manager` could write an incorrect
  service reference to the `spec.conversion.webhook.clientConfig.service` field of the `cluster.spectrocloud.com` Custom
  Resource Definitions (CRDs), pointing to a service that did not exist. This poisoned the Kubernetes API server watch
  cache and blocked Stylus reconciliation of the `v1alpha1` API version, with errors such as
  `service "webhook-service" not found`. The controller now always sets the correct `palette-webhook-service` reference
  in the `palette-system` namespace.

<!-- https://spectrocloud.atlassian.net/browse/PE-9074 -->

- Fixed an issue on Palette Edge clusters where the control-plane virtual IP managed by `kube-vip` could flap during
  brief periods of elevated storage latency, because Stylus configured `kube-vip` lease timers three times shorter than
  the upstream default. The `kube-vip` lease duration, renew deadline, and retry period now use the upstream defaults of
  15, 10, and 2 seconds, which tolerate transient etcd write stalls on slower storage without failing over the virtual
  IP.

<!-- https://spectrocloud.atlassian.net/browse/PE-8824 -->

- Fixed an issue on two-node Palette Edge clusters where the VNC console for virtual machines disconnected every 30 to
  60 seconds because the bundled Kine binary used a 10-minute watch-progress notification interval, causing the
  Kubernetes API server watch cache to go stale. Stylus now sets a 5-second watch-progress interval on the Kine service,
  and new provider images built with the current CanvOS release ship an updated Kine version.

<!-- https://spectrocloud.atlassian.net/browse/PE-8629 -->

- Fixed an issue where installing Palette Edge on HPE ProLiant servers with SUSE Linux Enterprise Micro 5.5 could fail
  with `Disk /dev/dm-0 does not exist` when the Kairos installer's automatic device selection picked a device-mapper
  pseudo-device instead of a physical disk. The installer now skips device-mapper devices during auto-selection, so
  installations succeed on HPE hardware without setting an explicit `install.device` value in your user data.

<!-- https://spectrocloud.atlassian.net/browse/PE-7650 -->

- Fixed an issue on Palette Edge clusters where a failed Kubernetes minor-version upgrade was not surfaced in the
  Palette UI, which allowed subsequent upgrade attempts to proceed even though the `kubeadm-config` ConfigMap had not
  been updated to the new version. Failed Kubernetes upgrades are now reported to the management plane and block further
  upgrade actions until the underlying failure is resolved.

<!-- https://spectrocloud.atlassian.net/browse/PE-4291 -->

- Fixed an issue on Palette Edge native clusters where manifest files attached to the CNI or CSI infrastructure layer of
  a cluster profile were staged on the host but never applied to the cluster. Attached manifests for both infrastructure
  layers are now applied, and editing an attached manifest triggers a re-apply on the next reconcile.

<!-- https://spectrocloud.atlassian.net/browse/PE-3330 -->

- Fixed an issue on Palette Edge native clusters with the Harbor pack where `palette-webhook` pods could remain in a
  `ContainerStatusUnknown` state after a Kubernetes upgrade because they were not drained from a node before the node
  rebooted. Node drains now complete before an upgrade reboots the node.

### VM Launchpad

#### Improvements {#vm-launchpad-improvements-4.9.c}

<!-- https://spectrocloud.atlassian.net/browse/DOC-3038 -->

- Launchpad for VMs is now [PaletteAI VM Launchpad](../vm-management/vm-launchpad/vm-launchpad.md), with **VM
  Launchpad** as the short name. The rename applies to the product UI, documentation, and marketing materials.
  Documentation pages previously under `/vm-management/launchpad-for-vms/` now serve at `/vm-management/vm-launchpad/`,
  and existing URLs redirect to the new locations.

### VerteX

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PE-8935 -->

- The VerteX Local UI now supports a configurable banner and a pre-login consent acknowledgment popup, both set through
  `customizations.json` during EdgeForge. The banner appears on all Local UI pages including the login screen, and the
  consent popup requires users to acknowledge the notice before authentication. For more information, refer to
  [Customize Local UI Theme](../clusters/edge/local-ui/host-management/theming.md).

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the Palette
  section for more details.

#### Upgrade Notes

<!-- https://spectrocloud.atlassian.net/browse/DOC-2999 -->

- The Kubernetes minor-version constraint on Enterprise Cluster (EC) binary and VerteX Management Appliance upgrades
  from `4.8.x` to `4.9.23` or later applies to Palette VerteX as well. Refer to the Palette Enterprise Upgrade Notes for
  the two-hop upgrade path, and to
  [Kubernetes Version Constraint](../vertex/upgrade/upgrade.md#kubernetes-version-constraint) for the full guidance.

### Automation

:::info

The [Palette CLI](../automation/palette-cli/palette-cli.md) version corresponding to the 4.9.38 Palette release is
4.9.16. Refer to [CLI Tools](/downloads/cli-tools/) for the download URL and checksum.

:::

#### Features

- Terraform version 0.29.9 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.29.9 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) is
  now available.
- The [Palette MCP Server](../automation/palette-mcp/palette-mcp.md) has exited Tech Preview and is now ready for
  production workloads.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PLT-2298 -->

- The Terraform Spectro Cloud provider now supports CAPI passthrough overrides for GCP IaaS, GKE, vSphere, and MAAS
  clusters. You can supply key/value overrides at the cluster and node pool levels for day-zero and day-two operations,
  consistent with the existing passthrough experience for AKS, AWS IaaS, EKS, and CloudStack. This is supported on both
  Palette and Palette VerteX.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PLT-2287 -->

- Fixed an issue in the Palette Terraform provider where changing the version of an add-on cluster profile attached to a
  cluster could cause the underlying add-on packs to uninstall and reinstall instead of updating in place, which briefly
  removed workloads such as Argo CD. Changing the add-on profile version now performs an in-place update and preserves
  the existing pack state.

### Packs

<!-- BEGIN PACKS LIST BODY: DOC-3029 + DOC-3020. DO NOT DELETE. -->
<!-- prettier-ignore-start -->

| Pack Name | Layer | Non-FIPS | FIPS | New Version |
| --------- | ----- | -------- | ---- | ----------- |
| <VersionedLink text="argo-cd" url="/integrations/packs/?pack=argo-cd" /> | `addon` | :white_check_mark: | :x: | 10.2.1 |
| <VersionedLink text="argo-cd" url="/integrations/packs/?pack=argo-cd" /> | `addon` | :white_check_mark: | :x: | 10.1.4 |
| <VersionedLink text="argo-cd" url="/integrations/packs/?pack=argo-cd" /> | `addon` | :white_check_mark: | :x: | 10.1.1 |
| <VersionedLink text="aws-cluster-autoscaler" url="/integrations/packs/?pack=aws-cluster-autoscaler" /> | `addon` | :white_check_mark: | :x: | 1.36.0 |
| <VersionedLink text="aws-efs" url="/integrations/packs/?pack=aws-efs" /> | `addon` | :white_check_mark: | :x: | 3.4.1 |
| <VersionedLink text="aws-efs" url="/integrations/packs/?pack=aws-efs" /> | `addon` | :white_check_mark: | :x: | 3.4.0 |
| <VersionedLink text="cert-manager" url="/integrations/packs/?pack=cert-manager" /> | `addon` | :white_check_mark: | :white_check_mark: | 1.21.0 |
| <VersionedLink text="cni-aws-vpc-eks-helm" url="/integrations/packs/?pack=cni-aws-vpc-eks-helm" /> | `cni` | :x: | :white_check_mark: | 1.22.3 |
| <VersionedLink text="cni-cilium-oss" url="/integrations/packs/?pack=cni-cilium-oss" /> | `cni` | :white_check_mark: | :x: | 1.19.6 |
| <VersionedLink text="cni-flannel" url="/integrations/packs/?pack=cni-flannel" /> | `cni` | :white_check_mark: | :white_check_mark: | 0.28.8 |
| <VersionedLink text="csi-aws-ebs" url="/integrations/packs/?pack=csi-aws-ebs" /> | `csi` | :white_check_mark: | :x: | 1.63.0 |
| <VersionedLink text="csi-aws-efs" url="/integrations/packs/?pack=csi-aws-efs" /> | `csi` | :white_check_mark: | :x: | 3.4.1 |
| <VersionedLink text="csi-aws-efs" url="/integrations/packs/?pack=csi-aws-efs" /> | `csi` | :white_check_mark: | :x: | 3.4.0 |
| <VersionedLink text="csi-rook-ceph-helm" url="/integrations/packs/?pack=csi-rook-ceph-helm" /> | `csi` | :white_check_mark: | :x: | 1.19.6 |
| <VersionedLink text="csi-rook-ceph-helm-addon" url="/integrations/packs/?pack=csi-rook-ceph-helm-addon" /> | `addon` | :white_check_mark: | :x: | 1.19.6 |
| <VersionedLink text="external-secrets-operator" url="/integrations/packs/?pack=external-secrets-operator" /> | `addon` | :white_check_mark: | :x: | 2.8.0 |
| <VersionedLink text="falco" url="/integrations/packs/?pack=falco" /> | `addon` | :white_check_mark: | :x: | 9.1.0 |
| <VersionedLink text="flux-cd" url="/integrations/packs/?pack=flux-cd" /> | `addon` | :white_check_mark: | :x: | 2.19.0 |
| <VersionedLink text="harbor" url="/integrations/packs/?pack=harbor" /> | `addon` | :white_check_mark: | :x: | 1.19.1 |
| <VersionedLink text="istio" url="/integrations/packs/?pack=istio" /> | `addon` | :white_check_mark: | :x: | 1.30.3 |
| <VersionedLink text="karpenter" url="/integrations/packs/?pack=karpenter" /> | `addon` | :x: | :white_check_mark: | 1.14.0 |
| <VersionedLink text="prometheus-agent" url="/integrations/packs/?pack=prometheus-agent" /> | `addon` | :white_check_mark: | :x: | 29.20.0 |
| <VersionedLink text="prometheus-operator" url="/integrations/packs/?pack=prometheus-operator" /> | `addon` | :white_check_mark: | :x: | 87.21.0 |
| <VersionedLink text="reloader" url="/integrations/packs/?pack=reloader" /> | `addon` | :x: | :white_check_mark: | 1.4.19 |

<!-- prettier-ignore-end -->

<!-- END PACKS LIST BODY: DOC-3029 + DOC-3020. DO NOT DELETE. -->

#### Pack Notes

<!-- prettier-ignore-start -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4186 -->

- The <VersionedLink text="Canonical Kubernetes" url="/integrations/packs/?pack=kubernetes-ck8s" /> pack now includes a
  native load balancer that you can enable through the pack configuration, available in version `1.35.2` and later.Refer to <VersionedLink text="Native Load Balancer" url="/integrations/packs/?pack=kubernetes-ck8s&tab=custom" /> for configuration steps.
<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
<!-- https://spectrocloud.atlassian.net/browse/DOC-3036 -->
<!-- https://spectrocloud.atlassian.net/browse/PCOM-777 -->

- Before deploying a virtual cluster with the updated **Virtual Cluster** pack (version `4.9.0` in [Artifact Studio](https://artifact-studio.spectrocloud.com/packs-catalog?search=vcluster), which packages vCluster `0.27.3`), set the CoreDNS image in the cluster group's **Advanced Config** YAML under `controlPlane.coredns.deployment.image`.
  
  Use `us-docker.pkg.dev/palette-images/k8s/coredns/coredns:v1.12.1` for Palette, or `us-docker.pkg.dev/palette-images-fips/k8s/coredns:v1.12.1` for Palette VerteX. Refer to [Configure the CoreDNS Image](../clusters/palette-virtual-clusters/deploy-virtual-cluster.md#configure-the-coredns-image) for step-by-step guidance.
<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PAC-4395 -->

- Fixed an issue where the Traefik pack remained in `PackServiceNotReady` state on Kubernetes distributions that do not
  include a Service `LoadBalancer` controller, such as Canonical Kubernetes and bare-metal clusters without MetalLB or
  `kube-vip` service mode. The Traefik Service defaults to `type: LoadBalancer`, and its `status.loadBalancer.ingress`
  field was never populated on these distributions, which held the pack in a not-ready state even though Traefik pods
  were running and traffic was flowing through NodePorts or virtual IPs. Traefik pack readiness on these distributions
  now works as expected.

## July 24, 2026 - Component Updates {#component-updates-2026-30}

<!-- COMPONENT UPDATES TICKET: DOC-3028 -->
<!-- RELEASE DATE: July 24, 2026 -->

<!-- BEGIN COMPONENT UPDATES BODY: DOC-3028. DO NOT DELETE. -->

### Palette AI VM Launchpad

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PVM-509 -->

- [PaletteAI VM Launchpad](../vm-management/vm-launchpad/vm-launchpad.md) (formerly Launchpad for VMs) version 4.9.15
  is now available.

<!-- https://spectrocloud.atlassian.net/browse/PE-8912 -->

- Local UI now supports a custom UI framework for profile variables. Operators can define and expose appliance
  variables through a dedicated, pluggable profile variable page in Local UI, so each appliance can surface the
  variables that matter for its role.

<!-- https://spectrocloud.atlassian.net/browse/DOC-3028 -->
<!-- https://spectrocloud.atlassian.net/browse/DOC-2994 -->

- The [VM Launchpad](../vm-management/vm-launchpad/vm-launchpad.md) now installs from a slim **Appliance ISO** paired
  with a separately downloaded **Content bundle**. As of VM Launchpad 4.9.15, the full **Appliance ISO with Content** is
  no longer available. Refer to [Artifact Studio](../downloads/artifact-studio.md) for a description of each artifact.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PVM-805 -->

- The Traefik ingress controller on the appliance now scales to multiple replicas, removing the previous single point of
  failure in the appliance ingress path.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PVM-751 -->
<!-- https://spectrocloud.atlassian.net/browse/PVM-755 -->
<!-- https://spectrocloud.atlassian.net/browse/PVM-741 -->
<!-- https://spectrocloud.atlassian.net/browse/PVM-839 -->

- Fixed round-trip mutations in the Preferences editor. CPU topology values, grace period serialization, and Extensible
  Firmware Interface (EFI) and Secure Boot display are now preserved correctly on save, and the deprecated
  `preferThreads` field is no longer written back to the resource.

<!-- https://spectrocloud.atlassian.net/browse/PVM-633 -->

- Fixed an issue where VM cloning did not stop the source VM first, which could produce inconsistent clones.

<!-- https://spectrocloud.atlassian.net/browse/PVM-835 -->

- Fixed namespace quota miscalculations that could cause VM deployment failures even when the namespace had enough
  remaining quota.

<!-- https://spectrocloud.atlassian.net/browse/PVM-727 -->

- Fixed an issue where clones of VMs with hotplug disks did not boot correctly.

<!-- END COMPONENT UPDATES BODY: DOC-3028. DO NOT DELETE. -->

## July 17, 2026 - Component Updates {#component-updates-2026-29}

<!-- COMPONENT UPDATES TICKET: DOC-3007 -->
<!-- RELEASE DATE: July 17, 2026 -->
<!-- RELEASE MANAGEMENT APPLIANCE: 4.9.27 -->
<!-- RELEASE ARTIFACT STUDIO: 4.9.14 -->
<!-- RELEASE TERRAFORM VERSION: 0.29.8 -->

The following components have been updated for Palette version 4.9.5 - 4.9.27.

| Component                                                                                                         | Version |
| ----------------------------------------------------------------------------------------------------------------- | ------- |
| [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) | 0.29.8  |
| [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) | 0.29.8  |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md)             | 4.9.27  |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)                    | 4.9.27  |

<!-- BEGIN COMPONENT UPDATES BODY: DOC-3007. DO NOT DELETE. -->

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PAC-3668 -->

- The in-cluster Harbor registry used in edge cluster add-on packs now integrates with cert-manager to automate TLS
  certificate rotation. Certificates are automatically renewed before expiration, eliminating the need for manual
  intervention and preventing service downtime. This applies to connected and airgap clusters, including FIPS and
  non-FIPS configurations. Refer to the
  [Enable Automatic TLS Certificate Rotation on the Harbor Primary Registry](../clusters/edge/site-deployment/deploy-custom-registries/enable-harbor-cert-rotation.md)
  guide for information on how to upgrade an existing Edge cluster so that the in-cluster Harbor registry uses
  cert-manager to automatically rotate its TLS certificate.

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PLT-2256 -->

- Fixed an issue in the `spectrocloud_registry_oci` Terraform resource where omitting `base_content_path` when
  `is_synchronization = true` produced a raw API error at apply time instead of a clear validation error at plan time.
  Terraform now surfaces an actionable validation error during `terraform plan` when `base_content_path` is missing and
  synchronization is enabled.

<!-- END COMPONENT UPDATES BODY: DOC-3007. DO NOT DELETE. -->

### Packs

<!-- BEGIN PACKS LIST BODY: DOC-3007. DO NOT DELETE. -->
<!-- prettier-ignore-start -->

| Pack Name | Layer | Non-FIPS | FIPS | New Version |
| --------- | ----- | -------- | ---- | ----------- |
| <VersionedLink text="argo-cd" url="/integrations/packs/?pack=argo-cd" /> | `addon` | :white_check_mark: | :x: | 10.1.3 |
| <VersionedLink text="edge-k8s" url="/integrations/packs/?pack=edge-k8s" /> | `K8S` | :white_check_mark: | :white_check_mark: | 1.33.13 |
| <VersionedLink text="edge-k8s" url="/integrations/packs/?pack=edge-k8s" /> | `K8S` | :white_check_mark: | :white_check_mark: | 1.35.6 |
| <VersionedLink text="karpenter" url="/integrations/packs/?pack=karpenter" /> | `addon` | :white_check_mark: | :x: | 1.11.2 |
| <VersionedLink text="nvidia-gpu-operator-ai" url="/integrations/packs/?pack=nvidia-gpu-operator-ai" /> | `addon` | :white_check_mark: | :x: | 26.3.3 |
| <VersionedLink text="open-policy-agent" url="/integrations/packs/?pack=open-policy-agent" /> | `addon` | :white_check_mark: | :x: | 3.23.0 |
| <VersionedLink text="openobserve" url="/integrations/packs/?pack=openobserve" /> | `addon` | :white_check_mark: | :x: | 0.91.1 |
| <VersionedLink text="piraeus-operator" url="/integrations/packs/?pack=piraeus-operator" /> | `csi` | :white_check_mark: | :x: | 2.10.8 |
| <VersionedLink text="piraeus-operator-addon" url="/integrations/packs/?pack=piraeus-operator-addon" /> | `addon` | :white_check_mark: | :x: | 2.10.8 |

<!-- prettier-ignore-end -->

<!-- END PACKS LIST BODY: DOC-3007. DO NOT DELETE. -->

## July 10, 2026 - Component Updates {#component-updates-2026-28}

<!-- COMPONENT UPDATES TICKET: DOC-2995 -->
<!-- RELEASE DATE: June 28, 2026 -->
<!-- RELEASE MANAGEMENT APPLIANCE: 4.9.21 -->
<!-- RELEASE ARTIFACT STUDIO: 4.9.11 -->
<!-- RELEASE TERRAFORM VERSION: 0.29.6 -->

The following components have been updated for Palette version 4.9.5 - 4.9.24.

| Component                                          | Version |
| -------------------------------------------------- | ------- |
| [Artifact Studio](../downloads/artifact-studio.md) | 4.9.13  |

<!-- BEGIN COMPONENT UPDATES BODY: DOC-2995. DO NOT DELETE. -->

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PAC-3667 -->

- Zot Registry on [Edge clusters](../clusters/edge/edge.md) now integrates with `cert-manager` to automatically rotate
  TLS certificates before expiration, eliminating manual renewal and preventing service downtime. This applies to
  connected and airgap clusters in both FIPS and non-FIPS configurations. Refer to the
  [Enable Automatic TLS Certificate Rotation on the Zot Primary Registry](../clusters/edge/site-deployment/deploy-custom-registries/enable-zot-cert-rotation.md).

<!-- END COMPONENT UPDATES BODY: DOC-2995. DO NOT DELETE. -->

### Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-4320 -->
<!-- BEGIN PACKS LIST BODY: DOC-2995. DO NOT DELETE. -->
<!-- prettier-ignore-start -->

| Pack Name | Layer | Non-FIPS | FIPS | New Version |
| --------- | ----- | -------- | ---- | ----------- |
| <VersionedLink text="argo-cd" url="/integrations/packs/?pack=argo-cd" /> | `addon` | :white_check_mark: | :x: | 10.1.2 |
| <VersionedLink text="aws-alb" url="/integrations/packs/?pack=aws-alb" /> | `addon` | :white_check_mark: | :x: | 3.4.1 |
| <VersionedLink text="cert-manager" url="/integrations/packs/?pack=cert-manager" /> | `addon` | :white_check_mark: | :x: | 1.20.3 |
| <VersionedLink text="cni-aws-vpc-eks-helm" url="/integrations/packs/?pack=cni-aws-vpc-eks-helm" /> | `cni` | :white_check_mark: | :x: | 1.22.3 |
| <VersionedLink text="cni-calico-azure" url="/integrations/packs/?pack=cni-calico-azure" /> | `cni` | :x: | :white_check_mark: | 3.32.1 |
| <VersionedLink text="cni-calico" url="/integrations/packs/?pack=cni-calico" /> | `cni` | :x: | :white_check_mark: | 3.32.1 |
| <VersionedLink text="edge-k3s" url="/integrations/packs/?pack=edge-k3s" /> | `kubernetes` | :white_check_mark: | :white_check_mark: | 1.34.9 |
| <VersionedLink text="edge-rke2" url="/integrations/packs/?pack=edge-rke2" /> | `kubernetes` | :white_check_mark: | :white_check_mark: | 1.34.9 |
| <VersionedLink text="cni-flannel" url="/integrations/packs/?pack=cni-flannel" /> | `cni` | :x: | :white_check_mark: | 0.28.7 |
| <VersionedLink text="kong" url="/integrations/packs/?pack=kong" /> | `addon` | :white_check_mark: | :x: | 3.4.1 |
| <VersionedLink text="reloader" url="/integrations/packs/?pack=reloader" /> | `addon` | :white_check_mark: | :x: | 1.4.19 |
| <VersionedLink text="traefik" url="/integrations/packs/?pack=traefik" /> | `addon` | :white_check_mark: | :x: | 41.0.2 |
| <VersionedLink text="vault" url="/integrations/packs/?pack=vault" /> | `addon` | :white_check_mark: | :x: | 0.34.0 |

<!-- prettier-ignore-end -->

<!-- END PACKS LIST BODY: DOC-2995. DO NOT DELETE. -->

## July 9, 2026 - Release 4.9.27

The following component updates are applicable to this release:

- [July 10, 2026 - Component Updates](#component-updates-2026-28) <!-- omit in toc -->
- [July 17, 2026 - Component Updates](#component-updates-2026-29) <!-- omit in toc -->
- [July 24, 2026 - Component Updates](#component-updates-2026-30) <!-- omit in toc -->

<!-- PATCH RELEASE TICKET: DOC-2985 -->

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PCP-7141 -->

- Fixed an issue that prevented new [CloudStack](/clusters/data-center/cloudstack/create-manage-cloudstack-clusters/)
  clusters from being provisioned using a CloudStack [PCG](/clusters/pcg/).

<!-- https://spectrocloud.atlassian.net/browse/PE-9048 -->

- Fixed an issue that caused the Palette Edge Interactive Installer TUI to incorrectly select the installer boot media
  for disk-wiping when booting an Edge host from a physical USB drive flashed with the installer ISO.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.27 Palette release is 4.9.22.

:::

## July 3, 2026 - Component Updates {#component-updates-2026-27}

<!-- COMPONENT UPDATES TICKET: DOC-2962 -->
<!-- RELEASE DATE: July 3, 2026 -->
<!-- RELEASE MANAGEMENT APPLIANCE: 4.9.24 -->
<!-- RELEASE ARTIFACT STUDIO: 4.9.12 -->
<!-- RELEASE TERRAFORM VERSION: 0.29.7 -->

The following components have been updated for Palette version 4.9.5 - 4.9.24.

| Component                                                                                                         | Version |
| ----------------------------------------------------------------------------------------------------------------- | ------- |
| [Artifact Studio](../downloads/artifact-studio.md)                                                                | 4.9.12  |
| [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) | 0.29.7  |
| [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) | 0.29.7  |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md)             | 4.9.24  |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)                    | 4.9.24  |

<!-- BEGIN COMPONENT UPDATES BODY: DOC-2962. DO NOT DELETE. -->

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PCOM-71 -->

- Palette now generates build attestation documents for all packs as part of the secure supply chain initiative.
  Attestation records when and how software was produced, on which systems, and by which users, providing a complete
  audit trail of the software development lifecycle.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-81 -->

- Palette now generates a Software Bill of Materials (SBOM) for all downloadable artifacts. Each downloadable component
  includes an associated SBOM in CycloneDX format, augmented with metadata such as author, supplier, repository
  location, license, and copyright. SBOMs are signed and can be downloaded from
  [Artifact Studio](../downloads/artifact-studio.md) and reviewed before deploying software to your environment.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-759 -->

- SBOMs and attestations for packs are now available in [Artifact Studio](/downloads/artifact-studio/). Users can
  download the SBOM for every appliance and pack directly from the Artifact Studio interface. Attestation documents are
  built with each image and are accessible once packs are uploaded to registries.

### Bug Fixes

  <!-- https://spectrocloud.atlassian.net/browse/PLT-2286 -->

- Fixed a Terraform issue that caused newly added
  [profile variables](../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md)
  to be silently dropped when bumping the `version` of a `spectrocloud_cluster_profile` resource with the
  `immutable-clusterprofiles` feature preview enabled. The `terraform apply` operation reported success and created the
  new profile version, but the newly declared variables did not appear in Palette.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2288 -->

- Fixed a Terraform issue where the `skip_k8s_upgrade` field was incorrectly sent for MAAS, vSphere, and Edge Native
  cluster worker machine pools, causing an API rejection. This field is only supported for AWS clusters, and the
  provider now correctly omits it for non-AWS cloud types.

<!-- END COMPONENT UPDATES BODY: DOC-2962. DO NOT DELETE. -->

### Packs

<!-- BEGIN PACKS LIST BODY: DOC-2962. DO NOT DELETE. -->

| Pack Name                                                                                                    | Layer   | Non-FIPS           | FIPS               | New Version |
| ------------------------------------------------------------------------------------------------------------ | ------- | ------------------ | ------------------ | ----------- |
| <VersionedLink text="argo-cd" url="/integrations/packs/?pack=argo-cd" />                                     | `addon` | :white_check_mark: | :x:                | 10.0.0      |
| <VersionedLink text="calico-network-policy" url="/integrations/packs/?pack=calico-network-policy" />         | `addon` | :white_check_mark: | :x:                | 3.32.1      |
| <VersionedLink text="cni-antrea" url="/integrations/packs/?pack=cni-antrea" />                               | `cni`   | :white_check_mark: | :x:                | 2.6.2       |
| <VersionedLink text="cni-aws-vpc-eks-helm" url="/integrations/packs/?pack=cni-aws-vpc-eks-helm" />           | `cni`   | :x:                | :white_check_mark: | 1.21.2      |
| <VersionedLink text="cni-calico" url="/integrations/packs/?pack=cni-calico" />                               | `cni`   | :white_check_mark: | :x:                | 3.32.1      |
| <VersionedLink text="cni-calico-azure" url="/integrations/packs/?pack=cni-calico-azure" />                   | `cni`   | :white_check_mark: | :x:                | 3.32.1      |
| <VersionedLink text="cni-cilium-oss" url="/integrations/packs/?pack=cni-cilium-oss" />                       | `cni`   | :x:                | :white_check_mark: | 1.19.4      |
| <VersionedLink text="external-secrets-operator" url="/integrations/packs/?pack=external-secrets-operator" /> | `addon` | :white_check_mark: | :x:                | 2.7.0       |
| <VersionedLink text="headlamp" url="/integrations/packs/?pack=headlamp" />                                   | `addon` | :white_check_mark: | :white_check_mark: | 0.43.0      |
| <VersionedLink text="istio" url="/integrations/packs/?pack=istio" />                                         | `addon` | :white_check_mark: | :x:                | 1.30.2      |
| <VersionedLink text="prometheus-agent" url="/integrations/packs/?pack=prometheus-agent" />                   | `addon` | :white_check_mark: | :x:                | 29.14.0     |
| <VersionedLink text="prometheus-operator" url="/integrations/packs/?pack=prometheus-operator" />             | `addon` | :white_check_mark: | :x:                | 87.4.0      |
| <VersionedLink text="tigera-operator" url="/integrations/packs/?pack=tigera-operator" />                     | `cni`   | :white_check_mark: | :x:                | 3.32.1      |

<!-- END PACKS LIST BODY: DOC-2962. DO NOT DELETE. -->

## July 1, 2026 - Release 4.9.24

The following component updates are applicable to this release:

- [July 3, 2026 - Component Updates](#component-updates-2026-27) <!-- omit in toc -->
- [July 10, 2026 - Component Updates](#component-updates-2026-28) <!-- omit in toc -->
- [July 17, 2026 - Component Updates](#component-updates-2026-29) <!-- omit in toc -->
- [July 24, 2026 - Component Updates](#component-updates-2026-30) <!-- omit in toc -->

<!-- PATCH RELEASE TICKET: DOC-2957 -->

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PE-8884 -->

- While bootstrapping Edge hosts, the Palette Edge Interactive Installer TUI now checks all disks for partitions left
  behind by previous installations, preventing stale partitions from causing unpredictable installation behavior.
  Affected disks are flagged and pre-selected for wiping on the prerequisites screen. Wiping disks is optional and must
  be confirmed on the follow-up screen.

<!-- https://spectrocloud.atlassian.net/browse/PE-8912 -->

- Content authors can now bundle a custom UI into Edge content using the `--custom-ui` flag of the
  [Palette CLI](/automation/palette-cli/commands/content/#build) `content build` command. When the content is uploaded
  to a Slim ISO-bootstrapped Edge host, Local UI detects the bundle and renders the custom configuration screens,
  allowing you to ship tailored configuration experiences alongside your Edge content.

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PE-9004 -->

- Fixed an issue where upgrading Palette could also upgrade the Edge host agent on some nodes of a multi-node cluster
  even when [agent upgrades](../clusters/cluster-management/platform-settings/pause-platform-upgrades.md) were paused,
  leaving the cluster with mismatched agent versions across nodes and causing continuous pod restarts.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.24 Palette release is 4.9.21.

:::

### Automation

:::info

The [Palette CLI](../automation/palette-cli/palette-cli.md) version corresponding to the 4.9.24 Palette release is
4.9.10. Refer to [CLI Tools](/downloads/cli-tools/) for the download URL and checksum.

:::

## June 29, 2026 - Release 4.9.23

The following component updates are applicable to this release:

- [July 3, 2026 - Component Updates](#component-updates-2026-27) <!-- omit in toc -->
- [July 10, 2026 - Component Updates](#component-updates-2026-28) <!-- omit in toc -->
- [July 17, 2026 - Component Updates](#component-updates-2026-29) <!-- omit in toc -->
- [July 24, 2026 - Component Updates](#component-updates-2026-30) <!-- omit in toc -->

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PE-9014 -->

- Fixed a bug that caused the Edge Agent version 4.9.19 to incorrectly enforce password strength validation on profile
  variables for non-VMO Edge clusters, blocking cluster updates when weak passwords were present. Password strength
  checks are now restricted to VMO profile variables only, restoring the update behavior from previous Palette versions.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.23 Palette release is 4.9.20.

:::

### Automation

:::info

The [Palette CLI](../automation/palette-cli/palette-cli.md) version corresponding to the 4.9.23 Palette release is
4.9.9. Refer to [CLI Tools](/downloads/cli-tools/) for the download URL and checksum.

:::

## June 28, 2026 - Release 4.9.22 {#release-notes-4.9.22}

The following component updates are applicable to this release:

- [July 3, 2026 - Component Updates](#component-updates-2026-27) <!-- omit in toc -->
- [July 10, 2026 - Component Updates](#component-updates-2026-28) <!-- omit in toc -->
- [July 17, 2026 - Component Updates](#component-updates-2026-29) <!-- omit in toc -->
- [July 24, 2026 - Component Updates](#component-updates-2026-30) <!-- omit in toc -->

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4-9-b}

#### Breaking Changes {#breaking-changes-4-9-b}

<!-- https://spectrocloud.atlassian.net/browse/PEM-7017 -->
<!-- https://spectrocloud.atlassian.net/browse/PEM-7388 -->

- Palette now validates the `ProjectUid` header on all [API](/api/introduction) requests. Requests that send a project
  that does not exist or that you cannot access now return a validation error, such as `ResourceNotFound`,
  `ProjectNotFoundInTenant`, or `ResourceAccessDenied`. To avoid errors, remove the `ProjectUid` header when accessing
  tenant-level resources, or provide a valid project. Existing resources are not affected.

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PEM-10563 -->

- Spectro Cloud is transitioning to the use of security-hardened images. As a result, retrieving images from Spectro
  Cloud OCI registries will require a Spectro Cloud image pull secret. This secret is intended for long-term use and is
  configured once.

  This change primarily affects non-airgap environments that do not configure mirror registries or image swap; it does
  not apply to airgapped environments, which pull images from their own registries. While configuring an image pull
  secret is not required for the current version of Palette, it is an
  [upcoming breaking change](./announcements.md#upcoming-breaking-changes) and will be mandated in a future release. We
  recommend that affected environments configure an image pull secret as soon as possible to prevent service disruptions
  later.

  To obtain your image pull secret, contact your customer support representative. Refer to
  [Configure Image Pull Secret](../enterprise-version/system-management/configure-image-pull-secret.md) for more
  information.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6526 -->

- <TpBadge /> Overriding Cluster API (CAPI) properties is now supported on [AWS
  EKS](../clusters/public-cloud/aws/eks.md), [Azure IaaS](../clusters/public-cloud/azure/aks.md), and
  [CloudStack](../clusters/data-center/cloudstack/create-manage-cloudstack-clusters.md) clusters. This allows you to
  configure advanced provider-specific settings not natively exposed by Palette by supplying YAML that targets the
  underlying CAPI provider objects directly. For more information, refer to [Override Cluster API (CAPI)
  Properties](../architecture/override-capi-properties/override-capi-properties.md).

  <!-- https://spectrocloud.atlassian.net/browse/DOC-2854 -->

  - Using CAPI override, you can now apply AWS custom tags at the node pool level on EKS clusters. Node-pool tags are
    additive to cluster-level tags and propagate to the pool's managed node group and Auto Scaling group. For more
    information, refer to
    [Node Pool AWS Tags](../architecture/override-capi-properties/aws-capi-override-reference.md#node-pool-aws-tags).

<!-- https://spectrocloud.atlassian.net/browse/PCP-6803 -->
<!-- https://spectrocloud.atlassian.net/browse/PCP-6362 -->

- Palette now supports overriding Cluster API Machine Health Check (MHC) settings per node pool on Palette eXtended
  Kubernetes (PXK) infrastructure clusters. This capability does not apply to EKS, AKS, or GKE clusters. For more
  information, refer to [Node Pools](../clusters/cluster-management/node-pool.md).

<!-- https://spectrocloud.atlassian.net/browse/PRM-2688 -->

<!-- - [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) version 4.9.21 are now
  available. -->

<!-- https://spectrocloud.atlassian.net/browse/PRM-2688 -->

- [Artifact Studio](../downloads/artifact-studio.md) version 4.9.11 is now available.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PEM-9172 -->

- The deployment of
  [MAAS clusters to LXD Virtual Machines (VMs)](../clusters/data-center/maas/create-manage-maas-lxd-clusters.md) has
  exited Tech Preview and is now ready for production workloads.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9407 -->

- Palette now supports the configuration of audit trails with
  [Splunk](https://help.splunk.com/en/splunk-observability-cloud/get-started). Refer to the
  [Audit Logs](../audit-logs/audit-logs.md) guide for more information.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10433 -->

- The **Cluster Endpoint Access** tooltip for Amazon EKS clusters now clarifies how the **Private** option behaves. For
  fully private endpoint access, use a self-hosted Private Cloud Gateway (PCG). If you select **Private** without a PCG,
  Palette initially creates the cluster in **Private & Public** mode and changes it to **Private** after cluster
  provisioning completes. For more information, refer to
  [Create and Manage AWS EKS Cluster](../clusters/public-cloud/aws/eks.md).

<!-- https://spectrocloud.atlassian.net/browse/PCP-6835 -->

- The deployment of [Canonical Kubernetes on MAAS](../clusters/data-center/maas/architecture.md) has exited Tech Preview
  and is now ready for production workloads.

<!-- prettier-ignore-start -->
<!-- https://spectrocloud.atlassian.net/browse/PCP-6725 -->
<!-- https://spectrocloud.atlassian.net/browse/PCP-4971 -->

- [Canonical Kubernetes clusters on MAAS](../clusters/data-center/maas/architecture.md) now support the <VersionedLink
  text="Cilium" url="/integrations/packs/?pack=cni-cilium-oss" /> pack as a Container Network Interface
  (CNI), available for Canonical Kubernetes 1.35 and later. You can manage Cilium declaratively in your cluster
  profile instead of relying on the Cilium CNI bundled with the Canonical Kubernetes pack. For configuration steps, refer
  to <VersionedLink
  text="Configure Cilium for Canonical Kubernetes Clusters on MAAS" url="/integrations/packs/?pack=cni-cilium-oss&tab=custom" />.

<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PEM-1826 -->
<!-- https://spectrocloud.atlassian.net/browse/PEM-1822 -->

- The **MinIO** backup location provider has been renamed to **S3 Compatible Storage** to reflect that it supports any
  S3-compatible object storage, such as MinIO or NetApp StorageGRID. The **S3 URL** field is now labeled **Endpoint
  URL**. Existing backup locations continue to work and appear under the new label with their settings preserved. For
  more information, refer to [Backup and Restore](../clusters/cluster-management/backup-restore/backup-restore.md).

<!-- https://spectrocloud.atlassian.net/browse/PEM-10222 -->

- Palette now provides the `/v1/tenants/{tenantUid}/idp/palette/config` [API endpoint](/api/introduction) that allows
  tenant administrators to retrieve the Palette identity provider (IdP) configuration for their tenant in self-hosted
  Palette environments.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6579 -->

- The **View K8s Certificates** page now displays every control plane PKI certificate that Palette includes in its
  renewal cycle, instead of only the core API server and certificate authority (CA) entries. The expanded list adds the
  kubeconfig-embedded client certificates, the etcd peer and health-check certificates, and the kubelet client and
  serving certificates for each control plane node. This applies to Palette eXtended Kubernetes (PXK), RKE2, K3s, and
  Canonical Kubernetes clusters. For more information, refer to
  [Renew Cluster PKI Certificates](../clusters/cluster-management/certificate-management.md).

<!-- https://spectrocloud.atlassian.net/browse/PCP-5597 -->

- Palette now publishes consistent cluster events for Container Network Interface (CNI) and Container Storage Interface
  (CSI) pack installations and upgrades across all cloud types. Palette adds a CNI install success event to match the
  existing CSI event, recording the source and target versions in a single upgrade event. For more information, refer to
  [Event Stream](../clusters/clusters.md#event-stream).

<!-- https://spectrocloud.atlassian.net/browse/PEM-3570 -->

- The [Pause Agent Upgrades](../clusters/cluster-management/platform-settings/pause-platform-upgrades.md) setting now
  applies to all internal components of a Private Cloud Gateway (PCG), including those used to manage the PCG cluster
  itself. This applies to MAAS, vSphere, and self-hosted PCGs.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-71 -->

- Palette now generates build attestation documents for Spectro Cloud components as part of the Supply chain Levels for
  Software Artifacts (SLSA) Level 2 secure supply chain initiative. These documents provide an audit trail of when, how,
  and where the software was produced.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-81 -->

- Palette now generates
  [Software Bill Of Materials (SBOM) artifacts](../clusters/cluster-management/compliance-scan.md#sbom-dependencies--vulnerabilities)
  for all Spectro Cloud downloadable components in CycloneDX, SPDX, and Syft JSON formats.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-222 -->

- The Palette AI Studio detail view now displays the full contents of the `README.md` file associated with Palette AI
  content, which makes extended documentation directly accessible from the details tab.

<!-- prettier-ignore-start -->
<!-- https://spectrocloud.atlassian.net/browse/PCOM-694 -->

- The Palette and VerteX appliance components have been upgraded to their latest patch versions, including the
  following:

  - <VersionedLink text="Palette eXtended Kubernetes" url="/integrations/packs/?pack=kubernetes" /> version 1.34.9
  - <VersionedLink text="Calico" url="/integrations/packs/?pack=cni-calico" /> version 3.32.0
  - <VersionedLink text="Piraeus" url="/integrations/packs/?pack=piraeus-operator" /> version 2.10.7
  - <VersionedLink text="Zot Registry" url="/integrations/packs/?pack=zot-registry" />  version 2.1.17

<!-- prettier-ignore-end -->

#### Deprecations and Removals

<!-- https://spectrocloud.atlassian.net/browse/DOC-2912 -->

- The `v1/projects` Palette [API endpoint](/api/introduction) is now deprecated. Use the `/v1/dashboard/projects`
  endpoint instead.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PCP-6832 -->

- Fixed an issue where the expanded certificate list did not appear on the **View K8s Certificates** page for newly
  provisioned AWS and GCP clusters.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6439 -->

- Fixed an issue that caused [AWS IaaS](../clusters/public-cloud/aws/create-cluster.md) clusters using Cilium as the CNI
  to receive incorrect security group rules, which silently dropped cross-node pod traffic and disrupted DNS resolution,
  pod-to-pod communication, and API server webhook calls. Palette now applies the correct security group rules based on
  the configured CNI, with no manual security group changes required.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11206 -->

- Fixed an issue where the **API Endpoint** field was disabled when adding a MAAS cloud account with a self-hosted
  Private Cloud Gateway (PCG), which prevented you from entering the endpoint manually.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6928 -->

- Fixed an issue where a scheduled [OS patch](../clusters/cluster-management/os-patching.md) could loop indefinitely and
  leave a node cordoned. The patch no longer stalls on an unnecessary package signing key fetch, so it completes and the
  node is returned to service.

<!-- https://spectrocloud.atlassian.net/browse/PCP-4736 -->

- Fixed an issue where the `apply-scheduled-os-patch` pod could continue to start after the **OS Patching Schedule** was
  set to **Never**, which could leave a node cordoned. Setting the schedule to **Never** now removes the scheduled task.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6875 -->

- Fixed an issue where the per-cluster `capa-controller-manager` pod was intermittently created without the EKS Pod
  Identity credential environment variables when provisioning [Amazon EKS](../clusters/public-cloud/aws/eks.md) clusters
  with a Pod Identity cloud account, which could stall provisioning with a VPC reconciliation failure.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6684 -->

- Fixed an issue where EKS Pod Identity associations were not removed when workload clusters were deleted or pivoted,
  which caused the list of associations to grow over time.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5463 -->

- Fixed an issue where [Amazon EKS](../clusters/public-cloud/aws/eks.md) cluster provisioning could stall at the worker
  node launch phase because of a race condition while updating the `aws-node` DaemonSet.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6760 -->

- Fixed an issue where the Palette agent could delete a Role-Based Access Control (RBAC) managed namespace during a
  reconciliation cycle when a transient Kubernetes API error occurred, which briefly disrupted the workloads in that
  namespace.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10088 -->

- Fixed an issue where requests to retrieve cluster namespace information could time out and return an HTTP 500
  `ClusterFeatureTimeoutError`.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11112 -->

- Fixed an issue where `GET /v1/cloudaccounts/azure/{uid}` returned a masked `tls.cert` value for `AzurePublicCloud`
  accounts that were created without a certificate, causing false drift detection in the Terraform provider.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6887 -->

- Fixed an issue where Helm-based cert-manager installations did not receive image-swap labels, which could prevent
  container images from being redirected to a local registry in airgapped environments.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-708 -->

- Fixed an issue where upgrading the Palette Management Appliance did not preserve previously configured settings during
  the review step. The upgrade introduced a new profile instead of a new version of the existing profile, which reset
  all values to their defaults and prevented a side-by-side comparison of the incoming and existing configuration
  values.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.22 Palette release is 4.9.19.

:::

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PE-8643 -->
<!-- https://spectrocloud.atlassian.net/browse/PE-8173 -->

- Connected (centrally managed) Edge Native clusters now support upgrading the control plane independently from worker
  pools. Enable the **Skip worker node update** toggle on a worker pool to defer its Kubernetes upgrade while the
  control plane advances. Palette enforces the Kubernetes
  [N-3 minor version skew](https://kubernetes.io/releases/version-skew-policy/) to prevent unsupported drift between the
  control plane and worker nodes. For more information, refer to
  [Skip Worker Node Update](../clusters/cluster-management/node-pool.md#skip-worker-node-update) and
  [Edge Cluster Upgrade Behavior](../clusters/edge/cluster-management/upgrade-behavior.md#decoupled-control-plane-and-worker-node-upgrades).

<!-- https://spectrocloud.atlassian.net/browse/PE-8655 -->
<!-- https://spectrocloud.atlassian.net/browse/PE-8437 -->

- The Palette TUI now includes a **Management Interface** drop-down menu on the **Network Adapter** screen. You can use
  this option during initial Edge host setup to pin Local UI and host-to-host traffic to a specific network adapter. For
  more information, refer to
  [Initial Edge Host Configuration with Palette TUI](../clusters/edge/site-deployment/site-installation/initial-setup.md).

<!-- https://spectrocloud.atlassian.net/browse/PE-8897 -->

- Edge clusters now support the `DisableWorkerNodeCapReconcile` feature gate. For clusters with **Allow worker
  capability** disabled, add this value to `stylus.featureGate` in the OS pack to prevent the Palette Edge node agent
  from automatically re-adding control plane taints to nodes in the control plane pool after the taint has been manually
  removed. For more information, refer to
  [Feature Gates](../clusters/edge/edge-configuration/installer-reference.md#feature-gates).

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PE-8682 -->

- Fixed an issue where `k3s.service` could enter a permanent crash loop with a `no bootstrap data found in datastore`
  error during the initial bootstrap of single-node Edge clusters.

<!-- https://spectrocloud.atlassian.net/browse/PE-8691 -->

- Fixed an issue where Day-2 updates to the `reconcile` stages in an Edge OS or Kubernetes pack did not reliably replace
  the existing node configuration in `/oem/85_cluster_config.yaml`. Stale stage entries were retained and newly added
  entries under an existing stage were dropped.

<!-- https://spectrocloud.atlassian.net/browse/PE-7640 -->

- Fixed an issue where reusing an Edge host for a new cluster could leave the cluster stuck in provisioning because the
  RKE2 state from the previous cluster was not fully removed. This caused the leftover bootstrap data to conflict with
  the new cluster token.

<!-- https://spectrocloud.atlassian.net/browse/PAC-3951 -->

- Fixed an issue where Canonical Kubernetes 1.35 was missing from the `k8s_version.json` file in CanvOS v4.8.18, which
  prevented building Canonical provider images for Edge deployments.

### PaletteAI VM Launchpad (formerly Launchpad for VMs) {#launchpad-for-vms}

<!-- https://spectrocloud.atlassian.net/browse/PVM-654 -->

#### Features

- [VM Launchpad](../vm-management/vm-launchpad/vm-launchpad.md) version 4.9.8 is now available. If upgrading from
  version 4.9.3 to 4.9.8, a pre-upgrade script is required. To obtain the pre-upgrade script, contact your customer
  support representative.

- VM Launchpad now supports live updates to running VMs. You can hot-plug memory and hot-update CPU sockets on a running
  VM without a reboot.

- Running VMs can now be paused and resumed.

- The appliance now displays live-migration progress so you can track a VM's migration between nodes.

- VMs can now be created using custom YAML files.

  <!-- https://spectrocloud.atlassian.net/browse/PVM-710 -->

- VMs can now be created using golden images and templates across namespace boundaries using the **Create VM** flow.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PVM-641 -->

- MetalLB load-balancer images now use the hardened, distroless image variant.

<!-- https://spectrocloud.atlassian.net/browse/PVM-781 -->

- The default password policy for the VMO Manager profile now requires a minimum of 15 characters, aligning with
  Security Technical Implementation Guide (STIG) compliance.

- VMO profile password fields now enforce complexity requirements at input time. passwords before submission.

- Fixed an issue where users could delete the account they were currently signed in with.

- The user-creation form now validates email format and rejects malformed email addresses.

- VM instance types can now be changed after the VM is built using the edit-configuration flow.

- The VM creation flow now surfaces the underlying **DataVolume** status, allowing you to monitor disk-provisioning
  progress during VM creation.

#### Bug Fixes

- Fixed an issue where updating a VM's CPU sockets displayed a spurious "restart required" message for a change that
  does not require a restart.

- Fixed an issue where VMs that failed to start or be scheduled could not be deleted through the UI.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4-9-b) for more details.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PEM-10482 -->

- The [system console](../vertex/system-management/system-management.md#system-console) now displays the installed
  product version for Helm-based installations of Palette VerteX.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PCP-4727 -->

- Fixed an issue where deploying a FIPS-enabled [Amazon EKS](../clusters/public-cloud/aws/eks.md) cluster could fail
  with a chart installation error because the `aws-node` service account in the `kube-system` namespace already existed
  and could not be imported into the Helm release for the `cni-aws-vpc-eks-helm-fips` pack.

### Automation

:::info

The [Palette CLI](../automation/palette-cli/palette-cli.md) version corresponding to the 4.9.22 Palette release is
4.9.8. Refer to [CLI Tools](/downloads/cli-tools/) for the download URL and checksum.

:::

#### Features

- Terraform version 0.29.6 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.29.6 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) is
  now available.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PLT-2277 -->

- The Spectro Cloud Terraform provider now supports Cluster API (CAPI) property overrides for Amazon EKS, Azure IaaS,
  and CloudStack clusters. You can supply key-value overrides for the underlying CAPA or CAPC properties at the cluster
  and node pool level.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2231 -->

- The
  [`spectrocloud_cluster_eks`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_eks)
  Terraform resource now supports custom AWS tags at the node pool level. These tags are applied in addition to any
  cluster-level tags.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2275 -->

- The Spectro Cloud Terraform provider now supports overriding Machine Health Check (MHC) configuration at the node pool
  level for Palette eXtended Kubernetes (PXK) infrastructure clusters.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2237 -->

- The Spectro Cloud Terraform and Crossplane providers now support decoupled upgrades for worker node pools on Edge
  clusters. This allows you to upgrade the control plane and worker nodes independently for Canonical Kubernetes (CK8s)
  and Palette eXtended Kubernetes Edge (PXK-E) clusters.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2235 -->

- The Spectro Cloud Terraform provider now supports configuring audit log export to both Amazon CloudWatch and Splunk
  for Palette deployments. Refer to [Audit Logs](../audit-logs/audit-logs.md) for more information.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PLT-2269 -->

- Fixed an issue in the Palette Go SDK where removing all tags from a cluster profile was not applied, because the
  `omitempty` annotation on the labels field caused an empty map to be omitted from the API request payload.

### Packs

<!-- BEGIN PACKS LIST BODY: DOC-2939. DO NOT DELETE. -->
<!-- prettier-ignore-start -->

| Pack Name | Layer | Non-FIPS | FIPS | New Version |
| --------- | ----- | -------- | ---- | ----------- |
| <VersionedLink text="argo-cd" url="/integrations/packs/?pack=argo-cd" /> | `addon` | :white_check_mark: | :x: | 9.6.0 |
| <VersionedLink text="cert-manager" url="/integrations/packs/?pack=cert-manager" /> | `addon` | :white_check_mark: | :white_check_mark: | 1.20.2 |
| <VersionedLink text="csi-aws-ebs" url="/integrations/packs/?pack=csi-aws-ebs" /> | `csi` | :white_check_mark: | :x: | 1.62.0 |
| <VersionedLink text="csi-gcp-driver" url="/integrations/packs/?pack=csi-gcp-driver" /> | `csi` | :white_check_mark: | :x: | 1.26.0 |
| <VersionedLink text="csi-local-path-provisioner-addon" url="/integrations/packs/?pack=csi-local-path-provisioner-addon" /> | `addon` | :white_check_mark: | :x: | 0.0.36 |
| <VersionedLink text="csi-local-path-provisioner" url="/integrations/packs/?pack=csi-local-path-provisioner" /> | `csi` | :white_check_mark: | :x: | 0.0.36 |
| <VersionedLink text="csi-vsphere-csi" url="/integrations/packs/?pack=csi-vsphere-csi" /> | `csi` | :white_check_mark: | :x: | 3.7.2 |
| <VersionedLink text="karpenter" url="/integrations/packs/?pack=karpenter" /> | `addon` | :white_check_mark: | :x: | 1.13.0 |
| <VersionedLink text="kong" url="/integrations/packs/?pack=kong" /> | `addon` | :white_check_mark: | :x: | 3.4.0 |
| <VersionedLink text="piraeus-operator-addon" url="/integrations/packs/?pack=piraeus-operator-addon" /> | `addon` | :x: | :white_check_mark: | 2.10.7 |
| <VersionedLink text="piraeus-operator" url="/integrations/packs/?pack=piraeus-operator" /> | `csi` | :x: | :white_check_mark: | 2.10.7 |
| <VersionedLink text="prometheus-operator" url="/integrations/packs/?pack=prometheus-operator" /> | `addon` | :white_check_mark: | :x: | 87.1.0 |
| <VersionedLink text="registry-connect" url="/integrations/packs/?pack=registry-connect" /> | `addon` | :white_check_mark: | :x: | 0.2.0 |
| <VersionedLink text="traefik" url="/integrations/packs/?pack=traefik" /> | `addon` | :white_check_mark: | :x: | 41.0.0 |

<!-- prettier-ignore-end -->

<!-- END PACKS LIST BODY: DOC-2939. DO NOT DELETE. -->

#### Pack Notes

<!-- https://spectrocloud.atlassian.net/browse/DOC-2905 -->

<!-- prettier-ignore-start -->

- Palette support for the <VersionedLink text="Headlamp" url="/integrations/packs/?pack=headlamp" /> pack has exited Tech Preview and is now ready for production workloads. Refer to the [Headlamp](../clusters/cluster-management/headlamp.md) guide for more information.

<!-- prettier-ignore-end -->

## June 19, 2026 - Component Updates {#component-updates-2026-25}

<!-- COMPONENT UPDATES TICKET: DOC-2914 -->
<!-- RELEASE DATE: June 19, 2026 -->
<!-- RELEASE MANAGEMENT APPLIANCE: 4.9.x -->
<!-- RELEASE ARTIFACT STUDIO: 4.9.10 -->
<!-- RELEASE TERRAFORM VERSION: 0.29.x -->

The following components have been updated for Palette version 4.9.5 - 4.9.18.

<!-- BEGIN COMPONENT UPDATES BODY: DOC-2914. DO NOT DELETE. -->

### Improvements

<!-- prettier-ignore-start -->

<!-- https://spectrocloud.atlassian.net/browse/PAC-4185 -->

- The dependencies of [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) have been upgraded to the <VersionedLink text="Calico" url="/integrations/packs/?pack=cni-calico" /> version 3.32.0, <VersionedLink text="Piraeus" url="/integrations/packs/?pack=piraeus-operator" /> version 2.10.7, and <VersionedLink text="Zot Registry" url="/integrations/packs/?pack=zot-registry" /> version 0.1.117.

<!-- https://spectrocloud.atlassian.net/browse/PAC-4209 -->

- The <VersionedLink text="Registry Connect" url="/integrations/packs/?pack=registry-connect" /> pack version 0.2.0 is now FIPS compliant for [PaletteAI VM Launchpad](../vm-management/vm-launchpad/vm-launchpad.md) (formerly Launchpad for VMs) deployments.

<!-- prettier-ignore-end -->

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PCOM-731 -->

- Fixed an issue in [Artifact Studio](../downloads/artifact-studio.md) that prevented profile bundle cards from being
correctly paginated and displayed.
<!-- END COMPONENT UPDATES BODY: DOC-2914. DO NOT DELETE. -->

### Packs

<!-- BEGIN PACKS LIST BODY: DOC-2914. DO NOT DELETE. -->
<!-- prettier-ignore-start -->

| Pack Name | Layer | Non-FIPS | FIPS | New Version |
| --------- | ----- | -------- | ---- | ----------- |
| <VersionedLink text="argo-cd" url="/integrations/packs/?pack=argo-cd" /> | `addon` | :white_check_mark: | :x: | 9.5.21 |
| <VersionedLink text="aws-alb" url="/integrations/packs/?pack=aws-alb" /> | `addon` | :white_check_mark: | :x: | 3.4.0 |
| <VersionedLink text="cni-aws-vpc-eks-helm" url="/integrations/packs/?pack=cni-aws-vpc-eks-helm" /> | `cni` | :white_check_mark: | :x: | 1.21.2 |
| <VersionedLink text="cni-calico" url="/integrations/packs/?pack=cni-calico" /> | `cni` | :x: | :white_check_mark: | 3.32.0 |
| <VersionedLink text="cni-calico-azure" url="/integrations/packs/?pack=cni-calico-azure" /> | `cni` | :x: | :white_check_mark: | 3.32.0 |
| <VersionedLink text="cni-flannel" url="/integrations/packs/?pack=cni-flannel" /> | `cni` | :x: | :white_check_mark: | 0.28.5 |
| <VersionedLink text="csi-aws-ebs" url="/integrations/packs/?pack=csi-aws-ebs" /> | `csi` | :white_check_mark: | :x: | 1.61.1 |
| <VersionedLink text="csi-vsphere-csi" url="/integrations/packs/?pack=csi-vsphere-csi" /> | `csi` | :x: | :white_check_mark: | 3.7.1 |
| <VersionedLink text="external-secrets-operator" url="/integrations/packs/?pack=external-secrets-operator" /> | `addon` | :white_check_mark: | :x: | 2.6.0 |
| <VersionedLink text="istio" url="/integrations/packs/?pack=istio" /> | `addon` | :white_check_mark: | :x: | 1.30.1 |
| <VersionedLink text="piraeus-operator" url="/integrations/packs/?pack=piraeus-operator" /> | `csi` | :white_check_mark: | :x: | 2.10.7 |
| <VersionedLink text="piraeus-operator-addon" url="/integrations/packs/?pack=piraeus-operator-addon" /> | `addon` | :white_check_mark: | :x: | 2.10.7 |
| <VersionedLink text="vault" url="/integrations/packs/?pack=vault" /> | `addon` | :white_check_mark: | :x: | 0.33.0 |
| <VersionedLink text="zot-registry" url="/integrations/packs/?pack=zot-registry" /> | `addon` | :white_check_mark: | :white_check_mark: | 0.1.117 |

<!-- prettier-ignore-end -->

<!-- END PACKS LIST BODY: DOC-2914. DO NOT DELETE. -->

## June 12, 2026 - Component Updates {#component-updates-2026-24}

<!-- COMPONENT UPDATES TICKET: DOC-2896 -->
<!-- RELEASE DATE: June 12, 2026 -->
<!-- RELEASE MANAGEMENT APPLIANCE: 4.9.18 -->
<!-- RELEASE ARTIFACT STUDIO: 4.9.x -->
<!-- RELEASE TERRAFORM VERSION: 0.29.5 -->

The following components have been updated for Palette version 4.9.5 - 4.9.18.

| Component                                                                                                         | Version |
| ----------------------------------------------------------------------------------------------------------------- | ------- |
| [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) | 0.29.5  |
| [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) | 0.29.5  |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md)             | 4.9.18  |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)                    | 4.9.18  |

<!-- BEGIN COMPONENT UPDATES BODY: DOC-2896. DO NOT DELETE. -->

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PAC-4166 -->
<!-- prettier-ignore-start -->

- Fixed an issue that caused `ImagePullBackOff` errors in the <VersionedLink text="csi-local-path-provisioner" url="/integrations/packs/?pack=volume-snapshot-controller" /> FIPS pack version 0.0.32 due to incorrectly
referencing the non-FIPS `palette-images` image registry instead of the `palette-imagesfips` FIPS registry.

<!-- prettier-ignore-end -->

<!-- END COMPONENT UPDATES BODY: DOC-2896. DO NOT DELETE. -->

### Packs

<!-- BEGIN PACKS LIST BODY: DOC-2896. DO NOT DELETE. -->

<!-- prettier-ignore-start -->

| Pack Name | Layer | Non-FIPS | FIPS | New Version |
| --------- | ----- | -------- | ---- | ----------- |
| <VersionedLink text="cni-flannel" url="/integrations/packs/?pack=cni-flannel" /> | `cni` | :white_check_mark: | :x: | 0.28.5 |
| <VersionedLink text="csi-aws-ebs" url="/integrations/packs/?pack=csi-aws-ebs" /> | `csi` | :white_check_mark: | :white_check_mark: | 1.60.1 |
| <VersionedLink text="csi-azure" url="/integrations/packs/?pack=csi-azure" /> | `csi` | :white_check_mark: | :white_check_mark: | 1.34.4 |
| <VersionedLink text="csi-portworx-generic" url="/integrations/packs/?pack=csi-portworx-generic" /> | `csi` | :white_check_mark: | :x: | 3.6.1 |
| <VersionedLink text="csi-vsphere-csi" url="/integrations/packs/?pack=csi-vsphere-csi" /> | `csi` | :white_check_mark: | :x: | 3.7.1 |
| <VersionedLink text="portworx-add-on" url="/integrations/packs/?pack=portworx-add-on" /> | `addon` | :white_check_mark: | :x: | 3.6.1 |
| <VersionedLink text="reloader" url="/integrations/packs/?pack=reloader" /> | `add-on` | :white_check_mark: | :x: | 1.4.17 |
| <VersionedLink text="traefik" url="/integrations/packs/?pack=traefik" /> | `add-on` | :white_check_mark: | :x: | 40.3.0 |
| <VersionedLink text="volume-snapshot-controller" url="/integrations/packs/?pack=volume-snapshot-controller" /> | `addon` | :white_check_mark: | :x: | 8.6.0 |

<!-- prettier-ignore-end -->

<!-- END PACKS LIST BODY: DOC-2896. DO NOT DELETE. -->

## June 11, 2026 - Release 4.9.18

The following component updates are applicable to this release:

- [June 12, 2026 - Component Updates](#component-updates-2026-24) <!-- omit in toc -->
- [June 19, 2026 - Component Updates](#component-updates-2026-25) <!-- omit in toc -->
- [July 3, 2026 - Component Updates](#component-updates-2026-27) <!-- omit in toc -->
- [July 10, 2026 - Component Updates](#component-updates-2026-28) <!-- omit in toc -->
- [July 17, 2026 - Component Updates](#component-updates-2026-29) <!-- omit in toc -->
- [July 24, 2026 - Component Updates](#component-updates-2026-30) <!-- omit in toc -->

<!-- PATCH RELEASE TICKET: DOC-2887 -->

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PE-8522 -->

- Fixed an issue that caused the [two-node](../clusters/edge/architecture/two-node.md) liveness server to expose the
  database password endpoint without authentication, TLS, or access controls.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11122 -->

- The help links on the Palette home page now correctly point to the
  [Spectro Cloud Support portal](https://spectrocloud.atlassian.net/servicedesk/customer/portal/6).

<!-- https://spectrocloud.atlassian.net/browse/PCP-6888 -->

- Fixed an issue that caused the removal of the built-in `ubuntu` user during SSH key injection for
  [MAAS clusters](../clusters/data-center/maas/maas.md).

<!-- https://spectrocloud.atlassian.net/browse/PE-8473 -->

- Fixed an issue that prevented the pack lifecycle stages from executing during a Kubernetes upgrade due to the
  configuration file being inaccessible inside the upgrade container.

<!-- https://spectrocloud.atlassian.net/browse/PE-8837 -->

- Fixed an issue that caused the `debug/pprof` profiling interface to be unintentionally exposed on ports `9443`,
  `7443`, and `5082`.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10939 -->

- Fixed an issue that caused the Palette message broker to stop functioning as expected, leading to timeouts and
  degraded platform responsiveness.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11067 -->

- Fixed an issue that caused excessive memory utilization in Hubble pods due to high goroutine counts resulting from
  message broker call patterns.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11119 -->

- Fixed redundant cluster status cache broadcasts by limiting eviction to cluster state changes, significantly reducing
  unnecessary cache reloads.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.18 Palette release is 4.9.13.

:::

### Automation

:::info

The [Palette CLI](../automation/palette-cli/palette-cli.md) version corresponding to the 4.9.18 Palette release is
4.9.7. Refer to [CLI Tools](/downloads/cli-tools/) for the download URL and checksum.

:::

## June 8, 2026 - Release 4.9.16

The following component updates are applicable to this release:

- [June 12, 2026 - Component Updates](#component-updates-2026-24) <!-- omit in toc -->
- [June 19, 2026 - Component Updates](#component-updates-2026-25) <!-- omit in toc -->
- [July 3, 2026 - Component Updates](#component-updates-2026-27) <!-- omit in toc -->
- [July 10, 2026 - Component Updates](#component-updates-2026-28) <!-- omit in toc -->
- [July 17, 2026 - Component Updates](#component-updates-2026-29) <!-- omit in toc -->
- [July 24, 2026 - Component Updates](#component-updates-2026-30) <!-- omit in toc -->

### Breaking Changes {#breaking-changes-4-9-16}

<!-- https://spectrocloud.atlassian.net/browse/PEM-10828 -->

- Authentication is now required for the following [Palette API](/api/introduction/) endpoints, which are used for
  [imported clusters](../clusters/imported-clusters/imported-clusters.md) and
  [Private Cloud Gateways (PCGs)](../clusters/pcg/pcg.md).

  | **Endpoint**                                | **Required Permissions**                                                                     |
  | ------------------------------------------- | -------------------------------------------------------------------------------------------- |
  | `/cluster/{uid}/manifest`                   | `cluster.delete` permission                                                                  |
  | `/v1/pcg/{uid}/services/ally/manifest`      | [Tenant Admin](../user-management/palette-rbac/tenant-scope-roles-permissions.md#admin) role |
  | `/v1/pcg/{uid}/services/jet/manifest`       | [Tenant Admin](../user-management/palette-rbac/tenant-scope-roles-permissions.md#admin) role |
  | `/v1/spectroclusters/{uid}/import/manifest` | `cluster.delete` permission                                                                  |

  This change does _not_ affect existing imported clusters and PCGs; it affects _new_ cluster import and PCG workflows,
  as well as any automation that retrieves manifests from the affected endpoints. As a result, the process of
  [importing clusters](../clusters/imported-clusters/cluster-import.md) and
  [creating PCGs on existing Kubernetes clusters](../clusters/pcg/deploy-pcg-k8s.md) has been updated, requiring the
  manifests to be downloaded locally before being applied.

### Features

<!-- https://spectrocloud.atlassian.net/browse/PCP-5929 -->

- Palette now supports selecting the node pool operating system for
  [Azure AKS clusters](../clusters/public-cloud/azure/aks.md) through a new **OS SKU** field. When the OS type is
  **Linux**, you can choose **Ubuntu** or **Azure Linux**; when the OS type is **Windows**, the node pool uses **Windows
  2022**.

  - The OS SKU is set when the node pool is created and cannot be changed afterward. The OS version is selected
    automatically based on the
    [cluster's Kubernetes version and default OS version](https://learn.microsoft.com/en-us/azure/aks/upgrade-os-version#supported-os-versions);
    Kubernetes version 1.32 and later provision Azure Linux 3.0.

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PEM-11029 -->

- Fixed an issue that caused custom Transport Layer Security (TLS) certificate loss when upgrading IP-based
  [self-hosted Palette](../enterprise-version/enterprise-version.md) and [Palette VerteX](../vertex/vertex.md)
  environments installed using the
  [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md),
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md), or
  [Helm charts](../enterprise-version/install-palette/install-on-kubernetes/install-on-kubernetes.md). We recommend
  customers upgrading to any Palette version between 4.8.47 - 4.9.14 back up their custom certificates prior to
  initiating the upgrade. Refer to
  [Scenario - Custom Certificate Handling During Upgrade](../troubleshooting/palette-upgrade.md#scenario---custom-certificate-replaced-after-upgrade)
  for more information.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.16 Palette release is 4.9.11.

:::

### Automation

:::info

The [Palette CLI](../automation/palette-cli/palette-cli.md) version corresponding to the 4.9.16 Palette release is
4.9.6. Refer to [CLI Tools](/downloads/cli-tools/) for the download URL and checksum.

:::

## June 5, 2026 - Component Updates {#component-updates-2026-23}

<!-- COMPONENT UPDATES TICKET: DOC-2869 -->
<!-- RELEASE DATE: June 5, 2026 -->
<!-- RELEASE MANAGEMENT APPLIANCE: 4.9.x -->
<!-- RELEASE ARTIFACT STUDIO: 4.9.3 -->
<!-- RELEASE TERRAFORM VERSION: 0.29.4 -->

The following components have been updated for Palette version 4.9.5 - 4.9.14.

| Component                                                                                                         | Version |
| ----------------------------------------------------------------------------------------------------------------- | ------- |
| [Artifact Studio](../downloads/artifact-studio.md)                                                                | 4.9.3   |
| [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) | 0.29.4  |
| [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) | 0.29.4  |

<!-- BEGIN COMPONENT UPDATES BODY. DO NOT DELETE. -->

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PLT-2215 -->

- The
  [`spectrocloud_cluster_aks` Terraform resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_aks)
  now allows you to specify the OS SKU for AKS node pools using the optional `os_sku` field in the `machine_pool` block.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2236 -->

- Terraform cluster resources now support triggering manual control plane Kubernetes Public Key Infrastructure (PKI)
  certificates for Palette clusters using the new `renew_k8s_certificates_now` field.

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PLT-2173 -->

- Fixed a Terraform issue where updating the `cluster_profile` list on the
  [`spectrocloud_cluster_eks` Terraform resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_eks)
  triggered an erroneous deletion of the removed profile and incorrectly updated the Terraform state.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2249 -->

- Fixed a Terraform issue where imported
[`spectrocloud_cluster_edge_native`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_edge_native)
resources would repeatedly show Terraform plan differences for sensitive cluster profile variables.
<!-- END COMPONENT UPDATES BODY. DO NOT DELETE. -->

### Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-4123 -->

| Pack Name        | Layer  | Non-FIPS           | FIPS               | New Version |
| ---------------- | ------ | ------------------ | ------------------ | ----------- |
| Amazon EBS CSI   | CSI    | :x:                | :white_check_mark: | 1.60.0      |
| Azure Disk       | CSI    | :x:                | :white_check_mark: | 1.34.3      |
| Calico           | CNI    | :white_check_mark: | :x:                | 3.32.0      |
| External Secrets | Add-on | :white_check_mark: | :x:                | 2.5.0       |
| Flannel          | CNI    | :x:                | :white_check_mark: | 0.28.4      |
| Headlamp         | Add-on | :white_check_mark: | :x:                | 0.42.0-rev1 |
| Istio            | Add-on | :white_check_mark: | :x:                | 1.30.0      |
| Karpenter        | Add-on | :x:                | :white_check_mark: | 1.12.1      |
| MetalLB          | Add-on | :white_check_mark: | :x:                | 0.16.1      |

#### Pack Notes

<!-- prettier-ignore-start -->

- The <VersionedLink text="Crossplane" url="/integrations/packs/?pack=crossplane" /> pack version 2.3.0 is now available in the Palette Community Registry.

<!-- prettier-ignore-end -->

## May 31, 2026 - Release 4.9.14 {#release-notes-4-9-14}

The following component updates are applicable to this release:

- [June 5, 2026 - Component Updates](#component-updates-2026-23) <!-- omit in toc -->
- [June 12, 2026 - Component Updates](#component-updates-2026-24) <!-- omit in toc -->
- [June 19, 2026 - Component Updates](#component-updates-2026-25) <!-- omit in toc -->
- [July 3, 2026 - Component Updates](#component-updates-2026-27) <!-- omit in toc -->
- [July 10, 2026 - Component Updates](#component-updates-2026-28) <!-- omit in toc -->
- [July 17, 2026 - Component Updates](#component-updates-2026-29) <!-- omit in toc -->
- [July 24, 2026 - Component Updates](#component-updates-2026-30) <!-- omit in toc -->

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4-9-a}

#### Breaking Changes {#breaking-changes-4-9-a}

<!-- https://spectrocloud.atlassian.net/browse/PCP-6185 -->

- Palette now uses IAM Roles for Service Accounts (IRSA) instead of kube2iam for Velero backup operations on
  [EKS clusters](../clusters/public-cloud/aws/eks.md) that use AWS Security Token Service (STS) credentials.

  To prevent backup disruptions,
  [pause agent upgrades](../clusters/cluster-management/platform-settings/pause-platform-upgrades.md) on your EKS
  clusters before upgrading to Palette 4.9.14 and update the backup IAM role's trust policy by adding the EKS cluster's
  OpenID Connect (OIDC) provider as a federated principal and allowing the `sts:AssumeRoleWithWebIdentity` action. Refer
  to
  [Add Backup Location using Dynamic Credentials](../clusters/cluster-management/backup-restore/add-backup-location-dynamic.md)
  for detailed instructions on updating the trust policy.

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PCP-4787 -->

- <TpBadge /> Palette now supports overriding Cluster API (CAPI) properties on AWS IaaS and Azure AKS clusters. This
  allows you to configure advanced provider-specific settings not natively exposed by Palette by supplying YAML that
  targets the underlying CAPI provider objects directly. For more information, refer to [Override Cluster API (CAPI)
  Properties](../architecture/override-capi-properties/override-capi-properties.md).

<!-- https://spectrocloud.atlassian.net/browse/PCP-5930 -->

- Palette now supports deployment of
  [Generation 2 (Gen 2) Azure VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/generation-2) on AKS
  clusters. When you select an instance type that supports Gen 2 (for example, `Standard_D8ds_v6`), Azure automatically
  provisions the nodes as Gen 2 VMs instead of Gen 1 VMs. Changing a node pool's instance type between Gen 1 and Gen 2
  variants on a running cluster triggers a
  [node pool repave](../clusters/cluster-management/node-pool.md#repave-behavior-and-configuration). For more
  information, refer to [Create and Manage Azure AKS Cluster](../clusters/public-cloud/azure/aks.md).

  - For further upgrade guidance, review the
    [Azure documentation](https://learn.microsoft.com/en-us/azure/virtual-machines/generation-2). This covers supported
    size families and the move to UEFI-based boot architecture.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5897 -->

- SSH key injection is now supported for [MAAS clusters](../clusters/data-center/maas/create-manage-maas-clusters.md).

<!-- https://spectrocloud.atlassian.net/browse/PRM-2624 -->

- [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) and
  [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md) version 4.9.14 are now
  available.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/DOC-2822 -->

- <TpBadge /> You can now use a pre-built Docker image to import a MAAS-compatible CentOS Stream CoreOS (SCOS) image
  when [preparing the CoreOS
  image](../clusters/data-center/maas/create-manage-maas-openshift-clusters-hypershift/prepare-coreos-image.md) required
  for OpenShift workload clusters on MAAS using HyperShift. This provides a faster alternative to building a custom Red
  Hat Enterprise Linux CoreOS (RHCOS) image from source.

<!-- https://spectrocloud.atlassian.net/browse/DOC-2788 -->

- The metrics server commands for
  [imported read-only clusters](../clusters/imported-clusters/cluster-import.md#read-only-mode) now use the
  [Kubernetes Metrics Server](https://kubernetes-sigs.github.io/metrics-server/) Helm chart instead of Bitnami.

<!-- https://spectrocloud.atlassian.net/browse/PEM-9692 -->

- The ability to **Force sync** [registries](../registries-and-packs/registries/registries.md) has been added to
  **Tenant Settings** > **Registries**. Use this option to interrupt and restart ongoing synchronization processes that
  have been in progress for at least one hour.

<!-- https://spectrocloud.atlassian.net/browse/PEM-8010 -->

- A list of available and allocated IP addresses is now displayed for VMware vSphere
  [IP Address Management (IPAM) node pools](../clusters/pcg/manage-pcg/create-manage-node-pool.md).

#### Deprecations and Removals

<!-- https://spectrocloud.atlassian.net/browse/PEM-10226 -->

- The internal [Ingress Nginx](https://www.kubernetes.dev/blog/2025/11/12/ingress-nginx-retirement/) controller used by
  Palette and Palette VerteX management plane services has been fully removed. Traefik, introduced in 4.8.47, is now the
  sole management cluster ingress controller. The management plane removes leftover Ingress Nginx objects automatically
  at startup (such as Deployments, Services, Secrets, and more), preventing the need for manual cleanup. Self-hosted
  installations retain the `ingress-nginx` namespace and `default-ssl-certificate` Secret due to the the cert-bridge
  introduced in 4.8.47, which continues to copy the uploaded Transport Layer Security (TLS) certificate from that Secret
  into Traefik.

  - **Google Kubernetes Engine (GKE) pre-upgrade requirement** - The principal running `helm upgrade` must have the
    `container.roles.delete`, `container.roleBindings.delete`, `container.clusterRoles.delete`, and
    `container.clusterRoleBindings.delete` Cloud Identity and Access Management (IAM) permissions. Refer to
    [Upgrade Palette on Kubernetes](../enterprise-version/upgrade/upgrade-k8s/non-airgap.md) for details.
  - **Recommended `values.yaml` hygiene** - The `ingress.type` and `ingress.ingress.internal` fields have been removed
    from the Palette Helm chart. Any references that remain in your override file are ignored; however, we recommend
    removing both fields for hygiene purposes. Refer to
    [Helm Configuration Reference](../enterprise-version/install-palette/install-on-kubernetes/palette-helm-ref.md) for
    the current set of supported parameters.
  - **Recovery** - If the `configserver` is not **Ready** after upgrading due to leftover Ingress Nginx pods holding
    host ports, refer to our
    [Troubleshooting](../troubleshooting/palette-upgrade.md#configserver-stuck-on-init-rootdomain-traefik-after-upgrade-to-4914)
    guide for the manual cleanup procedure.

<!-- https://spectrocloud.atlassian.net/browse/PE-8669 -->

- [EKS Hybrid Nodes](../clusters/public-cloud/aws/eks-hybrid-nodes/eks-hybrid-nodes.md) are now deprecated in Palette
  and Palette VerteX. We recommend that customers deploy their workloads to
  [EKS clusters](../clusters/public-cloud/aws/eks.md) instead.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PEM-10824 -->

- Fixed an issue that caused strict YAML validators and GitOps tools to reject
  [self-hosted Palette](../enterprise-version/enterprise-version.md) deployment templates due to a duplicate
  `securityContext` configuration block in the Helm chart.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6583 -->

- Fixed an issue that caused scheduled [OS patching](../clusters/cluster-management/os-patching.md) to run only once
  instead of on the configured recurring schedule.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10718 -->

- Fixed an issue that caused the **Clusters** page to hang indefinitely when accessed by users with a
  [custom tenant role](../user-management/palette-rbac/create-custom-role.md) that lacked virtual cluster permissions.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10636 -->

- Fixed an issue that caused multi-line formatting in
  [cluster profile](../profiles/cluster-profiles/cluster-profiles.md) and cluster description fields to be lost after
  saving.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6498 -->

- Fixed an issue that caused changes to additional security groups on
  [AWS IaaS](../clusters/public-cloud/aws/create-cluster.md) node pools to be silently ignored when replacing one
  security group with another without changing the total count.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10599 -->

- Fixed an issue that caused intermittent `no subscriber found` errors when performing
  [MAAS cloud account](../clusters/data-center/maas/register-manage-maas-cloud-accounts.md) operations through a
  [Private Cloud Gateway (PCG)](../clusters/pcg/pcg.md).

<!-- https://spectrocloud.atlassian.net/browse/PEM-10547 -->

- Fixed an issue that caused the **Cluster Settings** > **Cluster Configuration** page to display a generic error when
  attempting to show SSH key names for users whose role lacked the permission `sshKey.list`.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6452 -->

- Fixed an issue that caused [MAAS cluster](../clusters/data-center/maas/create-manage-maas-clusters.md) node pools
  configured with multiple placement tags to match machines using only the last tag instead of all specified tags.

<!-- https://spectrocloud.atlassian.net/browse/PEM-10527 -->

- Fixed an issue that caused [EKS cluster](../clusters/public-cloud/aws/eks.md) add-on packs to appear as not ready in
  the Palette UI, even though the packs were deployed successfully and the cluster was running.

<!-- https://spectrocloud.atlassian.net/browse/PCP-5840 -->

- Fixed an issue that caused
  [add-on Helm charts](../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-helm-addon.md)
  that entered an `uninstalling` state to remain stuck indefinitely, preventing the pack from being redeployed.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6478 -->

- Fixed an issue that caused [virtual clusters](../clusters/palette-virtual-clusters/palette-virtual-clusters.md)
  deployed on EKS 1.34 and 1.35 host clusters to fail or have add-on packs permanently stuck in a not ready state.

  <!-- https://spectrocloud.atlassian.net/browse/PCP-6453 -->

- Fixed an issue that prevented [virtual clusters](../clusters/palette-virtual-clusters/palette-virtual-clusters.md)
  from being deployed on EKS host clusters when the Kubernetes version on the virtual cluster and host cluster did not
  match.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-691 -->

- Fixed an issue that prevented
  [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) version 4.9.8
  from installing on Secure Boot hardened infrastructures.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.14 Palette release is 4.9.10.

:::

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PEM-11038 -->

- Palette now supports building
  [Ubuntu 24.04 STIG-compliant images](../clusters/edge/edgeforge-workflow/palette-canvos/build-provider-images/build-ubuntu-stig-image.md)
  for use in Edge deployments.

<!-- https://spectrocloud.atlassian.net/browse/PE-8427 -->

- The Palette agent can now be uninstalled from Edge hosts deployed with Agent Mode using the `palette-agent uninstall`
command. Refer to our
[Install Palette Agent](../deployment-modes/agent-mode/install-agent-host.md#uninstall-palette-agent) guide for more
information.
<!-- https://spectrocloud.atlassian.net/browse/PE-3561 -->

<!-- prettier-ignore-start -->

- <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" /> is now supported for Trusted Boot. Refer to the [Trusted Boot](../clusters/edge/trusted-boot/trusted-boot.md) page for a list of supported configurations for clusters deployed on Trusted Boot-enabled Edge hosts.

<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PE-7637 -->

- Network Time Protocol (NTP) values can now be configured per Edge host via
  [user data](../clusters/edge/edge-configuration/installer-reference.md) using `stylus.site.ntpServers`, the
  [Edge TUI](../clusters/edge/site-deployment/site-installation/initial-setup.md), or
  [Local UI](../clusters/edge/local-ui/local-ui.md). NTP values used during cluster creation override the servers
  configured on individual hosts.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PE-8523 -->

- Fixed an issue that could allow unauthenticated users to
  [upload content bundles](../clusters/edge/local-ui/cluster-management/upload-content-bundle.md) to Edge hosts under
  certain conditions. Refer to
  [Security Advisory 016](../security-bulletins/security-advisories/security-advisories.md#security-advisory-016---upload-service-authentication-bypass)
  for more information.

<!-- https://spectrocloud.atlassian.net/browse/PE-8716 -->

- Fixed an issue on Edge clusters with [image swap](../clusters/cluster-management/image-swap.md) enabled that caused
  cluster upgrade tasks to get stuck due to the image-swap webhook interfering with Kubernetes Job completion.

<!-- https://spectrocloud.atlassian.net/browse/PE-8570 -->

- Fixed an issue that caused Kubernetes upgrades on [Edge clusters](../clusters/edge/edge.md) to fail when the host OS
  root password had expired.

<!-- https://spectrocloud.atlassian.net/browse/PE-8507 -->

- Fixed an issue that caused `systemd-networkd-wait-online.service` to fail on the first boot of
  [Edge hosts](../clusters/edge/site-deployment/site-installation/site-installation.md) with `managementMode: local` and
  `includeTui: true`, even after configuring network settings through the TUI.

<!-- https://spectrocloud.atlassian.net/browse/PE-7651 -->

- Fixed an issue that allowed a Kubernetes upgrade to proceed on [Edge clusters](../clusters/edge/edge.md) even when a
  previous upgrade had not completed successfully, potentially leaving the cluster in an inconsistent state.

### VerteX

#### Features

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4-9-a) for more details.

### Automation

:::info

The [Palette CLI](../automation/palette-cli/palette-cli.md) version corresponding to the 4.9.14 Palette release is
4.9.5. Refer to [CLI Tools](/downloads/cli-tools/) for the download URL and checksum.

:::

#### Deprecations and Removals

<!-- https://spectrocloud.atlassian.net/browse/DOC-2801 -->

- The Palette Edge CLI has been deprecated and there will be no further releases. For continued functionality, use the
  Palette CLI instead. Refer to the [Palette CLI documentation](../automation/palette-cli/palette-cli.md) for more
  information.

#### Features

- Terraform version 0.29.3 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 0.29.3 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) is
  now available.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PLT-2246 -->
<!-- https://spectrocloud.atlassian.net/browse/PLT-2226 -->

- The
  [`spectrocloud_cluster_aks`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_aks)
  and
  [`spectrocloud_cluster_aws`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_aws)
  Terraform resources now support Cluster API property overrides using the `override_cluster_api_config` field.

<!-- https://spectrocloud.atlassian.net/browse/PLT-2232 -->

- The
  [`spectrocloud_cluster_maas`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_maas)
  Terraform resource now supports the injection of SSH keys into MAAS nodes using the `ssh_keys` field.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PLT-2242 -->

- Fixed an issue that caused the
  [`spectrocloud_cluster_edge_native`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_edge_native)
  Terraform resource to incorrectly reconcile VIP values after import.

### Docs and Education

- A new
  [Standardize Cluster Provisioning and Maintenance with Cluster Templates using Terraform](../tutorials/clusters/cluster-templates/standardize-clusters-with-cluster-templates-terraform.md)
  tutorial is now available. Follow it to learn how to use the Spectro Cloud Terraform provider to create cluster
  templates, deploy standardized clusters, and manage lifecycle updates with infrastructure as code.

- Documentation improvements have been made for EKS Pod Identity on the
  [Register and Manage AWS Accounts](../clusters/public-cloud/aws/add-aws-accounts.md) and
  [Enable Pod Identity for ECR Authentication](../clusters/public-cloud/aws/enable-pod-identity-ecr.md) pages. This
  includes clarifying the required permissions for the Palette IAM role when using
  [Minimum Permissions Policies](../clusters/public-cloud/aws/required-iam-policies/minimum-permissions-policies.md) and
  providing more detailed instructions for identifying the IAM role for ECR authentication.

### Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-4115 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4101 -->

| Pack Name                  | Layer  | Non-FIPS           | FIPS | New Version |
| -------------------------- | ------ | ------------------ | ---- | ----------- |
| Amazon EFS                 | CSI    | :white_check_mark: | :x:  | 3.2.0       |
| Cilium                     | CNI    | :white_check_mark: | :x:  | 1.19.4      |
| Headlamp                   | Add-on | :white_check_mark: | :x:  | 0.42.0      |
| Karpenter                  | Add-on | :white_check_mark: | :x:  | 1.12.1      |
| Portworx with Operator     | CSI    | :white_check_mark: | :x:  | 3.6.0       |
| Volume Snapshot Controller | Add-on | :white_check_mark: | :x:  | 8.5.0-rev1  |

#### Pack Notes

<!-- https://spectrocloud.atlassian.net/browse/PAC-4101 -->

<!-- prettier-ignore-start -->

The <VersionedLink text="Volume Snapshot Controller" url="/integrations/packs/?pack=volume-snapshot-controller" /> version 8.5.0-rev1 supports the [snapshot conversion webhook](https://github.com/kubernetes-csi/external-snapshotter/blob/master/deploy/kubernetes/webhook-example/README.md).

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

The following community packs have been released:

- <VersionedLink text="Fluentbit" url="/integrations/packs/?pack=fluentbit" /> version 5.0.5
- <VersionedLink text="Trident" url="/integrations/packs/?pack=csi-trident" /> version 26.02.1

<!-- prettier-ignore-end -->

## May 22, 2026 - Component Updates {#component-updates-2026-21}

The following components have been updated for Palette version 4.9.5 - 4.9.8.

| Component                                                                                                         | Version |
| ----------------------------------------------------------------------------------------------------------------- | ------- |
| [Artifact Studio](../downloads/artifact-studio.md)                                                                | 4.9.2   |
| [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) | 0.29.2  |
| [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) | 0.29.2  |

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PLT-2240 -->

- Fixed a Terraform issue where `terraform apply` failed to reconcile add-on cluster profile drift in clusters when the
  add-on cluster profile is managed in Terraform but updated in the Palette UI.

### Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-3910 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4071 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4073 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4074 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4075 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4099 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4105 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4110 -->

| Pack Name                                                                | Layer  | Non-FIPS           | FIPS               | New Version |
| ------------------------------------------------------------------------ | ------ | ------------------ | ------------------ | ----------- |
| [Amazon EBS CSI](/integrations/packs/?pack=csi-aws-ebs)                  | CSI    | :white_check_mark: | :x:                | 1.60.0      |
| [Amazon EFS](/integrations/packs/?pack=csi-aws-efs)                      | CSI    | :white_check_mark: | :x:                | 3.1.0       |
| [Calico Network Policy](/integrations/packs/?pack=calico-network-policy) | Add-on | :white_check_mark: | :x:                | 3.32.0      |
| [ExternalDNS](/integrations/packs/?pack=external-dns)                    | Add-on | :white_check_mark: | :x:                | 0.21.0      |
| [GCE Persistent Disk CSI](/integrations/packs/?pack=csi-gcp-driver)      | CSI    | :white_check_mark: | :x:                | 1.25.2      |
| [Spectro Proxy](/integrations/packs/?pack=spectro-proxy)                 | Add-on | :x:                | :white_check_mark: | 1.5.6       |
| [Tigera Operator](/integrations/packs/?pack=tigera-operator)             | CNI    | :white_check_mark: | :x:                | 3.32.0      |
| [Traefik](/integrations/packs/?pack=traefik)                             | Add-on | :white_check_mark: | :x:                | 40.2.0      |

#### Community Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-4095 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4096 -->

| Pack Name                                                  | Layer  | New Version |
| ---------------------------------------------------------- | ------ | ----------- |
| [ECK Operator](/integrations/packs/?pack=elastic-operator) | Add-on | 3.4.0       |
| [ECK Stack](/integrations/packs/?pack=elastic-stack)       | Add-on | 0.19.0      |

## May 15, 2026 - Component Updates {#component-updates-2026-20}

The following components have been updated for Palette version 4.9.5 - 4.9.8.

| Component                                                                                             | Version |
| ----------------------------------------------------------------------------------------------------- | ------- |
| [Artifact Studio](../downloads/artifact-studio.md)                                                    | 4.9.1   |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) | 4.9.8   |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)        | 4.9.8   |

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PCOM-442 -->

- The [Artifact Studio](../downloads/artifact-studio.md) pack version dropdown now displays expanded version
  information, distinguishing between the pack component version and the Palette compatibility version. A tooltip also
  helps users clarify the difference between these version types.

### Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-4060 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4097 -->

| Pack Name                    | Layer  | Non-FIPS           | FIPS | New Version |
| ---------------------------- | ------ | ------------------ | ---- | ----------- |
| AWS Application Loadbalancer | Add-on | :white_check_mark: | :x:  | 3.3.0       |
| Cilium Tetragon              | Add-on | :white_check_mark: | :x:  | 1.7.0       |
| External Secrets             | Add-on | :white_check_mark: | :x:  | 2.4.1       |
| Harbor                       | Add-on | :white_check_mark: | :x:  | 1.19.0      |
| Karpenter                    | Add-on | :white_check_mark: | :x:  | 1.12.0      |
| Open Policy Agent            | Add-on | :white_check_mark: | :x:  | 3.22.2      |
| Traefik                      | Add-on | :white_check_mark: | :x:  | 40.0.0      |

## May 14, 2026 - Release 4.9.8

The following component updates are applicable to this release:

- [May 15, 2026 - Component Updates](#component-updates-2026-20) <!-- omit in toc -->
- [May 22, 2026 - Component Updates](#component-updates-2026-21) <!-- omit in toc -->
- [June 5, 2026 - Component Updates](#component-updates-2026-23) <!-- omit in toc -->
- [June 12, 2026 - Component Updates](#component-updates-2026-24) <!-- omit in toc -->
- [June 19, 2026 - Component Updates](#component-updates-2026-25) <!-- omit in toc -->
- [July 3, 2026 - Component Updates](#component-updates-2026-27) <!-- omit in toc -->
- [July 10, 2026 - Component Updates](#component-updates-2026-28) <!-- omit in toc -->
- [July 17, 2026 - Component Updates](#component-updates-2026-29) <!-- omit in toc -->
- [July 24, 2026 - Component Updates](#component-updates-2026-30) <!-- omit in toc -->

<!-- PATCH RELEASE TICKET: DOC-2824 -->

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PE-8535 -->

- The [Palette TUI](../clusters/edge/site-deployment/site-installation/initial-setup.md) now supports changing the root
  user's password.

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PPD-1603 -->

- Fixed an issue in the [vCluster](https://www.vcluster.com/) template that caused vCluster deployments to fail for both
  k3s and generic Kubernetes configurations.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6604 -->

- Fixed an issue that caused
  [MAAS Clusters Using LXD VMs](../clusters/data-center/maas/create-manage-maas-lxd-clusters.md) to fail with "no
  eligible LXD host found" due to storage availability being incorrectly parsed as zero, even when hosts had sufficient
  free disk space.

<!-- https://spectrocloud.atlassian.net/browse/PE-8641 -->

- Fixed an issue where Kubernetes and [kube-vip](https://kube-vip.io/) continue running with stale certificates after a
  certificate renewal.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6633 -->

- Fixed an issue that caused [EKS clusters](../clusters/public-cloud/aws/eks.md) configured with static placement or
  private endpoint access to fail to deploy due to EC2 permission errors.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.8 Palette release is 4.9.7.

:::

## May 11, 2026 - Release 4.9.6

The following component updates are applicable to this release:

- [May 15, 2026 - Component Updates](#component-updates-2026-20) <!-- omit in toc -->
- [May 22, 2026 - Component Updates](#component-updates-2026-21) <!-- omit in toc -->
- [June 5, 2026 - Component Updates](#component-updates-2026-23) <!-- omit in toc -->
- [June 12, 2026 - Component Updates](#component-updates-2026-24) <!-- omit in toc -->
- [June 19, 2026 - Component Updates](#component-updates-2026-25) <!-- omit in toc -->
- [July 3, 2026 - Component Updates](#component-updates-2026-27) <!-- omit in toc -->
- [July 10, 2026 - Component Updates](#component-updates-2026-28) <!-- omit in toc -->
- [July 17, 2026 - Component Updates](#component-updates-2026-29) <!-- omit in toc -->
- [July 24, 2026 - Component Updates](#component-updates-2026-30) <!-- omit in toc -->

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PE-8525 -->
<!-- https://spectrocloud.atlassian.net/browse/PE-8545 -->

- [Local UI](../clusters/edge/local-ui/local-ui.md) now supports dropdown profile variables for locally managed Edge
  clusters.

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PE-8509 -->

- Fixed an issue that caused Palette to register `429` rate limit errors due to excessive calls on the `/v1/edgehosts`
  [API endpoint](/api/category/palette-api-v1/).

<!-- https://spectrocloud.atlassian.net/browse/PCP-6560 -->
<!-- prettier-ignore-start -->

- Fixed an issue that caused Azure IaaS clusters using <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> version 1.32.13 or earlier to get stuck when upgrading to a PXK version in 1.33.x series.

<!-- https://spectrocloud.atlassian.net/browse/PE-8607 -->

- Fixed an issue that caused Edge hosts using <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" /> to become inaccessible after certificate renewal.

<!-- prettier-ignore-end -->

<!-- https://spectrocloud.atlassian.net/browse/PEM-10677 -->

- The dependencies of the `mongo-enterprise` Palette image were updated to the latest versions, ensuring that it has the
  latest security patches.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6259 -->

- The Spectro Cloud Ubuntu images were rebuilt to ensure that they contain the latest security patches.

<!-- https://spectrocloud.atlassian.net/browse/PE-8564 -->

- The dependencies of the Palette agent were updated to the latest versions, ensuring that it has the latest security
  patches.

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.9.6 Palette release is 4.9.6.

:::

## May 8, 2026 - Component Updates {#component-updates-2026-19}

The following components have been updated for Palette version 4.9.5.

| Component                                                                                                         | Version |
| ----------------------------------------------------------------------------------------------------------------- | ------- |
| [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) | 0.29.1  |
| [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) | 0.29.1  |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md)             | 4.9.6   |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)                    | 4.9.6   |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md)             | 4.8.54  |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)                    | 4.8.54  |
| [Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md)             | 4.7.40  |
| [VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md)                    | 4.7.40  |

### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PCOM-404 -->

- The Palette AI [Artifact Studio](../downloads/artifact-studio.md) is now available at
  [https://artifact-studio.spectrocloud.com/palette-ai-studio](https://artifact-studio.spectrocloud.com/palette-ai-studio).

### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PLT-2228 -->

- Fixed an issue that caused the Terraform plan operation of the
  [`spectrocloud_cluster_eks` Terraform resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_eks)
  to fail when the `eks_launch_template` block is added inside `machine_pool`.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-413 -->

- Fixed an issue that caused
  [Palette VerteX installations in an airgap VMware vSphere environment](../vertex/install-palette-vertex/install-on-vmware/airgap-install/airgap-install.md)
  to fail due to OVA download timeout errors.

<!-- https://spectrocloud.atlassian.net/browse/PCOM-418 -->

- Fixed an issue that caused
  [Palette VerteX installations in an airgap VMware vSphere environment](../vertex/install-palette-vertex/install-on-vmware/airgap-install/airgap-install.md)
  to fail due to incorrect CoreDNS configuration.

### Packs

<!-- https://spectrocloud.atlassian.net/browse/PAC-3972 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-3977 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-3973 -->
<!-- https://spectrocloud.atlassian.net/browse/PAC-4019 -->

| Pack Name                    | Layer      | Non-FIPS           | FIPS               | New Version |
| ---------------------------- | ---------- | ------------------ | ------------------ | ----------- |
| Amazon EBS CSI               | CSI        | :white_check_mark: | :x:                | 1.59.0      |
| Amazon EBS CSI               | CSI        | :x:                | :white_check_mark: | 1.58.0      |
| Amazon EFS                   | CSI        | :white_check_mark: | :x:                | 3.0.1       |
| AWS Application Loadbalancer | Add-on     | :white_check_mark: | :x:                | 3.22.2      |
| Azure Disk                   | CSI        | :white_check_mark: | :x:                | 1.34.3      |
| K3s                          | Kubernetes | :white_check_mark: | :x:                | 1.35.3      |
| K3s                          | Kubernetes | :white_check_mark: | :x:                | 1.34.6      |
| K3s                          | Kubernetes | :white_check_mark: | :x:                | 1.33.10     |
| Palette Optimized RKE2       | Kubernetes | :white_check_mark: | :white_check_mark: | 1.35.3      |
| Palette Optimized RKE2       | Kubernetes | :white_check_mark: | :white_check_mark: | 1.34.6      |
| Palette Optimized RKE2       | Kubernetes | :white_check_mark: | :white_check_mark: | 1.33.10     |
| Traefik                      | Add-on     | :white_check_mark: | :x:                | 39.0.8      |

#### Pack Notes

<!-- https://spectrocloud.atlassian.net/browse/PAC-3705 -->
<!-- prettier-ignore-start -->

- The debug logs for the <VersionedLink text="Local Path Provisioner" url="/integrations/packs/?pack=csi-local-path-provisioner" /> pack version 0.32 were disabled.

- The following community packs have been released:

  - <VersionedLink text="Crossplane" url="/integrations/packs/?pack=crossplane" /> version 2.2.1
  - <VersionedLink text="Fluentbit" url="/integrations/packs/?pack=fluentbit" /> version 5.0.3
  - <VersionedLink text="ECK Operator" url="/integrations/packs/?pack=elastic-operator" /> version 3.3.2
  - <VersionedLink text="ECK Stack" url="/integrations/packs/?pack=elastic-stack" /> version 0.18.2

<!-- prettier-ignore-end -->

## May 3, 2026 - Release 4.9.5 {#release-notes-4-9-5}

The following component updates are applicable to this release:

- [May 8, 2026 - Component Updates](#component-updates-2026-19) <!-- omit in toc -->
- [May 15, 2026 - Component Updates](#component-updates-2026-20) <!-- omit in toc -->
- [May 22, 2026 - Component Updates](#component-updates-2026-21) <!-- omit in toc -->
- [June 5, 2026 - Component Updates](#component-updates-2026-23) <!-- omit in toc -->
- [June 12, 2026 - Component Updates](#component-updates-2026-24) <!-- omit in toc -->
- [June 19, 2026 - Component Updates](#component-updates-2026-25) <!-- omit in toc -->
- [July 3, 2026 - Component Updates](#component-updates-2026-27) <!-- omit in toc -->
- [July 10, 2026 - Component Updates](#component-updates-2026-28) <!-- omit in toc -->
- [July 17, 2026 - Component Updates](#component-updates-2026-29) <!-- omit in toc -->
- [July 24, 2026 - Component Updates](#component-updates-2026-30) <!-- omit in toc -->

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

  :::info

  Deploying add-on cluster profiles on **Generic** imported clusters requires Palette **4.9.41** or later. Refer to
  [Imported Clusters](../clusters/imported-clusters/imported-clusters.md#import-modes).

  :::

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
- Support for Ubuntu 20.04 in Edge workflows has been deprecated. We recommend using either Ubuntu 22.04 (when requiring
  FIPS 140-3 certification) or Ubuntu 24.04 (when FIPS 140-3 compliance is sufficient). Ubuntu 24.04 FIPS certification
  is still in progress at the vendor-level and cannot be relied upon to meet auditory compliance until certification is
  reached.”

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

<!-- https://spectrocloud.atlassian.net/browse/PE-8375 -->

- kube-vip is now automatically disabled if the virtual IP (VIP) address assigned to the cluster during cluster creation
  is the same as the Edge host's IP address (for example, in the case of single-node clusters).

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

The [Palette CLI](../automation/palette-cli/palette-cli.md) version corresponding to the 4.9.5 Palette release is 4.9.2.
Refer to [CLI Tools](/downloads/cli-tools/) for the download URL and checksum.

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
