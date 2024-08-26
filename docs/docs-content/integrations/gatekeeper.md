---
sidebar_label: "OpenPolicyAgent"
title: "Open Policy Agent"
description: "OpenPolicyAgent security pack in Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["security", "amd64", "arm64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl:
  'https://registry.dev.spectrocloud.com/v1/open-policy-agent/blobs/sha256:fcbad202dc9ca5e7a756562d8f9fc180ee77474034447dabc302d8a5a2bbe148?type=image.webp"
  alt="OpenPolicyAgent logo'
tags: ["packs", "open-policy-agent", "security"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="3.9.x" value="3.9.x">

</TabItem>

<TabItem label="3.7.x" value="3.7.x">

**3.7.0**

</TabItem>

<TabItem label="3.6.x" value="3.6.x">

</TabItem>

<TabItem label="3.5.x" value="3.5.x">

</TabItem>

</Tabs>

## Terraform

You can retrieve details about the Gatekeeper pack by using the following Terraform code.

```hcl
data "spectrocloud_registry" "public_addon_registry" {
  name = "Spectro Addon Repo"
}

data "spectrocloud_pack_simple" "gatekeeper" {
  name    = "gatekeeper"
  version = "3.8.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_addon_registry.id
}
```
