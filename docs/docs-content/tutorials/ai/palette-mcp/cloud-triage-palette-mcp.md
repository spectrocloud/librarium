---
sidebar_position: 40
sidebar_label: "Troubleshoot a Cloud Cluster with Palette MCP"
title: "Troubleshoot a Cloud Cluster with Palette MCP: Cloud Triage"
description:
  "Triage a cloud cluster from management-plane signals down to a root cause with the diagnose-cluster skill: status,
  events, observability, and attached profiles."
tags: ["ai", "palette-mcp", "tutorial"]
toc_max_heading_level: 2
category: ["tutorial"]
---

The `diagnose-cluster` skill drives a structured, layered triage of a cloud cluster: status → events → observability →
attached profiles, with a condition-routing table that tells you which signal to chase next instead of guessing. Most
root causes resolve at this management-plane tier alone; the skill can also escalate further into the cluster's own
Kubernetes API and, for self-managed infrastructure, node-level SSH.

In this tutorial, you triage a real cluster from management-plane signals down to a root cause, scope a read to a
specific project with a per-call argument, and view a second cluster's clean status as a healthy-baseline comparison.
Completing [Get Started with Palette MCP](./get-started-palette-mcp.md) first is assumed.

## What You'll Learn

- How to run the management-plane triage sequence: status, events, observability, attached profiles
- How to read `read_cluster_status`'s condition list to find the actual blocker, not just the summary `state`
- How to scope a single-cluster read to a specific project with a per-call `project_uid`
- When the skill escalates to kube-level (and node-level) triage
- How the same tenant's edge and cloud surfaces connect—reading a cluster's status via the API vs. reading its edge
  host's own systemd units via SSH

## Prerequisites

**Software:** an MCP-capable client, `palette-mcp` registered as usual—no special flags needed, everything in this
tutorial is available without `--allow-write` or `--allow-direct-ssh`.

**Account:** a Palette API key with read access to the projects containing the clusters you want to triage.

:::info

Sample data below uses `<CLUSTER_NAME>`, `<PROJECT_UID>`, and similar placeholders—substitute your own. Every output
shown was captured from a real, live cluster; only identifying values are redacted.

:::

## Tools Used in This Tutorial

| Tool                                | What it does                                                                                                                  |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `read_clusters`                     | Lists clusters, or resolves one by UID/name filter.                                                                           |
| `read_cluster_status`               | Full condition list and lifecycle state for one cluster. Accepts an optional per-call `project_uid` to scope the read—Step 3. |
| `read_events`                       | Cluster-scoped event history (`object_kind="spectrocluster"`). Correlate with conditions to confirm root cause.               |
| `read_cluster_observability`        | Compliance scan, backup, and restore status.                                                                                  |
| `read_attached_profiles_to_cluster` | Cluster profiles and pack versions/state attached to the cluster.                                                             |

## Step 1—List Clusters and Pick a Target

```shell title="Example Prompt"
List all my clusters.
```

This calls `read_clusters`. Each item carries `metadata` (name, project), `spec.cloud_type`, a top-level `status.state`,
and its `uid`—capture the `uid` and `project_uid` for the cluster you want to triage—you'll need the `uid` in the next
step and the `project_uid` in Step 3.

## Step 2—Read Cluster Status

```shell title="Example Prompt"
What's the status of <CLUSTER_NAME>?
```

Calls `read_cluster_status` with the cluster's `uid`. Live example—a real cluster whose top-level state was `Unknown`.

```json title="Example Output"
{
  "ok": true,
  "status": {
    "state": "Unknown",
    "conditions": [
      { "type": "CloudInfrastructureReady", "status": "True", "reason": "InfrastructureReady" },
      { "type": "BootstrappingDone", "status": "True", "reason": "Bootstrapped" },
      { "type": "KubeConfigReady", "status": "True", "reason": "KubeConfigReady" },
      { "type": "ImageResolutionDone", "status": "True", "reason": "ImageResolved" },
      {
        "type": "ImagePullSecretPropagationDone",
        "status": "False",
        "reason": "ConnectivityIssue",
        "message": "Cluster agent is unreachable; image pull secret propagation cannot proceed"
      }
    ]
  }
}
```

