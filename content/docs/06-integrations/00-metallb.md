---
title: 'MetalLB'
metaTitle: 'MetalLB'
metaDescription: 'MetalLB Load Balancer pack in Spectro Cloud'
hiddenFromNav: true
type: "integration"
category: ['load balancers', 'amd64', 'arm64']
logoUrl: 'https://registry.spectrocloud.com/v1/lb-metallb/blobs/sha256:3d09a1eab856a03d5b821062dcd1da624256e8f1e2ede404d88cb088d3adb945?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# MetalLB

MetalLB is a load-balancer implementation for bare metal [Kubernetes](https://kubernetes.io/) clusters using standard routing protocols. This integration is recommended for self-hosted cloud environments to help external services get an IP address when the service type is set as LoadBalancer. You can use a manifest-based pack or a Helm-based pack to configure and manage bare metal Kubernetes clusters. MetalLB deploys a controller and a speaker. The speaker is deployed as a DaemonSet that runs on all nodes.


## Versions Supported

<Tabs>

<Tabs.TabPane tab="0.13.x" key="0.13.x">

## Prerequisites

- A Kubernetes cluster running Kubernetes 1.13.0 or later that does not already have network load-balancing functionality.


- A cluster network configuration that can co-exist with MetalLB.


- Some IPv4 addresses for MetalLB to hand out.


- When using the Border Gateway Protocol (BGP), one or more BGP-capable routers are required.


- When using the L2 operating mode, Transmission Control Protocol (TCP) and User Datagram Protocol (UDP) traffic on port 7946 must be allowed between nodes, as required by the [Hashicorp memberlist](https://github.com/hashicorp/memberlist). You can configure other port as needed. 


## Parameters

The `addresses` parameter applies to the manifest-based pack. You can provide multiple entries but only one is typically needed.

| **Parameter** | **Description** |
|---------------|-----------------|
| `addresses`| This can be a range of addresses or a CIDR address. Examples:<br />192.168.250.48-192.168.250.55<br />192.168.250.0/24 |

## Usage

You can use a manifest-based pack or a Helm-based pack to configure and manage bare metal Kubernetes clusters.

<br />

### Manifest

The manifest-based pack (lb-metallb) supports direct configuration of a Layer 2-based IP address set. You can set either a range of addresses or use CIDR format, such as 192.168.250.48/29. A more advanced MetalLB configuration like Border Gateway Protocol (BGP)-based routing requires you to write your own manifests and add them to the Palette cluster profile.

The example shows the syntax used to set an address range.

<br />

```yaml
manifests:
  metallb:
    images:
      controller: ""
      speaker: ""
    namespace: "metallb-system"
    avoidBuggyIps: true
    addresses:
		- 192.168.250.48-192.168.250.55
```

<br />

### Helm Chart

The helm-based pack, *lb-metallb-helm*, has two sections, `charts:metallb-full:configuration` and `charts:metallb-full:metallb`, as shown in the following examples.

Use the `charts:metallb-full:configuration` parameter section to set resource types that MetalLB supports. The pack default gives you a Layer 2 address pool. To set up a more advanced scenario, you can use the other resource types provided in the pack. The pack includes a commented-out example for each resource.

<br />


```yaml
charts:
  metallb-full:
    configuration:
      ipaddresspools:
        first-pool:
          spec:
            addresses:
              - 192.168.10.0/24
            avoidBuggyIPs: true
            autoAssign: true

      l2advertisements:
        default:
          spec:
            ipAddressPools:
              - first-pool

      bgpadvertisements: {}
      bgppeers: {}
      communities: {}
      bfdprofiles: {}
```
<br />

The `charts:metall-full:metallb` parameter section provides access to all the options of the base chart that installs MetalLB. You don’t need to change anything unless you want to install MetalLB in Free Range Routing (FRR) mode. To use FRR mode, set the option to `true`, as the example shows. 

<br />

```yaml
charts:
	metallb-full:
		metallb:
			speaker:
				frr:
					enabled: true
```



</Tabs.TabPane>

<Tabs.TabPane tab="0.11.x" key="0.11.x">


## Prerequisites

- A Kubernetes cluster running Kubernetes 1.13.0 or later that does not already have network load-balancing functionality.


- A cluster network configuration that can co-exist with MetalLB.


- Some IPv4 addresses for MetalLB to hand out.


- When using the Border Gateway Protocol (BGP), one or more BGP-capable routers are required.


- When using the L2 operating mode, Transmission Control Protocol (TCP) and User Datagram Protocol (UDP) traffic on port 7946 must be allowed between nodes, as required by the [Hashicorp memberlist](https://github.com/hashicorp/memberlist). You can configure other port as needed. 


## Parameters

The `addresses` parameter applies to the manifest-based pack. You can provide multiple entries but only one is typically needed.

| **Parameter** | **Description** |
|---------------|-----------------|
| `addresses`| This can be a range of addresses or a CIDR address. Examples:<br />192.168.250.48-192.168.250.55<br />192.168.250.0/24 |

## Usage

<!-- You can use a manifest-based pack or a Helm-based pack to configure and manage bare metal Kubernetes clusters.

<br /> 

### Manifest -->

The manifest-based pack, *lb-metallb*, supports direct configuration of a Layer 2-based IP address set. You can set either a range of addresses or use CIDR format, such as 192.168.250.48/29. A more advanced MetalLB configuration like Border Gateway Protocol (BGP)-based routing requires you to write your own manifests and add them to the Palette cluster profile.

The example shows the syntax used to set an address range.

<br />

```yaml
manifests:
  metallb:
    images:
      controller: ""
      speaker: ""
    namespace: "metallb-system"
    avoidBuggyIps: true
    addresses:
		- 192.168.250.48-192.168.250.55
```

<br />

### Helm Chart

The helm-based pack, *lb-metallb-helm*, has two sections, `charts:metallb-full:configuration` and `charts:metallb-full:metallb`, as shown in the following examples.

Use the `charts:metallb-full:configuration` parameter section to set resource types that MetalLB supports. The pack default gives you a Layer 2 address pool. To set up a more advanced scenario, you can use the other resource types provided in the pack. The pack includes a commented-out example for each resource.

<br />


```yaml
charts:
  metallb-full:
    configuration:
      ipaddresspools:
        first-pool:
          spec:
            addresses:
              - 192.168.10.0/24
            avoidBuggyIPs: true
            autoAssign: true

      l2advertisements:
        default:
          spec:
            ipAddressPools:
              - first-pool

      bgpadvertisements: {}
      bgppeers: {}
      communities: {}
      bfdprofiles: {}
```
<br />

The `charts:metall-full:metallb` parameter section provides access to all the options of the base chart that installs MetalLB. You don’t need to change anything unless you want to install MetalLB in Free Range Routing (FRR) mode. To use FRR mode, set the option to `true`, as the example shows. 

<br />

```yaml
charts:
	metallb-full:
		metallb:
			speaker:
				frr:
					enabled: true
```




</Tabs.TabPane>

<Tabs.TabPane tab="Deprecated" key="Deprecated">

<WarningBox>

All versions of the manifest-based pack less than v0.9.x are considered deprecated. Upgrade to a newer version to take advantage of new features.

</WarningBox>


</Tabs.TabPane>
</Tabs>



## Troubleshooting

Addresses specified in the pack values go into a configMap `config` in the `metallb-system` namespace. This configMap is used by the MetalLB controller and speakers as volume mounts.

Any changes to the address will get updated in the configMap. You can confirm this by issuing the following command.

<br />

```bash
kubectl describe cm config -n metallb-system
```

<br />
	
Since the controller and speaker pods are already running with a previous copy of the configMap, existing deployments are unaware of the changes made to configMap. To ensure the address change are reflected, you need to restart the controller and speaker pods so they fetch the new configMap and start assigning new addresses correctly. Issue the commands below to restart the controller and speaker.

<br />

<br />

```bash
	kubectl rollout restart deploy controller -n metallb-system
	kubectl rollout restart ds speaker -n metallb-system
```


## Terraform

```hcl
data "spectrocloud_pack" "MetalLB" {
     name    = "lb-metallb"
     version = "0.13.5"
}
data "spectrocloud_pack" "MetalLB-Helm" {
     name    = "lb-metallb-helm"
     version = "0.13.7"
}
```


## References

- [MetalLB](https://metallb.universe.tf/) 


- [MetalLB-GitHub ](https://github.com/metallb/metallb)
