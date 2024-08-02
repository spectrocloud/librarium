---
sidebar_label: "Citrix IPAM"
title: "Citrix IPAM"
description: "Citrix IPAM Load Balancer pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["load balancers", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/lb-citrix-adc/blobs/sha256:17f8ebc0dc69d329a39e5d27fc0ce3574034d18ab1776fabda396c5403b0bd86?type=image.webp"
tags: ["packs", "citrix-ipam", "network"]
---

## Terraform

You can reference the Citrix ADC pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}
data "spectrocloud_pack" "citrix" {
  name    = "lb-citrix-adc"
  version = "1.7.6"
  type = "manifest"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
