---
sidebar_label: "Antrea CNI"
title: "Antrea CNI"
description: "Antrea CNI network pack for Palette Kubernetes Clusters"
type: "integration"
category: ["network", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/antrea/blobs/sha256:3c5704caf6652c63374282cbf413f8e73a77c4efbc49f375c19c73f8e2ec4148?type=image/png"
tags: ["packs", "antrea", "cni", "network"]
---

Palette supports Antrea controller network interface (CNI) for VMware Kubernetes clusters. Antrea CNI enables each pod
to have exclusive IP addresses from the subnet with direct accessibility.

Antrea leverages [Open vSwitch](https://www.openvswitch.org/) to implement pod networking and security features. Open
vSwitch enables Antrea to implement Kubernetes network policies efficiently.

## Supported Versions

**1.9.x**

## Prerequisites

- Enable the integrated NodeIPAM controller in the Antrea manifest: `NodeIPAM:enable`.

  <br />

- When deploying a cluster using Palette, use the `podCIDR` parameter in the Pack section of the Kubernetes manifest.
  The classless inter-domain routing (CIDR) IP specified in the Kubernetes manifest always takes precedence.

  <br />

- When deploying a cluster using `kubeadm init` to use Antrea CIDRs, you would specify the `--pod-network-cidr <cidr>`
  option and provide the IP address with the CIDR. For example:

  <br />

  `--pod-network-cidr=10.244.0.0/16`

  <br />

:::warning

The CIDR IP specified in Palette using the `podCIDR` parameter in the Kubernetes manifest always takes precedence.

If you wish to use Antrea CIDRs, the `podCIDR` and `serviceCIDR` parameters must be blank in the Kubernetes manifest.

To avoid overlapping your pod network with any of your host networks, you should think of a suitable CIDR block to
specify if you deploy a cluster using `kubeadm init` or as a replacement in your network plugin's YAML.

:::

<br />

- The Open vSwitch kernel module must be present on every Kubernetes node.

## Parameters

The Antrea CNI pack supports the following parameters.

| Parameter            | Description                                                                                                                   | Required (Y/N) |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------- |
| nodeIPAM:enable      | Enables the integrated NodeIPAM controller in the Antrea manifest. The default is `false`.                                    | Y              |
| clusterCIDRs         | CIDR ranges for pods in the cluster. The CIDRs can be either IPv4 or IPv6. You can specify up to one CIDR for each IP family. | N              |
| serviceCIDR          | IPv4 CIDR ranges reserved for Services.                                                                                       | N              |
| serviceCIDRv6        | IPv6 CIDR ranges reserved for Services.                                                                                       | N              |
| nodeCIDRMaskSizeIPv4 | Mask size for IPv4 Node CIDR in IPv4 or dual-stack cluster.                                                                   | N              |
| nodeCIDRMaskSizeIPv6 | Mask size for IPv6 Node CIDR in IPv6 or dual-stack cluster.                                                                   | N              |
| NodeIPAM             | The feature toggle for `antrea-controller`. The default is `false`. If you use CIDR ranges, set this to `true`.               | N              |
| ServiceExternalIP    | The feature toggle for `antrea-agent` and `antrea-controller`. If you use the LoadBalancer service, set this to `true`.       | N              |

## Usage

Kubernetes network policies are supported by default.

Antrea supports LoadBalancer services. Typically, implementing LoadBalancer services requires an external load balancer
that is implemented by the Kubernetes cloud provider.

Antrea provides two options for supporting LoadBalancer services without using an external load balancer:

<br />

- Using Antrea’s built-in external IP management for Services of type LoadBalancer.

- Leveraging MetalLB.

For detailed information, refer to Antrea’s
[Service of type LoadBalancer](https://antrea.io/docs/v1.9.0/docs/service-loadbalancer) documentation.

To learn more about using MetalLB, review
[Using MetalLB with Antrea](https://antrea.io/docs/v1.9.0/docs/service-loadbalancer/#using-metallb-with-antrea).

<br />

# Troubleshooting

If routing problems occur or some hosts cannot communicate outside their subnet, this indicates overlapping IP addresses
or conflicting CIDR IPs.

Ensure you have provided a non-overlapping IP address for your pod network in Palette's Kubernetes manifest using the
`podCIDR` parameter. The CIDR IP specified with the `podCIDR` parameter in the Kubernetes manifest always takes
precedence.

If you wish to use Antrea CIDRs and have deployed a cluster using Palette, ensure that you have done the following:

- Removed any value for `podCIDR` and `serviceCIDR` in the Kubernetes manifest.
- Provided a non-overlapping IP address for your pod network.

<br />

## Terraform

You can reference the Antrea CNI pack in Terraform with a data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
 name = "Public Repo"
}

data "spectrocloud_pack_simple" "antrea" {
 name    = "antrea"
 version = "1.9.0"
 type = "helm"
 registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## References

- [Antrea Service of type LoadBalancer](https://antrea.io/docs/v1.9.0/docs/service-loadbalancer)
- [MetalLB](https://metallb.universe.tf)
- [Antrea](https://antrea.io/)
- [Antrea IPAM Capabilities](https://antrea.io/docs/v1.6.1/docs/antrea-ipam/)
- [Using MetalLB with Antrea](https://antrea.io/docs/v1.9.0/docs/service-loadbalancer/#using-metallb-with-antrea)
