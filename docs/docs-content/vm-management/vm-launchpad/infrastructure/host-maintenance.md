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

`kubectl drain` retries each eviction until it succeeds, so it waits while the VMs on the host live-migrate and the
other pods on the host move to other nodes. After the drain finishes, Local UI has nothing left to evict when it reboots
or shuts down the host.

## Prerequisites

- A VM Launchpad cluster with more than one node, so that the VMs on the host have another node to migrate to.

- VMs that must keep running use the **Live migrate** eviction strategy, which is the default. Refer to
  [KubeVirt Configuration](../kubevirt-configuration.md#strategies).

- `kubectl` access to the VM Launchpad cluster. From the cluster **Overview** tab, download the
  [Kubeconfig](../../../clusters/cluster-management/kubeconfig.md) file.

## Drain and Reboot or Shut Down a Host

Set the `KUBECONFIG` environment variable to point to the kubeconfig file of your VM Launchpad cluster.

```shell
export KUBECONFIG=<path-to-kubeconfig>
```

Replace `<path-to-kubeconfig>` with the path to the kubeconfig file.

1. List the nodes of the cluster, and note the name of the node that runs on the host you want to reboot or shut down.

   ```shell
   kubectl get nodes
   ```

2. Drain the node. The command disables scheduling on the node and evicts its pods. It finishes when the VMs on the node
   have live-migrated to other nodes.

   ```shell
   kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data --force
   ```

   Replace `<node-name>` with the name of the node.

3. Confirm that no VMs remain on the node. The `NODENAME` column lists the node that each VM runs on.

   ```shell
   kubectl get vmi --all-namespaces --output wide
   ```

4. Confirm that the migrations succeeded. Each migration from the node shows the `Succeeded` phase.

   ```shell
   kubectl get vmim --all-namespaces
   ```

5. Reboot or shut down the host from Local UI. Refer to
   [Reboot, Shutdown, and Reset Edge Host](../../../clusters/edge/local-ui/host-management/reset-reboot.md).

6. When the host is back online, check whether scheduling is still disabled on the node.

   ```shell
   kubectl get node <node-name>
   ```

   If the `STATUS` column shows `SchedulingDisabled`, enable scheduling on the node again.

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
   kubectl get vmi --all-namespaces --output wide
   ```

   Each VM shows the `Running` phase.
