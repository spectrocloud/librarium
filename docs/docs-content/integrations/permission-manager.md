---
sidebar_label: "Permission Manager"
title: "Permission Manager"
description: "Permission Manager Authentication pack in Spectro Cloud"
type: "integration"
hide_table_of_contents: true
category: ["authentication", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/permission-manager/blobs/sha256:15d08b02d78823c12616b72d1b5adb0520940016b89bae1f758e6f1a105597ff?type=image.webp"
tags: ["packs", "permission-manager", "security"]
---

## Versions Supported

<Tabs queryString="parent">
<TabItem label="1.0.x" value="1.0.x">

## Customize Permission Templates

Create a ClusterRole starting with `template-namespaced-resources___` or `template-cluster-resources___` and apply it to
the cluster. Permission manager will honor any custom resources with this naming convention and will populate on the
user interface.

## Configure Ingress

Follow below steps to configure Ingress on Permission Manager

1. Change serviceType from "LoadBalancer" to "ClusterIP" (line #10)
2. Ingress (line #13)
   - Enable Ingress; Change enabled from false to "true"
   - Set Ingress rules like annotations, path, hosts, etc.

With these config changes, you can access Permission manager service on the Ingress Controller LoadBalancer hostname/IP.

</TabItem>
</Tabs>

## Terraform

You can reference the Permission Manager pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}
data "spectrocloud_pack" "permission-manager" {
  name    = "permission-manager"
  version = "1.0.0"
  type = "manifest"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
