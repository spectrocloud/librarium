---
sidebar_label: "Usage Pricing"
title: "Usage Pricing"
description:
  "An explanation of usage pricing in PaletteAI Inference Launchpad: what estimated cost is, the four per-model rates,
  and how cache reads, cache writes, and response cache hits are priced."
hide_table_of_contents: false
sidebar_position: 2.5
tags: ["paletteai-inference-launchpad", "explanation", "usage", "pricing", "cost"]
keywords:
  [
    "launchpad",
    "ai",
    "usage",
    "pricing",
    "estimated cost",
    "cache read",
    "cache write",
    "prefix cache",
    "response cache",
  ]
---

Every request a PaletteAI Inference Launchpad appliance serves carries an estimated cost. The figure depends on how the
appliance prices each kind of token, and on how much of each prompt was answered from cache instead of computed again.
This page explains what the estimated cost is, the four rates that produce it, and how each level of caching affects it.
Read it to interpret the cost figures on the **Usage** page, or before you change the rates under **Settings** >
**Pricing**.

The **Usage** page also reports what serving on the appliance saved compared with a frontier model. For how that figure
is calculated, refer to [Estimated Savings](./estimated-savings.md).

For the definition of each tile and column that reports these figures, refer to
[Usage Metrics Reference](../reference/usage-metrics-reference.md).

## What Estimated Cost Is

The estimated cost, shown as **est. cost** in the console, is the number of tokens a request used multiplied by the
rates in effect when the appliance served that request. It is an estimate for planning and visibility. It is not a bill,
and the appliance does not issue invoices.

The estimate covers every request the appliance handles. Models hosted on the appliance carry their own rates, so the
figure includes locally served traffic as well as traffic routed to a frontier provider or a registered external
endpoint.

## Four Per-Model Rates

The appliance prices each model with four rates, each in dollars per 1 million tokens.

| **Rate**        | **Applies to**                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------- |
| **Input**       | Fresh input, which is the prompt tokens the engine computed rather than answered from cache.    |
| **Cache read**  | Prompt tokens answered from cache.                                                              |
| **Output**      | Tokens the model generated.                                                                     |
| **Cache write** | Prompt tokens written into a provider's cache, for providers that charge to do so. Egress only. |

The estimated cost of one request is the sum of four products.

```text
est. cost = fresh input tokens × input rate
          + cache-read tokens  × cache-read rate
          + output tokens      × output rate
          + cache-write tokens × cache-write rate
```

The cache-write term applies only where a provider charges for cache writes. For locally served traffic, it is always
zero.

### Where the Rates Come From

