---
id: overview
slug: /
title: What is PaletteAI Inference Launchpad?
description: >
  PaletteAI Inference Launchpad is a standalone, turnkey AI appliance that lets enterprises run large language models on
  their own hardware without cloud dependency, AI consulting, or complex infrastructure setup.
sidebar_label: Overview
sidebar_position: 1
tags:
  - paletteai-inference-launchpad
  - overview
  - explanation
keywords: ["launchpad", "ai", "bring your own model", "certified models", "appliance"]
---

PaletteAI Inference Launchpad turns your own hardware into a private AI platform. Boot the image, load a model, and you
are serving large language models (LLMs) in your own environment, with no cloud dependency, no AI consulting engagement,
and no weeks spent wiring together an inference stack.

Because inference runs on the appliance, your data never leaves your environment, and unpredictable per-token API bills
become a fixed, predictable infrastructure cost. The appliance deploys as a single bootable image with no Palette or
PaletteAI dependency.

## The Problem It Solves

Cloud-hosted AI is not the right fit for every enterprise. Data residency rules, regulatory compliance, air-gapped
networks, latency targets, and per-token API costs can all push inference back inside your own walls.

The catch is that building an on-prem AI stack from scratch means assembling GPU compute, an operating system,
Kubernetes, an LLM inference runtime, authentication, Role-Based Access Control (RBAC), and observability, and then
keeping it all working together. PaletteAI Inference Launchpad delivers the whole stack, pre-integrated, as a single
bootable artifact.

## Predictable AI Costs

Cloud AI services bill per token, so costs scale directly with usage and become difficult to budget at enterprise scale.
Running inference on your own hardware changes that billing model. Once the hardware is provisioned, inference cost is a
fixed infrastructure line item regardless of token volume, making AI spend predictable and independent of how heavily
the system is used.

## What Is Inside the Appliance

The appliance ships with the following pre-integrated components.

