---
sidebar_label: "Argo CD"
title: "Argo CD"
description: "Argo CD for Spectro Cloud Palette"

type: "integration"
category: ["system app", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/argo-cd/blobs/sha256:647cd3df6fec421e6580589ea7229762d8e828c77036f835f14f4c15c2a44c4c?type=image.webp"
tags: ["packs", "argo-cd", "system app"]
---

## Terraform

You can reference the Argo CD pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack" "argo_cd" {
  name    = "argo-cd"
  version = "5.46.8"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
