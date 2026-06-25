---
id: overview
title: What is Launchpad for AI?
description: >
  Launchpad for AI is a standalone, turnkey AI appliance that lets enterprises run large language models on-premises
  without cloud dependency, AI consulting, or complex infrastructure setup.
sidebar_label: Overview
sidebar_position: 1
tags:
  - launchpad-for-ai
  - overview
  - explanation
---

<PartialsComponent category="launchpad-for-ai" name="unreleased-banner" />

Launchpad for AI is a turnkey appliance for running large language models (LLMs) on your hardware. It deploys as an
image with no Palette or PaletteAI dependency. Once a model is loaded, inference runs on the appliance, so data stays in
your environment and per-token API costs become predictable infrastructure spend.

## The Problem It Solves

Cloud-hosted AI is not the right fit for enterprises that need to keep data on-premises, whether to meet data residency,
regulatory compliance, and air-gapped network requirements, or to control latency and avoid per-token API costs.

Building an on-premises AI stack from scratch means assembling GPU compute, OS, Kubernetes, an LLM inference runtime,
authentication, Role-Based Access Control (RBAC), and observability. Launchpad for AI delivers the whole stack,
pre-integrated, as a single bootable artifact.

## Predictable AI Costs

Cloud AI services bill per token, so costs scale directly with usage and become difficult to budget at enterprise scale.
Running inference on-premises changes that billing model. Once the hardware is provisioned, inference cost is a fixed
infrastructure line item regardless of token volume, making AI spend predictable and independent of how heavily the
system is used.

## What It Includes

The appliance ships with the following pre-integrated components.

| **Layer**             | **Technology**                                  |
| --------------------- | ----------------------------------------------- |
| Operating system      | [Kairos](https://kairos.io) on Ubuntu 24.04     |
| Orchestration         | Kubernetes                                      |
| LLM inference runtime | vLLM                                            |
| Intelligent routing   | Routing by task type and data sensitivity       |
| Local models          | GLM, DeepSeek, Kimi                             |
| Platform services     | Authentication, RBAC, monitoring, observability |
| GPU support           | NVIDIA                                          |

The OS layer runs Kairos on Ubuntu 24.04, an immutable Linux distribution designed for appliance deployments. Its
read-only runtime prevents configuration drift and keeps the appliance in a known, reproducible state. Kubernetes
manages the lifecycle of containerized workloads on top, handling scheduling, scaling, and health recovery.

vLLM serves language models with high GPU throughput and handles concurrent requests from multiple users. The appliance
ships GLM, DeepSeek, and Kimi as local open-weight models that run entirely on-premises with no external API calls.
NVIDIA GPU support provides the parallel processing that large language models require to respond at production speed.

Intelligent routing directs each request to the most appropriate model. Requests that involve private data or require
low latency stay local. Other requests can route outbound when the network allows.

Platform services cover authentication, RBAC, monitoring, and observability. These surface health and usage data and
ensure the appliance behaves as a managed enterprise system rather than a raw inference server.

The stack is packaged as Helm charts, which bundle each component as a versioned unit. You can update individual layers
independently without replacing the entire appliance image.

## Launchpad for AI or PaletteAI

Launchpad for AI and [PaletteAI](https://docs.palette-ai.com) are related but distinct products that serve different
scales and deployment models.

|                       | **Launchpad for AI**                            | **PaletteAI**                                                           |
| --------------------- | ----------------------------------------------- | ----------------------------------------------------------------------- |
| **Form factor**       | Standalone appliance (bootable ISO)             | Software platform (Helm chart or All-in-One ISO on existing Kubernetes) |
| **Requires Palette?** | No                                              | Only if Palette also manages the underlying cluster                     |
| **Primary users**     | Platform engineering and IT teams               | Platform engineering teams                                              |
| **Scale**             | Single-site, on-premises, air-gapped            | Multi-cluster, multi-tenant, cloud and data center                      |
| **AI workload model** | Local LLM inference with optional cloud routing | Full AI factory: GPU-as-a-Service, Model-as-a-Service, AI Studio        |

## What Launchpad for AI Is Not

- Not a managed cloud service. You own and operate the appliance.
- Not a Palette add-on. No Palette tenant or license required.
- Not a general-purpose Kubernetes platform. It is for LLM inference only.

## Next Steps

- **Check hardware requirements:** Review the [Hardware Requirements](/launchpad-for-ai/reference/hardware-requirements)
  reference before procuring or preparing your hardware.
- **Install the appliance:** Follow the
  [Install the Launchpad for AI Appliance](/launchpad-for-ai/how-to-guides/install-the-appliance) guide to go from bare
  hardware to a running appliance with the UI accessible.
- **Run your first model:** Follow the [Run Your First Model](/launchpad-for-ai/tutorials/run-first-model) tutorial to
  deploy a model and send your first prompt.
