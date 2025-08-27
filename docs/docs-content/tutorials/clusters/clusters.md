---
sidebar_label: "Clusters"
title: "Clusters"
description: "Explore cluster deployment and management tutorials."
sidebar_position: 30
hide_table_of_contents: true
sidebar_custom_props:
  icon: "clusters"
tags: ["clusters", "cluster deployment"]
---

In Palette, Kubernetes [clusters](../../clusters/clusters.md) are provisioned from
[cluster profiles](../../profiles/profiles.md), which define the full-stack configuration of the cluster. A cluster
definition includes a reference to a cluster profile, cloud configuration, and specifications for cluster size and
placement.

Explore the tutorials below to learn how to deploy Palette clusters in edge or data center environments.

<SimpleCardGrid
  hideNumber="true"
  cards={[
    {
      title: "Deploy an Edge Cluster on VirtualBox",
      description: "Learn how to deploy Kubernetes workloads at the edge with Palette and VirtualBox.",
      buttonText: "Learn more",
      url: "/tutorials/clusters/edge/deploy-cluster-virtualbox/",
    },
    {
      title: "Deploy an Edge Cluster on VMware",
      description: "Learn how to deploy Kubernetes workloads at the edge with Palette and VMware.",
      buttonText: "Learn more",
      url: "/tutorials/clusters/edge/deploy-cluster/",
    },
    {
      title: "Deploy App Workloads with a PCG",
      description: "Learn how to deploy a PCG to connect your data center or private cloud environment to Palette.",
      buttonText: "Learn more",
      url: "/tutorials/clusters/pcg/deploy-app-pcg/",
    },
  ]}
/>
