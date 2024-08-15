---
sidebar_label: "Kong"
title: "Kong"
description: "Kong Ingress pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["ingress", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/kong/blobs/sha256:600f20583f85ccad4c515e51542f74aa9acb851d5b03ecb0e7b3435eb51ecf56?type=image.webp"
tags: ["packs", "kong", "network"]
---

## Terraform

You can reference the Kong pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack" "kong" {
  name    = "kong"
  version = "2.38.0"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
