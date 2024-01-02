---
sidebar_label: "Flannel"
title: "Flannel"
description: "Flannel CNI pack in Palette."
hide_table_of_contents: true
type: "integration"
category: ['network', 'amd64']
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/cni-flannel/blobs/sha256:24e56da9fc207788ba520cd00e31af042cfc9b00a3c21a5ad40a4dd592500589?type=image/png"
tags: ["packs", "flannel", "cni"]
---

Flannel is a network layer three fabric for Kubernetes. It's designed to work with Linux routing infrastructure and creates a virtual network that gives each computing host a subnet. Flannel uses either the Kubernetes API or etcd directly to store the network configuration, the allocated subnets, and any auxiliary data such as the host’s public IP address. To learn more about Flannel, refer to the [official documentation](https://github.com/flannel-io/flannel/tree/master?tab=readme-ov-file#how-it-works).


## Versions Supported

<!-- <Tabs queryString="versions">
</Tabs> -->



## Terraform

Use the following Terraform snippet to reference the Flannel CNI pack in your Terraform template:

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "flannel" {
  name    = "cni-flannel"
  version = "0.23.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## Reference

- [Flannel Documentation](https://github.com/flannel-io/flannel/tree/master?tab=readme-ov-file#how-it-works)

- [Configuration Options](https://github.com/flannel-io/flannel/blob/master/Documentation/configuration.md)