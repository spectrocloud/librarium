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

## Scenario - Virtual Machine (VM) Migration Plans in Unknown State

When using the [VM Migration Assistant](../vm-management/vm-migration-assistant/vm-migration-assistant.md) to migrate
VMs to your VMO cluster, migration plans can enter an **Unknown** state if more VMs are selected for migration than the
**Max concurrent virtual machine migrations** setting allows. This value determines the maximum number of VMs that can
be migrated simultaneously across all active migration plans.

To avoid this scenario, we recommend setting an appropriate value for **Max concurrent virtual machine migrations**
based on your workload and expected migration patterns. A higher value helps prevent migration plans from entering an
**Unknown** state due to excessive concurrency.

If migration plans do enter an **Unknown** state, use the following steps to resolve the issue.

### Debug Steps

1. [Access the VM Migration Assistant service console](../vm-management/vm-migration-assistant/create-vm-migration-assistant-profile.md#access-the-vm-migration-assistant-service-console).

2. From the left **Main Menu**, select **Overview**.

3. In the **Overview** tab, locate the configurable settings for the migration controller.

   ![Migration Controller Settings](/vm-management_vm-migration-assistant_additional-configuration_overview-settings.webp)

4. Click the pencil icon next to the **Max concurrent virtual machine migrations** setting.

5. In the pop-up window, increase the value based on the maximum number of VMs you expect to migrate concurrently across
   all active migration plans.

   For example, if you expect to migrate a maximum of 25 VMs across all active migration plans, set this value to 25 or
   more.

6. Click **Save** after making the change.

You will now need to recreate any migration plans that are in an **Unknown** state, and start them again. Refer to
[Create Migration Plans](../vm-management/vm-migration-assistant/create-migration-plans.md) for guidance.

## Scenario - Virtual Machines (VM) Stuck in a Migration Loop

Clusters with the VMO pack may experience VMs getting stuck in a continuous migration loop, as indicated by a
`Migrating` or `Migration` VM status. Use the following steps to troubleshoot and resolve the issue.

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com) and click **Clusters** from the left **Main Menu**.

2. Select your cluster and click on the **Profile** tab.

3. Select the VMO pack layer and click **Values** under the **Pack Details** section.

4. Comment out the following lines under the `kubevirtResource` section and click **Save**.

   ```yaml
   workloads: {}
   # workloadsUpdateStrategy:
   #     workloadUpdateMethods:
   #     - LiveMigrate
   ```

5. The KubeVirt custom resource may fail to update after changing the VMO pack values in the Palette UI. To ensure the
   changes take effect, follow the [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) guide to
   connect to your host cluster using the [kubectl](https://kubernetes.io/docs/tasks/tools/) CLI.

6. In your terminal, issue the following command to edit the KubeVirt custom resource.

   ```bash
   kubectl edit kubevirt --namespace kubevirt
   ```

7. Comment out the following lines under the `spec` block and save the file.

   ```yaml
   # workloadUpdateStrategy:
   #   workloadUpdateMethods:
   #   - LiveMigrate
   ```

8. Within a few minutes, the VMs will stop being stuck in the continuous migration loop.

   :::warning

   Step **4** affects the [CPU Hotplug](../vm-management/create-manage-vm/enable-cpu-hotplug.md) functionality. If your
   cluster has CPU Hotplug enabled, you will need to manually restart your VM each time you add a virtual CPU for the
   changes to take effect.

   :::

## Scenario - OVA Imports Fail Due To Storage Class Attribute

If you are importing an OVA file through the Palette CLI
[VMO command](../automation/palette-cli/commands/vmo.md#import-ova), `import-ova`, and the import fails. It may be due
to the VMO cluster using a `storageClass` with an unsupported volume bind mode, such as
`volumeBindingMode: WaitForFirstConsumer`. To address this issue, use the following steps to update the `storageClass`
attribute for the VMO cluster.

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com)

2. Navigate to the **left Main Menu** and select **Clusters**.

3. Select your VMO cluster to access the cluster details page.

4. Download the cluster's kubeconfig file by clicking the URL for the **Kubeconfig File**. For additional guidance,
   check out the [Kubeconfig](../clusters/cluster-management/kubeconfig.md) guide.

5. Open a terminal session and export the kubeconfig file to your terminal session.

   ```bash
   export KUBECONFIG=/path/to/your/kubeconfig
   ```

6. Use [kubectl](https://kubernetes.io/docs/reference/kubectl/) to create a new _StorageClass_ with
   `volumeBindingMode: Immediate`. Use the following command to create the new _StorageClass_.

   ```bash
    cat <<EOF | kubectl apply --filename -
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: immediate
    provisioner: csi.vsphere.vmware.com
    parameters:
      fstype: ext4
    reclaimPolicy: Delete
    volumeBindingMode: Immediate
    EOF
   ```

7. Select the new _StorageClass_ when prompted during the Palette CLI's OVA import process. You can learn more about the
   OVA import process in the [VMO command](../automation/palette-cli/commands/vmo.md#import-ova) page.
