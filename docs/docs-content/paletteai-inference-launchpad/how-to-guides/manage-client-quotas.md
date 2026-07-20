---
sidebar_label: "Set and Manage Client Quotas"
title: "Set and Manage Client Quotas"
description:
  "Step-by-step guidance for platform administrators on how to set, edit, and remove usage quotas on a client on a
  PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 5
tags: ["paletteai-inference-launchpad", "clients", "quotas", "how-to"]
keywords: ["launchpad", "ai", "clients", "quota", "rate limit", "requests", "tokens", "cost", "429"]
---

This guide explains how a platform administrator sets and manages usage quotas on a client on a PaletteAI Inference
Launchpad appliance. A quota limits how much a client consumes. A quota applies to the client, so every API token that
belongs to the client draws on the same limits. To understand how quotas fit with clients and API tokens, refer to
[Clients and Quotas](../explanation/clients-and-quotas.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.
- An existing client. To create one, refer to [Create a Client](./create-a-client.md).
- Console access with permission to manage clients. Managing clients can require operator access.

## Set a Client Quota

1. From the left main menu, select **Access & Policy**.

2. On the **Clients & API tokens** page, select the client to open its detail panel.

3. Select the **Quotas** section.

4. Select **Add window limit**.

5. Choose the dimension to limit: **requests**, **tokens**, or **cost**.

6. Choose the window the limit applies over: **second**, **minute**, **hour**, or **day**.

7. Enter the limit for that dimension and window.

8. Repeat the previous steps for each limit you want. For example, add a requests-per-minute limit, a tokens-per-day
   limit, and a cost-per-day limit.

9. Save the client.

Each row limits one dimension over one window. A window with no row stays uncapped.

## Edit or Remove a Quota

1. From the left main menu, select **Access & Policy**.

2. On the **Clients & API tokens** page, select the client to open its detail panel.

3. Select the **Quotas** section.

4. Change a limit, or remove a window-limit row.

5. Save the client.

## Next Steps

- [Manage a Client's Model Access](./manage-client-model-access.md)
- [View Client Usage](./view-client-usage.md)
