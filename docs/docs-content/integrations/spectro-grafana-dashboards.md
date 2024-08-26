---
sidebar_label: "Spectro Cloud Grafana Dashboards"
title: "Spectro Cloud Grafana Dashboards"
description: "Learn more about the Spectro Cloud Grafana dashboard and how to use it."
type: "integration"
category: ["monitoring", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/spectrocloud-grafana-dashboards/blobs/sha256:a48c9929480a8c463e409e7563279f97d80e674c5cc91cb81c47454aea2c203d?type=image.webp"
tags: ["packs", "spectrocloud-grafana-dashboards", "monitoring"]
---

## Versions Supported

<Tabs queryString="parent">
<TabItem label="1.0.x" value="1.0.x">

You can learn how to add the Spectro Cloud Grafana Dashboards pack to your cluster by following the steps outlined in
the [Enable Monitoring on Host Cluster](../clusters/cluster-management/monitoring/deploy-agent.md).

:::warning

Pods without the defined attributes `request` and `limit` will not display metrics data in the Grafana out-of-the-box
Kubernetes Pods dashboard.

:::

</TabItem>
</Tabs>

## Terraform

You can reference the Spectro Cloud Grafana Dashboards pack in Terraform with the following data resource.

```terraform hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack" "spectro-cloud-grafana-dashboards" {
  name    = "spectrocloud-grafana-dashboards"
  version = "1.0.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
