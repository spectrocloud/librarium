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
also exposes an Anthropic Messages API endpoint (`/v1/messages`), so Anthropic-format clients such as Claude Code connect
to the appliance directly, without a translation proxy.

## Appliance and Cluster Formation

## Model Provisioning Lifecycle

When you deploy a model, the appliance places it automatically on the best-fit node and brings it through a guarded
sequence of gate, provision, smoke-test, and ready stages. A model is routable only after its smoke test passes, shown
as `serving · smoke-test passed`, so the console never shows a model as ready before it is serving.

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

A tier map is set per user, so two users can route the same alias to different models. The gateway enforces two guard
rails on every tier edit:

- A rule can map an alias only to a model that is onboarded on the appliance. Mapping an alias to a model the appliance
  does not serve is rejected.
- Tier edits are evaluation-gated. The gateway holds a rule that would regress the coding-agent evaluation and shows the
  reason when you apply the change.

## Network Topology

## Data Residency and Isolation
