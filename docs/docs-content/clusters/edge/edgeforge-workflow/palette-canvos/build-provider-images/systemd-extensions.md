---
sidebar_label: "Deliver Binaries via systemd Extensions"
title: "Deliver Kubernetes and Agent Binaries via systemd Extensions"
description:
  "Learn how Edge clusters in appliance mode deliver Kubernetes and Palette Agent binaries at runtime using systemd
  extensions."
icon: ""
hide_table_of_contents: false
sidebar_position: 5
tags: ["edge"]
---

:::preview

:::

Starting with **CanvOS 4.10**, Edge clusters in appliance mode can use
[systemd extensions](https://kairos.io/docs/advanced/sys-extensions) to deliver Kubernetes and Palette Agent binaries at
runtime instead of embedding them in the provider image. This reduces provider image size and lets a single provider
image serve multiple Kubernetes versions on the same host. This capability applies to appliance mode Edge clusters in
both connected and airgapped environments.

## How systemd Extensions Work

With systemd extensions, the provider image no longer carries the Kubernetes and Palette Agent binaries. Palette
packages each component as a system-extension image, a `.sysext.raw` file, and the Palette Edge agent (Stylus) applies
it to the host at runtime.

When the host boots, Stylus resolves the extensions that match the Kubernetes distribution and version in your cluster
profile, pulls each extension, verifies its signature, and stages it under `/var/lib/extensions`. The `systemd-sysext`
service then overlays the extensions onto the read-only `/usr` and `/opt` directories, so the Kubernetes and Palette
Agent binaries become available on the host without modifying the base operating system.

Because the binaries are delivered as overlays instead of being embedded in the provider image, a single minimal
provider image can serve multiple Kubernetes versions. To change the Kubernetes version, you update the Kubernetes pack
in the cluster profile, and Stylus applies the matching extension during the upgrade.

![Diagram showing Stylus resolving, pulling, and overlaying systemd extensions onto an Edge host's read-only /usr and /opt at runtime, so one minimal provider image serves multiple Kubernetes versions.](/systemd-extensions_architecture.webp)

## Support Requirements

- **Palette Edge agent 4.10.13** (Stylus) or later on the cluster. When Stylus is pinned to an earlier release, systemd
  extensions are not available on the cluster regardless of the operating system or Kubernetes pack settings, and the
  cluster falls back to the pre-systemd-extensions behavior.
- An operating system with **systemd version 255 or later**. Ubuntu 24 and RHEL 10 are the tested and verified operating
  systems, and any operating system with systemd 255 or later is supported.
- **CanvOS 4.10.3** or later to build provider images. Set `BUNDLE_K8S_AND_AGENT_PROVIDER=false` when you build provider
  images for clusters that use systemd extensions. Refer to [Build Provider Images](#build-provider-images).
- Palette delivers all supported Kubernetes distributions through systemd extensions. In airgapped environments, RKE2 is
  supported starting with Palette 4.10.a. Earlier releases do not support systemd-extension delivery for RKE2 in
  airgapped environments.

Unified Kernel Image (UKI) deployments and two-node clusters do not support systemd extensions. Refer to
[Unified Kernel Image (UKI) Considerations](#unified-kernel-image-uki-considerations) and
[Two-Node Cluster Considerations](#two-node-cluster-considerations) for the behavior on those hosts.

## Build Provider Images

The CanvOS `BUNDLE_K8S_AND_AGENT_PROVIDER` argument controls whether a provider image includes the Kubernetes and
Palette Agent binaries.

| Value            | Provider Image Contents                                                                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `true` (default) | The provider image includes the Kubernetes and Palette Agent binaries.                                                                                                                                                                         |
| `false`          | On an operating system with systemd 255 or later, the provider image does not include the Kubernetes and Palette Agent binaries, and Palette delivers them through systemd extensions. On an earlier systemd version, the image includes them. |

To build a provider image for a cluster that uses systemd extensions, add the following line to the `.arg` file. Refer
to [Edge Artifact Build Configurations](../arg.md) for the other build arguments.

```shell
BUNDLE_K8S_AND_AGENT_PROVIDER=false
```

The argument applies only to provider images and does not affect the installer ISO.

:::warning

A cluster that uses systemd extensions cannot switch to a provider image that includes the Kubernetes and Palette Agent
binaries. Build every provider image for the cluster with `BUNDLE_K8S_AND_AGENT_PROVIDER=false`.

:::

## New Clusters

When you provision a new appliance mode Edge cluster on an operating system with systemd 255 or later, set
`system.uri: NA` in the BYOOS pack. Palette does not need a provider image to deliver Kubernetes and Palette Agent
binaries when systemd extensions are available.

## Move an Existing Cluster to systemd Extensions

Complete the following steps in order. On PXK-E and Canonical clusters, move your containerd settings to drop-in files
before you change the Kubernetes pack version. RKE2 and K3s clusters skip the steps marked for PXK-E and Canonical.
Refer to [Container Runtime Configuration](#container-runtime-configuration) for details.

1. Build a provider image with a supported CanvOS release, keeping `BUNDLE_K8S_AND_AGENT_PROVIDER=true`, the default.
   Set `system.uri: <provider-image>` in the BYOOS pack. This first upgrade replaces the `kairos-agent` on the system
   with the aligned Palette Agent version. The cluster moves to systemd extensions in step 6. Refer to
   [Support Requirements](#support-requirements) for the minimum CanvOS release.

2. (PXK-E and Canonical) Record the current containerd configuration and the systemd drop-ins on the host.

   ```shell
   sudo cat /etc/containerd/config.toml
   sudo ls -l /etc/containerd/conf.d/
   sudo ls -l /etc/containerd/certs.d/
   sudo ls -l /etc/systemd/system/containerd.service.d/
   sudo ls -l /etc/systemd/system/kubelet.service.d/
   ```

3. (PXK-E and Canonical) Identify every setting that differs from the Palette default configuration, including
   `registry.config_path` and every runtime handler.

4. (PXK-E and Canonical) Move each of those settings into a drop-in file under `/etc/containerd/conf.d/`. Do not copy
   the whole `config.toml` file.

5. (PXK-E and Canonical) In the cluster profile, stop writing `/etc/containerd/config.toml`. You can keep the existing
   stage and change only the path and the content.

6. Set `system.uri: NA` in the BYOOS pack, then update the Kubernetes pack in the cluster profile to the target version.
   Palette delivers the new Kubernetes binaries through systemd extensions, and each node repaves and reboots.

7. (PXK-E and Canonical) After the upgrade, confirm that your containerd settings still apply.

If the Palette Edge agent remains pinned to an earlier release, systemd extensions are not available on the cluster.
Build provider images from a supported CanvOS release and use one for every upgrade.

## Upgrade a Cluster That Uses systemd Extensions

Each of the following changes repaves and reboots every node in the cluster.

### Upgrade Kubernetes

1. Set `system.uri: NA` in the BYOOS pack.

2. Update the Kubernetes pack in the cluster profile to the target version.

3. Apply the profile change to the cluster.

Palette delivers the new Kubernetes binaries through systemd extensions.

### Patch the Operating System

1. Build a new provider image with `BUNDLE_K8S_AND_AGENT_PROVIDER=false`. Refer to
   [Build Provider Images](#build-provider-images).

2. Set `system.uri` in the BYOOS pack to the new provider image.

3. Apply the profile change to the cluster.

### Patch the Operating System and Upgrade Kubernetes

1. Set `system.uri` in the BYOOS pack to the new provider image.

2. In the same cluster profile revision, update the Kubernetes pack to the target version.

3. Apply the profile change to the cluster.

Both changes apply with one repave and one reboot of each node.

:::warning

Make both changes in the same cluster profile revision. Two separate revisions cause two repaves and two reboots of each
node.

:::

## Container Runtime Configuration

This section applies to PXK-E and Canonical clusters, with or without systemd extensions. RKE2 and K3s manage containerd
themselves and write their own containerd configuration under `/var/lib/rancher/`, so RKE2 and K3s clusters need no
changes.

Do not write a complete `/etc/containerd/config.toml` file from the cluster profile. A complete file replaces the
containerd configuration that Palette ships, including settings such as the containerd root directory and the `runc`
binary path, and can break when the shipped configuration changes. On PXK-E clusters that use systemd extensions, the
containerd configuration that Palette ships moves to `/usr/lib/containerd/config.toml`, and containerd does not read
`/etc/containerd/config.toml` at all, so a complete file there has no effect.

Put your custom settings in their own drop-in files under `/etc/containerd/conf.d/` instead. containerd reads this
directory with and without systemd extensions, so a drop-in file works both before and after you move a cluster to
systemd extensions, and it persists through Kubernetes pack updates.

Follow these rules for each drop-in file:

- Use `version = 2` and the `io.containerd.grpc.v1.cri` plugin key, the same as the main configuration file. Drop-in
  files that use configuration version 3 or 4 are not compatible with the version 2 main file.
- If the cluster uses image mirrors or a private registry, set `config_path = "/etc/containerd/certs.d"` in the
  `[plugins."io.containerd.grpc.v1.cri".registry]` table. The containerd configuration that Palette ships reads
  `/etc/containerd/conf.d/` but not `/etc/containerd/certs.d/`. Without this setting, the mirror rules in
  `/etc/containerd/certs.d/` stop applying.

The following example adds a drop-in file through a stage in the Kubernetes layer of the cluster profile.

```yaml
stages:
  initramfs:
    - name: "Manage containerd config"
      files:
        - path: /etc/containerd/conf.d/registry-mirror.toml
          permissions: 0644
          owner: 0
          group: 0
          content: |-
            version = 2
            [plugins."io.containerd.grpc.v1.cri".registry]
              config_path = "/etc/containerd/certs.d"
```

Move the following settings to a drop-in file if your cluster uses them.

| Setting                                                                                                                                                                                                                   | Result If the Setting Stays in `/etc/containerd/config.toml` |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Image mirror rules in `/etc/containerd/certs.d/`, as described in [Disable Webhook to Customize Image Pull Behavior](../../../site-deployment/deploy-custom-registries/webhook-disable.md#redirect-image-pull)            | Image pulls stop using the mirrors.                          |
| The `device_ownership_from_security_context` setting from the [Migrate VMware VMs to KubeVirt](../../../../../vm-management/vmo-pack/create-manage-vm/advanced-topics/migrate-vm-kubevirt.md#prerequisites) prerequisites | The setting stops applying.                                  |
| Runtime handlers, such as the NVIDIA container runtime for GPU workloads                                                                                                                                                  | The runtime handler is not available to workloads.           |

## Unified Kernel Image (UKI) Considerations

Edge hosts that use [Unified Kernel Images](../../../trusted-boot/trusted-boot.md) do not support systemd extensions.
These hosts continue to receive Kubernetes and Palette Agent binaries embedded in the provider image, which you build
from a supported CanvOS release for every upgrade. Sign the provider image with the same keys that you used to sign the
installer. A mismatch causes the host to reject the image at boot.

## Two-Node Cluster Considerations

Two-node clusters do not support systemd extensions. These clusters continue to receive Kubernetes and Palette Agent
binaries embedded in the provider image, which you build from a supported CanvOS release for every upgrade.
