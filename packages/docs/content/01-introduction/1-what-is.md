---
title: "What is Spectro Cloud?"
metaTitle: "About Spectro Cloud"
metaDescription: "Most important concepts of Spectro Cloud"
icon: ""
hideToC: true
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# What is Spectro Cloud?

Spectro Cloud management platform brings the managed Kubernetes experience to users' own unique enterprise Kubernetes infrastructure stacks running in any public cloud, or private cloud environments, allowing users to not have to trade-off between flexibility and manageability. Spectro Cloud provides an as-a-service experience to users by automating the lifecycle of multiple Kubernetes clusters based on user-defined Kubernetes infrastructure stacks.

Spectro Cloud consists of three main components: the management console, a pack registry, and the management agent running inside workload clusters. 

## Management Console
Spectro Cloud management console provides centralized visibility and management of Spectro Cloud provisioned workload clusters. It provides a single pane of glass for users to define composable Kubernetes cluster profile templates, deploy and manage Kubernetes clusters with full visibility in multi-cloud environments, as well as manage the governance policies to control who can do what, when and where.

## Pack Registry
Specto Cloud cluster profiles are templates that describe various integrations/technologies for each layer of the kubernetes infrastructure stack. These integrations are modeled as packs that are hosted on a pack registry. Spectro Cloud provides several integrations out of the box which are hosted on a default pack registry. Security patches and updates are maintained for all out of the box packs. Optionally users can also host packs on their self-hosted pack registry.

## Management Agent
The Spectro Cloud Management Agent which runs inside workload clusters is responsible for:
* Communicating with the management console for the heartbeat, cluster status, and system metrics.
* Synschronizing the desired cluster state with the running workload cluster.



![spectro_cloud](/spectro_cloud.png)
