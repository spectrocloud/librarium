---
sidebar_label: "Jetson Requirements"
title: "Jetson Requirements"
description:
  "Hardware, operating system, and Palette requirements for running Edge AI workloads on an NVIDIA Jetson device."
hide_table_of_contents: false
sidebar_position: 10
tags: ["ai workloads", "edge", "nvidia", "jetson", "agent mode", "requirements"]
---

<!-- SCAFFOLD (DOC-3089 Day 0). Verified-from-docs content is written as prose. Thor-specific values are TODO and require reading the device or engineering confirmation (DOC-3093). Do not publish until TODOs are resolved. -->

This page describes the requirements for running Edge AI workloads on an NVIDIA Jetson device managed by Palette.

## Deployment mode

Palette manages the Jetson device as an Edge host registered in
[agent mode](../../deployment-modes/agent-mode/agent-mode.md). You bring your own operating system, install the Palette
agent on the device, and register it with Palette.

:::warning

Appliance mode is not available on ARM64 devices. Provision ARM64 hosts, including Jetson devices, using agent mode.
Refer to [Edge Hardware Requirements](../../clusters/edge/hardware-requirements.md) for the current ARM64 support
statement.

:::

<!-- VERIFY(DOC-3093): The published ARM64 support statement in hardware-requirements.md currently covers the Jetson Orin family only. Confirm Jetson Thor support with engineering (Rishi) and update that statement before publishing this guide. -->

## Hardware requirements

The following table lists the agent mode minimum requirements alongside the specifications of the Jetson AGX Thor
Developer Kit, which exceeds them comfortably.

<!-- VERIFY(DOC-3089): The "Minimum (agent mode)" column uses the prerequisite values from deployment-modes/agent-mode/install-agent-host.md (2 CPU / 8 GB / 100 GB). Note that deployment-modes/agent-mode/architecture.md lists different numbers (4 cores / 4 GB / 32 GB SSD). This is a discrepancy between two published pages; reconcile it (and confirm which is authoritative) before publishing. -->

| Component | Minimum (agent mode)  | Jetson AGX Thor Developer Kit                       |
| --------- | --------------------- | --------------------------------------------------- |
| CPU       | 2 cores               | 14-core Arm Neoverse-V3AE (64-bit)                  |
| Memory    | 8 GB                  | 128 GB LPDDR5X                                      |
| Storage   | 100 GB, SSD required  | 1 TB NVMe SSD                                       |
| GPU       | Integrated NVIDIA GPU | NVIDIA Blackwell, 2,560 CUDA cores, 96 Tensor cores |

## Operating system

The Jetson device runs [NVIDIA JetPack](https://developer.nvidia.com/embedded/jetpack), which provides a Jetson Linux
(L4T) operating system built on Ubuntu. For instructions on installing JetPack, refer to
[Prepare the Jetson Host](./prepare-jetson-host.md).

<!-- VERIFY(DOC-3089): Record the validated JetPack version, L4T (Linux for Tegra) version, Ubuntu base version, and CUDA version from the device. NVIDIA's current release is JetPack 7.2.1 (Jetson Linux L4T r39.2.1). The value 38.0.0-gcid-41245178 the device reports is the factory UEFI firmware version, not the JetPack/L4T version. Capture the real OS values with `cat /etc/nv_tegra_release`, `apt-cache show nvidia-jetpack`, and `lsb_release -a`, then confirm the supported combination with engineering (Rishi / DOC-3093). -->

## Supported Kubernetes distribution and CNI

<!-- TODO(DOC-3093): The agent-mode verified-combinations table in install-agent-host.md lists AMD64 combinations only. Confirm the verified ARM64 combination for Jetson (Kubernetes distribution + CNI) with engineering and add the ARM64 row there. -->

Palette Optimized Canonical (edge-canonical) does not support ARM64. On Jetson, use a Kubernetes distribution verified
for ARM64.

<!-- TODO(DOC-3089): State the specific distribution (K3s is the likely candidate) and CNI once validated on the Thor. -->

## GPU requirements

The <VersionedLink text="NVIDIA GPU Operator" url="/integrations/packs/?pack=nvidia-gpu-operator-ai" /> pack requires a
dedicated NVIDIA GPU and does not support embedded products such as NVIDIA Jetson. Do not use the GPU Operator pack on
Jetson devices.

<!-- TODO(DOC-3089 / DOC-3090): Document the embedded-GPU enablement path for Jetson. This is not currently covered in librarium. Confirm with engineering how GPU workloads access the integrated GPU under JetPack (for example, the NVIDIA container runtime and a RuntimeClass, or the NVIDIA device plugin) and how that is expressed in the cluster profile. -->

## Palette requirements

- A Palette tenant with permissions to create an Edge host registration token and cluster profiles.
- A Palette tenant
  [registration token](../../clusters/edge/site-deployment/site-installation/create-registration-token.md).

## Next steps

After you confirm the requirements, continue to [Prepare the Jetson Host](./prepare-jetson-host.md).
