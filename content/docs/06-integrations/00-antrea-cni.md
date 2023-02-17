---
title: 'Antrea CNI'
metaTitle: 'Antrea CNI'
metaDescription: 'Antrea CNI network pack for Palette Kubernetes Clusters'
hiddenFromNav: true
type: "integration"
category: ['network']
logoUrl: 'https://registry.dev.spectrocloud.com/v1/csi-azure/blobs/sha256:0787b7943741181181823079533cd363884a28aa0651715ea43408bdc77a5c51?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Antrea CNI

Palette supports Antrea controller network interface (CNI) networking for Kubernetes clusters. Antrea  CNI enables each pod to have exclusive IP addresses from the subnet with direct accessibility. 

Antrea leverages Open vSwitch to implement pod networking and security features. Open vSwitch enables Antrea to implement Kubernetes network policies efficiently.

# Supported Versions

**1.9.x**

** Prerequisites

- Enable the ``NodeIPAMController`` parameter in the Kubernetes cluster.
- When deploying a cluster using kubeadm, specify the ``--pod-network-cidr <cidr>`` option and provide the IP address with the classless inter-domain routing (CIDR). For example: 

    ``--pod-network-cidr=10.244.0.0/16``

    <WarningBox>

    To avoid overlapping your pod network with any of your host networks, you should think of a suitable CIDR block to specify if you deploy a cluster using ``kubeadm init`` with ``--pod-network-cidr <cidr>`` or as a replacement in your network plugin's YAML.

    </WarningBox>

- The Open vSwitch kernel module must be present on every Kubernetes node.

## Parameters

The Antrea CNI pack supports the following parameters. 

## Usage

Kubernetes network policies are supported by default.

Antrea supports LoadBalancer services. Typically, implementing LoadBalancer services requires an external load balancer that is implemented by the Kubernetes Cloud Provider. Antrea provides two options for supporting LoadBalancer services without using an external load balancer:
Using Antrea’s built-in external IP management for Services of type LoadBalancer
Leveraging MetalLB.
For detailed information, refer to Antrea’s [Service of type LoadBalancer](https://antrea.io/docs/v1.9.0/docs/service-loadbalancer) documentation. 

# Troubleshooting

Ensure you have provided a non-overlapping IP address for your pod network  in the Kubernetes pack. 


# Terraform 

You can reference the Antrea CNI pack in Terraform with a data resource.

```tf
data "spectrocloud_registry" "public_registry" {
 name = "Public Repo"
}

data "spectrocloud_pack_simple" "antrea" {
 name    = "antrea"
 version = "1.9.0"
 type = "network"
 registry_uid = data.spectrocloud_registry.public_registry.id
}
```

# References

- [Antrea Service of type LoadBalancer](https://antrea.io/docs/v1.9.0/docs/service-loadbalancer)
- [MetalLB](https://metallb.universe.tf)
- [Antrea](https://antrea.io/)

<br />

<br />

