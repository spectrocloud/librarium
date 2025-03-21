---
sidebar_label: "GKE GCE-Persistent-Disk"
title: "GKE GCE Persistent Disk"
description: "GCE Persistent Disk storage pack in Spectro Cloud for GKE"
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64"]
sidebar_class_name: "hide-from-sidebar"
tags: ["packs", "storage", "gce-persistent-disk"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="1.13.x" value="1.13.x">

</TabItem>

<TabItem label="1.12.x" value="1.12.x">

</TabItem>

</Tabs>

## Terraform

Use the following Terraform snippet to reference the GCE Persistent Disk for GKE pack in your Terraform code.

```hcl

data "spectrocloud_registry" "palette_registry_oci" {
  name = "Palette Registry"
}

data "spectrocloud_pack_simple" "cs-gcp-driver" {
  name         = "gke-csi-gcp-driver"
  version      = "1.0.0"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.palette_registry_oci.id
}
```
