---
sidebar_label: "Flannel"
title: "Flannel"
description: "Flannel CNI pack in Palette."
hide_table_of_contents: true
type: "integration"
category: ["network", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/cni-flannel/blobs/sha256:24e56da9fc207788ba520cd00e31af042cfc9b00a3c21a5ad40a4dd592500589?type=image/png"
tags: ["packs", "flannel", "cni"]
---

Flannel is a network layer, layer three, fabric for Kubernetes. It is designed to work with Linux routing infrastructure
and creates a virtual network that gives each computing host a subnet. Flannel uses either the Kubernetes API or etcd
directly to store the network configuration, the allocated subnets, and any auxiliary data such as the host’s public IP
address. To learn more about Flannel, refer to the
[official documentation](https://github.com/flannel-io/flannel/tree/master?tab=readme-ov-file#how-it-works).

The Flannel pack includes the Container Network Interface (CNI) plugins required use Flannel in your cluster.

## Versions Supported

<Tabs queryString="versions">
<TabItem value="0.23.x" label="0.23.x">

### Prerequisites

- Kubernetes version 1.22 or later.

- Existing cluster profiles that use Flannel version 0.21.x or earlier cannot upgrade to Flannel version 0.23.x. You
  must create a new cluster profile to use Flannel version 0.23.x. All Flannel versions 0.21.x and earlier are manifest
  based. The newer versions are pack based with additional logic that builds on top of the Helm chart.

## Parameters

The following table lists commonly used parameters for Flannel version 0.23.x. Refer to the pack YAML file for the
complete list of parameters.

| Parameter                             | Description                                                                                                                                                                                                                                           | Default                                |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `pack.namespace`                      | The namespace to install Flannel. If the namespace does not exist, it will be created.                                                                                                                                                                | `kube-system`                          |
| `charts.flannel.podCidr`              | The IPv4 CIDR range to assign to the pod network. This should match the Kubernetes `PodCIDR`.                                                                                                                                                         | `192.168.0.0/16`                       |
| `charts.flannel.podCidrv6`            | The IPv6 CIDR range to assign to the service network.                                                                                                                                                                                                 | `""`                                   |
| `charts.flannel.backend`              | The backend to use for Flannel. Refer to the official [backend documentation](https://github.com/flannel-io/flannel/blob/v0.23.0/Documentation/backends.md) to learn more about supported backends.                                                   | `vxlan`                                |
| `charts.flannel.image_cni.repository` | The Flannel CNI image repository.                                                                                                                                                                                                                     | `docker.io/flannel/flannel-cni-plugin` |
| `charts.flannel.image_cni.tag`        | The Flannel CNI image tag.                                                                                                                                                                                                                            | `v1.1.2`                               |
| `charts.flannel.args`                 | Additional arguments to pass to the Flannel daemon. Refer to the [key command line options documentation](https://github.com/flannel-io/flannel/blob/v0.23.0/Documentation/configuration.md#key-command-line-options) for a list of supported values. | `["--ip-masq","--kube-subnet-mgr"]`    |

## Usage

### Change the Backend

If you need to change the backend type or update the backend port due to firewall or other restrictions, you can do so
by updating the pack YAML. The parameters `charts.flannel.backend` and `charts.flannel.backendPort` can be used to
change the default behavior. Refer to the official
[backend documentation](https://github.com/flannel-io/flannel/blob/v0.23.0/Documentation/backends.md) to learn more
about supported backends.

```yaml
charts:
  flannel:
    backend: "vxlan"
    backendPort: 8472
```

### Change MTU

By default, Flannel will use the Maximum Transmission Unit (MTU) of the host interface. If you need to change the MTU,
you can do so by updating the pack YAML. The parameter `charts.flannel.mtu` can be used to change the MTU value.

```yaml
charts:
  flannel:
    mtu: 1500
```

### VXLAN Configuration

Additional parameters can be used to configure the VXLAN backend. The VXLAN configuration is commented out by default in
the pack YAML. Uncomment the parameters you want to use and update the values as needed. Refer to the
[VXLAN backend documentation](https://github.com/flannel-io/flannel/blob/v0.23.0/Documentation/backends.md) for
additional guidance.

```yaml hideClipboard
charts:
  flannel:
  VXLAN Configs:
    #VXLAN Identifier to be used. On Linux default is 1.
    vni: 1
    #Enable VXLAN Group Based Policy (Default false)
    GBP: false
    #Enable direct routes (default is false)
    directRouting: false
    #MAC prefix to be used on Windows. (Defaults is 0E-2A)
    macPrefix: "0E-2A"
    ? Wireguard Configs

    #UDP listen port used with IPv6
    backendPortv6: 51821
    #Pre shared key to use
    psk: 0
    #IP version to use on Wireguard
    tunnelMode: "separate"
    #Persistent keep interval to use
    keepaliveInterval: 0
```

</TabItem>
<TabItem value="0.22.x" label="0.22.x">

### Prerequisites

- Kubernetes version 1.22 or later.

- Existing cluster profiles that use Flannel version 0.21.x or earlier cannot upgrade to Flannel version 0.22.x. You
  must create a new cluster profile to use Flannel version 0.22.x. All Flannel versions 0.21.x and earlier are manifest
  based. The newer versions are pack based with additional logic that builds on top of the Helm chart.

## Parameters

The following table lists commonly used parameters for Flannel version 0.22.x. Refer to the pack YAML file for the
complete list of parameters.

| Parameter                             | Description                                                                                                                                                                                                                                           | Default                                |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `pack.namespace`                      | The namespace to install Flannel. If the namespace does not exist, it will be created.                                                                                                                                                                | `kube-system`                          |
| `charts.flannel.podCidr`              | The IPv4 CIDR range to assign to the pod network. This should match the Kubernetes `PodCIDR`.                                                                                                                                                         | `192.168.0.0/16`                       |
| `charts.flannel.podCidrv6`            | The IPv6 CIDR range to assign to the service network.                                                                                                                                                                                                 | `""`                                   |
| `charts.flannel.backend`              | The backend to use for Flannel. Refer to the official [backend documentation](https://github.com/flannel-io/flannel/blob/v0.22.3/Documentation/backends.md) to learn more about supported backends.                                                   | `vxlan`                                |
| `charts.flannel.image_cni.repository` | The Flannel CNI image repository.                                                                                                                                                                                                                     | `docker.io/flannel/flannel-cni-plugin` |
| `charts.flannel.image_cni.tag`        | The Flannel CNI image tag.                                                                                                                                                                                                                            | `v1.1.2`                               |
| `charts.flannel.args`                 | Additional arguments to pass to the Flannel daemon. Refer to the [key command line options documentation](https://github.com/flannel-io/flannel/blob/v0.22.3/Documentation/configuration.md#key-command-line-options) for a list of supported values. | `["--ip-masq","--kube-subnet-mgr"]`    |

## Usage

### Change the Backend

If you need to change the backend type or update the backend port due to firewall or other restrictions, you can do so
by updating the pack YAML. The parameters `charts.flannel.backend` and `charts.flannel.backendPort` can be used to
change the default behavior. Refer to the official
[backend documentation](https://github.com/flannel-io/flannel/blob/v0.22.3/Documentation/backends.md) to learn more
about supported backends.

```yaml
charts:
  flannel:
    backend: "vxlan"
    backendPort: 8472
```

### Change MTU

By default, Flannel will use the Maximum Transmission Unit (MTU) of the host interface. If you need to change the MTU,
you can do so by updating the pack YAML. The parameter `charts.flannel.mtu` can be used to change the MTU value.

```yaml
charts:
  flannel:
    mtu: 1500
```

### VXLAN Configuration

Additional parameters can be used to configure the VXLAN backend. The VXLAN configuration is commented out by default in
the pack YAML. Uncomment the parameters you want to use and update the values as needed. Refer to the
[VXLAN backend documentation](https://github.com/flannel-io/flannel/blob/v0.22.3/Documentation/backends.md) for
additional guidance.

```yaml hideClipboard
charts:
  flannel:
  VXLAN Configs:
    #VXLAN Identifier to be used. On Linux default is 1.
    vni: 1
    #Enable VXLAN Group Based Policy (Default false)
    GBP: false
    #Enable direct routes (default is false)
    directRouting: false
    #MAC prefix to be used on Windows. (Defaults is 0E-2A)
    macPrefix: "0E-2A"
    ? Wireguard Configs

    #UDP listen port used with IPv6
    backendPortv6: 51821
    #Pre shared key to use
    psk: 0
    #IP version to use on Wireguard
    tunnelMode: "separate"
    #Persistent keep interval to use
    keepaliveInterval: 0
```

</TabItem>
<TabItem value="0.21.x" label="0.21.x">

### Prerequisites

- Kubernetes version 1.22 or later.

## Parameters

The following table lists commonly used parameters for Flannel version 0.21.x. Refer to the pack YAML file for the
complete list of parameters.

| Parameter                                | Description                                                                                                                                                                                                                                           | Default                                                               |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `manifests.flannel.flannelNetwork`       | The IPv4 CIDR range to assign to the pod network. This should match the Kubernetes `PodCIDR`.                                                                                                                                                         | `192.168.0.0/16`                                                      |
| `manifests.flannel.cniPluginsImage`      | The image used for installing the core-cni-plugins through the _initContainer_.                                                                                                                                                                       | `gcr.io/spectro-images-public/release/cni-plugins/cni-plugins:v1.2.0` |
| `manifests.flannel.image_cni.repository` | The Flannel CNI image repository.                                                                                                                                                                                                                     | `docker.io/flannel/flannel-cni-plugin`                                |
| `manifests.flannel.image_cni.tag`        | The Flannel CNI image tag.                                                                                                                                                                                                                            | `v1.1.2`                                                              |
| `manifests.flannel.args`                 | Additional arguments to pass to the Flannel daemon. Refer to the [key command line options documentation](https://github.com/flannel-io/flannel/blob/v0.21.5/Documentation/configuration.md#key-command-line-options) for a list of supported values. | `["--ip-masq","--kube-subnet-mgr"]`                                   |

## Usage

### Change the Backend

If you need to change the backend type or update the backend port due to firewall or other restrictions, you can do so
by updating the pack YAML. The parameters `charts.flannel.backend` and `charts.flannel.backendPort` can be used to
change the default behavior. Refer to the official
[backend documentation](https://github.com/flannel-io/flannel/blob/v0.21.5/Documentation/backends.md) to learn more
about supported backends.

```yaml
manifests:
  flannel:
    backend: "vxlan"
    backendPort: 8472
```

### Change MTU

By default, Flannel will use the Maximum Transmission Unit (MTU) of the host interface. If you need to change the MTU,
you can do so by updating the pack YAML. The parameter `charts.flannel.mtu` can be used to change the MTU value.

```yaml
manifests:
  flannel:
    mtu: 1500
```

</TabItem>
<TabItem value="0.20.x" label="0.20.x">

### Prerequisites

- Kubernetes version 1.22 or later.

## Parameters

The following table lists commonly used parameters for Flannel version 0.20.x. Refer to the pack YAML file for the
complete list of parameters.

| Parameter                                | Description                                                                                   | Default                                                               |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `manifests.flannel.flannelNetwork`       | The IPv4 CIDR range to assign to the pod network. This should match the Kubernetes `PodCIDR`. | `192.168.0.0/16`                                                      |
| `manifests.flannel.cniPluginsImage`      | The image used for installing the core-cni-plugins through the _initContainer_.               | `gcr.io/spectro-images-public/release/cni-plugins/cni-plugins:v1.2.0` |
| `manifests.flannel.image_cni.repository` | The Flannel CNI image repository.                                                             | `docker.io/flannel/flannel-cni-plugin`                                |

## Usage

### Change the Backend

If you need to change the backend type or update the backend port due to firewall or other restrictions, you can do so
by updating the pack YAML. The parameters `charts.flannel.backend` and `charts.flannel.backendPort` can be used to
change the default behavior. Refer to the official
[backend documentation](https://github.com/flannel-io/flannel/blob/v0.21.5/Documentation/backends.md) to learn more
about supported backends.

```yaml
manifests:
  flannel:
    backend: "vxlan"
    backendPort: 8472
```

### Change MTU

By default, Flannel will use the Maximum Transmission Unit (MTU) of the host interface. If you need to change the MTU,
you can do so by updating the pack YAML. The parameter `charts.flannel.mtu` can be used to change the MTU value.

```yaml
manifests:
  flannel:
    mtu: 1500
```

</TabItem>
<TabItem label="Deprecated" value="deprecated">

:::warning

All versions less than v0.20.x are considered deprecated. Upgrade to a newer version to take advantage of new features.

:::

</TabItem>
</Tabs>

## Terraform

Use the following Terraform snippet to reference the Flannel CNI pack in your Terraform template.

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
