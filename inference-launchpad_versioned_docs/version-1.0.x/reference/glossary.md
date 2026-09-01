---
id: glossary
title: "PaletteAI Inference Launchpad Glossary"
description:
  "Definitions of the key AI, product, and platform terms used across the PaletteAI Inference Launchpad documentation."
sidebar_label: "Glossary"
sidebar_position: 1
toc_max_heading_level: 2
tags: ["paletteai-inference-launchpad", "reference", "glossary"]
keywords:
  ["launchpad", "ai", "glossary", "definitions", "terms", "llm", "inference", "quota", "client", "token", "appliance"]
---

This glossary defines the key AI, product, and platform terms used across the PaletteAI Inference Launchpad
documentation. Use it to look up an unfamiliar term without leaving the guide you are reading.

**Go to:** [A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [H](#h) · [I](#i) · [J](#j) · [K](#k) · [L](#l) ·
[M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [V](#v)

## A

### Administrative Workstation

A separate Linux machine, also called a jumpbox, that an operator uses to reach the appliance for installation,
post-installation validation, and day-two operations with tools such as `kubectl`. It is not part of the appliance
itself. Refer to [Suggested Hardware](./hardware-requirements.md).

### Air-Gapped

Describes a deployment that has no direct or indirect connection to the internet or other outside networks. The
appliance is designed to run air-gapped, requiring no outbound internet access during normal operation.

### API Token

A credential that authenticates requests to the appliance's inference endpoint. Every request carries its token in the
`Authorization` header, and tokens issued by the appliance begin with the prefix `lpai_`. Each token belongs to a
[client](#client), can be given an expiration, and inherits that client's [quotas](#quota). Refer to
[Clients and Quotas](../explanation/clients-and-quotas.md).

### Appliance

The self-contained PaletteAI Inference Launchpad unit: a single server that ships as a bootable image and runs the
operating system, orchestration, inference engine, and management UI as one pre-integrated stack. It deploys with no
Palette or PaletteAI dependency.

### Appliance Console

The web UI served by the appliance, sometimes referred to as the admin UI. Platform [operators](#operator) use it to
deploy models, create clients, issue API tokens, set quotas, and view usage.

## B

### BMC

The baseboard management controller, a server's out-of-band management interface, available on enterprise servers under
vendor names such as iDRAC on Dell, iLO on Hewlett Packard Enterprise (HPE), or IPMI as an open standard. Operators use
the BMC to power the server on and off remotely, view console output during boot, and mount
[virtual media](#virtual-media), which serves as the fallback for ISO boot when a USB stick is not available.

### Bond

An aggregated network interface, typically `bond0`, that combines two physical NICs into a single logical link. The
appliance carries cluster traffic and [Piraeus](#piraeus) storage replication over a bond so both share the aggregated
bandwidth of the data NICs, using dynamic Link Aggregation (802.3ad) and LACP. Refer to
[Install the Appliance](../how-to-guides/install-the-appliance.md#create-a-bond).

## C

### Central Mode

A deployment mode in which the appliance's built-in inference engine is turned off and the [gateway](#launchpad-gateway)
is managed by [PaletteAI](#paletteai). PaletteAI handles model deployment through its model-as-a-service flow, while the
gateway continues to handle routing, [token metering](#token-metering), quota control, and the UI.

{/* NEEDS REVIEW: central mode is defined in the source glossary but is not yet referenced in any shipped PAIIL doc. Confirm it is a user-facing term for GA before publishing. */}

### Certified Model

A model that Spectro Cloud has validated to run correctly on the listed GPU configuration, based on its own testing
rather than public benchmarks. Refer to [Model Certification](../explanation/model-certification.md) and
[Certified Models by Hardware](./certified-models-by-hardware.md).

### Chargeback

The practice of tracking token and dollar spend per [client](#client) so that an organization can allocate AI
infrastructure costs back to the teams or workloads that consumed them. Per-client [metering](#token-metering) is what
makes chargeback possible.

{/* NEEDS REVIEW: chargeback is defined in the source glossary but does not yet appear in any shipped PAIIL doc. Confirm the term and framing with an SME before publishing. */}

### Client

The identity the appliance uses to recognize who is sending a request, and the unit of both access and accounting. The
appliance attributes every request to exactly one client and measures every quota and usage metric per client. A client
is more often a workload, such as an AI [coding assistant](#coding-assistant), an internal chatbot, or a data pipeline,
than a person. Each client holds one or more [API tokens](#api-token), its own [quotas](#quota), and its own usage
visibility. Refer to [Clients and Quotas](../explanation/clients-and-quotas.md).

### Cluster

One or more [nodes](#node) operating together as the appliance. A single-node cluster acts as both control plane and
worker; a multi-node cluster distributes those roles across nodes linked through [Linked Edge Hosts](#linked-edge-hosts)
and uses an odd number of control-plane nodes for high availability.

### CMVP

The Cryptographic Module Validation Program, run jointly by NIST and the Canadian Centre for Cyber Security, which
certifies cryptographic modules against [FIPS](#fips) 140-3. Public-sector deployments may require appliance components
to run in CMVP-validated configurations.

### Coding Assistant

An AI development tool, such as Claude Code, Cursor, OpenAI Codex, or OpenCode, that sends its requests to a model.
Coding assistants are the primary workloads the appliance is tuned for; each one connects to the appliance as a
[client](#client) instead of to a cloud provider.

### Content Bundle

A compressed archive, larger than 20 GB, containing the appliance's platform and application software. Operators upload
the bundle to the node through [Local UI](#local-ui) or the Palette CLI as part of installation. The bundle does not
include LLM [model weights](#model-weights), which ship as a separate artifact and are uploaded independently through
the CLI.

### Context Window

The maximum number of tokens a model can process in a single request, counting the prompt and the response together.
Different models have different context window sizes.

## D

### Default Model

The model the appliance routes a request to when the request does not name a specific model. Refer to
[The Default Model](../explanation/architecture.md#the-default-model).

## E

### Egress

A client's ability to send requests off the appliance to an [external, or frontier, model](#frontier-model). Egress
denies by default: a new client cannot reach external providers until an operator enables it. Refer to
[Manage Client Model Access](../how-to-guides/manage-client-model-access.md).

### Embedding

A numerical representation of text, or other data, as a vector in a high-dimensional space, letting a system compare
inputs by meaning rather than by exact wording. The appliance uses embeddings internally in its
[intelligent routing](#intelligent-routing) layer to classify requests by semantic similarity.

### Endpoint

The network location, expressed as a URL path, at which the appliance exposes a served model or an API. Each loaded
model is exposed as an [OpenAI-compatible endpoint](#openai-compatible-api) at paths such as `/v1/chat/completions`.

## F

### FIPS

The U.S. Federal Information Processing Standards, a suite of government security standards. FIPS 140 covers
cryptographic modules and is relevant to public-sector deployments; refer to [CMVP](#cmvp), which validates modules
against FIPS 140-3.

### Follower

In a multi-node cluster, a node that joins the [leader](#leader) through [Linked Edge Hosts](#linked-edge-hosts).
Followers run the same OS and packs as the leader and take on their share of the cluster's workload once linking
completes.

### Frontier Model

A cloud-hosted, state-of-the-art model reached through an external provider's API rather than served on the appliance.
The appliance can route to a frontier model when [egress](#egress) is enabled and routing policy calls for it. Frontier
usage incurs per-token API costs, unlike a [local model](#local-model).

## H

### Helm and Helm Chart

Helm is the packaging format used to deploy and configure the software components inside the appliance's Kubernetes
cluster, and a Helm chart is one such package. The appliance's components, including the gateway, are delivered as Helm
charts, so individual layers can be updated independently.

## I

### Inference

The process of running a trained model to generate a response or prediction from a given input. Serving inference on
your own hardware is the core purpose of the appliance: once a model is loaded, each [prompt](#prompt) is answered
locally rather than by a cloud provider.

### Inference Engine

The runtime that loads a model and serves its requests behind the model's endpoint. It determines how a model runs,
which hardware it can use, and which serving features are available. The appliance selects an engine automatically by
default. [vLLM](#vllm) is the only currently supported kind; other kinds may be added in future releases. Refer to
[Inference Engines](../explanation/inference-engines.md).

### Intelligent Routing

The capability that directs each request to the most appropriate model, [local](#local-model) or
[frontier](#frontier-model), based on rules an operator configures. Routing decisions can consider the request's
content, the API token used, cost policy, or semantic classification, so routine work runs on local models and frontier
models are used only when policy demands.

### Interactive Installer

The Palette Edge installer that runs from the [slim ISO](#slim-iso) and writes the immutable [Kairos](#kairos)-based
operating system to the local disk. The installer inspects every disk on the host, blocks the install if any disk still
holds Kairos partitions from a prior install, and provides an in-flow wipe-all-disks option so the reader does not have
to drop to a shell.

## J

### jumpbox

An informal name for the [administrative workstation](#administrative-workstation), a separate Linux machine, distinct
from the appliance itself, on which operators install the Palette CLI and from which they drive installation and day-two
operations against the appliance nodes.

## K

### Kairos

The immutable, image-based Linux operating system that the appliance runs on. Kairos is designed for edge and appliance
deployments, and its read-only runtime prevents configuration drift. It is the foundation on which Kubernetes runs
inside the appliance.

### Kubernetes

The orchestration layer that runs inside the appliance and manages the lifecycle of its containerized workloads,
including scheduling, scaling, and health recovery. It runs on top of [Kairos](#kairos).

### KV Cache

The key-value cache that an [inference engine](#inference-engine) keeps in GPU and host memory while generating a
response, holding the intermediate state for the tokens processed so far. Its size drives much of the appliance's memory
and fast-storage requirements.

## L

### Large Language Model (LLM)

A model trained on large amounts of text that can generate, summarize, translate, and reason over natural language. LLMs
are the models that PaletteAI Inference Launchpad is built to host and serve on-premises.

### Launchpad Gateway

The proxy component that sits in front of the inference engine and handles every request. The gateway authenticates the
calling [client](#client) from its [API token](#api-token), enforces that client's [quotas](#quota), meters usage, and
routes the request to a local or frontier model. Refer to [Architecture Overview](../explanation/architecture.md).

### Leader

In a multi-node cluster, the node whose [Local UI](#local-ui) generates the token that [followers](#follower) present to
join. The leader remains part of the control plane after linking. Use an odd number of control-plane nodes for high
availability.

### Linked Edge Hosts

The [Local UI](#local-ui) feature that joins nodes to the [leader](#leader) using a Base64-encoded token containing the
leader's IP address and a one-time password ([OTP](#otp)) valid for two minutes. Content synchronizes automatically
across every linked host once the group is formed.

### Local Mode

A deployment mode in which the appliance operates as a fully standalone unit, with the inference engine enabled and all
features active. This is the mode used for a standalone appliance without [PaletteAI](#paletteai).

{/* NEEDS REVIEW: local mode is defined in the source glossary but is not yet referenced in any shipped PAIIL doc. Confirm it is a user-facing term for GA before publishing. */}

### Local Model

A model deployed and served directly on the appliance's own hardware. Local inference keeps data on-premises and avoids
the per-token API costs of a [frontier model](#frontier-model). Every client can call every local model; the appliance
meters and limits usage through quotas but does not gate access.

### Local UI

The web console the appliance's edge OS serves on TCP port `5080` at `https://<node-ip>:5080`, used to create the
[bond](#bond), link nodes, upload the [content bundle](#content-bundle), and deploy the cluster. Distinct from the
[appliance console](#appliance-console) that the running cluster serves once installation completes.

## M

### Model

In the PaletteAI Inference Launchpad context, a large language model that the appliance serves. Each served model is
exposed as an [OpenAI-compatible endpoint](#openai-compatible-api) and records its name, backend engine, and current
serving status. The appliance turns a model off when a [quota](#quota) that covers it is exhausted.

### Model Alias

An alternate name under which a model is served, so a [coding assistant](#coding-assistant) can request a model by a
name it recognizes, such as an Anthropic or OpenAI model id. Some tools require a unique alias rather than a name that
collides with their own catalog.

### Model Metadata

A small YAML file, `metadata.yaml`, one per model, that describes how the Palette CLI should fetch the model's weights
from Hugging Face and upload them to the appliance. The metadata is downloaded from Artifact Studio, or from the
`launchpad-ai` repository, alongside the ISO and content bundle.

### Model Weights

The trained parameters of a model, shipped as a separate binary artifact from the software. Weights can be large, on the
order of hundreds of gigabytes for a larger model, which is why the appliance sizes fast storage around them. Their
[quantization](#quantization) affects how much space they occupy.

### ModelGroupQuota

The internal Kubernetes custom resource that represents a [quota](#quota) budget on the appliance's cluster. It selects
the models it covers with label selectors and tracks usage across every dimension and time window. Operators interact
with quotas through the [appliance console](#appliance-console); ModelGroupQuota is the underlying enforcement object.

{/* NEEDS REVIEW: ModelGroupQuota is an internal CRD name from the source glossary and does not appear in any shipped PAIIL doc. Confirm whether it should be exposed to readers before publishing. */}

## N

### Node

A single machine in the appliance's Kubernetes cluster. When you deploy a model, the appliance places it automatically
on the best-fit node, the node with the most free GPUs that still fit the model. Most appliances are a single
high-density GPU server, so they have a single node.

## O

### On-Premises

Describes running the appliance on hardware you own and operate, inside your own environment, rather than as a cloud
service. Running inference on-premises keeps data in your environment and turns per-token API costs into predictable
infrastructure spend.

### OpenAI-Compatible API

The request and response format that the appliance exposes for each served model, matching the widely supported OpenAI
API, at paths such as `/v1/chat/completions` and `/v1/models`. Because the interface is OpenAI-compatible, existing
tools can point at the appliance by changing only the base URL and the API token.

### Operator

The person who administers the appliance, also referred to as a platform operator or administrator. Operators deploy
models, create clients, issue tokens, and set quotas through the [appliance console](#appliance-console).

### OTP

One-time password. A short-lived credential embedded in the Base64-encoded token that a multi-node cluster's
[leader](#leader) emits during [Linked Edge Hosts](#linked-edge-hosts) linking. The OTP is valid for two minutes, after
which the leader must issue a fresh token.

## P

### Pack

A unit of software the cluster installs as part of a cluster profile, such as `piraeus-operator` or
`nvidia-gpu-operator-ai`. The PaletteAI Inference Launchpad profile bundles the edge OS, [Kubernetes](#kubernetes),
[Piraeus](#piraeus) storage, networking, ingress, observability, and the PaletteAI Inference Launchpad application as
packs. The exact pack list is defined by the profile and can change between releases.

### PaletteAI

Spectro Cloud's multi-cluster AI platform for the AI factory, offering GPU-as-a-Service, model-as-a-service, and AI
Studio at data-center scale. It is a distinct product from PaletteAI Inference Launchpad, which is a standalone
appliance that requires no PaletteAI dependency. Refer to
[What is PaletteAI Inference Launchpad?](../paletteai-inference-launchpad.md).

### Palette TUI

The text-based console on the appliance node itself, used after the [interactive installer](#interactive-installer)
reboots the node to set the initial administrator credentials, hostname, static IP, DNS, and NTP. To re-enter the
Palette TUI after quitting, run `palette-tui` on the node.

### Piraeus

The storage layer inside the appliance that provisions and manages the volumes used for [model weights](#model-weights)
and the [KV cache](#kv-cache). Piraeus stripes a data pool across the appliance's NVMe drives to combine their read and
write bandwidth.

### Prompt

The input text sent to a model to elicit a response. A prompt consumes input [tokens](#token-and-tokenization).

## Q

### Quantization

A technique that stores a model's weights at a lower numeric precision to reduce its memory footprint and speed up
inference, usually with little loss in quality. `FP8`, an 8-bit floating-point format referenced in the hardware
requirements, is one such precision.

### Quota

A consumption limit attached to a [client](#client), enforced across three dimensions: requests (the number of calls),
tokens (the number of tokens processed), and cost (the computed dollar spend). Each dimension is measured over rolling
windows of one second, one minute, one hour, and one day; there is no monthly window. When a client reaches a limit, the
appliance rejects further requests with HTTP `429 Too Many Requests` until the window rolls over. Refer to
[Manage Client Quotas](../how-to-guides/manage-client-quotas.md).

{/* NEEDS REVIEW: per the current working assumption, quota enforcement is off by default behind a global switch. Confirm with an SME before publishing. */}

## R

### Rate Limit

A [quota](#quota) on the number of requests per unit of time, such as 60 requests per minute. Rate limits are the
request-dimension quotas enforced over short windows.

### Reasoning

The ability of some models to work through a problem in intermediate steps before producing a final answer. A model that
does this is called a reasoning model, and the depth of that effort can sometimes be tuned. Reasoning steps consume
[tokens](#token-and-tokenization) like any other output.

## S

### Slim ISO

The small (approximately 1.5 GB) bootable installer image that contains the appliance's operating system, provisioning
agent, and web console. Operators boot the node from the slim ISO, either flashed to a USB drive or mounted through the
[BMC](#bmc) as [virtual media](#virtual-media). The [interactive installer](#interactive-installer) writes the OS to the
local disk.

### Smoke Test

A short check the appliance runs against a newly deployed model before it accepts traffic. A model becomes routable only
after its signature is verified and its smoke test passes, so the appliance never presents a model as ready before it
can serve requests.

### STIG

The Security Technical Implementation Guides published by the U.S. Defense Information Systems Agency (DISA), which
prescribe hardened configurations for information systems. STIG compliance is required for certain U.S. Department of
Defense deployments.

## T

### Tier Map

A routing overlay that governs which model handles a client's requests by default, mapping an incoming model name or
alias to a served model. It selects the default target for a client's requests rather than acting as a hard access gate
for local models. Refer to [Manage Client Model Access](../how-to-guides/manage-client-model-access.md).

### Token and Tokenization

A token is the unit of text that a model processes, roughly a word or a word fragment; tokenization is the process of
splitting text into those units. Tokens are the primary unit of measurement for model usage and cost, and one of the
dimensions a [quota](#quota) can limit. Both input tokens from your prompt and output tokens from the model's response
are counted.

### Token Metering

The process of counting and tracking token consumption per request, per model, per [API token](#api-token), and per time
window. The appliance meters input tokens, output tokens, and derived cost for every request, which is what enforces
[quotas](#quota), gives operators usage visibility, and enables [chargeback](#chargeback).

## V

### VIP

A single IP address that resolves to whichever cluster node currently holds the control-plane role, so a multi-node
cluster presents one stable endpoint even as individual nodes fail over. Configured in the cluster-creation wizard.

### Virtual Media

The mechanism by which a server's [BMC](#bmc) presents a remote ISO to the host as if it were a locally attached optical
drive or USB stick. Virtual media is the fallback for booting the [slim ISO](#slim-iso) when USB boot is not available.

### vLLM

An open source, high-throughput [inference engine](#inference-engine) for large language models. vLLM is one of the
GPU-serving engines the appliance can run, exposing an [OpenAI-compatible endpoint](#openai-compatible-api) on the
Kubernetes cluster.
