---
title: 'Cilium'
metaTitle: 'cilium'
metaDescription: 'Cilium network pack for Spectro Cloud Palette'
hiddenFromNav: true
isIntegration: true
category: ['network']
logoUrl: 'https://registry.dev.spectrocloud.com/v1/cni-cilium/blobs/sha256:dbc239ac739ea2939ef41dd0743b82281bc82c360326cd7c536f73f0053e2cd2?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Cilium

Palette Network Pack(s) helps provision resources for setting up Cluster networking in Kubernetes. For more Kubernetes network model design goals visit [here](https://kubernetes.io/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model). 

Palette supports **Cilium**, an open-source software for securing and observing network connectivity between cloud-native container workloads. Cilium is underpinned by a Linux Kernel technology called eBPF, to enable dynamic and strong security visibility ,and control logic within Linux. As eBPF runs within the Linux Kernel, Cilium security policies are applied and updated independent of the application code or container configuration. 

The Cilium agent runs on all clusters and servers to provide networking, security and observability to the workload running on that node.

## Versions Supported

<Tabs>

<Tabs.TabPane tab="1.10.x" key="1.10.x">

**1.10.9**

</Tabs.TabPane>

</Tabs>


## References

https://docs.cilium.io/en/stable/