| **Layer**             | **Technology**                                  |
| --------------------- | ----------------------------------------------- |
| Operating system      | [Kairos](https://kairos.io) on Ubuntu 24.04     |
| Orchestration         | Kubernetes                                      |
| LLM inference runtime | vLLM                                            |
| Intelligent routing   | Routing by task type and data sensitivity       |
| Local models          | GLM, DeepSeek, Kimi, Gemma                      |
| Platform services     | Authentication, RBAC, monitoring, observability |
| GPU support           | NVIDIA, AMD                                     |

The OS layer runs Kairos on Ubuntu 24.04, an immutable Linux distribution designed for appliance deployments. Its
read-only runtime prevents configuration drift and keeps the appliance in a known, reproducible state. Kubernetes
manages the lifecycle of containerized workloads on top, handling scheduling, scaling, and health recovery.

vLLM serves language models with high GPU throughput and handles concurrent requests from many users. The appliance
ships with the ability to download one of these flagship open-weight models (GLM, DeepSeek, Kimi, or Gemma) and run it
entirely on your hardware with no external API calls. NVIDIA and AMD GPU support provides the parallel processing that
large language models require to respond at production speed. The certified models are a starting point rather than a
boundary, so you can also bring your own model and serve it alongside them. Bringing your own model means you author its
metadata and validate it on your hardware yourself, rather than starting from a configuration Spectro Cloud has already
tested.

Intelligent routing directs each request to the most appropriate model. Requests that involve private data or require
low latency stay local. Other requests can route outbound when the network allows.

Platform services cover authentication, RBAC, monitoring, and observability. These surface health and usage data and
ensure the appliance behaves as a managed enterprise system rather than a raw inference server. To understand how the
appliance identifies callers and meters their usage, refer to [Clients and Quotas](./explanation/clients-and-quotas.md).

The stack is packaged as Helm charts, which bundle each component as a versioned unit. You can update individual layers
independently without replacing the entire appliance image.

## PaletteAI Inference Launchpad or PaletteAI

PaletteAI Inference Launchpad and [PaletteAI](https://docs.palette-ai.com) are related but distinct products that serve
different scales and deployment models.

|                       | **PaletteAI Inference Launchpad**               | **PaletteAI**                                                           |
| --------------------- | ----------------------------------------------- | ----------------------------------------------------------------------- |
| **Form factor**       | Standalone appliance (bootable ISO)             | Software platform (Helm chart or All-in-One ISO on existing Kubernetes) |
| **Requires Palette?** | No                                              | Only if Palette also manages the underlying cluster                     |
| **Primary users**     | Platform engineering and IT teams               | Platform engineering teams                                              |
| **Scale**             | Single-site, on-prem, air-gapped                | Multi-cluster, multi-tenant, cloud and data center                      |
| **AI workload model** | Local LLM inference with optional cloud routing | Full AI factory: GPU-as-a-Service, Model-as-a-Service, AI Studio        |

## What PaletteAI Inference Launchpad Is Not

- Not a managed cloud service. You own and operate the appliance.
- Not a Palette add-on. No Palette tenant or license required.
- Not a general-purpose Kubernetes platform. It is for LLM inference only.

## Explore the Documentation

Whatever brought you here, these are the fastest paths in.

- **Get started**: [Suggested Hardware](./reference/hardware-requirements.md) •
  [Install the appliance](./how-to-guides/install-the-appliance.md) •
  [Upload a model](./how-to-guides/upload-a-model.md) • [Deploy your first model](./how-to-guides/deploy-a-model.md)
- **Understand the product**: [Architecture](./explanation/architecture.md) •
  [Model Placement](./explanation/model-placement.md) • [Vision Preprocessing](./explanation/vision-preprocessing.md) •
  [Clients and Quotas](./explanation/clients-and-quotas.md) •
  [Model Certification](./explanation/model-certification.md) • [Inference Engines](./explanation/inference-engines.md)
- **Connect your coding tools**: [Claude Code](./how-to-guides/use-claude-code.md) •
  [Cursor](./how-to-guides/use-cursor.md) • [OpenAI Codex](./how-to-guides/use-codex.md) •
  [OpenCode](./how-to-guides/use-opencode.md)
- **Operate day to day**: [Create a client](./how-to-guides/create-a-client.md) •
  [Enable vision preprocessing](./how-to-guides/enable-vision-preprocessing.md) •
  [Set client quotas](./how-to-guides/manage-client-quotas.md) •
  [View client usage](./how-to-guides/view-client-usage.md) •
  [Revoke or delete a client](./how-to-guides/revoke-or-delete-a-client.md)
- **Look something up**: [Glossary](./reference/glossary.md) •
  [Certified models by hardware](./reference/certified-models-by-hardware.md) •
  [Known issues](./reference/known-issues.md) • [Release notes](./release-notes.md)

## How This Documentation Is Organized

- **[Tutorials](./tutorials/tutorials.md)** are learning-oriented lessons that guide you through a complete, working
  example from start to finish.
- **[How-to guides](./how-to-guides/how-to-guides.md)** are task-oriented and assume you know what you want to do, then
  give you the steps to get there.
- **[Reference](./reference/reference.md)** is information-oriented. It describes what exists and how it is configured
  when you need to look something up.
- **[Explanation](./explanation/explanation.md)** is understanding-oriented. It covers design decisions, component
  relationships, and trade-offs.

## Project and Community

PaletteAI Inference Launchpad is built by [Spectro Cloud](https://www.spectrocloud.com), and there is a friendly
community around it that we would love you to be part of. Share what you are building, ask questions, and swap tips with
other builders and the people who make the product.

:::info

Visit the [Spectro Cloud community](https://www.spectrocloud.com/community) to connect with fellow users, follow the
open source projects behind the appliance, and stay in the loop on what is next.

:::

## Commercial Support

Planning a production rollout, or want to talk through your hardware and model choices with an expert? Learn more about
plans and support on the [PaletteAI Inference Launchpad](https://www.spectrocloud.com/platform/inference-launchpad)
product page.
