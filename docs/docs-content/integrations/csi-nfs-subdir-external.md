---
sidebar_label: "nfs-subdir-External"
title: "Kubernetes NFS Subdir External Provisionerl"
description: "NFS-Subdir-External Provisioner pack in Spectro Cloud"
type: "integration"
category: ["storage", "amd64"]
hide_table_of_contents: true
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/csi-nfs-subdir-external/blobs/sha256:4b40eb85382d04dc4dcfc174b5e288b963b6201f6915e14b07bd8a5c4323b51b?type=image.webp"
tags: ["packs", "nfs-subdir-external", "storage"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="4.0.x" value="4.0.x">

</TabItem>

</Tabs>

## Terraform

Use the following Terraform snippet to reference the NFS-Subdir-External Provisioner pack in your Terraform template.
Update the version number as needed.

```hcl
data "spectrocloud_registry" "community_registry" {
  name = "Palette Community Registry"
}


data "spectrocloud_pack_simple" "csi-nfs-subdir-external" {
  name         = "csi-nfs-subdir-external"
  version      = "4.0.13"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.community_registry.id
}
```
