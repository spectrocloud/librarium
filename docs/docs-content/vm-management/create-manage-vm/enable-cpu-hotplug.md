---
sidebar_label: "Enable CPU and Memory Hotplug"
title: "Enable CPU and Memory Hotplug"
description:
  "Learn how to enable the CPU and Memory Hotplug feature in your VMs using Palette Virtual Machine Orchestrator."
sidebar_position: 50
tags: ["vmo", "cpu-hotplug"]
---

You can enable the [KubeVirt CPU Hotplug](https://kubevirt.io/user-guide/compute/cpu_hotplug/) and
[KubeVirt Memoruy Hotplug](https://kubevirt.io/user-guide/compute/memory_hotplug/) feature in Palette, which allows the
Virtual Machine (VM) to add and remove virtual CPUs, and increase or descrease memory, while the VM is active

## Limitations

- CPU and memory hotplug is not currently supported by the ARM64 architecture.
- The current [CPU](https://kubevirt.io/user-guide/compute/cpu_hotplug/#limitations) and
  [memory](https://kubevirt.io/user-guide/compute/memory_hotplug/#limitations) hotplug implementation requires the live
  migration of the VM workload.

## Prerequisites

- A VM deployed and active in Palette.

## Enable Hotplug

Select the tab that corresponds to the method you want to use to enable CPU hotplug in your VM.

<Tabs groupId="method">
<TabItem label="UI" value="ui">

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Clusters**, and then select the cluster with the VM you want to update.

3. Select the **Virtual Machines** tab, then select the necessary VM and open its **Details** tab.

   ![Palette with the Details tab displayed.](/vm-management_create-manage-vm_enable-cpu-hotplug_details.webp)

4. Change the desired CPU Sockers, CPU Cores, or Memory Size. Toggle the **Run Live Migration** switch to enable the
   changes through live migration. If you don't toggle the switch, the changes are applied next time the VM is
   restarted.

   ![View of the Memory and CPU Change Box](/vm-management_create-manage-vm_enable-cpu-hotplug_flavor_box.webp)

   :::info

   Memory changes expose an additional Save & Restart button. This button allows you to save the changes and immediately
   restart the VM to apply the changes. Otherwise, the changes are applied through live migration.

   :::

5. Select **Save**.

</TabItem>
<TabItem label="YAML" value="yaml">

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Clusters**, and then select the cluster with the VM you want to update.

3. Select the **Virtual Machines** tab, then select the necessary VM and open its **YAML** tab.

   ![Palette with the VM YAML editor displayed.](/vm-management_create-manage-vm_enable-cpu-hotplug_vm-yaml-editor.webp)

4. In the VM YAML configuration editor, navigate to the VM object configuration and update the number of CPU sockets or
   memory. Consider the following examples for reference.

   ```yaml
   spec:
     template:
       spec:
         domain:
           cpu:
             // highlight-next-line
             sockets: 5
   ```

   ```yaml
   spec:
     template:
       spec:
         domain:
           memory:
            // highlight-next-line
             guest: 2Gi
   ```

5. In the bottom-left corner, select **Save**. Palette applies your updates.

6. To track the update process, in the YAML configuration editor, select **Reload** and monitor for a status update
   similar to the following example.

   ```yaml
   status:
     conditions:
       - lastProbeTime: null
         lastTransitionTime: null
         status: "True"
         type: LiveMigratable
       - lastProbeTime: null
         lastTransitionTime: null
         status: "True"
         // highlight-next-line
         type: HotVCPUChange
   ```

</TabItem> 
</Tabs>

## Validate

<Tabs groupId="method">

<TabItem label="UI" value="ui">

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Clusters**, and then select the cluster with the VM you want to update.

3. Select the **Virtual Machines** tab, then select the necessary VM and open its **Console** tab.

4. Log in to the VM using the appropriate credentials specified in the YAML template. The provided templates contain the
   default credentials for the VM in the `cloudInitNoCloud.userData` section.

5. Verify that the VM has the expected number of CPUs or memory size. Use the following commands to verify the number of
   CPUs, memory size, and number of CPU cores. Keep in mind that the commands may vary based on the OS.

   To verify the number of CPUs and cores, issue the following command.

   ```bash
    lscpu
   ```

   To verify the memory size, issue the following command.

   ```bash
   free --human
   ```

</TabItem>

<TabItem label="YAML" value="yaml">

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Clusters**, and then select the cluster with the VM where you enabled the CPU
   or memory hotplug.

3. Select the **Virtual Machines** tab, then select the necessary VM and open its **YAML** tab.

4. In the VM YAML configuration editor, navigate to the VM object and status configurations and verify that they specify
   the expected number of CPUs or memory size. Consider the following example for reference.

   ```yaml
   spec:
     template:
       spec:
         domain:
           cpu:
             cores: 1
             // highlight-next-line
             sockets: 5
             threads: 1
    ...
    status:
      currentCPUTopology:
        cores: 1
        // highlight-next-line
        sockets: 5
        threads: 1
   ```

</TabItem>
</Tabs>
