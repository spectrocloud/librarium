---
sidebar_label: "Deployment Modes"
title: "Deployment Modes"
description: "Learn about the different deployment modes available to deploy your Kubernetes cluster with Palette."
hide_table_of_contents: false
sidebar_position: 20
sidebar_custom_props:
  icon: "road"
tags: ["edge"]
---

Applications in Kubernetes can operate in many different environments with varying security, compliance, and performance
requirements. Palette offers three different deployment modes that can help you meet the needs of your organization.
Whether you want to operate your cluster in public cloud, private data centers, or at the Edge, and whether you want to
use your own organization's hardware and Operating Systems (OS) or build secure, immutable OS to bootstrap your
applications, you can choose a solution that works for you.

The table and diagram below provide you with a brief overview of the different deployment modes and the distinctions
between them.

| Mode                                | Infrastructure                                                   | Operating System                                         | OS Mutability        | Require Cloud Account Credentials |
| ----------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------- | -------------------- | --------------------------------- |
| [Controller mode](#controller-mode) | Provisioned by Palette management plane using Cluster API (CAPI) | Use Palette-provided OS packs or build your own OS image | Mutable              | Yes                               |
| [Appliance mode](#appliance-mode)   | Provided and managed by the user                                 | Built with EdgeForge                                     | Immutable            | No                                |
| [Agent mode](#agent-mode)           | Provided and managed by the user                                 | Provided and managed by the user                         | Mutable or immutable | No                                |

![Deployment Modes diagram](/deployment-modes_main-diagram-loop.gif)

## Controller Mode

[Controller mode](controller-mode.md) is how you use Palette to deploy clusters in public clouds and data centers. In
controller mode, the act of provisioning infrastructure comes from the Palette management plane using Cluster API
(CAPI). After the infrastructure is provisioned, the Palette agent managing the cluster starts to download images,
including those for the Operating System (OS), Kubernetes, network and storage plugins, as well as applications. You may
customize the OS in any way you wish, and use that OS image in your cluster profile.

### Why Use Controller Mode

The advantage of controller mode is that your cluster is fully managed by Palette, saving you significant time, effort,
and upfront investment that would have been required for managing your own infrastructure. If your applications
primarily deploy on public clouds or data centers, using controller mode allows you to manage everything for your
cluster, from infrastructure to applications, in a unified platform.

Because Palette is provisioning and managing infrastructure for you, controller mode also requires that you provide
Palette with all the necessary permissions and credentials to perform these actions. For more information on the
required permissions, refer to the Required Permissions page for the corresponding infrastructure provider. For example,
for AWS, refer to the [Required IAM Policies](../clusters/public-cloud/aws/required-iam-policies.md) page.

## Appliance Mode

In [appliance mode](./appliance-mode.md), you provide your own infrastructure. You start by using
[EdgeForge](../clusters/edge/edgeforge-workflow/edgeforge-workflow.md) to build artifacts, including provider images and
the installer ISO. You then [install](../clusters/edge/site-deployment/stage.md) the Palette agent on your host using
the installer ISO. Once installed, you can use either [Local UI](../clusters/edge/local-ui/local-ui.md) or the Palette
management plane to instruct the Palette agent to create and manage clusters.

Unlike controller mode, where clusters are always managed by Palette, you can choose to manage your cluster with Palette
or locally using [Local UI](../clusters/edge/local-ui/local-ui.md), with no network connection between your cluster and
Palette. In addition, clusters deployed in appliance mode are immutable. Once your cluster is operational, no one will
be able to make further changes to the OS, unless you build a new provider image to upgrade your cluster.

### Why Use Appliance Mode

Appliance mode does not require you to provide us with any credentials to your cloud environments. In addition, the
immutability and security provided by appliance mode make it an ideal choice for deployment in Edge locations, though
you can still use it to deploy clusters to a data center or public cloud. Additionally, appliance mode allows you to
take advantage of features such as [Trusted Boot](../clusters/edge/trusted-boot/trusted-boot.md), ensuring the
authenticity of your boot process and further enhancing the security of your systems. Since Palette is no longer
managing the infrastructure for you, you will have more overhead in managing the cluster's infrastructure yourself.

## Agent Mode

[Agent mode](./agent-mode/agent-mode.md) follows a similar model to appliance mode, requiring you to provide your own
infrastructure. Once the Palette agent is installed, you can instruct the agent to create and manage a cluster either
from Local UI or Palette Management plane.

Unlike appliance mode, you have more freedom to manage the OS for your clusters. Agent mode does not require you to use
EdgeForge to create an immutable OS image or Kubernetes image. Instead, you can use a script to install the Palette
agent on your existing machine, with its existing OS, or build an OS image that includes the Palette agent.

### Why Use Agent Mode

Agent mode is especially convenient for organizations that have stringent security policies and you already have tools
in place to manage some specific OS. Since it allows you to use your existing OS, you no longer need to obtain
additional approval for using a new OS that you build with EdgeForge.

In addition, agent mode does not require you to have an immutable OS, so you can continue to use the tools that you may
already have in place for your OS lifecycle management. Compared with appliance mode, agent mode provides more
flexibility, but it may not have the security provided by appliance mode's immutable OS and you will not be able to use
Trusted Boot to ensure the software on your hosts are never tempered with.
