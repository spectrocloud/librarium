---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture used to support CloudStack clusters through Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["data center", "cloudstack", "architecture"]
---

## Overview

Palette supports using
[Apache CloudStack](https://docs.cloudstack.apache.org/en/latest/conceptsandterminology/concepts.html#cloud-infrastructure-overview)
as a data center provider. You can deploy Kubernetes clusters to your CloudStack environment using Palette. The
Cloudstack management environment could include Bare Metal (via IPMI), Hyper-V, Kernel-based Virtual Machine(KVM), Linux
Containers (LXC), vSphere (via vCenter), Xenserver and Xen Project. Below are some key features of the Palette
CloudStack architecture:

- Support for static IP addresses, as well as DHCP. If you are using Dynamic Host Configuration Protocol (DHCP), Dynamic
  DNS is required.

- Support for IP address pool management for assigning blocks of IPs dedicated to clusters or projects.

- A Private Cloud Gateway (PCG) must be setup within the CloudStack environment to communicate with the Palette
  management platform and the VMware vCenter that installed in the private data center.

  The PCG facilitates communication between Palette and your infrastructure environment. The PCG is necessary in
  environments where Palette does not have direct network access. Many infrastructure environments are placed in a
  private network that blocks connections originating externally. The PCG connects to Palette, and acts as an endpoint,
  allowing you to target the environment when deploying clusters in Palette.

  ![CloudStack VPC Static Flow](/clusters_pcg_architecture_cloudstack_overview_diagram.webp)

- Support for Projects within a Domain.

You can learn more in the [PCG Architecture](../../pcg/architecture.md) section.

## Projects

You can use Apache CloudStack projects to separate workloads to ...
