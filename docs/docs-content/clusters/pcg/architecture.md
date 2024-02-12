---
sidebar_label: "Architecture"
title: "Architecture"
description:
  "Learn about the architecture of the Private Cloud Gateway (PCG) and how it supports Palette and VerteX deployments."
hide_table_of_contents: false
sidebar_position: 10
tags: ["pcg"]
---

A Private Cloud Gateway (PCG) facilitates communication between Palette and your infrastructure environment. The PCG is
necessary in environments where Palette does not have direct network access. Many infrastructure environments are in a
private network that block connections originating externally. The PCG connects to Palette, and acts as an endpoint,
allowing you to target the environment when deploying clusters in Palette.

When the PCG is installed, it registers itself with the Palette instance specified by you, either self-hosted, or SaaS,
and enables secure communication between the Palette control management plane and the private cloud environment. The PCG
enables deployment and removal of Kubernetes clusters in private cloud environments through the Palette user interface,
API, CLI, or Terraform provider.

![An architecture diagram of PCG](/clusters_pcg_architecture_overview_diagram.png)

## Network Communication

The PCG maintains a connection to Palette and directly connects to the infrastructure environment. The connection to
Palette originates from the PCG, and the PCG acts as an endpoint for Palette to communicate with the infrastructure
environment. The PCG also supports using a proxy server to access the internet if needed. The PCG is constantly polling
Palette instructions, to either deploy a new cluster or to delete an existing cluster.

The PCG communicates with Palette using a secure communication channel that is encrypted using TLS. The table below
lists the network ports and protocols used by the PCG to communicate with Palette and the infrastructure environment.

| Port | Protocol | Source | Destination   | Description                                                                                                                                                                                |
| ---- | -------- | ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 443  | HTTPS    | PCG    | Palette       | Secure communication channel between PCG and Palette.                                                                                                                                      |
| 443  | gRPC     | PCG    | Palette       | Secure communication channel between PCG and Palette.                                                                                                                                      |
| 443  | HTTPS    | PCG    | Local Network | Secure communication channel between PCG and infrastructure provider in local network. For example, if you are using VMware vSphere, the PCG would communicate with your vSphere endpoint. |
| 6443 | HTTPS    | PCG    | Local Network | Secure communication channel between PCG and deployed Kubernetes cluster API server.                                                                                                       |

:::info

To establish communication between PCG and Palette, PCG initiates all network communication to Palette. Similarly, when
deploying workload clusters, the workload cluster initiates all network communication to Palette. To deploy PCG
successfully, you must provide the Palette endpoint, which helps PCG know where to connect. This information is also
shared with the workload cluster during the cluster deployment process.

:::

## Cluster Lifecycle Support

The PCG supports the lifecycle of Kubernetes clusters deployed in your private cloud environments. When you initiate a
cluster deployment, the PCG cluster is used to support communication with the infrastructure environment. The PCG will
query Palette for instructions to deploy a new cluster or delete an existing cluster.

When a cluster deployment is initiated, the PCG will request resources from the infrastructure provider and support the
cluster deployment process. Once a cluster is deployed, the PCG is no longer involved in the communication between
Palette and the deployed cluster. The cluster will communicate with Palette directly through local network gateways or
proxy server. The workload cluster is self-sustaining and does not require the PCG to be operational.

<details>
  <summary>Cluster API State Management With PCG</summary>

During a cluster deployment, the PCG uses the Cluster API (CAPI) to interact with the infrastructure provider to deploy
the cluster. Once the cluster is deployed, the CAPI state management is pivoted to the workload cluster as a dedicated
service. The workload cluster, through the Palette agent, is then responsible for managing its own lifecycle operations.
The PCG is not involved in managing the workloads of the deployed cluster.

In the event of a cluster deletion, the CAPI state management is pivoted back to the PCG and CAPI begins the cluster
deletion process to releases the resources used by the workload cluster.

</details>

The following table explains the different lifecycle phases of a workload cluster and the PCG involvement.

