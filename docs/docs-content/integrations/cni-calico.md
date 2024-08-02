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

:::warning

Limitations: AWS, VMWare supports IP-in-IP encapsulation type. Azure supports VXLAN encapsulation type.

:::

## Versions Supported

<Tabs queryString="parent">

<TabItem label="3.27.x" value="3.27.x">

### Create Bind Mounts for Edge Deployments

In Edge deployments, Calico requires a bind mount on the host machine. Without the bind mount, it's possible for the
Calico pods to be stuck in the init state. Use the following example to create a bind mount from `/var/lib/calico` on
the Edge host. When you build an installer ISO with the `bind_mounts` block, the folders specified in the block will be
mounted. For more information about building the installer ISO, refer to
[Build Installer ISO](../clusters/edge/edgeforge-workflow/build-content-bundle.md).

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

<TabItem label="3.26.x" value="3.26.x">

### Create Bind Mounts for Edge Deployments

In Edge deployments, Calico requires a bind mount on the host machine. Without the bind mount, it's possible for the
Calico pods to be stuck in the init state. Use the following example to create a bind mount from `/var/lib/calico` on
the Edge host. When you build an installer ISO with the `bind_mounts` block, the folders specified in the block will be
mounted. For more information about building the installer ISO, refer to
[Build Installer ISO](../clusters/edge/edgeforge-workflow/build-content-bundle.md).

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

### Create Bind Mounts for Edge Deployments

In Edge deployments, Calico requires a bind mount on the host machine. Without the bind mount, it's possible for the
Calico pods to be stuck in the init state. Use the following example to create a bind mount from `/var/lib/calico` on
the Edge host. When you build an installer ISO with the `bind_mounts` block, the folders specified in the block will be
mounted. For more information about building the installer ISO, refer to
[Build Installer ISO](../clusters/edge/edgeforge-workflow/build-content-bundle.md).

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

### Create Bind Mounts for Edge Deployments

In Edge deployments, Calico requires a bind mount on the host machine. Without the bind mount, it's possible for the
Calico pods to be stuck in the init state. Use the following example to create a bind mount from `/var/lib/calico` on
the Edge host. When you build an installer ISO with the `bind_mounts` block, the folders specified in the block will be
mounted. For more information about building the installer ISO, refer to
[Build Installer ISO](../clusters/edge/edgeforge-workflow/build-content-bundle.md).

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

### Create Bind Mounts for Edge Deployments

In Edge deployments, Calico requires a bind mount on the host machine. Without the bind mount, it's possible for the
Calico pods to be stuck in the init state. Use the following example to create a bind mount from `/var/lib/calico` on
the Edge host. When you build an installer ISO with the `bind_mounts` block, the folders specified in the block will be
mounted. For more information about building the installer ISO, refer to
[Build Installer ISO](../clusters/edge/edgeforge-workflow/build-content-bundle.md).

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

The following are some tips to troubleshoot issues with the Calico CNI.

- A daemon set is installed, the calico-node pod should be deployed on all the nodes in the cluster to provide
  networking.

- For any issues with networking, check the logs of the `calico-node` and `calico-kube-controller` pods on the cluster.

## Terraform

Use the following Terraform snippet to reference the Calico CNI pack in your Terraform template.

```hcl

data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "calico" {
  name    = "cni-calico"
  version = "3.27.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## References

- [Calico Documentation](https://docs.tigera.io/calico/latest/reference)
