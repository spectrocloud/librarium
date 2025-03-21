---
sidebar_label: "KubeVirt"
title: "KubeVirt"
description: "Choosing KubeVirt within the Palette console"
hide_table_of_contents: true
type: "integration"
category: ["system app", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/kubevirt/blobs/sha256:185e7a7658c05ab478f2822b080a7e21da9113b4a8bf5fb7fb3338d9a5796eed?type=image.webp"
tags: ["packs", "kubevirt", "system app"]
---

## Terraform

You can reference the Kubevirt pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}
data "spectrocloud_pack" "kubevirt" {
  name    = "kubevirt"
  version = "0.59.0"
  type = "manifest"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
