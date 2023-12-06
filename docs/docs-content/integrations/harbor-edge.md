---
sidebar_label: 'harbor-edge'
title: 'Harbor Edge Native Config'
description: 'Harbor Edge Native Config pack in Spectro Cloud'
hide_table_of_contents: true
type: "integration"
category: ['system-app', 'amd64']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.dev.spectrocloud.com/v1/heartbeat/blobs/sha256:19fec69ae172c3e54d5fb09c176517cf7bfeb1bc740bde65c200e14115510313?type=image/png'
tags: ['packs', 'harbor-edge-native-config', 'system-app']
---

Harbor is an open-source registry that secures artifacts with policies and role-based access control. You can install Harbor on your Edge clusters and use it to store all the images used by the cluster. After the initial download, the cluster can pull images from Harbor instead of an external registry, allowing your cluster to reboot containers or add new nodes without a connection to the external network.


## Versions Supported

<Tabs>
<TabItem value="1.0.0" label="1.0.0">

### Prerequisites

- An Edge device with at least 2 CPUs (4 CPUs recommended), 8 GB of RAM and at least 160 GB of storage volume for the cluster.

- A Container Storage Interface (CSI) pack is required in your cluster profile. 

### Parameters

:::tip
You can use a macro to avoid providing credentials in plain text. For more information about macros, refer to [Macros guide](../clusters/cluster-management/macros.md).
:::

| **Parameter** | **Description**  |
|---------------|------------------|
| `harbor-config.auth.password` | Specifies the password used with the default user name `admin` to authenticate with the Harbor image registry. You cannot change the username. If you don't provide password, a random password is generated and saved to a secret in the cluster named `registry-info`. This password is automatically configured to be used internally inside the cluster for image pulls, and you would only need it for accessing the Harbor registry from outside the cluster.|
| `harbor-config.auth.certs` | Specifies the certificate and private key used for authentication with Harbor. The common name or subject alternative name must include the host name `spectro.registry.local` and the Edge cluster's virtual IP address. If you don't provide a certificate or private key, Palette generates a certificate and a private key to use internally within the cluster. You can find the certificate in a secret named `harbor-tls` in the `harbor` namespace. |
| `harbor-config.service.serviceType` | Specifies the service type for the Harbor service. The default service type is NodePort. |
| `harbor-config.service.harbor` | Specifies the ports that harbor is exposed on. |
| `harbor-config.storage` | Specifies the size of the Harbor's persistent volume claim in GB. You can configure persistent volume claims for `registry`, `jobService`, `database`, `redis`, and `trivy`. |
| `harbor-config.service.metrics.enabled` | Specify whether to enable metrics on Harbor. For more information about the kinds of metrics that are exposed, refer to [Harbor metrics documentation](https://goharbor.io/docs/main/administration/metrics/). |

### Usage

#### Enable Harbor on an Edge Cluster to Protect Against Outage
You can use Harbor in an Edge cluster that is connected to external networks. Harbor stores all container images downloaded from the internet and future image pulls from the cluster will be from the local harbor registry. If your cluster experiences an internet outage, it can still reboot containers or add new nodes using images stored locally in Harbor. For more information, refer to [Deploy a Cluster with a Local Harbor Registry](../clusters/edge/networking/local-registry.md).

</TabItem>
</Tabs>

## Terraform

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "harbor-edge-native-config" {
  name    = "harbor-edge-native-config"
  version = "1.0.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```