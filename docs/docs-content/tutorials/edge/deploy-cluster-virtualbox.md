---
sidebar_position: 10
sidebar_label: "Deploy an Edge Cluster on VirtualBox"
title: "Deploy an Edge Cluster on VirtualBox"
description:
  "Learn how to deploy Kubernetes workloads at the edge with Palette and VirtualBox. This tutorial teaches you how to
  get started with Kubernetes at the edge using a virtual machine as your Edge host, and without having to worry about
  physical devices."
tags: ["edge", "tutorial"]
toc_max_heading_level: 2
category: ["tutorial"]
---

Palette Edge allows the deployment of Kubernetes workloads in remote locations with limited connectivity and compute
infrastructure. This means you can use Palette to manage the lifecycle of your Kubernetes clusters at the edge in
locations such as hospitals, rural areas, restaurants, and more.

Edge clusters are Kubernetes clusters set up on Edge hosts, which can be bare metal or virtual machines. These hosts can
be managed locally on-site through the [Local UI](../../clusters/edge/local-ui/local-ui.md) or centrally through the
Palette management plane.

Before forming a cluster, the Edge Hosts must be prepared and registered with Palette. This involves the
[EdgeForge workflow](../../clusters/edge/edgeforge-workflow/edgeforge-workflow.md), responsible for building the Edge
artifacts required for the deployment, such as the
[Installer ISO](../../clusters/edge/edgeforge-workflow/palette-canvos/build-installer-iso.md) and
[Provider Image](../../clusters/edge/edgeforge-workflow/palette-canvos/build-provider-images.md). Once these artifacts
are built, you can use the Installer ISO to bootstrap the Edge installation on your Edge host and the Provider Image to
create a cluster profile.

This tutorial will help you understand, through hands-on activities, how the different Edge components work together.
You will build and test the Edge artifacts and deploy an Edge cluster without needing a complex lab environment or
separate physical devices. Specifically, you will learn how to deploy an Edge cluster using a VirtualBox VM as the Edge
host. The tutorial will guide you through building the required
[Edge artifacts](../../clusters/edge/edgeforge-workflow/palette-canvos/palette-canvos.md), creating an Edge cluster
profile, preparing your Edge host, and deploying an Edge cluster along with a demo application.

The diagram below illustrates the components that will be deployed in this tutorial and how they interact with each
other.

![A diagram showing the Edge VirtualBox tutorial workflow.](/tutorials/edge/deploy_cluster_virtualbox-diagram.webp)

## Prerequisites

To complete this tutorial, you will need the following prerequisites in place.

- A host with _AMD64_ (also known as _x86_64_) processor architecture and access to the Internet. The host must meet the
  [minimum requirements](../../clusters/edge/hardware-requirements.md#amd64-architecture-devices) and have enough
  resources to allow the creation of a VM with the following specifications:
  - 2 CPU
  - 8 GB memory
  - 100 GB storage
- A DHCP-enabled network.
- One available IP address on the same network as the host machine.
- A [Palette account](https://www.spectrocloud.com/get-started) with
  [tenant admin](../../tenant-settings/tenant-settings.md) access.
- A Palette tenant registration token. Refer to the
  [Create a Registration Token](../../clusters/edge/site-deployment/site-installation/create-registration-token.md)
  guide for instructions on how to create a token.
- The following software installed:
  - [Docker Engine](https://docs.docker.com/engine/install/). You should have root-level or `sudo` privileges on your
    Linux machine to create privileged containers.
  - A text editor such as Vi or Nano.
  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - [VirtualBox](https://www.virtualbox.org/wiki/Downloads) version 7.0

## EdgeForge Workflow

The first step to deploy an Edge cluster is to prepare your Edge host with all the required components. This process is
called called [EdgeForge](../../clusters/edge/edgeforge-workflow/edgeforge-workflow.md) and uses the
[CanvOS](https://github.com/spectrocloud/CanvOS/blob/main/README.md) utility. In this section, you will build the
Installer ISO and Provider Image Edge artifacts.

- Installer ISO: ISO file that contains the Palette Edge host agent and metadata and bootstraps the Edge installation in
  your Edge host.
- Provider Image: Kairos-based image containing the OS and the desired Kubernetes versions. A provider image is used in
  the OS and the Kubernetes layer when creating an Edge cluster profile.

If you want your Edge host to have preloaded content and be able to create clusters using this content, you can create a
[content bundle](../../clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle.md) and build it into your
Installer ISO.

### Check Out the Starter Code

Open up a terminal window in your host machine and clone the **CanvOS** repository. This repository contains the code
and scripts required to build Edge artifacts.

```shell
git clone https://github.com/spectrocloud/CanvOS.git
```

Next, navigate to the **CanvOS/** directory.

```shell
cd CanvOS
```

Check the available git tags.

```shell
git tag
```

The output should be similar to the following.

```text hideClipboard

```

Check out the newest available tag. This tutorial uses the tag **v4.4.4** as an example.

```
git checkout v4.4.0
```

### Define Arguments

CanvOS leverages [Earthly](https://earthly.dev) to build the Installer ISO and Provider Image artifacts. A filed called
**.arg** is used to pass the value of a few arguments such as the image tag and registry to Earthly for the build
process.

### Create User Data

### Build Installer ISO and Provider OS image

### Push Provider OS Image

## Create Cluster Profile

## Deploy VirtualBox VM

## Prepare Edge Host

## Deploy Edge Cluster

## Validate

## Clean Up

## Wrap-up
