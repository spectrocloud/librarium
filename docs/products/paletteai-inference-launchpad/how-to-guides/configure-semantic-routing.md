---
sidebar_label: "Configure Semantic Routing"
title: "Configure Semantic Routing"
description:
  "Step-by-step guidance for platform administrators on how to turn the semantic router and its guard checks on or off,
  set routing rules for a workspace's policy and for a client, set a client's Complexity threshold, and record routing
  decisions on a PaletteAI Inference Launchpad appliance."
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
    "guard",
  ]
---

<!-- vale Vale.Spelling = NO -->

This guide explains how a platform administrator turns the semantic router and its guard checks on or off and sets its
routing rules on a PaletteAI Inference Launchpad appliance. For what the semantic router does, how its rules are
inherited from a workspace's policy, and how it combines with the Tier map, refer to
[Routing Behavior](../explanation/routing-behavior.md).

<!-- vale Vale.Spelling = YES -->

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.

- Console access with permission to change settings, policies, workspaces, and clients, including permission to update
  routing rules. A user without permission to update routing rules can read a client's routing rules, but the console
  shows them as read-only.

- At least one served model, or a client provider key for a frontier provider, to route requests to. To deploy a model,
  refer to [Deploy a Model](./deploy-a-model.md).

- _(Per-client steps only)_ An existing client. To create one, refer to [Create a Client](./create-a-client.md).

