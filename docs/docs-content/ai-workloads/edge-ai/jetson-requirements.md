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

## Network requirements

Palette manages the Jetson device over an outbound connection. In agent mode, the Palette agent on the device initiates
the connection to Palette, and Palette does not connect inbound to the device. A Jetson host on a private network behind
NAT is supported without inbound firewall rules or a [Private Cloud Gateway (PCG)](../../clusters/pcg/pcg.md). A PCG
serves private-cloud data center environments where Palette reaches a private infrastructure API, which does not apply
to an Edge host.

The device requires outbound HTTPS (TCP 443) access to the following:

- The Palette SaaS endpoint, `console.spectrocloud.com`.
- The Palette image registries that host the agent image, packs, and images your cluster profile uses.

If your network restricts egress, export the proxy configuration in your terminal session before you install the agent.
Set the `http_proxy` and `https_proxy` variables, in both lowercase and uppercase forms. Refer to the proxy step in
[Install Agent on a Host](../../deployment-modes/agent-mode/install-agent-host.md#enablement) for the exact commands.

<!-- Resolved (DOC-3089) 2026-09-14: outbound is HTTPS/443 to console.spectrocloud.com plus the Palette image registries (the agent image pulls from Palette's registry, confirmed in the Thor install log). Proxy variables corrected to http_proxy/https_proxy per install-agent-host.md (there is no PROXY_CERT_PATH in the agent-mode flow). Proxy behavior itself is not yet validated on the Thor (this unit is not behind a proxy). Follow-up TODO(DOC-3089): add a diagram of the agent-mode outbound flow (Jetson on a private LAN making outbound HTTPS to Palette SaaS and the registries). -->

## Hardware requirements

The following table lists the agent mode minimum requirements alongside the specifications of the Jetson AGX Thor
Developer Kit, which exceeds them comfortably. The minimum values match the agent mode prerequisites on
[Install Agent on a Host](../../deployment-modes/agent-mode/install-agent-host.md).

<!-- Resolved (DOC-3089) 2026-09-14: 2 CPU / 8 GB / 100 GB SSD is the authoritative agent-mode minimum, confirmed against install-agent-host.md and the engineering KB. The 4-core / 4 GB / 32 GB values on deployment-modes/agent-mode/architecture.md are outdated legacy guidance tracked for correction under DOC-1172; do not reconcile that here. -->

| Component | Minimum (agent mode)  | Jetson AGX Thor Developer Kit                       |
| --------- | --------------------- | --------------------------------------------------- |
| CPU       | 2 cores               | 14-core Arm Neoverse-V3AE (64-bit)                  |
| Memory    | 8 GB                  | 128 GB LPDDR5X                                      |
| Storage   | 100 GB, SSD required  | 1 TB NVMe SSD                                       |
| GPU       | Integrated NVIDIA GPU | NVIDIA Blackwell, 2,560 CUDA cores, 96 Tensor cores |

## Host Operating System

The Jetson device runs [NVIDIA JetPack](https://developer.nvidia.com/embedded/jetpack), which provides a Jetson Linux
(L4T) operating system built on Ubuntu. For instructions on installing JetPack, refer to
[Prepare the Jetson Host](./prepare-jetson-host.md).

This guide is validated on the operating system versions in the following table.

| Component    | Validated version        |
| ------------ | ------------------------ |
| JetPack      | 7.2.1                    |
| Jetson Linux | L4T r39.2.1              |
| Ubuntu base  | 24.04 LTS (Noble Numbat) |

<!-- Resolved (DOC-3089) 2026-09-14 on the Thor: /etc/nv_tegra_release reports R39 REVISION 2.1 (L4T r39.2.1); lsb_release reports Ubuntu 24.04.5 LTS (noble). JetPack 7.2.1 is the release that corresponds to L4T r39.2.1 per NVIDIA's mapping; the nvidia-jetpack meta-package was not installed on this base image, so JetPack is inferred from L4T. CUDA was not present on the base OS (no nvcc, version.json, or cuda-toolkit package); capture the CUDA version during the model-serving (Day 1 / tutorial) validation, where that layer matters. Thor support statement itself is still gated on DOC-3093 (Rishi). -->

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
