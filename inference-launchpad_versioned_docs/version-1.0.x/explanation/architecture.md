---
sidebar_label: "Architecture Overview"
title: "PaletteAI Inference Launchpad Architecture Overview"
description:
  "An explanation of the PaletteAI Inference Launchpad architecture, including its component stack, data flow, network
  topology, and data residency model."
hide_table_of_contents: false
sidebar_position: 1
tags: ["paletteai-inference-launchpad", "architecture", "explanation"]
keywords: ["launchpad", "ai", "architecture", "kubernetes", "kairos", "helm", "data flow", "data residency"]
---

This page explains how PaletteAI Inference Launchpad works, how its components interact, and what key decisions shaped
the design. Use this page to build an understanding of the architecture before you deploy or operate PaletteAI Inference
Launchpad.

## Component Stack

The appliance serves each model through an inference engine, such as vLLM, running on its Kubernetes cluster. Each
loaded model is exposed as an OpenAI-compatible endpoint, such as `/v1/chat/completions` and `/v1/models`. For the
engine kinds the appliance supports and how it selects one, refer to [Inference Engines](./inference-engines.md).

## Hardware Sizing

The appliance is designed and tuned for a single high-density GPU server. That shape avoids the storage-replication,
network-fabric, and scheduling complexity that appears as soon as nodes multiply, and it matches how most deployments
start. Multi-server clusters are possible but are not tuned for this release.

Sizing follows from the model rather than from a fixed value. The target model sets the GPU count, and the rest of the
machine scales with it.

The CPU is dual-socket because high-density GPU servers use two sockets, and 128 total cores give Kubernetes, the
inference server, and system tasks enough headroom while leaving room to reuse the server for other workloads later.

Host RAM is sized as GPU-adjacent memory, which covers host-side buffers and KV cache spill, plus a base for the
operating system, the Kubernetes control plane, cluster services, and the hot KV cache tier. Undersized RAM forces the
KV cache to spill to disk sooner, where it is far slower.

Storage is NVMe only because model loading and KV cache I/O exceed what SATA solid-state drives or spinning disks can
sustain. The disks split into two pools with different lifetimes. A small system pool on the OS disks holds the
container registry and airgap content that must be available before the cluster builds, and a larger data pool on
separate NVMe drives is created after the cluster comes up, once Piraeus is available. Piraeus stripes the data pool
across its drives to combine read and write bandwidth for model loading and KV cache spill.

The network uses bonded NICs so that the ports on a high-density server present one logical interface, which the
appliance detects and configures automatically.

For the specific values and example server configurations, refer to
[Suggested Hardware](../reference/hardware-requirements.md).

## Appliance and Cluster Formation

## Model Provisioning Lifecycle

When you deploy a model, you select it for the cluster rather than for a specific node, and the appliance places it
automatically on the best-fit node. The best-fit node is the node with the most free GPUs that still fit the model. A
model that does not need a GPU is placed on a CPU-capable node.

The appliance reports each node's free capacity honestly. A node shows either a known free GPU count or an unknown
allocation when the appliance cannot determine the count. The appliance never treats a node with an unknown allocation
as free, never selects such a node automatically, and never invents a placement target. When no node can host a model,
the appliance holds the deployment and reports the reason instead of choosing a node anyway.

The appliance applies a deployment through a guarded sequence. It first previews the change so you can review it, and it
writes nothing until you confirm. It then brings the model through gate, provision, smoke-test, and ready stages. A
model becomes routable only after its signature is verified and its smoke test passes, so the appliance never presents a
model as ready before it can serve requests.

## Request Routing

The gateway routes each request to a model. A request that names a model uses that model, and a request that does not
name a model falls back to the default model.

Before it routes a request, the gateway authenticates the calling client from its API token and enforces that client's
quotas. For how clients, API tokens, and quotas work together, refer to [Clients and Quotas](./clients-and-quotas.md).

### The Default Model

The default model is the model the appliance routes a request to when the request does not name a specific model. The
appliance sets the default; there is no operator control to change which model is the default.

## Network Topology

## Data Residency and Isolation

Inference runs on the appliance, so a request and the model that answers it stay inside your environment by default.
Nothing about a prompt leaves the appliance unless an operator gives a client permission to send it elsewhere.

That permission is [egress](../reference/glossary.md#egress), and it denies by default. A new client cannot reach any
destination outside the appliance until an operator enables it. Refer to
[Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md).

Once an operator enables egress, a client can reach a built-in
[frontier model](../reference/glossary.md#frontier-model), which is a model hosted by an external provider rather than
served from the appliance.

Egress is not only a destination a client asks for. An operator can arm frontier-model bursting for a client, which
sends a request that asked for local serving to an external provider once the client exhausts its local quota rather
than refusing it. Naming a local model is therefore not on its own what keeps a prompt on the box. Bursting is still
egress and runs through the same permission, so a client that cannot reach an external destination cannot burst to one
either.

The **Usage** page reports what share of traffic stayed on the appliance and what share went off the box, and it pairs
the two per client rather than summing them into one figure. Refer to
[Usage Metrics Reference](../reference/usage-metrics-reference.md).

The appliance needs no outbound internet access to install or to run day to day, so an appliance on which no client has
egress enabled answers every request without reaching a network beyond your own. The residency guarantee is therefore an
operator-controlled one rather than a physical one. The appliance is capable of reaching an external host, and it does
so only where an operator has allowed it.
