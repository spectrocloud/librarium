---
sidebar_label: "Set Prompt Cache Sharing for a Policy"
title: "Set Prompt Cache Sharing for a Policy"
description:
  "On a PaletteAI Inference Launchpad appliance, choose whether the clients in the workspaces that follow a policy share
  the prompt cache or each keep their own."
hide_table_of_contents: false
sidebar_position: 2.85
tags: ["paletteai-inference-launchpad", "access", "policy", "cache", "how-to"]
keywords: ["launchpad", "ai", "prompt cache", "cache sharing", "policy", "workspace", "isolation"]
---

Choose whether clients share the prompt cache or each keep their own. You set this on the policy that their workspace
follows. For what each choice means and the risk that sharing brings, refer to
[Prompt Cache Sharing](../explanation/prompt-cache-sharing.md). For the labels on the **Policies** tab, refer to
[Access and Policy Reference](../reference/access-and-policy-reference.md#policies-tab).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.

- Console access as a person who holds the **Platform administrator** role.

## Change Cache Sharing on a Policy

1. From the left main menu, select **Access & Policy**.

2. In the workspace drop-down menu in the console header, select **All workspaces**.

3. Select the **Policies** tab.

4. In the policy's row, check the **Followed by** column for the workspaces whose clients the change affects.

5. In the policy's row, open the three-dot menu, and then select **Edit**. The policy's page opens, titled with the
   policy name.

6. Select the **Cache sharing** section.

7. In the **Prompt cache sharing** drop-down menu, select **Share within the workspace** or **Each client is isolated**.

8. Select **Save changes**.

9. Repeat steps 4 through 8 for each policy you want to change.

## Choose Cache Sharing on a New Policy

1. From the left main menu, select **Access & Policy**.

2. In the workspace drop-down menu in the console header, select **All workspaces**.

3. Select the **Policies** tab, and then select **Create Policy**. The **Create policy** wizard opens on the
   **Overview** step.

4. Complete the **Overview**, **Quotas**, and **External access** steps.

5. On the **Cache sharing** step, in the **Prompt cache sharing** drop-down menu, select **Share within the workspace**
   or **Each client is isolated**, and then select **Next**.

6. Complete the **Routing** step, and then select **Create policy**.

7. Select the **Workspaces** tab.

8. In the row of the workspace that should follow every setting of the new policy, open the three-dot menu, and then
   select **Manage**.

9. In the **Policy** field, select the new policy, and then select **Save changes**.

   To give a team a new workspace that follows the policy instead, refer to
   [Create a Workspace](./create-a-workspace.md).

## Validate

1. From the left main menu, select **Access & Policy**, and then select **All workspaces** in the workspace drop-down
   menu.

2. Select the **Policies** tab.

3. In the policy's row, confirm that the **Cache sharing** column reads **Workspace** for **Share within the
   workspace**, or **Each client** for **Each client is isolated**.

4. Confirm that the **Followed by** column lists the workspaces whose clients you meant to change.

## Next Steps

- [Create a Workspace](./create-a-workspace.md) to give a team its own workspace that follows a policy you set.

- [View Token Usage](./view-token-usage.md) to check how many prompt tokens came from the cache.
