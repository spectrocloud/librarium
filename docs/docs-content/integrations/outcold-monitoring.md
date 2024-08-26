---
sidebar_label: "Outcold Solutions"
title: "Outcold Solutions"
description: "Outcold Solutions - Monitoring pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["monitoring", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/outcold-monitoring/blobs/sha256:3140960d1f39649ad821cfc59450d3c164079b03d15387b2e638eae07442af41?type=image.webp"
tags: ["packs", "outcold-monitoring", "monitoring"]
---

## Terraform

You can reference the Outcold Solutions pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "community_registry" {
  name = "Palette Registry"
}
data "spectrocloud_pack" "outcold" {
  name    = "outcold-monitoring"
  version = "5.0.0"
  type = "manifest"
  registry_uid = data.spectrocloud_registry.community_registry.id
}
```
