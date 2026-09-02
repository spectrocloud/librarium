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

## September 6, 2026 - Release 4.10.0 {#release-notes-4.10.0}

### Security Notices

- Review the [Security Bulletins](../security-bulletins/reports/reports.mdx) page for the latest security advisories.

### Palette Enterprise {#palette-enterprise-4.10.0}

#### Breaking Changes {#breaking-changes-4.10.0}

<!-- https://spectrocloud.atlassian.net/browse/PEM-11143 -->

- Palette now validates user-supplied cluster profile and app profile versions against the
  [Semantic Versioning](https://semver.org) specification when a profile is created or updated through the Palette UI,
  API, Terraform provider, or Crossplane provider. Values such as `1.2.3` and `1.2.3-rc.1` are accepted; values such as
  `2.2.2.develop` or `V0.0.1` that earlier releases accepted are now rejected whenever a version is set (on create, on
  clone, when creating a new profile version, or when changing the version of an existing profile). Existing profiles
  carrying a malformed version continue to function, and no pre-upgrade or post-upgrade action is required. If you
  update a profile's version to a valid value, later attempts to set a malformed value on that profile fail, including
  reverting to the original value. These new requirements do not apply to external registry and chart tags, including
  Zarf UDS tags. For the accepted format, refer to
  [Version a Cluster Profile](../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md) and
  [Version an App Profile](../profiles/app-profiles/modify-app-profiles/version-app-profile.md).

<!-- https://spectrocloud.atlassian.net/browse/PEM-11430 -->

- The OCI Helm registry validation endpoint now returns an error code that reflects the actual failure. Previously, any
  validation failure (including request timeouts, DNS failures, and TLS errors) returned `InvalidRegistryCredentials`.
  Timeout and cancellation failures now return a timeout error, connectivity failures return an unreachable error, and
  `InvalidRegistryCredentials` is reserved for authentication failures. Existing registries and credentials are
  unaffected, and no pre-upgrade or post-upgrade action is required. If you have automation that treats
  `InvalidRegistryCredentials` as the catch-all validation failure, narrow it to authentication failures and handle
  timeout and connectivity errors with a retry instead. Refer to
  [Registries](../registries-and-packs/registries/registries.md) for more information.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11127 -->

- Palette removes the deprecated `GET /v1/projects` endpoint. Use `POST /v1/dashboard/projects` instead, which supports
  the filtering and sorting that the removed endpoint lacked. Update any automation, script, or integration that calls
  `GET /v1/projects` before you upgrade, because those calls fail after the upgrade.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11633 -->

- Creating or updating a registry now requires a non-empty `metadata.name`. Palette validates the field at the API layer
  and rejects a missing or empty name with an HTTP 400 response that identifies `metadata.name`. Earlier releases
  performed no field-level check, so you could create a registry with an empty name, and only the uniqueness constraint
  on the tenant and name pair rejected it later, which surfaced as a misleading duplicate-name error. The validation
  applies to pack, Helm, basic OCI, and ECR OCI registries. Existing registries are unaffected, and no pre-upgrade or
  post-upgrade action is required. Update any automation or Terraform configuration that templates a registry payload
  and might pass an unset name. Refer to [Registries](../registries-and-packs/registries/registries.md) for more
  information.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11534 -->

- Updating an OCI registry that uses the Helm or Zarf provider no longer accepts a change to the synchronization
  setting. Palette treats synchronization as a create-only setting for these registries, and the Palette UI does not
  offer the toggle after creation. The update API accepted the change and returned success without applying it. The API
  now rejects the request with an HTTP 400 response and the message
  `Registry synchronization setting cannot be changed after the registry is created`. This applies to both basic and ECR
  OCI registries. If you manage registries with the Terraform provider, remove any change to `is_synchronization` on an
  existing `spectrocloud_registry_oci` resource. Such a change previously produced persistent `terraform plan` drift,
  because each apply reported success without taking effect. Refer to
  [Registries](../registries-and-packs/registries/registries.md) for more information.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11675 -->

- The Edge host search API, `POST /v1/dashboard/edgehosts/search`, now has its own sort field contract. The accepted
  sort fields are `name`, `state`, `healthState`, `creationTimestamp`, and `lastModifiedTimestamp`. Palette removes the
  `environment`, `clusterName`, and `clusterState` fields, which do not apply to Edge hosts. A request that sorts on one
  of the removed fields now returns an HTTP 422 response instead of an HTTP 500 response. Sorting on `healthState` was
  advertised in earlier releases but did not return results, and now works. Remove the unsupported fields from any
  automation or integration that sorts Edge host search results.

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PCP-7210 -->

- Apache CloudStack support is now generally available. Palette removes the **ApacheCloudStack** feature flag and
  enables Apache CloudStack for all tenants. You can deploy and manage Kubernetes clusters in your Apache CloudStack
  environment through a Private Cloud Gateway (PCG). Refer to
  [Apache CloudStack](../clusters/data-center/cloudstack/cloudstack.md) for more information.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6899 -->

- Canonical Kubernetes (CK8s) clusters on MAAS now support SSH key management. You can configure **SSH Keys** on the
  cluster's cloud configuration during cluster creation and on Day-2 through the Palette UI, API, Terraform provider,
  and Crossplane provider, on both Palette and Palette VerteX. Palette injects the keys into the `spectro` user's
  `~/.ssh/authorized_keys` on every control plane and worker node, and preserves any users that MAAS or the machine
  image already configured. Changing the keys on a deployed CK8s cluster repaves the cluster nodes. Refer to
  [SSH Keys on MAAS Cluster Nodes](../clusters/data-center/maas/architecture.md#ssh-keys-on-maas-cluster-nodes) for more
  information.

<!-- https://spectrocloud.atlassian.net/browse/PCP-7083 -->

- Canonical Kubernetes (CK8s) clusters on MAAS now support Network Time Protocol (NTP) server configuration. You can
  configure **NTP Servers** on the cluster's cloud configuration during cluster creation and on Day-2 through the
  Palette UI, API, Terraform provider, and Crossplane provider, on both Palette and Palette VerteX. The servers you
  specify replace the NTP configuration that MAAS provides to each control plane and worker node. Changing the servers
  on a deployed CK8s cluster repaves the cluster nodes. Refer to
  [NTP Servers on MAAS Cluster Nodes](../clusters/data-center/maas/architecture.md#ntp-servers-on-maas-cluster-nodes)
  for more information.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6414 -->
<!-- https://spectrocloud.atlassian.net/browse/PCP-7118 -->

- Palette now supports the option to skip worker node upgrades on
  [Azure IaaS](../clusters/public-cloud/azure/create-azure-cluster.md),
  [GCP IaaS](../clusters/public-cloud/gcp/create-gcp-iaas-cluster.md), and
  [Apache CloudStack](../clusters/data-center/cloudstack/create-manage-cloudstack-clusters.md) clusters. For example, if
  you have worker pools running critical databases or real-time processing services, you can enable this option to
  maintain service continuity during control plane upgrades, then schedule
  [worker node updates](../clusters/cluster-management/cluster-updates.md#trigger-worker-node-upgrade) during planned
  maintenance windows.

  The version difference between the control plane and worker nodes must not exceed the
  [N-3 minor version skew supported by Kubernetes](https://kubernetes.io/releases/version-skew-policy/). Palette
  enforces this during cluster profile updates and blocks you from updating if you attempt to exceed the N-3 threshold.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PEM-11115 -->
<!-- https://spectrocloud.atlassian.net/browse/PEM-11712 -->

- The **Host LXD-based control planes** and **Use LXD VMs** toggles in cluster and node configuration now display a
  tooltip clarifying that LXD-based VMs on MAAS are supported only with Palette eXtended Kubernetes clusters. Enabling
  LXD with other Kubernetes distributions results in deployment failures.

<!-- https://spectrocloud.atlassian.net/browse/PEM-7720 -->
<!-- https://spectrocloud.atlassian.net/browse/PEM-11711 -->

- Headlamp, the modern replacement for the deprecated Kubernetes Dashboard, is now available on imported clusters as
  well as Palette-managed clusters.

<!-- https://spectrocloud.atlassian.net/browse/PCP-6720 -->

- The cert-manager chart deployed with the Palette management plane has been upgraded from version 1.14 to version
  1.20.2.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PEM-11657 -->

- Fixed an issue where using the Palette UI to open and save a
  [cluster profile](../profiles/cluster-profiles/cluster-profiles.md) created with the API or Terraform could reorder
  its packs, surfacing as unexpected `terraform plan` drift for profiles managed as code.

<!-- https://spectrocloud.atlassian.net/browse/PCP-7288 -->

- Fixed an issue that caused the `import-presetup-logs` ConfigMap to grow without limit each time the setup job for
  [importing a cluster](../clusters/imported-clusters/cluster-import.md) ran. The ConfigMap eventually exceeded the
  maximum request size, causing `request is too large` errors and leaving the management plane API server unresponsive.

<!-- https://spectrocloud.atlassian.net/browse/PCP-7388 -->
<!-- https://spectrocloud.atlassian.net/browse/PCP-7404 -->

- Fixed an issue that caused the `palette-webhook` deployment to stall with a pod stuck in `Pending` and the deployment
  reporting `ProgressDeadlineExceeded` on [Amazon EKS clusters](../clusters/public-cloud/aws/eks.md) with three or fewer
  nodes. The stall occurred both when a Palette agent upgrade updated the webhook and after a cluster pivot.

<!-- https://spectrocloud.atlassian.net/browse/PCP-7405 -->

- Fixed an issue that caused the CoreDNS deployment in the `kube-system` namespace to be replaced with a virtual cluster
  CoreDNS configuration on [MAAS clusters](../clusters/data-center/maas/maas.md) that host virtual clusters. Cluster DNS
  resolution failed and the cluster reported an unknown status in Palette.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11049 -->

- Fixed an issue that prevented the Palette UI from updating when all tags were removed from a
  [cluster profile](../profiles/cluster-profiles/cluster-profiles.md). The removed tags continued to display until the
  browser was refreshed.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11520 -->

- Fixed an issue that caused intermittent `504 Gateway Timeout` responses when attaching
  [cluster profiles](../profiles/cluster-profiles/cluster-profiles.md) to a cluster through the
  `PUT /v1/spectroclusters/{uid}/profiles` API while that cluster was actively reporting its status. Attaching several
  profiles to the same cluster in quick succession was the most common trigger.

<!-- https://spectrocloud.atlassian.net/browse/PCP-4655 -->

- Fixed an issue that caused multi-line error messages to appear truncated in a cluster's **Events** tab. Only the first
  line of the message was recorded, so an event displayed `"Reconciler error" err=<` while the description of the
  failure that followed it, such as `NoCredentialProviders: no valid providers in chain`, was dropped. The complete
  message is now recorded as a single event. Only error-level events were affected.

<!-- https://spectrocloud.atlassian.net/browse/PCP-7401 -->

- Fixed an issue that caused changing a cluster-level tag on a healthy
  [Amazon EKS cluster](../clusters/public-cloud/aws/eks.md) to emit a misleading `ClusterUpgradeTriggered` event and
  replace every node in the cluster's worker node pools. Pipelines that update tag values on each run, such as
  compliance tagging, could therefore repave nodes repeatedly on a cluster that was never upgraded. Changing tags
  directly on a worker node pool still replaces that pool's nodes.

#### Deprecations and Removals

### Edge

:::info

The [CanvOS](https://github.com/spectrocloud/CanvOS) version corresponding to the 4.10.0 Palette release is 4.10.3.

:::

#### Breaking Changes {#edge-breaking-changes-4.10.0}

<!-- https://spectrocloud.atlassian.net/browse/PE-8314 -->
<!-- https://spectrocloud.atlassian.net/browse/PE-8648 -->

- Upgrading an existing connected Edge cluster on an operating system with systemd version 255 or later requires a
  provider image built with **CanvOS 4.10.x** that sets `BUNDLE_K8S_AND_AGENT_PROVIDER` to `true`. Reference the image
  through `system.uri` in the BYOOS pack for the first upgrade after you adopt **CanvOS 4.10.x**. This upgrade aligns
  the Palette Edge node agent on the host with the Palette release. Subsequent Kubernetes upgrades do not need a
  provider image, so set `system.uri: NA` in the BYOOS pack. For Unified Kernel Image (UKI) deployments, sign the new
  provider image and the systemd extensions with the same keys that you used to sign the installer. Refer to
  [Upgrade an Existing Cluster](../clusters/edge/edgeforge-workflow/palette-canvos/build-provider-images/build-provider-images.md#upgrade-an-existing-cluster)
  for more information.

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PE-8679 -->
<!-- https://spectrocloud.atlassian.net/browse/PE-9264 -->

- Locally managed Edge clusters in an airgapped environment that use Palette eXtended Kubernetes Edge (PXK-E) or
  Canonical Kubernetes now support decoupled control plane and worker node upgrades. Enable the **Skip worker node
  update (Optional)** toggle on a worker pool in Local UI to hold that pool at its current Kubernetes version while the
  control plane advances, up to the Kubernetes N-3 minor version skew. This reduces how many times worker nodes repave
  when crossing several Kubernetes minor versions. Scale-up on a pool with the toggle enabled is rejected, and disabling
  the toggle repaves the pool to the control plane version. Refer to
  [Decoupled Control Plane and Worker Node Upgrades](../clusters/edge/cluster-management/upgrade-behavior.md#decoupled-control-plane-and-worker-node-upgrades)
  for more information.

<!-- https://spectrocloud.atlassian.net/browse/PE-9097 -->
<!-- https://spectrocloud.atlassian.net/browse/PE-9267 -->

- Airgap content bundle uploads to Edge hosts are now chunked, resumable, and parallel by default. The Palette CLI
  splits the bundle into chunks and transfers them over multiple connections, which shortens upload times for large
  bundles on links with a high bandwidth-delay product, and verifies each chunk with SHA-256. An interrupted upload
  resumes from the chunks the Edge host already holds instead of restarting. You can also stream a bundle straight from
  a signed object store URL with the new `--src-url` flag rather than staging a local copy. The earlier single-stream
  upload remains available with `--legacy`, and the CLI falls back to it automatically against Edge hosts that predate
  chunked upload support. Refer to
  [Upload Content Bundle](../clusters/edge/local-ui/cluster-management/upload-content-bundle.md) for more information.

<!-- https://spectrocloud.atlassian.net/browse/PE-8314 -->
<!-- https://spectrocloud.atlassian.net/browse/PE-8648 -->

- Connected Edge clusters can now use systemd extensions to deliver Kubernetes and Palette Agent binaries at runtime,
  instead of embedding those binaries in the provider image. On operating systems running systemd version 255 or later,
  provider images built with CanvOS 4.10.x exclude the binaries by default, and Stylus (Palette Edge node agent) 4.10.x
  delivers them through systemd extensions. Set `system.uri: NA` in the BYOOS pack for standard upgrades. The new
  `BUNDLE_K8S_AND_AGENT_PROVIDER` flag in the CanvOS `.arg` file overrides the default when a specific flow requires the
  binaries embedded. Refer to
  [Deliver Kubernetes and Agent Binaries via systemd Extensions](../clusters/edge/edgeforge-workflow/palette-canvos/build-provider-images/build-provider-images.md#bundle-k8s-and-agent-provider-flag)
  for build and upgrade guidance.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PE-9110 -->
<!-- https://spectrocloud.atlassian.net/browse/PE-9268 -->

- The Custom UI appliance install wizard now renders a specific inline error at any field whose value is invalid.
  Sections that contain an invalid field display an "invalid" badge on the section title, and the step counter reads as
  "X of Y complete."

<!-- https://spectrocloud.atlassian.net/browse/PE-8787 -->
<!-- https://spectrocloud.atlassian.net/browse/PE-9265 -->

- Edge workflows have been updated to Kairos v4.1.2 with `kairos-init` v0.16.x. Day-1 and Day-2 upgrades from earlier
  Kairos builds are supported.

<!-- https://spectrocloud.atlassian.net/browse/PE-8675 -->

- The Palette TUI landing page now signposts initial user setup. When no login user exists on the Edge host, the landing
  page displays the yellow warning **Setup required: press F2 to create login user for ssh and LocalUI**, and the footer
  reads **`<F2> Create login`** instead of **`<F2> Customize`**. Both revert automatically once a login user is created.
  Previously, the landing page did not indicate that a user account was missing, so the F2 shortcut for creating the
  initial login was not discoverable. Refer to
  [Initial Edge Host Configuration with Palette TUI](../clusters/edge/site-deployment/site-installation/initial-setup.md)
  for more information.

#### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PE-8891 -->

- Fixed an issue that prevented digest-pinned application images from being redirected to the
  [local registry](../clusters/edge/site-deployment/deploy-custom-registries/local-registry.md) on airgapped Edge
  clusters. Pods that referenced an image by digest rather than by tag attempted to pull from the upstream registry and
  remained in `ImagePullBackOff`, while the same image referenced by tag deployed successfully.

<!-- https://spectrocloud.atlassian.net/browse/PE-9033 -->

- Fixed an issue that caused packs whose name contains a forward slash, such as Helm OCI packs sourced from a private
  registry, to fail to download on Edge hosts with `failed to rename pack: no such file or directory` errors. The
  affected packs were never cached, and the cluster re-downloaded them every two minutes without reaching a steady
  state.

<!-- https://spectrocloud.atlassian.net/browse/PE-9143 -->

- Fixed an issue that caused NTP servers entered in the
  [Palette TUI](../clusters/edge/site-deployment/site-installation/initial-setup.md) as a comma-separated list without a
  space, such as `10.10.180.0,10.10.180.1`, to generate an invalid time synchronization configuration. Both
  comma-separated and comma-and-space-separated lists are now accepted.

<!-- https://spectrocloud.atlassian.net/browse/PEM-11463 -->

- Fixed an issue that prevented [remote shell](../clusters/edge/cluster-management/remote-shell.md) access to an Edge
  host from being automatically disabled after 24 hours of inactivity. If the service handling remote shell sessions
  restarted unexpectedly, the Edge host remained enabled for remote shell indefinitely, leaving the tunnel and its
  temporary user credentials active.

<!-- https://spectrocloud.atlassian.net/browse/PE-9316 -->
<!-- https://spectrocloud.atlassian.net/browse/PE-9351 -->

- Fixed an issue that prevented the NTP servers configured on an Edge host through the
  [Palette TUI](../clusters/edge/site-deployment/site-installation/initial-setup.md) from being visible in Local UI. The
  Edge host overview page now lists them in an **NTP Servers** field, so an operator working only in Local UI can
  confirm the host's time synchronization settings. These servers remain specific to the host, and cluster-level NTP
  configured in cluster settings continues to override them on every host in the cluster.

### VerteX

#### Features

<!-- https://spectrocloud.atlassian.net/browse/PPD-1597 -->
<!-- https://spectrocloud.atlassian.net/browse/PPD-1615 -->

- FIPS-compiled vCluster is now available, letting strict-FIPS tenants provision virtual clusters using FIPS 140-3
  approved cryptography. The FIPS-compiled pack is automatically selected when deploying virtual clusters on VerteX.

- Includes all Palette features, improvements, breaking changes, and deprecations in this release. Refer to the
  [Palette section](#palette-enterprise-4.10.0) for more details.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PEM-11361 -->
<!-- https://spectrocloud.atlassian.net/browse/PEM-11714 -->

- Palette VerteX now invalidates all active JWTs for a session when a user logs out or changes their password.
  Previously, tokens remained valid after logout and could be reused.

### Virtual Machine Orchestrator (VMO)

#### VMO Pack

##### Bug Fixes

<!-- https://spectrocloud.atlassian.net/browse/PVM-811 -->

- Fixed an issue that caused the CA certificate help text in the **Certificate validation** step of the
  [Create Provider](../vm-management/vm-migration-assistant/create-source-providers.md) wizard to refer to the OpenShift
  API endpoint for every provider type, including VMware vSphere.

<!-- https://spectrocloud.atlassian.net/browse/PVM-1051 -->

- Fixed an issue that caused uploading a [golden image](../vm-management/vm-launchpad/virtual-machines/golden-images.md)
  to fail with a **Certificate Trust Required** prompt that contained no URL, leaving no way to accept the certificate
  and complete the upload. This occurred when the upload was proxied through Palette because the cluster had no direct
  upload URL available. The upload pages now display a notice before an upload begins, and a proxied upload that fails
  states that direct upload access has to be enabled on the VMO pack.

#### PaletteAI VM Launchpad {#paletteai-vm-launchpad-4.10.0}

- [PaletteAI VM Launchpad](../vm-management/vm-launchpad/vm-launchpad.md) version 4.10.0 is now available.

##### Features

<!-- https://spectrocloud.atlassian.net/browse/PVM-1019 -->

- The appliance exposes two forwarding surfaces on a new **Metrics and Logs** page under **Settings** and
  **Configuration**. The **Metrics** section pushes appliance metrics to a Splunk HTTP Event Collector (HEC) endpoint
  through a first-class network gate that stays airgap-safe until you supply a URL and token. The **Logs** section
  records that a central logging system collects the appliance logs. The OpenTelemetry Collector, delivered through the
  Palette VMO pack, ships the log stream to Splunk. Both toggles emit filterable audit events for compliance review.
  Refer to [Metrics and Logs](../vm-management/vm-launchpad/metrics-and-logs.md) for the full configuration reference.

<!-- https://spectrocloud.atlassian.net/browse/PVM-973 -->

- A new
  [Federate an External Identity Provider with Keycloak](../vm-management/vm-launchpad/access-management/oidc-federation.md)
  guide is now available. The guide explains how to federate an external OIDC identity provider, such as Okta, into
  PaletteAI VM Launchpad, and covers the email claim and group membership requirements that a federated account must
  satisfy.

### Automation

:::info

The [Palette CLI](../automation/palette-cli/palette-cli.md) version corresponding to the 4.10.0 Palette release is
4.10.0. Refer to [CLI Tools](/downloads/cli-tools/) for the download URL and checksum.

:::

#### Features

- Terraform version 4.10.0 of the
  [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) is
  now available. For more details, refer to the Terraform provider
  [release page](https://github.com/spectrocloud/terraform-provider-spectrocloud/releases).
- Crossplane version 4.10.0 of the
  [Spectro Cloud Crossplane provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette) is
  now available.

#### Improvements

<!-- https://spectrocloud.atlassian.net/browse/PLT-2117 -->
<!-- https://spectrocloud.atlassian.net/browse/DOC-3117 -->

- Palette CLI is now available for ARM Linux (arm64) and macOS Apple Silicon (arm64).

<!-- https://spectrocloud.atlassian.net/browse/PE-9050 -->
<!-- https://spectrocloud.atlassian.net/browse/PE-9266 -->

- The Palette CLI now confirms content bundle uploads immediately. Previously, after the upload progress bar reached
  100%, the CLI could stay silent for several minutes while the Edge host unpacked the bundle. The CLI now reports
  upload completion as soon as the transfer finishes.

### Docs and Education

<!-- https://spectrocloud.atlassian.net/browse/DOC-3132 -->
<!-- https://spectrocloud.atlassian.net/browse/PE-9317 -->

- Documentation has been added explaining that Local UI, the Palette TUI, and the Palette API all change Edge host
  passwords as root, and that PAM exempts root from password quality checks unless the image sets the `enforce_for_root`
  option. Without it, the check still logs a `BAD PASSWORD` message but returns success, so a password that does not
  meet your policy is accepted. Refer to
  [Change User Password](../clusters/edge/local-ui/host-management/access-console.md#change-user-password) for the ways
  a password can be changed, and
  [Build Edge Artifacts](../clusters/edge/edgeforge-workflow/palette-canvos/palette-canvos.md) for SUSE, Ubuntu, and
  RHEL examples that set the option at image build time.

### Packs

#### Pack Notes

<!-- https://spectrocloud.atlassian.net/browse/PAC-4601 -->

- The `tigera-operator` 3.32.1 pack has been republished as `tigera-operator-3.32.1-rev1` to add the `calico/csi` and
  `calico/node-driver-registrar` images to its image manifest. The Tigera Operator deploys these two images whenever
  `kubeletVolumePluginPath` is set to a value other than `None`, but because they were missing from the manifest they
  were never mirrored into dedicated or airgapped registries, leaving the `csi-node-driver` DaemonSet in
  `ImagePullBackOff`. Calico networking was unaffected, because the Container Storage Interface (CSI) driver is a
  separate optional component.

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
