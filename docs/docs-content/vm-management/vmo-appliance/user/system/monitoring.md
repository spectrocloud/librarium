# Monitoring & Dashboards

VMO Manager includes a built-in metrics pipeline and customizable dashboards for cluster and VM observability.

## Metrics Pipeline Overview

Metrics flow through the following stages:

1. **OTel Collector** — A DaemonSet collects metrics from nodes (cAdvisor, node-agent hardware metrics) and forwards them via OTLP HTTP.
2. **OTLP HTTP Receiver** — VMO Manager receives metrics at `/otlp/v1/metrics`.
3. **In-Memory Ring Buffer** — Recent metrics are stored in an in-memory ring buffer for short-term dashboards and gauges.
4. **Victoria Metrics** — When `EXTERNAL_METRICS_URL` is configured, long-range PromQL queries are forwarded to Victoria Metrics for historical data.

> **Note:** The ring buffer provides graceful degradation when no external metrics backend is configured. Gauges and recent charts work from the ring buffer; long-range time-series require Victoria Metrics.

## Built-in Dashboards

VMO Manager ships with several built-in dashboards:

| Dashboard | Description |
|-----------|-------------|
| Cluster Overview | Aggregated CPU, memory, VM counts, and cluster health |
| Node Hardware Health | NUMA memory and KSM metrics per node |
| Node Metrics | Per-node resource utilization from cAdvisor |
| VM Metrics | Per-VM CPU and memory usage |
| Overcommit | CPU and memory overcommit ratios per node |

Built-in dashboards are always available and cannot be deleted. You can customize them by adding, removing, or rearranging widgets.

## Dashboard Customization

### Drag-and-Drop Widgets

Dashboards use a grid layout. You can:

- **Add widgets** — Open the widget catalog and drag a widget onto the grid.
- **Resize** — Drag widget corners or edges to change size.
- **Reorder** — Drag widgets to new positions.
- **Remove** — Remove a widget from the dashboard (built-in dashboards can have widgets removed; the dashboard itself remains).

### Per-Widget Time Controls

Each widget can have its own time range for queries:

- Last 5 minutes, 15 minutes, 1 hour, 6 hours, 24 hours
- Custom range (when supported)

This allows mixing short-term and long-term views on the same dashboard.

### Panel Types

Six panel types are available:

| Type | Description |
|------|-------------|
| Stat | Single numeric value (e.g., total CPU, VM count) |
| Gauge | Value with min/max range and color thresholds |
| Timeseries | Line chart over time |
| Bar | Bar chart (e.g., per-node comparison) |
| Table | Tabular data with sortable columns |
| Text | Static markdown or plain text for annotations |

### Dashboard Tabs

You can create multiple tabs within a dashboard:

- **Create** — Add a new tab with a custom name.
- **Rename** — Change the tab name.
- **Delete** — Remove a tab (only if it is not the last tab).

Each tab has its own set of widgets and layout.

## Dashboard Manifests

Dashboard manifests are admin-managed templates that define dashboard structure and default widgets. They are stored as CRDs (`VmoDashboardManifest`) and can be:

- **Built-in** — Shipped with VMO Manager, always present.
- **Custom** — Uploaded by admins via Settings > Dashboards (when the `dashboard-manifests` feature flag is enabled).

Custom dashboard manifests allow you to define standard dashboards for your organization and deploy them across multiple VMO Manager instances.

## Victoria Metrics Integration

For long-range historical queries (e.g., 7-day or 30-day trends), configure an external Victoria Metrics endpoint:

1. Set `EXTERNAL_METRICS_URL` (e.g., `http://victoria-metrics.monitoring.svc.cluster.local:8428`).
2. Ensure the OTel pipeline forwards metrics to Victoria Metrics, or configure Victoria Metrics to scrape the same sources.

When configured, PromQL range queries from dashboard panels are forwarded to Victoria Metrics. The ring buffer continues to serve recent data for gauges and short-range charts.

> **Tip:** Victoria Metrics is deployed via a separate Helm chart (managed outside this repo). Configure the OTel collector to export to both VMO Manager (for the ring buffer) and Victoria Metrics (for long-term storage) if needed.
