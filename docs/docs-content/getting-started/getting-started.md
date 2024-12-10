---
sidebar_label: "Getting Started"
title: "Getting Started"
description: "Spectro Cloud Getting Started"
hide_table_of_contents: true
sidebar_custom_props:
  icon: "flag-checkered"
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
[book a demo](https://www.spectrocloud.com/get-started) with one of our experts. This will allow you to experience the
benefits of Palette first-hand.

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

<VersionedLink url="/getting-started/introduction" text="Test" />

<!-- vale off -->

<SimpleCardGrid
  cards={[
    {
      title: "Introduction to Palette",
      description: "Learn about what makes Palette different.",
      buttonText: "Learn more",
      url: "/getting-started/introduction",
    },
    {
      title: "Deploy a Cluster to Amazon Web Services (AWS)",
      description: "Deploy and update a Palette host cluster to AWS.",
      buttonText: "Learn more",
      url: "/getting-started/aws",
    },
    {
      title: "Deploy a Cluster to Microsoft Azure",
      description: "Deploy and update a Palette host cluster to Azure.",
      buttonText: "Learn more",
      url: "/getting-started/azure",
    },
    {
      title: "Deploy a Cluster to Google Cloud Platform (GCP)",
      description: "Deploy and update a Palette host cluster to Google Cloud.",
      buttonText: "Learn more",
      url: "/getting-started/gcp",
    },
    {
      title: "Deploy a Cluster to VMware",
      description: "Deploy and update a Palette host cluster to VMware vSphere.",
      buttonText: "Learn more",
      url: "/getting-started/vmware",
    },
    {
      title: "Additional Capabilities",
      description: "Learn about Palette's additional capabilities.",
      buttonText: "Learn more",
      url: "/getting-started/additional-capabilities",
    },
  ]}
/>
