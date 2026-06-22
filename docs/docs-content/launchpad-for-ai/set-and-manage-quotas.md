---
sidebar_label: "Set and Manage Quotas"
title: "Set and Manage Quotas"
description:
  "Learn how to enable quota enforcement and set, view, modify, and remove per-user token quotas and rate limits in
  Launchpad for AI."
hide_table_of_contents: false
sidebar_position: 40
tags: ["launchpad-for-ai", "quotas", "rate-limits", "how-to"]
---

This guide shows you how to enable quota enforcement, set a quota for a user, view all active quotas, and modify or
remove a quota. For how quotas are defined and enforced, refer to
[Quota and Rate Limit Reference](./quota-and-rate-limit-reference.md).

This guide covers per-user quotas. You configure per-model limits through governance configuration rather than in the
console.

## Prerequisites

- A running Launchpad for AI appliance.

- Operator access to the Launchpad for AI console. Setting quotas and enabling enforcement are operator-only actions.

- At least one registered user to apply a quota to. If you have not created a user yet, the appliance always includes
  the built-in `default` user.

## Enable Quota Enforcement

Quota enforcement is off by default. Enable it before any quota takes effect.

1. Sign in to the Launchpad for AI console as an operator.

2. From the left main menu, select **Access & Policy**, and then select the **Users** tab.

3. Locate the **Enforcement** card. The status chip shows the current state, **Quota enforcement: OFF** or **Quota
   enforcement: ON**.

4. Select **Enable enforcement**.

The status chip changes to **Quota enforcement: ON**. The gateway now applies each user's quota to that user's requests.

:::tip

You can return to this card at any time and select **Disable enforcement** to stop applying quotas without deleting
them. The gateway preserves the configured limits.

:::

## Set a Quota for a User

You set a quota by adding one or more limits to a user, where each limit caps one dimension over one window. For
example, **tokens** per **day** is a token quota, and **requests** per **minute** is a rate limit. For the available
dimensions and windows, refer to [Quota and Rate Limit Reference](./quota-and-rate-limit-reference.md).

1. From the left main menu, select **Access & Policy**, and then select the **Users** tab.

2. In the **Users** table, find the user you want to limit and select its ID button beneath the user name to open the
   user's detail page.

3. In the **Quota windows** card, select **Add window limit**. A new row appears with three fields.

4. Configure the row for the limit you want to set.

   | **Field**     | **Description**                                                                                                           |
   | ------------- | ------------------------------------------------------------------------------------------------------------------------- |
   | **dimension** | What the limit measures. Select **tokens** for a token quota, **requests** for a rate limit, or **cost** for a spend cap. |
   | **per**       | The window the limit applies over. Select **second**, **minute**, **hour**, or **day**.                                   |
   | **limit**     | The largest value allowed in that window. Enter a positive number.                                                        |

5. To add more limits, select **Add window limit** again and configure each new row. For example, you can set a
   **requests** per **minute** rate limit and a **tokens** per **day** token quota for the same user.

6. Select **Save quota windows**. The console displays a preview card that summarizes the change.

7. Review the preview, and then select **Confirm & apply**.

After the change applies, the **Quota windows** card lists the active limits as live chips. The new limits take effect
on the user's next request.

:::tip

To leave a dimension unlimited, do not add a row for it.

:::

## View All Active Quotas

The Metrics page lists every active quota across users and models in one place, along with the current usage against
each limit.

1. From the left main menu, select **Metrics**, and then select the **Metrics** tab.

2. Locate the **Quotas** table. Each row shows one quota and its current usage. The table appears only when at least one
   quota is configured.

For what each column means, refer to the [Quotas panel](./usage-metrics-reference.md#quotas) in the Usage Metrics
Reference.

## Modify or Remove a Quota

You change or clear a user's quota from the same **Quota windows** card where you set it.

1. From the left main menu, select **Access & Policy**, and then select the **Users** tab.

2. In the **Users** table, select the user's ID button to open its detail page.

3. In the **Quota windows** card, make one of the following changes:

   - To modify a limit, change the **dimension**, **per**, or **limit** value on an existing row.

   - To remove a single limit, select **remove** on that row.

   - To remove all limits for the user, select **remove** on every row until the editor shows **no limit**.

4. Select **Save quota windows**, review the preview card, and then select **Confirm & apply**.

The **Quota windows** card refreshes to show the updated limits. Saving an empty editor clears the user's window limits.

## Validate

1. On the **Access & Policy** page, select the **Users** tab and confirm the **Enforcement** card shows **Quota
   enforcement: ON**.

2. Open the user's detail page and confirm the **Quota windows** card lists the limits you configured as live chips.

3. On the **Metrics** page, select the **Metrics** tab and confirm the **Quotas** table lists the user with the expected
   limits.
