---
sidebar_label: "Deploy a Cluster to GCP"
title: "Deploy a Cluster to Google Cloud Platform (GCP)"
description: "Spectro Cloud Getting Started with GCP"
hide_table_of_contents: false
sidebar_custom_props:
  icon: ""
tags: ["getting-started", "gcp", "tutorial"]
---

Palette supports integration with [Google Cloud Platform](https://cloud.google.com/). You can deploy and manage
[Host Clusters](../../../../glossary-all.md#host-cluster) in GCP. The concepts you learn about in the Getting Started
section are centered around a fictional case study company. This approach gives you a solution focused approach, while
introducing you to Palette workflows and capabilities.

## 🧑‍🚀 Welcome to Spacetastic!

<PartialsComponent category="getting-started" name="spacetastic-landing-intro" />

## Get Started

In this section, you learn how to create a cluster profile. Then, you deploy a cluster to GCP by using Palette. Once
your cluster is deployed, you can update it using cluster profile updates.

<!-- vale off -->

<SimpleCardGrid
  cards={[
    {
      title: "Set up Palette with GCP",
      description: "Set up the prerequisites of using Palette with GCP.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/gcp/setup",
    },
    {
      title: "Create a Cluster Profile",
      description: "Create a full cluster profile in Palette.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/gcp/create-cluster-profile",
    },
    {
      title: "Deploy a Cluster",
      description: "Deploy a Palette host cluster to GCP.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/gcp/deploy-k8s-cluster",
    },
    {
      title: "Deploy Cluster Profile Updates",
      description: "Update your deployed clusters using Palette Cluster Profiles.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/gcp/update-k8s-cluster",
    },
    {
      title: "Cluster Management with Terraform",
      description: "Deploy and update a Palette host cluster with Terraform.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/gcp/deploy-manage-k8s-cluster-tf",
    },
    {
      title: "Scale, Upgrade, and Secure Clusters",
      description: "Learn how to scale, upgrade, and secure Palette host clusters deployed to GCP.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette/gcp/scale-secure-cluster",
    },
  ]}
/>
