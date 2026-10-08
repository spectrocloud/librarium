---
sidebar_label: "Usage Metrics Reference"
title: "PaletteAI Inference Launchpad Usage Metrics Reference"
description:
  "Reference for every filter, metric, table column, and export field on the Usage page of a PaletteAI Inference
  Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 4.7
tags: ["paletteai-inference-launchpad", "reference", "usage", "metrics"]
keywords: ["launchpad", "ai", "usage", "metrics", "tokens", "cost", "quota", "export", "csv", "pdf"]
---

This reference defines every filter, metric, and column on the **Usage** page of the appliance console, and the fields
of the usage report it exports. It supports the [View Token Usage](../how-to-guides/view-token-usage.md) how-to, which
walks through the tasks these figures serve.

Counts render in a compact form, such as `177.7K`. Hold the pointer over a compact figure to display the exact value.
Costs render to two decimal places in dollars.

## Page Filters

Both filters are in the page header and apply to whichever tab is open.

| **Filter**      | **Default**     | **What it does**                              | **Available on**              |
| --------------- | --------------- | --------------------------------------------- | ----------------------------- |
| **Client**      | All clients     | Scopes every figure on the tab to one client. | Overview, By Model            |
| **Data window** | **Last 7 days** | Sets the period the figures cover.            | Overview, By Model, By Client |

The **Client** filter is hidden on the **By Client** tab, where you scope by opening a client row, and on the **Quota
Usage** tab, which reports configured limits rather than usage over a period.

### Data Window Options

| **Option**       | **Period**               |
| ---------------- | ------------------------ |
| **Last 24h**     | The previous 24 hours.   |
| **Last 7 days**  | The previous seven days. |
| **Last 30 days** | The previous 30 days.    |

## Overview Tab

### Totals

| **Tile**          | **Definition**                                                                                                                                                                                                                                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **requests**      | Every request the appliance handled in the period, both local and external.                                                                                                                                                                                                                           |
| **input tokens**  | Tokens sent to the model, including the prompt, the system prompt, and the conversation history.                                                                                                                                                                                                      |
| **output tokens** | Tokens the model generated.                                                                                                                                                                                                                                                                           |
| **total tokens**  | Input tokens plus output tokens across every request in the period.                                                                                                                                                                                                                                   |
| **est. cost**     | The estimated cost of every request in the period, both local and external. The appliance multiplies each request's tokens by the per-model rates in effect when it served the request, with cached prompt tokens at the cache-read rate. Refer to [How Cost Is Calculated](#how-cost-is-calculated). |

### How Cost Is Calculated

Every model carries four rates, each in dollars per 1 million tokens. The estimated cost of a request is the sum of each
token count multiplied by its rate.

| **Rate**        | **Applies to**                                                                               | **Default for hosted models**       |
| --------------- | -------------------------------------------------------------------------------------------- | ----------------------------------- |
| **Input**       | Fresh input, which is the prompt tokens the engine computed rather than answered from cache. | $0.15                               |
| **Cache read**  | Prompt tokens answered from cache.                                                           | $0.015, one tenth of the input rate |
| **Output**      | Tokens the model generated.                                                                  | $0.60                               |
| **Cache write** | Prompt tokens written into a frontier provider's cache. Applies to egress only.              | Not applicable                      |

The appliance prices models routed to a frontier provider from that provider's published list prices. To view or
override the rate for any model, open **Settings** > **Pricing**. A blank **Cache read** or **Cache write** rate prices
those tokens at the input rate. A response cache hit adds $0, and the appliance records its tokens as cache reads.

The **Usage** page shows every dollar figure rounded to the cent. An amount greater than $0 but less than half a cent
shows as `<$0.01`, and a response cache hit, which costs $0, shows as `$0.00`.

For why the rates differ, how each level of caching is priced, and worked examples, refer to
[Usage Pricing](../explanation/usage-pricing.md).

### On-Box Token Breakdown

The card description reads "How much of each prompt was answered from cache on this box instead of computed again." A
total prompt figure much larger than the fresh input figure indicates cache reuse, not traffic leaving the appliance.

| **Tile**                       | **Definition**                                                                                                                                                                                                                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **total prompt (incl. cache)** | Every prompt token processed on the appliance, including tokens answered from cache.                                                                                                                                                                                                |
| **cache reads — on-box**       | Prompt tokens answered from cache on the appliance in the period, from the engine's prefix cache or, when it is turned on, the response cache. These tokens never left the appliance. The caption reads `<n>% of prompt · answered from cache`, or `no cache reads in this period`. |
| **fresh input**                | Prompt tokens computed fresh on the appliance, which is the total prompt minus the cache reads, including response cache hits. The caption reads `newly computed on-box (total − cache reads)`.                                                                                     |
| **egress**                     | Prompt and output tokens routed to an external provider or a registered external endpoint. This is a separate count from the on-box prompt total.                                                                                                                                   |

