---
sidebar_label: "Kubernetes"
title: "Kubernetes"
description: "Learn about the Kubernetes pack and how you can use it with your host clusters."
hide_table_of_contents: true
type: "integration"
category: ["kubernetes", "amd64"]
sidebar_class_name: "hide-from-sidebar"
tags: ["packs", "kubernetes"]
---

<PartialsComponent category="packs" name="kubernetes-generic" />

## Terraform

You can retrieve details about the Kubernetes pack for custom clouds by using the following Terraform code.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "kubernetes-custom"
  version = "1.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
