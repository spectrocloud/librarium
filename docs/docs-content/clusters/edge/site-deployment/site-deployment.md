---
sidebar_label: "Deployment"
title: "Deployment"
description: "Learn about the Palette Edge installation process."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

The Edge cluster deployment process consists of four phases described in the following table.

| Phase                 | Description                                                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model Cluster Profile | The process of creating a [cluster profile](../../../profiles/cluster-profiles/cluster-profiles.md) for the host cluster that will be made up of Edge hosts.                       |
| Installation          | The Edge Installer in a portable storage device installs Palette Edge onto the Edge host's hard disk. Refer to [Installation](/clusters/edge/site-deployment/stage) to learn more. |
| On-site Deployment    | Site operators power on the Edge host, applies site-specific settings, performs initial configurations, and registers Edge host with Palette.                                      |
| Cluster Provisioning  | The Edge host boots into the specified provider OS and proceeds with the cluster deployment.                                                                                       |

Review the following guides in sequential order to successfully deploy an Edge host.

1. [Model Edge Native Cluster Profile](../site-deployment/model-profile.md)

2. [Installation](../site-deployment/stage.md)

3. [On-site Deployment](./site-installation/site-installation.md)

4. [Cluster Definition](./cluster-deployment.md)

:::info

In a lab environment, you must perform all the steps. In a non-learning environment, these steps are typically performed
by people with different roles. The Palette Edge lifecycle is explained in detail in the
[lifecycle](../edge-native-lifecycle.md) resource, highlighting the various roles involved.

:::

## Deployment to Virtual Machines

You can deploy Edge Hosts as Virtual Machines (VM). The VMs function similarly to a physical Edge host and are
particularly useful in testing and learning environments. Refer to
[Create Edge OVF Templates](./virtual-deployment/create-ovf-template.md) and
[Provision Edge Host VMs](./virtual-deployment/vm-edge-host.md) to learn how to create Open Virtualization Format (OVF)
templates and provision Edge hosts using the templates. Or check out the
[Deploy Edge Cluster on VMware](../../../tutorials/clusters/edge/deploy-cluster.md) for an end-to-end tutorial to learn
the Palette Edge deployment lifecycle using VMs.

## Resources

- [Model Cluster Profile](model-profile.md)

- [Installation](stage.md)

- [Deploy Edge Hosts On-site](site-installation/site-installation.md)

- [Deploy Edge Hosts as Virtual Machines](./virtual-deployment/virtual-deployment.md)

- [Edge Host Grid View](./edge-host-view.md)

- [Deployment with Custom Registries](./deploy-custom-registries/deploy-custom-registries.md)
