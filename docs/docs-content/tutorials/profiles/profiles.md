---
sidebar_label: "Profiles"
title: "Profiles"
description: "Explore cluster profile tutorials."
sidebar_position: 20
hide_table_of_contents: true
sidebar_custom_props:
  icon: "bundles"
tags: ["profiles", "cluster profiles"]
---

[Cluster profiles](../../profiles/profiles.md) are declarative, full-stack models that Palette uses to provision and
maintain Kubernetes clusters. They are composed of layers, which can be Kubernetes manifests, Helm charts, or packs. A
cluster profile enables you to customize the entire cluster infrastructure stack, from the operating system and
Kubernetes distribution to the Container Network Interface (CNI), Container Storage Interface (CSI), and add-on
applications.

Explore the tutorials below to learn how to use cluster profiles for cluster updates and templating through cluster
profile variables.

<SimpleCardGrid
  hideNumber="true"
  cards={[
    {
      title: "Deploy Cluster Profile Updates",
      description: "Learn how to update clusters using cluster profiles.",
      buttonText: "Learn more",
      url: "/tutorials/profiles/update-k8s-cluster/",
    },
    {
      title: "Deploy Cluster with Profile Variables",
      description: "Learn how to use cluster profile variables.",
      buttonText: "Learn more",
      url: "/tutorials/profiles/cluster-profile-variables/",
    },
  ]}
/>
