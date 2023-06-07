---
title: 'Spectro Cloud Grafana Dashboards'
metaTitle: 'Spectro Cloud Grafana Dashboards'
metaDescription: 'Learn more about the Spectro Cloud Grafana dashboard and how to use them.'
hiddenFromNav: true
type: "integration"
category: ['monitoring']
logoUrl: 'https://registry.spectrocloud.com/v1/spectrocloud-grafana-dashboards/blobs/sha256:a48c9929480a8c463e409e7563279f97d80e674c5cc91cb81c47454aea2c203d?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

The Spectro Cloud Grafana Dashboards is an addon pack that exposes internal cluster resource metrics. You can access the information exposed by the pack in Grafana by visiting the **Spectro Cloud / Spectro Clusters** dashboard. The following information is exposed by the Spectro Cloud Grafana Dashboards. <br /> <br />

- Status of all cluster profile layers.


- CPU and Memory usage of the cluster and all the pods in the cluster.


- Cluster health status.


- The cluster's node health status and uptime.

<br />


![A grafana dashboard view of the cluster metric displaying pack status](/clusters_cluster-management_grafana_spectro_metrics.png)


# Versions Supported

**1.0.X**

# Prerequisites

* A host cluster that has the [Prometheus Operator pack](/integrations/prometheus-operator) `v45.4.X` or greater installed. Check out the [Deploy Monitoring Stack](/clusters/cluster-management/monitoring/deploy-monitor-stack) for instructions on how to deploy a monitoring stack.


* A cluster profile with the [Prometheus Cluster Metrics](/integrations/prometheus-cluster-metrics) pack `v3.4.X` or greater installed.


# Usage

The Spectro Cloud Grafana Dashboards require no additional configuration and the pack is designed to work out-of-the-box. 

You can learn how to add the Spectro Cloud Grafana Dashboards to your cluster by following the steps outlined in the [Enable Monitoring on Host Cluster](/clusters/cluster-management/monitoring/deploy-agent/).

<br />

<WarningBox>

Pods without the defined attributes `request` and `limit` will display no metrics data in the Grafana out-of-the-box Kubernetes Pods dashboard.

</WarningBox>



# Terraform


```terraform
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "spectro-cloud-grafana-dashboards" {
  name    = "spectrocloud-grafana-dashboards"
  version = "1.0.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```



# References

- [Enable Monitoring on Host Cluster](/clusters/cluster-management/monitoring/deploy-agent/).


- [Deploy Monitoring Stack](/clusters/cluster-management/monitoring/deploy-monitor-stack)


- [Prometheus Operator pack](/integrations/prometheus-operator)


- [Prometheus Agent](/integrations/prometheus-agent)