---
sidebar_label: "Calico"
title: "Calico"
description: "Reference documentation for the Calico pack in Palette"
hide_table_of_contents: true
type: "integration"
category: ["network", "amd64", "fips"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/cni-calico/blobs/sha256:9a08103ccd797857a81b6ce55fa4f84a48bcb2bddfc7a4ff27878819c87e1e30?type=image.webp"
tags: ["packs", "calico", "network"]
---

Palette Network Pack(s) helps provision resources for setting up Cluster networking in Kubernetes. Design goals for the
Kubernetes network model can be found
[here](https://kubernetes.io/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model).

[Project Calico](http://docs.projectcalico.org/) is an open source container networking provider and network policy
engine.

Calico provides highly scalable networking and network policy solution for connecting Kubernetes pods based on the same
IP networking principles as the internet, for both Linux (open source) and Windows (proprietary - available from
[Tigera](https://www.tigera.io/essentials/)). Calico can be deployed without encapsulation or overlays to provide
high-performance, high-scale data center networking. Calico also provides a fine-grained, intent-based network security
policy for Kubernetes pods via its distributed firewall.

Calico manifest used for networking does the following:

- Installs the `calico/node` container on each host using a DaemonSet.
- Installs the Calico CNI binaries and network config on each host using a DaemonSet.
- Runs `calico/kube-controllers` as a deployment.
- The `calico-etcd-secrets` secret, which optionally allows for providing etcd TLS assets.
- The `calico-config` ConfigMap, which contains parameters for configuring the install.

:::warning

Limitations: AWS, VMWare supports IP-in-IP encapsulation type. Azure supports VXLAN encapsulation type.

:::

## Versions Supported

<Tabs queryString="versions">

<TabItem label="3.26.x" value="3.26.x">

### Prerequisites

- You have created a bind mount for the `/var/lib/calico` folder on the Edge host. For more information, refer to
  [Create Bind Mounts](#create-bind-mounts-for-edge-deployments).

### Parameters

| Name                     | Supported Values                                | Default value                               | Description                                                                                                       |
| ------------------------ | ----------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| calico.encapsulationType | `CALICO_IPV4POOL_IPIP`, `CALICO_IPV4POOL_VXLAN` | `CALICO_IPV4POOL_IPIP` - AWS, VMware clouds | The encapsulation type to be used for networking (depends on the cloud)                                           |
|                          |                                                 | `CALICO_IPV4POOL_VXLAN` - Azure cloud       |                                                                                                                   |
| calico.encapsulationMode | `Always, CrossSubnet, Never`                    | Always                                      | The mode to use the IPv4 POOL created at start up                                                                 |
| calico.calicoNetworkCIDR | CIDR range                                      | `192.168.0.0/16`                            | CIDR range to be assigned for Pods. This range should match the `podCIDR` range specified in the Kubernetes layer |

### Usage

#### Create Bind Mounts for Edge Deployments

In Edge deployments, Calico requires a bind mount on the host machine. Without the bind mount, it's possible for the
Calico pods to be stuck in the init state. Use the following example to create a bind mount from `/var/lib/calico` on
the Edge host. When you build an installer ISO with the `bind_mounts` block, the folders specified in the block will be
mounted. For more information about building the installer ISO, refer to
[Build Installer ISO](../clusters/edge/edgeforge-workflow/palette-canvos/build-installer-iso.md).

```yaml
#cloud-config
stylus:
  site:
    debug: true
    insecureSkipVerify: false
    paletteEndpoint: api.console.spectrocloud.com
    name: edge-appliance-1
    caCerts:
      - |
        -----BEGIN CERTIFICATE-----

        -----END CERTIFICATE-----

install:
  bind_mounts:
    - /var/lib/calico
```

</TabItem>
<TabItem label="3.25.x" value="3.25.x">

### Prerequisites

- You have created a bind mount for the `/var/lib/calico` folder on the Edge host. For more information, refer to
  [Create Bind Mounts](#create-bind-mounts-for-edge-deployments).

### Parameters

| Name                     | Supported Values                                | Default value                               | Description                                                                                                       |
| ------------------------ | ----------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| calico.encapsulationType | `CALICO_IPV4POOL_IPIP`, `CALICO_IPV4POOL_VXLAN` | `CALICO_IPV4POOL_IPIP` - AWS, VMware clouds | The encapsulation type to be used for networking (depends on the cloud)                                           |
|                          |                                                 | `CALICO_IPV4POOL_VXLAN` - Azure cloud       |                                                                                                                   |
| calico.encapsulationMode | `Always, CrossSubnet, Never`                    | Always                                      | The mode to use the IPv4 POOL created at start up                                                                 |
| calico.calicoNetworkCIDR | CIDR range                                      | `192.168.0.0/16`                            | CIDR range to be assigned for Pods. This range should match the `podCIDR` range specified in the Kubernetes layer |

### Usage

#### Create Bind Mounts for Edge Deployments

In Edge deployments, Calico requires a bind mount on the host machine. Without the bind mount, it's possible for the
Calico pods to be stuck in the init state. Use the following example to create a bind mount from `/var/lib/calico` on
the Edge host. When you build an installer ISO with the `bind_mounts` block, the folders specified in the block will be
mounted. For more information about building the installer ISO, refer to
[Build Installer ISO](../clusters/edge/edgeforge-workflow/palette-canvos/build-installer-iso.md).

```yaml
#cloud-config
stylus:
  site:
    debug: true
    insecureSkipVerify: false
    paletteEndpoint: api.console.spectrocloud.com
    name: edge-appliance-1
    caCerts:
      - |
        -----BEGIN CERTIFICATE-----

        -----END CERTIFICATE-----

install:
  bind_mounts:
    - /var/lib/calico
```

</TabItem>

<TabItem label="3.24.x" value="3.24.x">

### Prerequisites

- You have created a bind mount for the `/var/lib/calico` folder on the Edge host. For more information, refer to
  [Create Bind Mounts](#create-bind-mounts-for-edge-deployments).

### Parameters

| Name                     | Supported Values                                | Default value                               | Description                                                                                                       |
| ------------------------ | ----------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| calico.encapsulationType | `CALICO_IPV4POOL_IPIP`, `CALICO_IPV4POOL_VXLAN` | `CALICO_IPV4POOL_IPIP` - AWS, VMware clouds | The encapsulation type to be used for networking (depends on the cloud)                                           |
|                          |                                                 | `CALICO_IPV4POOL_VXLAN` - Azure cloud       |                                                                                                                   |
| calico.encapsulationMode | `Always, CrossSubnet, Never`                    | Always                                      | The mode to use the IPv4 POOL created at start up                                                                 |
| calico.calicoNetworkCIDR | CIDR range                                      | `192.168.0.0/16`                            | CIDR range to be assigned for Pods. This range should match the `podCIDR` range specified in the Kubernetes layer |

### Usage

#### Create Bind Mounts for Edge Deployments

In Edge deployments, Calico requires a bind mount on the host machine. Without the bind mount, it's possible for the
Calico pods to be stuck in the init state. Use the following example to create a bind mount from `/var/lib/calico` on
the Edge host. When you build an installer ISO with the `bind_mounts` block, the folders specified in the block will be
mounted. For more information about building the installer ISO, refer to
[Build Installer ISO](../clusters/edge/edgeforge-workflow/palette-canvos/build-installer-iso.md).

```yaml
#cloud-config
stylus:
  site:
    debug: true
    insecureSkipVerify: false
    paletteEndpoint: api.console.spectrocloud.com
    name: edge-appliance-1
    caCerts:
      - |
        -----BEGIN CERTIFICATE-----

        -----END CERTIFICATE-----

install:
  bind_mounts:
    - /var/lib/calico
```

</TabItem>

<TabItem label="3.23.x" value="3.23.x">

### Prerequisites

- You have created a bind mount for the `/var/lib/calico` folder on the Edge host. For more information, refer to
  [Create Bind Mounts](#create-bind-mounts-for-edge-deployments).

### Parameters

| Name                     | Supported Values                                | Default value                               | Description                                                                                                       |
| ------------------------ | ----------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| calico.encapsulationType | `CALICO_IPV4POOL_IPIP`, `CALICO_IPV4POOL_VXLAN` | `CALICO_IPV4POOL_IPIP` - AWS, VMware clouds | The encapsulation type to be used for networking (depends on the cloud)                                           |
|                          |                                                 | `CALICO_IPV4POOL_VXLAN` - Azure cloud       |                                                                                                                   |
| calico.encapsulationMode | `Always, CrossSubnet, Never`                    | Always                                      | The mode to use the IPv4 POOL created at start up                                                                 |
| calico.calicoNetworkCIDR | CIDR range                                      | `192.168.0.0/16`                            | CIDR range to be assigned for Pods. This range should match the `podCIDR` range specified in the Kubernetes layer |

### Usage

#### Create Bind Mounts for Edge Deployments

In Edge deployments, Calico requires a bind mount on the host machine. Without the bind mount, it's possible for the
Calico pods to be stuck in the init state. Use the following example to create a bind mount from `/var/lib/calico` on
the Edge host. When you build an installer ISO with the `bind_mounts` block, the folders specified in the block will be
mounted. For more information about building the installer ISO, refer to
[Build Installer ISO](../clusters/edge/edgeforge-workflow/palette-canvos/build-installer-iso.md).

```yaml {14-16}
#cloud-config
stylus:
  site:
    debug: true
    insecureSkipVerify: false
    paletteEndpoint: api.console.spectrocloud.com
    name: edge-appliance-1
    caCerts:
      - |
        -----BEGIN CERTIFICATE-----

        -----END CERTIFICATE-----

install:
  bind_mounts:
    - /var/lib/calico
```

</TabItem>

<TabItem label="Deprecated" value="deprecated">

All versions below version 3.23.x are deprecated.

</TabItem>

</Tabs>

## Troubleshooting

- A daemon set is installed and so a calico-node pod should run on all the nodes in the cluster to provide networking.
- For any issues with networking, check calico-node and calico-kube-controller pods on the cluster.

## Terraform

Use the following Terraform snippet to reference the Calico CNI pack in your Terraform template.

```hcl

data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "calico" {
  name    = "cni-calico"
  version = "3.26.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## References

- [Calico Documentation](https://docs.tigera.io/calico/latest/reference)
