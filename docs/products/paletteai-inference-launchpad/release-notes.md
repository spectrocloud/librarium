---
sidebar_label: "Release Notes"
title: "PaletteAI Inference Launchpad Release Notes"
description: "Release notes for PaletteAI Inference Launchpad, including new features, improvements, and bug fixes."
hide_table_of_contents: false
sidebar_position: 50
tags: ["paletteai-inference-launchpad", "release-notes"]
keywords: ["launchpad", "ai", "release notes", "changelog"]
---

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

- Deploys a model to the cluster and places it on the best-fit node automatically, after a guarded preview, gate,
  provision, and smoke-test sequence. Refer to [Deploy a Model](./how-to-guides/deploy-a-model.md) for more information.

- Lets you set a default model that handles requests no routing rule matches, and rebuilds the router in place when you
  change it, without a gateway restart. Refer to [Set the Default Model](./how-to-guides/set-the-default-model.md) for
  more information.

- Exposes each model as an OpenAI-compatible endpoint and supports four engine kinds, vLLM, SGLang, Ollama, and
  llama.cpp, selected automatically or pinned per model. Refer to
  [Inference Engines](./explanation/inference-engines.md) for more information.

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
