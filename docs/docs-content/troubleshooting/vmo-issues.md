---
sidebar_label: "Virtual Machine Orchestrator"
title: "Virtual Machine Orchestrator"
description: "Troubleshooting steps for common Virtual Machine Orchestrator scenarios."
icon: ""
hide_table_of_contents: false
sidebar_position: 55
tags: ["troubleshooting", "vmo"]
---

The following are common scenarios that you may encounter when using Virtual Machine Orchestrator (VMO).

## Scenario - Virtual Machines (VM) Stuck in a Migration Loop

Clusters with the VMO pack may experience VMs getting stuck in a continuous migration loop, as indicated by a
`Migrating` or `Migration` VM status. Use the following steps to troubleshoot and resolve the issue.

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com) and click **Clusters** from the left **Main Menu**.

2. Select your cluster and click on the **Profile** tab.

3. Select the VMO pack layer and click **Values** under the **Pack Details** section.

4. Comment out the following lines under the `workloads: {}` section and click **Save**.

   ```yaml
   workloads: {}
   # workloadsUpdateStrategy:
   #     workloadUpdateMethods:
   #     - LiveMigrate
   ```

5. Within a few minutes, the VMs will stop being stuck in the continuous migration loop.

   :::warning

   Step **4** affects the [CPU Hotplug](../vm-management/create-manage-vm/enable-cpu-hotplug.md) functionality. If your
   cluster has CPU Hotplug enabled, you will need to manually restart your VM each time you add a virtual CPU for the
   changes to take effect.

   :::
