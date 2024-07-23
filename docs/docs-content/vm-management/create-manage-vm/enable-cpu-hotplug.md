---
sidebar_label: "Enable CPU Hotplug"
title: "Enable CPU Hotplug"
description: "Learn how to enable the CPU Hotplug feature in your VMs using Palette Virtual Machine Orchestrator."
sidebar_position: 50
tags: ["vmo", "cpu-hotplug"]
---

You can enable the [KubeVirt CPU Hotplug](https://kubevirt.io/user-guide/compute/cpu_hotplug/) feature in Palette, which
allows the Virtual Machine (VM) to add and remove virtual CPUs while the VM is running.

## Limitations

- CPU hotplug is not currently supported by the ARM64 architecture.
- The current CPU hotplug implementation requires the live migration of the VM workload.

## Prerequisites

- A VM deployed and active in Palette.

## Enable CPU Hotplug

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Clusters**, and then select the cluster with the VM you want to update.

3. Select the **Virtual Machines** tab, then select the necessary VM and open its **YAML** tab.

   ![Palette with the VM YAML editor displayed.](/vm-management_create-manage-vm_enable-cpu-hotplug_vm-yaml-editor.webp)

4. In the VM YAML configuration editor, navigate to the VM object configuration and update the number of CPU sockets.
   Consider the following example for reference.

   ```yaml
   spec:
     template:
       spec:
         domain:
           cpu:
             // highlight-next-line
             sockets: 5
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

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Clusters**, and then select the cluster with the VM where you enabled the CPU
   hotplug.

3. Select the **Virtual Machines** tab, then select the necessary VM and open its **YAML** tab.

4. In the VM YAML configuration editor, navigate to the VM object and status configurations and verify that they specify
   the expected number of CPUs. Consider the following example for reference.

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
