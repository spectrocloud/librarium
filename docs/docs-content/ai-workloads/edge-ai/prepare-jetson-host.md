---
sidebar_label: "Prepare the Jetson Host"
title: "Prepare the Jetson Host"
description:
  "Install the software prerequisites and prepare an NVIDIA Jetson device so it can register with Palette in agent mode."
hide_table_of_contents: false
sidebar_position: 20
tags: ["ai workloads", "edge", "nvidia", "jetson", "agent mode", "host preparation"]
---

This page describes how to prepare an NVIDIA Jetson device so it can register with Palette as an Edge host in
[agent mode](../../deployment-modes/agent-mode/agent-mode.md).

## Prerequisites

- An NVIDIA Jetson device that meets the [Jetson Requirements](./jetson-requirements.md). This guide is validated on the
  NVIDIA Jetson AGX Thor Developer Kit.

- Console access to the device, such as a monitor and keyboard. You use the console to complete the operating system
  setup, and to reconnect if a network change drops your SSH session.

- A USB drive for the JetPack installer image.

## Prepare the Host

The NVIDIA Jetson AGX Thor Developer Kit runs [NVIDIA JetPack](https://developer.nvidia.com/embedded/jetpack), which
provides a Jetson Linux (L4T) operating system built on Ubuntu. The FIPS-compliant version of agent mode is available
only for Red Hat Enterprise Linux and Rocky Linux 8. On a JetPack (Ubuntu) host, use the non-FIPS agent.

1. Install JetPack by following the
   [NVIDIA Jetson AGX Thor Developer Kit Quick Start Guide](https://docs.nvidia.com/jetson/agx-thor-devkit/user-guide/latest/quick_start.html).
   Download the installer image from the JetPack page, write it to a USB drive, and then select **Install on NVMe** to
   install the operating system on the NVMe SSD.

2. Complete the operating system setup. During setup, the installer prompts you to enable
   [Ubuntu Pro](https://ubuntu.com/pro). Palette does not require Ubuntu Pro. On a Jetson device, only the `esm-infra`
   and `esm-apps` services apply. Do not enable the FIPS kernel, FIPS updates, or the real-time kernel, because those
   services try to replace the Jetson Linux (L4T) kernel.

3. Install the following packages, which the Palette agent requires. This list matches the prerequisites in
   [Install Agent on a Host](../../deployment-modes/agent-mode/install-agent-host.md#prerequisites).

   - [bash](https://www.gnu.org/software/bash/), configured as the default shell
   - [jq](https://jqlang.github.io/jq/download/)
   - [Zstandard](https://facebook.github.io/zstd/)
   - [rsync](https://github.com/RsyncProject/rsync)
   - [systemd](https://systemd.io/), with `systemd-timesyncd`, `systemd-resolved`, and `systemd-networkd`
   - [conntrack](https://conntrack-tools.netfilter.org/downloads.html)
   - [iptables](https://linux.die.net/man/8/iptables)
   - [rsyslog](https://github.com/rsyslog/rsyslog)

   Because JetPack is Ubuntu-based, you can install the packages with `apt`.

   ```shell
   sudo apt-get update && \
   sudo apt-get install --yes --no-install-recommends \
     bash \
     jq \
     zstd \
     rsync \
     systemd-timesyncd \
     conntrack \
     iptables \
     rsyslog
   ```

4. Enable the required systemd services.

   ```shell
   sudo systemctl enable --now systemd-timesyncd
   sudo systemctl enable --now systemd-resolved
   sudo systemctl enable --now rsyslog
   ```

   JetPack already runs `systemd-networkd`, so you do not need to enable it. Configure `systemd-networkd` only if you
   set up an overlay network, as described in the next step.

5. If you plan to use overlay networks, or you want Palette to manage DNS or static IP addresses, configure
   `systemd-resolved` and `systemd-networkd`. Refer to
   [Configure networkd to Prepare Host for Overlay Network](../../deployment-modes/agent-mode/overlay-preparation.md).

   :::warning

   On a Jetson device, NetworkManager manages the network interface by default. If you move the interface that your SSH
   session uses to `systemd-networkd`, the connection can drop. Before you make the change on a remote device, confirm
   that you have console access, or configure `systemd-networkd` with your network settings first. If your SSH session
   stops responding, press **ENTER**, type `~.` to close it, and then reconnect from the console.

   :::

6. Create a
   [Palette registration token](../../clusters/edge/site-deployment/site-installation/create-registration-token.md) and
   keep it available for the registration step.

## Validate

Confirm the operating system versions on the device. The value that the device reports at first boot, such as
`38.0.0-gcid-...`, is the Unified Extensible Firmware Interface (UEFI) firmware version, not the operating system
version.

1. Check the authoritative Jetson Linux (L4T) release.

   ```shell
   cat /etc/nv_tegra_release
   ```

2. Check the Ubuntu base version.

   ```shell
   lsb_release --all
   ```

3. If you installed the JetPack SDK meta-package, check the JetPack version.

   ```shell
   apt-cache show nvidia-jetpack
   ```

   On the base operating system, the package is not installed. Compare the L4T release with the
   [validated versions](./jetson-requirements.md#host-operating-system), or look up the matching JetPack version in the
   [JetPack Archive](https://developer.nvidia.com/embedded/jetpack-archive).

<!-- Validation notes (DOC-3089), Jetson AGX Thor, 2026-09-14 and 2026-09-18.
Ubuntu Pro (`pro status --all`, kernel 6.8.12-1021-tegra): esm-infra and esm-apps enabled; livepatch and fips report n/a; fips-updates and realtime-kernel report "disabled (entitled)" and must not be enabled because they would try to swap the L4T kernel. Validated with the free personal Pro tier; an org token has the same service availability.
Versions: /etc/nv_tegra_release = R39 REVISION 2.1 (L4T r39.2.1); lsb_release = Ubuntu 24.04 LTS (noble). The nvidia-jetpack meta-package is not installed on the base image, so /etc/nv_tegra_release is the authoritative check. JetPack 7.2.1 corresponds to L4T r39.2.1 per NVIDIA's mapping.
Packages: all install on JetPack (Ubuntu ARM64). bash, jq, zstd, rsync, iptables, and rsyslog were already current; conntrack installed new; the systemd stack upgraded. pam-auth-update prints cosmetic, non-fatal Perl "uninitialized value" warnings during libpam-systemd setup.
Networking: systemd-networkd is already active on JetPack, but every interface is unmanaged; NetworkManager owns the NIC. A bare `systemctl enable --now systemd-networkd` does not drop SSH. The drop happens only when networkd is configured to manage the interface the SSH session uses. -->

## Next Steps

The device is now ready to register with Palette and run an AI model. Continue to the Day 1 registration guide to
register the device and serve a model.

<!-- TODO(DOC-3090): link ./register-jetson-host.md here once the Day 1 page is merged. -->
