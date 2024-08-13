---
sidebar_label: "Ubuntu"
title: "Ubuntu"
description: "Choose Ubuntu Operating System pack in Palette."
hide_table_of_contents: true
type: "integration"
category: ["operating system", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/ubuntu-vsphere/blobs/sha256:09a727f9005b79c69d8e60e12ce130880c63131315b49e7fb4cc44e53d34dc7a?type=image.webp"
tags: ["packs", "ubuntu", "operating system"]
---

<PartialsComponent category="packs" name="ubuntu" />

## Terraform

You can reference Ubuntu in Terraform with the following code snippet.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "ubuntu" {
  name    = "ubuntu-azure"
  version = "22.04"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
