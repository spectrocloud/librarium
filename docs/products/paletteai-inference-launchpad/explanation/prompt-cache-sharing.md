---
sidebar_label: "Prompt Cache Sharing"
title: "Prompt Cache Sharing"
description:
  "How the policy a workspace follows decides which clients share the prompt cache, why workspaces never share, and the
  timing side channel that sharing opens."
hide_table_of_contents: false
sidebar_position: 2.2
tags: ["paletteai-inference-launchpad", "explanation", "policy", "cache"]
keywords:
  [
    "launchpad",
    "ai",
    "prompt cache",
    "prefix cache",
    "cache sharing",
    "policy",
    "workspace",
    "side channel",
    "isolation",
  ]
---

Before a model answers, its inference engine reads the whole prompt. This reading takes time and GPU work. The engine
saves this work. When a later prompt has the same opening, the engine reuses the saved work and does not read that text
again. This saved work is the _prompt cache_. The [Usage Pricing](./usage-pricing.md#three-levels-of-caching) page calls
it the prefix cache.

The [policy](../reference/glossary.md#policy) that a workspace follows decides which clients can reuse each other's
saved work. This page explains the two choices, the rules that always apply, and the risk that sharing brings. To change
the setting, refer to [Set Prompt Cache Sharing for a Policy](../how-to-guides/set-prompt-cache-sharing.md). For the
console labels, refer to [Access and Policy Reference](../reference/access-and-policy-reference.md#policies-tab).

## Why Sharing Helps

[Coding assistants](../reference/glossary.md#coding-assistant) often start every request with the same long text, such
as a system prompt and tool definitions. Sharing lets a second client reuse the work that the engine saved for the first
client. This has two effects:

- The second client gets the first part of its response sooner.

- The engine spends less GPU time reading the same text again.

Sharing also changes the estimated cost of a request. The appliance prices tokens read from the cache at the cache-read
rate, not the input rate. These tokens count toward the client that reused them. The estimated cost of the first
client's request does not change. For how cache reads are priced, refer to [Usage Pricing](./usage-pricing.md).

## Who Shares the Prompt Cache

The **Prompt cache sharing** field on a policy offers two choices. The **Cache sharing** column on the **Policies** tab
shows each choice as a shorter value.

| **Choice**                     | **Column value** | **Who reuses saved work**                                    |
| ------------------------------ | ---------------- | ------------------------------------------------------------ |
| **Share within the workspace** | **Workspace**    | All clients in the workspace share one prompt cache.         |
| **Each client is isolated**    | **Each client**  | Each client reuses only the work saved for its own requests. |

**Share within the workspace** is the default. Every policy uses it until an administrator selects **Each client is
isolated**.

These rules apply under both choices:

- Clients in different workspaces never share. This is true even when both workspaces follow the same policy.

- All API tokens of one client share the same cache.

- The workspace decides, not the person or the group. A request carries a client's API token, not a person's identity.
  When one person owns clients in two workspaces, each client follows the setting of its own workspace.

- One model never reuses work that another model saved.

- A client that is in no workspace keeps its own cache.

There is no setting for a single client. To isolate one client while the rest of its team shares, create that client in
a workspace of its own. A client cannot move between workspaces. To isolate an existing client, create a new client in a
workspace of its own and give it new API tokens.

## The Timing Side Channel

Sharing lets one client learn something about another client in the same workspace. If another client already sent the
same opening, the engine skips that work. The client that sends the later request can notice this in two ways:

- The first part of the response arrives sooner.

- The response reports cached tokens in its usage.

The client cannot read the other client's text or answer directly. It learns only that another client in its workspace
already sent the same opening, which is enough to confirm a guess. For example, a client can send an opening that it
thinks another client used. If the cached tokens in the response cover the guessed text, the guess was right.

While **Share within the workspace** is selected, the console shows this risk in an alert above the **Prompt cache
sharing** field.

Choose **Each client is isolated** when the clients in one workspace must not learn this about each other. Put teams
that must keep their work private from each other in separate workspaces.

## What Cache Sharing Does Not Cover

The setting controls only the prompt cache on the appliance. It does not affect the following:

- The response cache, which saves whole answers. A saved answer never goes to another client. For details, refer to
  [The Response Cache](./usage-pricing.md#the-response-cache).

- Requests to an external inference endpoint. These requests do not use the appliance's prompt cache. The endpoint
  follows its own caching rules. For details, refer to [External Inferencing](./frontier-providers.md).

## When a Change Takes Effect

A saved change reaches every workspace that follows the policy within 5 minutes. Clients keep their API tokens, and
nothing needs to restart. Moving a workspace to a policy with a different choice works the same way.

After a change, the engine does not reuse work that it saved under the earlier choice. For the first request with a
given opening, the engine reads that text again. If you switch back to an earlier choice, the engine can reuse work from
that time that it still holds.

## Resources

- [Set Prompt Cache Sharing for a Policy](../how-to-guides/set-prompt-cache-sharing.md) walks through changing the
  setting on an existing policy and choosing it on a new one.

- [Clients and Quotas](./clients-and-quotas.md#workspaces-and-access) explains workspaces, policies, and what a client
  inherits from its workspace.

- [Usage Pricing](./usage-pricing.md) explains how the appliance reuses work and how cache reads are priced.

- [Access and Policy Reference](../reference/access-and-policy-reference.md#policies-tab) lists the columns and controls
  on the **Policies** tab.
