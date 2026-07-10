---
sidebar_label: "Architecture Overview"
title: "Launchpad for AI Architecture Overview"
description:
  "An explanation of the Launchpad for AI architecture, including its component stack, data flow, and network topology."
hide_table_of_contents: false
sidebar_position: 1
tags: ["launchpad-for-ai", "architecture", "explanation"]
keywords: ["launchpad", "ai", "architecture", "kubernetes", "kairos", "helm", "data flow"]
---

<PartialsComponent category="launchpad-for-ai" name="unreleased-banner" />

This page explains how Launchpad for AI works, how its components interact, and what key decisions shaped the design.
Use this page to build an understanding of the architecture before you deploy or operate Launchpad for AI.

## Component Stack

The appliance serves each model through an inference engine, such as vLLM, running on its Kubernetes cluster. Each
loaded model is exposed as an OpenAI-compatible endpoint, such as `/v1/chat/completions` and `/v1/models`. The gateway
also exposes an Anthropic Messages API endpoint (`/v1/messages`), so Anthropic-format clients such as Claude Code
connect to the appliance directly, without a translation proxy. For the engine kinds the appliance supports and how it
selects one, refer to [Inference Engines](./inference-engines.md).

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

### Tier Maps

Clients that use Anthropic model names, such as Claude Code (which requests `claude-opus-…`, `claude-sonnet-…`, and
`claude-haiku-…`), do not know the names of the models served on the appliance. A tier map is the translation table
between them: each Claude alias points at one of the served models, and the gateway answers requests for that alias with
the mapped local model. The client behaves as if it is talking to Anthropic, while the appliance serves every request
locally.

The mapping is a property of the appliance and is applied automatically to every request. Clients do not choose the
backend model, and the same map applies to every token. An alias resolves only to a model the appliance currently
serves: if no served model backs an alias, requests for that alias fail until an operator brings a suitable model into
the serving state.

How the tiers are split follows how Claude Code uses them. Claude Code sends its main coding work to the Opus and Sonnet
tiers and quick background tasks to the Haiku tier, so a common split points Opus and Sonnet at a flagship model and
Haiku at a smaller, faster one.

{/* REDESIGN WATCH: verified against the live build, the tier map is appliance-wide and automatic — not per user and not
user-editable. An earlier design described per-user tier maps with user-editable, evaluation-gated tier rules (a rule
maps an alias only to an available model; edits that would regress the coding-agent evaluation are held with the reason
shown). If that editable / per-user model ships, restore it here and add a how-to for configuring it. */}

## Network Topology

## Data Residency and Isolation