| Lifecycle Phase            | PCG Involvement? | Description                                                                                                                                                                                                                                             |
| -------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster Creation           | ✅               | The PCG is involved in the cluster creation process. The PCG polls Palette for new cluster deployment requests. Once a request is received, the PCG will request resources from the infrastructure provider and support the cluster deployment process. |
| Managing Cluster Workloads | ❌               | The local Palette agent inside the cluster is responsible for managing the cluster workloads. The PCG is not involved in managing the workloads of the deployed cluster.                                                                                |
| Day-2 Operations           | ❌               | The PCG is not involved in Day-2 operations. Any interaction with the local infrastructure provider is handled by the internal [Cluster API](https://cluster-api.sigs.k8s.io/) service.                                                                 |
| Cluster Deletion           | ✅               | The PCG is involved in the cluster deletion process. The PCG will request the infrastructure provider to release the resources used by the cluster.                                                                                                     |

## PCG Deployment Options

A PCG comes in two flavors: Private Cloud Gateway and System Private Gateway.

- **Private Cloud Gateway** - An infrastructure resource that is deployed into a private cloud environment using the
  Palette CLI or manually onto an existing Kubernetes cluster. The PCG maintains a connection to Palette and directly
  connects to the infrastructure environment. The PCG also supports using a proxy server to access the internet if
  needed.

- **System Private Gateway** - A PCG service that is enabled inside a self-hosted Palette instance. The System Private
  Gateway is used when a self-hosted Palette instance can communicate directly with a private cloud environment. If the
  infrastructure environment is behind a firewall or a Network Address Translation (NAT) gateway, then a PCG is required
  inside the infrastructure environment to support communication with Palette.

### Private Cloud Gateway

A PCG is made up of a cluster of nodes that are deployed into a private cloud environment using the Palette CLI or
manually onto an existing Kubernetes cluster. The PCG maintains a connection to Palette and directly connects to the
infrastructure environment.

The direct communication channel allows Palette to create clusters using the PCG to support communication with the local
infrastructure provider's API.

Once Palette deploys clusters, the clusters require connectivity to Palette. The clusters communicate with Palette
directly via a local network gateway, or if a proxy has been configured on the PCG, the clusters will inherit the proxy
configuration. Deployed and active clusters maintain their connectivity with Palette. Any actions taken on these
clusters using Palette will not require PCG participation. This means that if the PCG becomes unavailable, any clusters
that are currently deployed will remain operational and still be managed by Palette.

All Palette deployed clusters will use the PCG cluster during the creation and deletion phase. Once a deployed cluster
is available, the internal Palette agent will communicate with Palette directly. The Palette agent inside each cluster
is the originator of all communication, so the network requests are outbound toward Palette. The exception is a host
cluster creation or deletion request, where the PCG must be involved because it needs to acquire and release resources
provided by infrastructure provider.

Typically, the PCG is used with Palette SaaS. However, a PCG is also required if you have a self-hosted Palette instance
and it does not have direct access to the infrastructure environment. You can utilize the System Private Gateway if
there is direct network connectivity access with the target environment. Refer to the
[System Private Gateway](#system-private-gateway) section to learn more.

### System Private Gateway

A System Private Gateway can be used if a self-hosted Palette instance can communicate directly with resources inside a
private cloud environment. A System Private Gateway is a PCG service that is enabled inside the self-hosted Palette
instance.

:::warning

Only self-hosted Palette or VerteX instances support the option of using the System Private Gateway. Use the default
[PCG deployment](#private-cloud-gateway) option if you have NAT gateways or network firewalls between Palette and MAAS.

:::

When registering a private cloud account with Palette, toggle on **Use System Private Gateway** to enable direct
communication between Palette and the local infrastructure provider. This option is only available to private cloud
environments such as MAAS, OpenStack, and VMware vSphere.

The following table explains the different use cases for when a PCG and System Private Gateway are eligible.

| Scenario                                                                              | Use Private Cloud Gateway | Use System Private Gateway |
| ------------------------------------------------------------------------------------- | ------------------------- | -------------------------- |
| Firewall or NAT between infrastructure environment and a self-hosted Palette instance | ✅                        | ❌                         |
| Direct connectivity between infrastructure environment and a Palette instance         | ✅                        | ✅                         |
