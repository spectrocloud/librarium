---
sidebar_label: "Deploy a Cluster to AWS"
title: "Deploy a Cluster to Amazon Web Services (AWS)"
description: "Spectro Cloud Getting Started with AWS"
hide_table_of_contents: false
sidebar_custom_props:
  icon: ""
tags: ["getting-started", "aws", "tutorial"]
---

Palette supports integration with [Amazon Web Services](https://aws.amazon.com). You can deploy and manage
[Host Clusters](../../../../glossary-all.md#host-cluster) in AWS. The concepts you learn about in the Getting Started
section are centered around a fictional case study company. This approach gives you a solution focused approach, while
introducing you to Palette workflows and capabilities.

## 🧑‍🚀 Welcome to Spacetastic!

<PartialsComponent category="getting-started" name="spacetastic-landing-intro" />

## Get Started

In this section, you learn how to create a cluster profile. Then, you deploy a cluster to AWS by using Palette. Once
your cluster is deployed, you can update it using cluster profile updates.

<!-- vale off -->

<SimpleCardGrid
  cards={[
    {
      title: "Set up Palette with AWS",
      description: "Set up the prerequisites of using Palette with AWS.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/aws/setup",
    },
    {
      title: "Create a Cluster Profile",
      description: "Create a full cluster profile in Palette.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/aws/create-cluster-profile",
    },
    {
      title: "Deploy a Cluster",
      description: "Deploy a Palette host cluster to AWS.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/aws/deploy-k8s-cluster",
    },
    {
      title: "Deploy Cluster Profile Updates",
      description: "Update your deployed clusters using Palette Cluster Profiles.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/aws/update-k8s-cluster",
    },
    {
      title: "Cluster Management with Terraform",
      description: "Deploy and update a Palette host cluster with Terraform.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/aws/deploy-manage-k8s-cluster-tf",
    },
    {
      title: "Scale, Upgrade, and Secure Clusters",
      description: "Learn how to scale, upgrade, and secure Palette host clusters deployed to AWS.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/aws/scale-secure-cluster",
    },
  ]}
/>
