---
sidebar_label: "Hello Universe"
title: "Hello Universe"
description: "Learn about the Hello Universe pack and how you can use it within your Kubernetes clusters."
hide_table_of_contents: true
type: "integration"
category: ["app services", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://raw.githubusercontent.com/spectrocloud/pack-central/main/packs/hello-universe-1.1.1/logo.png"
tags: ["packs", "hello-universe", "app-services"]
---

:::info

The three-tier application configuration is only supported by version 1.1.2 of the pack.

:::

## Terraform

You can reference the Hello Universe pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "community_registry" {
  name = "Palette Registry"
}
data "spectrocloud_pack" "hellouniverse" {
  name         = "hello-universe"
  version      = "1.1.2"
  registry_uid = data.spectrocloud_registry.community_registry.id
}
```
