---
sidebar_label: "kube-bench"
title: "kube-bench"
description: "kube-bench security pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["security", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: https://registry-addon.spectrocloud.com/v1/kube-bench/blobs/sha256:28c233e5ad884d5356a183c37f323263eb4acca860c28b326ecd99094b500c31?type=image.webp
tags: ["packs", "kube-bench", "security"]
---

## Terraform

You can reference the Kube-bench pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack" "kubebench" {
  name    = "kubebench"
  version = "1.16.7"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
