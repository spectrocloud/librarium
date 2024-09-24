---
sidebar_label: "Deploy a Cluster to Azure"
title: "Deploy a Cluster to Microsoft Azure"
description: "Spectro Cloud Getting Started with Azure"
hide_table_of_contents: false
sidebar_custom_props:
  icon: ""
tags: ["getting-started", "azure"]
---

Palette supports integration with [Microsoft Azure](https://azure.microsoft.com/en-us). You can deploy and manage
[Host Clusters](../../glossary-all.md#host-cluster) in Azure or Azure Government. The concepts you learn about in the
Getting Started section are centered around a fictional case study company. This approach gives you a solution focused
approach, while introducing you with Palette workflows and capabilities.

## 🧑‍🚀 Welcome to Spacetastic!

<PartialsComponent category="getting-started" name="spacetastic-landing-intro" />

## Get Started

In this section, you learn how to create a cluster profile. Then, you deploy a cluster to Azure by using Palette. Once
your cluster is deployed, you can update it using cluster profile updates.

<SimpleCardGrid
  cards={[
    {
      title: "Set up Palette with Azure",
      description: "Set up the prerequisites of using Palette with Azure.",
      buttonText: "Learn more",
      relativeURL: "./setup",
    },
    {
      title: "Create a Cluster Profile",
      description: "Create a full cluster profile in Palette.",
      buttonText: "Learn more",
      relativeURL: "./create-cluster-profile",
    },
    {
      title: "Deploy a Cluster",
      description: "Deploy a Palette host cluster to Azure.",
      buttonText: "Learn more",
      relativeURL: "./deploy-k8s-cluster",
    },
    {
      title: "Deploy Cluster Profile Updates",
      description: "Update your deployed clusters using Palette Cluster Profiles.",
      buttonText: "Learn more",
      relativeURL: "./update-k8s-cluster",
    },
    {
      title: "Cluster Management with Terraform",
      description: "Deploy and update a Palette host cluster with Terraform.",
      buttonText: "Learn more",
      relativeURL: "./deploy-manage-k8s-cluster-tf",
    },
    {
      title: "Scale, Upgrade, and Secure Clusters",
      description: "Learn how to scale, upgrade, and secure Palette host clusters deployed to Azure.",
      buttonText: "Learn more",
      relativeURL: "./scale-secure-cluster",
    },
  ]}
/>
