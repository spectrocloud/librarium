---
sidebar_label: "Deploy a Cluster to VMware"
title: "Deploy a Cluster to VMware"
description: "Spectro Cloud Getting Started with VMware"
hide_table_of_contents: false
sidebar_custom_props:
  icon: ""
tags: ["getting-started", "vmware", "tutorial"]
---

Palette supports integration with [VMware](https://www.vmware.com). You can deploy and manage
[Host Clusters](../../../../glossary-all.md#host-cluster) on VMware. The concepts you learn about in the Getting Started
section are centered around a fictional case study company. This approach gives you a solution focused approach, while
introducing you to Palette workflows and capabilities.

## 🧑‍🚀 Welcome to Spacetastic!

<PartialsComponent category="getting-started" name="spacetastic-landing-intro" />

## Get Started

In this section, you learn how to create a cluster profile. Then, you deploy a cluster to VMware vSphere using Palette.
Once your cluster is deployed, you can update it using cluster profile updates.

<!-- vale off -->

<SimpleCardGrid
  cards={[
    {
      title: "Set up Palette with VMware",
      description: "Set up the prerequisites of using Palette with VMware.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/vmware/setup",
    },
    {
      title: "Deploy a PCG",
      description: "Learn to deploy a PCG with Palette CLI.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/vmware/deploy-pcg",
    },
    {
      title: "Create a Cluster Profile",
      description: "Create a full cluster profile in Palette.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/create-cluster-profile",
    },
    {
      title: "Deploy a Cluster",
      description: "Deploy a Palette host cluster to VMware.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/vmware/deploy-k8s-cluster",
    },
    {
      title: "Deploy Cluster Profile Updates",
      description: "Update your deployed clusters using Palette Cluster Profiles.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/vmware/update-k8s-cluster",
    },
    {
      title: "Cluster Management with Terraform",
      description: "Deploy and update a Palette host cluster with Terraform.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/vmware/deploy-manage-k8s-cluster-tf",
    },
    {
      title: "Scale, Upgrade, and Secure Clusters",
      description: "Learn how to scale, upgrade, and secure Palette host clusters deployed to VMware.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/vmware/scale-secure-cluster",
    },
  ]}
/>
