---
sidebar_label: "Astra Trident Addon"
title: "Astra Trident Addon"
description: "Learn abou the Astra Trident pack."
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64", "community"]
sidebar_class_name: "hide-from-sidebar"
tags: ["packs", "trident", "storage"]
---

<PartialsComponent category="packs" name="trident" />

## Terraform

You can retrieve details about the Astra Trident pack by using the following Terraform code.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "astra-trident" {
  name    = "csi-trident-addon"
  version = "23.01.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
