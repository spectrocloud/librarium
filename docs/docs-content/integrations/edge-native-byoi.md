---
sidebar_label: "Edge Bring Your Own OS (BYOOS)"
title: "Edge Bring your own OS (BYOOS)"
description: "Bring Your Own OS (BYOOS) pack in Palette Edge."
hide_table_of_contents: true
type: "integration"
category: ["operating system", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/spectro-proxy/blobs/sha256:b6081bca439eeb01a8d43b3cb6895df4c088f80af978856ddc0da568e5c09365?type=image.webp"
tags: ["packs", "byoos", "operating system", "edge"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="1.0.x" value="1.0.x">

BYOOS enables you to use a custom OS for your Edge host. The custom OS must include all the Edge artifacts and provider
images required by the Edge Installer. Refer to the
[Build Edge Artifacts](../clusters/edge/edgeforge-workflow/build-artifacts.md) guide for steps on how to create a custom
OS that includes all the required components for the Edge Installer.

Next, select the BYOOS pack and fill out the required parameters during the cluster profile creation process. The
`system.uri` parameter specifies the location of the BYOOS image.

</TabItem>
</Tabs>

## Terraform

You can retrieve details about the BYOOS Edge OS agent pack using the following Terraform code.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "byoos" {
  name         = "edge-native-byoi"
  version      = "1.0.0"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
