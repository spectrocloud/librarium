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

Usage counts reflect activity since the appliance gateway last restarted.

:::

<!--TODO: once these sibling pages publish, add a "Further reading" list here linking to: View Token Usage and Consumption Metrics (DOC-2925) for more detail on usage metrics; and the Usage Metrics Reference (DOC-2942) for every metric and field. -->

## Next Steps

- [Set and Manage Client Quotas](./manage-client-quotas.md)
- [Revoke or Delete a Client](./revoke-or-delete-a-client.md)
