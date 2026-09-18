---
sidebar_position: 50
sidebar_label: "Morning Fleet Check with Palette MCP"
title: "Morning Fleet Check with Palette MCP: Fleet Health Overview"
description:
  "Run a breadth-first scan across your entire tenant with the health-overview skill—every cluster, every edge host—to
  surface what needs attention before diving into root cause."
tags: ["ai", "palette-mcp", "tutorial"]
toc_max_heading_level: 2
category: ["tutorial"]
---

The `health-overview` skill is a breadth-first scan across your entire tenant—every cluster, every edge host—surfacing
what is broken without diagnosing _why_. Think of it as the "how is the fleet?" check a platform admin runs at the start
of the day, before deciding which single resource (if any) needs the deeper `diagnose-cluster` or `diagnose-edge`
treatment.

This tutorial runs that scan against a real tenant, scanning the full list and reading states directly. Completing
[Get Started with Palette MCP](./get-started-palette-mcp.md) first is assumed.

## What You Will Learn

- The five-scan sequence a fleet health check runs, and what each one is looking for.
- The difference between a cluster's lifecycle state (`Running`, `Provisioning`) and its health state.
  (`Healthy`/`UnHealthy`)—they are independent axes
- How to read "fleet is healthy" as an actual negative result, not an absence of data.

## Prerequisites

Same as the [cloud-triage tutorial](./cloud-triage-palette-mcp.md): an MCP-capable client, a Palette API key with
tenant-wide read access. No special server flags.

## Tools Used in This Tutorial

| Tool                                 | What it does                                                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `read_clusters`                      | Tenant-wide cluster list—this tutorial reads `status.state` directly from the unfiltered list in Step 1.                 |
| `read_cluster_status` with `filters` | Server-side filtered cluster scan—by lifecycle state, by health state.                                                   |
| `read_edge_hosts` with `filters`     | Filtered edge host scan—the MCP server fetches the tenant list and filters locally (Troubleshooting has the scale note). |

## Step 1—Scan Clusters in Error

```shell title="Example Prompt"
Are any of my clusters in an error state?
```

```shell title="Example Prompt"
List all my clusters and their status.
```

List every cluster and scan each one's `status.state` for anything indicating an error—the same `read_clusters` call
from the [cloud-triage tutorial](./cloud-triage-palette-mcp.md)'s Step 1, applied tenant-wide.

## Step 2—Scan In-Progress Clusters

```shell title="Example Prompt"
What clusters are mid-operation right now?
```

`read_cluster_status` with `filters={states:{in:["Pending","Provisioning","Deleting"]}}`. Live result against a real
tenant returned 8 clusters, all `Provisioning`. These are not failures—a cluster normally passes through this state on
create or teardown. Report them in a separate bucket from anything actually broken, so you do not mistake "still coming
up" for "stuck."

## Step 3—Scan Unhealthy Clusters

```shell title="Example Prompt"
Are any clusters unhealthy, even if they're technically running?
```

`read_cluster_status` with `filters={health_state:{eq:"UnHealthy"}}` (note the capital `H`—lower `unhealthy` returns an
empty set silently, per the skill's own guidance). This filter is independent of Step 2's lifecycle filter: live results
included every cluster from Step 2's `Provisioning` set (unhealthy while mid-operation is expected) plus one additional
cluster in `Unknown` state that Step 2 did not surface. That is a lifecycle-idle cluster that is genuinely
unhealthy—exactly the case this scan exists to catch. The [cloud-triage tutorial](./cloud-triage-palette-mcp.md) covers
what root-causing that specific cluster looked like.

## Step 4—Scan Unhealthy Edge Hosts

```shell title="Example Prompt"
Any unhealthy edge hosts?
```

`read_edge_hosts` with `filters={health_state:"unhealthy"}` (lowercase—edge-host health values use different casing from
cluster health values; the skill names this explicitly). Live result against two different tenants:
`{"items": [], "total": 0}` both times—a real, clean fleet, not a placeholder empty response.

## Step 5—Scan Unpaired Edge Hosts

```shell title="Example Prompt"
Any edge hosts that registered but never paired?
```

`read_edge_hosts` with `filters={state:"unpaired"}`. Live result against one tenant returned several unpaired hosts—a
mix of what looked like leftover test registrations. This is a real onboarding-gap signal: hardware that showed up in
Palette but was never paired to a cluster. Whether that is expected (a host awaiting provisioning) or worth cleaning up
(a host someone forgot about) depends on context the scan itself does not have—that is a judgment call for the reader.

## Step 6—Synthesize

Group everything from Steps 1–5 into:

- 🔴 **Clusters in Error**—from Step 1.
- 🟡 **Clusters Running/Unknown-but-Unhealthy**—from Step 3.
- 🟡 **Edge hosts unhealthy**—from Step 4 (none, in this run).
- 📌 **Edge hosts unpaired**—from Step 5.
- 📌 **In-progress operations**—from Step 2. Context only, not problems.

If every working scan comes back empty, that is a real "fleet is healthy" result, not a sign something did not run. A
health-overview scan across a real, actively used tenant surfaces real, unresolved things most of the time.

## Troubleshooting

| Symptom                                                                                | Likely cause                                                                                                                       | Fix                                                                                                         |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| A cluster or edge-host `health_state` filter returns nothing when you expected results | Casing is case-sensitive and opposite between the two—clusters use `UnHealthy` (capital H), edge hosts use lowercase (`unhealthy`) | Match the casing shown in Steps 3–5.                                                                        |
| Unpaired-host scan returns entries you do not recognize                                | Genuine stale test/demo registrations rather than real onboarding gaps                                                             | Cross-check the host names/UIDs against what you actually provisioned before treating each one as an issue. |
| A large edge fleet makes the unpaired/unhealthy scans take longer                      | `read_edge_hosts` filters locally—the tenant list transfers before filtering                                                       | Expect scan time to scale with fleet size; the result is still correct.                                     |

## Security Best Practices

- Every tool in this tutorial is read-only; no special server flags needed.
- This skill only scans—route anything it finds to `diagnose-cluster` or `diagnose-edge` for root cause, and to write
  tools (with `--allow-write`, and your own judgment) for any fix.

## Validate

You have completed this tutorial if you can:

- [ ] Run all five scans against your own tenant.
- [ ] Distinguish a cluster's lifecycle state from its health state, and explain why they are scanned separately.
- [ ] Correctly match casing for both health-state filters (`UnHealthy` for clusters, `unhealthy` for edge hosts).
- [ ] Read an all-empty scan result as a genuine "fleet is healthy," not a broken query.

## Cleanup

This tutorial only reads data—nothing to clean up.

## Next Steps

- [Troubleshoot a Cloud Cluster with Palette MCP](./cloud-triage-palette-mcp.md)—root-cause any cluster this scan flags.
- [Troubleshoot an Edge Host with Palette MCP](./edge-triage-palette-mcp.md)—root-cause any edge host this scan flags.
- [Access Review with Palette MCP](./access-review-palette-mcp.md)—teams, users, and orphans across the same tenant.
