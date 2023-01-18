---
title: 'Spectro Proxy'
metaTitle: 'Spectro Cloud Fast Reverse Proxy'
metaDescription: 'Fast Reverse Proxy Authentication pack in Spectro Cloud-Spectro Proxy'
hiddenFromNav: true
type: "integration"
hideToC: false
category: ['authentication']
logoUrl: 'https://registry.dev.spectrocloud.com/v1/spectro-proxy/blobs/sha256:b6081bca439eeb01a8d43b3cb6895df4c088f80af978856ddc0da568e5c09365?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Spectro Proxy
Spectro Proxy is a reverse proxy that enables you to forward a port of your server behind a network address translation (NAT) or firewall to a public server. The proxy server pack is available as an addon pack.

Users can attach this pack to a [cluster profile](/cluster-profiles). This pack installs the Spectro Proxy client in the workload clusters and configures the cluster to point to a manged proxy server, also called the forward reverse proxy (FRP). We provide host clusters with a FRP and by default the Spectro Proxy pack is configured to connect to the managed FRP. We detect the presence of this pack in the cluster and automatically updates the kubeconfig file to use the managed proxy server server as the endpoint. 
<br />


<InfoBox>


This pack can be combined with the [Kubernetes dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) pack to expose the Kubernetes dashboard. To learn more about exposing the Kubernetes dashboard, check out the [Enable Kubernetes Dashboard](/clusters/cluster-management/reverse-proxy-dashboard) guide. 
</InfoBox>

## Versions Supported

<Tabs>

<Tabs.TabPane tab="1.2.x" key="1.2.x">

## Prerequisites

- A Spectro Cloud Host Cluster.
- Port 443 exposed outbound communication


## Parameters

The following parameters are supported for the Spectro Proxy.

| Parameter                | Description                                            | Default                                     |
|-------------------------|--------------------------------------------------------|---------------------------------------------|
| namespace               | The Kubernetes namespace to install the Spectro Proxy. | `cluster-{{ .spectro.system.cluster.uid }}` |
| server                  | The Kubernetes server.                                 | `{{ .spectro.system.reverseproxy.server }}` |
| clusterUid              | The Kubernetes cluster identifier.                     | `{{ .spectro.system.cluster.uid }}`         |
| subdomain               | The Kubernetes cluster subdomain identifier.           | `cluster-{{ .spectro.system.cluster.uid }}` |


The Kubernetes dashboard integration supports the followwing parameters.

| Parameter       | Description                                 | Default |
|-----------------|---------------------------------------------|---------|
| enabled         |  Enable the dashboard.                      | `false`   |
| useInsecurePort | Use unsecure port (HTTP) for communication. | `false`   |


## Usage

The setup of this pack varies depending on the Kubernetes flavor selected. 
If you are not using Edge then select the Palette eXtended Kubernetes tab.
<br /> 

<Tabs>
<Tabs.TabPane tab="Palette eXtended Kubernetes" key="PXK">


To use this pack you have to add it to your cluster profile.  You can also add the Spectro Proxy pack during the cluster profile creation. To learn more about cluster profile creation, check out [Create Cluster Profile](/cluster-profiles/task-define-profile) guide. You can use the default values provided as the pack is inteded to work out of the box.  

Some manged Kuberneted platforms require minor customization of the Kubernetes pack configuration in the cluster profile.
If using AWS EKS, add the following extra certificate Subject Alternative Name (SAN) value to the Kubernetes pack under `apiServer` parameter section. 

```yaml
    certSANs:
    - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

The following is an example configuration:

![frp-cert-san-example](frp-certsan.png)


After you have successfuly deployed a cluster you can 


<br />


<InfoBox>

Set the parameter `k8sDashboardIntegration.enabled` to true if you intended to expose the Kubernetes dashboard. 
Review the [Enable Kubernetes Dashboard](/clusters/cluster-management/reverse-proxy-dashboard) guide for more information.

</InfoBox>

</Tabs.TabPane>
<Tabs.TabPane tab="Palette eXtended Kubernetes Edge" key="PXKE">
    # VMware cluster Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</Tabs.TabPane>
</Tabs>



</Tabs.TabPane>

<Tabs.TabPane tab="1.1.x" key="1.1.x">

**1.1.0**

</Tabs.TabPane>
<Tabs.TabPane tab="1.0.x" key="1.0.x">

**1.0.x**

</Tabs.TabPane>
</Tabs>

**Important Note:**





# Terraform

The Spectro Proxy pack can be referenced through Terraform with a data resource.

```tf
data "spectrocloud_pack" "spectro-proxy" {
  name    = "spectro-proxy"
  version = "1.2.0"
}
```

# References

- [`spectrocloud_pack`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/pack)

