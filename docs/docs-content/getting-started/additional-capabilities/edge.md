---
sidebar_label: "Palette Edge"
title: "Palette Edge"
description: "Learn more about Palette's Edge Capabilities."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["getting-started"]
---

Palette Edge enables you to deploy Kubernetes workloads in remote locations characterized by limited or intermittent
connectivity and limited compute infrastructure. This means you can deploy Kubernetes clusters at scale and ensure
application performance, availability, security, and lifecycle management across a diverse range of edge locations.
These locations include hospitals, retail stores, Telco environments, restaurants, manufacturing facilities, rural
areas, and many more.

Palette Edge supports both VM and container-based workloads, multiple Kubernetes distributions, and Intel and ARM
hardware architectures. It is built on top of the open source project [Kairos](https://kairos.io/), which enables the
creation and customization of immutable versions of operating systems. Additionally, Palette Edge is designed to scale
to tens of thousands of locations while enforcing policies locally within each cluster.

Edge clusters are Kubernetes clusters set up on Edge hosts. These hosts can be bare metal or virtual machines located in
isolated locations. Palette deploys and manages workload clusters at the Edge, and the services continue operating even
when the connection to the management plane is lost. You can manage Edge clusters locally on-site through Local UI, or
centrally through the Palette management plane. Palette Edge is able to meet your needs, regardless of the network
topology your deployments face.

## Resources

To learn more about Palette Edge, review the [Edge](../../clusters/edge/edge.md) section to learn more about Edge and
its features. Then, follow the [Deploy an Edge Cluster on VMware](../../tutorials/edge/deploy-cluster.md) tutorial to
learn how to build Edge artifacts, prepare VMware VMs as Edge hosts using the Edge installer ISO, create a cluster
profile referencing a provider image, and deploy a cluster.

Check out the following video for a quick overview of how you can provision and manage thousands of edge Kubernetes
clusters with Palette.

<br />

<YouTube url="https://www.youtube.com/embed/mJ1ZPYbfzjY" title="Demo | Spectro Cloud Palette Edge" />
