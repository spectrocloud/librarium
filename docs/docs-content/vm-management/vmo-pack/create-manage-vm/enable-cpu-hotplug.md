---
sidebar_label: "Manage CPU and Memory"
title: "Manage CPU and Memory"
description:
  "Learn how to manage the CPU and Memory Hotplug feature in your VMs using Palette Virtual Machine Orchestrator."
sidebar_position: 50
tags: ["vmo", "cpu-hotplug"]
---

You can use the [KubeVirt CPU Hotplug](https://kubevirt.io/user-guide/compute/cpu_hotplug/) and
[KubeVirt Memory Hotplug](https://kubevirt.io/user-guide/compute/memory_hotplug/) feature in Palette, which allows the
Virtual Machine (VM) to add and remove virtual CPUs and increase or decrease memory while the VM is active. By default,
live migration is automatically enabled to apply the changes without rebooting the VM.

## Limitations

- CPU and memory hotplug is not currently supported by the ARM64 architecture.
- The current [CPU](https://kubevirt.io/user-guide/compute/cpu_hotplug/#limitations) and
  [memory](https://kubevirt.io/user-guide/compute/memory_hotplug/#limitations) hotplug implementation requires the live
  migration of the VM workload.

## Prerequisites

- A VM deployed and active in Palette.

## Manage CPU and Memory

Select the tab that corresponds to the method you want to use to enable CPU or memory hotplug in your VM.

<Tabs groupId="method">
<TabItem label="UI" value="ui">

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**, and then select the cluster with the VM you want to update.

3. Select the **Virtual Machines** tab, then select the necessary VM and open its **Configuration** tab. Click on the
   pencil icon for **CPU|Memory**.

   ![Palette with a Virtual Machine Configuration tab displayed.](/vm-management_create-manage-vm_enable-cpu-hotplug_configuration.webp)

4. Change the desired CPU sockets under **vCPU** and memory for the VM. You can also select **Set CPU topology
   manually** to configure specific cores, sockets, and threads for the VM.

   ![View of the Memory and CPU Change Box](/vm-management_create-manage-vm_enable-cpu-hotplug_config-box.webp)

   :::warning

   You must restart the VM to apply any changes made to **Cores** or **Threads**.

   :::

5. Select **Save**.

6. A [live migration](https://kubevirt.io/user-guide/compute/live_migration/) of the VM occurs automatically if changes
   have been made to the CPU sockets or memory. If you adjusted the cores or threads, you must restart the VM to apply
   those changes.

</TabItem>
<TabItem label="YAML" value="yaml">

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**, and then select the cluster with the VM you want to update.

3. Select the **Virtual Machines** tab, then select the necessary VM and open its **YAML** tab.

   ![Palette with the VM YAML editor displayed.](/vm-management_create-manage-vm_enable-cpu-hotplug_vm-yaml-editor.webp)

4. In the VM YAML configuration editor, navigate to the VM object configuration and update the number of CPU cores,
   sockets, threads, or memory. Consider the following examples for reference.

   ```yaml hideClipboard {6-8}
   spec:
     template:
       spec:
         domain:
           cpu:
             cores: 3
             sockets: 4
             threads: 1
   ```

   ```yaml hideClipboard {6}
   spec:
     template:
       spec:
         domain:
           memory:
             guest: 2Gi
   ```

5. In the bottom-left corner, select **Save**. Palette applies your updates.

6. To track the update process, in the YAML configuration editor, select **Reload** and monitor for a status update
   similar to the following example.

   ```yaml hideClipboard {10}
   status:
     conditions:
       - lastProbeTime: null
         lastTransitionTime: null
         status: "True"
         type: LiveMigratable
       - lastProbeTime: null
         lastTransitionTime: null
         status: "True"
         type: HotVCPUChange
   ```

</TabItem> 
</Tabs>

## Validate

<Tabs groupId="method">

<TabItem label="UI" value="ui">

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**, and then select the cluster with the VM you want to update.

3. Select the **Virtual Machines** tab, then select the necessary VM and open its **Console** tab.

4. Log in to the VM using the appropriate credentials specified in the YAML template. The provided templates contain the
   default credentials for the VM in the `cloudInitNoCloud.userData` section.

5. Verify that the VM has the expected number of CPUs or memory size. Use the following commands to verify the number of
   CPUs, memory size, and number of CPU cores. Keep in mind that the commands may vary based on the OS.

   To verify the number of CPUs and cores, issue the following command.

   ```bash
   lscpu
   ```

   ```shell hideClipboard title="Example lscpu output"
   ...
   CPU(s):              12
   ...
   Thread(s) per core:  1
   Core(s) per socket:  3
   Socket(s):           4
   ...
   ```

   To verify the memory size, issue the following command.

   ```bash
   free --human
   ```

   ```shell hideClipboard title="Example free output"
                 total        used        free      shared  buff/cache   available
   Mem:          2.0Gi       168Mi       1.5Gi       8.0Mi       320Mi       1.7Gi
   Swap:         2.0Gi          0B       2.0Gi
   ```

</TabItem>

<TabItem label="YAML" value="yaml">

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Clusters**, and then select the cluster with the VM where you enabled the CPU or
   memory hotplug.

3. Select the **Virtual Machines** tab, then select the necessary VM and open its **YAML** tab.

4. In the VM YAML configuration editor, navigate to the VM object and status configurations and verify that they specify
   the expected number of CPUs or memory size. Consider the following example for reference.

   ```yaml hideClipboard {6-8,12-14}
   spec:
     template:
       spec:
         domain:
           cpu:
             cores: 3
             sockets: 4
             threads: 1
    ...
    status:
      currentCPUTopology:
        cores: 3
        sockets: 4
        threads: 1
   ```

</TabItem>
</Tabs>