A top-level `state: Unknown` tells you _something's_ off, but not _what_. The `conditions` array is where the actual
answer lives—read every condition, not just the ones that are `True`. Here, everything needed for the cluster to exist
is `True` (infra, bootstrap, kubeconfig, image resolution)—but `ImagePullSecretPropagationDone` is `False`, with a
specific reason: `ConnectivityIssue`. That's the actual blocker, and it's a management-plane signal—Palette's control
plane can't reach the cluster's agent to push the pull secret. No kube-level or node-level digging is needed to identify
this one.

:::tip

This exact condition was independently confirmed as the cluster's root cause in an earlier live session—evidence the
condition-routing table (Step 6) points at the real problem.

:::

## Step 3—Scope a Read to a Specific Project

Reads run at tenant scope by default—across every project your credential can access (a project-scoped API key narrows
this automatically). Several read tools—including `read_cluster_status`, `read_events`, `read_cluster_observability`,
and `read_attached_profiles_to_cluster`—also accept an optional **per-call** `project_uid` argument that scopes just
that one request; `read_events` accepts it too, but only on object-scoped calls like Step 4's (with
`object_kind`/`object_uid`)—never on the tenant-wide list.

```shell title="Example Prompt"
What's the status of <CLUSTER_NAME>? It's in project <PROJECT_UID>.
```

```json title="Example Output"
{ "ok": true, "status": { "state": "Unknown", "conditions": ["..."] } }
```

`read_clusters` returns each cluster's `project_uid` in its `metadata`, so you always have it on hand from Step 1—pass
it explicitly any time your credential's access doesn't cover the tenant as a whole, or when you want to be precise
about which project a call targets.

## Step 4—Correlate with Events

```shell title="Example Prompt"
What events led to that?
```

Calls `read_events` with `object_kind="spectrocluster"`, `object_uid=<uid>` (pass the same `project_uid` from Step 3 if
you needed it there). Real output for the cluster above showed a clean image-resolution history (`LocatingBaseImage` →
`ReconcileImage` → `ImageResolved`)—nothing in the event log pointed at the actual blocker, because
`ImagePullSecretPropagationDone` is a status condition, not an event in this case. Events confirm what already succeeded
and don't always surface what's currently failing—read conditions and events together.

## Step 5—Observability and Attached Profiles

```shell title="Example Prompt"
Check backup, scan, and pack status for <CLUSTER_NAME>.
```

`read_cluster_observability` (real output): scans and backup reported `"ok"`; restore reported `"unavailable"` with
`RestoreNotExecuted`—expected when no restore has ever been run.

`read_attached_profiles_to_cluster` (real output): one `cluster`-type profile (OS, Kubernetes, CNI, CSI packs, all
`InstallSuccess`) and one `add-on` profile—both fully installed. Packs aren't the blocker here; this rules out a
pack-compatibility cause and keeps the finding pointed at the connectivity condition from Step 2.

## Step 6—Synthesize and Decide Whether to Escalate

`diagnose-cluster`'s condition-routing table shows where to look next based on which condition is `False`.

| Condition                                          | Points to                                                                                                |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `CloudInfrastructureReady=False`                   | Infra provisioning—cloud-account credentials, provider resources                                         |
| `BootstrapReady=False` / `BootstrappingDone=False` | Node bootstrap never finished—node-level logs (kube-tier escalation)                                     |
| `KubeConfigReady=False`                            | Control plane isn't up                                                                                   |
| `ImageResolutionDone=False`                        | Image/registry resolution failed                                                                         |
| `ImagePullSecretPropagationDone=False`             | Registry/pack pull-secret propagation failed—management-plane actionable, no kube-tier escalation needed |

For the live example above, the failing condition is the last row: management-plane actionable. The skill routes this
signature to a direct fix rather than escalating to kube-level triage—there's nothing on the cluster's own Kubernetes
API that would add information the condition message doesn't already have.

For a `BootstrapReady=False` or node-`NotReady` signature, the skill mints a session-scoped, RBAC-backed read-only
kubeconfig to inspect CAPI/node/pod state directly, and—for self-managed infrastructure only (`aws`/`azure`/plain `gcp`,
not managed `eks`/`aks`/`gke`)—can go one level further over SSH into the node's own service logs (the skill's
node-level procedure names each unit). That path creates and tears down real objects on the live cluster (a
ServiceAccount and ClusterRoleBindings) to do it. Treat it with the same weight as any other credential-minting action
against a shared cluster, and refer to the skill itself (`diagnose-cluster/SKILL.md`) for the full K1–K6 procedure when
your signature needs it.

