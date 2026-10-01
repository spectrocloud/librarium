---
sidebar_label: "Edge AI on Jetson"
title: "Edge AI on NVIDIA Jetson"
description: "Run local AI models at the edge on NVIDIA Jetson devices managed by Palette in agent mode."
hide_table_of_contents: false
sidebar_position: 0
tags: ["ai workloads", "edge", "nvidia", "jetson", "agent mode"]
---

This section guides you through running local AI models at the edge on
[NVIDIA Jetson](https://docs.nvidia.com/jetson/index.html) devices managed by Palette. Because Palette manages the
Jetson device as an Edge host, you can model the operating system, Kubernetes distribution, and AI serving workload as a
cluster profile and deploy it the same way you manage the rest of your Edge fleet.

:::info

On ARM64 devices such as the Jetson family, Palette registers the host using
[agent mode](../../deployment-modes/agent-mode/agent-mode.md). Appliance mode is not available on ARM64. Refer to
[Edge Hardware Requirements](../../clusters/edge/hardware-requirements.md) for the current ARM64 support statement.

:::

## When to use Edge AI

Edge AI runs model inference on hardware at the edge, close to where data is generated, instead of sending that data to
a data center or the cloud. It suits environments that need low-latency inference, operate with limited or intermittent
connectivity, or must keep data on-site for privacy or compliance. Common examples include computer vision on remote
equipment, real-time analysis in the field, and AI-assisted decisions where a round trip to the cloud is too slow.

For a real-world example, refer to the [RapidAI case study](https://spectrocloud.com/customers/rapidai), which describes
running life-critical AI workloads on edge Kubernetes with Palette.

## Get started

<!-- prettier-ignore-start -->

- [Requirements](./jetson-requirements.md) - Review the hardware, operating system, and Palette requirements for
  running Edge AI workloads on an NVIDIA Jetson device.

- [Prepare the Jetson Host](./prepare-jetson-host.md) - Install the software prerequisites and prepare the device so it
  can register with Palette.

- [Register a Jetson Host and Serve a Model](./register-jetson-host.md) - Register the device with Palette in agent
  mode, deploy an Edge Native cluster profile, and serve a local AI model on the device GPU.

<!-- prettier-ignore-end -->
<!-- TODO(DOC-3091): add "Day 2 operations for Jetson Edge AI" card once that page exists. -->
<!-- TODO(DOC-3092): add "Run a local AI model on a Jetson at the edge" tutorial card once that page exists. -->
