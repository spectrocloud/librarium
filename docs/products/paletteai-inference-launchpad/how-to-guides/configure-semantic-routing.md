---
sidebar_label: "Configure Semantic Routing"
title: "Configure Semantic Routing"
description:
  "Step-by-step guidance for platform administrators on how to turn the semantic router on or off, set routing rules for
  a workspace's policy and for a client, set a client's Complexity threshold, and record a client's routing decisions on
  a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 2.2
tags: ["paletteai-inference-launchpad", "routing", "semantic-routing", "how-to"]
keywords:
  [
    "launchpad",
    "ai",
    "semantic routing",
    "semantic router",
    "complexity threshold",
    "policy",
    "workspace",
    "simple",
    "complex",
    "fallback",
    "decision recording",
  ]
---

<!-- vale off -->

This guide explains how a platform administrator turns the semantic router on or off and sets its routing rules on a
PaletteAI Inference Launchpad appliance. For what the semantic router does, how its rules are inherited from a
workspace's policy, and how it combines with the Tier map, refer to
[Routing Behavior](../explanation/routing-behavior.md).

<!-- vale on -->

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.

- Console access with permission to change settings, policies, workspaces, and clients.

- At least one served model, or a client provider key for a frontier provider, to route requests to. To deploy a model,
  refer to [Deploy a Model](./deploy-a-model.md).

- _(Per-client steps only)_ An existing client. To create one, refer to [Create a Client](./create-a-client.md).

