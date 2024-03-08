---
sidebar_label: "Deploy a Cluster to GCP"
title: "Deploy a Cluster to Google Cloud Platform (GCP)"
description: "Spectro Cloud Getting Started with GCP"
hide_table_of_contents: false
sidebar_custom_props:
  icon: ""
tags: ["getting-started"]
---

Palette supports integration with Google Cloud Platform (GCP). You can deploy and manage Host Clusters in GCP. To get
started with GCP, start by adding your GCP account in Palette.

## Get Started

In this section, you learn how to create a cluster profile. Then, you deploy a cluster to AWS by using Palette. Once
your cluster is deployed, you can update it using cluster profile updates.

<SimpleCardGrid
  cardsPerRow={2}
  cards={[
    {
      title: "1. Set up Palette with GCP",
      description: "Set up the prerequisites of using Palette with GCP.",
      buttonText: "Learn more",
      relativeURL: "./setup",
    },
    {
      title: "2. Create a Cluster Profile",
      description: "Create a full cluster profile in Palette.",
      buttonText: "Learn more",
      relativeURL: "./create-cluster-profile",
    },
    {
      title: "3. Deploy a Cluster",
      description: "Deploy a Palette host cluster to GCP.",
      buttonText: "Learn more",
      relativeURL: "./deploy-k8s-cluster",
    },
    {
      title: "4. Deploy Cluster Profile Updates",
      description: "Update your deployed clusters using Palette Cluster Profiles.",
      buttonText: "Learn more",
      relativeURL: "./update-k8s-cluster",
    },
    {
      title: "5. Deploy a Cluster with Terraform",
      description: "Deploy a Palette host cluster with Terraform.",
      buttonText: "Learn more",
      relativeURL: "./deploy-k8s-cluster-tf",
    },
  ]}
/>
