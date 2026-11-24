---
sidebar_label: "Host Maintenance"
title: "Host Maintenance"
description:
  "Drain a PaletteAI VM Launchpad host so that its virtual machines live-migrate before you reboot or shut it down."
icon: " "
hide_table_of_contents: false
sidebar_position: 40
tags: ["vmo", "vm launchpad", "infrastructure", "maintenance"]
---

Before you reboot or shut down a host in a PaletteAI VM Launchpad cluster, drain the host with `kubectl` so that its
virtual machines (VMs) live-migrate to other nodes. When you reboot or shut down a host from Local UI, Local UI drains
the host first, but the host powers off even if that drain fails. The VMs on the host then stop instead of migrating,
and Local UI does not report the failed drain. Refer to [Known Issues](../../../release-notes/known-issues.md) for
details.

`kubectl drain` waits while the VMs on the host live-migrate and the other pods leave the host. By default, it has no
time limit. After the drain finishes, Local UI has nothing left to evict when it reboots or shuts down the host.

## Prerequisites

- A VM Launchpad cluster with more than one node and enough free CPU and memory on the other nodes to run the VMs from
  the host that you plan to reboot or shut down.

- VMs that must keep running can live-migrate. Each VM uses the **LiveMigrate** eviction strategy, either set on the VM
  or inherited from the cluster's **Default eviction strategy** of **Live migrate**. Every disk of the VM uses the
  `ReadWriteMany` access mode. Refer to [KubeVirt Configuration](../kubevirt-configuration.md#strategies) and
  [Live Migration](../virtual-machines/managing.md#live-migration).

- `kubectl` access to the VM Launchpad cluster. From the cluster **Overview** tab, download the
  [Kubeconfig](../../../clusters/cluster-management/kubeconfig.md) file.

## Drain and Reboot or Shut Down a Host

Work on one host at a time. Finish this procedure, including [Validate](#validate), before you start on the next host.

Set the `KUBECONFIG` environment variable to point to the kubeconfig file of your VM Launchpad cluster. Run every
command on this page in the same terminal session, or set the variable again in a new one.

```shell
export KUBECONFIG=<path-to-kubeconfig>
```

Replace `<path-to-kubeconfig>` with the path to the kubeconfig file.

1. List the nodes of the cluster, and note the name of the node for the host you want to reboot or shut down.

   ```shell
   kubectl get nodes
   ```

2. List the VMs on the node, and note their names. The `NODENAME` column lists the node that each VM runs on, and the
   `LIVE-MIGRATABLE` column shows `True` for a VM that can live-migrate.

   ```shell
   kubectl get vmi --all-namespaces --output wide
   ```

   A VM that shows `False` and uses the **LiveMigrate** eviction strategy blocks the drain, and `kubectl drain` keeps
   retrying until you stop the VM. Before you drain the node, handle each VM that blocks the drain in one of the
   following ways, listed in order of preference.

   1. Fix what prevents the VM from live-migrating, such as a GPU or PCI passthrough device, or a disk that does not use
      the `ReadWriteMany` access mode. To find the reason, run `kubectl describe vmi <vm-name> --namespace <namespace>`
      and check the `LiveMigratable` condition. Replace `<vm-name>` and `<namespace>` with the name and namespace of the
      VM. Refer to [Live Migration](../virtual-machines/managing.md#live-migration).

   2. Use the **LiveMigrateIfPossible** eviction strategy. The VM then live-migrates when it can. When it cannot,
      KubeVirt shuts the VM down so that the drain can finish, and the VM has downtime. Set the strategy on the VM, or,
      for VMs that do not set their own, set the cluster's
      [**Default eviction strategy**](../kubevirt-configuration.md#strategies) to **Live migrate if possible**. A
      running VM keeps its eviction strategy until it restarts, so restart the VM after you set the new strategy and
      before you drain the node. Refer to [Edit a VM](../virtual-machines/managing.md#edit-a-vm).

   3. Stop the VM before you drain the node, and start it again after the host is back online. Refer to
      [Start, Stop, Restart](../virtual-machines/managing.md#start-stop-restart).

3. Drain the node. The command turns off scheduling on the node and evicts its pods. It finishes when each VM on the
   node has live-migrated to another node or shut down. A VM that uses **LiveMigrateIfPossible** shuts down when it
   cannot live-migrate.

   ```shell
   kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data --force
   ```

   Replace `<node-name>` with the name of the node.

   While the VMs migrate, the output repeats `error when evicting pods` messages that end with
   `Eviction triggered evacuation of VMI`. You can ignore these messages. The drain is complete when the output shows
   `node/<node-name> drained`.

   If the output repeats messages that end with `is configured with an eviction strategy but is not live-migratable`, a
   VM on the node cannot live-migrate. The drain does not finish until you stop the VM that the message names. Refer to
   [Start, Stop, Restart](../virtual-machines/managing.md#start-stop-restart).

4. Confirm that no VMs remain on the node. No row in the `NODENAME` column shows the name of the node.

   ```shell
   kubectl get vmi --all-namespaces --output wide
   ```

5. Confirm that the migrations succeeded. For each VM from step 2 that live-migrated, a migration whose name begins with
   `kubevirt-evacuation-` shows `Succeeded` in the `PHASE` column. The `VMI` column names the VM. The list can also
   include earlier migrations.

   ```shell
   kubectl get vmim --all-namespaces
   ```

6. Reboot or shut down the host from Local UI. Refer to
   [Reboot, Shutdown, and Reset Edge Host](../../../clusters/edge/local-ui/host-management/reset-reboot.md).

7. After the host reboots, or after you power it on again following a shutdown, check whether scheduling is still turned
   off on the node.

   ```shell
   kubectl get node <node-name>
   ```

   Replace `<node-name>` with the name of the node.

   If the `STATUS` column includes `SchedulingDisabled`, turn scheduling back on for the node.

   ```shell
   kubectl uncordon <node-name>
   ```

   Replace `<node-name>` with the name of the node.

## Validate

1. Confirm that the node is ready and schedulable.

   ```shell
   kubectl get node <node-name>
   ```

   Replace `<node-name>` with the name of the node. The `STATUS` column shows `Ready` without `SchedulingDisabled`.

2. Confirm that your VMs are running.

   ```shell
   kubectl get vm --all-namespaces
   ```

   The `STATUS` column shows `Running` for each VM that you expect to run. If a VM that you stopped before the drain or
   that shut down during the drain is not running, start it. Refer to
   [Start, Stop, Restart](../virtual-machines/managing.md#start-stop-restart).
