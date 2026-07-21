---
id: known-issues
title: Known Issues
description: >
  Known issues that operators may encounter during PaletteAI Inference Launchpad installation and validation, and the
  workarounds for each.
sidebar_label: Known Issues
sidebar_position: 9
tags:
  - paletteai-inference-launchpad
  - reference
  - troubleshooting
keywords: ["launchpad", "ai", "install", "known issues", "workaround", "troubleshooting", "hpe", "pci"]
---

This page lists the known issues that operators may encounter during installation and validation of the PaletteAI
Inference Launchpad appliance, and the workaround for each. For the ordered procedure, refer to
[Install the Appliance](../how-to-guides/install-the-appliance.md).

## GPUs do not enumerate on HPE servers

<!-- vale off -->

**Symptom.** On some HPE servers, for example the DL380a Gen11, the GPUs do not enumerate on the PCI bus. Each GPU
reports `Region 0/2/4: Memory at ignored` under `lspci -vv`, and the kernel logs `NVRM: BAR0 is 0M @ 0x0` with a probe
failure for every device.

**Workaround.** Add `pci=realloc=off` to the GRUB kernel command line.

1. Boot into GRUB and append `pci=realloc=off` to `GRUB_CMDLINE_LINUX_DEFAULT` so that it reads
   `GRUB_CMDLINE_LINUX_DEFAULT="quiet splash pci=realloc=off"`, then reboot.
2. Verify the GPUs with `lspci -v -s <bus:device.function>`, then confirm with `nvidia-smi`.
3. For better performance, enable Resizable BAR in the BIOS. On HPE Gen11 servers, go to **PCIe Device Configuration >
   Advanced PCIe Configuration**. An RBSU BIOS upgrade may be required.

**Side effect: NIC rename.** The workaround renames the NICs. Update the interface names in the `/etc/systemd/network`
and `/oem` directories afterward.

<!-- vale on -->
