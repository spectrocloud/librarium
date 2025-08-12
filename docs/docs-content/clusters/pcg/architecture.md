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
necessary in environments where Palette does not have direct network access. Many infrastructure environments are placed
in a private network that blocks connections originating externally. The PCG connects to Palette, and acts as an
endpoint, allowing you to target the environment when deploying clusters in Palette.

When installed, the PCG registers with the self-hosted or SaaS Palette instance you specify, enabling secure
communication between the Palette management plane and the private cloud environment. The PCG enables the deployment and
removal of Kubernetes clusters in private cloud environments through the Palette user interface, API, CLI, or Terraform
provider.

![An architecture diagram of PCG](/clusters_pcg_architecture_overview_diagram.webp)

## Network Communication

The PCG maintains a connection to Palette and directly connects to the infrastructure environment. The connection to
Palette originates from the PCG, and the PCG acts as an endpoint for Palette to communicate with the infrastructure
environment. The PCG also supports using a proxy server to access the internet if needed. The PCG is constantly polling
Palette instructions to either deploy a new cluster or delete an existing one.

The PCG communicates with Palette using a secure communication channel that is encrypted using the Transport Layer
Security (TLS) protocol. The table below lists the network ports and protocols the PCG uses to communicate with Palette
and the infrastructure environment.

| Port | Protocol | Source | Destination   | Description                                                                                                                                                                                |
| ---- | -------- | ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 443  | HTTPS    | PCG    | Palette       | Secure communication channel between PCG and Palette.                                                                                                                                      |
| 443  | gRPC     | PCG    | Palette       | Secure communication channel between PCG and Palette.                                                                                                                                      |
| 443  | HTTPS    | PCG    | Local Network | Secure communication channel between PCG and infrastructure provider in local network. For example, if you are using VMware vSphere, the PCG would communicate with your vSphere endpoint. |
| 6443 | HTTPS    | PCG    | Local Network | Secure communication channel between PCG and the deployed Kubernetes cluster API server.                                                                                                   |

:::info

To establish communication between the PCG and Palette, the PCG initiates all network communication to Palette.
Similarly, when deploying workload clusters, the cluster initiates all network communication to Palette. To deploy the
PCG successfully, you must provide the Palette endpoint, which helps the PCG know where to connect. This information is
also shared with the workload cluster during the cluster deployment.

:::

### Network Proxy

The PCG supports using a proxy server to access the internet if needed.

We encourage you to review the [gRPC and Proxies](../../architecture/grps-proxy.md) reference page to better prepare for
using a proxy server with the PCG. Depending on your network proxy configuration and software, you may need to make
updates to ensure compatibility with Palette.

#### Palette CLI

If you are installing the PCG through the Palette CLI, you can provide the proxy server details during installation. The
proxy server details are saved as environment variables (`HTTPS_PROXY`, `HTTP_PROXY`, and `NO_PROXY`) and are propagated
to all PCG cluster nodes, as well as the nodes of all tenant workload clusters deployed with the PCG. The provided proxy
servers are then used by the PCG and workload clusters to access the internet.

You can also provide Certificate Authority (CA) certificates for the proxy server during installation. However, proxy CA
certificates are only propagated to each PCG cluster node; they are not propagated to the nodes of tenant clusters.
Proxy CA certificates must be added to workload clusters at the tenant level or cluster profile level in the OS layer.
If configured at the tenant level, _all_ workload clusters provisioned from the tenant, with the exception of managed
Kubernetes clusters (EKS, AKS, and GKE) and Edge clusters, will have the CA certificate injected into their cluster
nodes; if configured at the cluster profile level, only workload clusters deployed using the cluster profile will be
injected with the CA certificate.

#### Existing Kubernetes Cluster

A PCG installed onto an existing Kubernetes cluster will inherit the proxy server configuration from the underlying
Kubernetes cluster. Contact your Kubernetes administrator for the proxy server details and guidance on configuring the
underlying Kubernetes cluster to use a proxy server if needed.

## Cluster Lifecycle Support

The PCG supports the lifecycle of Kubernetes clusters deployed in your private cloud environments. When you initiate a
cluster deployment, the PCG cluster is used to support communication with the infrastructure environment. The PCG will
query Palette for instructions to deploy a new cluster or delete an existing one.

When a cluster deployment is initiated, the PCG will request resources from the infrastructure provider and support the
cluster deployment process. Once a cluster is deployed, the PCG is no longer involved in the communication between
Palette and the deployed cluster. The cluster will communicate with Palette directly through local network gateways or a
proxy server. The workload cluster is self-sustaining and does not require the PCG to be operational.

For every workload cluster that a PCG facilitates deployment, the workload cluster will maintain a reference point back
to that PCG. This reference point is used to identify the PCG used in the event of a cluster deletion. The mapping
between a workload cluster and a PCG is stored in the Palette management plane.

