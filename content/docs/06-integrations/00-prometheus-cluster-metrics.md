---
title: 'Prometheus Cluster Metrics'
metaTitle: 'Prometheus Cluster Metrics'
metaDescription: "Use the Prometheus Cluster Metrics addon pack to expose Palette resource metrics"
hiddenFromNav: true
type: "integration"
hideToC: false
category: ['monitoring']
logoUrl: 'https://registry.spectrocloud.com/v1/prometheus-operator/blobs/sha256:64589616d7f667e5f1d7e3c9a39e32c676e03518a318924e123738693e104ce0?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

The Prometheus Cluster Metrics pack exposes Palette-specific host cluster metrics to Prometheus. You can use this data to learn about the state of your clusters, resource utilization, and more. Use the [Spectro Cloud Grafana Dashboards](/integrations/grafana-spectrocloud-dashboards) pack to access the metric data through Grafana dashboards.


# Versions Supported

**3.4.X**


# Prerequisites

* A host cluster that has the [Prometheus Operator pack](/integrations/prometheus-operator) `v45.4.X` or greater installed. Check out the [Deploy Monitoring Stack](/clusters/cluster-management/monitoring/deploy-monitor-stack) for instructions on how to deploy a monitoring stack.


* A cluster profile with the [Prometheus Agent](/integrations/prometheus-agent) pack `v19.0.X` or greater installed.

# Usage

The Prometheus Cluster Metrics requires no additional configuration and is designed to work out-of-the-box. 

You can learn how to add the Prometheus Cluster Metrics to your cluster by following the steps outlined in the [Enable Monitoring on Host Cluster](/clusters/cluster-management/monitoring/deploy-agent/).

Use the [Spectro Cloud Grafana Dashboards](/integrations/grafana-spectrocloud-dashboards) pack to access the metric data through Grafana dashboards. 

# Terraform

```terraform
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "cluster-metrics" {
  name    = "spectro-cluster-metrics"
  version = "3.3.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

# References

- [Enable Monitoring on Host Cluster](/clusters/cluster-management/monitoring/deploy-agent/).


- [Deploy Monitoring Stack](/clusters/cluster-management/monitoring/deploy-monitor-stack)


- [Prometheus Operator pack](/integrations/prometheus-operator)


- [Prometheus Agent](/integrations/prometheus-agent)


- [Spectro Cloud Grafana Dashboards](/integrations/grafana-spectrocloud-dashboards)