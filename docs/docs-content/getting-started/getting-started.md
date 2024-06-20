---
sidebar_label: "Getting Started"
title: "Getting Started"
description: "Spectro Cloud Getting Started"
hide_table_of_contents: true
sidebar_custom_props:
  icon: "overview"
tags: ["getting-started"]
---

This page gives you an overview of how to get started with Spectro Cloud Palette and begin leveraging its Kubernetes
full-stack management at scale. Palette's unique capabilities provide end-to-end declarative cluster management, cluster
monitoring and reconciliation, as well as enterprise-grade security.

Palette provides developers and platform engineers with complete control of their Kubernetes clusters. The platform
provides support for public cloud providers, data centers, bare metal, and edge so that you can deploy and use
Kubernetes no matter the complexity or location of your production environments. Check out the following short video for
a quick overview of Palette's key functionalities.

<YouTube
  url="https://www.youtube.com/embed/P9QBOifS_cc"
  title="Demo | Spectro Cloud Palette - Kubernetes-as-a-Service"
/>

<br />

## Deploy Kubernetes Clusters with Palette

The first step towards adopting Palette in your organization is to
[create a login](https://www.spectrocloud.com/get-started). The
[Palette Free Tier](https://www.spectrocloud.com/free-tier) allows you to experience the benefits of Palette first-hand.

We have curated the pages in the Getting Started section to give you a gradual introduction to the fundamental concepts
and workflows you need to deploy and manage Kubernetes clusters through Palette.

<div className="desktop-only-display">

![Overview of the getting started journey rocket](/getting-started/getting-started_getting-started_journey-overview.webp)

</div>

<br />

First, you will learn how to create cluster profiles, which are the blueprints for your Kubernetes stacks. Then, you
will deploy your first cluster using your cluster profile. Once you have deployed your first cluster, you update it
using Palette's cluster management functionality. The Getting Started section also includes other topics that you can
explore further, such as cluster deployment with Terraform, Palette's edge capabilities, and virtual machine
orchestration.

Explore more through the following pages.

<SimpleCardGrid
  cards={[
    {
      title: "Introduction to Palette",
      description: "Learn about what makes Palette different.",
      buttonText: "Learn more",
      relativeURL: "./introduction",
    },
    {
      title: "Palette Dashboard",
      description: "Tour the Palette Project and Tenant Admin dashboards.",
      buttonText: "Learn more",
      relativeURL: "./dashboard",
    },
    {
      title: "Cluster Profiles",
      description: "Learn about Palette Cluster Profiles and Packs.",
      buttonText: "Learn more",
      relativeURL: "./cluster-profiles",
    },
    {
      title: "Create a Cluster Profile",
      description: "Create a full cluster profile in Palette.",
      buttonText: "Learn more",
      relativeURL: "./create-cluster-profile",
    },
    {
      title: "Deploy a Cluster",
      description: "Deploy a Palette host cluster in AWS, Azure or Google Cloud.",
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
      title: "Deploy a Cluster with Terraform",
      description: "Deploy a Palette host cluster with Terraform.",
      buttonText: "Learn more",
      relativeURL: "./terraform",
    },
    {
      title: "Additional Capabilities",
      description: "Learn about Palette's additional capabilities.",
      buttonText: "Learn more",
      relativeURL: "./additional-capabilities",
    },
  ]}
/>
