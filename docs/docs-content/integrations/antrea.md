---
sidebar_label: "Antrea"
title: "Antrea"
description: "Antrea CNI network pack for Palette Kubernetes Clusters"
type: "integration"
category: ["network", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/antrea/blobs/sha256:3c5704caf6652c63374282cbf413f8e73a77c4efbc49f375c19c73f8e2ec4148?type=image.webp"
tags: ["packs", "antrea", "cni", "network"]
---

Palette supports Antrea controller network interface (CNI) for VMware Kubernetes clusters. Antrea CNI enables each pod
to have exclusive IP addresses from the subnet with direct accessibility.

Antrea leverages [Open vSwitch](https://www.openvswitch.org/) to implement pod networking and security features. Open
vSwitch enables Antrea to implement Kubernetes network policies efficiently.

## Supported Versions

<Tabs queryString="parent">
<TabItem label="1.9.x" value="1.9.x">

</TabItem>
</Tabs>

## Troubleshooting

If routing problems occur or some hosts cannot communicate outside their subnet, this indicates overlapping IP addresses
or conflicting CIDR IPs.

Ensure you have provided a non-overlapping IP address for your pod network in Palette's Kubernetes manifest using the
`podCIDR` parameter. The CIDR IP specified with the `podCIDR` parameter in the Kubernetes manifest always takes
precedence.

If you wish to use Antrea CIDRs and have deployed a cluster using Palette, ensure that you have done the following:

- Removed any value for `podCIDR` and `serviceCIDR` in the Kubernetes manifest.
- Provided a non-overlapping IP address for your pod network.

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
