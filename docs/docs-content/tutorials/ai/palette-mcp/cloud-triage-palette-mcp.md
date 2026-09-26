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

The `diagnose-cluster` skill drives a structured, layered triage of a cloud cluster: status, events, observability, then
attached profiles, with a condition-routing table that tells you which signal to chase next instead of guessing. Most
root causes resolve at this management-plane tier alone. The skill can also escalate further into the cluster's own
Kubernetes API and, for self-managed infrastructure, node-level SSH.

In this tutorial, you triage a cloud cluster from management-plane signals down to a root cause, using the sequence of
`read_cluster_status`, `read_events`, `read_cluster_observability`, and `read_attached_profiles_to_cluster`. You read a
cluster's condition list to find the actual blocker instead of relying on the summary `state`, scope a single-cluster
read to a specific project with a per-call `project_uid`, and view a second cluster's clean status as a healthy
baseline. You also learn when the skill escalates to kube-level and node-level triage, and how the same tenant's edge
and cloud surfaces connect: reading a cluster's status through the API versus reading its edge host's own systemd units
over SSH.

## Prerequisites

- An MCP-capable client with the `palette-mcp` server registered, as configured in the
  [Get Started with Palette MCP](./get-started-palette-mcp.md) tutorial. No special flags are needed. Everything in this
  tutorial is available without `--allow-write` or `--allow-direct-ssh`.

- A Palette API key with read access to the projects containing the clusters you want to triage.

:::info

The examples in this tutorial use `<CLUSTER_NAME>`, `<PROJECT_UID>`, and similar placeholders. Substitute your own
values throughout. The example outputs are representative responses, with identifying values redacted.

:::

## List Clusters and Pick a Target

```shell title="Example Prompt"
List all my clusters.
```

