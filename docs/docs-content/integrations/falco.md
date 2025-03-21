---
sidebar_label: "Falco"
title: "Falco"
description: "Integration of the Falco add on into Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["security", "amd64"]
sidebar_class_name: "hide-from-sidebar"
tags: ["packs", "falco", "security"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="1.16.x" value="1.16.x">

</TabItem>
<TabItem label="1.0.x" value="1.0.x">

</TabItem>

<TabItem label="1.13.x" value="1.13.x">

- **1.13.1**

</TabItem>

</Tabs>

## Terraform

You can reference the Falco pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "palette_registry" {
  name = "Palette Registry"
}

data "spectrocloud_pack" "external-dns" {
  name         = "falco"
  version      = "2.0.18"
  registry_uid = data.spectrocloud_registry.palette_registry.id
}
```
