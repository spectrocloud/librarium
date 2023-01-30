---
title: 'Calico'
metaTitle: 'Calico Networking in Spectro Cloud'
metaDescription: 'Choosing Calico for Kubernetes Networking within the Spectro Cloud console'
hiddenFromNav: true
type: "integration"
category: ['network']
logoUrl: 'https://registry.spectrocloud.com/v1/cni-calico/blobs/sha256:9a08103ccd797857a81b6ce55fa4f84a48bcb2bddfc7a4ff27878819c87e1e30?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Calico

Palette Network Pack(s) helps provision resources for setting up Cluster networking in Kubernetes. Design goals for the Kubernetes network model can be found [here](https://kubernetes.io/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model).

[Project Calico](http://docs.projectcalico.org/) is an open-source container networking provider and network policy engine.

Calico provides highly scalable networking and network policy solution for connecting Kubernetes pods based on the same IP networking principles as the internet, for both Linux (open source) and Windows (proprietary - available from [Tigera](https://www.tigera.io/essentials/)). Calico can be deployed without encapsulation or overlays to provide high-performance, high-scale data center networking. Calico also provides a fine-grained, intent-based network security policy for Kubernetes pods via its distributed firewall.

Calico manifest used for networking does the following:

* Installs the `calico/node` container on each host using a DaemonSet.
* Installs the Calico CNI binaries and network config on each host using a DaemonSet.
* Runs `calico/kube-controllers` as a deployment.
* The `calico-etcd-secrets` secret, which optionally allows for providing etcd TLS assets.
* The `calico-config` ConfigMap, which contains parameters for configuring the install.

<WarningBox>
Limitations:
AWS, VMWare supports IP-in-IP encapsulation type.
Azure supports VXLAN encapsulation type.
</WarningBox>

# Versions Supported

<Tabs>

<Tabs.TabPane tab="3.24.x" key="3.24.x">

* ** 3.24.0**

</Tabs.TabPane>

<Tabs.TabPane tab="3.23.x" key="3.23.x">

* ** 3.23.0**

</Tabs.TabPane>
<Tabs.TabPane tab="3.22.x" key="3.22.x">

* ** 3.22.0**

</Tabs.TabPane>

<Tabs.TabPane tab="3.19.x" key="3.19.x">

* **3.19.0**

</Tabs.TabPane>

<Tabs.TabPane tab="3.16.x" key="3.16.x">

* **3.16.0**

</Tabs.TabPane>

<Tabs.TabPane tab="3.10.x" key="3.10.x">

* **3.10.2**

</Tabs.TabPane>

<Tabs.TabPane tab="3.9.x" key="3.9.x">

* **3.9.4**

</Tabs.TabPane>

</Tabs>

# Notable Parameters

| Name | Supported Values | Default value | Description |
| --- | --- | --- | --- |
| calico.encapsulationType | `CALICO_IPV4POOL_IPIP`, `CALICO_IPV4POOL_VXLAN` | `CALICO_IPV4POOL_IPIP` - AWS, VMware clouds | The encapsulation type to be used for networking (depends on the cloud) |
| | | `CALICO_IPV4POOL_VXLAN` - Azure cloud | |
| calico.encapsulationMode | `Always, CrossSubnet, Never` | Always | The mode to use the IPv4 POOL created at start up |
| calico.calicoNetworkCIDR | CIDR range | `192.168.0.0/16` | CIDR range to be assigned for Pods. This range should match the `podCIDR` range specified in the Kubernetes layer |

# Troubleshooting

* A daemon set is installed and so a calico-node pod should run on all the nodes in the cluster to provide networking.
* For any issues with networking, check calico-node and calico-kube-controller pods on the cluster.
