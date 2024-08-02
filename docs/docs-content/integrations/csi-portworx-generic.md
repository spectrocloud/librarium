---
sidebar_label: "Portworx /w Operator"
title: "Portworx Operator"
description: "Portworx storage CSI for all use cases"
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64"]
sidebar_class_name: "hide-from-sidebar"
tags: ["packs", "portworx", "storage"]
---

<PartialsComponent category="packs" name="portworx-operator" />

## Terraform

Use the following Terraform code to interact with the Portworx Operator pack in your Terraform scripts.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "portworx-operator" {
  name    = "csi-portworx-generic"
  version = "3.0.0"
  type = "operator-instance"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
