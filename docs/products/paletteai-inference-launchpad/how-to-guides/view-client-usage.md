---
sidebar_label: "View Client Usage"
title: "View Client Usage"
description:
  "Step-by-step guidance for platform administrators on how to view quota utilization, historical consumption, and
  per-token usage on a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 7
tags: ["paletteai-inference-launchpad", "clients", "usage", "how-to"]
keywords: ["launchpad", "ai", "clients", "usage", "tokens", "requests", "cost", "metrics", "quota", "utilization"]
---

This guide explains how a platform administrator views consumption and quota utilization on a PaletteAI Inference
Launchpad appliance. The **Usage** page has four tabs: **Overview**, **By Model**, **By Client**, and **Quota Usage**.
To understand how usage relates to clients and quotas, refer to
[Clients and Quotas](../explanation/clients-and-quotas.md). To set or raise a limit, refer to
[Set and Manage Client Quotas](./manage-client-quotas.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.
- One or more clients with API tokens. To create a client, refer to [Create a Client](./create-a-client.md).
- Console access with permission to view usage. Raising a limit from **Quota Usage** requires permission to manage
  clients.

## Choose a Data Window

**Overview**, **By Model**, and **By Client** honor the **Data window** control at the top of the page. The presets are
**Last 24h**, **Last 7 days**, and **Last 30 days**. **Date range…** opens a calendar so you can pick exact days.

**Quota Usage** is a point-in-time view of each client's configured limits. It does not follow the **Data window**.

If a figure covers less time than the window in its label, the card says so. For example, the page can report that only
eight hours of history is kept when **Last 30 days** was selected. If the appliance cannot report a custom date range,
it says so and shows a supported period instead.

## View Quota Usage

Use **Quota Usage** to see how close each client is to its request, token, and cost limits right now.

1. From the left main menu, select **Usage**.

2. Select the **Quota Usage** tab.

The table lists every client with a **Requests**, **Tokens**, and **Cost** column. Each column shows the worst-used
window first. A client at 100% of a limit shows a red **Reached limit** marker. The tab also shows a dot, and a banner
at the top of the page names the client.

**Usage last synced** reports when the appliance last refreshed these counters.

3. Select a client.

The client view is titled **Quota utilization**. Three cards, **Requests**, **Tokens**, and **Cost**, list each window
that has a limit. For every window you see:

- The percentage used.
- Used of the limit, such as `6 of 12`.
- How much remains, such as `6 left`.
- When the window next resets, such as `Resets in 45m`.

A dimension with no limit reads **Unlimited**. A dimension whose budget cannot be read reads **Unknown**. **Unknown**
never means the client is free to spend. If quota enforcement is off for the appliance, each dimension reads **Not
enforced**, and a notice states that client usage is recorded but not enforced.

### Increase a Limit from Quota Usage

**Increase limit** raises a ceiling. It does not zero the counter. Usage is kept, so a client that had used 6 of 6 and
is raised to 12 then shows 6 of 12. The window still resets on the UTC clock. To lower a limit, edit the client instead,
as described in [Edit or Remove a Quota](./manage-client-quotas.md#edit-or-remove-a-quota).

1. On the client's **Quota utilization** view, select **Increase limit** on the window row you want to raise. The
   **Increase limit?** dialog opens. **New limit** is prefilled to double the current limit.

2. Enter a value above the current limit. A value at or below the current limit is refused.

3. Select **Increase limit** to preview the change.

4. Select **Confirm & Apply**.

The banner and **Reached limit** marker clear when the client is back under every limit.

## View Usage by Client

**By Client** reports consumption over the selected **Data window**, including how much of the configured local quota
that period used.

1. From the left main menu, select **Usage**.

2. Select the **By Client** tab.

3. Set the **Data window** if you need a period other than the default.

The table includes **Total Local Quota**, the configured cap for the selected window, and **Local Quota Used**, the
percentage of that cap consumed. A client with no token limit reads **Unlimited** in **Total Local Quota**. The table
also splits local and frontier requests, tokens, and cost.

4. Select a client to open its API keys, per-token request, input, output, and cost figures, and the models that handled
   the client's requests.

## View Usage by Model

1. From the left main menu, select **Usage**.

2. Select the **By Model** tab.

3. Set the **Data window** if you need a period other than the default.

4. Select a model.

The model row lists requests, input and output tokens, estimated cost, and whether the model is local or external.
Opening a model shows the per-client breakdown for that model over the same window.

## View the Usage Overview

1. From the left main menu, select **Usage**.

2. Select the **Overview** tab.

3. Set the **Data window** if you need a period other than the default.

**Overview** reports appliance-wide totals for the selected window: requests, input tokens, output tokens, total tokens,
and estimated cost. Estimated cost reflects external, or frontier, traffic. Local models are priced at `$0`.

**On-box token breakdown** shows how much of the prompt was answered from the engine's cache. **Local vs external**
splits traffic by tokens: the share kept on the appliance versus routed to a frontier provider. **Usage over time**
charts input, output, and total tokens for the selected window.

<!--TODO: once these sibling pages publish, add a "Further reading" list here linking to: View Token Usage and Consumption Metrics (DOC-2925) for more detail on usage metrics; and the Usage Metrics Reference (DOC-2942) for every metric and field. -->

## Next Steps

- [Set and Manage Client Quotas](./manage-client-quotas.md)
- [Revoke or Delete a Client](./revoke-or-delete-a-client.md)
