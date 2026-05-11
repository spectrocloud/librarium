# Compute Nodes

This document describes how VMO Manager displays and manages Kubernetes nodes that host virtual machines. You can view node status, hardware metrics, perform maintenance actions, and manage node labels.

## Node Overview Page

The **Infrastructure > Compute Nodes** page shows all cluster nodes in a card-based layout. Each node card displays:

- **Status** — Ready, NotReady, or Unknown
- **CPU** — Allocated and total cores
- **Memory** — Allocated and total capacity
- **Control plane vs worker** — Nodes are grouped by role (control plane, worker)

Nodes are grouped by control plane and worker roles. The layout helps you quickly identify resource availability and node health.

## Node Detail Page

Click a node to open its detail page. The detail view includes:

- **Resource gauges** — CPU and memory utilization with visual bars
- **History charts** — Recent CPU and memory usage over time
- **VM list** — Virtual machines running on this node
- **Hardware metrics** — NUMA, thermal, SR-IOV, and THP data (when available)

### Hardware Metrics

The vmo-node-agent DaemonSet runs on each node and collects hardware-level metrics via OTLP. These metrics are forwarded to VMO Manager (or Victoria Metrics when configured) and displayed on the node detail page.

| Metric | Description |
|--------|-------------|
| **NUMA memory topology** | Per-NUMA-node memory stats (total and free). Useful for NUMA-aware VM placement. |
| **Thermal health** | Temperature readings from thermal zones (e.g. `x86_pkg_temp`). Helps identify overheating. |
| **SR-IOV VFs** | Virtual function counts per interface (configured vs total). Indicates SR-IOV availability. |
| **THP** | Transparent Huge Pages mode (`always`, `madvise`, `never`). Affects memory performance. |

> **Note:** Hardware metrics require the vmo-node-agent DaemonSet to be deployed. The DaemonSet is configured via the Helm chart when `nodeAgent.enabled` is true. Metrics appear after the agent's scan interval.

### KSM (Kernel Same-page Merging)

When KSM is enabled on a node (via the managed label toggle), the node detail page shows KSM metrics: pages shared, pages sharing, and estimated memory saved. If KSM is enabled but no metrics appear yet, wait for the next node-agent scan interval.

## Cordon, Uncordon, and Drain

You can perform maintenance actions on nodes from the node detail page or via context menu:

| Action | Effect |
|--------|--------|
| **Cordon** | Marks the node as unschedulable. No new pods or VMs will be placed on it. Existing workloads continue running. |
| **Uncordon** | Removes the unschedulable mark. The node accepts new workloads again. |
| **Drain** | Evicts all workloads from the node (graceful shutdown). Use before maintenance or when retiring a node. |

> **Warning:** Drain evicts all pods and VMs from the node. Ensure VMs can be migrated or restarted elsewhere before draining.

## Node Labels

Node labels are Kubernetes metadata used for scheduling and configuration. VMO Manager supports:

- **Adding labels** — Add custom key-value pairs
- **Removing labels** — Delete labels you no longer need
- **Managed labels** — Toggle labels that VMO Manager controls (e.g. KSM toggle)

### Managed Labels

When KubeVirt exposes managed labels (e.g. KSM), the node detail page shows toggle controls. Managed labels are applied or removed by VMO Manager based on your selection. For example, enabling KSM on a node adds the `vmo.spectrocloud.com/ksm=true` label.

## Hardware Metrics from vmo-node-agent

The vmo-node-agent is a DaemonSet that runs on each node. It:

1. Reads `/sys` and `/proc` for node-local data
2. Discovers NUMA memory, thermal zones, SR-IOV VFs, and THP mode
3. Pushes metrics to the OTel Collector via OTLP
4. Runs on a configurable interval (default: 60 seconds)

Metrics are stored in VMO Manager's in-memory ring buffer for short-term dashboards. When `EXTERNAL_METRICS_URL` is configured. long-range queries are forwarded to Victoria Metrics.

> **Tip:** When creating VMs with NUMA passthrough or SR-IOV interfaces, use the node detail page to verify hardware availability before scheduling.
