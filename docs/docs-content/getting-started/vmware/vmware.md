---
sidebar_label: "Deploy a Cluster to VMware"
title: "Deploy a Cluster to VMware"
description: "Spectro Cloud Getting Started with VMware"
hide_table_of_contents: false
sidebar_custom_props:
  icon: ""
tags: ["getting-started", "vmware"]
---

Palette supports integration with [VMware](https://www.vmware.com). You can deploy and manage
[Host Clusters](../../glossary-all.md#host-cluster) on VMware.

## Get Started

In this section, you learn how to create a cluster profile. Then, you deploy a cluster to VMware vSphere using Palette.
Once your cluster is deployed, you can update it using cluster profile updates.

<SimpleCardGrid
  cards={[
    {
      title: "Set up Palette with VMware",
      description: "Set up the prerequisites of using Palette with VMware.",
      buttonText: "Learn more",
      relativeURL: "./setup",
    },
    {
      title: "Deploy a PCG",
      description: "Learn to deploy a PCG with Palette CLI.",
      buttonText: "Learn more",
      relativeURL: "./deploy-pcg",
    },
    {
      title: "Create a Cluster Profile",
      description: "Create a full cluster profile in Palette.",
      buttonText: "Learn more",
      relativeURL: "./create-cluster-profile",
    },
    {
      title: "Deploy a Cluster",
      description: "Deploy a Palette host cluster to VMware.",
      buttonText: "Learn more",
      relativeURL: "./deploy-k8s-cluster",
    },
    {
      title: "Cluster Management with Terraform",
      description: "Deploy and update a Palette host cluster with Terraform.",
      buttonText: "Learn more",
      relativeURL: "./deploy-manage-k8s-cluster-tf",
    },
  ]}
/>
