---
sidebar_label: "kube-watch"
title: "kube-watch"
description: "kube-watch monitoring pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["monitoring", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/kubewatch/blobs/sha256:a277fb90357df9cbffe98eea1ed100fba1b17970b8fc056d210c4f7bfe4f17a3?type=image.webp"
tags: ["packs", "kube-watch", "monitoring"]
---

## Terraform

You can reference the Kubewatch pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}
data "spectrocloud_pack" "kubewatch" {
  name    = "kubewatch"
  version = "1.0.7"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
