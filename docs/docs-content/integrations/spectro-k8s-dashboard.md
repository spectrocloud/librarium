---
sidebar_label: "Spectro Kubernetes Dashboard"
title: "Spectro Kubernetes Dashboard"
description:
  "Palette's pre-configured Kubernetes Dashboard Monitoring pack reduces the complexity of standing up the Kubernetes
  dashboard for a cluster."
hide_table_of_contents: true
type: "integration"
category: ["monitoring", "arm64", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/k8s-dashboard/blobs/sha256:2de5d88b2573af42d4cc269dff75744c4174ce47cbbeed5445e51a2edd8b7429?type=image.webp"
tags: ["packs", "spectro-k8s-dashboard", "monitoring"]
---

## Versions Supported

<Tabs groupId="parent">
<TabItem label="2.7.x" value="2.7.x">

</TabItem>
</Tabs>

## Terraform

You can reference the Spectro Proxy pack in Terraform with a data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
 name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s-dashboard" {
 name    = "spectro-k8s-dashboard"
 version = "2.7.1"
 type = "helm"
 registry_uid = data.spectrocloud_registry.public_registry.id
}
```
