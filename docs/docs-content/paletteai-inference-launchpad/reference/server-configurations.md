---
id: server-configurations
title: Suggested Server Configurations
description: >
  Suggested server configurations for a PaletteAI Inference Launchpad appliance, spanning AMD Instinct and NVIDIA GPUs
  from multiple vendors.
sidebar_label: Suggested Server Configurations
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

<PartialsComponent category="paletteai-inference-launchpad" name="unreleased-banner" />

The following table lists suggested server configurations for PaletteAI Inference Launchpad. Each configuration meets
the [Hardware Requirements](./hardware-requirements.md). The recommended platform is the Supermicro configuration with
AMD Instinct MI325X GPUs.

| **Vendor** | **System**                            | **GPUs**                                                    | **CPU**                     | **Notes**                                                                                                                                                                                   |
| ---------- | ------------------------------------- | ----------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Supermicro | AMD Instinct MI325X (recommended)     | 8x AMD Instinct MI325X, 256 GB GPU memory each (2 TB total) | 256 vCPU                    | 3 TB RAM. 4x 8 TB NVMe data, JBOD only. ROCm 6.16.13 or later, AMD GPU Operator, vLLM.                                                                                                      |
| Supermicro | AMD Instinct MI350X (next generation) | 8x AMD Instinct MI350X, CDNA 4 (gfx950)                     | Not specified               | AMD GPU Operator, ROCm, AIM Engine or vLLM.                                                                                                                                                 |
| Supermicro | SYS-421GE-TNHR-LC1 (liquid-cooled)    | 8x NVIDIA H100 SXM                                          | Intel Xeon Platinum 8570    | 2x BlueField-3 DPU (200 Gbps each), 8x ConnectX-7 NICs (400 Gbps each). JBOD only, no RAID controller.                                                                                      |
| HPE        | ProLiant Compute DL380a Gen12         | 8x NVIDIA L40S                                              | Intel Xeon 6710E            | BCM57416 10G RDMA NIC. NS204i-u Gen11 boot controller. GPUs may require a PCI workaround, which changes NIC names.                                                                          |
| Dell       | PowerEdge XE9680                      | 8x NVIDIA H100 80 GB SXM5                                   | 2x Intel Xeon Platinum 8570 | 2 TB to 4 TB DDR5 RAM. 2x BlueField-3 B3220 DPU, 8x ConnectX-7 400 Gb/s NICs. BOSS-N1 boot (2x M.2 RAID 1), direct NVMe/JBOD data. BOSS-N1 may need disabling to boot the Spectro Cloud OS. |

## Resources

- [Hardware Requirements](./hardware-requirements.md) for the requirements these configurations meet.
- [Certified Models by Hardware](./certified-models-by-hardware.md) for model-to-hardware mapping.
- [Install the Appliance](../how-to-guides/install-the-appliance.md) to deploy the appliance.
