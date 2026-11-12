---
sidebar_label: "Prompt Cache Sharing"
title: "Prompt Cache Sharing"
description:
  "How the policy a workspace follows decides which clients share the prompt cache, why workspaces never share, how
  sharing works on two or more nodes, and the timing side channel that sharing opens."
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
    "multi-node",
    "cache reads",
  ]
---

Before a model answers, its inference engine reads the whole prompt. This reading takes time and GPU work. The engine
saves this work. When a later prompt has the same opening, the engine reuses the saved work and does not read that text
again. This saved work is the _prompt cache_. The [Usage Pricing](./usage-pricing.md#three-levels-of-caching) page calls
it the prefix cache.

The [policy](../reference/glossary.md#policy) that a workspace follows decides which clients can reuse each other's
saved work. This page explains the two choices, the rules that always apply, sharing on two or more nodes, and the risk
that sharing brings. To change the setting, refer to
[Set Prompt Cache Sharing for a Policy](../how-to-guides/set-prompt-cache-sharing.md). For the console labels, refer to
[Access and Policy Reference](../reference/access-and-policy-reference.md#policies-tab).

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

| **Choice**                     | **Column value** | **Who reuses saved work**                                                                                                          |
| ------------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Share within the workspace** | **Workspace**    | All clients in the workspace share one prompt cache [per node](#models-on-two-or-more-nodes).                                      |
| **Each client is isolated**    | **Each client**  | Each client has its own prompt cache [per node](#models-on-two-or-more-nodes). It reuses only the work saved for its own requests. |

**Share within the workspace** is the default. Every policy uses it until an administrator selects **Each client is
isolated**.

These rules apply under both choices:

- Clients in different workspaces never share. This is true even when both workspaces follow the same policy.

- All API tokens of one client share the same cache.

- The workspace decides, not the person or the group. A request carries a client's API token, not a person's identity.
  When one person owns clients in two workspaces, each client follows the setting of its own workspace.

- One model never reuses work that another model saved.

There is no setting for a single client. To isolate some clients while the rest of their team shares, create those
clients in a separate workspace. Make that workspace follow a policy that uses **Each client is isolated**. A client
cannot move between workspaces. To isolate an existing client, create a new client in that workspace and give it new API
tokens.

## Models on Two or More Nodes

A model can run on two or more nodes. Each node runs its own inference engine for the model. Each engine keeps its own
prompt cache. Saved work never leaves the node that saved it. For how you choose the nodes that run a model, refer to
[Model Placement](./model-placement.md).

### How Requests Reach a Node

A _conversation_ is a set of requests that carry the same session ID. The appliance sends each conversation to one node.
The conversation stays there until its 1-hour window ends.

- Requests from one client that carry no session ID count as one conversation.

- Each conversation has its own minute past the hour, such as 17 minutes past. Its window always ends at that minute.
  The time of the first request does not change the minute.

- The appliance works out the minute from a hash of the conversation's ID. That ID is the session ID. For requests with
  no session ID, it is the client's ID. Conversations usually get different minutes, so their windows end at different
  times.

- As a result, a new conversation can have less than 1 hour left on its node. For example, a conversation whose minute
  is 17 minutes past sends its first request at 10:50. Its window ends at 11:17, so it has 27 minutes left.

- When the window ends, the appliance picks a node again. The conversation might stay on its node or move to another
  one. After a move, the new node does not have this conversation's saved work. The next request saves it there again.
  Later requests reuse the work saved on that node.

### Who Shares on Two or More Nodes

Each choice applies on each node separately.

- Under **Share within the workspace**, two clients in the workspace share saved work only when their conversations
  reach the same node. Two clients are two conversations, so they can reach different nodes.

- Under **Each client is isolated**, a client reuses its own saved work only on the node that saved it. Two sessions of
  one client are two conversations, so they can reach different nodes.

On a model that runs on one node, every conversation reaches that node. The table in
[Who Shares the Prompt Cache](#who-shares-the-prompt-cache) applies as written.

### Why a Repeated Prompt Shows No Cache Reads

The console shows cache reads from the engine that answered the request. A request that reaches a node without the saved
work reports zero cache reads. This happens even when another node saved the same opening.

This is expected, not a fault in the cache. It comes from how the appliance spreads requests across nodes. The console
does not show which node answered a request. To compare the nodes, refer to
[Troubleshoot a Repeated Prompt with No Cache Reads](../how-to-guides/set-prompt-cache-sharing.md#troubleshoot-a-repeated-prompt-with-no-cache-reads).

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

A saved change usually reaches every workspace that follows the policy within seconds. The appliance also checks for
changes every 5 minutes. Clients keep their API tokens, and nothing needs to restart. Moving a workspace to a policy
with a different choice works the same way.

After a change, the engine does not reuse work that it saved under the earlier choice. For the first request with a
given opening, the engine reads that text again. If you switch back to an earlier choice, the engine can reuse work from
that time that it still holds.

## Resources

- [Set Prompt Cache Sharing for a Policy](../how-to-guides/set-prompt-cache-sharing.md) walks through changing the
  setting on an existing policy and choosing it on a new one. It also covers a repeated prompt with no cache reads.

- [Model Placement](./model-placement.md) explains how you choose the nodes that run a model.

- [Clients and Quotas](./clients-and-quotas.md#workspaces-and-access) explains workspaces, policies, and what a client
  inherits from its workspace.

- [Usage Pricing](./usage-pricing.md) explains how the appliance reuses work and how cache reads are priced.

- [Access and Policy Reference](../reference/access-and-policy-reference.md#policies-tab) lists the columns and controls
  on the **Policies** tab.
