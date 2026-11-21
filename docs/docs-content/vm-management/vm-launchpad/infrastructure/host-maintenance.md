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

`kubectl drain` waits while the VMs on the host live-migrate and the other pods leave the host. It retries each eviction
that a VM migration or a pod disruption budget holds back, and by default it has no time limit. After the drain
finishes, Local UI has nothing left to evict when it reboots or shuts down the host.

## Prerequisites

- A VM Launchpad cluster with more than one node and enough free CPU and memory on the other nodes to run the VMs from
  the host.

- VMs that must keep running can live-migrate. Each VM uses the **LiveMigrate** eviction strategy, either set on the VM
  or inherited from the cluster's **Default eviction strategy** of **Live migrate**. Every disk of the VM uses the
  `ReadWriteMany` access mode. Refer to [KubeVirt Configuration](../kubevirt-configuration.md#strategies) and
  [Live Migration](../virtual-machines/managing.md#live-migration).

- `kubectl` access to the VM Launchpad cluster. From the cluster **Overview** tab, download the
  [Kubeconfig](../../../clusters/cluster-management/kubeconfig.md) file.

## Drain and Reboot or Shut Down a Host

Maintain one host at a time. Finish this procedure, including [Validate](#validate), before you start on the next host.

Set the `KUBECONFIG` environment variable to point to the kubeconfig file of your VM Launchpad cluster. Run every
command on this page in the same terminal session, or set the variable again in a new one.

```shell
export KUBECONFIG=<path-to-kubeconfig>
```

Replace `<path-to-kubeconfig>` with the path to the kubeconfig file.

1. List the nodes of the cluster, and note the name of the node that runs on the host you want to reboot or shut down.

   ```shell
   kubectl get nodes
   ```

2. List the VMs on the node, and note their names. The `NODENAME` column lists the node that each VM runs on, and the
   `LIVE-MIGRATABLE` column shows `True` for a VM that can live-migrate.

   ```shell
   kubectl get vmi --all-namespaces --output wide
   ```

   A VM that shows `False` and uses the **LiveMigrate** eviction strategy blocks the drain. Stop that VM before you
   drain the node, and start it again after the host is back online. Refer to
   [Start, Stop, Restart](../virtual-machines/managing.md#start-stop-restart).

3. Drain the node. The command turns off scheduling on the node and evicts its pods. It finishes when the VMs on the
   node have live-migrated to other nodes.

   ```shell
   kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data --force
   ```

   Replace `<node-name>` with the name of the node.

   While the VMs migrate, the output repeats `error when evicting pods` messages that end with
   `Eviction triggered evacuation of VMI`. You can ignore these messages. The drain is complete when the output shows
   `node/<node-name> drained`.

4. Confirm that no VMs remain on the node. No row in the `NODENAME` column shows the name of the node.

   ```shell
   kubectl get vmi --all-namespaces --output wide
   ```

5. Confirm that the migrations succeeded. For each VM that you noted in step 2, a migration whose name begins with
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

   If the `STATUS` column includes `SchedulingDisabled`, turn scheduling back on for the node.

   ```shell
   kubectl uncordon <node-name>
   ```

## Validate

1. Confirm that the node is ready and schedulable.

   ```shell
   kubectl get node <node-name>
   ```

   The `STATUS` column shows `Ready` without `SchedulingDisabled`.

2. Confirm that your VMs are running.

   ```shell
   kubectl get vm --all-namespaces
   ```

   The `STATUS` column shows `Running` for each VM that you expect to run.
