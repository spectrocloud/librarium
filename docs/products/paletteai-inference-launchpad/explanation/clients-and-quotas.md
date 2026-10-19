---
sidebar_label: "Clients and Quotas"
title: "Clients and Quotas"
description:
  "An explanation of clients, API tokens, and quotas in PaletteAI Inference Launchpad: what a client is, why the
  appliance serves many clients such as AI coding assistants, and how it meters usage, reports utilization, and limits
  consumption. It also covers how workspaces, roles, and members decide who administers which clients."
hide_table_of_contents: false
sidebar_position: 2
tags: ["paletteai-inference-launchpad", "explanation", "clients", "quotas"]
keywords:
  [
    "launchpad",
    "ai",
    "clients",
    "api token",
    "quota",
    "rate limit",
    "coding assistant",
    "claude code",
    "usage",
    "utilization",
    "workspace",
    "role",
    "grant",
  ]
---

AI coding assistants such as Claude Code, Cursor, OpenAI Codex, and OpenCode make up many of the workloads that connect
to a PaletteAI Inference Launchpad appliance, sending their requests to the appliance instead of to a cloud provider. A
single appliance can serve many of these assistants at once, along with other workloads such as an internal chatbot or a
nightly batch job. This page explains how the appliance tells those workloads apart, and how it meters and limits what
each one consumes. It covers what a _client_ is, why one appliance serves many of them, and how clients, API tokens, and
quotas fit together. Read it to understand these ideas before you create clients, issue tokens, set quotas, or review
usage. It also explains how workspaces, policies, roles, and members decide what a team's clients can spend and reach
and who can manage them. For that model, refer to [Workspaces and Access](#workspaces-and-access).

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
- **Govern outbound reach.** When the appliance routes to external providers, including built-in frontier providers and
  registered external inference endpoints, you can control which clients may send requests off the appliance. For
  example, you can allow only certain coding assistants to reach a paid frontier model or a registered host.

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

An API token has its own state. Every token created in the console carries an expiration date, up to 366 days ahead, and
a token stays active until it is revoked or passes that date. The appliance rejects any request that presents a revoked
or expired token, fail-closed.

## Quotas

A quota is a consumption limit attached to a client. The appliance enforces quotas across three dimensions:

- **Requests.** The number of calls a client makes.
- **Tokens.** The number of tokens a client's requests process.
- **Cost.** The computed cost of a client's requests. For how the appliance prices tokens, refer to
  [Usage Pricing](./usage-pricing.md).

When you add a limit, the console offers **hour** and **day** windows. Day limits reset at midnight UTC. Hour limits
reset at the top of each UTC hour. There is no monthly or billing-cycle window. A client that already has a per-second
or per-minute limit still has that window enforced until you remove the row.

All active limits apply together. When a client reaches a limit, the appliance rejects further requests with HTTP
`429 Too Many Requests` and names the dimension and window that tripped. It does not queue or slow the requests. It
blocks them until the window resets and the client is back under the limit.

Above the per-client limits sits a single switch, quota enforcement, that covers the whole appliance. It decides whether
a limit refuses a request or the appliance ignores it. A new appliance starts with enforcement on. While enforcement is
off, the appliance honors no client's limits, though it keeps every limit you have set. Two things must hold before the
appliance limits a client: enforcement on for the appliance, and a window limit on the client. To read the current
setting or change it, refer to
[Set and Manage Client Quotas](../how-to-guides/manage-client-quotas.md#check-quota-enforcement).

### Utilization and Consumption

**Quota Usage** on the **Usage** page shows point-in-time utilization: how much of each window the client has used right
now, how much remains, and when that window next resets. Token utilization is the tokens counted against the client's
token windows. Request and cost utilization use the same pattern on their own windows.

Quota consumption is that used amount divided by the configured limit, shown as a percentage. On **Quota Usage**, each
window reports its own percentage, and the table sorts the worst-used window first. On **By Client**, **Total Local
Quota** is the configured cap for the selected data window, and **Local Quota Used** is the percentage of that cap
consumed.

A client at 100% of a limit shows **Reached limit**. Further requests are throttled until the window resets or an
operator raises the ceiling. For every field the console reports on **Quota Usage** and the other **Usage** tabs, refer
to [Usage Metrics Reference](../reference/usage-metrics-reference.md#quota-usage-tab).

### Historical Reporting

**Overview**, **By Model**, and **By Client** report consumption over a **Data window**: **Last 24h**, **Last 7 days**,
**Last 30 days**, or a custom date range. Local versus external percentages on **Overview** are by tokens, not by
requests or cost.

**Quota Usage** does not follow that window. Its counters are the live budget, not a historical record.

If the appliance has kept less history than the window you asked for, the card says so rather than filling the gap.

### Limit Ceiling Increases

Windows reset on the UTC clock. That is not an operator action, and it does not require a confirmation.

**Increase limit** on **Quota Usage** is the operator action. It raises one window's ceiling and keeps the usage already
counted. It cannot lower a cap. Lowering or removing a limit is an edit on **Access & Policy**. Both writes require
permission to manage clients.

{/* TODO: link to a Quota & Rate Limit reference page once one exists; DOC-2941 was never created. */}

## What Clients Can Access

Access to models depends on whether a model runs locally on the appliance or is reached through an external provider.

- **Local models.** Every client can call every model served locally on the appliance. The appliance does not restrict
  which local models a client may call. It meters and limits how much a client uses through quotas, but it does not gate
  access to any local model.
- **External models.** If the appliance is configured to route to external providers or registered inference endpoints,
  each client's reach is governed by an allow-list that denies by default. A client can call an external provider,
  registered endpoint, or model only when that provider, endpoint, or model is explicitly allowed for it. To register a
  host, refer to [Register an External Inference Endpoint](../how-to-guides/register-an-external-inference-endpoint.md).

### Sovereignty and Egress {#sovereignty-and-egress}

Sovereignty is a separate switch that overrides every client's egress. When it is armed for the appliance, no request
leaves the box regardless of any client's permission, and a client's egress chip reads **Blocked by sovereignty** until
an operator disarms it under **Access & Policy → Sovereignty**.

## Workspaces and Access {#workspaces-and-access}

Clients answer the question of who sends a request. Four more ideas answer what a team's clients can spend and reach,
and who can manage them:

- A [workspace](#workspaces) holds a team's clients. Each workspace follows one policy and has its own members.

- A [policy](#policies) sets what the clients in a workspace can spend and reach. Where one client needs a different
  value, you override it on that client.

- A [role](#roles-and-members) sets what a member can do. Roles ship with the appliance.

- A [member](#roles-and-members) is a person or a group given a role in a workspace. You add a member and choose its
  role in the same step.

### Workspaces

A workspace is the boundary between the appliance and a team. Each workspace holds its own clients and follows one
policy. The members of a workspace work with the clients in that workspace.

Every appliance ships with one workspace, **Default**, which cannot be removed. You create a workspace for each team
that needs its own clients and its own policy.

<!-- vale Vale.Spelling = NO -->

The workspace picker in the console header sets which workspace the console shows. The **Access & Policy** page changes
with it:

- At **All workspaces**, the page shows the **Clients**, **Workspaces**, **Policies**, **Roles**, **Users**, and
  **Groups** tabs. Every tab except **Clients** covers the whole appliance.

- Inside one workspace, the page shows only that workspace's **Clients** list, with no tab bar.

<!-- vale Vale.Spelling = YES -->

### Policies

A policy sets what clients can spend and what they can reach, including their limits and whether they can use external
inferencing. A policy belongs to a workspace, not to a person or a group, so every client in a workspace inherits one
policy.

Because the policy attaches to the workspace, a person who belongs to several groups never has two policies governing
the same client. The appliance needs no rule to pick the higher or the lower of two limits.

There is no policy override per person. Where one client needs a different value from the rest of its workspace, you
change that value on the client itself, not with a second policy. For the steps, refer to
[Set and Manage Client Quotas](../how-to-guides/manage-client-quotas.md) and
[Manage Client Model Access](../how-to-guides/manage-client-model-access.md).

### Roles and Members

A role is a named set of permissions that ships with the appliance. You assign roles. You do not create or edit them.
The **Roles** tab lists three roles:

- **Platform administrator** reaches the entire appliance.

- **Workspace administrator** reaches every client in the workspaces where the person or group holds the role.

- **Operator** reaches only the person's own clients, in the workspaces where they hold the role.

A role names no workspaces of its own. Its **Scope** says how far it reaches, and workspace membership says where it
applies.

A person or a group receives a role in a workspace by becoming a member of that workspace. A member is a person or a
group holding one role in one workspace. The same person can be a **Workspace administrator** in one workspace and hold
a narrower role in another. **Platform administrator** is not handed out per workspace.

The appliance records each role it hands out as a grant. You do not work with grants directly. Adding a member creates
one.

### Users, Groups, and Access

A person gains access to a workspace only when they, or a group they are in, become a member of that workspace. Adding a
group as a member gives everyone in that group the member's role.

The **Users** and **Groups** tabs list the people and groups that the appliance's identity provider serves. The console
calls this list the directory. You can add and change people and groups there, but being in the directory gives no
access on its own. Access comes from workspace membership.

The appliance also keeps a few groups of its own for sign-in and platform access. They do not appear on the **Groups**
tab, and you cannot rename them, give them a new description, or delete them. When you change a person's groups, any
membership they have in these groups stays in place.

For the steps, refer to [Create a Workspace](../how-to-guides/create-a-workspace.md),
[Manage Workspace Members](../how-to-guides/manage-workspace-members.md),
[Manage Users](../how-to-guides/manage-users.md), and [Manage Groups](../how-to-guides/manage-groups.md). For every
role, scope, and column, refer to [Access and Policy Reference](../reference/access-and-policy-reference.md).

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

- [Create a Workspace](../how-to-guides/create-a-workspace.md) walks through giving a team its own workspace.
- [Manage Workspace Members](../how-to-guides/manage-workspace-members.md) walks through changing who can act in a
  workspace.
- [Create a Client](../how-to-guides/create-a-client.md) walks through creating a client and issuing its first API
  token.
- [Set and Manage Client Quotas](../how-to-guides/manage-client-quotas.md) walks through setting limits, turning
  enforcement on or off, and raising a ceiling.
- [Register an External Inference Endpoint](../how-to-guides/register-an-external-inference-endpoint.md) walks through
  registering an OpenAI-compatible host and authorizing a client to use it.
- [View Client Usage](../how-to-guides/view-client-usage.md) walks through **Quota Usage**, historical data windows, and
  per-client consumption.
- [Use PaletteAI Inference Launchpad with Claude Code](../how-to-guides/use-claude-code.md) walks through connecting a
  coding assistant to a client with an API token.
- [Usage Pricing](./usage-pricing.md) explains how estimated cost and cache reads are calculated.
- [Estimated Savings](./estimated-savings.md) explains how the estimated savings figure is calculated.
- [Architecture Overview](./architecture.md) explains how the appliance routes requests and where its components sit.
- [Model Certification](./model-certification.md) explains which models a client can call and how you choose them.
- [Glossary](../reference/glossary.md) defines the client, API token, quota, and routing terms used throughout this
  page.
