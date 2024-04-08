---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture used to support VMware clusters through Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["data center", "vmware", "architecture"]
---

The following are some architectural highlights of Kubernetes clusters provisioned by Palette on VMware:

- Kubernetes nodes can be distributed across multiple-compute clusters, which serve as distinct fault domains.

- Support for static IP as well as DHCP. If your are using DHCP, Dynamic DNS is required.

- IP pool management for assigning blocks of IPs dedicated to clusters or projects.

- A Private Cloud Gateway (PCG) that you set up within the environment facilitates communications between the Palette
  management platform and vCenter installed in the private data center.

  The PCG is Palette's on-prem component to enable support for isolated, private cloud, or data center environments.
  When the PCG is installed on-prem, it registers itself with Palette and enables secure communications with the private
  cloud environment.

  ![vmware_arch_oct_2020.webp](/clusters_vmware_architecture_arch-overview.webp)

  Refer to the [PCG Architecture](../../pcg/architecture.md) section to learn more about the PCG architecture.
