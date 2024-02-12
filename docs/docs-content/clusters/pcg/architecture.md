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
necessary in environments where Palette does not have direct network access. Many infrastructure environments are
typically in a private network that block connections originating externally. The PCG connects to Palette, and acts as
an endpoint, allowing you to target the environment when deploying clusters in Palette.

When the PCG is installed, it registers itself with a Palette instance, either self-hosted, or SaaS, and enables secure
communication between the Palette control management plane and the private cloud environment. The PCG enables
installation and end-to-end lifecycle management of Kubernetes clusters in private cloud environments from the Palette
user interface, API, CLI, or Terraform provider.

![An architecture diagram of PCG](/clusters_pcg_architecture_overview_diagram.png)

## Network Communication

The PCG maintains a connection to Palette and directly connects to the infrastructure environment. The connection to
Palette originates from the PCG, and the PCG acts as an endpoint for Palette to communicate with the infrastructure
environment. The PCG also supports using a proxy server to access the internet if needed. The PCG is constatly polling
Palette for new cluster deployments and updates to the infrastructure environment.

The PCG communicates with Palette using a secure communication channel that is encrypted using TLS. The table below
lists the network ports and protocols used by the PCG to communicate with Palette and the infrastructure environment.

| Port | Protocol | Source | Destination   | Description                                                                                                                                                                                |
| ---- | -------- | ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 443  | HTTPS    | PCG    | Palette       | Secure communication channel between PCG and Palette.                                                                                                                                      |
| 443  | gRPC     | PCG    | Palette       | Secure communication channel between PCG and Palette.                                                                                                                                      |
| 443  | HTTPS    | PCG    | Local Network | Secure communication channel between PCG and infrastructure provider in local network. For example, if you are using VMware vSphere, the PCG would communicate with your vSphere endpoint. |
| 6443 | HTTPS    | PCG    | Local Network | Secure communication channel between PCG and deployed Kubernetes clusters's API server.                                                                                                    |

## PCG Lifecycle Support

The PCG supports the lifecycle of Kubernetes clusters deployed in your private cloud environments. When you initiate a
cluster deployment, the PCG cluster is used to facilitate communication with the infrastructure environment. The PCG
will query Palette for new cluster deployments and updates to the infrastructure environment. When a cluster deployment
is initiated, the PCG will request resources from the infrastructure provider and support the cluster deployment
process. Once a cluster is deployed, the PCG is no longer involved in the communication between Palette and the cluster.
The cluster will communicate with Palette directly through the local network gateway or proxy server.

The PCG will continue to play a support role in Day-2 activities such as scaling nodes, upgrading, and deleting
clusters. In the event of a cluster deletion, the PCG will request the infrastructure provider to release the resources
used by the cluster.

| Lifecycle Phase            | PCG Involvement | Description                                                                                                                                                                                                                                            |
| -------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cluster Creation           | ✅              | The PCG is involved in the cluster creation process. The PCG polls Palettefor new cluster deployment requests. Once a request is received, the PCG will request resources from the infrastructure provider and support the cluster deployment process. |
| Managing Cluster Workloads | ❌              | Once a cluster is deployed, the PCG is no longer involved in the communication between Palette and the cluster. The cluster will communicate with Palette directly through the local network gateway or proxy server.                                  |
| Day-2 Operations           | ✅              | The PCG is involved in Day-2 activities such as scaling nodes, upgrading, and deleting clusters.                                                                                                                                                       |
| Cluster Deletion           | ✅              | The PCG is involved in the cluster deletion process. The PCG will request the infrastructure provider to release the resources used by the cluster.                                                                                                    |

## PCG Deployment Options

A PCG comes in two flavors: Private Cloud Gateway and System Private Gateway.

- **Private Cloud Gateway** - An infrastructure resouce that is deployed into a private cloud environment using the
  Palette CLI or manually onto an existing Kubernetes cluster. The PCG maintains a connection to Palette and directly
  connects to the infrastructure environment. The PCG also supports using a proxy server to access the internet if
  needed.

- **System Private Gateway** - A PCG service that is enabled inside a self-hosted Palette instance. The System Private
  Gateway is used when a self-hosted Palette instance can communicate directly with a private cloud environment. If the
  infrastructure environment is behind a firewall or a Network Address Translation (NAT) gateway, then a stand-alone PCG
  is required inside the infrastructure environment to facilitate communication with Palette.

### Private Cloud Gateway

A PCG is made up of a cluster of nodes that are deployed into a private cloud environment using the Palette CLI or
manually onto an existing Kubernetes cluster. The PCG maintains a connection to Palette and directly connects to the
infrastructure environment.

The PCG will maintain a connection with Palette and directly connect to infrastructure envionment. The direct
communication channel allows Palette to create clusters using the PCG to facilitate communication with MAAS. The PCG
also supports using a proxy server to access the internet if needed.

Once Palette deploys clusters, the clusters require connectivity to Palette. The clusters communicate with Palette
directly via an internet gateway, or if a proxy has been configured on the PCG, the clusters will inherit the proxy
configuration. Deployed and active clusters maintain their connectivity with Palette. Any actions taken on these
clusters using Palette will not require PCG's participation. This means that if the PCG becomes unavailable, any
clusters that are currently deployed will remain operational and still be managed by Palette.

All Palette deployed clusters will use the PCG cluster during the creation and deletion phase. Once a host cluster is
available, the internal Palette agent will communicate with Palette directly. The Palette agent inside each cluster is
the originator of all communication, so the network requests are outbound toward Palette. The exception is a host
cluster creation or deletion request, where the PCG must be involved because it needs to acquire and release resouces
provided by infrastructure provider.

Typically, the PCG is used with Palette SaaS. However, a PCG is also required if you have a self-hosted Palette instance
and it does not have direct access to the infrastructure environment. You can utilize the System Private Gateway if
there is direct network connectivity access with the target environment. Refer to the
[System Private Gateway](#system-private-gateway) section to learn more.

### System Private Gateway

A System Private Gateway can be used if a self-hosted Palette instance can communicate directly with a MAAS
installation. A System Private Gateway is a PCG service that is enabled inside the self-hosted Palette instance.

:::warning

Only self-hosted Palette or VerteX instances support the option of using the System Private Gateway. Use the default
[PCG deployment](#private-cloud-gateway) option if you have NAT gateways or network firewalls between Palette and MAAS.

:::

When registering a MAAS cloud account with Palette, toggle on **Use System Private Gateway** to enable direct
communication between Palette and MAAS.

The following table explains the different use cases for when a PCG and System Private Gateway are eligible.

| Scenario                                                                              | Use Private Cloud Gateway | Use System Private Gateway |
| ------------------------------------------------------------------------------------- | ------------------------- | -------------------------- |
| Firewall or NAT between infrastructure environment and a self-hosted Palette instance | ✅                        | ❌                         |
| Direct connectivity between infrastructure environment and a Palette instance         | ✅                        | ✅                         |
