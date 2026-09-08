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

<!-- VERIFY(DOC-3089): Ubuntu Pro on Jetson. The device runs the NVIDIA Jetson Linux (L4T) kernel, not a Canonical-built Ubuntu kernel, so kernel-level Pro features (Livepatch and the FIPS kernel) are expected NOT to apply; only the Ubuntu userspace (ESM, usg hardening) should. Not yet confirmed on the Thor — this unit was set up with Pro disabled. Validate on a rebuild with Pro enabled (`pro status` lists which services actually attach) before adding a customer-facing caveat about the Jetson kernel. -->

<!-- VERIFY(DOC-3089): Record the JetPack and L4T versions actually installed on the Thor (the factory-flashed value 38.0.0-gcid-41245178 that the device reports at first boot is the UEFI firmware version, NOT the JetPack/L4T version). Capture the real values on the device with:
       cat /etc/nv_tegra_release        # L4T release
       apt-cache show nvidia-jetpack    # JetPack version, if the meta-package is installed
       lsb_release -a                   # Ubuntu base version
     NVIDIA's current release is JetPack 7.2.1 (Jetson Linux L4T r39.2.1); confirm what this unit is on before publishing. -->

## Install software prerequisites

Install the software that the Palette agent requires. The following packages are required on the host.

<!-- VERIFY(DOC-3089): Confirm every package below installs and runs on JetPack (Ubuntu ARM64) on the Thor. This list is the agent-mode prerequisite set from install-agent-host.md, verified for AMD64. -->

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

<!-- VERIFY(DOC-3089): Confirmed on the Thor over SSH on 2026-09-08 — running `systemctl enable --now systemd-networkd` severed the SSH session because the interface was managed by another network stack. Validate the exact guidance (pre-configure networkd vs. require console access, and which manager JetPack ships by default) on a clean rebuild before publishing. -->

:::warning

If you are connected to the Jetson device over SSH, enabling `systemd-networkd` might interrupt your session. Bringing
up `systemd-networkd` can take over the network interfaces that another network manager, such as NetworkManager or
`ifupdown`, currently controls, which drops your connection. Before you enable `systemd-networkd` on a remote host,
confirm that you have console access to the device, or configure `systemd-networkd` with your network settings first so
the interface stays up.

:::

```shell
sudo systemctl enable --now systemd-timesyncd
sudo systemctl enable --now systemd-resolved
sudo systemctl enable --now systemd-networkd
sudo systemctl enable --now rsyslog
```

:::info

The FIPS-compliant version of agent mode is available only for Red Hat Enterprise Linux and Rocky Linux 8. On a JetPack
(Ubuntu) host, use the non-FIPS agent.

:::

## Prepare networking

If you plan to use overlay networks, or you want Palette to manage DNS or static IP addresses, configure
`systemd-resolved` and `systemd-networkd`. Refer to
[Configure networkd to Prepare Host for Overlay Network](../../deployment-modes/agent-mode/overlay-preparation.md).

<!-- TODO(DOC-3089): Note any Jetson-specific networking or proxy considerations discovered during validation. -->

## Obtain a registration token

Create a Palette tenant
[registration token](../../clusters/edge/site-deployment/site-installation/create-registration-token.md) and keep it
available for the registration step.

## Next steps

The device is now ready to register with Palette and run an AI model. Continue to
[Register a Jetson Host and Serve a Model](./register-jetson-host.md).
