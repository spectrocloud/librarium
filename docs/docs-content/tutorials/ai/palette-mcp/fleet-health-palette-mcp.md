---
sidebar_position: 50
sidebar_label: "Morning Fleet Check with Palette MCP"
title: "Morning Fleet Check with Palette MCP: Fleet Health Overview"
description:
  "Run a breadth-first scan across your entire tenant with the health-overview skill (every cluster, every edge host) to
  surface what needs attention before diving into root cause."
tags: ["ai", "palette-mcp", "tutorial"]
toc_max_heading_level: 2
category: ["tutorial"]
---

The `health-overview` skill runs a breadth-first scan across your entire tenant, every cluster and every edge host,
surfacing what is broken without diagnosing _why_. Think of it as the "how is the fleet?" check a platform admin runs at
the start of the day, before deciding which single resource (if any) needs the deeper `diagnose-cluster` or
`diagnose-edge` treatment.

In this tutorial, you run that scan against your tenant as a five-scan sequence, reading each resource's state directly.
Along the way, you learn to separate a cluster's lifecycle state (`Running`, `Provisioning`) from its health state
(`Healthy` or `UnHealthy`), which are independent axes, and to read a "fleet is healthy" result as a real negative
finding rather than an absence of data. This tutorial uses Claude Code, but the same prompts work with any MCP-capable
client.

## Prerequisites

- Completion of the [Get Started with Palette MCP](./get-started-palette-mcp.md) tutorial. This tutorial assumes your
  MCP server and client are already configured.

- An MCP-capable client and a Palette API key with tenant-wide read access, the same as the
  [cloud-triage tutorial](./cloud-triage-palette-mcp.md). No special server flags are required.

## Scan Clusters in Error

Start by asking your client for the full cluster list. This calls the `read_clusters` tool, which returns a tenant-wide
cluster list.

```shell title="Example Prompt"
List all my clusters and their status.
```

You can also phrase the scan as a direct question.

```shell title="Example Prompt"
Are any of my clusters in an error state?
```

Either way, scan each cluster's `status.state` for anything indicating an error. This is the same `read_clusters` call
from the [cloud-triage tutorial](./cloud-triage-palette-mcp.md), applied tenant-wide.

## Scan In-Progress Clusters

This scan calls the `read_cluster_status` tool with a server-side filter on lifecycle state.

```shell title="Example Prompt"
What clusters are mid-operation right now?
```

Use `read_cluster_status` with `filters={states:{in:["Pending","Provisioning","Deleting"]}}`. The following is an
example result: eight clusters, all `Provisioning`. These are not failures. A cluster normally passes through this state
on create or teardown. Report them in a separate bucket from anything actually broken, so you do not mistake "still
coming up" for "stuck."

## Scan Unhealthy Clusters

```shell title="Example Prompt"
Are any clusters unhealthy, even if they're technically running?
```