### Local vs External

| **Tile**                      | **Definition**                                                                                                                                                                               |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **kept on the Launchpad**     | The share of tokens served by the appliance's own engines, with the token count and the estimated cost of that locally served traffic.                                                       |
| **routed externally**         | The share of tokens routed to an external provider, with the token count and the cost.                                                                                                       |
| **external providers in use** | The number of distinct external providers that served traffic in the period.                                                                                                                 |
| **spilled at capacity**       | The share of requests that asked for local serving and went to an external provider because the appliance was at capacity. This tile appears only when the appliance reports capacity spill. |

The egress meter records tokens and cost but not a request count, so the external request count always reads `0`.

### Usage over Time

A stacked area chart of the input, output, and total token rates across the selected period, scoped by the **Client**
filter. The chart legend selects which series are drawn.

### Semantic Routing

Which model handled each request category, as classified by the semantic router.

<!-- vale off -->

| **Column**    | **Definition**                                                        |
| ------------- | --------------------------------------------------------------------- |
| **Category**  | The category the classifier assigned to the conversation.             |
| **Model**     | The model that handled requests in that category.                     |
| **Requests**  | Requests in that category.                                            |
| **Total tok** | Input plus output tokens for that category.                           |
| **Cost**      | Estimated cost for that category.                                     |
| **Avg conf**  | The classifier's average confidence in the category, as a percentage. |

<!-- vale on -->

## By Model Tab

One row per model that the appliance knows about. Selecting a row opens the clients that used that model.

| **Column**                | **Definition**                                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Model**                 | The model identifier.                                                                                           |
| **Location**              | Whether the model runs on the appliance, with its GPU hardware, or is reached through an external provider.     |
| **Requests**              | Requests the model served in the period.                                                                        |
| **Input / Output Tokens** | Input tokens and output tokens, reported as a pair. The figures are not summed.                                 |
| **Est. cost**             | Estimated cost for the model, at the model's rates. Refer to [How Cost Is Calculated](#how-cost-is-calculated). |
| **Avg latency**           | Average request latency in milliseconds.                                                                        |

A model that served no requests in the period renders dimmed, with `—` in place of its figures.

A row served by a registered external inference endpoint is labeled **External · egress** in the **Location** column,
alongside rows for built-in frontier providers. The tab does not split those two sources further.

### Model Detail View

| **Column**       | **Definition**                                            |
| ---------------- | --------------------------------------------------------- |
| **Client**       | A client that sent requests to this model.                |
| **Requests**     | The client's requests to this model.                      |
| **Total tokens** | The client's input plus output tokens for this model.     |
| **Local %**      | The share of those tokens served on the appliance.        |
| **External %**   | The share of those tokens routed to an external provider. |
| **Est. cost**    | Estimated cost of the client's traffic to this model.     |

## By Client Tab

One row per registered client. Selecting a row opens the client's API tokens.

| **Column**                  | **Definition**                                                                                                                                                                                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Client**                  | The client name. A client that has reached a quota limit also carries a blocked icon that names each limit reached.                                                                                                                                                                                     |
| **API Keys**                | The number of API tokens issued to the client, or `none`.                                                                                                                                                                                                                                               |
| **Local / Egress Requests** | Requests served on the appliance and requests routed externally, reported as a pair.                                                                                                                                                                                                                    |
| **Local / Egress Tokens**   | Tokens served on the appliance and tokens routed externally, reported as a pair.                                                                                                                                                                                                                        |
| **Total Local Quota**       | The client's total local token entitlement across the period, or `Unlimited` when the client carries no token limit.                                                                                                                                                                                    |
| **Local Quota Used**        | The share of that entitlement the client has spent. Reads `—` when there is no entitlement to measure against.                                                                                                                                                                                          |
| **$ Cost Local / Egress**   | Local cost and external cost, reported as a pair.                                                                                                                                                                                                                                                       |
| **$ Savings**               | A coarser estimate of the amount avoided by serving the client on the appliance. It prices the client's whole served prompt at the comparison model's fresh input rate, without the split between fresh and cached tokens, so on cache-heavy traffic it can read higher than the appliance-wide figure. |