## Step 7—Cross-Reference: An Edge-Native Cluster, Healthy

Not every `cloud_type` is `aws`/`azure`/`gcp`/managed. Palette also tracks edge deployments as clusters with
`cloud_type: edge-native`—and this one happens to be the same host from the
[edge-triage tutorial](./edge-triage-palette-mcp.md), reachable here from the cloud/API side instead of over SSH.

```shell title="Example Prompt"
What's the status of <EDGE_CLUSTER_NAME>?
```

```json title="Example Output"
{
  "ok": true,
  "status": {
    "conditions": [
      { "type": "ImageResolutionDone", "status": "True" },
      { "type": "ImagePullSecretPropagationDone", "status": "True", "reason": "Completed" },
      { "type": "BootstrappingDone", "status": "True" },
      { "type": "CloudInfrastructureReady", "status": "True" }
    ],
    "api_endpoints": [{ "host": "<CLUSTER_API_IP>", "port": 6443 }]
  }
}
```

Every condition `True`—a genuinely healthy baseline, useful to have seen once so you know what "nothing to report" looks
like from this same tool. `diagnose-cluster`'s kube-tier escalation routes on the cluster's `cloud_type`; for an
edge-native cluster's host-level triage, use the edge-triage tutorial's `run_edge_diagnostic` instead—two different
tools for two different layers of the same tenant.

## Troubleshooting

| Symptom                                                                                            | Likely cause                                                                                      | Fix                                                                                                                                                                                                                                                                         |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Top-level `status.state` is `Running` or `Unknown` but you need to know why                        | The summary state doesn't carry the reason                                                        | Read the full `conditions` array—the routing table (Step 6) shows which `False` condition matters.                                                                                                                                                                          |
| `read_events` shows a clean history but the cluster still looks unhealthy                          | Events log what happened, not necessarily the current blocking condition                          | Cross-check `read_cluster_status`'s conditions instead of relying on events alone.                                                                                                                                                                                          |
| Kube-tier escalation reports no `written_to` field                                                 | Server not started with `--allow-write`                                                           | Add `--allow-write` to write the kubeconfig to disk before running kube-tier; management-plane findings still stand either way.                                                                                                                                             |
| `run_edge_command` isn't in the tool list when you try the node-level SSH leg                      | Server not started with `--allow-direct-ssh`                                                      | Add the flag and restart (the edge-triage tutorial's Step 1 covers it).                                                                                                                                                                                                     |
| `kubectl get <provider>cluster,<provider>machine --all-namespaces` returns nothing under kube-tier | Querying the workload kubeconfig for a pre-pivot failure (first control-plane node never came up) | CAPI resources live in the management-plane kubeconfig for a pre-pivot failure—kube-tier triage against the workload kubeconfig can't display them. Treat the empty output as that signature, not as 'no CAPI objects,' and rely on the management-plane findings (Step 6). |

## Security Best Practices

- If your triage escalates to kube-tier, a temporary ServiceAccount and ClusterRoleBindings are created on the live
  cluster and torn down at the end of the run.
- Never ask the skill (or anyone) to paste an SSH private key into chat—node-level triage only ever asks for a key
  **path**.
- Run only the read-only commands the skill lists for node-level SSH triage—treat that list as the boundary.

## Validate

You've completed this tutorial if you can:

- [ ] Run the status → events → observability → attached-profiles sequence for a real cluster.
- [ ] Identify a blocking condition from `read_cluster_status`'s `conditions` array, not just the top-level `state`.
- [ ] Scope a single-cluster read to a specific project using a per-call `project_uid`.
- [ ] Explain why a management-plane-actionable finding doesn't need kube-tier escalation.
- [ ] Read an edge-native cluster's status via the API and know when to use `diagnose-cluster`'s kube/node tiers vs. the
      edge-triage tutorial's SSH-based tools instead.

## Cleanup

This tutorial's example didn't escalate to kube-tier, so no temporary credentials were created—nothing to clean up. If
your own triage does escalate and a cleanup step reports failure, re-run the same `--cleanup` command the skill names
once the cluster is reachable again.

## Next Steps

- [Troubleshoot an Edge Host with Palette MCP](./edge-triage-palette-mcp.md)—the host-level counterpart to this
  tutorial's edge-native cross-reference.
