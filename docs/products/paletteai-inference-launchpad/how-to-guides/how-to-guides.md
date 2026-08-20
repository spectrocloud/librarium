---
sidebar_label: "How-to Guides"
title: "PaletteAI Inference Launchpad How-to Guides"
description:
  "Step-by-step guides for completing specific operational tasks on a running PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 0
tags: ["paletteai-inference-launchpad", "how-to"]
---

How-to guides get a specific job done on a running appliance. They assume you know what you want to accomplish and give
you the steps to do it without teaching background concepts.

## Contents

| **Guide**                                                         | **What you do**                                                                      |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Install the Appliance](./install-the-appliance.md)               | Flash the installer ISO, boot the hardware, and bring up the appliance console.      |
| [Deploy a Model](./deploy-a-model.md)                             | Deploy an LLM to the cluster and verify it is serving.                               |
| [Upload a Model](./upload-a-model.md)                             | Download a model on a jumpbox and upload it to the appliance.                        |
| [Bring Your Own Model](./bring-your-own-model.md)                 | Author metadata for a model that is not certified, then upload and deploy it.        |
| [Switch the Default Model](./set-the-default-model.md)            | Switch the default model when the current default becomes unavailable.               |
| [Enable Vision Preprocessing](./enable-vision-preprocessing.md)   | Deploy a vision model and turn on image-to-text preprocessing for a text-only model. |
| [Create a Client](./create-a-client.md)                           | Create a client and issue its first API token.                                       |
| [Generate an API Token](./generate-an-api-token.md)               | Create an API token that clients use to authenticate to the appliance.               |
| [Set and Manage Client Quotas](./manage-client-quotas.md)         | Set, edit, and remove a client's request, token, and cost limits.                    |
| [Manage a Client's Model Access](./manage-client-model-access.md) | Route a client to models and allow it to reach external models.                      |
| [View Token Usage](./view-token-usage.md)                         | Find token usage by model and by client, and open the metrics dashboards.            |
| [View Client Usage](./view-client-usage.md)                       | View a client's per-token consumption, requests, and cost.                           |
| [Revoke or Delete a Client](./revoke-or-delete-a-client.md)       | Find expired keys, revoke a token, or delete a client.                               |
| [Use Claude Code](./use-claude-code.md)                           | Connect Claude Code to the appliance so a local model serves each request.           |
| [Use Cursor](./use-cursor.md)                                     | Connect Cursor's Ask mode to the appliance through a uniquely named model alias.     |
| [Use OpenAI Codex](./use-codex.md)                                | Connect the OpenAI Codex CLI to the appliance with a custom model provider.          |
| [Use OpenCode](./use-opencode.md)                                 | Connect the OpenCode terminal agent to the appliance through a custom provider.      |
