---
sidebar_label: "Spectro Cluster Metrics"
title: "Spectro Cluster Metrics"
description: "Use the Spectro Cluster Metrics addon pack to expose Palette resource metrics"
type: "integration"
hide_table_of_contents: true
category: ["monitoring", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/prometheus-operator/blobs/sha256:64589616d7f667e5f1d7e3c9a39e32c676e03518a318924e123738693e104ce0?type=image.webp"
tags: ["packs", "spectro-cluster-metrics", "monitoring"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="3.4.x" value="3.4.x">

You can learn how to add the Prometheus Cluster Metrics to your cluster by following the steps outlined in the
[Enable Monitoring on Host Cluster](../clusters/cluster-management/monitoring/deploy-agent.md).

<!-- prettier-ignore-start -->
Use the <VersionedLink text="Spectro Cloud Grafana Dashboards" url="/integrations/packs/?pack=spectro-grafana-dashboards"/> pack to access the metric data through Grafana dashboards.
<!-- prettier-ignore-end -->

</TabItem>

</Tabs>

## Terraform

You can reference the Spectro Cluster Metrics pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack" "cluster-metrics" {
  name    = "spectro-cluster-metrics"
  version = "3.4.1"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
