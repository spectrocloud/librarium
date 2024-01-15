---
sidebar_label: 'Spectro Cloud Grafana Dashboards'
title: 'Spectro Cloud Grafana Dashboards'
description: 'Learn more about the Spectro Cloud Grafana dashboard and how to use it.'
type: "integration"
category: ['monitoring', 'amd64']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.spectrocloud.com/v1/spectrocloud-grafana-dashboards/blobs/sha256:a48c9929480a8c463e409e7563279f97d80e674c5cc91cb81c47454aea2c203d?type=image/png'
tags: ['packs', 'spectrocloud-grafana-dashboards', 'monitoring']
---


The Spectro Cloud Grafana Dashboards is an addon pack that exposes internal cluster resource metrics. You can access the information exposed by the pack in Grafana by visiting the **Spectro Cloud / Spectro Clusters** dashboard. The following information is exposed by the Spectro Cloud Grafana Dashboards. <br /> <br />

- Status of all cluster profile layers.


- CPU and Memory usage of the cluster and all the pods in the cluster.


- Cluster health status.


- The cluster's node health status and uptime.

<br />


![A grafana dashboard view of the cluster metric displaying pack status](/clusters_cluster-management_grafana_spectro_metrics.png)


## Versions Supported

**1.0.X**

## Prerequisites

* A host cluster that has the [Prometheus Operator pack](prometheus-operator.md) `v45.4.X` or greater installed. Check out [Deploy Monitoring Stack](../clusters/cluster-management/monitoring/deploy-monitor-stack.md) for instructions on how to deploy a monitoring stack.


* A cluster profile with the [Prometheus Cluster Metrics](prometheus-cluster-metrics.md) pack `v3.4.X` or greater installed.


## Usage

The Spectro Cloud Grafana Dashboards require no additional configuration and the pack is designed to work out-of-the-box. 

You can learn how to add the Spectro Cloud Grafana Dashboards to your cluster by following the steps outlined in the [Enable Monitoring on Host Cluster](../clusters/cluster-management/monitoring/deploy-agent.md).

<br />

:::warning

Pods without the defined attributes `request` and `limit` will not display metrics data in the Grafana out-of-the-box Kubernetes Pods dashboard.

:::



## Terraform


```terraform hcl
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



## References

- [Enable Monitoring on Host Cluster](../clusters/cluster-management/monitoring/deploy-agent.md).


- [Deploy Monitoring Stack](../clusters/cluster-management/monitoring/deploy-monitor-stack.md)


- [Prometheus Operator pack](prometheus-operator.md)


- [Prometheus Agent](prometheus-agent.md)