Local and external figures are paired rather than summed, because a local quota and an external spend cap are separate
budgets. Hold the pointer over a paired cell to display which figure is which. **Egress** covers traffic to built-in
frontier providers and to registered external inference endpoints together. To identify which registered endpoint served
a request, open the **By Model** tab and look for the **External · egress** label.

The columns on this tab do not sort. To rank clients, export the table and sort it in a spreadsheet.

The appliance also reports estimated savings across all clients, against two comparison frontier models, measured since
the appliance first started. It reads, "Serving on-box instead of `<model>` has avoided about `<amount>` across all
clients since this appliance was first started. Against `<other-model>` the figure is `<amount>`." The figure is never
negative. Unlike the per-client **$ Savings** column, it prices cache reads separately from fresh input. For the
calculation and a worked example, refer to [Estimated Savings](../explanation/estimated-savings.md).

### Client Detail View

Four tiles summarize the open client.

| **Tile**          | **Definition**                                                         |
| ----------------- | ---------------------------------------------------------------------- |
| **local input**   | Input tokens the appliance served for this client.                     |
| **local output**  | Output tokens the appliance served for this client.                    |
| **egress tokens** | Tokens routed to an external provider or registered external endpoint. |
| **egress cost**   | External spend for this client.                                        |

The **API keys** table lists each of the client's tokens.

| **Column**                | **Definition**                                                       |
| ------------------------- | -------------------------------------------------------------------- |
| **Label**                 | The name given to the token at creation.                             |
| **Key**                   | The token's prefix. The full secret is shown only once, at creation. |
| **Status**                | Whether the token is active, expiring soon, expired, or revoked.     |
| **Last used**             | When the token last authenticated a request, or `never`.             |
| **Created**               | When the token was created.                                          |
| **Expires**               | When the token expires.                                              |
| **Requests**              | Requests made with this token.                                       |
| **Input / Output Tokens** | Input and output tokens for this token, reported as a pair.          |
| **Total Tokens**          | Input plus output tokens for this token.                             |
| **Cost**                  | Estimated cost of this token's traffic.                              |

A **Conversation routing** table follows, reporting which models handled the client's requests, with the requests, total
tokens, and cost for each.

:::info

Traffic from internal principals and service accounts carries no listed API token. When a client has such traffic, the
client detail view states how many requests and tokens it accounts for, so the API token rows do not have to add up to
the client's total.

:::

### Per-Token Metrics

Selecting an API token row opens a dialog reporting that token's usage over the selected period.

| **Tile**               | **Definition**                                                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **requests**           | Requests made with this token.                                                                                                                     |
| **input tokens**       | Input tokens for this token.                                                                                                                       |
| **output tokens**      | Output tokens for this token.                                                                                                                      |
| **total tokens**       | Input plus output tokens.                                                                                                                          |
| **cached tokens**      | Input tokens read from cache, on the appliance or on egress, including response cache hits. The detail reads `<n>% of input`, or `no cache reads`. |
| **est. cost**          | Estimated cost of this token's traffic.                                                                                                            |
| **avg / request**      | Average total tokens per request.                                                                                                                  |
| **avg cost / request** | Average estimated cost per request.                                                                                                                |
| **output : input**     | The ratio of output tokens to input tokens.                                                                                                        |
| **share of user**      | This token's share of the owning client's total tokens, compared with the client's other tokens.                                                   |

{/* NEEDS REVIEW: the tile label reads share of user, while every other surface on the page uses the term Client. Confirm whether the label is being renamed before this page publishes, or whether the docs should keep quoting user here. */}

A **Key details** section reports the token id, its owning client, the token prefix, its scope, and its creation,
expiry, and last-used times. A scope of `unrestricted` means the token reaches every model, provider, and tier its
owning client can reach, with no limit specific to the token.

:::info

A token that recorded requests but no tokens indicates requests that failed or returned no usage data. Per-token error
rates are not reported.

:::

## Quota Usage Tab

This tab reports consumption against each client's configured limits as it stands right now, so it takes no period. To
set the limits themselves, refer to [Set and Manage Client Quotas](../how-to-guides/manage-client-quotas.md).

| **Column**   | **Definition**                                                                              |
| ------------ | ------------------------------------------------------------------------------------------- |
| **Client**   | The client name. A client at 100 percent of a limit also carries a **Reached limit** badge. |
| **Requests** | A meter for each configured request limit, most-consumed first.                             |
| **Tokens**   | A meter for each configured token limit, most-consumed first.                               |
| **Cost**     | A meter for each configured cost limit, most-consumed first.                                |

