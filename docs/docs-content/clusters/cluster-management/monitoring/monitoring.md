---
sidebar_label: "Cluster Monitoring"
title: "Cluster Monitoring"
description: "Learn how to set up cluster monitoring with Prometheus"
hiddenFromNav: false
tags: ["clusters", "cluster management", "monitoring"]
---

Palette exposes a set of [workload metrics](../workloads.md) out-of-the-box to help cluster administrators better
understand the resource utilization of the cluster. The workload metrics Palette exposes are a snapshot in time and
offer a limited ability to review past values. Administrators who want more information or a better understanding of
their cluster metrics should consider using a dedicated monitoring system.

Several Packs are available in the monitoring category that you can use to add additional monitoring capabilities to
your cluster and help you get answers to questions. For a more robust and scalable solution, we recommend creating a
dedicated monitoring stack for your environment. You can deploy a monitoring stack that uses
[Prometheus](https://prometheus.io/) to collect metrics from all clusters in your environment.

To help you get started with deploying a monitoring stack to your Palette environment, check out the
[Deploy Monitoring Stack](deploy-monitor-stack.md) and the [Enable Monitoring on Host Cluster](deploy-agent.md) guide.

## Resources

<!-- prettier-ignore-start -->

- [Deploy Monitoring Stack](./deploy-monitor-stack.md)

- [Enable Monitoring on Host Cluster](./deploy-agent.md)

- [Deploy OpenTelemetry Monitoring Stack](./open-telemetry.md)

- <VersionedLink text="Prometheus Operator Pack" url="/integrations/packs/?pack=prometheus-operator" />


- <VersionedLink text="Prometheus Agent Pack" url="/integrations/packs/?pack=prometheus-agent" />


- <VersionedLink text="Spectro Cluster Metrics Pack" url="/integrations/packs/?pack=spectro-cluster-metrics" />


- <VersionedLink text="Spectro Cloud Grafana Dashboards Pack" url="/integrations/packs/?pack=spectro-grafana-dashboards" />

<!-- prettier-ignore-end -->