This calls the `read_clusters` tool, which lists clusters or resolves one by UID or name filter. Each item carries
`metadata` (name, project), `spec.cloud_type`, a top-level `status.state`, and its `uid`. Capture the `uid` and
`project_uid` for the cluster you want to triage. You need the `uid` in the next section and the `project_uid` in the
[Scope a Read to a Specific Project](#scope-a-read-to-a-specific-project) section.

## Read Cluster Status

```shell title="Example Prompt"
What's the status of <CLUSTER_NAME>?
```

This calls the `read_cluster_status` tool, which returns the full condition list and lifecycle state for one cluster,
using the cluster's `uid`. The following is an example response for a cluster whose top-level state is `Unknown`.

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

A top-level `state` of `Unknown` tells you that something is off, but not what. The `conditions` array is where the
actual answer lives. Read every condition, not just the ones that are `True`. Here, everything needed for the cluster to
exist is `True` (infra, bootstrap, kubeconfig, image resolution), but `ImagePullSecretPropagationDone` is `False`, with
a specific reason: `ConnectivityIssue`. That is the actual blocker, and it is a management-plane signal: Palette's
control plane cannot reach the cluster's agent to push the pull secret. No kube-level or node-level digging is needed to
identify this one.

## Scope a Read to a Specific Project

Reads run at tenant scope by default, across every project your credential can access (a project-scoped API key narrows
this automatically). Several read tools, including `read_cluster_status`, `read_events`, `read_cluster_observability`,
and `read_attached_profiles_to_cluster`, also accept an optional **per-call** `project_uid` argument that scopes just
that one request. The `read_events` tool accepts it too, but only on object-scoped calls like the one in the
[Correlate with Events](#correlate-with-events) section (with `object_kind` and `object_uid`), never on the tenant-wide
list.

```shell title="Example Prompt"
What's the status of <CLUSTER_NAME>? It's in project <PROJECT_UID>.
```

```json title="Example Output"
{ "ok": true, "status": { "state": "Unknown", "conditions": ["..."] } }
```

The `read_clusters` tool returns each cluster's `project_uid` in its `metadata`, so you always have it on hand from the
[List Clusters and Pick a Target](#list-clusters-and-pick-a-target) section. Pass it explicitly any time your
credential's access does not cover the tenant as a whole, or when you want to be precise about which project a call
targets.

## Correlate with Events

```shell title="Example Prompt"
What events led to that?
```

This calls the `read_events` tool, which returns cluster-scoped event history, with `object_kind="spectrocluster"` and
`object_uid=<uid>`. Pass the same `project_uid` from the
[Scope a Read to a Specific Project](#scope-a-read-to-a-specific-project) section if you needed it there. For the
cluster above, the event history shows a clean image-resolution sequence (`LocatingBaseImage` → `ReconcileImage` →
`ImageResolved`), and nothing in the event log points at the actual blocker, because `ImagePullSecretPropagationDone` is
a status condition, not an event in this case. Events confirm what already succeeded and do not always surface what is
currently failing, so read conditions and events together.

## Check Observability and Attached Profiles

```shell title="Example Prompt"
Check backup, scan, and pack status for <CLUSTER_NAME>.
```

The `read_cluster_observability` tool returns compliance scan, backup, and restore status. In this example, scans and
backup report `"ok"`, and restore reports `"unavailable"` with `RestoreNotExecuted`, which is expected when no restore
has ever been run.

The `read_attached_profiles_to_cluster` tool returns the cluster profiles and pack versions and state attached to the
cluster. In this example, it returns one `cluster`-type profile (OS, Kubernetes, CNI, and CSI packs, all
`InstallSuccess`) and one `add-on` profile, both fully installed. Packs are not the blocker here. This rules out a
pack-compatibility cause and keeps the finding pointed at the connectivity condition from the
[Read Cluster Status](#read-cluster-status) section.

## Synthesize and Decide Whether to Escalate

The `diagnose-cluster` skill's condition-routing table shows where to look next based on which condition is `False`.

| Condition                                          | Points to                                                                                                 |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `CloudInfrastructureReady=False`                   | Infra provisioning: cloud-account credentials, provider resources                                         |
| `BootstrapReady=False` / `BootstrappingDone=False` | Node bootstrap never finished, so check node-level logs (kube-tier escalation)                            |
| `KubeConfigReady=False`                            | Control plane is not up                                                                                   |
| `ImageResolutionDone=False`                        | Image/registry resolution failed                                                                          |
| `ImagePullSecretPropagationDone=False`             | Registry/pack pull-secret propagation failed. Management-plane actionable, no kube-tier escalation needed |

For the example above, the failing condition is the last row: management-plane actionable. The skill routes this
signature to a direct fix rather than escalating to kube-level triage, because there is nothing on the cluster's own
Kubernetes API that would add information the condition message does not already have.

For a `BootstrapReady=False` or node-`NotReady` signature, the `diagnose-cluster` skill mints a session-scoped,
RBAC-backed read-only kubeconfig to inspect CAPI, node, and pod state directly. For self-managed infrastructure only
(`aws`, `azure`, or plain `gcp`, not managed `eks`, `aks`, or `gke`), it can go one level further over SSH into the
node's own service logs. That path creates and tears down a temporary ServiceAccount and ClusterRoleBindings on the live
cluster to do it. Treat it with the same weight as any other credential-minting action against a shared cluster, and
refer to the `diagnose-cluster` skill when your signature needs it.

:::warning

Kube-tier escalation creates a temporary ServiceAccount and ClusterRoleBindings on the live cluster and tears them down
at the end of the run. Node-level SSH triage only ever asks for a key path, so never paste an SSH private key into chat.
Run only the read-only commands the `diagnose-cluster` skill lists for node-level triage, and treat that list as the
boundary. For the Palette MCP server's full security model, refer to
[Palette MCP Architecture](../../../automation/palette-mcp/architecture.md#security).

:::

## Cross-Reference a Healthy Edge-Native Cluster

Not every `cloud_type` is `aws`, `azure`, `gcp`, or managed. Palette also tracks edge deployments as clusters with
`cloud_type: edge-native`. Such a cluster might be the same host covered in the
[Troubleshoot an Edge Host with Palette MCP](./edge-triage-palette-mcp.md) tutorial, reachable here from the cloud and
API side instead of over SSH.

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

Every condition is `True`, a genuinely healthy baseline. It is useful to review once so you know what "nothing to
report" looks like from this same tool. The `diagnose-cluster` skill's kube-tier escalation routes on the cluster's
`cloud_type`. For an edge-native cluster's host-level triage, use the `run_edge_diagnostic` tool from the
[Troubleshoot an Edge Host with Palette MCP](./edge-triage-palette-mcp.md) tutorial instead. They are two different
tools for two different layers of the same tenant.

## Troubleshooting

| Symptom                                                                                            | Likely cause                                                                                      | Fix                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Top-level `status.state` is `Running` or `Unknown` but you need to know why                        | The summary state does not carry the reason                                                       | Read the full `conditions` array. The routing table in the [Synthesize and Decide Whether to Escalate](#synthesize-and-decide-whether-to-escalate) section shows which `False` condition matters.                                                                                                                                                                              |
| `read_events` shows a clean history but the cluster still looks unhealthy                          | Events log what happened, not necessarily the current blocking condition                          | Cross-check `read_cluster_status`'s conditions instead of relying on events alone.                                                                                                                                                                                                                                                                                             |
| Kube-tier escalation reports no `written_to` field                                                 | Server not started with `--allow-write`                                                           | Add `--allow-write` to write the kubeconfig to disk before running kube-tier. Management-plane findings still stand either way.                                                                                                                                                                                                                                                |
| `run_edge_command` is not in the tool list when you try the node-level SSH leg                     | Server not started with `--allow-direct-ssh`                                                      | Add the flag and restart. The [Troubleshoot an Edge Host with Palette MCP](./edge-triage-palette-mcp.md#enable-the-edge-diagnostic-tools) tutorial covers it.                                                                                                                                                                                                                  |
| `kubectl get <provider>cluster,<provider>machine --all-namespaces` returns nothing under kube-tier | Querying the workload kubeconfig for a pre-pivot failure (first control-plane node never came up) | CAPI resources live in the management-plane kubeconfig for a pre-pivot failure, so kube-tier triage against the workload kubeconfig cannot display them. Treat the empty output as that signature, not as 'no CAPI objects,' and rely on the management-plane findings in the [Synthesize and Decide Whether to Escalate](#synthesize-and-decide-whether-to-escalate) section. |

## Validate

Confirm that you can triage a cloud cluster through the Palette MCP server.

1. Run the status, events, observability, and attached-profiles sequence for a cluster, and confirm each call returns an
   `ok: true` response.

2. Read the `conditions` array returned by `read_cluster_status` and identify the blocking condition, the one whose
   `status` is `False`, rather than relying on the top-level `state`.

3. Repeat a `read_cluster_status` call with a per-call `project_uid` and confirm the read is scoped to that project.

4. Check the failing condition against the routing table, and confirm its message provides the reason without needing
   kube-tier escalation.

5. Read an edge-native cluster's status through the API, and confirm every condition reports `True` for a healthy
   baseline.

## Cleanup

This tutorial's example does not escalate to kube-tier, so no temporary credentials are created and there is nothing to
clean up. If your own triage does escalate and a cleanup step reports failure, re-run the same `--cleanup` command the
`diagnose-cluster` skill names once the cluster is reachable again.

## Wrap-up

In this tutorial, you performed a layered triage of a cloud cluster from management-plane signals down to a root cause.
You ran the `diagnose-cluster` skill's layered sequence of status, events, observability, and attached profiles, read a
cluster's condition list to find the actual blocker instead of the summary `state`, and scoped a single read to a
specific project with a per-call `project_uid`. You used the condition-routing table to decide whether a finding needs
kube-tier escalation, and you compared an unhealthy cluster against a healthy edge-native baseline through the same
tool.

Because these tools are read-only and most root causes resolve at the management-plane tier, you can run this sequence
safely against a shared cluster without escalating further.

To continue, refer to the following tutorials:

- [Troubleshoot an Edge Host with Palette MCP](./edge-triage-palette-mcp.md) for the host-level counterpart to this
  tutorial's edge-native cross-reference.

- [Get Started with Palette MCP](./get-started-palette-mcp.md) and
  [Morning Fleet Check with Palette MCP](./fleet-health-palette-mcp.md) for the rest of the Palette MCP troubleshooting
  series.
