---
sidebar_label: "kube-hunter"
title: "kube-hunter"
description: "kube-hunter monitoring pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["monitoring", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/kubehunter/blobs/sha256:6b6b9138fa056677646712a888192498247f71aa421edd27b25458a8fbf8af0c?type=image.webp"
tags: ["packs", "kube-hunter", "security"]
---

## Terraform

You can reference the Kube-hunter pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack" "kubehunter" {
  name    = "kubehunter"
  version = "1.0.3"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
