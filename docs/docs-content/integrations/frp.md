---
sidebar_label: 'Spectro Proxy'
title: 'Spectro Proxy'
description: 'Fast Reverse Proxy Authentication pack in Spectro Cloud-Spectro Proxy'
hide_table_of_contents: true
type: "integration"
category: ['authentication', 'amd64', 'fips', "network"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.dev.spectrocloud.com/v1/spectro-proxy/blobs/sha256:b6081bca439eeb01a8d43b3cb6895df4c088f80af978856ddc0da568e5c09365?type=image/png'
tags: ['packs', 'spectro-proxy', 'network']
---


Spectro Proxy is a pack that enables the use of a reverse proxy with a Kubernetes cluster. The reverse proxy allows you to connect to the cluster API of a Palette-managed Kubernetes cluster in private networks or clusters configured with private API endpoints. The reverse proxy managed by Spectro Cloud is also known as the forward reverse proxy (FRP).

The reverse proxy has a server component and a client component. The reverse proxy server is publicly available and managed by Spectro Cloud. The client is deployed inside your Palette-managed Kubernetes cluster and connects to the reverse proxy server. When you add the Spectro Proxy pack to a cluster profile, a couple of things happen:

- The kubeconfig file is updated with the reverse proxy address instead of pointing directly to the cluster's API address. The following is an example of a kubeconfig file where the `server` attribute points to the reverse proxy.

  ```hideClipboard yaml {4-5}
  apiVersion: v1
    clusters:
    - cluster:
      certificate-authority-data: LS......
      server: https://cluster-61a578b5259452b88941a1.proxy.spectrocloud.com:443
    name: example-server
  contexts:
  # The remainder configuration is omitted for brevity.
  ```

- Any requests to the Kubernetes API server, such as kubectl commands, will be routed to the reverse proxy. The reverse proxy forwards the request to the intended client, which is the cluster's API server. The cluster's API server authenticates the request and replies with the proper response.


You can attach this pack to a cluster profile. For more information, refer to [Cluster Profiles](../profiles/cluster-profiles/cluster-profiles.md). The pack installs the Spectro Proxy client in the workload clusters and configures the cluster's API server to point to a managed proxy server.

<br />

:::info

This pack can be combined with the [Kubernetes dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) pack to expose the Kubernetes dashboard. To learn more about exposing the Kubernetes dashboard, check out the [Enable Kubernetes Dashboard](../clusters/cluster-management/kubernetes-dashboard.md) guide.

:::

<br />

## Network Connectivity


The host cluster's network configuration defines who can access the host cluster from a network perspective. If a user is in the same network as the cluster, the user may be able to access the host cluster without needing a forward proxy. However, if the user is on a different network, the host cluster's network configuration may limit the user's ability to connect to the host cluster and may require the use of a forward proxy. 

From a network configuration perspective, a cluster can be in a private or a public network. Host clusters deployed in a network that does not allow inbound internet access are considered private. Whereas the clusters deployed in a network with both inbound and outbound access to the internet are considered public. The following are the three possible network connectivity scenarios:

<br />

* The cluster and the user are in the same private network.


* The cluster and the user are in different private networks. 


* The cluster is in a public network.

<br />

![An overview of the three different connectivity scenarios](/integrations_frp_conection_overview.png)

<br />


The following table summarizes the network connectivity requirements for each scenario and whether the Spectro Proxy is required.

<br />

| **Scenario** | **Description** | **Requires Spectro Proxy?** |
|----------|-------------|------------------------|
| Private cluster in the same network | The cluster is deployed with a private endpoint, and the user is also in the same network. | ❌ |
| Private cluster in a different network | The cluster is deployed with a private endpoint, and the user is in a different network. | ✅ |
| Public cluster in a different network | The cluster is deployed with a public endpoint, and the user is in a different network. | ❌ |

<br />

To learn more about how the Spectro Proxy interacts with clusters in a public or private network environment and when the Spectro Proxy is required, select the tab that matches your use case.


<br />

<Tabs queryString="network-path">


<TabItem label="Private Cluster in Different Network" value="private-cluster-diff-network">


Networks labeled as private do not allow inbound internet access. Inbound network requests to the network are allowed only if the connection originated from the internal network. If you are in a different network than the cluster, you can connect to the cluster's API server through the Spectro Proxy. The Spectro Proxy allows you to connect to the cluster's API server although you are not in the same network as the cluster. 


<br />

:::caution

Users that are in a different network than the cluster require the Spectro Proxy server to connect to the cluster's API server. Otherwise, requests to the cluster's API server will fail due to a lack of network connectivity.

:::


The Spectro Proxy client is installed by the Spectro Proxy pack. The client is deployed in the cluster and connects to the Spectro Proxy server. The Spectro Proxy server is a managed service that is publicly available and managed by Spectro Cloud. The Spectro Proxy server forwards the request to the cluster's API server. The cluster's API server authenticates the request and replies with the proper response.  

The kubeconfig files generated for the host cluster are updated with the Spectro Proxy server's address. When you or other users issue a kubectl command, the request is routed to the Spectro Proxy server. The following is an example of a kubeconfig file where the SSL certificate and server address attribute point to the Spectro Proxy.


The following diagram displays the network connection flow of a user attempting to connect to a cluster with private endpoints. The user is in a different network than the cluster.

<br />

1. The user issues a kubectl command to the cluster's API server.


2. The request is routed to the Spectro Proxy server. The Spectro Proxy client inside the host cluster has an established connection with the cluster's API server.


3. The Spectro Proxy server forwards the request to the cluster's API server located in a different network. The cluster's API server authenticates the request and replies with the proper response.


![Private cluster in a different network.](/integrations_frp_conection_private-different-network.png)

Depending on what type of infrastructure provider you are deploying the host cluster in, you may have to specify the Spectro Proxy server's SSL certificate in the Kubernetes cluster's configuration. Refer to the [Usage](#usage) section below for more information.


</TabItem>





<TabItem label="Private Cluster in Same Network" value="private-cluster-same-network">

Networks labeled as private do not allow inbound internet access. Inbound network requests to the network are allowed only if the connection originated from the internal network. If you are in the same network as the cluster, you can connect directly to the cluster's API server. The term "same network" means that from a network perspective, requests can reach the cluster's API server without having to traverse the internet. 


<br />

:::info

Users in the same network as the cluster do not require the Spectro Proxy server to connect to the cluster's API server.

:::

![Private cluster in the same network.](/integrations_frp_conection_private-same-network.png)



</TabItem>

<TabItem label="Public Cluster" value="public-cluster">


Clusters deployed in a network with both inbound and outbound access to the internet are considered public. 

<br />

:::info

 Clusters deployed in a public network do not require the Spectro Proxy to connect to the cluster's API server.

:::

When a cluster has public endpoints, you can query the cluster's Kubernetes API server from any network with internet access.  The following diagram displays the network connection flow of a user attempting to connect to a cluster with public endpoints. Any user with access to the internet can connect to the cluster's API server.

![A public cluster connection path](/integrations_frp_conection_public_connection.png)



</TabItem>


</Tabs>

----


<br />

## Versions Supported

<Tabs queryString="versions">

<TabItem label="1.3.x" value="1.3.x">

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


The VMware dashboard integration supports the following parameters.


| Parameter       | Description                                 | Default |
|-----------------|---------------------------------------------|---------|
| enabled         |  Enable the dashboard.                      | `false` |


## Usage

To use this pack, you have to add it to your cluster profile.  You can also add the Spectro Proxy pack when you create the cluster profile. Check out the [Create Cluster Profile](../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md) guide to learn more about cluster profile creation.

Depending on the type of cluster, the usage guidance varies. Select the tab that corresponds to the kind of cluster you have. Use the following definitions to help you identify the type of cluster.

<br />


- **Palette Deployed**: A brand new IaaS cluster that is deployed or will be deployed through Palette. An IaaS cluster is a Kubernetes cluster with a control plane that is not managed by a third party or cloud vendor but is completely managed by Palette. Google GKE and Tencent TKE fall into this category. Clusters in this category get an additional entry in the Kubernetes configuration that adds the reverse proxy certificate (CA) to the API server configuration.

<br />

- **Imported Cluster**: An imported cluster or a non-IaaS cluster with a control plane that a third party manages. Azure AKS and AWS EKS fall in this category, as both Palette and the cloud provider partially manage the clusters. Clusters that fall under this category get the default kubeconfig  CA replaced with the CA from the proxy server. Additionally, the kubeconfig authentication method is changed to a bearer token. To support the bearer token method, a new service account is created in the cluster with a role binding that allows Kubernetes API requests to pass through the reverse proxy and connect with the cluster API server.


<Tabs>

<TabItem label="Palette Deployed" value="palette-deployed">


<br />

:::caution


Be aware that if this pack is added as a Day-2 operation, meaning not during the cluster creation process, you will have to re-download the kubeconfig file to pick up the new configuration changes. This will also result in Kubernetes control plane nodes getting repaved.

:::

Add the following extra certificate Subject Alternative Name (SAN) value to the Kubernetes pack under the `kubeadmconfig.apiServer` parameter section.

<br />

```yaml
certSANs:
  - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```


The following is an example configuration of the Kubernetes Pack manifest getting updated with the certificate SAN value:

![frp-cert-san-example](/docs_integrations_frp_cert-san-example.png)


For RKE2 and k3s edge-native clusters, add the following configuration to the Kubernetes pack under the `cluster.config` parameter section.
<br />

```yaml
tls-san:
  - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

![TLS-SAN configuration example](/docs_integrations_frp_tls-san-example.png)

<br />


</TabItem>
<TabItem label="Imported Cluster" value="imported-cluster">

<br />

:::caution


Be aware that if this pack is added as a Day-2 operation, meaning not during the cluster creation process, you will have to re-download the kubeconfig file to pick up the new configuration changes.

:::


Add the Spectro Proxy pack to a cluster profile without making any configuration changes. Use the pack as is.

<br />

:::info

Set the parameter `k8sDashboardIntegration.enabled` to true if you intend to expose the Kubernetes dashboard.
Review the [Enable Kubernetes Dashboard](spectro-k8s-dashboard.md) guide for more information.

:::

</TabItem>

</Tabs>




</TabItem>


<TabItem label="1.2.x" value="1.2.x">

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

To use this pack, you have to add it to your cluster profile.  You can also add the Spectro Proxy pack when you create the cluster profile. Check out the [Create Cluster Profile](../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md) guide to learn more about cluster profile creation.

Depending on the type of cluster, the usage guidance varies. Select the tab that corresponds to the kind of cluster you have. Use the following definitions to help you identify the type of cluster.

<br />


- **Palette Deployed**: A brand new IaaS cluster that is deployed or will be deployed through Palette. An IaaS cluster is a Kubernetes cluster with a control plane that is not managed by a third party or cloud vendor but is completely managed by Palette. Google GKE and Tencent TKE fall into this category. Clusters in this category get an additional entry in the Kubernetes configuration that adds the reverse proxy certificate (CA) to the API server configuration.

<br />

- **Imported Cluster**: An imported cluster or a non-IaaS cluster with a control plane that a third party manages. Azure AKS and AWS EKS fall in this category, as both Palette and the cloud provider partially manage the clusters. Clusters that fall under this category get the default kubeconfig  CA replaced with the CA from the proxy server. Additionally, the kubeconfig authentication method is changed to a bearer token. To support the bearer token method, a new service account is created in the cluster with a role binding that allows Kubernetes API requests to pass through the reverse proxy and connect with the cluster API server.


<Tabs>

<TabItem label="Palette Deployed" value="palette-deployed">


<br />

:::caution


Be aware that if this pack is added as a Day-2 operation, meaning not during the cluster creation process, you will have to re-download the kubeconfig file to pick up the new configuration changes. This will also result in Kubernetes control plane nodes getting repaved.

:::

Add the following extra certificate Subject Alternative Name (SAN) value to the Kubernetes pack under the `kubeadmconfig.apiServer` parameter section.

<br />

```yaml
certSANs:
  - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

The following is an example configuration of the Kubernetes Pack manifest getting updated with the certificate SAN value:

![frp-cert-san-example](/docs_integrations_frp_cert-san-example.png)


For RKE2 and k3s edge-native clusters, add the following configuration to the Kubernetes pack under the `cluster.config` parameter section.
<br />

```yaml
tls-san:
  - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

![TLS-SAN configuration example](/docs_integrations_frp_tls-san-example.png)

<br />


</TabItem>
<TabItem label="Imported Cluster" value="imported-cluster">

<br />

:::caution


Be aware that if this pack is added as a Day-2 operation, meaning not during the cluster creation process, you will have to re-download the kubeconfig file to pick up the new configuration changes.

:::


Add the Spectro Proxy pack to a cluster profile without making any configuration changes. Use the pack as is.

<br />

:::info

Set the parameter `k8sDashboardIntegration.enabled` to true if you intend to expose the Kubernetes dashboard.
Review the [Enable Kubernetes Dashboard](spectro-k8s-dashboard.md) guide for more information.

:::

</TabItem>

</Tabs>




</TabItem>
<TabItem label="1.1.x" value="1.1.x">


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

To use this pack, you have to add it to your cluster profile.  You can also add the Spectro Proxy pack when you create the cluster profile. Check out the [Create Cluster Profile](../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md) guide to learn more about cluster profile creation.

Depending on the type of cluster, the usage guidance varies. Select the tab that corresponds to the kind of cluster you have. Use the following definitions to help you identify the type of cluster.

<br />


- **Palette Deployed**: A brand new IaaS cluster that is deployed or will be deployed through Palette. An IaaS cluster is a Kubernetes cluster with a control plane that is not managed by a third party or cloud vendor but is completely managed by Palette. Google GKE and Tencent TKE fall into this category. Clusters in this category get an additional entry in the Kubernetes configuration that adds the reverse proxy certificate (CA) to the API server configuration.

<br />

- **Imported Cluster**: An imported cluster or a non-IaaS cluster with a control plane that a third party manages. Azure AKS and AWS EKS fall in this category, as both Palette and the cloud provider partially manage the clusters. Clusters that fall under this category get the default kubeconfig  CA replaced with the CA from the proxy server. Additionally, the kubeconfig authentication method is changed to a bearer token. To support the bearer token method, a new service account is created in the cluster with a role binding that allows Kubernetes API requests to pass through the reverse proxy and connect with the cluster API server.


<Tabs>

<TabItem label="Palette Deployed" value="palette-deployed">


<br />

:::caution


Be aware that if this pack is added as a Day-2 operation, meaning not during the cluster creation process, you will have to re-download the kubeconfig file to pick up the new configuration changes. This will also result in Kubernetes control plane nodes getting repaved.

:::

Add the following extra certificate Subject Alternative Name (SAN) value to the Kubernetes pack under the `kubeadmconfig.apiServer` parameter section.

<br />

```yaml
certSANs:
  - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

The following is an example configuration of the Kubernetes Pack manifest getting updated with the certificate SAN value:

![frp-cert-san-example](/docs_integrations_frp_cert-san-example.png)


For RKE2 and k3s edge-native clusters, add the following configuration to the Kubernetes pack under the `cluster.config` parameter section.
<br />

```yaml
tls-san:
  - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

![TLS-SAN configuration example](/docs_integrations_frp_tls-san-example.png)

<br />


</TabItem>
<TabItem label="Imported Cluster" value="imported-cluster">

<br />

:::caution


Be aware that if this pack is added as a Day-2 operation, meaning not during the cluster creation process, you will have to re-download the kubeconfig file to pick up the new configuration changes.

:::


Add the Spectro Proxy pack to a cluster profile without making any configuration changes. Use the pack as is.

<br />

:::info

Set the parameter `k8sDashboardIntegration.enabled` to true if you intend to expose the Kubernetes dashboard.
Review the [Enable Kubernetes Dashboard](spectro-k8s-dashboard.md) guide for more information.

:::

</TabItem>

</Tabs>




</TabItem>
<TabItem label="1.0.x" value="1.0.x">

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


## Usage

To use this pack, you have to add it to your cluster profile.  You can also add the Spectro Proxy pack when you create the cluster profile. Check out the [Create Cluster Profile](../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md) guide to learn more about cluster profile creation.

Depending on the type of cluster, the usage guidance varies. Select the tab that corresponds to the kind of cluster you have. Use the following definitions to help you identify the type of cluster.

<br />


- **Palette Deployed**: A brand new IaaS cluster that is deployed or will be deployed through Palette. An IaaS cluster is a Kubernetes cluster with a control plane that is not managed by a third party or cloud vendor but is completely managed by Palette. Google GKE and Tencent TKE fall into this category. Clusters in this category get an additional entry in the Kubernetes configuration that adds the reverse proxy certificate (CA) to the API server configuration.

<br />

- **Imported Cluster**: An imported cluster or a non-IaaS cluster with a control plane that a third party manages. Azure AKS and AWS EKS fall in this category, as both Palette and the cloud provider partially manage the clusters. Clusters that fall under this category get the default kubeconfig  CA replaced with the CA from the proxy server. Additionally, the kubeconfig authentication method is changed to a bearer token. To support the bearer token method, a new service account is created in the cluster with a role binding that allows Kubernetes API requests to pass through the reverse proxy and connect with the cluster API server.


<Tabs>

<TabItem label="Palette Deployed" value="palette-deployed">


<br />

:::caution


Be aware that if this pack is added as a Day-2 operation, meaning not during the cluster creation process, you will have to re-download the kubeconfig file to pick up the new configuration changes. This will also result in Kubernetes control plane nodes getting repaved.

:::

Add the following extra certificate Subject Alternative Name (SAN) value to the Kubernetes pack under the `kubeadmconfig.apiServer` parameter section.
<br />

```yaml
certSANs:
  - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

The following is an example configuration of the Kubernetes Pack manifest getting updated with the certificate SAN value:

![frp-cert-san-example](/docs_integrations_frp_cert-san-example.png)



For RKE2 and k3s edge-native clusters, add the following configuration to the Kubernetes pack under the `cluster.config` parameter section.
<br />

```yaml
tls-san:
  - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```

![TLS-SAN configuration example](/docs_integrations_frp_tls-san-example.png)

<br />


</TabItem>
<TabItem label="Imported Cluster" value="imported-cluster">

<br />

:::caution


Be aware that if this pack is added as a Day-2 operation, meaning not during the cluster creation process, you will have to re-download the kubeconfig file to pick up the new configuration changes.

:::


Add the Spectro Proxy pack to a cluster profile without making any configuration changes. Use the pack as is.

<br />

:::info

Set the parameter `k8sDashboardIntegration.enabled` to true if you intend to expose the Kubernetes dashboard.
Review the [Enable Kubernetes Dashboard](spectro-k8s-dashboard.md) guide for more information.

:::

</TabItem>

</Tabs>


</TabItem>
</Tabs>


## Troubleshooting

Troubleshooting scenarios related to the Spectro Proxy.
<br />

### x509 Unknown Authority Error

If you encounter an x509 unknown authority error when deploying a cluster with the Spectro Proxy.

<br />

```hideClipboard shell 
Unable to connect to connect the server: X509: certiticate signed by unknown authorit signed by
```

The workaround for this error is to wait a few moments for all the kubeconfig configurations to get propagated to Palette. The Palette cluster agent sends the original kubeconfig to Palette, followed by the modified kubeconfig containing the reverse proxy settings. If you attempt to open up a web shell session or interact with cluster API during the initialization process, you will receive an x509 error. Once Palette receives the kubeconfig file containing the cluster's reverse proxy configurations from the cluster agent, the x509 errors will disappear.


## Terraform

You can reference the Spectro Proxy pack in Terraform with a data resource.

```hcl
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

- [Enable Kubernetes Dashboard](../clusters/cluster-management/kubernetes-dashboard.md)


- [Terraform Data Resource](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/data-sources/pack)