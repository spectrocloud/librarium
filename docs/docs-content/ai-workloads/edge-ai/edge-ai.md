---
sidebar_label: "Edge AI on Jetson"
title: "Edge AI on NVIDIA Jetson"
description: "Run local AI models at the edge on NVIDIA Jetson devices managed by Palette in agent mode."
hide_table_of_contents: false
sidebar_position: 0
tags: ["ai workloads", "edge", "nvidia", "jetson", "agent mode"]
---

<!-- SCAFFOLD (DOC-2802 / DOC-3089): Day-0 pages seeded with verified content; Thor-specific values are marked TODO and gated on hardware validation and DOC-3093 (ARM64 support statements). Placement under ai-workloads/edge-ai/ is provisional pending DOC-3094. -->

This section guides you through running local AI models at the edge on NVIDIA Jetson devices managed by Palette. Because
Palette manages the Jetson device as an Edge host, you can model the operating system, Kubernetes distribution, and AI
serving workload as a cluster profile and deploy it the same way you manage the rest of your Edge fleet.

:::info

On ARM64 devices such as the Jetson family, Palette registers the host using
[agent mode](../../deployment-modes/agent-mode/agent-mode.md). Appliance mode is not available on ARM64. Refer to
[Edge Hardware Requirements](../../clusters/edge/hardware-requirements.md) for the current ARM64 support statement.

:::

## Get started

<!-- prettier-ignore-start -->

- [Jetson Requirements](./jetson-requirements.md) - Review the hardware, operating system, and Palette requirements for
  running Edge AI workloads on a Jetson device.

- [Prepare the Jetson Host](./prepare-jetson-host.md) - Install the software prerequisites and prepare the device so it
  can register with Palette.

<!-- prettier-ignore-end -->

<!-- TODO(DOC-3090): add "Register a Jetson host and serve a model" (Day 1) card once that page exists. -->
<!-- TODO(DOC-3091): add "Day 2 operations for Jetson Edge AI" card once that page exists. -->
<!-- TODO(DOC-3092): add "Run a local AI model on a Jetson at the edge" tutorial card once that page exists. -->
