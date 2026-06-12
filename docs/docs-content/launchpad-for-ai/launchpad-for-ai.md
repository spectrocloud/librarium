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

Launchpad for AI is a turnkey appliance for running large language models (LLMs) on your hardware. It deploys as an
image with no Palette or PaletteAI dependency. Once a model is loaded, inference runs on the appliance, so data stays in
your environment and per-token API costs become predictable infrastructure spend.

## The Problem It Solves

Cloud-hosted AI is not the right fit for enterprises that need to keep data on-premises whether to meet data residency,
regulatory compliance, and air-gapped network requirements, or to control latency and avoid per-token API costs.

Building an on-premises AI stack from scratch means assembling GPU compute, OS, Kubernetes, an LLM inference runtime,
authentication, RBAC, and observability. Launchpad for AI delivers the whole stack, pre-integrated, as a single bootable
artifact.

## What It Includes

| **Layer**             | **Technology**                                  | **Role**                                                                                                                                                                             |
| --------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Operating system      | [Kairos](https://kairos.io) on Ubuntu 24.04     | An immutable Linux OS built for appliance deployments. The read-only runtime prevents configuration drift and keeps the appliance in a known, reproducible state.                    |
| Orchestration         | Kubernetes                                      | Manages the lifecycle of containerized workloads on the appliance, including scheduling, scaling, and health recovery.                                                               |
| Packaging             | Helm charts                                     | Bundles the stack's components as versioned units so individual layers can be updated independently.                                                                                 |
| LLM inference runtime | vLLM                                            | Serves language models with high GPU throughput, designed for concurrent requests from multiple users.                                                                               |
| Intelligent routing   | Routing by task type and data sensitivity       | Directs each request to the most appropriate model. Requests that involve private data or require low latency stay local. Other requests can route outbound when the network allows. |
| Local models          | GLM, DeepSeek, Kimi                             | Open-weight models bundled with the appliance that run entirely on-premises, with no external API calls.                                                                             |
| Platform services     | Authentication, RBAC, monitoring, observability | Controls access and surfaces health and usage data, so the appliance behaves as a managed enterprise system rather than a raw inference server.                                      |
| GPU support           | NVIDIA                                          | Enables the parallel processing that large language models require to respond at production speed.                                                                                   |

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

- **Deploy the appliance:** Follow the [Get Started](/launchpad-for-ai/get-started) tutorial for a guided, step-by-step
  walkthrough.
- **Check hardware requirements:** Review the [Hardware Requirements](/launchpad-for-ai/hardware-requirements) reference
  before procuring or preparing your hardware.
- **Understand the architecture:** Read the [Architecture Overview](/launchpad-for-ai/architecture) for a deeper look at
  how the stack is structured internally.
