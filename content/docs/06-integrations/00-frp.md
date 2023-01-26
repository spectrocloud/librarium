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
Spectro Proxy is a pack that enables the use of a reverse proxy with a Kubernetes cluster. The reverse proxy allows you to connect to the API of a Palette-managed Kubernetes cluster in private networks or clusters configured with private API endpoints. The reverse proxy managed by Spectro Cloud is also known as the forward reverse proxy (FRP).

The reverse proxy has a server component and a client component. The reverse proxy server is publicly available and managed by Spectro Cloud. The client runs inside your Palette-managed Kubernetes cluster and connects to the reverse proxy server. When you add the Spectro Proxy pack to a cluster profile, a couple of things happen:

<br />

- The KubeConfig file is updated with the reverse proxy address instead of pointing directly to the cluster's API address. The following is an example of a kubeconfig file where the `server` attribute points to the reverse proxy.

    ```yaml
    apiVersion: v1
    clusters
    - cluster:
    certificate-authority-dataLSOtLa....
    server: https://cluster-11111111111111.proxy.stage.spectrocloud.com:443
    name: vsphere-proxy
    contexts:
    - context:
    cluster: vsphere-proxy

    ```

- Any requests to the Kubernetes API server, such as kubectl commands, will be routed to the reverse proxy. The reverse proxy forwards the request to the intended client, which is the cluster's API server. The cluster's API server authenticates the request and replies with the proper response.


You can attach this pack to a [cluster profile](/cluster-profiles). The pack installs the Spectro Proxy client in the workload clusters and configures the cluster's API server to point to a managed proxy server.

<br />


<InfoBox>


This pack can be combined with the [Kubernetes dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) pack to expose the Kubernetes dashboard. To learn more about exposing the Kubernetes dashboard, check out the [Enable Kubernetes Dashboard](/clusters/cluster-management/reverse-proxy-dashboard) guide. 
</InfoBox>

# Versions Supported

<Tabs>

<Tabs.TabPane tab="1.2.x" key="1.2.x">

## Prerequisites

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the Spectro Cloud reverse proxy.


## Parameters

The Spectro Proxy supports the following parameters.

| Parameter                | Description                                            | Default                                     |
|-------------------------|--------------------------------------------------------|---------------------------------------------|
| namespace               | The Kubernetes namespace to install the Spectro Proxy. | `cluster-{{ .spectro.system.cluster.uid }}` |
| server                  | The Kubernetes server.                                 | `{{ .spectro.system.reverseproxy.server }}` |
| clusterUid              | The Kubernetes cluster identifier.                     | `{{ .spectro.system.cluster.uid }}`         |
| subdomain               | The Kubernetes cluster subdomain identifier.           | `cluster-{{ .spectro.system.cluster.uid }}` |


The Kubernetes dashboard integration supports the following parameters.

| Parameter       | Description                                 | Default |
|-----------------|---------------------------------------------|---------|
| enabled         |  Enable the dashboard.                      | `false`   |
| useInsecurePort | Use unsecure port (HTTP) for communication. | `false`   |


## Usage

To use this pack, you have to add it to your cluster profile.  You can also add the Spectro Proxy pack when you create the cluster profile. Check out the [Create Cluster Profile](/cluster-profiles/task-define-profile) guide to learn more about cluster profile creation.

Depending on the type of cluster, the usage guidance varies. Select the tab that corresponds to the kind of cluster you have. Use the following definitions to help you identify the type of cluster.

<br />


- **Pure**: A brand new IaaS cluster that is deployed or will be deployed through Palette. An IaaS cluster is a Kubernetes cluster with a control plane that is not managed by a third party or cloud vendor but is completely managed by Palette. Google GKE and Tencent TKE fall in this category. 

- **Non-pure**: A non-IaaS cluster whose control plane is managed by a third party or will be managed by a third party. Azure AKS and AWS EKS fall in this category, as both Palette and the cloud provider partially manage the clusters. Clusters imported into Palette are also included in this category.


