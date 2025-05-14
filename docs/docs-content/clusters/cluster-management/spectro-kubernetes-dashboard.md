---
sidebar_label: Spectro Kubernetes Dashboard"
title: "Spectro Kubernetes Dashboard"
description: "How to Setup the Spectro Kubernetes Dashboard with Spectro Proxy"
hiddenFromNav: false
sidebar_position: 210
tags: ["clusters", "cluster management", "k"]
---

The **Spectro Kubernetes Dashboard** is a customized version of the open source [Kubernetes Dashboard](https://github.com/kubernetes/dashboard) project. Kubernetes Dashboard is a general purpose, web-based UI for Kubernetes clusters. It allows users to manage applications and troubleshoot applications, as well as manage the cluster itself.

## Prerequisites

- An active Palette cluster. This tutorial builds upon steps in. Complete the steps for your preferred cloud provider if you need to build a cluster.
  - [Deploy a Cluster with Azure](/getting-started/azure/deploy-k8s-cluster.md)
  - [Deploy a Cluster with AWS](/getting-started/aws/deploy-k8s-cluster.md)
  - [Deploy a Cluster with GCP](/getting-started/gcp/deploy-k8s-cluster.md)
  - [Deploy a Cluster with VMware](/getting-started/vmware/deploy-k8s-cluster.md)

- kubectl 

## Enablement

1. In Palette, select **Clusters** from the left Main Menu. Select the name of the cluster you want to provision the _Spectro Kubernetes Dashboard_ on.

2. Select the **Profiles** and identify the name of the profile your cluster is using.

![Image of the Palette UI, cluster overview screen with the profile name called out](clusters_cluster-management_spectro-kubernetes-dashboard_cluster-profile-name.webp)

3. Select **Profiles** from the left Main Menu. Select the cluster profile the cluster you wish to upgrade is using.

4. Select **Create new version** from the drop down menu.

5. Select **Add New Pack**

6. Search for _Spectro Kubernetes Dashboard_ in the Search field.

![Image of the pack search screen with the search result shown](clusters_cluster-management_spectro-kubernetes-dashboard_select-dashboard-pack.webp)

7. The _Spectro Kubernetes Dashboard_ pack exists in multiple registries. We recommend selecting the most recent pack version available in the _Palette Registry_ if allowed by your organizations security policies. Select your desired pack version, then select **Confirm**

![Image of the pack showing multiple registries](clusters_cluster-management_spectro-kubernetes-dashboard_pack-registry-select.webp)

8. 

Use the steps in the [Update Clusters](/tutorials/clusters/cluster-management/update-maintain/update-k8s-cluster.md) using the method of your choice to add the _Spectro Kubernetes Dashboard_ pack to your cluster profile and apply the new profile version to your cluster.









## Validate



<!-- prettier-ignore -->
Use the <VersionedLink text="Spectro Kubernetes Dashboard" url="/integrations/packs/?pack=spectro-k8s-dashboard" /> pack to add the Kubernetes dashboard
to your cluster. The pack documentation page has instructions on how to configure and use the dashboard.

![Kubernetes dashboard login page](/integrations_spectro-k8s-dashboard_dashboard-page.webp)