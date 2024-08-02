---
sidebar_label: "RKE2"
title: "RKE2"
description: "RKE2 pack in Palette"
hide_table_of_contents: true
type: "integration"
category: ["kubernetes", "amd64", "fips"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/kubernetes-rke2/blobs/sha256:47cde61005d9996f1571c132ba9f753982134a7a0d8e445e27001ab8519e6051?type=image.webp"
---

### Support Lifecycle

<!-- prettier-ignore -->
We support other Kubernetes distributions such as K3s, Microk8s, and RKE2 until their official EOL. The EOL is set by
the respective owner. Once we stop supporting the minor version, we initiate the deprecation process. Refer to the

<VersionedLink text="Kubernetes Support Lifecycle" url="//integrations/kubernetes-support" /> guide to learn more.

:::warning

<!-- prettier-ignore -->
Once you upgrade your cluster to a new Kubernetes version, you will not be able to downgrade. We recommend that, before
upgrading, you review the information provided in the <VersionedLink text="Kubernetes Upgrades" url="/integrations/kubernetes-support/#kubernetes-upgrades" />
section.

Review the <VersionedLink text="Maintenance Policy" url="/integrations/maintenance-policy/" /> to learn about pack
update and deprecation schedules.

:::

<PartialsComponent category="packs" name="rke2" />

## Terraform

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "k8s" {
  name    = "edge-rke2"
  version = "1.29.5"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
