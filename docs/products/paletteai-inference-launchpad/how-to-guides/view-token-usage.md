---
sidebar_label: "View Token Usage"
title: "View Token Usage and Consumption Metrics"
description:
  "Step-by-step guidance for platform administrators on how to view token usage by model and by client, find the top
  consumers, export a usage report, and open the metrics dashboards on a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 6.5
tags: ["paletteai-inference-launchpad", "usage", "metrics", "how-to"]
keywords: ["launchpad", "ai", "token usage", "metrics", "consumption", "export", "grafana", "quota utilization"]
---

This guide explains how a platform administrator views token consumption on a PaletteAI Inference Launchpad appliance.
The **Usage** page reports every request the appliance handled, and you can narrow it to one model, one client, or one
API token.

Use this guide to answer questions such as which model consumes the most tokens, which client is the heaviest consumer
over the last week, and how much of its quota a client has spent. For the meaning of each individual metric, tile, and
column, refer to [Usage Metrics Reference](../reference/usage-metrics-reference.md). To understand how usage relates to
clients and quotas, refer to [Clients and Quotas](../explanation/clients-and-quotas.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.

- At least one deployed model that has served traffic. Until a model answers a request, every figure on the page is
  zero. To deploy a model, refer to [Deploy a Model](./deploy-a-model.md).

- One or more clients with API tokens. To create a client, refer to [Create a Client](./create-a-client.md).

- Console access with permission to view usage. The **By Client** and **Quota Usage** tabs read the client roster, which
  can require operator access.

## Set the Reporting Period

Every tab except **Quota Usage** reports over a period you choose. Set the period first, because it scopes every figure
you read afterward.

1. From the left main menu, select **Usage**.

2. In the page header, select the **Data window** drop-down menu. The default is **Last 7 days**.

3. Choose one of the following periods.

   | **Option**       | **Period the figures cover**  |
   | ---------------- | ----------------------------- |
   | **Last 24h**     | The previous 24 hours.        |
   | **Last 7 days**  | The previous seven days.      |
   | **Last 30 days** | The previous 30 days.         |
   | **Date range**   | Dates you pick on a calendar. |

4. _(Date range only)_ Select the first and last day of the range, and then apply it. The calendar accepts any range
   within the last 90 days.

{/* NEEDS REVIEW, per AIL-415: that ticket asks for Last 60 Days and Last 90 Days quick-select presets and a range of up to 90 days. The build ships the 24-hour, seven-day, and 30-day presets plus a calendar that accepts 90 days but serves any custom range from the widest preset, so no figure covers more than 30 days. Confirm whether the 60-day and 90-day reporting is still planned before this page publishes. */}

## View Appliance-Wide Token Totals

The **Overview** tab reports the whole appliance for the selected period.

1. From the left main menu, select **Usage**.

2. Select the **Overview** tab.

3. Read the **Totals** card for the headline figures: requests, input tokens, output tokens, total tokens, and estimated
   cost.

4. _(Optional)_ Select the information button on any tile to display a description of that figure.

The tab also reports the following.

- **On-box token breakdown**, which separates the prompt tokens the engine answered from its own cache from the tokens
  it computed fresh, and reports the tokens that left the appliance.

- **Local vs external**, which reports the share of traffic that stayed on your own engines against the share routed to
  an external provider.

- **Usage over time**, a chart of input, output, and total tokens across the selected period.

- **Semantic routing**, a table of which model handled each request category.

To scope every card on the tab to a single client, select that client in the **Client** drop-down menu in the page
header.

## View Token Usage for a Model

1. From the left main menu, select **Usage**.

2. Select the **By Model** tab. Each row is one model, with its requests, its input and output tokens, its estimated
   cost, and its average latency.

3. Select a model row to display the clients that sent requests to that model.

4. To return to the model list, select **All Models**.

:::info

The **Location** column separates models running on the appliance from models reached through an external provider. Only
external traffic carries a cost, because models you host are priced at `0`. To set the per-model rates that produce the
cost figures, go to **Settings** > **Pricing**.

:::

## View Token Usage for a Client

1. From the left main menu, select **Usage**.

2. Select the **By Client** tab. Each row is one registered client, with its API token count, its local and external
   requests and tokens, its quota entitlement and the share of that entitlement it has spent, its local and external
   cost, and its estimated savings.

3. Select a client row to display its API tokens and their individual consumption.

4. Select an API token row to open a dialog with the full metrics for that token.

5. To return to the client list, select **All Clients**.

For the per-token breakdown in detail, refer to [View Client Usage](./view-client-usage.md).

## Identify the Top Token Consumers

Use these steps to find which clients consumed the most tokens over the last week.

1. From the left main menu, select **Usage**.

2. In the page header, set the **Data window** menu to **Last 7 days**.

3. Select the **By Client** tab.

4. Compare the **Local / Egress Tokens** column down the table. The left figure is the tokens the appliance served
   itself, and the right figure is the tokens routed to an external provider.

:::tip

To find the heaviest consumers of one specific model rather than of the appliance as a whole, select that model on the
**By Model** tab. The model detail view lists only the clients that sent requests to it, with the tokens each one spent.

:::

## Export a Usage Report

The **By Client** tab exports the figures it currently displays, for the period it currently covers.

1. From the left main menu, select **Usage**.

2. Set the **Data window** menu to the period you want to report on.

3. Select the **By Client** tab.

4. Select **Export** in the card header.

5. Select one of the following formats.

   | **Format**        | **Use it for**                                                                             |
   | ----------------- | ------------------------------------------------------------------------------------------ |
   | **Export as CSV** | Reconciliation and analysis. Cells carry bare numbers that a spreadsheet totals or pivots. |
   | **Export as PDF** | Sharing and filing. The table is formatted and paginated for a reader.                     |

The file downloads with a timestamped name, such as `usage-by-client-2026-08-18T10-22-04Z.csv`. Both formats state the
period the figures cover. For the fields each file contains, refer to
[Usage Metrics Reference](../reference/usage-metrics-reference.md).

:::info

The export covers the **By Client** table only, and the control is unavailable until at least one client exists.

:::

## View Quota Consumption per Client

The **Quota Usage** tab reports each client's consumption against the limits you set, so you can find a client that is
close to a limit before it is rejected.

1. From the left main menu, select **Usage**.

2. Select the **Quota Usage** tab. Each row is one client, with a meter for each configured limit under **Requests**,
   **Tokens**, and **Cost**.

3. To bring the most-consumed limits to the top, select the **Tokens** column heading. The **Requests**, **Cost**, and
   **Client** headings sort the table as well.

4. Select a client row to display its limits in full. Each limit reports the amount consumed, the amount remaining, and
   when its window next resets.

A client that has reached a limit carries a **Reached limit** badge, and a banner at the top of the tab names every such
client. The appliance rejects further requests from that client with HTTP `429` until the window resets or you raise the
limit.

To raise one limit from this tab, use the following steps.

1. Select the client row to open its detail.

2. Find the limit to raise and select **Increase limit**. The **Increase limit?** dialog opens.

3. In **New limit**, enter the new limit. The field is pre-filled with double the current limit.

4. Select **Increase limit** to preview the change. The dialog reports what the change does before anything is applied.

5. Select **Confirm & Apply**.

:::warning

Raising a limit takes effect immediately and grants the client more of the appliance's GPU capacity. Raise a limit only
when the appliance has the headroom to serve it. Without that headroom, the other clients slow down.

:::

Quota enforcement is a separate appliance-wide switch. While it is off, this tab still records consumption but the
appliance does not reject a client that passes a limit. To check the switch or to set a client's limits, refer to
[Set and Manage Client Quotas](./manage-client-quotas.md).

## Open the Metrics Dashboards

The appliance ships with its metrics backend and Grafana enabled, and the console links to the infrastructure
dashboards.

1. From the left main menu, select **Usage**.

2. Select **Grafana** in the page header. The dashboards open in a new browser tab.

Use Grafana for infrastructure-level questions the **Usage** page does not answer, such as GPU utilization and engine
throughput over time. Token and cost accounting stays on the **Usage** page.

:::info

The **Grafana** link appears only when the appliance reports a reachable dashboard address. If the link is absent, the
appliance still collects metrics, but no browser-reachable dashboard address is configured for it.

:::

## Next Steps

- [Usage Metrics Reference](../reference/usage-metrics-reference.md)
- [View Client Usage](./view-client-usage.md)
- [Set and Manage Client Quotas](./manage-client-quotas.md)
