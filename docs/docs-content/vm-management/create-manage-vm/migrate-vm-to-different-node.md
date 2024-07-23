---
sidebar_label: "Migrate a VM"
title: "Migrate a VM to a Different Node"
description: "Learn how to migrate a VM to another physical host in the cluster using Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo"]
---

Palette supports Virtual Machine (VM) migration to another physical host in the cluster. This is known as _live
migration_. During live migration, the VM and its memory, storage, and CPU resources are moved from one cluster compute
node to another without any noticeable downtime.

Successful live migrations rely on appropriately configured storage and networking, and live migration must be enabled
as a feature gate. Live migration is enabled by default in the `feature-gates` section of the KubeVirt configuration
file that is part of the **Virtual Machine Orchestrator** pack. Refer to [Feature Gates](../vm-management.md) for more
information.

Live migration is used with rolling Kubernetes upgrades and workload balancing. To avoid interrupting a VM when a node
is placed into maintenance or upgraded, all VM instances require a `LiveMigrate` eviction strategy.

## Migrate VM to a Different Node

Follow the instructions below to migrate VMs to a different node.

### Prerequisites

- All VM instances must have an eviction strategy set as `evictionStrategy: LiveMigrate` to ensure that a VM is not
  interrupted if the node is placed into maintenance. This is configured automatically in the KubeVirt configuration
  file. If needed, you can override the default setting by configuring `spec.template.spec.evictionStrategy`.

- VMs that use Persistent Volumes must have shared `ReadWriteMany` (`RWX`) access. For more information, refer to the
  [Persistent Volume Access Modes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)
  Kubernetes resource. VMs that do not use persistent storage, such as containerDisks, do not require modifications for
  live migration.

- A VM’s pod network cannot use a Bridge interface. Disable the default Bridge interface on the pod network. However,
  other interfaces such as those that Multus grants, may use a bridge interface for live migration.

### Instructions

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, choose **Clusters** and click on your cluster.

3. Click on the **Virtual Machines** tab.

4. Select the VM to migrate and click either the **three-dot Menu** or **Actions**.

5. Click **Migrate Node to Node**.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters** and select the cluster.

3. Navigate to the **Virtual Machines** tab, and click the VM you migrated.

4. Click the **Details** tab, and verify that the name and IP address of the new node is changed.

## Evacuate a Host

Compute nodes can be placed into maintenance mode using Palette or manually using the `cordon` and `drain` commands. The
`cordon` command marks the node as un-schedulable and the `drain`command evacuates all the VMs and pods from it. This
process is useful in case you need to perform hardware maintenance on the node - for example to replace a disk or
network interface card (NIC) card, perform memory maintenance, or if there are any issues with a particular node that
need to be resolved. To learn more, check out the
[Safely Drain a Node](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/#use-kubectl-drain-to-remove-a-node-from-service)
Kubernetes resource.

### Prerequisites

- Ensure `LiveMigrate` is set as the eviction strategy for all affected VMs. When the host is put in maintenance mode,
  this feature allows for a smooth and uninterrupted migration process.

### Instructions

<Tabs>

<TabItem value="vm-palette" label="Evacuate VMs using Palette">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, choose **Clusters** and click on the **Nodes** tab.

3. Click the **three-dot Menu** in the row of the node you want to evacuate and select **Turn on maintenance mode**.
   This evacuates all workloads from the node to other nodes in the worker pool.

4. Turn off maintenance mode by clicking the **three-dot Menu** in the row of the evacuated node and select **Turn off
   maintenance mode**.

   :::warning

   Maintenance mode reduces cluster capacity. Be sure to turn off maintenance mode after maintenance completes.

   :::

</TabItem>

<TabItem value="vm-manual" label="Evacuate VMs Manually">

1. Obtain the kubeconfig file from Palette, and set the `KUBECONFIG` environment variable to access it so you can issue
   kubectl commands to the cluster. For more information, refer to
   [Set up Kubectl](../../clusters/cluster-management/palette-webctl.md#set-up-kubectl).

2. Issue the following command to mark the node as _un-schedulable_. This alerts the Kubernetes scheduler not to
   schedule any new pods on that node but allows existing pods on the node to continue to operate.

   Example:

   ```bash
   kubectl cordon <node-name>
   ```

   **node-name**: The name of the node that should be marked as _un-schedulable_.

3. Issue the following command to gracefully remove all pods from the node that is undergoing maintenance. When you
   drain a node, all pods and VMs will be safely evicted from the node.

   Example:

   ```bash
   kubectl drain <node-name>
   ```

   **node-name**: The name of the node that you wish to drain.

   :::info

   The kubectl `drain` command should only be issued to a single node at a time.

   :::

</TabItem>

</Tabs>

### Validate

<Tabs>

<TabItem group="palette" value="Palette">

You can validate evacuation completed by following the steps below.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, choose **Clusters**.

3. Verify the **Health** column displays the **Maintenance mode: Completed** icon.

</TabItem>

<TabItem group="kubectl" value="kubectl">

1. Using kubectl, log in to a machine that has access to the Kubernetes cluster. For more information, refer to
   [Access Cluster with Kubectl](../../clusters/cluster-management/palette-webctl.md).

2. Issue the following command to verify the pods are rescheduled on a different node by verifying the name and IP
   address of the new node changed.

   ```bash
   kubectl get pods --output wide
   ```

</TabItem>

</Tabs>

## Resources

- [Persistent Volume Access Modes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)

- [Safely Drain a Node](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/#use-kubectl-drain-to-remove-a-node-from-service)
