---
sidebar_label: "Getting Started"
title: "Getting Started"
description: "Spectro Cloud Getting Started"
sidebar_position: 0
hide_table_of_contents: true
sidebar_custom_props:
  icon: "flag-checkered"
tags: ["getting-started"]
---

This section gives you an overview of how to get started with Spectro Cloud Palette and begin leveraging its Kubernetes
full-stack management at scale. Palette's unique capabilities provide end-to-end declarative cluster management, cluster
monitoring and reconciliation, as well as enterprise-grade security.

Palette provides developers and platform engineers with complete control of their Kubernetes clusters. The platform
provides support for public cloud providers, data centers, bare metal, and edge so that you can deploy and use
Kubernetes no matter the complexity or location of your production environments. Check out the following short video for
a quick overview of Palette's key functionalities.

<YouTube
  url="https://www.youtube.com/embed/p2k3ypzYHn0?si=9rzMO5dhcPyVV1Ol"
  title="Demo | Spectro Cloud Palette - Kubernetes-as-a-Service"
/>

<br />

## Deploy Kubernetes Clusters with Palette

The first step towards adopting Palette in your organization is to
[book a demo](https://www.spectrocloud.com/get-started) with one of our experts. This will allow you to experience the
benefits of Palette first-hand.

We have curated the pages in the Getting Started section to give you a gradual introduction to the fundamental concepts
you need to deploy and manage Kubernetes clusters through Palette. This section covers two main workflows:

- **Palette**: Covers the cluster deployment workflow to major infrastructure providers, such as AWS, Azure, GCP, and
  VMware. This section also includes more advanced topics, such as cluster deployment with Terraform and day-2
  operations.

- **Palette Edge**: Covers the workflows required to deploy a Palette cluster at the edge.

The Getting Started section also introduces
[Palette's additional capabilities](../getting-started/additional-capabilities/additional-capabilities.md), including
self-hosted deployments and virtual machine orchestration.

![Getting Started Summary](/getting-started/getting-started_summary.webp)

Choose a roadmap from the following cards to start your journey with Palette.

<!-- vale off -->

<SimpleCardGrid
  hideNumber="true"
  cards={[
    {
      title: "Palette",
      description: "Learn how to deploy Palette clusters to major infrastructure providers.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette",
    },
    {
      title: "Palette Edge",
      description: "Learn how to deploy Palette clusters at the edge.",
      buttonText: "Learn more",
      url: "/tutorials/getting-started/palette-edge",
    },
  ]}
/>
