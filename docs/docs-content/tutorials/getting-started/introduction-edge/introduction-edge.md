---
sidebar_label: "Introduction to Palette Edge"
title: "Introduction to Palette Edge"
description: "Learn about Spectro Cloud Palette Edge."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["getting-started", "tutorial", "edge"]
---

<!-- 
- ENVIRONMENTS
- COVER CLUSTER PROFILE AND PACKS -->

Edge clusters are Kubernetes clusters deployed on hardware installed in remote locations or on Virtual Machines (VMs).
Each cluster consists of one or more nodes, with each node representing an individual Edge host. The Edge configuration
begins with the EdgeForge process, which builds two key artifacts:

1. **Installer ISO**: A bootable ISO image that contains the required dependencies, including the Palette Agent,
   _Stylus_.
2. **Provider Images**: [Kairos](https://kairos.io/)-based images that combine the Operating System (OS) and Kubernetes
   layers required for the cluster. These images install a secure, immutable OS during the cluster deployment and are
   referenced during the cluster profile creation.

After completing the build, you use the Installer ISO to install the Palette agent onto the Edge host. In connected
environments, the host then registers itself with Palette using the registration token provided during the installer
build. After registration, you can use the host as a node during the Edge cluster deployment. In disconnected
environments, you can use Local UI to create the cluster, which does not require a connection to Palette.

The following diagram illustrates the components described above.

<!-- new diagram. -->

## Use Cases

Palette Edge allows you to manage Kubernetes clusters at scale across distributed and remote locations. You can model
your entire infrastructure to support a variety of workloads, including AI/ML applications and both containerized and
VM-based deployments. With its low-touch deployment capabilities, you can ship a pre-configured device to a remote site
and have it deployed without requiring a field engineer on-site. Explore some of the example use cases below to help you
visualize how you can leverage Palette Edge.

- Retail: Ensure continuous operation of point-of-sale (POS) terminals and transactions across hundreds of restaurants,
  even in areas with unreliable internet connectivity.

- Manufacturing: Deploy and manage edge clusters in airgapped environments to support real-time automation and AI-driven
  applications, such as drone-based warehouse scanning or robotic process optimization.

- Healthcare: Securely manage thousands of edge devices running life-critical workloads in hospitals and clinics.

- Defense & Public Sector: Deploy AI-powered compute-intensive vision applications and real-time analytics in hostile or
  high-risk environments to support autonomous systems and operational intelligence.

<!-- add image of the airplanes https://www.spectrocloud.com/solutions/tactical-edge-->

## Next Steps

Explore the sequence of tutorials below to learn how to deploy your first Edge cluster with Palette. Each tutorial is
designed to guide you step-by-step, building on the concepts introduced in the previous one to ensure a complete
learning experience.

<!-- Cards will go here -->
