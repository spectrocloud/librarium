---
sidebar_label: "Set and Manage Client Quotas"
title: "Set and Manage Client Quotas"
description:
  "Step-by-step guidance for platform administrators on how to set, raise, edit, and remove usage quotas on a client on
  a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 5
tags: ["paletteai-inference-launchpad", "clients", "quotas", "how-to"]
keywords: ["launchpad", "ai", "clients", "quota", "rate limit", "requests", "tokens", "cost", "429"]
---

This guide explains how a platform administrator sets and manages usage quotas on a PaletteAI Inference Launchpad
appliance. For what a quota is and how it interacts with clients and appliance-wide enforcement, refer to
[Clients and Quotas](../explanation/clients-and-quotas.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.
- An existing client. To create one, refer to [Create a Client](./create-a-client.md).
- Console access with permission to manage clients. Managing clients can require operator access.

## Check Quota Enforcement

Use these steps to read or change the appliance-wide **Quota Enforcement** switch. For what the switch does, refer to
[Clients and Quotas: Quotas](../explanation/clients-and-quotas.md#quotas).

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

6. Choose the window the limit applies over: **hour** or **day**. Day limits reset at midnight UTC. Hour limits reset at
   the top of each UTC hour.

7. Enter the limit for that dimension and window.

8. Repeat the previous steps for each limit you want. For example, add a tokens-per-day limit and a cost-per-day limit.

9. Save the client.

Each row limits one dimension over one window. A window with no row stays uncapped. All active limits apply together.
When a window is full, new requests are blocked until it resets.

Per-second and per-minute windows are not offered when you add a limit. A client that already has a second or minute
limit still displays that row, and the appliance still enforces it. To remove such a limit, delete the row and save the
client.

## Edit or Remove a Quota

1. From the left main menu, select **Access & Policy**.

2. On the **Clients & API tokens** page, select the client to open its detail panel.

3. Select the **Quotas** section.

4. Change a limit, or remove a window-limit row. Use this path when you need to lower a ceiling. **Increase limit** on
   the **Usage** page cannot lower a cap.

5. Save the client.

## Increase a Limit from Usage

Use these steps to raise a ceiling from **Usage** without editing the client's quota rows. For what this action does,
refer to [Clients and Quotas: Limit Ceiling Increases](../explanation/clients-and-quotas.md#limit-ceiling-increases).

1. From the left main menu, select **Usage**.

2. Select the **Quota Usage** tab, and then select the client.

3. On the window row, select **Increase limit**.

4. Enter a value above the current limit, and then select **Increase limit** to preview the change.

   :::warning

   **Confirm & Apply** raises the ceiling for the current window immediately and for every window that follows. The
   dialog does not undo the change. To lower a cap after raising it, edit the client from **Access & Policy** as
   described in [Edit or Remove a Quota](#edit-or-remove-a-quota).

   :::

5. Select **Confirm & Apply**.

For the full sequence, including what **Reached limit** and the preview dialog show, refer to
[Increase a Limit from Quota Usage](./view-client-usage.md#increase-a-limit-from-quota-usage).

## Next Steps

- [Manage a Client's Model Access](./manage-client-model-access.md)
- [View Client Usage](./view-client-usage.md)