Use `read_cluster_status` with `filters={health_state:{eq:"UnHealthy"}}` (note the capital `H`: the lowercase
`unhealthy` returns an empty set silently, per the skill's own guidance). This filter is independent of the lifecycle
filter in the previous scan. In a representative result, it includes every cluster from the in-progress `Provisioning`
set (unhealthy while mid-operation is expected) plus one additional cluster in `Unknown` state that the in-progress scan
does not surface. That additional cluster is lifecycle-idle yet genuinely unhealthy, exactly the case this scan exists
to catch. The [cloud-triage tutorial](./cloud-triage-palette-mcp.md) covers what root-causing that specific cluster
looks like.

## Scan Unhealthy Edge Hosts

This scan calls the `read_edge_hosts` tool with a health-state filter.

```shell title="Example Prompt"
Any unhealthy edge hosts?
```

Use `read_edge_hosts` with `filters={health_state:"unhealthy"}` (lowercase: edge-host health values use different casing
from cluster health values, and the skill names this explicitly). A clean fleet returns `{"items": [], "total": 0}`,
which is a real, clean result, not a placeholder empty response.

## Scan Unpaired Edge Hosts

```shell title="Example Prompt"
Any edge hosts that registered but never paired?
```

Use `read_edge_hosts` with `filters={state:"unpaired"}`. A representative result returns several unpaired hosts, often a
mix of leftover test registrations. This is a real onboarding-gap signal: hardware that showed up in Palette but was
never paired to a cluster. Whether that is expected (a host awaiting provisioning) or worth cleaning up (a host someone
forgot about) depends on context the scan itself does not have, so it is a judgment call for the reader.

## Synthesize the Findings

Group everything from the five scans into the following buckets.

- **Clusters in error** (from the error scan).

- **Running or Unknown but unhealthy clusters** (from the unhealthy-cluster scan).

- **Unhealthy edge hosts** (from the unhealthy edge-host scan, none in this example).

- **Unpaired edge hosts** (from the unpaired edge-host scan).

- **In-progress operations** (from the in-progress scan). Context only, not problems.

If every working scan comes back empty, that is a real "fleet is healthy" result, not a sign something did not run. A
health-overview scan across a real, actively used tenant surfaces real, unresolved things most of the time.

:::info

Every tool in this tutorial is read-only, so no special server flags are required. This skill only scans. Route anything
it finds to the `diagnose-cluster` or `diagnose-edge` skill for root cause, and to the write tools (with
`--allow-write`, and your own judgment) for any fix. For the Palette MCP server's full security model, refer to
[Palette MCP Architecture](../../../automation/palette-mcp/architecture.md#security).

:::

## Troubleshooting

| Symptom                                                                                | Likely cause                                                                                                                          | Fix                                                                                                             |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| A cluster or edge-host `health_state` filter returns nothing when you expected results | Casing is case-sensitive and opposite between the two. Clusters use `UnHealthy` (capital H), and edge hosts use lowercase `unhealthy` | Match the casing shown in the health-state and unpaired scans.                                                  |
| Unpaired-host scan returns entries you do not recognize                                | Genuine stale test or demo registrations rather than real onboarding gaps                                                             | Cross-check the host names and UIDs against what you actually provisioned before treating each one as an issue. |
| A large edge fleet makes the unpaired and unhealthy scans take longer                  | `read_edge_hosts` filters locally, so the tenant list transfers before filtering                                                      | Expect scan time to scale with fleet size. The result is still correct.                                         |

## Validate

Confirm that you can run a fleet health overview through the Palette MCP server.

1. Run all five scans against your own tenant and confirm each one returns a response.

2. For a cluster reported as `Provisioning`, confirm that its lifecycle state and health state are reported
   independently, so you can explain why the two axes are scanned separately.

3. Run the unhealthy-cluster scan with `filters={health_state:{eq:"UnHealthy"}}` and the unhealthy edge-host scan with
   `filters={health_state:"unhealthy"}`, and confirm each returns results with the casing matched to each resource type.

4. Confirm that an all-empty scan result reads as a genuine "fleet is healthy" outcome rather than a broken query.

## Cleanup

This tutorial only reads data. There is nothing to clean up.

## Wrap-up

In this tutorial, you ran the `health-overview` skill as a five-scan sequence across your tenant: clusters in error,
in-progress clusters, unhealthy clusters, unhealthy edge hosts, and unpaired edge hosts. You then synthesized the
findings into buckets that separate genuine problems from expected in-progress operations. Along the way, you separated
a cluster's lifecycle state from its health state, matched the opposite casing that cluster and edge-host health filters
require, and read an all-empty result as a real "fleet is healthy" finding.

Because every tool in this scan is read-only, you can run the sequence safely at the start of any day, then route
whatever it surfaces to the deeper root-cause and write tools.

To continue, refer to the following tutorials:

- [Troubleshoot a Cloud Cluster with Palette MCP](./cloud-triage-palette-mcp.md) to root-cause any cluster this scan
  flags.

- [Troubleshoot an Edge Host with Palette MCP](./edge-triage-palette-mcp.md) to root-cause any edge host this scan
  flags.

- [Access Review with Palette MCP](./access-review-palette-mcp.md) for teams, users, and orphans across the same tenant.
