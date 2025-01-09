---
sidebar_label: "Kubernetes Konvoy"
title: "Kubernetes"
description: "Learn about the Kubernetes pack and how you can use it with your host clusters."
hide_table_of_contents: true
type: "integration"
category: ["kubernetes", "amd64"]
sidebar_class_name: "hide-from-sidebar"
tags: ["packs", "kubernetes"]
---

## Versions Supported

<Tabs queryString="parent">
<TabItem label="1.27.X" value="1.27.x">

Refer to the <VersionedLink text="RHEL and Konvoy"  url="/byoos/usecases/vmware/konvoy/"/> to learn how to create a
custom image for RHEL and Konvoy.

</TabItem>
<TabItem label="1.26.X" value="1.26.x">

Refer to the <VersionedLink text="RHEL and Konvoy"  url="/byoos/usecases/vmware/konvoy/"/> to learn how to create a
custom image for RHEL and Konvoy.

</TabItem>

</Tabs>

## Terraform

You can retrieve details about the Kubernetes Konvoy by using the following Terraform code.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "kubernetes-konvoy"
  version = "1.27.6"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