- _(Off-box rules only)_ External inferencing enabled for the client, with a provider key for each frontier provider a
  rule names. To enable it, refer to
  [Manage a Client's Model Access](./manage-client-model-access.md#allow-a-client-to-reach-external-models).

## Turn the Semantic Router On or Off

The semantic router is on from installation wherever the appliance can run it. Use these steps to turn it off, or to
turn it back on.

1. From the left main menu, select **Settings**.

2. Select the **Configurations** tab.

3. On the **Semantic router** card, turn the **Run the semantic router on this box** toggle on or off.

4. Select **Turn on semantic router** or **Turn off semantic router**. The console confirms the change with
   `Started deploying the semantic router.` or `Stopped the semantic router. It stays deployed.`

Turning the semantic router off stops its engine and frees its GPU memory. The main model keeps serving without a
restart. Turning the semantic router on again deploys it from the same copy.

{/* NEEDS REVIEW: the ticket says the Run the semantic router on this box toggle is the only box-level control, but the console source on the same commit also renders two guard toggles on this card, Refuse jailbreak attempts and Scan prompts for personal data before they leave the box, both on by default. Confirm whether these toggles ship and whether the docs should describe them. */}

If the toggle is unavailable, hover over or focus it to read the reason in the **Why the semantic router is
unavailable** tooltip. The appliance cannot run the semantic router when the cluster has no GPU, when every GPU is too
small, when the semantic router does not fit beside the deployed model, or while the appliance cannot yet tell whether
it fits. For what each reason means, refer to
[The Semantic Router on the GPU](../explanation/routing-behavior.md#the-semantic-router-on-the-gpu).

If the cluster has GPUs but the GPU driver is not publishing them, the card shows an error that names the fix instead,
and the toggle stays available. Install the driver the message names, and then turn the semantic router on.

{/* NEEDS REVIEW: the console's missing-driver message names the DRA driver. Confirm with engineering whether the docs quote that wording or whether the console changes it to GPU driver. */}

<!-- vale off -->

## Set Routing for a Workspace's Policy

<!-- vale on -->

A policy carries the routing rules that every client in a workspace inherits. Use these steps to set the rules on a
policy, and then to make a workspace follow that policy.

1. From the left main menu, select **Access & Policy**.

2. Select the **Policies** tab.

3. Select **Create policy** to start a new policy, and complete its **Overview**, **Quotas**, and **Egress** steps. To
   change an existing policy, open the three-dot menu on its row and select **Edit** instead.

4. On the **Routing** step, map every alias in the **Tier map** to a model. Set at least one alias to **Use Semantic
   Router rules** so that the **Semantic routing** rules appear.

5. In **Semantic routing**, set the **Complexity threshold** and the **Model** and **Thinking** for each category row,
   as described in [Set a Client's Routing](#set-a-clients-routing).

6. Select **Create policy**, or **Save changes** if you are editing a policy.

7. Select the **Workspaces** tab.

8. Open the three-dot menu on the workspace row and select **Manage**.

9. In the **Policy** field, choose the policy. The field reads `Pick the policy this workspace follows.` until you
   choose one.

10. Select **Save changes**.

Every client in the workspace now runs under the policy's routing, except where a client has rules of its own.

## Set a Client's Routing

<!-- vale off -->

A client's own rules override the routing it inherits from its workspace's policy. You can set them in the client drawer
after the client exists, or in the **Routing** step of the **Add client** wizard while you create the client.

<!-- vale on -->

1. From the left main menu, select **Access & Policy** > **Clients**.

2. Select the client to open its drawer, and then select the **Routing** tab.

   {/* NEEDS REVIEW: in the console source the box-wide Clients tab is read only and a client is changed from the Clients tab inside its workspace. Confirm the navigation path with the Access and Policy documentation before this page publishes. */}

3. If the **Semantic routing** card reads
   `No alias sends its requests here yet. Set one to Use Semantic Router rules in the tier map above, and these rules will choose the model that answers it.`,
   set the **Model** of at least one alias in the **Tier map** to **Use Semantic Router rules**. Select **Save**, and
   then select **Save** in the **Save alias routing** dialog.

4. In the **Semantic routing** card, find the table for the category you want to change. The six categories in the
   console are **Code planning**, **Code development**, **Code refactoring**, **Code review**, **Code test generation**,
   and **General**. Each table has a **Simple** row, a **Complex** row, and a **Fallback** row. Every row starts filled
   with the model and reasoning depth that applies today, and a row that follows the defaults is tagged `default`.

5. For each row you want to change, choose a model in the **Model** column. The picker lists the models the appliance
   serves and the live models of each provider key the client holds, with a separate list per provider. If a provider's
   model list cannot be read, the drawer shows `<provider> models are not offered: <reason>` and that provider offers no
   models.

6. _(Optional)_ For each row you want to change, choose **Inherited**, **off**, **on**, or **effort** in the
   **Thinking** column. If you choose **effort**, also choose **low**, **medium**, **high**, **xhigh**, or **max** as
   the level. **Inherited** follows the depth set on the alias that handed the request to the semantic router. Choosing
   **off** turns reasoning off for that rule, whatever the alias says.

7. Select **Save**, and then select **Save** in the **Save semantic routing** dialog.

To set the same rules while you create a client, open the **Add client** wizard as described in
[Create a Client](./create-a-client.md), and use the **Tier map** and **Semantic routing** sections of its **Routing**
step in the same way. The rules apply when you create the client.

## Set a Client's Complexity Threshold

The **Complexity threshold** sets the boundary between the **Simple** and the **Complex** row of every category for one
client. The default is 50%.

1. From the left main menu, select **Access & Policy** > **Clients**.

2. Select the client to open its drawer, and then select the **Routing** tab.

3. In the **Semantic routing** card, move the **Complexity threshold** slider. The slider appears after at least one
   alias is set to **Use Semantic Router rules**, as described in [Set a Client's Routing](#set-a-clients-routing).
   Requests that score at or above the value go to the **Complex** row. A lower value sends more requests to the
   **Complex** row.

4. Select **Save**. The console confirms the value, such as `Complexity threshold saved at 40%.`, and the text under the
   slider reads `Set for this client. The default is 50%.`

## Return a Client to the Default Routing

Use these steps to remove a client's own routing, so that the client follows what it inherits again.

1. From the left main menu, select **Access & Policy** > **Clients**.

2. Select the client to open its drawer, and then select the **Routing** tab.

3. In the **Semantic routing** card, select **Use defaults**, and then select **Use defaults** in the **Use default
   semantic routing** dialog.

4. _(Optional)_ To also reset the threshold, select **Use default** under the **Complexity threshold** slider, and then
   select **Save**. The text under the slider reads `Using the default of 50%.`

5. _(Optional)_ To also reset the alias mapping, select **Use defaults** in the **Tier map** card, and then select **Use
   defaults** in the **Use default alias routing** dialog.

{/* NEEDS REVIEW: Use defaults returns a client to what it inherits, which is the policy its workspace follows where the policy sets routing, but the console copy says the defaults and the threshold text always names a default of 50 percent. Confirm with engineering how the docs should name the inherited layer. */}

## Turn On Decision Recording

Decision recording writes one row per classified turn for a client, so that you can tune the categories and the
Complexity threshold against real traffic. Recording is off by default and needs the semantic router running.

1. From the left main menu, select **Access & Policy** > **Clients**.

2. Select the client to open its drawer, and then select the **Recording** tab.

3. In the **Decision recording** card, turn on **Record this client's classified turns**.

4. Let the appliance run long enough to record traffic that represents the client's workload. The **Turns recorded**,
   **Space used**, and **Dates covered** values grow as turns are recorded.

To stop recording, turn off **Record this client's classified turns**. The turns already recorded stay available to
download.

## Download the Recorded Turns

1. From the left main menu, select **Access & Policy** > **Clients**.

2. Select the client to open its drawer, and then select the **Recording** tab.

3. Select **Download CSV**.

## Delete the Recorded Turns

Deleting the recorded turns cannot be undone. Download them first if you need to keep them.

1. From the left main menu, select **Access & Policy** > **Clients**.

2. Select the client to open its drawer, and then select the **Recording** tab.

3. Select **Delete records**.

4. In the **Delete the recorded turns for `<client>`?** dialog, where `<client>` is the client's name, select **Delete
   Records**.

## Validate

1. From the left main menu, select **Settings**, and then select the **Configurations** tab. Confirm that the **Run the
   semantic router on this box** toggle on the **Semantic router** card is in the state you set.

2. From the left main menu, select **Access & Policy** > **Clients**. Confirm that the **Routing** column shows a count
   of routes, such as `3 routes`, for a client that has rules of its own. A client that inherits its routing shows
   `Default`, or a count followed by `· default`.

3. Send a request from the client that sends `auto` as the model, or that names an alias set to **Use Semantic Router
   rules**.

4. From the left main menu, select **Usage**, and then select the **Overview** tab. Confirm that the **Semantic
   routing** table shows a row with the request's category, its **Complexity** band, and the model your rule names.

## Next Steps

- [Manage a Client's Model Access](./manage-client-model-access.md)
- [View Client Usage](./view-client-usage.md)
