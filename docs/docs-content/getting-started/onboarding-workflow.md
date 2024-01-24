---
sidebar_label: "Palette Onboarding Workflow"
title: "Palette Onboarding Workflow"
description: "Palette Onboarding Workflow"
icon: ""
hide_table_of_contents: false
sidebar_position: 20
---

Palette offers a product tour to help you get familiar with the console and many of its key components.

## Product Tour

Upon a successful sign-in to our platform, we start the onboarding process with a product tour—an introduction to the
platform, to familiarize the users with our Palette features.

## Start your Palette Experience

![user-experience.png](/user-experience.png)

The product tour is followed by a Palette experience session. Here we make sure that our users are guided through a
successful deployment pipeline in their first use, instead of them just figuring things out along the way towards
cluster creation. The major components of this session are as follows:

- [Create New Cluster](../clusters/clusters.md)

  - Create a new cluster from scratch using any cloud environment or bare metal.

  - A system-level cluster profile is included for the users to explore the Palette functionalities easier and faster.

- [Import Cluster](../clusters/imported-clusters/cluster-import.md)

  - Bring your own cluster into Palette in two easy steps.

- Out-of-the-box (OOTB) Configurations:

  - Try one of our out-of-the-box cluster profile configurations applicable on your own cluster or in our Palette
    Virtual Cluster environment.

  <br />

  :::info

  Once the user experience session is finished, the user will be familiar with Palette's workflow and deployment
  pipeline. This section of the document is a quick start to the deployment process. The different Palette features and
  Day-2 operations are detailed in the remainder of this documentation site.

  :::

### Connect with us

- [Slack](https://spectrocloudcommunity.slack.com/join/shared_invite/zt-g8gfzrhf-cKavsGD_myOh30K24pImLA#/shared-invite/email)

- support@spectrocloud.com

## Palette Workflow

Palette requires the creation of a cluster profile before a workload cluster can be created. This is because cluster
profiles are templates created with preconfigured layers that define the required dependencies, such as the Operating
System (OS) and Kubernetes version for your cluster. The cluster profile is a core component of Palette. You can learn
more about cluster profiles by reviewing the [Cluster Profiles](../profiles/cluster-profiles/cluster-profiles.md)
reference page.

## Resources

- [Create your Cluster Profile](../profiles/cluster-profiles/cluster-profiles.md)

- [Create your Cluster](../clusters/clusters.md)

- [Imported Clusters](../clusters/imported-clusters/cluster-import.md)

- [Cluster Management](../clusters/cluster-management/cluster-management.md)
