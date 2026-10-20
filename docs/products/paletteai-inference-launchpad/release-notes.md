---
sidebar_label: "Release Notes"
title: "PaletteAI Inference Launchpad Release Notes"
description: "Release notes for PaletteAI Inference Launchpad, including new features, improvements, and bug fixes."
hide_table_of_contents: false
sidebar_position: 50
tags: ["paletteai-inference-launchpad", "release-notes"]
keywords: ["launchpad", "ai", "release notes", "changelog"]
---

## Version 1.2.0 - October 20, 2026 {#version-1-2-0}

PaletteAI Inference Launchpad 1.2.0 lets teams share one appliance. Each team gets a workspace with its own policy.
Models can share a GPU. Semantic routing rules now live in policies. Certified models ship as model recipes.

### New Features

- You can now manage access from the **Access & Policy** page. A platform administrator creates a workspace for each
  team. Each workspace follows a policy. People and groups get a role in a workspace. Refer to
  [Clients and Quotas](./explanation/clients-and-quotas.md#workspaces-and-access),
  [Create a Workspace](./how-to-guides/create-a-workspace.md),
  [Manage Workspace Members](./how-to-guides/manage-workspace-members.md),
  [Manage Users](./how-to-guides/manage-users.md), [Manage Groups](./how-to-guides/manage-groups.md), and
  [Access and Policy Reference](./reference/access-and-policy-reference.md) for more information.

- Models can now share a GPU. Each model in a GPU sharing group reserves part of the GPU memory. The **Deploy Model**
  wizard has three steps, **Model and placement**, **Serving**, and **GPU sharing**. The **Shared GPU memory** panel
  shows each model's share. You can also change the share of a running model. Refer to
  [GPU Sharing](./explanation/gpu-sharing.md),
  [Share a GPU Between Models](./how-to-guides/share-a-gpu-between-models.md), and
  [Deploy a Model](./how-to-guides/deploy-a-model.md) for more information.

- You now set semantic routing rules in a workspace policy. Each client can override them. The appliance-wide **Semantic
  routing** card is gone. The semantic router uses six categories and two complexity bands. Each rule also sets a
  reasoning depth. The semantic router runs on the appliance's GPUs and is on by default. Refer to
  [Routing Behavior](./explanation/routing-behavior.md),
  [Configure Semantic Routing](./how-to-guides/configure-semantic-routing.md), and
  [Semantic Routing Reference](./reference/semantic-routing-reference.md) for more information.

- The semantic router guard adds two checks. One refuses prompt attacks, such as jailbreak attempts. The other scans
  prompts for personal data before a request leaves the appliance. Both checks are on by default. Refer to
  [Semantic Router Guard](./explanation/semantic-router-guard.md) for more information.

- Decision recording saves one row for each request that the semantic router classifies. Use it to tune your routing
  rules. You turn it on per policy and can exclude clients. Refer to
  [Decision Recording](./explanation/routing-behavior.md#decision-recording) and
  [Configure Semantic Routing](./how-to-guides/configure-semantic-routing.md#turn-on-decision-recording-for-a-policy)
  for more information.

- Certified models now ship as model recipes. A recipe holds the model metadata file and the inference engine image. It
  does not hold the model weights. Use the new `--model-recipe` flag to download and upload a recipe. The `--metadata`
  flag still works. Refer to [Model Recipes](./explanation/model-recipes.md) and
  [Upload a Model](./how-to-guides/upload-a-model.md) for more information.

### Improvements

- Estimated cost now prices cached prompt tokens at a lower **Cache read** rate. You can change each rate under
  **Settings** > **Pricing**. Refer to [Usage Pricing](./explanation/usage-pricing.md) for more information.

  Expect a lower estimated cost on cache-heavy traffic, such as coding agents. One test workload measured about six
  times lower. This is not a metering error. Earlier releases priced cached tokens at the full input rate.

- The **Estimated savings** card compares your traffic against Anthropic Claude Opus 4.8 and OpenAI GPT-5. It now prices
  cached tokens at their cache rates. Savings on cache-heavy traffic are no longer overstated. Refer to
  [Estimated Savings](./explanation/estimated-savings.md) for more information.

- You now set up external inference endpoints only under **Integrations**. A policy or a client selects an endpoint that
  already exists. It can also override the endpoint's key. Requests no longer fall back to a local model without notice.
  External model targets appear as `<endpoint> / <model>` on every screen. Refer to
  [Register an External Inference Endpoint](./how-to-guides/register-an-external-inference-endpoint.md) for more
  information.

- A new reference page lists the open source components that ship under GNU licenses. Refer to
  [Open Source Licenses](./reference/oss-licenses.md) for more information.

### Upgrade

To upgrade a running appliance to 1.2.0, refer to [Upgrade the Platform](./how-to-guides/upgrade-the-platform.md).

## Version 1.1.3 - August 28, 2026 {#version-1-1-3}

PaletteAI Inference Launchpad 1.1.3 broadens what a single appliance can serve. Operators pick where each model runs and
let a semantic router pick which model handles each request. The appliance now takes image inputs, bursts to external
endpoints, and accepts models outside the certified catalog. Day-two operations gain in-place model replacement, and
1.1.3 ships the appliance's first security hardening pass.

### New Features

- **Node-targeted model deployment.** You can now select which nodes a model runs on when deploying to a multi-node
  cluster. Engines are created only on selected nodes, and unselected nodes receive none. Refer to
  [Deploy a Model](./how-to-guides/deploy-a-model.md) for more information.

- **Bring Your Own Model (BYOM).** You can now deploy models that are not part of the certified model catalog. Models
  deployed through the BYOM workflow serve inference requests the same way certified models do, but are not covered by
  Spectro Cloud's certification guarantees. Refer to [Bring Your Own Model](./how-to-guides/bring-your-own-model.md) for
  more information.

- **Vision preprocessing for text-only models.** You can now colocate a vision sidecar model on the same GPUs as a
  text-only flagship using time-slicing. When a request contains an image, the gateway routes it to the vision model,
  which returns a text description that replaces the image before the flagship processes it. Refer to
  [Vision Preprocessing](./explanation/vision-preprocessing.md) and
  [Enable Vision Preprocessing](./how-to-guides/enable-vision-preprocessing.md) for more information.

- **Register an external inference endpoint.** You can now register any OpenAI-compatible inference host as a box-wide
  egress target, then authorize each client and cap its daily spend. Traffic to a registered endpoint is metered as
  egress. Refer to [Register an External Inference Endpoint](./how-to-guides/register-an-external-inference-endpoint.md)
  for more information.

<!-- vale off -->

- **Semantic routing.** The appliance now routes every request through an on-box semantic router that picks a model from
  a category, **Coding** or **Everything else**, and a complexity band, **Simple** or **Complex**. The Tier map and the
  **Semantic routing** card remain separate controls in the console, and both accept per-client overrides. Refer to
  [Routing Behavior](./explanation/routing-behavior.md) and
  [Configure Semantic Routing](./how-to-guides/configure-semantic-routing.md) for more information.

<!-- vale on -->

- **Typed editor for JSON-valued engine arguments.** When an engine argument's value is a JSON document, the **Deploy
  model** panel now shows a typed editor with live validation, per-field type badges, byte sizes in readable units, and
  a one-select fix when a value is a quoted boolean or a quoted number. KV cache offloading is the first engine argument
  that uses this editor. Refer to
  [Review or Change an Engine Argument That Uses JSON](./how-to-guides/deploy-a-model.md#review-or-change-an-engine-argument-that-uses-json)
  for more information.

### Improvements

- **Model upgrade through replacement.** You can now upgrade a deployed model's weights or swap it for a different model
  version without a full redeployment. The platform deploys the new model first, waits for it to reach a ready state,
  and then removes the old model. Refer to [Replace a Model](./how-to-guides/replace-a-model.md) for more information.

- **Enhanced usage reporting and export.** The **Usage** view now supports flexible date filtering and CSV export for
  token consumption, cost, and client-level breakdowns. Refer to [View Token Usage](./how-to-guides/view-token-usage.md)
  and [View Client Usage](./how-to-guides/view-client-usage.md) for more information.

- **Security hardening.** This release addresses findings from a full security scan covering the operating system,
  Kubernetes, Dynamic Application Security Testing (DAST), Static Application Security Testing (SAST), penetration
  testing, and the Software Bill of Materials.

### Upgrade

To upgrade a running appliance to 1.1.3, refer to [Upgrade the Platform](./how-to-guides/upgrade-the-platform.md).

## Version 1.0.0 - July 21, 2026 {#version-1-0-0}

PaletteAI Inference Launchpad 1.0.0 is the first release. It is a standalone, turnkey AI appliance that turns your own
hardware into a private AI platform: boot a single image, load a model, and serve large language models (LLMs) in your
own environment, with no cloud dependency and no Palette or PaletteAI license required. Because inference runs on the
appliance, your data stays in your environment and per-token API costs become a fixed infrastructure cost. For a
conceptual introduction, refer to [What is PaletteAI Inference Launchpad?](./paletteai-inference-launchpad.md).

### Features

- Ships as a single bootable appliance with a pre-integrated stack: an immutable [Kairos](https://kairos.io) operating
  system on Ubuntu 24.04, Kubernetes, vLLM, intelligent request routing, and platform services for authentication,
  Role-Based Access Control (RBAC), monitoring, and observability. Refer to
  [Architecture](./explanation/architecture.md) for more information.

- Operates fully airgapped, with no outbound internet access required during installation or day-two operation.

- Installs from bare hardware to a running console from a Linux administrative workstation, using an interactive
  installer and a guided cluster wizard in the node Local UI. This release is tuned for a single-node topology. Refer to
  [Install the Appliance](./how-to-guides/install-the-appliance.md) for more information.

- Upgrades the platform from Local UI by uploading a newer content bundle from Artifact Studio and applying **Update**
  on the cluster configuration page. Refer to [Upgrade the Platform](./how-to-guides/upgrade-the-platform.md) for more
  information.

- Runs on a single high-density GPU server with NVIDIA or AMD GPUs, NVMe storage, and bonded NICs, sized to the target
  model from a baseline of 4 GPUs. Refer to [Suggested Hardware](./reference/hardware-requirements.md) for more
  information.

- Certifies a focused set of LLMs for coding-assistant use, GLM 5.2, DeepSeek v4 Pro, Kimi 2.7, and Gemma 4, and lets
  you bring your own model if it fits the available GPU memory. Refer to
  [Certified Models by Hardware](./reference/certified-models-by-hardware.md),
  [Model Certification](./explanation/model-certification.md), and
  [Bring Your Own Model](./how-to-guides/bring-your-own-model.md) for more information.

- Uploads models from the administrative workstation with the Palette CLI, which verifies checksums and supports
  resumable transfers. Refer to [Upload a Model](./how-to-guides/upload-a-model.md) for more information.

- Deploys a model to the cluster after a guarded preview, gate, provision, and smoke-test sequence. Refer to
  [Deploy a Model](./how-to-guides/deploy-a-model.md) for more information.

- Replaces a serving model by removing it from a node and then deploying a newer version or a different model. Refer to
  [Replace a Model](./how-to-guides/replace-a-model.md) for more information.

- Exposes each model as an OpenAI-compatible endpoint served by vLLM, the only supported engine kind, selected
  automatically or pinned per model. Refer to [Inference Engines](./explanation/inference-engines.md) for more
  information.

- Serves many clients from one appliance, each identified by API tokens prefixed `lpai_`. Refer to
  [Clients and Quotas](./explanation/clients-and-quotas.md) and [Create a Client](./how-to-guides/create-a-client.md)
  for more information.

- Enforces per-client quotas across requests, tokens, and cost over hour and day windows, and returns HTTP `429` when a
  limit is reached. Existing per-second and per-minute limits remain enforced. Refer to
  [Manage Client Quotas](./how-to-guides/manage-client-quotas.md) for more information.

- Grants every client access to all local models, and can burst to external frontier models. Refer to
  [Manage Client Model Access](./how-to-guides/manage-client-model-access.md) for more information.

- Reports quota utilization and historical consumption on the **Usage** page, including a **Quota Usage** tab, 24-hour,
  7-day, and 30-day data windows, and per-model and per-client breakdowns. Lets you raise a ceiling without zeroing
  usage, and revoke a token or delete a client at any time. Refer to
  [View Token Usage](./how-to-guides/view-token-usage.md), [View Client Usage](./how-to-guides/view-client-usage.md),
  and [Revoke or Delete a Client](./how-to-guides/revoke-or-delete-a-client.md) for more information.

- Computes estimated savings by comparing locally served token volume against a configurable frontier provider reference
  rate.

- Connects AI coding assistants directly to the appliance with ready-to-paste console snippets: Claude Code, Cursor,
  OpenAI Codex, and OpenCode. Refer to [Claude Code](./how-to-guides/use-claude-code.md),
  [Cursor](./how-to-guides/use-cursor.md), [OpenAI Codex](./how-to-guides/use-codex.md), and
  [OpenCode](./how-to-guides/use-opencode.md) for more information.

### Known Issues

- On some HPE servers, for example the DL380a Gen11, the GPUs do not enumerate on the PCI bus. Add `pci=realloc=off` to
  the GRUB kernel command line as a workaround. Refer to [Known Issues](./reference/known-issues.md) for the full
  procedure.

- Cursor routes only some request types to the appliance. Only Ask mode (chat) reaches a custom endpoint. Agent, Edit,
  and Tab remain locked to Cursor's own models. This is a limitation of the tool's bring-your-own-key support, not of
  the appliance. Refer to [Use Cursor](./how-to-guides/use-cursor.md) for more information.

- On Windows, model transfers require extra setup. The `palette content model download` and
  `palette content model upload` commands stream artifacts over `rsync` and SSH, so they need `rsync` 3.2.3 or later and
  OpenSSH 8.4 or later, which Windows does not ship by default. On Windows, only SSH key authentication works, because
  `--ssh-password` is supported on Unix administrative workstations only. Use a Linux administrative workstation for
  model transfers. Refer to [Model Upload Reference](./reference/model-upload-reference.md) for more information.
