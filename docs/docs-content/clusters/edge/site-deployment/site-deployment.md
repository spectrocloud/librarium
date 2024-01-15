---
sidebar_label: "Deployment"
title: "Deployment"
description: "Learn about the Palette Edge installation process."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

The Edge host deployment process consists of four phases described in the following table.

| Phase                 | Description                                                                                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Model Cluster Profile | The process of creating a [cluster profile](../../../profiles/cluster-profiles/cluster-profiles.md) for the host cluster that will be made up of Edge hosts.                                                                                                 |
| Install Handoff       | The Edge Installer is copied over from a portable storage device to the Edge host's hard disk. This step is typically performed in the preparation step. Refer to [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage) to learn more. |
| Registration          | The Edge host is registered with Palette. The Edge host will remain in this phase until the registration process is complete.                                                                                                                                |
| Cluster Provisioning  | The Edge host boots into the specified provider OS and proceeds with the cluster deployment.                                                                                                                                                                 |

Review the following guides in sequential order to successfully deploy an Edge host.

<br />

1. [Model Edge Native Cluster Profile](../site-deployment/model-profile.md)

2. [Prepare Edge Hosts for Installation](../site-deployment/stage.md)

3. [Perform Site Install](../site-deployment/site-installation/site-installation.md)

:::info

In a lab environment, you must perform all the steps. In a non-learning environment, these steps are typically performed by people with different roles. The Palette Edge lifecycle is explained in detail in the [lifecycle](../edge-native-lifecycle.md) resource, highlighting the various roles involved.

:::

## Resources

- [Model Cluster Profile](model-profile.md)

- [Prepare Edge Hosts for Installation](stage.md)

- [Perform Site Install](site-installation/site-installation.md)

- [Register Edge Host](site-installation/edge-host-registration.md)

- [Create Cluster Definition](site-installation/cluster-deployment.md)
