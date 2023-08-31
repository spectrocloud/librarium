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

MetalLB is a load-balancer implementation for bare metal [Kubernetes](https://kubernetes.io/) clusters using standard routing protocols. This integration is recommended for self-hosted cloud environments to help external services get an IP address when the service type is set as LoadBalancer. MetalLB deploys a controller and a speaker. The speaker is deployed as a DaemonSet and runs on all nodes.


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



## Usage

You can use a manifest-based pack or a Helm-based pack to configure and manage bare metal Kubernetes clusters.

### Manifest

The manifest-based pack (lb-metallb) supports direct configuration of a Layer 2-based IP address set. You can set either a range of addresses or a CIDR such as 192.168.250.48/29 for the same set of addresses. A more advanced MetalLB configuration like Border Gateway Protocol (BGP)-based routing requires you to write your own manifests and add them to the Palette cluster profile.

The example shows the syntax used to set an address range.

```yaml
manifests:
  metallb:
    images:
      controller: ""
      speaker: ""
    #The namespace to use for deploying MetalLB
    namespace: "metallb-system"

    #MetalLB will skip setting .0 & .255 IP address when this flag is enabled
    avoidBuggyIps: true

		# Layer 2 config; The IP address range MetalLB should use while assigning IP's for svc type LoadBalancer
    # For the supported formats, check https://metallb.universe.tf/configuration/#layer-2-configuration
    addresses:
    #- 10.10.184.0-10.10.184.255
		- 192.168.250.48-192.168.250.55
```


The helm-based pack (lb-metallb-helm) has two sections, `charts:metallb-full:configuration` and `charts:metallb-full:metallb`, as shown in the following examples.

The `charts:metallb-full:configuration` parameter section is where you can set resource types that MetalLB supports. The pack default gives you a Layer 2 pool of IP addresses. If you want to set up a more advanced scenario, you can do so with the other resource types provided in the pack. The pack includes a commented-out example for each resource.


```yaml
charts:
  metallb-full:
    configuration:
      ipaddresspools:
        first-pool:
          spec:
            addresses:
              - 192.168.10.0/24
              # - 192.168.100.50-192.168.100.60
            avoidBuggyIPs: true
            autoAssign: true

      l2advertisements:
        default:
          spec:
            ipAddressPools:
              - first-pool

      bgpadvertisements: {}
        # external:
        #   spec:
        #     ipAddressPools:
        #       - bgp-pool
        #     # communities:
        #     #   - vpn-only

      bgppeers: {}
        # bgp-peer-1:
        #   spec:
        #     myASN: 64512
        #     peerASN: 64512
        #     peerAddress: 172.30.0.3
        #     peerPort: 180
        #     # BFD profiles can only be used in FRR mode
        #     # bfdProfile: bfd-profile-1

      communities: {}
        # community-1:
        #   spec:
        #     communities:
        #     - name: vpn-only
        #       value: 1234:1

      bfdprofiles: {}
        # bfd-profile-1:
        #   spec:
        #     receiveInterval: 380
        #     transmitInterval: 270

    metallb:
      # Default values for the metallb chart.
      # This is a YAML-formatted file.
      # Declare variables to be passed into your templates.
```


The `charts:metall-full:metallb` parameter section provides access to all the options of the base chart that installs MetalLB. You don’t need to change anything unless you want to install MetalLB in Free Range Routing (FRR) mode. To use FRR mode, you would set the option as shown in the example.

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



</Tabs.TabPane>

<Tabs.TabPane tab="0.9.x" key="0.9.x">



</Tabs.TabPane>
<Tabs.TabPane tab="0.8.x" key="0.8.x">



</Tabs.TabPane>
</Tabs>




## Components

* MetalLB controller.
* Speaker (runs on all nodes, deployed as DaemonSet).


## Troubleshooting

The IP address set in pack values goes into a configMap `config` in the `metallb-system` namespace. This configMap is used by the MetalLB controller and speakers as volume mounts.

Any changes to the address will get updated in the configMap. You can confirm this by issuing the following command:

	```bash
	kubectl describe cm config -n metallb-system
	```

	<br />
	
	Since the controller and speaker pods are already running with a previous copy of the configMap, existing deployments are unaware of the changes made to configMap. To ensure the address change are reflected, you need to restart the controller and speaker pods so they fetch the new configMap and start assigning new addresses correctly.

Issue the commands below to restart the controller and speaker.

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
