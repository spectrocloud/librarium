---
sidebar_label: "Prepare the Jetson Host"
title: "Prepare the Jetson Host"
description:
  "Install the software prerequisites and prepare an NVIDIA Jetson device so it can register with Palette in agent mode."
hide_table_of_contents: false
sidebar_position: 20
tags: ["ai workloads", "edge", "nvidia", "jetson", "agent mode", "host preparation"]
---

<!-- SCAFFOLD (DOC-3089 Day 0). Prerequisite steps are drawn from deployment-modes/agent-mode/install-agent-host.md and are verifiable now. Jetson-specific steps are TODO and require validation on the device. The agent install and registration itself is Day 1 (DOC-3090). -->

This page describes how to prepare an NVIDIA Jetson device so it can register with Palette as an Edge host in
[agent mode](../../deployment-modes/agent-mode/agent-mode.md). Complete the
[Jetson Requirements](./jetson-requirements.md) before you begin.

## Prepare the operating system

The Jetson AGX Thor Developer Kit runs [NVIDIA JetPack](https://developer.nvidia.com/embedded/jetpack), which provides a
Jetson Linux (L4T) operating system built on Ubuntu. Install or update JetPack on the device following the
[NVIDIA Jetson AGX Thor Developer Kit Quick Start Guide](https://docs.nvidia.com/jetson/agx-thor-devkit/user-guide/latest/quick_start.html).
For the Thor Developer Kit, this uses an NVIDIA installer image written to a USB drive, from which you select **Install
on NVMe** to install the operating system to the device's NVMe SSD.

During the operating system setup, the installer prompts you to enable [Ubuntu Pro](https://ubuntu.com/pro). Ubuntu Pro
is optional and is not required by Palette or the Palette agent. Enable it only if your organization wants Ubuntu's
Extended Security Maintenance (ESM) or compliance tooling on the host.

On a Jetson, only some Ubuntu Pro services apply. The device runs the NVIDIA Jetson Linux (L4T) kernel rather than a
Canonical-built Ubuntu kernel, so the kernel-level Pro services are not available. The `esm-infra` and `esm-apps`
services attach, while Livepatch and the FIPS kernel report as not applicable. Do not enable the FIPS kernel, FIPS
updates, or the real-time kernel on a Jetson, because those services attempt to replace the L4T kernel.

<!-- Resolved (DOC-3089) 2026-09-18 on the Thor (`pro status --all`, kernel 6.8.12-1021-tegra): esm-infra + esm-apps = enabled; livepatch + fips = n/a; fips-updates + realtime-kernel = "disabled (entitled)" and must not be enabled (they would try to swap the L4T kernel). Validated with the free personal Pro tier; customers attach an org token with the same service availability. -->

After the operating system is installed, confirm the versions on the device. The value the device reports at first boot,
such as `38.0.0-gcid-...`, is the UEFI firmware version, not the operating system version. Use the following commands
instead:

- `cat /etc/nv_tegra_release` reports the authoritative Jetson Linux (L4T) release.
- `lsb_release --all` reports the Ubuntu base version.
- `apt-cache show nvidia-jetpack` reports the JetPack version, but only if you installed the JetPack SDK meta-package.
  On the base operating system, derive the JetPack version from the L4T release.

For the validated versions, refer to [Jetson Requirements](./jetson-requirements.md).

<!-- Resolved (DOC-3089) 2026-09-14/18 on the Thor: /etc/nv_tegra_release = R39 REVISION 2.1 (L4T r39.2.1); lsb_release = Ubuntu 24.04 LTS (noble). The nvidia-jetpack meta-package is NOT installed on the base image, so /etc/nv_tegra_release is the authoritative check; apt-cache show nvidia-jetpack only works after installing the SDK. JetPack 7.2.1 corresponds to L4T r39.2.1 per NVIDIA's mapping. The versions table lives on jetson-requirements.md. -->

## Install software prerequisites

Install the software that the Palette agent requires. The following packages are required on the host.

<!-- Resolved (DOC-3089) 2026-09-18 on the Thor: all packages install on JetPack (Ubuntu ARM64). bash/jq/zstd/rsync/iptables/rsyslog were already the newest version; conntrack installed new; the systemd stack upgraded. During libpam-systemd setup, pam-auth-update prints cosmetic Perl "uninitialized value" warnings that are non-fatal. -->

- [bash](https://www.gnu.org/software/bash/), configured as the default shell
- [jq](https://jqlang.github.io/jq/download/)
- [Zstandard](https://facebook.github.io/zstd/)
- [rsync](https://github.com/RsyncProject/rsync)
- [systemd](https://systemd.io/), with `systemd-timesyncd`, `systemd-resolved`, and `systemd-networkd`
- [conntrack](https://conntrack-tools.netfilter.org/downloads.html)
- [iptables](https://linux.die.net/man/8/iptables)
- [rsyslog](https://github.com/rsyslog/rsyslog)

Because JetPack is Ubuntu-based, you can install the dependencies with `apt`.

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

Enable the required systemd services.

```shell
sudo systemctl enable --now systemd-timesyncd
sudo systemctl enable --now systemd-resolved
sudo systemctl enable --now rsyslog
```

On JetPack, `systemd-networkd` is already active, so you do not enable it here. NetworkManager manages the device
network interface, and `systemd-networkd` runs alongside it with its interfaces unmanaged, which is sufficient for the
Palette agent. You only configure `systemd-networkd` to manage an interface if you set up an overlay network, as
described in [Prepare networking](#prepare-networking).

<!-- Resolved (DOC-3089) 2026-09-18 on the Thor: systemd-networkd is already active on JetPack but every interface is SETUP=unmanaged; NetworkManager owns the NIC (enP2p1s0, "Wired connection 1"). A bare `systemctl enable --now systemd-networkd` does NOT drop SSH on this build because it does not seize the NIC. The SSH-drop seen on 2026-09-08 happens when networkd is configured to MANAGE the interface you are connected over; that warning now lives on the Prepare networking / overlay step below, not here. -->

:::info

The FIPS-compliant version of agent mode is available only for Red Hat Enterprise Linux and Rocky Linux 8. On a JetPack
(Ubuntu) host, use the non-FIPS agent.

:::

## Prepare networking

If you plan to use overlay networks, or you want Palette to manage DNS or static IP addresses, configure
`systemd-resolved` and `systemd-networkd`. Refer to
[Configure networkd to Prepare Host for Overlay Network](../../deployment-modes/agent-mode/overlay-preparation.md).

:::warning

On a Jetson, NetworkManager manages the network interface by default. If you configure `systemd-networkd` to take over
the interface that you are connected to over SSH, the connection can drop, because the interface changes hands from
NetworkManager to `systemd-networkd`. Before you move an interface to `systemd-networkd` on a remote host, confirm that
you have console access to the device, or configure `systemd-networkd` with your network settings first so the interface
stays up. If your SSH session appears to hang after the switch, the transport is gone. Close it with the SSH escape
sequence (press **Enter**, then type `~.`), then reconnect from the console.

:::

<!-- Resolved (DOC-3089) 2026-09-18: the SSH-drop risk is the act of moving the SSH interface from NetworkManager to systemd-networkd during overlay configuration, not enabling networkd (already active on JetPack). Escape a hung SSH session with the client escape Enter ~ . — see memory jetson-networkd-ssh-drop. -->

## Obtain a registration token

Create a Palette tenant
[registration token](../../clusters/edge/site-deployment/site-installation/create-registration-token.md) and keep it
available for the registration step.

## Next steps

The device is now ready to register with Palette and run an AI model. Continue to

<!-- TODO(DOC-3090): link the Day 1 "Register a Jetson host and serve a model" page once it exists. -->

the Day 1 registration guide.
