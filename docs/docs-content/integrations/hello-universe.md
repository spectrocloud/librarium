---
sidebar_label: "Hello Universe"
title: "Hello Universe"
description: "Learn about the Hello Universe pack and how you can use it within your Kubernetes clusters."
hide_table_of_contents: true
type: "integration"
category: ["app services", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://raw.githubusercontent.com/spectrocloud/pack-central/main/packs/hello-universe-1.1.1/logo.webp"
tags: ["packs", "hello-universe", "app-services"]
---

[Hello Universe](https://github.com/spectrocloud/hello-universe) is a demo web application utilized to help users learn
more about [Palette](../introduction/introduction.md) and its features. It functions as a standalone front-end
application and provides users with a local click counter and funny Spectro Cloud-themed images.

## Versions Supported

- 1.1.1

## Prerequisites

- A Palette account.

- A cluster profile where the Hello Universe pack can be integrated.

- A Palette cluster with port `:8080` available. If port 8080 is not available, you can set a different port in the
  **values.yaml** file.

- Ensure sufficient CPU resources within the cluster to allocate a minimum of 100 milliCPU and a maximum of 200 milliCPU
  per replica.

## Parameters

The following parameters are applied to the **hello-universe.yaml** manifest through the **values.yaml** file. Users do
not need to take any additional actions regarding these parameters.

| **Parameter**                     | **Description**                                                                | **Default Value**                           | **Required** |
| --------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------- | ------------ |
| `manifests.namespace`             | The namespace in which the application will be deployed.                       | `hello-universe`                            | No           |
| `manifests.images.hello-universe` | The application image that will be utilized to create the containers.          | `ghcr.io/spectrocloud/hello-universe:1.1.1` | No           |
| `manifests.port`                  | The cluster port number on which the service will listen for incoming traffic. | `8080`                                      | No           |
| `manifests.replicas`              | The number of Pods to be created.                                              | `1`                                         | No           |

## Usage

To utilize the Hello Universe pack, create either a
[full Palette cluster profile](../profiles/cluster-profiles/create-cluster-profiles/create-full-profile.md) or an
[add-on Palette cluster profile](../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/) and add the
pack to your profile.

If your infrastructure provider does not offer a native load balancer solution, such as VMware and MAAS, the
[MetalLB](./metallb.md) pack must be included to the cluster profile to help the LoadBalancer service specified in the
manifest obtain an IP address.

After defining the cluster profile, use it to deploy a new cluster or attach it as an add-on profile to an existing
cluster.

Once the cluster status displays **Running** and **Healthy**, access the Hello Universe application through the exposed
service URL along with the displayed port number.

## Terraform

You can reference the Hello Universe pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "community_registry" {
  name = "Palette Registry"
}
data "spectrocloud_pack" "hellouniverse" {
  name         = "hello-universe"
  version      = "1.1.1"
  registry_uid = data.spectrocloud_registry.community_registry.id
}
```

## References

- [Hello Universe GitHub Repository](https://github.com/spectrocloud/hello-universe)

- [Deploy a Custom Pack Tutorial](../registries-and-packs/deploy-pack.md)

- [Registries and Packs](../registries-and-packs/registries-and-packs.md)
