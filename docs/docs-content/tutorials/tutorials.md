---
title: "Welcome to Palette Tutorials"
sidebar_label: "Palette Tutorials"
sidebar_position: 0
pagination_next: null
description: "Introduction to Palette tutorials."
hide_table_of_contents: false
sidebar_custom_props:
  icon: "book"
tags: ["tutorials"]
---

This documentation section provides hands-on tutorials you can complete in your environment to learn more about Palette
and VerteX. Here, you will find tutorials covering the aspects of Palette you need to become a proficient user, as well
as advanced topics that require more time and attention to comprehend. These tutorials will enable you to maximize
Palette's ability to manage Kubernetes at scale. Check out the sections below to learn more about crucial Palette
concepts.

- **Profiles** - Palette profiles allow you to specify layers for your workloads using packs, Helm charts, Zarf
  packages, or cluster manifests. Packs serve as blueprints to the provisioning and deployment process, as they contain
  the versions of the container images that Palette will install for you.
- **Cluster Deployment** - Kubernetes clusters in Palette are instantiated from cluster profiles. A cluster definition
  in Palette consists of a reference to a cluster profile, cloud configuration, as well as the cluster size and
  placement configuration.
- **Cluster Management** - Palette supports several Day-2 operations to manage the end-to-end lifecycle of Kubernetes
  clusters. It also provides several capabilities across new and imported clusters to perform ongoing management
  operations like backup/restore and to keep your clusters secure, compliant, and up to date.
- **Edge** - Edge clusters are Kubernetes clusters set up on Edge hosts installed in isolated locations like grocery
  stores and restaurants versus a data center or cloud environment. These Edge hosts can be bare metal machines or
  virtual machines and are managed by operators at remote sites.

<div align="center" className="desktop-only-display">
  <img src="/tutorials/tutorials_landing-page-intro.webp" width="75%" />
</div>

### Ready to Start Learning?

Explore more through the following tutorials.

<!-- vale off -->

<SimpleCardGrid
  hideNumber="true"
  cards={[
    {
      title: "Deploy a Custom Pack",
      description: "Learn how to deploy applications to a Kubernetes cluster using Palette's custom packs.",
      buttonText: "Learn more",
      url: "/tutorials/profiles/deploy-pack/",
    },
    {
      title: "Deploy a Cluster",
      description: "Learn how to deploy a Kubernetes cluster to a public cloud provider with Palette.",
      buttonText: "Learn more",
      url: "/getting-started/",
    },
    {
      title: "Deploy App Workloads with a PCG",
      description:
        "Learn how to deploy a Private Cloud Gateway (PCG) to connect your data center or private cloud environment to Palette.",
      buttonText: "Learn more",
      url: "/tutorials/cluster-deployment/pcg/deploy-app-pcg/",
    },
    {
      title: "Deploy an Application using Palette Dev Engine",
      description: "Learn how to deploy applications to a Kubernetes cluster using Palette’s App Mode.",
      buttonText: "Learn more",
      url: "/tutorials/cluster-deployment/pde/deploy-app/",
    },
    {
      title: "Deploy Cluster Profile Updates",
      description: "Learn how to update your deployed clusters using Palette Cluster Profiles.",
      buttonText: "Learn more",
      url: "/tutorials/cluster-management/update-maintain/update-k8s-cluster/",
    },
    {
      title: "Deploy an Edge Cluster on VMware",
      description: "Learn how to deploy an Edge host using VMware as the deployment platform.",
      buttonText: "Learn more",
      url: "/tutorials/edge/deploy-cluster/",
    },
  ]}
/>