<Tabs>

<Tabs.TabPane tab="Pure" key="pure">

Add the following extra certificate Subject Alternative Name (SAN) value to the Kubernetes pack under the `apiServer` parameter section. 

```yaml
 certSANs:
    - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

The following is an example configuration of the Kubernetes Pack manifest getting updated with the certificate SAN value:

![frp-cert-san-example](frp-certsan.png)


For RKE2 and K3s edge-native clusters, add the following configuration to the Kubernetes pack under the `apiServer` parameter section.
```yaml
    tls-san:
      - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```


<br />


</Tabs.TabPane>
<Tabs.TabPane tab="Non-pure" key="non-pure">


Add the Spectro Proxy pack to a cluster profile without making any configuration changes. Use the pack as is.

</Tabs.TabPane>

</Tabs>

<InfoBox>

Set the parameter `k8sDashboardIntegration.enabled` to true if you intend to expose the Kubernetes dashboard. 
Review the [Enable Kubernetes Dashboard](/clusters/cluster-management/reverse-proxy-dashboard) guide for more information.

</InfoBox>


</Tabs.TabPane>



<Tabs.TabPane tab="1.1.x" key="1.1.x">


## Prerequisites

- Outbound internet connectivity for port `443` is allowed so that you and your applications can connect with the Spectro Cloud reverse proxy. 


## Parameters

The Spectro Proxy supports the following parameters.

| Parameter                | Description                                            | Default                                     |
|-------------------------|--------------------------------------------------------|---------------------------------------------|
| namespace               | The Kubernetes namespace to install the Spectro Proxy. | `cluster-{{ .spectro.system.cluster.uid }}` |
| server                  | The Kubernetes server.                                 | `{{ .spectro.system.reverseproxy.server }}` |
| clusterUid              | The Kubernetes cluster identifier.                     | `{{ .spectro.system.cluster.uid }}`         |
| subdomain               | The Kubernetes cluster subdomain identifier.           | `cluster-{{ .spectro.system.cluster.uid }}` |


The Kubernetes dashboard integration supports the following parameters.

| Parameter       | Description                                 | Default |
|-----------------|---------------------------------------------|---------|
| enabled         |  Enable the dashboard.                      | `false`   |
| useInsecurePort | Use unsecure port (HTTP) for communication. | `false`   |


## Usage

To use this pack, you have to add it to your cluster profile.  You can also add the Spectro Proxy pack during the cluster profile creation. Check out the [Create Cluster Profile](/cluster-profiles/task-define-profile) guide to learn more about cluster profile creation. 

Depending on the type of cluster, the usage guidance varies. Select the tab that corresponds to the kind of cluster you have. Use the following definitions to help you identify the type of cluster.

<br />

- **Pure**: A brand new IaaS cluster that is deployed or will be deployed through Palette. An IaaS cluster is a Kubernetes cluster with a control plane that is not managed by a third party or cloud vendor but is completely managed by Palette. Google GKE and Tencent TKE fall under this category. 

- **Non-pure**: A non-IaaS cluster whose control plane is managed by a third party or will be managed by a third party. Azure AKS and AWS EKS fall under this category as both Palette and the cloud provider partially manage the clusters. Clusters that are imported into Palette are also included in this category.


<Tabs>

<Tabs.TabPane tab="Pure" key="pure">

Add the following extra certificate Subject Alternative Name (SAN) value to the Kubernetes pack under the `apiServer` parameter section. 

```yaml
 certSANs:
    - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

The following is an example configuration of the Kubernetes Pack manifest getting updated with the certificate SAN value:

![frp-cert-san-example](frp-certsan.png)


For RKE2 and K3s edge-native clusters, add the following configuration to the Kubernetes pack under the `apiServer` parameter section.
```yaml
    tls-san:
      - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```


<br />


</Tabs.TabPane>
<Tabs.TabPane tab="Non-pure" key="non-pure">


Add the Spectro Proxy pack to a cluster profile without making any configuration changes. Use the pack as is.

