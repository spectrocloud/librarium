---
sidebar_label: "Introduction to Edge"
title: "Introduction to Palette Edge"
description: "Learn about Spectro Cloud Palette Edge."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["getting-started", "tutorial", "edge"]
---

Edge clusters are Kubernetes clusters configured on bare metal or virtual machines and deployed in remote locations.
Each cluster is built using Palette's reusable Kubernetes stacks, [Cluster Profiles](../../../profiles/profiles.md). You
can choose a combination of an Operating System (OS) and a Kubernetes distribution for the core infrastructure layer of
your stack and add any necessary add-ons to support your workloads.

[Palette Edge](../../../clusters/edge/edge.md) provides end-to-end cluster management, including scaling, upgrades, and
reconfiguration, while supporting both single-node and multi-node clusters. Additionally, it ensures that clusters
continue enforcing policies locally, maintaining uninterrupted operations even when connectivity is disrupted.

![Palette tactical Edge examples](/getting-started/getting-started_introduction-edge_tactical-edge.webp)

## Use Cases

Palette Edge allows you to manage Kubernetes clusters at scale across distributed and remote locations. You can model
your entire infrastructure to support a variety of workloads, including AI/ML applications and both containerized and
VM-based deployments. With its low-touch deployment capabilities, you can ship a pre-configured device to a remote site
and have it deployed without requiring a field engineer on-site. Review the example use cases below to help you evaluate
how you can leverage Palette Edge.

- **Retail**: Ensure continuous operation of point of sale terminals and transactions across hundreds of restaurants,
  even in areas with unreliable internet connectivity.

- **Manufacturing**: Deploy and manage Edge clusters in airgapped environments to support real-time automation and
  AI-driven applications, such as drone-based warehouse scanning or robotic process optimization.

- **Healthcare**: Securely manage thousands of Edge devices operating life-critical workloads in hospitals and clinics.

- **Mission-Critical Edge**: Deploy AI-powered compute-intensive vision applications in remote environments to support
  real-time supply chain and logistics.

## Architecture

Each Edge cluster consists of one or more nodes, with each node representing an individual Edge host. The Edge
configuration begins with the [EdgeForge](../../../clusters/edge/edgeforge-workflow/edgeforge-workflow.md) process,
which builds two key artifacts:

1. **Installer ISO**: A bootable ISO image that includes the required dependencies, such as the Palette Agent, and
   bootstraps the Edge installation process on the host.
2. **Provider Images**: [Kairos](https://kairos.io/)-based customizable images that combine the OS and Kubernetes layers
   required for the cluster. These images install a secure, immutable OS during the cluster deployment and are
   referenced during the cluster profile creation.

After completing the build, you use the Installer ISO to install the Palette agent onto the Edge host. In connected
environments, the host then registers itself with Palette using the registration token provided during the installer
build. After registration, you can use the host as a node during the Edge cluster deployment.

![Palette Edge architecture diagram](/getting-started/getting-started_introduction-edge_edge-diagram.webp)

## Next Steps

On this page, you became familiar with Palette Edge, its core capabilities, and architecture. Continue to the
[Prepare User Data](./prepare-user-data.md) tutorial to learn how to create a user data file, which is required for your
first Edge deployment.
