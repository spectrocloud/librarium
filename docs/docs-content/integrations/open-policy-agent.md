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

## Terraform

You can reference the Open Policy Agent pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}
data "spectrocloud_pack" "open-policy-agent" {
  name    = "open-policy-agent"
  version = "3.15.1"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
