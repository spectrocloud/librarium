---
sidebar_label: "heart-beat"
title: "Heartbeat"
description: "Heart Beat monitoring pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["monitoring", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/heartbeat/blobs/sha256:19fec69ae172c3e54d5fb09c176517cf7bfeb1bc740bde65c200e14115510313?type=image.webp"
tags: ["packs", "heart-beat", "monitoring"]
---

## Terraform

You can reference the Heartbeat pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack" "heartbeat" {
  name    = "heartbeat"
  version = "1.0.0"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
