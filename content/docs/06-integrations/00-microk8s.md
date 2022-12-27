---
title: 'MicroK8s'
metaTitle: 'MicroK8s Integration with Palette'
metaDescription: 'MicroK8s pack in Palette'
hiddenFromNav: true
isIntegration: true
category: ["kubernetes"]
logoUrl: 'https://registry.spectrocloud.com/v1/kubernetes-microk8s/blobs/sha256:b971b64f62e2e67b0a166316f96e6f4211aacea6e28459bb89275e8882ade985?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# MicroK8s Overview

MicroK8s is a Cloud Native Computing Foundation (CNCF) certified upstream Kubernetes deployment that runs entirely on your workstation or edge device. It runs all Kubernetes services natively without virtual machines and packs all the required libraries and binaries.

## Prerequisites

- One of the following Ubuntu environments to run commands:
    - 22.04 LTS
    - 20.04 LTS
    - 18.04 LTS 
    - 16.04 LTS
    
    Or another operating system that supports snapd.


- At least 20 GB of disk space and 4 GB of memory.
- An internet connection.

<InfoBox>

If your environment doesn't meet these requirements, there are alternative ways to install MicroK8s, including additional OS support and an offline deployment.

</InfoBox>
    

## Versions Supported

<Tabs>

<Tabs.TabPane tab="1.25.x" key="1.25.x">

* **1.25.0**

</Tabs.TabPane>

<Tabs.TabPane tab="1.24.x" key="1.24.x">

* **1.24.0**

</Tabs.TabPane>
</Tabs>

MicroK8s installs a minimal, lightweight Kubernetes you can run and use on almost any machine. When installing MicroK8s you can specify a channel made up of two components: 

- **Track**: denotes the upstream Kubernetes version.  
- **Risk level**: indicates the maturity level of the release, such as stable and edge.

MicroK8s comes with its own packaged version of the ``kubectl`` command for operating Kubernetes. This avoids interfering with any version that may already be on the host machine. You can run it in a terminal like this:
<br />

``` yaml
microk8s kubectl
```

If you are using or want to use a different kubectl command, you can configure it for your Linux, Mac, or Windows operating system. 

<br />
 
<WarningBox>

### Caveat for MicroK8s with AWS EBS pack

When you deploy AWS EBS pack with MicroK8s, you need to change EBS CSI pack node.kubelet values from: 

```yaml
    node:
      env: []
      kubeletPath: /var/lib/kubelet
```
to the below yaml content:  

```yaml
    node:
      env: []
      kubeletPath: /var/snap/microk8s/common/var/lib/kubelet
```
</WarningBox>

# References

[MicroK8s](https://microk8s.io/docs)
