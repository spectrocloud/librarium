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

## Support Requirements

- **Palette Edge agent 4.10.13** (Stylus) or later on the cluster. When Stylus is pinned to an earlier release, systemd
  extensions are not available on the cluster regardless of the operating system or Kubernetes pack settings, and the
  cluster falls back to the pre-systemd-extensions behavior.
- An operating system with **systemd version 255 or later**. Ubuntu 24 and RHEL 10 are the tested and verified operating
  systems, and any operating system with systemd 255 or later is supported.
- **CanvOS 4.10.3** or later to build provider images that opt in or out of the extensions path.
- Palette can deliver all supported Kubernetes variants through systemd extensions.

Unified Kernel Image (UKI) deployments and two-node clusters do not support systemd extensions. Refer to
[Unified Kernel Image (UKI) Considerations](#unified-kernel-image-uki-considerations) and
[Two-Node Cluster Considerations](#two-node-cluster-considerations) for the behavior on those hosts.

## New Clusters

When you provision a new appliance mode Edge cluster on an operating system with systemd 255 or later, set
`system.uri: NA` in the BYOOS pack. Palette does not need a provider image to deliver Kubernetes and Palette Agent
binaries when systemd extensions are available.

## Upgrade an Existing Cluster

The first upgrade after adopting CanvOS 4.10.3 requires a provider image that ships the aligned Palette Agent version.
Subsequent Kubernetes upgrades run without a provider image.

1. Build a provider image with a supported CanvOS release. Set `system.uri: <provider-image>` in the BYOOS pack for the
   upgrade. This upgrade replaces the `kairos-agent` on the system with the aligned Palette Agent version. Refer to
   [Support Requirements](#support-requirements) for the minimum CanvOS release.
2. For subsequent Kubernetes upgrades, if you intend to use systemd extensions, set `system.uri: NA` in the BYOOS pack
   and update the Kubernetes pack in the cluster profile to the target version. Palette delivers the new Kubernetes
   binaries through systemd extensions and does not require a provider image. A provider image can still be supplied if
   you intend to perform operating system or Kubernetes upgrades, which follow the current behavior.
3. If the Palette Edge agent remains pinned to an earlier release, systemd extensions are not available on this cluster.
   Build provider images from a supported CanvOS release and use one for every upgrade.

## Upgrade Operating System Packages

Operating system package upgrades require a provider image built from a supported CanvOS release. Reference the image
through `system.uri` in the BYOOS pack, and refer to [Support Requirements](#support-requirements) for the minimum
version.

## Unified Kernel Image (UKI) Considerations

Edge hosts that use [Unified Kernel Images](../../../trusted-boot/trusted-boot.md) do not support systemd extensions.
These hosts continue to receive Kubernetes and Palette Agent binaries embedded in the provider image, which you build
from a supported CanvOS release for every upgrade. Sign the provider image with the same keys that you used to sign the
installer. A mismatch causes the host to reject the image at boot.

## Two-Node Cluster Considerations

Two-node clusters do not support systemd extensions. These clusters continue to receive Kubernetes and Palette Agent
binaries embedded in the provider image, which you build from a supported CanvOS release for every upgrade.
