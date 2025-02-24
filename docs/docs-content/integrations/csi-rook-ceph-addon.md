---
sidebar_label: "rook-ceph"
title: "Rook Ceph"
description: "Rook is an open source cloud-native storage orchestrator that provides the platform, framework, and support for Ceph
storage to natively integrate with cloud-native environments. Ceph is a distributed storage system that provides file,
block, and object storage and is deployed in large-scale production clusters."
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64"]
sidebar_class_name: "hide-from-sidebar"
tags: ["packs", "rook-ceph", "storage"]
---

<PartialsComponent category="packs" name="rook-ceph" />

## Terraform

```hcl
data "spectrocloud_registry" "registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "csi-rook-ceph" {
  name    = "csi-rook-ceph-addon"
  version = "1.14.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.registry.id
}
```
