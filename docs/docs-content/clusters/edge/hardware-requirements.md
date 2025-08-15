---
sidebar_label: "Hardware Requirements"
title: "Hardware Requirements"
description: "Learn about the hardware requirements for Palette Edge hosts."
hide_table_of_contents: false
sidebar_position: 0
tags: ["edge", "architecture"]
---

An Edge host must meet the minimum hardware requirements to be deployed successfully. Certain features such as Virtual
Machine Orchestrator (VMO) require additional hardware capabilities. This page provides general guidance on the minimum
hardware requirements for your Edge hosts.

:::info

Due to variations in hardware and firmware capabilities, in addition to different workloads required by each user, you
should always verify and evaluate specific devices with Palette Edge as part of solution design. To learn more, contact
Spectro Cloud sales at sales@spectrocloud.com.

:::

## Minimum Requirements

All Edge hosts must meet the following minimum hardware requirements.

### AMD64 Architecture Devices

| Component | Requirement                                                                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPU       | - Intel: i3, i5, i7, i9, Xeon series <br /> - AMD: Ryzen 3, 5, 7, 9, and Epyc series                                                                      |
| CPU Core  | Minimum two cores.                                                                                                                                        |
| Memory    | Minimum 8 GB.                                                                                                                                             |
| Storage   | Main drive requires a minimum of 100 GB storage to accommodate the Operating System (OS), Kubernetes, and workloads. The main drive must be an SSD drive. |

### ARM64 Architecture Devices

ARM64 support is only verified for the Nvidia Jetson Orin device family.

## Virtual Machine Orchestrator (VMO)

To operate VMO on edge clusters, the CPUs of the constituent Edge hosts must have the following virtualization
technologies.

- Intel: Intel Virtualization Technology for x86 (VT-d) or Intel Virtualization Technology for Directed I/O (VT-x)
- AMD: AMD Virtualization (AMD-V)

For more information, refer to [Virtual Machine Orchestrator](../../vm-management/vm-management.md).
