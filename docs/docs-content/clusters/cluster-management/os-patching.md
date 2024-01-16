---
sidebar_label: "OS Patching"
title: "OS Patching"
description: "Learn how to patch the operating system on your cluster nodes."
hide_table_of_contents: false
sidebar_position: 60
tags: ["clusters", "cluster management"]
---

Palette deploys Kubernetes clusters using pre-built VM images. The operating system (OS) on these images is the latest patch version when building the image for the supported major-minor streams. For example, if Ubuntu 18.04 is selected for the OS layer during provisioning, the OS on the cluster nodes might be using 18.04.3 LTE, assuming that was the latest version available at the time the VM image was built. However, newer versions continue to be published in the upstream repositories as improvements, bug fixes, and security patches are released.

OS Patching allows the operating system on the running cluster nodes to be updated to the latest patch version so that it is up-to-date with the latest fixes. Assume Ubuntu 18.04.4 LTE and 18.04.5 LTE are released over time to fix important security issues. OS Patching operation will identify 18.04.5 as the latest version and upgrade it on the cluster nodes. The following choices are available for patching the operating system to the latest version.

## Patch on Boot

During the cluster creation, while configuring the cluster, you can select **Patch OS on boot**. In this case, the operating system on all cluster nodes will be updated to the latest when the cluster VMs are initially deployed.

To enable **Patch OS on boot**, ensure you are in the **Settings** step of the cluster creation wizard. Next, click on the **Manage machines** tab, and select the check box for **Patch OS on boot**.

## Reboot

Palette supports the **Reboot if Required** feature to control the system reboot as part of cluster upgrades. Some system upgrades will require a reboot to apply the changes to the cluster. You need to check the **Reboot if Required** checkbox to allow the reboot. If this option is unchecked, the system reboot will be restricted.

To enable **Reboot if Required**, ensure you are in the **Settings** step of the cluster creation wizard. Next, click on the **Manage machines** tab, and select the check box for **Reboot if Required**.

## Scheduled

Palette also supports OS patching through a schedule. The patching schedule can be set initially when creating a cluster as well as at any given point later. The following scheduling options are available.

- Never
- Every week on Sunday at midnight
- Every two weeks at midnight
- Every month on the 1st at midnight
- Every two months on the 1st at midnight
- Custom OS patch for an exact month, day, hour and minute of your choice

To enable **OS Patching Schedule**, ensure you are in the **Settings** step of the cluster creation wizard. Next, click on the **Manage machines** tab, and select the drop-down input for **OS Patching Schedule**.

To enable **OS Patching Schedule**, for an active cluster. Navigate to the **Main Menu** and click on **Clusters**. In the cluster view page, find the row for the respective cluster you want to configure OS patching for. Click on the three dots at the end of row to access the cluster settings. Next, click on the **Machine Management** tab, and select the drop-down input for **OS Patching Schedule**.

# On-Demand

This option provides a way for you to perform an immediate update.

To perform an **On-Demand** update for an active cluster. Navigate to the **Main Menu** and click on **Clusters**. In the cluster view page, find the row for the respective cluster you want to configure OS patching for. Click on the three dots at the end of row to access the cluster settings. Next, click on the **Machine Management** tab, and select the drop-down input for **OS Patching Schedule**.

<br />

:::warning
This operation is not available for existing Kubernetes clusters imported into Palette.
This operation is not available for managed Kubernetes Services such as EKS and AKS. For EKS clusters, an OS update can be triggered from Palette. This would initiate a request on AWS to update cluster node groups to the latest patch version.
:::

## Monitoring

The clusters' OS patching status can be monitored through the **Node** tab of cluster details page. The following are the patch details available for the customer to monitor:

| **Field**               | **Description**                         |
| ----------------------- | --------------------------------------- |
| Last Applied Patch Time | The date and time of the last OS patch. |
|                         |                                         |
| Patched Version         | The latest patched version.             |
