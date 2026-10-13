---
sidebar_label: "Estimated Savings"
title: "Estimated Savings"
description:
  "An explanation of estimated savings in PaletteAI Inference Launchpad: how the appliance compares serving on the
  appliance with a frontier model, and where to find the figure."
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

PaletteAI Inference Launchpad estimates how much you save by serving inference on the appliance instead of sending the
same traffic to a frontier model. The estimate is a comparison, not money returned. This page explains how the appliance
calculates it and where to find it.

The savings figure builds on the estimated cost of each request, which depends on the four per-model rates and on how
the appliance prices cache reads. For those, refer to [Usage Pricing](./usage-pricing.md).

## How Estimated Savings Are Calculated

The comparison is against two fixed frontier models, Anthropic Claude Opus 4.8 and OpenAI GPT-5. Client model aliases do
not change which models the comparison uses.

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

This example uses illustrative rates for the Opus 4.8 comparison of $5.00 per 1 million input tokens, $0.50 per 1
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

## Where to Find Your Savings

To view the figure, select **Overview** from the left main menu. The **Estimated savings** card reports two figures,
**saved vs Opus 4.8** and **saved vs GPT-5**, for the period selected on the page. A chart beside them plots both
figures across that period. The card does not appear when the appliance served no requests in the period. The **Edit
Model Pricing** link on the card opens **Settings** > **Pricing**.

The **By Client** export on the **Usage** page also carries both figures in its header. For the export layout, refer to
[Usage Metrics Reference](../reference/usage-metrics-reference.md#export-fields).

## Resources

- [Usage Pricing](./usage-pricing.md) explains what estimated cost is, the four per-model rates, and how cache reads are
  priced.

- [Usage Metrics Reference](../reference/usage-metrics-reference.md#export-fields) describes the savings figures in the
  **By Client** export.

- [View Client Usage](../how-to-guides/view-client-usage.md) walks through reading usage for each client.

- [Frontier Providers](./frontier-providers.md) explains how traffic reaches a frontier provider.
