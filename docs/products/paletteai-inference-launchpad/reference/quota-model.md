---
sidebar_label: "Quota Model"
title: "Quota Model"
description:
  "Reference diagram showing how Clients, API tokens, quotas, and models relate on a PaletteAI Inference Launchpad
  appliance, with a lookup table mapping console labels to the underlying CRD names, cardinality, and per-request
  attribution."
hide_table_of_contents: false
sidebar_position: 1.5
tags: ["paletteai-inference-launchpad", "reference", "clients", "quotas", "api-keys", "crd"]
keywords:
  [
    "launchpad",
    "ai",
    "clients",
    "quota",
    "api key",
    "ModelClient",
    "ModelGroupAPIKey",
    "ModelGroupQuota",
    "QuotaSettings",
    "attribution",
  ]
---

Use this page as a lookup surface to answer "what does this key grant, what does this quota bound, who is billed for
this token." For the mental model behind these relationships, refer to
[Clients and Quotas](../explanation/clients-and-quotas.md).

## Hierarchy Diagram

The following diagram shows the CRDs that make up the quota model and the cardinality between them.

![Hierarchy diagram of the quota model: QuotaSettings owns every API token; a Client (ModelClient) can hold many API tokens (ModelGroupAPIKey); each token references one Secret for its value and one Quota (ModelGroupQuota) as its charging target; the Quota selects Models by label; the Quota can optionally hold frontier egress provider keys and budget.](/assets/docs/images/quota-model_hierarchy.webp)

## Entities

The console shows a client-centric view. The CRD names are what an operator sees in `kubectl` output and in
`Access & Policy` search results.

| Console label           | CRD                                      | Scope                                  | Purpose                                                                               |
| ----------------------- | ---------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------- |
| Client                  | `ModelClient`                            | `Namespaced`                           | One consumer of the box. Holds the client's routing overlay and egress policy.        |
| API token               | `ModelGroupAPIKey` + Kubernetes `Secret` | `Cluster` (key), `Namespaced` (secret) | A bearer credential mapped to an entry quota and an allow-list of models.             |
| Quota                   | `ModelGroupQuota`                        | `Namespaced`                           | A budget over a label-matched set of models. Also holds frontier egress config.       |
| _(system, no UI label)_ | `QuotaSettings`                          | `Cluster` singleton                    | Global master switch: `spec.quotaEnabled` turns quota enforcement on or off box-wide. |
| Model                   | `Model`                                  | `Namespaced`                           | An inference model the appliance serves, selected by label from a Quota.              |

## Cardinality

| From               | To                  | Cardinality | Wired by                                             |
| ------------------ | ------------------- | ----------- | ---------------------------------------------------- |
| `ModelClient`      | `ModelGroupAPIKey`  | 1 to N      | `spec.clientRef` back-reference on the API key       |
| `ModelGroupAPIKey` | Kubernetes `Secret` | 1 to 1      | `spec.apiKeySecretRef`                               |
| `ModelGroupAPIKey` | `ModelGroupQuota`   | N to 1      | `spec.modelGroupQuotaRef` (entry quota)              |
| `ModelGroupAPIKey` | Model allow-list    | 1 to N      | `spec.scope.models` (list of names the key may call) |
| `ModelGroupQuota`  | `Model`             | N to N      | `spec.modelSelector` (Kubernetes label selector)     |
| `QuotaSettings`    | `ModelGroupAPIKey`  | 1 to N      | Kubernetes owner reference                           |
| `ModelGroupQuota`  | Frontier egress     | 1 to 1      | `spec.frontier` (optional; provider keys and budget) |

Two same-key edges to watch:

- **Membership is label-based, not name-based.** A `Model` belongs to a `ModelGroupQuota` when its labels match
  `modelSelector`. A single `Model` can match several quotas at once, and adding a label to a `Model` moves it under
  every quota whose selector matches, live.
- **Frontier egress attaches to the `ModelGroupQuota`, not to the `ModelClient`.** The `ModelClient` controls whether
  frontier egress is enabled for the client. The provider credential and the daily budget live on the `ModelGroupQuota`
  the client's key references. The console groups both under the client's `Egress` panel.

## Quota States in the Console

Every quota row in the console reads one of four states.

| State         | Meaning                                                                                                         | Action         |
| ------------- | --------------------------------------------------------------------------------------------------------------- | -------------- |
| Unlimited     | No limit is set on this quota. Requests pass without a per-quota cap.                                           | _(no action)_  |
| Not enforced  | `QuotaSettings.spec.quotaEnabled` is off box-wide, so no quota gate runs regardless of the per-quota values.    | _(no action)_  |
| Unknown       | The quota state could not be evaluated. Typically transient during controller reconciliation.                   | _(no action)_  |
| Reached limit | The client's usage has hit the quota's cap. New requests refuse until the window resets or the limit is raised. | Increase limit |

The Increase limit action raises the cap for the affected quota. For the console procedure, refer to
[Set and Manage Client Quotas](../how-to-guides/manage-client-quotas.md).

## Per-Request Attribution

Every request that clears the quota gate is charged to exactly one API token and one quota.

- **Where it is written.** The appliance writes each charge to the audit ledger. Each row records the token, the quota
  it charged, the model that served the request, the token count, and the cost.
- **Where it is read.** The ledger is aggregated into the usage dashboards. Refer to
  [Usage Metrics Reference](usage-metrics-reference.md) for the exact metric names, dimensions, and windows.

## Related Pages

- [Clients and Quotas](../explanation/clients-and-quotas.md) covers the mental model behind these entities.
- [Create a Client](../how-to-guides/create-a-client.md) creates a `ModelClient` and its first `ModelGroupAPIKey`.
- [Generate an API Token](../how-to-guides/generate-an-api-token.md) adds another `ModelGroupAPIKey` to an existing
  client.
- [Set and Manage Client Quotas](../how-to-guides/manage-client-quotas.md) edits a `ModelGroupQuota` and its cap.
- [Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md) edits the model allow-list on a key
  and the frontier egress on a quota.
- [View Client Usage](../how-to-guides/view-client-usage.md) reads quota utilization from the ledger.
- [View Token Usage](../how-to-guides/view-token-usage.md) reads per-token attribution from the ledger.
- [Revoke or Delete a Client](../how-to-guides/revoke-or-delete-a-client.md) removes a `ModelClient` and cascades to its
  keys.
