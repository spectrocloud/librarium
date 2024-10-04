---
sidebar_label: "Deployment Modes"
title: "Deployment Modes"
description: "Learn about the different deployment modes available to deploy your Kubernetes cluster with Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

Real-life applications in Kubernetes can operate in many different environments, with varying security, compliance, and
performance requirements. Palette offers three different deployment modes that can help you meet the needs of your
organization. Whether you want to operate your cluster in public cloud, private data centers, or at the Edge, whether
you want to use your own organization's hardware and Operating Systems (OS) or build secure immutable OS to bootstrap
your applications, you can choose a solution that works for you.

The table below provides you with a brief overview of the different deployment modes and the distinctions between them.

| Mode                                | Infrastructure                                                   | Operating System                                         | OS Mutability        | Require Cloud Account Credentials |
| ----------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------- | -------------------- | --------------------------------- |
| [Controller mode](#controller-mode) | Provisioned by Palette Management Plane using Cluster API (CAPI) | Use Palette-provided OS packs or build your own OS image | Mutable              | Yes                               |
| [Appliance mode](#appliance-mode)   | Provided and managed by the user                                 | Built with EdgeForge                                     | Immutable            | No                                |
| [Agent mode](#agent-mode)           | Provided and managed by the user                                 | Provided and managed by the user                         | Mutable or immutable | No                                |

## Controller Mode

Controller mode is how you use Palette to deploy clusters in public clouds and data centers. In controller mode, the act
of provisioning infrastructure comes from the Palette Management Plane using Cluster API (CAPI). After the
infrastructure is provisioned, the Palette agent managing the cluster starts to download images, including for Operating
System (OS), Kubernetes, network and storage plugins, as well as applications. You may customize the OS in any way you
wish, and use that OS image in your cluster profile.

Because Palette is provisioning and managing infrastructure for you, controller mode also requires that you provide
Palette with all the necessary permissions and credentials to perform these actions. The advantage of controller mode is
that your cluster is fully managed by Palette, potentially saving you significant time, effort, and upfront investment
that would have been required for managing your own infrastructure.

## Appliance Mode

In appliance mode, you provide your own infrastructure. You start by using
[EdgeForge](../clusters/edge/edgeforge-workflow/edgeforge-workflow.md) to build artifacts, including provider images and
the installer ISO. You then [install](../clusters/edge/site-deployment/stage.md) the Palette agent on your host using
the installer ISO. Once installed, you can use either Local UI or the Palette Management Plane to instruct the Palette
agent to create and manage clusters.

Unlike controller mode, where clusters are always managed by Palette. You can choose to manage your cluster with Palette
, or manage your cluster locally using [Local UI](../clusters/edge/local-ui/local-ui.md), with no network connection
between your cluster and Palette. In addition, clusters deployed in appliance mode are immutable. Once your cluster is
operational, no one will be able to make further changes to the OS, unless you build a new provider image to upgrade
your cluster.

![Architecture Diagram for Appliance Mode](/deployment-modes_appliance-mode.webp)

Appliance mode does not require you to provide us with any credentials to your cloud environments. In addition, the
immutability and security provided by appliance mode makes it an ideal choice for deployment in Edge locations, though
you can still deploy to a data center or public cloud. Additionally, appliance mode allows you to take advantage of
features such as [Trusted Boot](../clusters/edge/trusted-boot/trusted-boot.md) to ensure the authenticity of your boot
process, further enhancing the security of your systems. Because Palette is no longer managing the infrastructure for
you, there is more overhead involved for you to manage the infrastructure for the cluster yourself.

## Agent Mode

Agent mode follows a similar model to appliance mode. You also need to provide your own infrastructure in agent mode.
Once the Palette agent is installed, you can also instruct the agent to create and manage a cluster either from Local UI
or Palette Management Plane.

Unlike appliance mode, you have more freedom to manage the OS for your clusters. Agent mode does not require you to use
EdgeForge to create an immutable OS image or Kubernetes image. Instead, you can use a script to install the Palette
agent on your existing machine, with its existing OS, or build an OS image that includes the Palette agent.

![Architecture Diagram for Appliance Mode](/deployment-modes_agent-mode.webp)

Agent mode is especially convenient for organizations that have stringent security policies and you already have tools
in place to manage some specific OS. Since it allows you to use your existing OS, you no longer need to obtain
additional approval from using a new OS that you build with EdgeForge.

In addition, agent mode does not require you to have an immutable OS, so you can continue to use the tools that you
already have in place for your OS lifecycle management. Compared with appliance mode, agent mode provides more
flexibility, but it may not have the security provided by appliance mode's immutable OS and you will not be able to use
Trusted Boot to ensure the software on your hosts are never tempered with.
