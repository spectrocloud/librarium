---
sidebar_label: "Longhorn"
title: "Longhorn"
description: "Longhorn pack in Palette"
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64", "fips"]
sidebar_class_name: "hide-from-sidebar"
tags: ["packs", "longhorn", "storage"]
---

<PartialsComponent category="packs" name="longhorn" />

## Terraform

Use the following Terraform snippet to reference the Longhorn pack in your Terraform template. Update the version number
as needed.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "csi-longhorn-addon" {
  name    = "csi-longhorn"
  version = "1.6.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
