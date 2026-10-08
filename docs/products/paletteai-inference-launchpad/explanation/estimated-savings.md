---
sidebar_label: "Estimated Savings"
title: "Estimated Savings"
description:
  "An explanation of the estimated savings figure in PaletteAI Inference Launchpad: where it appears, how it compares
  serving on the appliance with a frontier model, and how the per-client Savings column differs."
hide_table_of_contents: false
sidebar_position: 2.6
tags: ["paletteai-inference-launchpad", "explanation", "usage", "savings", "cost"]
keywords:
  [
    "launchpad",
    "ai",
    "usage",
    "savings",
    "estimated savings",
    "comparison model",
    "frontier model",
    "cache read",
    "estimated cost",
  ]
---

The **By Client** tab of the **Usage** page reports what serving on the appliance saved, compared with sending the same
traffic to a frontier model. The figure is an estimated saving. It is a comparison, not money returned. This page
explains where the figure appears, how the appliance calculates it, and how far you can trust each version of it.

The savings figure builds on the estimated cost of each request, which depends on the four per-model rates and on how
the appliance prices cache reads. For those, refer to [Usage Pricing](./usage-pricing.md).

## Where the Savings Figure Appears

The estimated savings figure appears in two places.

- A sentence under the **By Client** table covers every client. It reads, "Serving on-box instead of `<model>` has
  avoided about `<amount>` across all clients since this appliance was first started." A second sentence gives the
  figure against the other comparison model.

- A per-client **Savings** column reports an estimate for each client, using the coarser calculation described in
  [Per-Client Savings Column](#per-client-savings-column).

## How the Savings Figure Is Calculated

The comparison is against named frontier models, one Anthropic Opus-class model and one OpenAI GPT-class model. Their
names follow the operator's model aliases and appear in the sentence under the **By Client** table.

For every request served on the appliance, the appliance prices the same token mix at the comparison model's rates,
using the same split between fresh and cached tokens that the meter uses.

```text
comparison estimate = fresh input tokens × comparison input rate
                    + cache-read tokens  × comparison cache-read rate
                    + output tokens      × comparison output rate

savings = comparison estimate − estimated cost on the appliance
```

The comparison cache-read rate is the comparison model's **Cache read** rate. At the provider list prices, that rate is
one tenth of the comparison model's input rate. Filling a cache costs nothing on the appliance, so the comparison has no
cache-write term for locally served traffic. The estimated cost on the appliance is the request's metered cost at the
hosted model's rates, or $0 for a response cache hit.

The savings figure is never negative. A locally priced model whose rates exceed the comparison model's reports zero
savings, not a loss.

The comparison model's rates are the same provider list prices the appliance uses to price egress, so the savings figure
and the estimated egress cost quote the same numbers. If an operator overrides the comparison model's rates under
**Settings** > **Pricing**, the savings figure uses the override.

## Worked Example: Estimated Savings

This example uses illustrative rates for an Opus-class comparison model of $5.00 per 1 million input tokens, $0.50 per 1
million cache-read tokens, and $6.25 per 1 million cache-write tokens. These are example rates, not current list prices.
A locally served request sends a prompt of which the engine answers 400,000 tokens from cache and computes 500,000
fresh, with no output. To isolate the comparison, the example sets the request's estimated cost on the appliance to $0.

| **Step**                           | **Calculation**   | **Amount** |
| ---------------------------------- | ----------------- | ---------- |
| Fresh input at the input rate      | 500,000 × $5.00/M | $2.50      |
| Cache reads at the cache-read rate | 400,000 × $0.50/M | $0.20      |
| Comparison estimate                | $2.50 + $0.20     | $2.70      |
| Estimated savings                  | $2.70 − $0        | $2.70      |

The comparison has no cache-write term. The appliance never charges to fill its own cache, so the comparison does not
charge for it either, and the example's cache-write rate does not apply.

Earlier releases priced every prompt token in the comparison at the fresh input rate, which inflated the savings by the
share of the prompt answered from cache. The lower figure is the accurate one.

## Per-Client Savings Column

The per-client **Savings** column is a coarser estimate than the sentence under the table. It prices a client's whole
served prompt at the comparison model's fresh input rate, without the split between fresh and cached tokens. On
cache-heavy traffic, the per-client figures can therefore add up to more than the appliance-wide figure. Treat the
appliance-wide sentence as the accurate figure and the per-client column as an estimate.

## Resources

- [Usage Pricing](./usage-pricing.md) explains what estimated cost is, the four per-model rates, and how cache reads are
  priced.

- [Usage Metrics Reference](../reference/usage-metrics-reference.md#by-client-tab) defines the **$ Savings** column and
  the appliance-wide savings figure on the **By Client** tab.

- [View Client Usage](../how-to-guides/view-client-usage.md) walks through reading usage and savings for each client.

- [Frontier Providers](./frontier-providers.md) explains how traffic reaches a frontier provider.
