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
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Prometheus Cluster Metrics

The Prometheus Cluster Metrics is an addon pack that exposes internal cluster resource metrics. You can access the information exposed by the pack in Grafana by visiting the **Spectro Cloud / Spectro Clusters** dashboard. The following information is exposed by the Prometheus Cluster Metrics pack. <br /> <br />

- Status of all cluster profile layers.


- CPU and Memory usage of the cluster and all the pods in the cluster.


- Cluster health status.


- The cluster's node health status and uptime.

<br />


![A grafana dashboard view of the cluster metric displaying pack status](/clusters_cluster-management_grafana_spectro_metrics.png)

# Versions Supported

**3.3.X**


# Prerequisites

* A host cluster that has the [Prometheus Operator pack](/integrations/prometheus-operator) `v45.4.X` or greater installed. Check out the [Deploy Monitoring Stack](/clusters/cluster-management/monitoring/deploy-monitor-stack) for instructions on how to deploy a monitoring stack.


* A cluster profile with the [Prometheus Agent](/integrations/prometheus-agent) pack `v19.0.X` or greater installed.

# Usage

The Prometheus Cluster Metrics requires no additional configuration and is designed to work out-of-the-box. 

You can learn how to add the Prometheus Cluster Metrics to your cluster by following the steps outlined in the [Enable Monitoring on Host Cluster](/clusters/cluster-management/monitoring/deploy-agent/).

<br />

<WarningBox>

Pods without the defined attributes `request` and `limit` will display no metrics data in the Grafana out-of-the-box Kubernetes Pods dashboard.

</WarningBox>


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