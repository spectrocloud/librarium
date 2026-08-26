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
start. Multi-server clusters are possible: you choose which nodes run each model when you deploy it. For that choice,
refer to [Model Placement](./model-placement.md).

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

Deploying a model is a guarded sequence. The appliance first previews the change so you can review it, and it writes
nothing until you confirm. It then brings the model through gate, provision, smoke-test, and ready stages. A model
becomes routable only after its signature is verified and its smoke test passes, so the appliance never presents a model
as ready before it can serve requests.

On a multi-server cluster, the appliance runs one inference engine per chosen node and exposes those engines through a
single per-model endpoint. The appliance treats unknown GPU capacity as unusable rather than as free. For how you choose
which nodes run a model, why a node may be ineligible, and how the Cluster view reports placement, refer to
[Model Placement](./model-placement.md).

The appliance does not support in-place replacement: changing what a node serves requires removing the current model and
then deploying the replacement. Removing the model from one node leaves it serving on the others. Refer to
[Replace a Model](../how-to-guides/replace-a-model.md).

## Request Routing

The gateway routes each request to a model. A request that names a model uses that model, and a request that does not
name a model falls back to the default model. When you change the default model, the gateway rebuilds its router in
place. The gateway does not restart, and it does not drain requests that are in progress. Requests that the gateway
already routed continue on their assigned model, and the new default applies only to later requests.

Before it routes a request, the gateway authenticates the calling client from its API token and enforces that client's
quotas. For how clients, API tokens, and quotas work together, refer to [Clients and Quotas](./clients-and-quotas.md).

When vision preprocessing is on, a request that includes images is rewritten before that routing step. A vision model
converts each image to text, and the text model then answers as it would for any other prompt. Text-only requests skip
this step. For the request path and how to turn the feature on, refer to
[Vision Preprocessing](./vision-preprocessing.md) and
[Enable Vision Preprocessing](../how-to-guides/enable-vision-preprocessing.md).

### The Default Model

The appliance sets the default model for you. The model you deploy during setup becomes the default, and if only one
model serves, that model is the default. The appliance does not switch the default to a different model on its own. When
the current default stops serving, the appliance raises an incident on the **Overview** page and offers a one-step fix
so you can switch the default to a model that is currently serving. For that procedure, refer to
[Switch the Default Model](../how-to-guides/set-the-default-model.md).

## Network Topology

## Data Residency and Isolation
