---
id: server-configurations
title: Example Server Configurations
description: >
  Example server configurations for a PaletteAI Inference Launchpad appliance, spanning AMD Instinct and NVIDIA GPUs
  from multiple vendors.
sidebar_label: Example Server Configurations
sidebar_position: 3
tags:
  - paletteai-inference-launchpad
  - reference
  - hardware
keywords:
  - launchpad
  - ai
  - hardware
  - server
  - gpu
  - amd
  - nvidia
---

The following table lists example server configurations for PaletteAI Inference Launchpad. Each configuration meets the
specifications in [Suggested Hardware](./hardware-requirements.md).

<!-- vale Vale.Terms = NO -->

| **Server vendor**        | **Server model**                                   | **GPU vendor** | **GPU**                      | **CPU**                                            |
| ------------------------ | -------------------------------------------------- | -------------- | ---------------------------- | -------------------------------------------------- |
| Dell                     | PowerEdge XE9680                                   | NVIDIA         | 8x H200 141 GB SXM5          | 2x Intel Xeon Platinum 8570                        |
| Supermicro               | SYS-A21GE-NBRT                                     | NVIDIA         | 8x B200 180 GB SXM           | 2x Intel Xeon Platinum 8570                        |
| Supermicro               | Contact your Supermicro representative for details | NVIDIA         | 8x B300 288 GB SXM           | Contact your Supermicro representative for details |
| Supermicro               | Contact your Supermicro representative for details | AMD            | 8x Instinct MI350X 288 GB/ea | Contact your Supermicro representative for details |
| Vultr (bare metal cloud) | vbm-256c-3072gb-8-mi325x-gpu                       | AMD            | 8x Instinct MI325X 256 GB/ea | Contact your Vultr representative for details      |

<!-- vale Vale.Terms = YES -->

## Resources

- [Suggested Hardware](./hardware-requirements.md) for the specifications these configurations meet.
- [Certified Models by Hardware](./certified-models-by-hardware.md) for model-to-hardware mapping.
- [Install the Appliance](../how-to-guides/install-the-appliance.md) to deploy the appliance.
