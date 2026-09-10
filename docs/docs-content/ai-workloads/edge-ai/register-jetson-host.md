---
sidebar_label: "Register a Jetson Host and Serve a Model"
title: "Register a Jetson Host and Serve a Model"
description:
  "Register an NVIDIA Jetson device with Palette in agent mode, deploy an Edge Native cluster profile, and serve a local
  AI model on the device GPU."
hide_table_of_contents: false
sidebar_position: 30
tags: ["ai workloads", "edge", "nvidia", "jetson", "agent mode", "day 1"]
---

<!-- SCAFFOLD (DOC-3090 Day 1). Structure and verified-from-docs prose are seeded here; every device-specific value (agent install output, the ARM64 distribution/CNI, the embedded-GPU layer, and the model-serving layer) is a TODO gated on validation on the Thor. Do not publish until the TODOs and VERIFY markers are resolved. The serving-stack choice (Ollama ARM64, fallback llama.cpp) is tentative pending Thor validation and product sign-off. -->

This page describes Day 1 of running Edge AI workloads on an NVIDIA Jetson device. Starting from a host you prepared in
[Prepare the Jetson Host](./prepare-jetson-host.md), you register the device with Palette as an Edge host in
[agent mode](../../deployment-modes/agent-mode/agent-mode.md), model the operating system, Kubernetes distribution, and
AI serving workload as an Edge Native cluster profile, deploy that profile to the device, and confirm the model
responds.

:::info

Palette registers the Jetson device using agent mode, in which the Palette agent on the device makes an outbound
connection to Palette. Appliance mode is not available on ARM64 devices. Refer to
[Jetson Requirements](./jetson-requirements.md) for the full requirements.

:::

## Prerequisites

- A Jetson device prepared as described in [Prepare the Jetson Host](./prepare-jetson-host.md), with the software
  prerequisites installed.
- A Palette tenant
  [registration token](../../clusters/edge/site-deployment/site-installation/create-registration-token.md).
- Permissions to create cluster profiles and deploy clusters in your Palette project.

## Create the user-data file

Create a `user-data` file on the Jetson device. In agent mode, the Palette agent installer reads this file to register
the host with your Palette tenant and project. Unlike appliance mode, the file is not built into an installer image. It
is a plain file on the device that you pass to the installer.

<!-- VERIFY(DOC-3090): Confirm the minimal required user-data schema for agent mode on Jetson against site-user-data.md and a validated install on the Thor. The block below is the minimum registration set (edgeHostToken, paletteEndpoint, project). Do NOT publish a `registrationURL` value from internal examples (the vercel.app gateway is a test endpoint); most installs omit it and use the default gateway. Confirm whether the `palette.ai: "true"` tag is required for PaletteAI discovery and whether any `stages`/Kairos stanzas apply in pure agent mode on a BYO OS (they are Edge Installer heritage and might not). -->

```yaml
#cloud-config
stylus:
  site:
    edgeHostToken: "<your-registration-token>"
    paletteEndpoint: "console.spectrocloud.com"
    projectName: "<your-project-name>"
```

Refer to [Edge Installer User Data](../../clusters/edge/site-deployment/site-installation/site-user-data.md) for the
full list of configuration options.

## Install the Palette agent

Run the Palette agent installer on the device, pointing it at the `user-data` file you created. The installer downloads
the agent, unpacks the agent runtime, configures the systemd service, and starts registration.

<!-- TODO(DOC-3090): Confirm the exact, supported installer invocation and source URL for agent mode on Jetson, and capture the real output on the Thor. The command below reflects the agent-mode install flow; validate it end to end before publishing. Cross-check against install-agent-host.md. -->

```shell
export USERDATA=/path/to/user-data
curl --location --silent <palette-agent-install-url> | sudo --preserve-env bash
```

Refer to [Install Agent on a Host](../../deployment-modes/agent-mode/install-agent-host.md) for the agent-mode install
reference.

## Verify the host registers

After the agent starts, the device registers with Palette and appears in your Edge host inventory.

<!-- TODO(DOC-3090): Document where the host appears in the Palette UI (Clusters > Edge Hosts, or the equivalent), the expected status, and how auto-registration behaves with projectName set. Capture a screenshot from the Thor. -->

1. Log in to [Palette](https://console.spectrocloud.com).
2. From the left **Main Menu**, confirm the Jetson device appears as a registered Edge host.

## Create the cluster profile

Create an Edge Native cluster profile that models the full stack for the Jetson device.

<!-- TODO(DOC-3090 / DOC-3093): State the verified ARM64 Kubernetes distribution (K3s is the likely candidate) and CNI once validated on the Thor, and add the ARM64 row to the agent-mode verified-combinations table. edge-canonical does not support ARM64. -->

<!-- TODO(DOC-3090 / DOC-3089): Document the embedded-GPU enablement layer for the integrated Jetson GPU. The NVIDIA GPU Operator pack does not support embedded products, so this is a different mechanism (for example, the NVIDIA container runtime and a RuntimeClass, or a device plugin). This path is not yet covered in librarium; confirm with engineering how it is expressed in the profile. -->

<!-- TODO(DOC-3090): Document the model-serving layer. Working demo is Ollama (ARM64), tentative pending Thor validation and product sign-off; fallback is a JetPack-tuned llama.cpp container. -->

The profile contains the following layers:

- **Operating system** - the agent-mode host OS (JetPack), modeled so Palette manages the existing operating system on
  the device.
- **Kubernetes** - a distribution verified for ARM64.
- **Network** - a Container Network Interface (CNI) verified for the chosen distribution.
- **GPU enablement** - the layer that exposes the device integrated GPU to workloads.
- **Model serving** - the layer that serves the local AI model.

Refer to [Create an Edge Native Cluster Profile](../../clusters/edge/site-deployment/model-profile.md) and
[Create Cluster Profiles](../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md) for
guidance on building a profile.

## Deploy the cluster

Deploy the cluster profile to the registered Jetson host to create a single-node Edge cluster.

<!-- TODO(DOC-3090): Document the deploy flow for a single Jetson host (host selection, profile attachment, and any Jetson-specific configuration values), and capture the expected healthy state. Validate on the Thor. -->

## Serve and verify the model

After the cluster reaches a healthy state, the model-serving workload runs on the device and exposes a serving endpoint.
Confirm the model responds.

<!-- TODO(DOC-3090): Document how to reach the serving endpoint on the device and a concrete verification (for example, a request that returns a completion). Capture the real endpoint, port, and example response from the Thor. -->

## Next steps

The Jetson device now runs a local AI model managed by Palette. To learn about ongoing operations, continue to

<!-- TODO(DOC-3091): link the Day 2 operations page once it exists. -->

the Day 2 operations guide. For a complete end-to-end guide, refer to

<!-- TODO(DOC-3092): link the "Run a local AI model on a Jetson at the edge" tutorial once it exists. -->

the tutorial.
