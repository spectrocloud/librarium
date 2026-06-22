---
sidebar_label: "Usage Metrics Reference"
title: "Usage Metrics Reference"
description:
  "Reference for the metrics on the Launchpad for AI Metrics page, including token usage, request volume, cost, active
  quotas, and their data sources."
hide_table_of_contents: false
sidebar_position: 60
tags: ["launchpad-for-ai", "metrics", "reference"]
---

The Metrics page reports token usage, request volume, cost, and active quotas for the appliance. To open it, select
**Metrics** from the left main menu, and then select the **Metrics** tab. This page describes each panel and where its
data comes from.

## Data Sources

| **Source**          | **Provides**                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| Gateway live totals | The headline totals, measured since boot. In a multi-node deployment, totals are cluster-wide.          |
| Built-in Prometheus | The time-series history behind each usage-over-time panel, scoped to the local node.                    |
| Grafana             | Long-term dashboards. The page links to Grafana when an externally reachable Grafana URL is configured. |

Prometheus is included and enabled by default. If Prometheus is unavailable, history panels show `history unavailable`
rather than estimated data. Tokens are measured from the engine `usage` block. Cost is calculated as tokens multiplied
by the per-model rate configured on the Pricing page.

## Time Windows

Usage-over-time panels support the following windows: `1h`, `6h`, `24h`, and `7d`.

## Panels

### Totals

Headline counters since boot. In a multi-node deployment, these are cluster-wide.

| **Metric**      | **Description**                                |
| --------------- | ---------------------------------------------- |
| `requests`      | Total requests served.                         |
| `input tokens`  | Tokens read in, including prompts and history. |
| `output tokens` | Tokens generated.                              |
| `total tokens`  | Input plus output tokens.                      |
| `est. cost`     | Estimated cost across all models.              |

### On-Box Token Breakdown

Explains why the total token count can be much larger than the tokens served locally. The total is the sum of fresh
input, on-box cache reads, and frontier egress, so a large gap between total and local usage is on-box cache reuse, not
data leaving the appliance.

| **Metric**                    | **Description**                                                 |
| ----------------------------- | --------------------------------------------------------------- |
| `total prompt (incl. cache)`  | All prompt tokens processed on the appliance.                   |
| `cache reads — served on-box` | Prompt tokens served from the engine cache.                     |
| `fresh input`                 | Newly computed tokens, equal to total prompt minus cache reads. |
| `frontier egress`             | Tokens that left the appliance to a frontier provider.          |

### Usage over Time

A time-series chart for a selected metric over a selected [time window](#time-windows). The available metrics are input
tokens per second, cumulative tokens, and cumulative requests.

### Token Usage by User

Per-user usage, with the highest-usage users listed first.

| **Column**      | **Description**                                                             |
| --------------- | --------------------------------------------------------------------------- |
| `user`          | The user the usage belongs to.                                              |
| `local input`   | Input tokens served on the appliance since boot.                            |
| `local output`  | Output tokens served on the appliance since boot.                           |
| `local total`   | Local input plus local output tokens.                                       |
| `local cost`    | Estimated cost of local usage.                                              |
| `egress tokens` | Tokens that left the appliance to a frontier provider, for the current day. |
| `egress cost`   | Estimated cost of egress usage for the current day.                         |

### Semantic Cache

Cache statistics, shown when the semantic cache is enabled.

| **Metric**     | **Description**                               |
| -------------- | --------------------------------------------- |
| `hit rate`     | Percentage of requests served from cache.     |
| `hits`         | Requests served from cache.                   |
| `misses`       | Requests not served from cache.               |
| `entries`      | Cached entries.                               |
| `tokens saved` | Tokens not recomputed because of cache hits.  |
| `cost saved`   | Estimated cost avoided because of cache hits. |

### Quotas

Active quotas and current usage against each limit. This panel appears only when at least one quota is configured.

| **Column**     | **Description**                                                                   |
| -------------- | --------------------------------------------------------------------------------- |
| `scope`        | Whether the quota applies to a `user` or a `model`.                               |
| `name`         | The user or model the quota applies to.                                           |
| `req / min`    | Requests used in the current minute, followed by the request limit if one is set. |
| `tokens today` | Tokens used in the current day, followed by the token limit if one is set.        |
| `cost today`   | Cost incurred in the current day, followed by the cost limit if one is set.       |

For how quotas are defined and enforced, refer to [Quota and Rate Limit Reference](./quota-and-rate-limit-reference.md).

### By Model

Per-model throughput and token usage, measured on this node since boot.

| **Column** | **Description**               |
| ---------- | ----------------------------- |
| `model`    | The model name.               |
| `engine`   | The serving engine.           |
| `requests` | Requests served by the model. |
| `input`    | Input tokens.                 |
| `output`   | Output tokens.                |
| `cost`     | Estimated cost.               |
| `avg`      | Average latency per request.  |
