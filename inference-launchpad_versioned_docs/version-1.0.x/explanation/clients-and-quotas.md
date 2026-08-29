---
sidebar_label: "Clients and Quotas"
title: "Clients and Quotas"
description:
  "An explanation of clients, API tokens, and quotas in PaletteAI Inference Launchpad: what a client is, why the
  appliance serves many clients such as AI coding assistants, and how it meters and limits their usage."
hide_table_of_contents: false
sidebar_position: 2
tags: ["paletteai-inference-launchpad", "explanation", "clients", "quotas"]
keywords: ["launchpad", "ai", "clients", "api token", "quota", "rate limit", "coding assistant", "claude code"]
---

AI coding assistants such as Claude Code, Cursor, OpenAI Codex, and OpenCode make up many of the workloads that connect
to a PaletteAI Inference Launchpad appliance, sending their requests to the appliance instead of to a cloud provider. A
single appliance can serve many of these assistants at once, along with other workloads such as an internal chatbot or a
nightly batch job. This page explains how the appliance tells those workloads apart, and how it meters and limits what
each one consumes. It covers what a _client_ is, why one appliance serves many of them, and how clients, API tokens, and
quotas fit together. Read it to understand these ideas before you create clients, issue tokens, or set quotas.

## What a Client Is

A client is the identity the appliance uses to recognize who is sending a request. It is the unit of both access and
accounting. The appliance attributes every request to exactly one client and measures every quota and usage metric per
client.

A client is more often a _workload_ than a person. Each AI coding assistant that connects to the appliance is a client.
A single client might represent one engineering team, with each developer holding a separate API token, or a single
coding tool. A customer support assistant or a data pipeline also makes a natural client, and most such workloads have
no human operator at all.

One appliance can serve many clients side by side. They draw on the same loaded models and the same GPU hardware, so the
appliance needs a way to keep them from interfering with one another. That is what clients, tokens, and quotas provide.

## Why the Appliance Serves Many Clients

The appliance is a single machine with a fixed amount of GPU capacity. Unlike a cloud service, it cannot scale out on
demand, so its capacity is shared among everything that uses it. Giving every workload the same anonymous access would
make that shared resource impossible to manage. Distinct clients let you do four things that a single shared credential
cannot:

- **Protect capacity.** Per-client limits stop one coding assistant, such as an agent working through a large refactor,
  from consuming all available throughput and starving the others.
- **Attribute usage.** Per-client metrics show which team or tool consumed what, so you can identify where capacity goes
  and plan accordingly.
- **Contain credentials.** A token that a developer commits to a repository by mistake affects only its client. You
  revoke that one token without disrupting any other workload.
- **Govern outbound reach.** When the appliance routes to external providers, you can control which clients may send
  requests off the appliance. For example, you can allow only certain coding assistants to reach a paid frontier model.

Creating separate clients is not about distributing access for its own sake. It is how you keep a shared, finite
appliance usable by many workloads at once.

## Clients and API Tokens

A client proves its identity with an API token, a bearer credential that begins with the prefix `lpai_`. Every request
carries its token in the `Authorization` header. The appliance resolves the token to its client, applies that client's
quotas, and records the request's usage against that client.

A client can hold more than one API token. When each developer or coding tool that shares a client carries its own
token, revoking one token (for example, after a developer leaves the team) does not disturb the others. Revoking the
client itself revokes every token that belongs to it.

## Client Lifecycle

A client is active by default. You can suspend it, delete it, or revoke its individual API tokens without changing the
client itself.

- **Suspend** blocks a client's requests but keeps its API tokens, quotas, and routing settings in place. A suspended
  client can be resumed at any time, so suspension is reversible.
- **Delete** permanently retires a client and removes its quota, egress, and routing settings. It revokes every API
  token the client owns. The client's audit history is preserved, and a delete cannot be undone.

An API token has its own state. A token stays active until it is revoked or passes its expiration date. The appliance
rejects any request that presents a revoked or expired token, fail-closed.

## Quotas

A quota is a consumption limit attached to a client. The appliance enforces quotas across three dimensions:

- **Requests.** The number of calls a client makes.
- **Tokens.** The number of tokens a client's requests process.
- **Cost.** The computed cost of a client's requests.

The appliance measures each dimension over rolling windows of one second, one minute, one hour, and one day. There is no
monthly or billing-cycle window.

When a client reaches a limit, the appliance rejects further requests with HTTP `429 Too Many Requests` and names the
dimension and window that tripped. It does not queue or slow the requests. It blocks them until the window rolls over
and the client is back under the limit.

Above the per-client limits sits a single switch, quota enforcement, that covers the whole appliance. It decides whether
a limit refuses a request or the appliance ignores it. A new appliance starts with enforcement on. While enforcement is
off, the appliance honors no client's limits, though it keeps every limit you have set. Two things must hold before the
appliance limits a client: enforcement on for the appliance, and a window limit on the client. To read the current
setting or change it, refer to
[Set and Manage Client Quotas](../how-to-guides/manage-client-quotas.md#check-quota-enforcement).

Limits are only half the picture. The console also reports how much of a limit each client has actually spent. For the
meters and states it uses, refer to [Usage Metrics Reference](../reference/usage-metrics-reference.md#quota-usage-tab).

{/* TODO: link to a Quota & Rate Limit reference page once one exists; DOC-2941 was never created. */}

## What Clients Can Access

Access to models depends on whether a model runs locally on the appliance or is reached through an external provider.

- **Local models.** Every client can call every model served locally on the appliance. The appliance does not restrict
  which local models a client may call. It meters and limits how much a client uses through quotas, but it does not gate
  access to any local model.
- **External models.** If the appliance is configured to route to external providers, each client's reach is governed by
  an allow-list that denies by default. A client can call an external provider or model only when that provider or model
  is explicitly allowed for it.

## How It Fits Together

A single request from a coding assistant ties these ideas together.

1. A code completion request arrives with `Authorization: Bearer lpai_...`.
2. The appliance resolves the token to its client.
3. The appliance checks that client's quota for the requested dimension and window.
4. If the client is within its limits, the appliance routes the request to the model and records the usage against the
   client. If the client is over a limit, the appliance rejects the request with `429` instead.

Setting up a client builds this same chain ahead of time, starting with the client, then its tokens, and then its
quotas, so it is ready to run on every request.

## Resources

- [Create a Client](../how-to-guides/create-a-client.md) walks through creating a client and issuing its first API
  token.
- [Use PaletteAI Inference Launchpad with Claude Code](../how-to-guides/use-claude-code.md) walks through connecting a
  coding assistant to a client with an API token.
- [Architecture Overview](./architecture.md) explains how the appliance routes requests and where its components sit.
- [Model Certification](./model-certification.md) explains which models a client can call and how you choose them.
- [Glossary](../reference/glossary.md) defines the client, API token, quota, and routing terms used throughout this
  page.
