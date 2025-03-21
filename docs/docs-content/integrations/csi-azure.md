---
sidebar_label: "Azure Disk"
title: "Azure Disk"
description: "Azure Disk storage add on into Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/csi-azure/blobs/sha256:0787b7943741181181823079533cd363884a28aa0651715ea43408bdc77a5c51?type=image.webp"
tags: ["packs", "azure-disk", "storage"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="1.30.x" value="1.30.x">

</TabItem>
<TabItem label="1.29.x" value="1.29.x">

</TabItem>
</Tabs>

## Terraform

Use the following Terraform snippet to reference the Azure Disk CSI pack in your Terraform template. Update the version
number as needed.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "azure-disk-csi" {
  name    = "csi-azure"
  version = "1.30.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
