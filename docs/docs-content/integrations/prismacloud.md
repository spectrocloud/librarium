---
sidebar_label: "prisma-cloud-compute"
title: "Prisma Cloud Compute"
description: "prism-cloud-compute Security pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["security", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/prismacloud/blobs/sha256:9ddb035af0e9f299e5df178ebb3153e90383a5e42ded2c1a3f6c9470dd851c12?type=image.webp"
tags: ["packs", "prismacloud", "security"]
---

## Terraform

You can reference the Prisma Cloud Compute pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}
data "spectrocloud_pack" "prisma" {
  name    = "prismacloud"
  version = "20.09.0"
  type = "manifest"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
