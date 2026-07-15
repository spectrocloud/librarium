---
sidebar_label: "Architecture Overview"
title: "PaletteAI Inference Launchpad Architecture Overview"
description:
  "An explanation of the PaletteAI Inference Launchpad architecture, including its component stack, data flow, and
  network topology."
hide_table_of_contents: false
sidebar_position: 1
tags: ["paletteai-inference-launchpad", "architecture", "explanation"]
keywords: ["launchpad", "ai", "architecture", "kubernetes", "kairos", "helm", "data flow"]
---

<PartialsComponent category="paletteai-inference-launchpad" name="unreleased-banner" />

This page explains how PaletteAI Inference Launchpad works, how its components interact, and what key decisions shaped
the design. Use this page to build an understanding of the architecture before you deploy or operate PaletteAI Inference
Launchpad.

## Component Stack

The appliance serves each model through an inference engine, such as vLLM, running on its Kubernetes cluster. Each
loaded model is exposed as an OpenAI-compatible endpoint, such as `/v1/chat/completions` and `/v1/models`. For the
engine kinds the appliance supports and how it selects one, refer to [Inference Engines](./inference-engines.md).

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
name a model falls back to the default model. When you change the default model, the gateway rebuilds its router in
place. The gateway does not restart, and it does not drain requests that are in progress. Requests that the gateway
already routed continue on their assigned model, and the new default applies only to later requests.

Before it routes a request, the gateway authenticates the calling client from its API key and enforces that client's
quotas. For how clients, API keys, and quotas work together, refer to [Clients and Quotas](./clients-and-quotas.md).

## Network Topology

## Data Residency and Isolation