- _(Only for rules that name a frontier model)_ External inferencing enabled for the client, with a provider key for
  each frontier provider a rule names. To enable it, refer to
  [Manage a Client's Model Access](./manage-client-model-access.md#allow-a-client-to-reach-external-models).

## Turn the Semantic Router On or Off

The semantic router is on from installation wherever the appliance can run it. Use these steps to turn it off, or to
turn it back on.

1. From the left main menu, select **Settings**, and then select the **Configurations** tab.

2. On the **Semantic router** card, turn the **Run the semantic router on this box** toggle on or off.

3. Select **Turn on semantic router** or **Turn off semantic router**. The console confirms the change with
   `Started deploying the semantic router.` or `Stopped the semantic router. It stays deployed.`

If the toggle is unavailable, hover over or focus it to read the reason in the **Why the semantic router is
unavailable** tooltip. For every reason, refer to
[Reasons the Semantic Router Is Unavailable](../reference/semantic-routing-reference.md#reasons-the-semantic-router-is-unavailable).

If the card shows an error that names a missing GPU driver, the semantic router cannot run until that driver is
installed. The GPU Operator installs GPU drivers automatically. For the GPU requirements, refer to
[Suggested Hardware](../reference/hardware-requirements.md#gpu).

## Turn the Guard Checks On or Off

Both guard checks are on by default. For what each check does, refer to
[Semantic Router Guard](../explanation/semantic-router-guard.md). For the state of each toggle, refer to
[Guard Toggles](../reference/semantic-routing-reference.md#guard-toggles).

1. From the left main menu, select **Settings**, and then select the **Configurations** tab.

2. On the **Semantic router** card, turn the **Refuse jailbreak attempts** toggle on or off.

3. Turn the **Scan prompts for personal data before they leave the box** toggle on or off.

4. Select **Apply semantic router settings**. The console confirms each change.

The two guard toggles are unavailable whenever the **Run the semantic router on this box** toggle is unavailable.

<!-- vale Vale.Spelling = NO -->

## Set Routing for a Workspace's Policy

<!-- vale Vale.Spelling = YES -->

A policy carries the routing rules that every client in a workspace inherits. Use these steps to set the rules on a
policy, and then to make a workspace follow that policy.

1. From the left main menu, select **Access & Policy**, and then select the **Policies** tab.

2. Select **Create policy** to start a new policy, or open the three-dot menu on a policy's row and select **Edit**. For
   a new policy, complete the **Overview**, **Quotas**, and **Egress** steps.

3. On the **Routing** step, map every alias in the **Tier map** to a model. Set at least one alias to **Use Semantic
   Router rules** so that the **Semantic routing** rules appear.

4. In **Semantic routing**, set the **Complexity threshold** and the **Model** and **Thinking** for each category rule,
   as described in [Set a Client's Complexity Threshold](#set-a-clients-complexity-threshold) and
   [Set a Client's Routing](#set-a-clients-routing). Every **Simple**, **Complex**, and **Fallback** rule needs a model
   before you can continue.

5. Select **Create policy**, or **Save changes** if you are editing a policy.

6. Select the **Workspaces** tab.

7. Open the three-dot menu on the workspace row and select **Manage**.

8. In the **Policy** field, choose the policy. The field reads `Pick the policy this workspace follows.` until you
   choose one.

9. Select **Save changes**.

Every client in the workspace now runs under the policy's routing, except where a client has rules of its own.

## Set a Client's Routing

<!-- vale Vale.Spelling = NO -->

A client's own rules override the routing it inherits from its workspace's policy. You can set them in the client's
detail panel after the client exists, or in the **Routing** step of the **Add client** wizard while you create the
client. The detail panel opens from inside the client's workspace.

<!-- vale Vale.Spelling = YES -->

1. In the workspace drop-down menu in the console header, select the client's workspace.

2. From the left main menu, select **Access & Policy**, and then select the **Clients** tab.

3. Select the client to open its detail panel, and then select the **Routing** tab.

4. If the **Semantic routing** card reads `No alias sends its requests here yet.`, set the **Model** of at least one
   alias in the **Tier map** to **Use Semantic Router rules**.

5. _(Tier map changes only)_ Map every other alias to a model. **Save** stays unavailable until every alias is mapped.

6. _(Tier map changes only)_ Select **Save**, and then select **Save** in the **Save alias routing** dialog.

7. On the **Semantic routing** card, find the table for the category you want to change. Each category has a **Simple**,
   a **Complex**, and a **Fallback** rule. For the rules in each table, refer to
   [Routing Rules](../reference/semantic-routing-reference.md#routing-rules).

8. For each rule you want to change, choose a model in the **Model** column. The **Model** picker includes the live
   models of each provider key the client holds. If the detail panel shows
   `<provider> models are not offered: <reason>`, that provider offers no models until its key can be read. To check the
   key, refer to
   [Manage a Client's Model Access](./manage-client-model-access.md#allow-a-client-to-reach-external-models).

9. _(Optional)_ For each rule you want to change, choose a value in the **Thinking** column. If you choose **effort**,
   also choose a level. For the values, refer to
   [Thinking Directive Modes](../reference/thinking-modes.md#thinking-values-on-semantic-routing-rules).

10. Select **Save**, and then select **Save** in the **Save semantic routing** dialog. **Save** stays unavailable until
    every rule you changed names a model.

To set the same rules while you create a client, open the **Add client** wizard as described in
[Create a Client](./create-a-client.md). On the **Overview** step, turn on **Override policy settings**, and then use
the **Tier map** and **Semantic routing** sections of the **Routing** step in the same way. The **Routing** step appears
only while **Override policy settings** is on. The rules apply when you create the client.

## Set a Client's Complexity Threshold

For how the threshold sets the band of a request, refer to
[The Complexity Threshold](../explanation/routing-behavior.md#the-complexity-threshold). The default is 50%.

1. In the workspace drop-down menu in the console header, select the client's workspace.

2. From the left main menu, select **Access & Policy**, and then select the **Clients** tab.

3. Select the client to open its detail panel, and then select the **Routing** tab.

4. On the **Semantic routing** card, move the **Complexity threshold** slider. The slider appears after at least one
   alias is set to **Use Semantic Router rules**, as described in [Set a Client's Routing](#set-a-clients-routing).

5. Select **Save**. The console confirms the value, such as `Complexity threshold saved at 40%.`

6. _(Optional)_ To return the client to the inherited value, select **Use default** under the slider, and then select
   **Save**.

## Return a Client to the Default Routing

Use these steps to remove a client's own routing, so that the client follows what it inherits again.

1. In the workspace drop-down menu in the console header, select the client's workspace.

2. From the left main menu, select **Access & Policy**, and then select the **Clients** tab.

3. Select the client to open its detail panel, and then select the **Routing** tab.

4. On the **Semantic routing** card, select **Use defaults**, and then select **Use defaults** in the **Use default
   semantic routing** dialog.

5. _(Optional)_ To also reset the threshold, select **Use default** under the **Complexity threshold** slider, and then
   select **Save**.

6. _(Optional)_ To also reset the alias mapping, select **Use defaults** on the **Tier map** card, and then select **Use
   defaults** in the **Use default alias routing** dialog.

## Turn On Decision Recording for a Policy

Use these steps to record the classified requests of every client in the workspaces that follow a policy. Only a
platform administrator can set recording, and it needs the semantic router running. For what is recorded, refer to
[Decision Recording](../explanation/routing-behavior.md#decision-recording).

1. From the left main menu, select **Access & Policy**, and then select the **Policies** tab.

2. Select **Create policy** to start a new policy, or open the three-dot menu on a policy's row and select **Edit**.

3. On the **Routing** step, in the **Decision recording** section, turn on **Record the classified turns of this
   policy's clients**.

4. _(Optional)_ In **Turns kept per client**, enter how many requests each client keeps. Leave it empty for the default
   of 1,000.

5. Select **Create policy**, or **Save changes** if you are editing a policy.

The **Recording** column on the **Policies** tab shows the setting, such as `Last 1,000 per client`. Every client in a
workspace that follows the policy is now recorded, except a client you exclude.

## Exclude a Client from Decision Recording

1. In the workspace drop-down menu in the console header, select the client's workspace.

2. From the left main menu, select **Access & Policy**, and then select the **Clients** tab.

3. Select the client to open its detail panel, and then select the **Routing** tab.

4. At the end of the tab, on the **Decision recording** card, turn off **Record this client's classified turns**.

The requests already recorded for the client stay available to download. To include the client again, turn the toggle
back on. To exclude a client while you create it, turn on **Override policy settings** in the **Add client** wizard, and
turn off the same toggle on its **Routing** step.

## Download the Recorded Requests

1. In the workspace drop-down menu in the console header, select the client's workspace.

2. From the left main menu, select **Access & Policy**, and then select the **Clients** tab.

3. Select the client to open its detail panel, and then select the **Routing** tab.

4. At the end of the tab, on the **Decision recording** card, select **Download CSV**.

## Delete the Recorded Requests

Deleting the recorded requests cannot be undone. Download them first if you need to keep them.

1. In the workspace drop-down menu in the console header, select the client's workspace.

2. From the left main menu, select **Access & Policy**, and then select the **Clients** tab.

3. Select the client to open its detail panel, and then select the **Routing** tab.

4. At the end of the tab, on the **Decision recording** card, select **Delete records**.

5. In the **Delete the recorded turns for `<client>`?** dialog, where `<client>` is the client's name, select **Delete
   Records**.

## Validate

1. From the left main menu, select **Settings**, and then select the **Configurations** tab. Confirm that the **Run the
   semantic router on this box**, **Refuse jailbreak attempts**, and **Scan prompts for personal data before they leave
   the box** toggles on the **Semantic router** card are in the states you set.

2. In the workspace drop-down menu in the console header, select the client's workspace.

3. From the left main menu, select **Access & Policy**, and then select the **Clients** tab. Confirm that the
   **Routing** column shows a count of routes, such as `3 routes`, for a client that has rules of its own. A client that
   inherits its routing shows `Default`, or a count followed by `· default`.

4. From the client, send a request that sets the model to `auto` or that names an alias set to **Use Semantic Router
   rules**.

5. From the left main menu, select **Usage**, and then select the **Overview** tab. Confirm that the **Semantic
   routing** table shows a row with the request's category, its **Complexity** band, and the model your rule names.

## Next Steps

- [Manage a Client's Model Access](./manage-client-model-access.md)
- [View Client Usage](./view-client-usage.md)