</Tabs.TabPane>

</Tabs>

<InfoBox>

Set the parameter `k8sDashboardIntegration.enabled` to true if you intended to expose the Kubernetes dashboard. 
Review the [Enable Kubernetes Dashboard](/clusters/cluster-management/reverse-proxy-dashboard) guide for more information.

</InfoBox>

<br />


</Tabs.TabPane>
<Tabs.TabPane tab="1.0.x" key="1.0.x">

## Prerequisites

- Outbound internet connectivity for port `443` is allowed so that you and your applications can connect with the Spectro Cloud reverse proxy.


## Parameters

The Spectro Proxy supports the following parameters.

| Parameter                | Description                                            | Default                                     |
|-------------------------|--------------------------------------------------------|---------------------------------------------|
| namespace               | The Kubernetes namespace to install the Spectro Proxy. | `cluster-{{ .spectro.system.cluster.uid }}` |
| server                  | The Kubernetes server.                                 | `{{ .spectro.system.reverseproxy.server }}` |
| clusterUid              | The Kubernetes cluster identifier.                     | `{{ .spectro.system.cluster.uid }}`         |
| subdomain               | The Kubernetes cluster subdomain identifier.           | `cluster-{{ .spectro.system.cluster.uid }}` |


## Usage

To use this pack, you have to add it to your cluster profile.  You can also add the Spectro Proxy pack during the cluster profile creation. Check out the [Create Cluster Profile](/cluster-profiles/task-define-profile) guide to learn more about cluster profile creation.

Depending on the type of cluster, the usage guidance varies. Select the tab that corresponds to the kind of cluster you have. Use the following definitions to help you identify the type of cluster.

<br />

- **Pure**: A brand new IaaS cluster that is deployed or will be deployed through Palette. An IaaS cluster is a Kubernetes cluster with a control plane that is not managed by a third party or cloud vendor but completely managed by Palette. Google GKE, and Tencent TKE fall under this category. 

- **Non-pure**: A non-IaaS cluster whose control plane is managed by a third party or will be managed by a third party. Azure AKS and AWS EKS fall under this category as both Palette and the cloud provider partially manage the clusters. Clusters that are imported into Palette are also included in this category.


<Tabs>

<Tabs.TabPane tab="Pure" key="pure">

Add the following extra certificate Subject Alternative Name (SAN) value to the Kubernetes pack under the `apiServer` parameter section. 

```yaml
 certSANs:
    - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

The following is an example configuration of the Kubernetes Pack manifest getting updated with the certificate SAN value:

![frp-cert-san-example](frp-certsan.png)


For RKE2 and K3s edge-native clusters, add the following configuration to the Kubernetes pack under the `apiServer` parameter section.
```yaml
    tls-san:
      - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```


<br />


</Tabs.TabPane>
<Tabs.TabPane tab="Non-pure" key="non-pure">


Add the Spectro Proxy pack to a cluster profile without making any configuration changes. Use the pack as is.

</Tabs.TabPane>

</Tabs>

<InfoBox>

Set the parameter `k8sDashboardIntegration.enabled` to true if you intended to expose the Kubernetes dashboard. 
Review the [Enable Kubernetes Dashboard](/clusters/cluster-management/reverse-proxy-dashboard) guide for more information.

</InfoBox>


<br />


<InfoBox>

Set the parameter `k8sDashboardIntegration.enabled` to true if you intended to expose the Kubernetes dashboard. 
Review the [Enable Kubernetes Dashboard](/clusters/cluster-management/reverse-proxy-dashboard) guide for more information.

</InfoBox>

</Tabs.TabPane>
</Tabs>

# Terraform

You can reference the Spectro Proxy pack in Terraform with a data resource.

```tf
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "spectro-proxy" {
  name    = "spectro-proxy"
  version = "1.2.0"
  type = "operator-instance"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

# References

- [Enable Kubernetes Dashboard](/clusters/cluster-management/reverse-proxy-dashboard)

- [Terraform Data Resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/pack)

