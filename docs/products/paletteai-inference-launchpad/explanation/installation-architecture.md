---
id: installation-architecture
title: Installation Architecture
description: >
  How the PaletteAI Inference Launchpad appliance installs across two stages, the roles of the jumpbox, slim ISO, and
  Local UI, and why the network uses a bond rather than a bridge.
sidebar_label: Installation Architecture
sidebar_position: 5
tags:
  - paletteai-inference-launchpad
  - explanation
  - install
keywords: ["launchpad", "ai", "install", "architecture", "bond", "jumpbox"]
---

Installing the appliance moves it from bare hardware to a running, reachable console in two stages, driven from a
separate administrative workstation (a [jumpbox](../reference/glossary.md#jumpbox)). This page explains what happens in
each stage and why the appliance is put together the way it is. For the ordered procedure, refer to
[Install the Appliance](../how-to-guides/install-the-appliance.md).

## Two stages, driven from the jumpbox

You install the appliance from a jumpbox because the appliance itself is a self-contained unit with no external
management plane. The jumpbox holds the Palette CLI and the artifacts you download from Artifact Studio: the
[slim ISO](../reference/glossary.md#slim-iso), the [content bundle](../reference/glossary.md#content-bundle), and one
`metadata.yaml` per model. The jumpbox is where you run the CLI commands that put those artifacts on the appliance.

### Stage 1: Operating System and Initial Configuration

You flash the slim ISO (approximately 1.5 GB) to bootable media, or mount it through the server's
[baseboard management controller (BMC)](../reference/glossary.md#bmc) as
[virtual media](../reference/glossary.md#virtual-media), and boot the node. The Palette Edge interactive installer
writes the immutable [Kairos](../reference/glossary.md#kairos)-based operating system to the local disk. The node then
reboots into the [Palette TUI](../reference/glossary.md#palette-tui), where you set the initial administrator
credentials, hostname, DNS, NTP, and a static IP.

### Stage 2: Network, Content, and Cluster Deployment

You open [Local UI](../reference/glossary.md#local-ui) at the node's IP address, create a network
[bond](../reference/glossary.md#bond), link the other nodes (multi-node only), and upload the content bundle (more than
20 GB) from Local UI or the Palette CLI. You then deploy the cluster with a wizard that builds the Kubernetes cluster
and installs the platform packs. During or after cluster deployment, the Palette CLI on the jumpbox downloads the model
from Hugging Face and uploads it to the appliance over SSH. The model then appears in the console, where you deploy it
to serve requests.

Day-two cluster operations stay in Local UI. To add or remove nodes, scale the cluster. To upgrade the platform, upload
a newer content bundle from Artifact Studio and apply **Update** on the cluster configuration page. You do not reinstall
the OS or redeploy the cluster. Refer to
[Manage Cluster Infrastructure](../how-to-guides/manage-cluster-infrastructure.md) for the index of Local UI operations,
and to [Upgrade the Platform](../how-to-guides/upgrade-the-platform.md) for the upgrade procedure.

## Bond, not bridge

Networking uses a bond, not a bridge. A bond aggregates two physical NICs into a single logical link (`bond0`), and both
member NICs are active at once. That matters because two heavy traffic classes share the appliance's data NICs:

- **Cluster traffic**. concurrent client requests, model-weight loads, and container-image pulls.
- **[Piraeus](../reference/glossary.md#piraeus) storage replication**. continuous, byte-level replication of storage
  volumes across nodes in a multi-node cluster.

A bond in `802.3ad` mode (Link Aggregation Control Protocol, or LACP) with the `layer3+4` hash policy spreads these
long-lived flows evenly across both NICs, so cluster and storage traffic share the aggregated bandwidth. A bridge, by
contrast, is only useful in scenarios where distinct virtual-machine networks must be isolated. PaletteAI Inference
Launchpad runs containerized workloads and does not need that.

For the exact field values you enter in the bond form, refer to
[Bond Configuration Reference](../reference/bond-configuration.md).

## GPU memory sizes the model

A model fails to load if the GPUs do not have enough combined memory to hold it. The largest model that fits is
approximately 85 percent of the combined GPU memory, leaving headroom for the KV cache and runtime overhead. For
example, four H100 80 GB GPUs provide 320 GB, which holds a model up to roughly 272 GB. A larger model produces a
[vLLM](../reference/glossary.md#vllm) error such as `No available memory for the cache blocks`.

Confirm the target model fits the GPUs before you install. For model-to-hardware mapping, refer to
[Certified Models by Hardware](../reference/certified-models-by-hardware.md).