A PCG can be migrated. Migrated means that all clusters deployed by the original PCG will be updated to reference a
different PCG. This action is internal to the Palette management plane. The migration process is necessary when you want
to remove an existing PCG. Refer to the [Migrate a PCG](./manage-pcg/migrate_pcg.md) for guidance on migrating a PCG.

<details>
  <summary>Cluster API State Management with PCG</summary>

During a cluster deployment, the PCG uses the [Cluster API (CAPI)](https://cluster-api.sigs.k8s.io) to interact with the
infrastructure provider to deploy the cluster. Once the cluster is deployed, the CAPI state management is pivoted to the
workload cluster as a dedicated service. The workload cluster, through the Palette agent, is then responsible for
managing its own lifecycle operations. The PCG is not involved in managing the workloads of the deployed cluster.

In the event of a cluster deletion, the CAPI state management is pivoted back to the PCG, and CAPI begins the cluster
deletion process to release the resources used by the workload cluster. The pivot process uses the PCG reference point
to correctly identify which PCG to move the CAPI state management back to.

</details>

The following table explains the different lifecycle phases of a workload cluster and the PCG involvement.

| Lifecycle Phase            | PCG Involvement? | Description                                                                                                                                                                                                                                             |
| -------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster Creation           | ✅               | The PCG is involved in the cluster creation process. The PCG polls Palette for new cluster deployment requests. Once a request is received, the PCG will request resources from the infrastructure provider and support the cluster deployment process. |
| Managing Cluster Workloads | ❌               | The local Palette agent inside the cluster manages the cluster workloads. The PCG is not involved in managing the workloads of the deployed cluster.                                                                                                    |
| Day-2 Operations           | ❌               | The PCG is not involved in Day-2 operations. The internal [Cluster API](https://cluster-api.sigs.k8s.io/) service handles interactions with the local infrastructure provider.                                                                          |
| Cluster Deletion           | ✅               | The PCG is involved in the cluster deletion process. The PCG will request the infrastructure provider to release the resources used by the cluster.                                                                                                     |

## Operating System

The PCG is deployed with [Canonical Ubuntu](https://ubuntu.com/) as the Operating System (OS). You can use Ubuntu Pro
when installing the PCG through the Palette CLI. Ubuntu Pro is a premium Ubuntu version with additional security and
compliance features. You must provide a Ubuntu Pro subscription token to use Ubuntu Pro with the PCG. The version of
Ubuntu varies based on the Palette release and the PCG version, but each Ubuntu version is an LTS release.

If you are installing a PCG onto an [existing Kubernetes cluster](./deploy-pcg-k8s.md), then the OS of the PCG will be
the same as the underlying Kubernetes cluster.

The default user name for a PCG node deployed through the Palette CLI is `spectro`. If you need to establish a Secure
Shell Session (SSH) with a PCG node, use the private SSH key that matches the public key you provided during the PCG
installation process. For PCG nodes deployed onto an existing Kubernetes cluster, the default user name is dictated by
the configuration of the underlying Kubernetes cluster. Contact your Kubernetes administrator for the default user name
and guidance on establishing an SSH session.

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
originates all communication, so the network requests are outbound toward Palette. The exception is a host cluster
creation or deletion request, where the PCG must be involved because it needs to acquire and release resources provided
by the infrastructure provider.

Typically, the PCG is used with Palette SaaS. However, a PCG is also required if you have a self-hosted Palette instance
and it does not have direct access to the infrastructure environment. You can utilize the System Private Gateway if
there is direct network connectivity access with the target environment. Refer to the
[System Private Gateway](#system-private-gateway) section to learn more.

### System Private Gateway

A System Private Gateway can be used if a self-hosted Palette instance can communicate directly with resources inside a
private cloud environment. A System Private Gateway is a PCG service that is enabled inside the self-hosted Palette
instance.

:::warning

Only self-hosted Palette or VerteX instances support using the System Private Gateway. Use the default
[PCG deployment](#private-cloud-gateway) option if you have NAT gateways or network firewalls between Palette and your
compute environment.

:::

The following table explains the different use cases for when a PCG or a System Private Gateway is supported.

| Scenario                                                                                      | Use Private Cloud Gateway? | Use System Private Gateway? |
| --------------------------------------------------------------------------------------------- | -------------------------- | --------------------------- |
| Firewall or NAT between the infrastructure environment and a self-hosted Palette instance     | ✅                         | ❌                          |
| Direct connectivity between the infrastructure environment and a self-hosted Palette instance | ✅                         | ✅                          |
| Firewall or NAT between the infrastructure environment and Palette SaaS                       | ✅                         | ❌                          |
| Direct connectivity between Palette SaaS and the infrastructure environment                   | ✅                         | ❌                          |

#### How to Use System Private Gateway?

To use the System Private Gateway with a self-hosted Palette instance, you must toggle the **Use System Private
Gateway** option while registering a private cloud account with Palette. This option is only available from the Palette
user interface for private cloud environments such as MAAS, OpenStack, and VMware vSphere.

![View of the cloud account registration screen with the system PCG check box highlighted](/clusters_pcg_architecture_system-pcg-ui.webp)