| **Source**           | **Applies to**                       | **Detail**                                                                                                                                                                                                                                                                                             |
| -------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Default rates        | Models hosted on the appliance       | The appliance ships with default rates for hosted models, with the cache-read rate at one tenth of the input rate. A deployment can set different defaults at install time. For the default values, refer to [How Cost Is Calculated](../reference/usage-metrics-reference.md#how-cost-is-calculated). |
| Provider list prices | Models routed to a frontier provider | The appliance prices these models from the provider's published list prices, including its cache tiers. For example, one provider prices cache reads at a tenth of its input rate and prices cache creation above its input rate.                                                                      |
| Operator overrides   | Any model                            | An operator can view and override every rate for a model under **Settings** > **Pricing**, including **Cache read** and **Cache write**. A blank cache-read or cache-write rate means the appliance prices those tokens at the model's input rate.                                                     |

The default rates for hosted models are a generic on-premises estimate. They do not represent the real cost of your
hardware, power, or operations. Provider list prices change over time, so this page does not reproduce them. For the
rates in effect on your appliance, open **Settings** > **Pricing**.

### Why Hosted Models Carry a Cost

A model hosted on the appliance runs on hardware and software that you already own, so its estimated cost is not money
that you pay. The appliance still prices its tokens, for two reasons.

The first reason is cost limits. A client can carry a quota on the **cost** dimension, and that limit counts the
estimated cost of the client's traffic. If hosted models had no rate, every locally served request would add $0 to that
count, so a cost limit could never restrict traffic that stays on the appliance. A rate for hosted models makes a cost
limit apply to local traffic as well as to traffic that leaves the appliance. For how quotas work, refer to
[Quotas](./clients-and-quotas.md#quotas).

The second reason is shared capacity. The appliance's GPUs serve every client, so the tokens that one client uses take
capacity that another client cannot use at the same time. The default rates are a generic estimate of what that shared
capacity costs per token. The estimated cost then shows how much of the appliance each client consumes, in the same unit
as traffic routed to a frontier provider.

Because the default rates are an estimate, an operator can override the rates for any hosted model under **Settings** >
**Pricing**, and a deployment can set different defaults at install time. Lower rates for hosted models also lower the
estimated cost that counts toward each client's cost limits.

## Three Levels of Caching

To answer a request, the engine does two jobs. It first reads the whole prompt, which is the expensive step for a long
prompt. It then writes the answer one token at a time. The appliance reuses work at three levels, and the levels differ
in which of those jobs they skip, what has to match, and how long they keep their work. Two of them count toward the
cache reads that the **Usage** page reports.

| **Aspect**            | **Response cache**                                                                | **Prefix cache**                                                    | **KV cache**                                                           |
| --------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **What it keeps**     | A whole stored answer.                                                            | The engine's reading of the opening of an earlier prompt.           | The engine's reading of the prompt and of the answer so far.           |
| **When it is reused** | The same client sends an identical request. One character differs, and it misses. | A later prompt starts with the same tokens as an earlier one.       | For every token the engine writes, within one request.                 |
| **Work it skips**     | Both jobs. The engine does not run.                                               | Reading the repeated opening. The engine still writes a new answer. | Rereading the prompt and the answer so far for each new token.         |
| **How long it lasts** | 60 minutes by default.                                                            | Until the engine needs the memory for other requests.               | Until the request finishes.                                            |
| **Default**           | Off.                                                                              | On.                                                                 | Always on.                                                             |
| **On the Usage page** | Counted as cache reads, at $0.                                                    | Counted as cache reads, at the cache-read rate.                     | Not reported. Each engine keeps its own, and the meter cannot read it. |

The prefix cache and the KV cache hold the same kind of data. The prefix cache is the part of a finished request's KV
cache that the engine keeps, so that a later prompt with the same opening can reuse it.

The **Usage** page describes the combined reuse from the response cache and the prefix cache as tokens _answered from
cache_. For more on the engine's working cache, refer to the [KV cache](../reference/glossary.md#kv-cache) entry in the
Glossary.

### Cache-Read Pricing

When the engine answers prompt tokens from its prefix cache, it skips the computation for those tokens. The appliance
reflects that saving by pricing them at the cache-read rate instead of the input rate, which mirrors how frontier
providers price cached input.

<!-- vale Vale.Spelling = NO -->

This matters most for coding agents. A coding agent resends its long conversation context on every turn, so most of each
prompt is a prefix the engine has already seen. On that kind of traffic, cache reads make up most of the prompt, and the
cache-read rate lowers the estimated cost substantially. Earlier releases priced cached tokens at the full input rate,
so the estimated cost of a cache-heavy workload is several times lower than it was in those releases. On a real
repeated-prompt workload, the measured drop was about six times. The lower figure is correct and does not indicate a
metering fault.

<!-- vale Vale.Spelling = YES -->

### The Response Cache

The response cache stores whole answers and replays a stored answer when the same request arrives again. It is an
administrator setting that is off by default. An administrator turns it on, and sets how long a stored answer stays
valid, in the response cache section of **Settings** > **Configurations**. A stored answer expires after 60 minutes by
default.

Matching is exact. Two prompts that differ by even one character are different requests, so the appliance never serves a
stored answer for a different question.

A response cache hit is free. The appliance records the tokens of the replayed request, all as cache reads, but adds $0
to the estimated cost. When the response cache is on, the cache reads tile on the **Usage** page counts these hits
together with prefix-cache reads. When the response cache is off, only the prefix cache contributes.

### Cache Writes

Filling the engine's own caches costs nothing on the appliance, so locally served traffic never carries a cache-write
charge. Cache-write charges arise only on egress, for frontier providers that charge to write a prompt into their cache.
The appliance prices those tokens at the model's **Cache write** rate.

## Worked Example: Estimated Cost

This example uses the default rates for a model hosted on the appliance, $0.15 per 1 million input tokens, $0.015 per 1
million cache-read tokens, and $0.60 per 1 million output tokens. A request sends a 10,000-token prompt, of which the
engine answers 9,600 tokens from cache, and the model generates 60 output tokens.

| **Pricing**                                 | **Calculation**                                 | **Estimated cost** |
| ------------------------------------------- | ----------------------------------------------- | ------------------ |
| Cached tokens priced at the input rate      | 10,000 × $0.15/M + 60 × $0.60/M                 | About $0.00154     |
| Cached tokens priced at the cache-read rate | 400 × $0.15/M + 9,600 × $0.015/M + 60 × $0.60/M | About $0.00024     |

Pricing the 9,600 cached tokens at the cache-read rate makes the request about six times cheaper to estimate. The first
row is how earlier releases priced the same request.

In the console, this request shows as `<$0.01`, because the **Usage** page
[rounds dollar figures to the cent](../reference/usage-metrics-reference.md#how-cost-is-calculated).

## Where Each Figure Appears

Cost, cache reads, and savings each appear in more than one place on the **Usage** page. Every figure comes from the
same record of each request's fresh input, cache reads, and output tokens. The appliance prices that record at the rates
in effect when it served the request, so the figures agree with each other. The per-client **Savings** column is the
exception, because it uses a coarser calculation.

Estimated cost appears as **est. cost** on the **Overview** tab, per model on the **By Model** tab, and per API key. The
**kept on the Launchpad** tile and the **By Client** tab report the cost of locally served traffic. Cache reads appear
in the **On-box token breakdown** card and in the **cached tokens** tile for each API key. For where the savings figures
appear, refer to [Estimated Savings](./estimated-savings.md#where-the-savings-figure-appears). For the tile-by-tile
definitions, refer to [Usage Metrics Reference](../reference/usage-metrics-reference.md).

When the appliance answers a request, the response includes a usage summary that the client application reads, such as
Claude Code. The summary splits the prompt into fresh input and cache reads the same way the **Usage** page does. For
the request in [Worked Example: Estimated Cost](#worked-example-estimated-cost), it reports 9,600 cached tokens and 400
fresh input tokens. A coding agent that tracks its own usage therefore shows the same split as the **Usage** page. For
the exact field names in each API format, refer to
[Usage Fields in API Responses](../reference/usage-metrics-reference.md#usage-fields-in-api-responses).

## How It Fits Together

A single coding-agent turn served on the appliance ties these ideas together.

<!-- vale Vale.Spelling = NO -->

1. The agent resends its conversation with one new message. Most of the prompt is a prefix the engine has already seen.

2. If the response cache is on and an identical request arrived within the expiry, the appliance replays the stored
   answer. The appliance records the tokens as cache reads at $0.

3. Otherwise, the engine answers the repeated prefix from its prefix cache and computes only the new part fresh.

4. The appliance prices the fresh input, cache reads, and output tokens at the model's rates to produce the estimated
   cost.

5. The appliance prices the same token mix at the comparison model's rates, and the difference adds to the
   [estimated savings](./estimated-savings.md).

<!-- vale Vale.Spelling = YES -->

A turn routed to a frontier provider follows the same pricing, at that provider's rates, and can also carry a
cache-write charge where the provider applies one. It adds no savings, because the request did not stay on the
appliance.

## Resources

- [Estimated Savings](./estimated-savings.md) explains how the estimated savings figure is calculated and how far you
  can trust it.

- [Usage Metrics Reference](../reference/usage-metrics-reference.md) defines every tile, column, and export field that
  reports cost, cache reads, and savings.

- [View Token Usage](../how-to-guides/view-token-usage.md) walks through reading the **Overview** and **By Model** tabs.

- [View Client Usage](../how-to-guides/view-client-usage.md) walks through reading usage and savings for each client.

- [Clients and Quotas](./clients-and-quotas.md) explains how the appliance meters each client's usage, including cost.

- [Frontier Providers](./frontier-providers.md) explains how traffic reaches a frontier provider.

- [Glossary](../reference/glossary.md) defines the KV cache and other terms used on this page.
