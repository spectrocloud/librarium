---
sidebar_label: "View Client Usage"
title: "View Client Usage"
description:
  "Step-by-step guidance for platform administrators on how to view per-client and per-token consumption on a PaletteAI
  Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 7
tags: ["paletteai-inference-launchpad", "clients", "usage", "how-to"]
keywords: ["launchpad", "ai", "clients", "usage", "tokens", "requests", "cost", "metrics"]
---

This guide explains how a platform administrator views consumption per client and per API token on a PaletteAI Inference
Launchpad appliance. To understand how usage relates to clients and quotas, refer to
[Clients and Quotas](../explanation/clients-and-quotas.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.
- One or more clients with API tokens. To create a client, refer to [Create a Client](./create-a-client.md).
- Console access with permission to view usage.

## View Usage by Client

1. From the left main menu, select **Usage**.

2. Select the **By client** tab.

3. Select a client.

The client view shows:

- Per-client totals for local input tokens, local output tokens, egress tokens, and egress cost.
- A per-token table with each token's label, prefix, status, last-used time, creation time, expiration, request count,
  input tokens, output tokens, total tokens, and cost.
- The percentage of each quota used, which indicates how much of each limit is still available.
- A conversation-routing breakdown that shows which models handled the client's requests.

:::info

The figures cover the period set in the **Data window** menu in the page header. When a figure cannot cover that whole
period, the card displays a note naming the span it does cover.

:::

## Further Reading

- [View Token Usage](./view-token-usage.md) covers the rest of the **Usage** page, including per-model usage and finding
  the top consumers.
- [Usage Metrics Reference](../reference/usage-metrics-reference.md) defines every metric, column, and export field.

## Next Steps

- [Set and Manage Client Quotas](./manage-client-quotas.md)
- [Revoke or Delete a Client](./revoke-or-delete-a-client.md)
