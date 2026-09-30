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

Quotas have two layers. **Quota enforcement** is a single switch that covers the whole appliance and decides whether
limits are enforced at all. The **quota windows** you set on each client are the limits themselves. Both must hold
before the appliance limits a client, so confirm enforcement is on before you set a client's limits.

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.
- An existing client. To create one, refer to [Create a Client](./create-a-client.md).
- Console access with permission to manage clients. Managing clients can require operator access.

## Check Quota Enforcement

Quota enforcement applies to the entire appliance, not to one client. While it is off, the appliance does not enforce
any client's quota windows, and a client that passes its limits is not rejected. The limits you have set stay saved and
take effect again when you turn enforcement back on.

A new appliance starts with quota enforcement on.

1. From the left main menu, select **Overview**.

2. Find the **Quota Enforcement** card and read its badge. **On** means the appliance enforces client quota windows.
   **Off** means it does not.

To change the setting, use the following steps.

1. From the left main menu, select **Access & Policy**.

2. On the **Clients & API tokens** page, select **Quota Enforcement** in the page header. The **Quota enforcement**
   dialog opens.

3. Select or clear the enforcement checkbox.

4. Select **Save**.

5. If you turned enforcement off, the console asks you to confirm. Select **Disable Enforcement**.

:::warning

Turning quota enforcement off removes the limits protecting the appliance's GPU capacity. A single client can then
consume all available throughput and starve the others. Turn it off only for a deliberate, time-boxed reason, such as
clearing a backlog, and turn it back on afterward.

:::

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
