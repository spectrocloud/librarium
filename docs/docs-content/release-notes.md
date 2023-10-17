---
sidebar_label: "Release Notes"
title: "Release Notes"
description: "Spectro Cloud release notes for Palette and its sub-components."
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 3
sidebar_position: 0
sidebar_custom_props: 
  icon: "audits"
tags: ["release-notes"]
---

## October 23, 2023 - Release 4.1.0

Placeholder for text summary

### Palette

#### Breaking Changes

- API key values are no longer displayed in Palette. Palette will continue to support existing API keys, but will not display the values. Moving forward, Palette will not store the API key value in the database, but instead retain metadata about the key. Ensure you store the API key value in a secure location after its creation as the value will not be retrievable from Palette. To learn more about API keys, refer to the [API Key](user-management/user-authentication.md) documentation.


- Multiple login sessions are no longer supported. If you are logged in to Palette and attempt to log in from another device, you will be logged out of the first session. This change only applies to the Palette User Interface (UI) and does not affect the API.

#### Features


- Support for encrypting the root volume of EKS host clusters is now available. You can enable this feature when creating a host cluster. 


- MAAS clusters can now be assigned tags so that Palette can deploy nodes onto the MAAS machines that match the provided tags.


- Automatic SSL certificate renewal is now supported for clusters deployed through Palette. In the past this was a manual action that had to be performed by the user. Now, Palette will automatically renew the certificate before it expires. All infrastructure providers are supported with the exception of Edge and Cox Edge.


- Self-hosted Palette installations now support the ability to control the node affinity for the Palette components. You can configure the Palette Enterprise cluster to deploy all internal component pods on control plane nodes. To learn more about this feature, refer to the [Self-Hosted Palette](./enterprise-version/install-palette/install-palette.md) documentation.

#### Improvements



### Edge

#### Features

- Edge hosts can now be configured with static IP addresses when added to an Edge cluster. You can configure the default gateway, DNS servers, IP address and the subnet mask for the host.


#### Improvements

- Palette now supports [etcd](https://etcd.io/) backup snapshots of each etcd member in the host cluster. You can use these snapshots to recover a host cluster.


### Palette Dev Engine (PDE)

#### Features

- You can now select a different Kubernetes distribution when creating a cluster group. The two supported distributions are [Kubernetes](https://kubernetes.io/) and [K3s](https://k3s.io/). To learn more about cluster groups, refer to the [Cluster Groups](./clusters/cluster-groups/cluster-groups.md) documentation.


### Virtual Machine Orchestrator (VMO)


### VerteX


#### Features

- Palette VerteX now supports the deployment of Azure IaaS clusters.

- Palette VerteX installations now support the ability to control the node affinity for the Palette components. You can configure the Palette Enterprise cluster to deploy all internal component pods on control plane nodes. To learn more about this feature, refer to the [VerteX](vertex/install-palette-vertex/install-palette-vertex.md) documentation.


#### Improvements

- The use of non-FIPS compliant packs is now supported. Prior versions of VerteX allowed non-FIPS packs for add-on packs. This change now allows non-FIPS packs for all packs.
