---
id: hardware-requirements
title: Hardware Requirements
description: >
  Hardware requirements for a PaletteAI Inference Launchpad appliance: compute, GPU, memory, storage, and network.
sidebar_label: Hardware Requirements
sidebar_position: 2
tags:
  - paletteai-inference-launchpad
  - reference
  - requirements
  - hardware
keywords:
  - launchpad
  - ai
  - hardware
  - gpu
  - nvme
  - requirements
  - appliance
---

<PartialsComponent category="paletteai-inference-launchpad" name="unreleased-banner" />

This page lists the hardware requirements for a PaletteAI Inference Launchpad appliance. Requirements are model-driven:
the target model determines the GPU count, GPU memory, host RAM, and storage.

For suggested server configurations that meet these requirements, refer to
[Suggested Server Configurations](./server-configurations.md). For model-to-hardware mapping, refer to
[Certified Models by Hardware](./certified-models-by-hardware.md). For the design decisions behind these requirements,
refer to [Architecture Overview](../explanation/architecture.md).

## Minimum Requirements

The following table lists the minimum hardware for the appliance on a single high-density GPU server. The appliance
ships an immutable Kairos-based operating system, so no separate install is required.

| **Component**   | **Requirement**                                                            | **Notes**                                                        |
| --------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| CPU             | 2x 64-core x86_64 (128 cores total)                                        | Dual-socket.                                                     |
| GPU             | 4x NVIDIA or AMD GPU ()                                                    | 8x for larger models                                             |
| RAM             | 2 TB or more                                                               | 128 GB per GPU, plus 1 TB for the operating system and KV cache. |
| OS boot disks   | 2x NVMe, 800 GB or more, hardware RAID1                                    | Dedicated boot controller, for example HPE NS204i-u Gen11.       |
| Data disks      | 4x NVMe, 8 TB or more each (32 TB or more raw), separate from the OS disks | Piraeus storage pool for model weights and KV cache.             |
| Disk technology | NVMe only                                                                  | SATA solid-state drives and spinning disks are not supported.    |
| Network         | Two or more high-bandwidth NICs, bonded (802.3ad LACP)                     | Presented as a single logical interface.                         |

## GPU

The required GPU count depends on the target model. The baseline is 4 GPUs. Larger models require more. For example, GLM
5.2 FP8 requires 8 GPUs.

The reference GPU is the NVIDIA H100 80 GB. The appliance supports both NVIDIA and AMD GPUs, and the GPU Operator
installs GPU drivers automatically. For the models certified on each GPU configuration, refer to
[Certified Models by Hardware](./certified-models-by-hardware.md).

## Storage

The appliance uses NVMe storage only. SATA solid-state drives and spinning disks are not supported. Storage has two
roles.

| **Role**      | **Devices**                                    | **Contents**                                                                                                                        |
| ------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| OS boot disks | 2x NVMe, 800 GB or more, hardware RAID1        | Operating system, plus a system partition (roughly 400 GB to 500 GB) for the Piraeus system storage pool used at cluster bootstrap. |
| Data pool     | 4x NVMe, 8 TB or more each (32 TB or more raw) | Piraeus storage pool, striped across all data drives, for the model-weights and KV cache volumes.                                   |

A single model artifact is large. For example, GLM 5.2 FP8 weights are approximately 750 GB. The Piraeus storage layer
provisions a 1 TB volume for model weights and a 2 TB volume for the KV cache.

## Network and IP Addressing

The recommended bond configuration is the 802.3ad Link Aggregation Control Protocol (LACP) with a `layer3+4` hash policy
and a fast LACP rate. The bonded NICs present a single logical interface.

Required IP addresses:

- A platform IP address assigned to MetalLB. Traefik claims this address and fronts the appliance.
- A cluster virtual IP address (VIP).
- An unused IP address, or a range, for MetalLB to expose platform services.

The following network ranges apply by default and become read-only after day one.

| **Network**           | **Default**    |
| --------------------- | -------------- |
| Pod network range     | 100.64.0.0/18  |
| Service network range | 100.64.64.0/18 |

The appliance listens on the following ports.

| **Port** | **Purpose**                                                              |
| -------- | ------------------------------------------------------------------------ |
| 443/TCP  | Appliance console and API, served by Traefik on the platform IP address. |
| 5080/TCP | Node Local UI, reached at `https://<node-ip>:5080` during installation.  |

## Airgapped

The appliance is airgapped. Application images ship in the content bundle, and model weights ship as a separate
artifact. The appliance requires no outbound internet access during installation or day-two operation.

## Resources

- [Suggested Server Configurations](./server-configurations.md) for suggested machines that meet these requirements.
- [Certified Models by Hardware](./certified-models-by-hardware.md) for model-to-hardware mapping.
- [Architecture Overview](../explanation/architecture.md) for the design decisions behind these requirements.
