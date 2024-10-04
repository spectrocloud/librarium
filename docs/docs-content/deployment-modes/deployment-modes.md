---
sidebar_label: "Deployment Modes"
title: "Deployment Modes"
description: "Learn about the different deployment modes available to deploy your Kubernetes cluster with Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

Real-life applications in Kubernetes can operate in many different environments, with varying security, compliance, and
performance requirements.

Palette offers three different deployment modes that can help you meet the needs of your organization. Whether you want
to operate your cluster in public cloud, private data centers, or at the Edge, whether you want to use your own
organization's hardware and Operating Systems (OS) or build secure immutable OS to bootstrap your applications, you can
choose a solution that works for you.

To provision a Kubernetes cluster, you can choose from the following deployment modes.

- Controller mode.
- Agent mode.
- Appliance mode.

## Controller Mode

Controller mode is how you use Palette to deploy clusters in public clouds and data centers. In controller mode, the act
of provisioning infrastructure comes from the Palette Management Plane using Cluster APU (CAPI). After the
infrastructure is provisioned, the cluster starts to download images, including for Operating System (OS), Kubernetes,
network and storage plugins, as well as applications. You may customize the OS in any way you wish, and use that OS
image in your cluster profile.

Because Palette is provisioning and managing infrastructure for you, controller mode also requires that you provide
Palette with all the necessary permissions and credentials to perform these actions. The advantage of controller mode is
that your cluster is fully managed by Palette, potentially saving you significant time and effort that would have been
required for managing your own infrastructure.

## Appliance Mode

In appliance mode, you provide your own infrastructure. You start by using EdgeForge to build artifacts, including
provider images and the installer ISO. Within the provider image is the Palette agent, which initiates the actions to
form a cluster instead of the Palette Management Plane. The provider images are immutable images that include your OS
and Kubernetes distribution. Once your cluster is operational, no one will be able to make further changes to the OS.
You can also use the Trusted Boot feature to further enhance the security of your hosts.

![Architecture Diagram for Appliance Mode](/deployment-modes_appliance-mode.webp)

Appliance mode requires significantly less permissions to your existing system compared with controller mode. In
addition, the immutability and security provided by appliance mode makes it an ideal choice for deployment in Edge
locations, though you can still deploy to data center. Because Palette is no longer managing the infrastructure for you,
there is more overhead involved for you to manage the infrastructure for your cluster itself.

## Agent Mode

Agent mode is similar to appliance mode in that the bulk of the actions involved in forming a cluster happen in your
host instead of being initiated by the Palette Management Plane, and in that you are in charge of provisioning the
infrastructure. Unlike appliance mode, agent mode does not require you to use EdgeForge to create the immutable OS
image. You can instead install the Palette agent on your existing machine and use the existing OS.

![Architecture Diagram for Appliance Mode](/deployment-modes_agent-mode.webp)

Agent mode is especially convenient for organizations that have stringent security policies. Since it allows you to use
your existing OS, you no longer need to obtain additional approval from using a new OS that you build with EdgeForge. In
addition, agent mode does not require you to have an immutable OS, so you can continue to use the tools that you already
have in place for your OS lifecycle management. Compared with appliance mode, Agent mode provides more flexibility, but
it may not have the security provided by appliance mode's immutable OS and you will not be able to use Trusted Boot to
ensure the software on your hosts are never tempered with.
