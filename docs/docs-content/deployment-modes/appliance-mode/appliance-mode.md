---
sidebar_label: "Appliance Mode"
title: "Appliance Mode"
description: "Learn about appliance mode, its use cases, and how to deploy a cluster in appliance mode. "
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

In appliance mode, you bring your own host, which can be either a VM in VMware vCenter or an Edge host in a remote
location. Unlike agent mode, instead of having to manage your own Operating Systems (OS), you would build secure,
immutable images that combine the OS and the Kubernetes distribution for your host cluster.

To create a cluster in appliance mode, you need to have a host that meets the
[minimal hardware requirement](../../clusters/edge/architecture/architecture.md#minimum-device-requirements). You then
need to create two artifacts: an installer ISO file and a provider image. The installer ISO will include an OS of a
supported distribution, with the Palette agent natively installed. The provider image is an image that combines the OS
and the Kubernetes layer for your cluster.

Depending on your business needs, you can deploy centrally managed or locally managed clusters in appliance mode. If you deploy a centrally managed cluster, your hosts will register with Palette based on the registration token you provide during
the installer build. Once registered, you can use the hosts as control plane or worker nodes to create a cluster. Alternatively, you can use [Local UI](../../clusters/edge/local-ui/local-ui.md) to create a locally managed cluster,
which does not require a connection to Palette.

![Architecture Diagram for Appliance Mode](/deployment-modes_appliance-mode.webp)

## Use Cases

The table below provides an overview of the different use cases and the corresponding supported environments for
appliance mode deployments.

| Use Case | Supported Environments                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Edge** | [VMware vSphere](../../clusters/edge/site-deployment/virtual-deployment/virtual-deployment.md)<br />Bare metal machines |

## Resources

- [Architecture](../../clusters/edge/architecture/architecture.md)

- [Edge Deployment Lifecycle](../../clusters/edge/edge-native-lifecycle.md)

- [EdgeForge Workflow](../../clusters/edge/edgeforge-workflow/edgeforge-workflow.md)
