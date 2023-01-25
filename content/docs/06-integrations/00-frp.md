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
Spectro Proxy is a pack that enables the usage of a reverse proxy with a Kubernetes cluster. The reverse proxy allows you to to connect to a Palette managed Kubernetes cluster's API in private networks or Kubernetes clusters configured with private API endpoints. The reverse proxy managed by Spectro Cloud is called the forward reverse proxy (FRP).

The reverse proxy is composed of two components, a server and a client. The reverse proxy server is publicly available and managed by us. The client runs inside your Palette managed Kubernetes cluster and connects to the reverse proxy server. When you add the Spectro Proxy pack to a cluster profile a couple of things happen.

<br />

- The KubeConfig file is updated with the address of the reverse proxy instead of pointing directly to the Kubernetes cluster's API address. The following is an example of a kubeconfig file where the `server` attribute is pointing to the reverse.

    ```yaml
    apiVersion: v1
    clusters
    - cluster:
    certificate-authority-dataLSOtLa....
    server: https: //cluster-11111111111111.proxy.stage.spectrocloud.com:443
    name: vsphere-proxy
    contexts:
    - context:
    cluster: vsphere-proxy

    ```

- Any requests to the Kubernetes API server, such as kubectl commands, will be routed to the reverse proxy. The reverse proxy will forward the request to the to the intended client, which is the Kubernetes cluster's API server. The Kubernetes cluster's API server will authenticate the request and reply back with the proper response.


Users can attach this pack to a [cluster profile](/cluster-profiles). This pack installs the Spectro Proxy client in the workload clusters and configures the cluster's API server to point to a managed proxy server.

<br />


<InfoBox>


This pack can be combined with the [Kubernetes dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) pack to expose the Kubernetes dashboard. To learn more about exposing the Kubernetes dashboard, check out the [Enable Kubernetes Dashboard](/clusters/cluster-management/reverse-proxy-dashboard) guide. 
</InfoBox>

# Versions Supported

<Tabs>

<Tabs.TabPane tab="1.2.x" key="1.2.x">

## Prerequisites

- None


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

To use this pack you have to add it to your cluster profile.  You can also add the Spectro Proxy pack during the cluster profile creation. To learn more about cluster profile creation, check out [Create Cluster Profile](/cluster-profiles/task-define-profile) guide. 

Depending on the type of cluster, the usage guidance varies. Select the tab the corresponds to the type of cluster you have. Use the following definitions to help you identify the type of cluster.


- **Pure**: A brand new IaaS cluster that is deployed or will be deployed through Palette. An IaaS cluster is a Kubernetes cluster with a control plane that is not managed by a third party or cloud vendor but completely managed by Palette. Google GKE, and Tencent TKE fall under this category. 

- **Non-pure**: A non IaaS cluster whose control plane is managed by a third party or will be managed by the third party. Azure AKS and AWS EKS fall under this category as they are partially manged by Palette and the cloud provider. Clusters that are imported into Palette are also included in this category.


<Tabs>

<Tabs.TabPane tab="Pure" key="pure">

Add the following extra certificate Subject Alternative Name (SAN) value to the Kubernetes pack under `apiServer` parameter section. 

```yaml
 certSANs:
    - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

The following is an example configuration of the Kubernetes Pack manifest getting updated with the certificate SAN value:

![frp-cert-san-example](frp-certsan.png)


For RKE2 and K3s edge-native clusters, add the following configuration to the Kubernetes pack under `apiServer` parameter section.
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


</Tabs.TabPane>



<Tabs.TabPane tab="1.1.x" key="1.1.x">


## Prerequisites

- None 


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

To use this pack you have to add it to your cluster profile.  You can also add the Spectro Proxy pack during the cluster profile creation. To learn more about cluster profile creation, check out [Create Cluster Profile](/cluster-profiles/task-define-profile) guide. 

Depending on the type of cluster, the usage guidance varies. Select the tab the corresponds to the type of cluster you have. Use the following definitions to help you identify the type of cluster.


- **Pure**: A brand new IaaS cluster that is deployed or will be deployed through Palette. An IaaS cluster is a Kubernetes cluster with a control plane that is not managed by a third party or cloud vendor but completely managed by Palette. Google GKE, and Tencent TKE fall under this category. 

- **Non-pure**: A non IaaS cluster whose control plane is managed by a third party or will be managed by the third party. Azure AKS and AWS EKS fall under this category as they are partially manged by Palette and the cloud provider. Clusters that are imported into Palette are also included in this category.


<Tabs>

<Tabs.TabPane tab="Pure" key="pure">

Add the following extra certificate Subject Alternative Name (SAN) value to the Kubernetes pack under `apiServer` parameter section. 

```yaml
 certSANs:
    - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

The following is an example configuration of the Kubernetes Pack manifest getting updated with the certificate SAN value:

![frp-cert-san-example](frp-certsan.png)


For RKE2 and K3s edge-native clusters, add the following configuration to the Kubernetes pack under `apiServer` parameter section.
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

- None


## Parameters

The following parameters are supported for the Spectro Proxy.

| Parameter                | Description                                            | Default                                     |
|-------------------------|--------------------------------------------------------|---------------------------------------------|
| namespace               | The Kubernetes namespace to install the Spectro Proxy. | `cluster-{{ .spectro.system.cluster.uid }}` |
| server                  | The Kubernetes server.                                 | `{{ .spectro.system.reverseproxy.server }}` |
| clusterUid              | The Kubernetes cluster identifier.                     | `{{ .spectro.system.cluster.uid }}`         |
| subdomain               | The Kubernetes cluster subdomain identifier.           | `cluster-{{ .spectro.system.cluster.uid }}` |


## Usage

## Usage

To use this pack you have to add it to your cluster profile.  You can also add the Spectro Proxy pack during the cluster profile creation. To learn more about cluster profile creation, check out [Create Cluster Profile](/cluster-profiles/task-define-profile) guide. 

Depending on the type of cluster, the usage guidance varies. Select the tab the corresponds to the type of cluster you have. Use the following definitions to help you identify the type of cluster.


- **Pure**: A brand new IaaS cluster that is deployed or will be deployed through Palette. An IaaS cluster is a Kubernetes cluster with a control plane that is not managed by a third party or cloud vendor but completely managed by Palette. Google GKE, and Tencent TKE fall under this category. 

- **Non-pure**: A non IaaS cluster whose control plane is managed by a third party or will be managed by the third party. Azure AKS and AWS EKS fall under this category as they are partially manged by Palette and the cloud provider. Clusters that are imported into Palette are also included in this category.


<Tabs>

<Tabs.TabPane tab="Pure" key="pure">

Add the following extra certificate Subject Alternative Name (SAN) value to the Kubernetes pack under `apiServer` parameter section. 

```yaml
 certSANs:
    - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

The following is an example configuration of the Kubernetes Pack manifest getting updated with the certificate SAN value:

![frp-cert-san-example](frp-certsan.png)


For RKE2 and K3s edge-native clusters, add the following configuration to the Kubernetes pack under `apiServer` parameter section.
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

The Spectro Proxy pack can be referenced through Terraform with a data resource.

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

- [`spectrocloud_pack`](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/pack)

