---
sidebar_label: "OS Patching"
title: "OS Patching"
description: "Learn how to patch the operating system on your cluster nodes."
hide_table_of_contents: false
sidebar_position: 60
tags: ["clusters", "cluster management"]
---

Palette deploys Kubernetes clusters using pre-built VM images. The operating system (OS) on these images is the latest
patch version when building the image for the supported major-minor streams. For example, if Ubuntu 18.04 is selected
for the OS layer during provisioning, the OS on the cluster nodes might be using 18.04.3 LTE, assuming that was the
latest version available at the time the VM image was built. However, newer versions continue to be published in the
upstream repositories as improvements, bug fixes, and security patches are released.

OS Patching allows the operating system on the running cluster nodes to be updated to the latest patch version so that
it is up-to-date with the latest fixes. Assume Ubuntu 18.04.4 LTE and 18.04.5 LTE are released over time to fix
important security issues. OS Patching operation will identify 18.04.5 as the latest version and upgrade it on the
cluster nodes.

The following options are available for OS patching:

- Patch OS on boot
- Enable scheduled patching
- Patch OS on-demand

You can use a combination of these options to patch the operating system to the latest version. For example, you can
patch OS on boot, set up scheduled patching every month, as well as perform a on-demand patch at any given point in
time.

## Patch OS on Boot

During the cluster creation, while configuring the cluster, you can select **Patch OS on boot**. In this case, the
operating system on all cluster nodes will be updated to the latest when the cluster VMs are initially deployed.

### Prerequisites

- A cluster profile in Palette.

### Instructions

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Cluster**. And then, click **Create Cluster**. Proceed in the cluster creation
   wizard until you reach the **Settings** step.

   For more information on cluster creation, refer to the [Clusters](../clusters.md) section and refer to any page that
   is relevant to your choice of cloud provider when creating a cluster.

3. In the **Setting** step, click on the **Manage machines** tab, and select the check box for **Patch OS on boot** and
   **Reboot if required**.

   The **Reboot if required** option allows your nodes to reboot if an OS patch requires a reboot. If you do not check
   this option, your node will not be able to reboot even if a patch requires it and the respective patch may not
   succeed.

4. Finish cluster creation and deploy your cluster.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Click on the cluster you patched to view cluster details.

3. Click on the **Nodes** tab of cluster details page. You can find the current OS version and the time the most
   recently patch was applied.

   | **Field**               | **Description**                         |
   | ----------------------- | --------------------------------------- |
   | Last Applied Patch Time | The date and time of the last OS patch. |
   |                         |                                         |
   | Patched Version         | The latest patched version.             |

## Enable Scheduled Patching

Palette also supports OS patching through a schedule. The patching schedule can be set initially when creating a cluster
as well as at any given point later.

### Prerequisites

- A cluster profile in Palette.

### Instructions

<Tabs>

<TabItem value="active-cluster" label="Active cluster">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the **Main Menu** and click on **Clusters**.

3. Click on the cluster you want to enable scheduled patching for to view cluster details.

4. In the upper-right corner, click on **Settings** and select **Cluster settings**. And then, click on the **Machine
   Management** tab.

5. Select a patching schedule in the **OS Patching Schedule** field and check **Reboot if required**.

   The **Reboot if required** option allows your nodes to reboot if an OS patch requires a reboot. If you do not check
   this option, your node will not be able to reboot even if a patch requires it and the respective patch may not
   succeed.

</TabItem>

<TabItem value="new-cluster" label="New cluster">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Cluster**. And then, click **Create Cluster**. Proceed in the cluster creation
   wizard until you reach the **Settings** step.

   For more information on cluster creation, refer to the [Clusters](../clusters.md) section and refer to any page that
   is relevant to your choice of cloud provider when creating a cluster.

3. In the **Setting** step, click on the **Manage machines** tab, and select a patching schedule in the **OS Patching
   Schedule** field and check **Reboot if required**.

   The **Reboot if required** option allows your nodes to reboot if an OS patch requires a reboot. If you do not check
   this option, your node will not be able to reboot even if a patch requires it and the respective patch may not
   succeed.

4. Finish cluster creation and deploy your cluster.

To enable **OS Patching Schedule**, ensure you are in the **Settings** step of the cluster creation wizard. Next, click
on the **Manage machines** tab, and select the drop-down input for **OS Patching Schedule**.

</TabItem>

</Tabs>

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Click on the cluster you patched to view cluster details.

3. Click on the **Nodes** tab of cluster details page. You can find the current OS version and the time the most
   recently patch was applied.

   | **Field**               | **Description**                         |
   | ----------------------- | --------------------------------------- |
   | Last Applied Patch Time | The date and time of the last OS patch. |
   |                         |                                         |
   | Patched Version         | The latest patched version.             |

## Perform On-Demand Patching

You can request an OS patch on-demand after you have created your cluster. This option provides a way for you to perform
an immediate update.

### Limitations

- This operation is not available for existing Kubernetes clusters imported into Palette.
- This operation is not available or work as expected for managed Kubernetes Services such as EKS and AKS.
  - For EKS clusters, an OS update can be triggered from Palette. This would initiate a request on AWS to update cluster
    node groups to the latest patch version.

### Prerequisite

- An active cluster in Palette.

### Instructions

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Cluster**. Select the cluster you want to patch to view cluster details.

3. In the upper-right corner, click on **Settings** and select **On-Demand Update**. Doing so will trigger an OS update
   immediately if a newer version is available.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Click on the cluster you patched to view cluster details.

3. Click on the **Nodes** tab of cluster details page. You can find the current OS version and the time the most
   recently patch was applied.

   | **Field**               | **Description**                         |
   | ----------------------- | --------------------------------------- |
   | Last Applied Patch Time | The date and time of the last OS patch. |
   |                         |                                         |
   | Patched Version         | The latest patched version.             |