Each meter reads as a percentage followed by its window, such as `62% /hr`. Meters that do not fit the column width
collapse behind a `+N` chip that lists the rest. These columns sort, and the table sorts by client name by default.

A dimension with no configured limit reports a state instead of meters.

| **State**        | **Meaning**                                                      |
| ---------------- | ---------------------------------------------------------------- |
| **Unlimited**    | No limit is set for that dimension.                              |
| **Not enforced** | Appliance-wide quota enforcement is off, so no limit is applied. |
| **Unknown**      | The limits could not be read. This is not the same as unlimited. |

When enforcement is on and one or more clients have reached a limit, a banner names them and states that further
requests are throttled until each window resets or the limit is raised. When enforcement is off, a notice states that
client usage is recorded but not enforced.

### Client Quota Detail View

Selecting a client row reports its limits in full, grouped into **Requests**, **Tokens**, and **Cost** cards. Each limit
reports the share consumed, the amount consumed against the limit, the amount remaining, a progress bar, and when the
window next resets. Windows appear shortest first.

An **Increase limit** control appears on each limit that can be raised. Raising a limit is a two-step action: the first
selection previews the change, and **Confirm & Apply** commits it.

## Export Fields

The **By Client** tab exports as CSV or PDF. Both formats carry the same columns, taken from the rows on screen for the
period on screen. Files are named `usage-by-client-<timestamp>.<extension>`.

Each file opens with the report name, the period the figures cover, a note when the figures cover a shorter period than
the one requested, and the time the file was generated.

| **Field**                | **Definition**                                                           |
| ------------------------ | ------------------------------------------------------------------------ |
| **Client**               | The client name.                                                         |
| **API keys**             | The number of API tokens issued to the client.                           |
| **Local requests**       | Requests served on the appliance.                                        |
| **Frontier requests**    | Requests routed to an external provider.                                 |
| **Local tokens**         | Tokens served on the appliance.                                          |
| **Frontier tokens**      | Tokens routed to an external provider.                                   |
| **Total local quota**    | The client's total local token entitlement, or `Unlimited`.              |
| **Local quota used (%)** | The share of that entitlement spent. Empty when there is no entitlement. |
| **Cost local (USD)**     | Cost of locally served traffic.                                          |
| **Cost frontier (USD)**  | Cost of externally routed traffic.                                       |
| **Savings (USD)**        | Estimated amount avoided by serving on the appliance.                    |
| **Limits reached**       | Whether the client has reached a quota limit.                            |

Local and external figures are separate columns because they are separate budgets. Adding them together is not
meaningful.

The export names its external columns **Frontier**, while the on-screen table names the same figures **Egress**. The two
terms refer to the same traffic: requests and tokens that left the appliance.

The two formats differ in how they carry values. CSV cells hold bare numbers so a spreadsheet can total or pivot them.
PDF cells hold the formatted value with its unit, for a reader.

## Usage Fields in API Responses

API responses report the split between fresh and cached prompt tokens the same way the meter does.

<!-- vale Vale.Spelling = NO -->

| **Field**                             | **Meaning**                                                                                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `prompt_tokens_details.cached_tokens` | In OpenAI-compatible responses, the prompt tokens answered from cache.                                    |
| `input_tokens`                        | In Anthropic-compatible `/v1/messages` responses, only the uncached part of the prompt.                   |
| `cache_read_input_tokens`             | In Anthropic-compatible `/v1/messages` responses, the prompt tokens read from cache.                      |
| `cache_creation_input_tokens`         | In Anthropic-compatible `/v1/messages` responses, the prompt tokens written to a cache, where it applies. |

In Anthropic-compatible responses, `input_tokens`, `cache_read_input_tokens`, and `cache_creation_input_tokens` always
add up to the total prompt the engine served.

<!-- vale Vale.Spelling = YES -->

## Period Coverage Notes

Not every figure can always cover the period requested. When a figure covers a shorter span, the console displays a note
on that card naming the span it does cover and why. The most common causes are a client that has existed for less time
than the period requested, and an appliance that does not accept the requested window.

The **Quota Usage** tab is exempt, because its counters are point-in-time rather than accumulated over a period. Each
limit there reports when its own window resets.

## Resources

- [View Token Usage](../how-to-guides/view-token-usage.md)
- [View Client Usage](../how-to-guides/view-client-usage.md)
- [Set and Manage Client Quotas](../how-to-guides/manage-client-quotas.md)
- [Clients and Quotas](../explanation/clients-and-quotas.md)
- [Usage Pricing](../explanation/usage-pricing.md)
- [Estimated Savings](../explanation/estimated-savings.md)
