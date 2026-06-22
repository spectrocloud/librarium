---
sidebar_label: "Quota and Rate Limit Reference"
title: "Quota and Rate Limit Reference"
description:
  "Reference for how Launchpad for AI defines and enforces quotas and rate limits, including dimensions, windows,
  scopes, and limit behavior."
hide_table_of_contents: false
sidebar_position: 50
tags: ["launchpad-for-ai", "quotas", "rate-limits", "reference"]
---

Launchpad for AI enforces usage quotas at the gateway. A quota is a set of limits, where each limit caps one dimension
over one window. This page describes the dimensions, windows, and scopes a quota can use, and how the gateway behaves
when a limit is reached. To configure quotas, refer to [Set and Manage Quotas](./set-and-manage-quotas.md).

## Quota Dimensions

A limit applies to one of the following dimensions.

| **Dimension** | **Unit**     | **Description**                                                                |
| ------------- | ------------ | ------------------------------------------------------------------------------ |
| `requests`    | requests     | The number of requests. Use this dimension to set a rate limit.                |
| `tokens`      | tokens       | The number of tokens processed. Use this dimension to set a token quota.       |
| `cost`        | U.S. dollars | The estimated cost of processed tokens. Use this dimension to set a spend cap. |

## Quota Windows

Each limit applies over one window. A window is a fixed interval that resets when the interval rolls over.

| **Window** | **Duration**  |
| ---------- | ------------- |
| `second`   | 1 second      |
| `minute`   | 60 seconds    |
| `hour`     | 3,600 seconds |
| `day`      | 24 hours      |

There is no week, month, or billing-period window. The `day` window is the longest available.

## Quota Scopes

A quota applies at one of two scopes.

| **Scope** | **Applies to**                      | **Configured in**                                                      |
| --------- | ----------------------------------- | ---------------------------------------------------------------------- |
| `user`    | One user's requests.                | The console, on the **Access & Policy** > **Users** page.              |
| `model`   | One model's usage across all users. | Governance configuration. Per-model quotas are not set in the console. |

## Enforcement

Quota enforcement is controlled by a single global switch on the **Access & Policy** > **Users** page. Enforcement is
off by default.

| **State** | **Behavior**                                                                |
| --------- | --------------------------------------------------------------------------- |
| Off       | Usage is recorded, but limits are not applied. Requests are never rejected. |
| On        | The gateway applies every active limit to each request.                     |

## Limit Behavior

When a request would exceed an active limit, the gateway rejects it with an HTTP `429` response. The response names the
dimension and window that tripped, such as `requests/minute limit exceeded`.

- The request is blocked. The gateway does not throttle, queue, or retry the request, and it does not send an alert or
  notification.

- A dimension or window with no configured limit is unlimited. A limit of `0` is treated as unlimited.

## How Limits Interact

A user or model can carry limits on more than one dimension and window at the same time. The gateway evaluates every
active limit on each request, and the first limit that would be exceeded blocks the request. Limits do not conflict. The
most restrictive limit is the effective one.
