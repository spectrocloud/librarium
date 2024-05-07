---
sidebar_label: "Hello Universe"
title: "Hello Universe"
description: "Learn about the Hello Universe pack and how you can use it within your Kubernetes clusters."
hide_table_of_contents: true
type: "integration"
category: ["app services", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://raw.githubusercontent.com/spectrocloud/pack-central/main/packs/hello-universe-1.1.1/logo.png"
tags: ["packs", "hello-universe", "app-services"]
---

[Hello Universe](https://github.com/spectrocloud/hello-universe) is a demo web application utilized to help users learn more about [Palette](https://docs.spectrocloud.com/introduction) and its features.

You can deploy it using two preset configurations: 
- A standalone front-end application. It provides a click counter that is saved locally and displays Spectro Cloud themed images.
- A three-tier application with a front-end application, API server and PostgreSQL database into a Kubernetes cluster. It provides a click counter that is saved in the deployed database and displays Spectro Cloud themed images. You can read more about this configuration on the Hello Universe [README](https://github.com/spectrocloud/hello-universe?tab=readme-ov-file#reverse-proxy-with-kubernetes).

:::info

The three-tier application mode is only supported by version 1.1.2.

:::

## Versions Supported

<Tabs queryString="versions">

<TabItem label="1.1.1" value="1.1.1">

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
[add-on Palette cluster profile](../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md)
and add the pack to your profile.

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

</TabItem>

<TabItem label="1.1.2" value="1.1.2">


## Prerequisites

- A Palette account.

- A cluster profile where the Hello Universe pack can be integrated.

- A Palette cluster with port `:8080` available. If port 8080 is not available, you can set a different port in the **values.yaml** file.

- If you are using the **Enable Hello Universe API** preset, you will need the `:3000` port available on your cluster too. Check out the [Usage](#usage) section for further details.

- Ensure sufficient CPU resources within the cluster to allocate a minimum of 500 milliCPU and a maximum of 500 milliCPU per replica.

## Parameters

The following parameters are applied to the **hello-universe.yaml** manifest through the **values.yaml** file. Users do not need to take any additional actions regarding these parameters.

| **Parameter**                     | **Description**                                                                | **Default Value**                           | **Required** |
| --------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------- | ------------ |
| `manifests.namespace`             | The namespace in which the application will be deployed.                       | `hello-universe`                            | Yes           |
| `manifests.images.hellouniverse` | The [`hello-universe`](https://github.com/spectrocloud/hello-universe) application image that will be utilized to create the containers.          | `ghcr.io/spectrocloud/hello-universe:1.1.2`/ `ghcr.io/spectrocloud/hello-universe:1.1.2-proxy` | Yes           |
| `manifests.images.hellouniverseapi` | The [`hello-universe-api`](https://github.com/spectrocloud/hello-universe-api) application image that will be utilized to create the containers.          | `ghcr.io/spectrocloud/hello-universe-api:1.0.12` | No           |
| `manifests.images.hellouniversedb` | The [`hello-universe-db`](https://github.com/spectrocloud/hello-universe-db) application image that will be utilized to create the containers.          | `ghcr.io/spectrocloud/hello-universe-db:1.0.2` | No           |
| `manifests.apiEnabled`                  | The flag that indicates whether to deploy the UI application as standalone or together with the API server. | `false`                                      | Yes           |
| `manifests.port`                  | The cluster port number on which the service will listen for incoming traffic. | `8080`                                      | Yes           |
| `manifests.replicas`              | The number of Pods to be created.                                              | `1`                                         | Yes           |
| `manifests.dbPassword`           | The base64 encoded database password to connect to the API database.           |            `REPLACE_ME`                                 | No          |
| `manifests.authToken`            | The base64 encoded auth token for the API connection.                          |      `REPLACE_ME`                                       | No          |                                        | No           |

## Usage
The Hello Universe pack has two presets that you can select:
- **Disable Hello Universe API** configures Hello Universe as a standalone frontend application. This is the default configuration of the pack. 
- **Enable Hello Universe API** configures Hello Universe as a three-tier application with a frontend, API server, and Postgres database.

To utilize the Hello Universe pack, create either a [full Palette cluster profile](https://docs.spectrocloud.com/profiles/cluster-profiles/create-cluster-profiles/create-full-profile) or an [add-on Palette cluster profile](https://docs.spectrocloud.com/profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/) and add the pack to your profile. You can select the preset you wish to deploy on the cluster profile creation page.

If your infrastructure provider does not offer a native load balancer solution, such as VMware and MAAS, the [MetalLB](https://docs.spectrocloud.com/integrations/metallb) pack must be included to the cluster profile to help the LoadBalancer service specified in the manifest obtain an IP address.

After defining the cluster profile, use it to deploy a new cluster or attach it as an add-on profile to an existing cluster.

Once the cluster status displays **Running** and **Healthy**, access the Hello Universe application through the exposed service URL along with the displayed port number.

## Terraform

You can reference the Hello Universe pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "community_registry" {
  name = "Palette Registry"
}
data "spectrocloud_pack" "hellouniverse" {
  name         = "hello-universe"
  version      = "1.1.2"
  registry_uid = data.spectrocloud_registry.community_registry.id
}
```

</TabItem>

</Tabs>

## References

- [Hello Universe GitHub Repository](https://github.com/spectrocloud/hello-universe)

- [Deploy a Custom Pack Tutorial](../registries-and-packs/deploy-pack.md)

- [Registries and Packs](../registries-and-packs/registries-and-packs.md)
