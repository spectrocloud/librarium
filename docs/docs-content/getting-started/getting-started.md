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

Check out the following short video for an overview of some the key functionality that Palette provides. Spectro Cloud
Palette provides developers and platform engineers with complete control of their Kubernetes clusters. It provides
support for public cloud providers, data centers, bare metal and edge, so you can use Palette no matter the complexity
or location of your production environments.

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
and workflows you need to deploy Kubernetes clusters to Palette.

<div class="desktop-only-display">
  <img
    src="/getting-started/getting-started_getting-started_journey-overview.png"
    alt="Overview of the getting started journey rocket"
  />
</div>

First, you learn how to create cluster profiles, which are the blueprints to your Kubernetes stacks. Then, you deploy
your cluster profiles with the Palette Dashboard. Once you have deployed your first cluster, there are many other
capabilities you can learn about such as cluster deployment with Terraform, Palette on edge, virtual machine
orchestration and self-hosted Palette.

Explore more through the following pages.

<SimpleCardGrid
  cardsPerRow={2}
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
  ]}
/>
