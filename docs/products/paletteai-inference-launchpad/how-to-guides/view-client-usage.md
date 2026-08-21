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

This guide explains how a platform administrator views a single client's quota utilization on a PaletteAI Inference
Launchpad appliance. It covers the **Quota Usage** and **By Client** tabs of the **Usage** page. For **Overview**
appliance-wide totals and the **By Model** breakdown, refer to [View Token Usage](./view-token-usage.md). To understand
how usage relates to clients and quotas, refer to [Clients and Quotas](../explanation/clients-and-quotas.md). To set or
raise a limit, refer to [Set and Manage Client Quotas](./manage-client-quotas.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.
- One or more clients with API tokens. To create a client, refer to [Create a Client](./create-a-client.md).
- Console access with permission to view usage. Raising a limit from **Quota Usage** requires permission to manage
  clients.

## View Quota Usage

Use these steps to check how close each client is to its request, token, and cost limits right now. For every column,
badge, and status label on this tab, refer to
[Usage Metrics Reference: Quota Usage Tab](../reference/usage-metrics-reference.md#quota-usage-tab).

1. From the left main menu, select **Usage**.

2. Select the **Quota Usage** tab.

3. Select a client to open its **Quota utilization** view. Each configured window reports the percentage used, the used
   value against the limit, the remaining amount, and when the window next resets. For every field on this view, refer
   to
   [Usage Metrics Reference: Client Quota Detail View](../reference/usage-metrics-reference.md#client-quota-detail-view).

### Increase a Limit from Quota Usage

Raise the ceiling on one window from **Quota Usage**. For what **Increase limit** does and when to use it, refer to
[Clients and Quotas: Limit Ceiling Increases](../explanation/clients-and-quotas.md#limit-ceiling-increases).

1. On the client's **Quota utilization** view, select **Increase limit** on the window row you want to raise. The
   **Increase limit?** dialog opens. **New limit** defaults to double the current limit.

2. Enter a value above the current limit. A value at or below the current limit is refused.

3. Select **Increase limit** to preview the change.

   :::warning

   **Confirm & Apply** raises the ceiling for the current window immediately and for every window that follows. The
   dialog does not undo the change. To lower a cap after raising it, edit the client from **Access & Policy** as
   described in [Edit or Remove a Quota](./manage-client-quotas.md#edit-or-remove-a-quota).

   :::

4. Select **Confirm & Apply**.

The banner and **Reached limit** marker clear when the client is back under every limit.

## View Usage by Client

Use these steps to review one client's consumption over a chosen reporting period. For every column on this tab and tile
on the client detail view, refer to
[Usage Metrics Reference: By Client Tab](../reference/usage-metrics-reference.md#by-client-tab).

1. From the left main menu, select **Usage**.

2. Select the **By Client** tab.

3. Set the **Data window** if you need a period other than the default. For the available windows, refer to
   [Set the Reporting Period](./view-token-usage.md#set-the-reporting-period).

   :::info

   The **By Client** table is empty until at least one client accrues usage within the current quota window. This is
   expected on a new appliance and is not an error.

   :::

4. Select a client to open its API keys, per-token consumption, and the models that handled its requests.

## Further Reading

- [View Token Usage](./view-token-usage.md) covers the **Overview** and **By Model** tabs, appliance-wide totals, top
  consumers, and the Grafana dashboards.
- [Usage Metrics Reference](../reference/usage-metrics-reference.md) defines every metric, column, quota status label,
  and export field on the **Usage** page.

## Next Steps

- [Set and Manage Client Quotas](./manage-client-quotas.md)
- [Revoke or Delete a Client](./revoke-or-delete-a-client.md)
