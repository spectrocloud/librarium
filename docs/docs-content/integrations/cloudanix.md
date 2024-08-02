---
sidebar_label: "Cloudanix"
title: "Cloudanix"
description:
  "The Cloudanix security pack provides a dashboard that displays threats and unusual behavior in Kubernetes containers
  in Palette"
hide_table_of_contents: true
type: "integration"
category: ["security", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://cloudanix-assets.s3.amazonaws.com/static/cloudanix-logo-p.webp"
tags: ["packs", "cloudanix", "security"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="0.0.x" value="0.0.x">

### Kubernetes 1.25 and higher

When you use the Cloudanix 1.0.x pack with Kubernetes 1.25 and higher, you need to add the **Spectro Namespace Labeler**
add-on pack to your cluster profile. After you create the cluster profile, you then apply it to your cluster.

Use the following information to find the **Spectro Namespace Labeler** add-on pack.

- **Pack Type**: System App
- **Registry**: Public Repo
- **Pack Name**: Spectro Namespace Labeler
- **Pack Version**: 1.0.x or higher

Below is the YAML file for the **Spectro Namespace Labeler** add-on pack. No action is required.

<br />

```yaml
pack:
namespace: cluster-{{ .spectro.system.cluster.uid }}

charts:
  spectro-namespace-labeler:
    namespace: cluster-{{ .spectro.system.cluster.uid }}

    labels:
      cloudanix: pod-security.kubernetes.io/enforce=privileged,pod-security.kubernetes.io/enforce-version=v1.26
```

As a final step, apply the cluster profile to your cluster.

</TabItem>
</Tabs>

## Terraform

```hcl
data "spectrocloud_registry" "public_add_on_repo" {
  name = "Spectro Addon Repo"
}

data "spectrocloud_pack_simple" "cloudanix" {
  name         = "cloudanix"
  version      = "0.0.2"
  type         = "helm"
  registry_uid = data.spectrocloud_registry.public_add_on_repo.id
}
```
