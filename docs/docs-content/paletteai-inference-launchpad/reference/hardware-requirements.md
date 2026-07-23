---
id: hardware-requirements
title: Suggested Hardware
description: >
  Suggested hardware for a PaletteAI Inference Launchpad appliance: compute, GPU, memory, storage, and network.
sidebar_label: Suggested Hardware
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

This page lists the hardware requirements for a PaletteAI Inference Launchpad appliance. Requirements are model-driven:
the target model determines the GPU count, GPU memory, host RAM, and storage.

For example server configurations that meet these requirements, refer to
[Example Server Configurations](./server-configurations.md). For model-to-hardware mapping, refer to
[Certified Models by Hardware](./certified-models-by-hardware.md). For the design decisions behind these requirements,
refer to [Architecture Overview](../explanation/architecture.md).

## Hardware Requirements

The following table lists the minimum and recommended hardware for the appliance on a single high-density GPU server.
The appliance ships an immutable Kairos-based operating system, so no separate install is required.

| **Component** | **Minimum Hardware**            | **Recommended Hardware**         | **Notes**                                                        |
| ------------- | ------------------------------- | -------------------------------- | ---------------------------------------------------------------- |
| CPU           | 2x 32-core CPU (64 cores total) | 2x 64-core CPU (128 cores total) | Dual-socket is required for 8x GPU systems                       |
| GPU           | 2x NVIDIA or AMD GPU            | 8x NVIDIA or AMD GPU             | Larger models require much more VRAM, typically with 8 GPUs      |
| GPU VRAM      | 128 GB (all GPUs combined)      | 1024 GB (all GPUs combined)      | Total VRAM across all installed GPUs; larger models require more |
| RAM           | 1 TB                            | 2 TB or more                     | 128 GB RAM per GPU, plus 512 GB or more for KV cache             |
| OS boot drive | 500 GB SSD                      | RAID1 of two 800 GB SSD drives   | Most servers provide an onboard RAID controller                  |
| Data disks    | 1x 8 TB NVMe                    | 4x 8 TB NVMe                     | Model weights and persistent KV cache stored on these drives     |
| Network       | 1x 10 Gbps NIC                  | 2x 10+ Gbps NICs, bonded         | 802.3ad LACP recommended                                         |

## GPU

The required GPU count depends on the target model. The minimum is 2 GPUs, and 8 GPUs are recommended for larger models.
For example, GLM 5.2 FP8 requires 8 GPUs.

The reference GPU is the NVIDIA H100 80 GB. The appliance supports both NVIDIA and AMD GPUs, and the GPU Operator
installs GPU drivers automatically. For the models certified on each GPU configuration, refer to
[Certified Models by Hardware](./certified-models-by-hardware.md).

## Storage

The OS boot drive is an SSD, and the data pool uses NVMe drives only. Spinning disks are not supported. Storage has two
roles.

| **Role**      | **Devices**                                                        | **Contents**                                                                                                                   |
| ------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| OS boot drive | 500 GB SSD (minimum); two 800 GB SSD drives in RAID1 (recommended) | Operating system, plus a system partition for the Piraeus system storage pool used at cluster bootstrap.                       |
| Data pool     | 1x 8 TB NVMe (minimum); 4x 8 TB NVMe (recommended)                 | Piraeus storage pool for the model-weights and KV cache volumes; striped across the data drives when more than one is present. |

A single model artifact is large. For example, GLM 5.2 FP8 weights are approximately 750 GB. The Piraeus storage layer
provisions a 1 TB volume for model weights and a 2 TB volume for the KV cache.

## Network and IP Addressing

A single 10 Gbps NIC meets the minimum requirement. For the recommended configuration, bond two or more 10 Gbps or
faster NICs using the 802.3ad Link Aggregation Control Protocol (LACP) with a `layer3+4` hash policy and a fast LACP
rate. The bonded NICs present a single logical interface.

Required IP addresses:

- A single unused platform IP address (not a range) for MetalLB to assign to Traefik, which fronts the appliance console
  and API.
- A cluster virtual IP address (VIP).

The following network ranges apply by default and become read-only after day one.

| **Network**           | **Default**    |
| --------------------- | -------------- |
| Pod network range     | 100.64.0.0/18  |
| Service network range | 100.64.64.0/18 |

The appliance listens on the following ports.

| **Port** | **Purpose**                                                                               |
| -------- | ----------------------------------------------------------------------------------------- |
| 443/TCP  | Appliance console and API, served by Traefik on the platform IP address.                  |
| 5080/TCP | Node Local UI, reached at `https://<node-ip>:5080` during installation.                   |
| 5082/TCP | Node Local UI API, used by the Palette CLI to upload the content bundle from the jumpbox. |

## Airgapped

The appliance is airgapped. Application images ship in the content bundle, and model weights ship as a separate
artifact. The appliance requires no outbound internet access during installation or day-two operation.

## Administrative Workstation

The appliance requires a separate Linux administrative workstation, also called a jumpbox, on the same network as the
appliance nodes. The appliance does not provide this machine. You use it during
[installation](../how-to-guides/install-the-appliance.md) and across the entire appliance lifecycle.

Provision the administrative workstation with the following:

- Network access to the appliance nodes over SSH.
- An SSH client and a key pair, or password authentication, for the appliance nodes.
- The Palette CLI, which uploads model artifacts to the appliance.
- `kubectl`, for post-installation validation and day-two operations.
- Enough local disk to stage model downloads. Model artifacts are large and can reach hundreds of gigabytes.

### Model Download Access (Recommended)

Outbound HTTPS access to `huggingface.co` from the administrative workstation is recommended. It lets you download model
weights directly before you upload them to the appliance. This access applies to the administrative workstation, not the
appliance. As noted in [Airgapped](#airgapped), the appliance itself needs no outbound internet access.

If outbound access is blocked, download model weights on a separate connected machine, then transfer them to the
administrative workstation before you upload them.

## Resources

- [Example Server Configurations](./server-configurations.md) for example machines that meet these requirements.
- [Certified Models by Hardware](./certified-models-by-hardware.md) for model-to-hardware mapping.
- [Architecture Overview](../explanation/architecture.md) for the design decisions behind these requirements.
