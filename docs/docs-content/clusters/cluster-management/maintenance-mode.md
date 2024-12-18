---
sidebar_label: "Maintenance Mode"
title: "Maintenance Mode"
description: "Learn how to enable and use maintenance mode to cordon and drain nodes."
hide_table_of_contents: false
sidebar_position: 240
tags: ["clusters", "cluster management"]
---

Similar to `kubectl` commands `cordon` and `drain`, maintenance mode allows you to temporarily disable scheduling for a running control plane node or worker node and migrate running workloads to other healthy nodes within the cluster without service disruptions. Using maintenance mode facilitates performing necessary maintenance tasks, addressing node issues, and optimizing workload distribution while maintaining the desired level of performance and availability.

## Prerequistes

- An active Kubernetes cluster in Palette with more than one control plane node and worker node.

- Alternate nodes with sufficient resources available where processes from maintenance nodes can be provisioned.

## Limitations

- Static pods and DaemonSets are not evicted from the node when activating maintenance mode. 

- Scans cannot be performed on the cluster when any node in the cluster is in maintenance mode.
  
- Nodes in maintenance mode are not included in the backup process, which also means they cannot be restored.

- Changes to add-on profiles are not applied to nodes in maintenance mode.

- Certain changes to infrastructure profiles, such as Kubernetes version upgrades, require nodes to be recreated, removing maintenance nodes in the process.

## Activate Maintenance Mode

1. Log in to [Palette](https://console.spectrocloud.com).
   
2. Navigate to the left **Main Menu** and select **Clusters**.
   
3. Select the desired cluster and navigate to the **Nodes** tab of the cluster.
   
4. Beside the node that needs maintenance, select the **three-dot Menu** and **Turn on maintenance mode**.
   
5. When maintenance mode is activated, the **Health** icon changes to a set of tools, and the tooltip states **Maintenance Mode: Initiated**. When Maintenance Mode is finished, the tooltip changes to **Maintenance Mode: Complete**.

![Node in maintenance mode](/clusters_cluster-management_maintenance_mode.webp)

Palette reminds you in several locations that you have a node in Maintenance Mode:

- Beside the **Settings** drop-down while viewing your cluster

- On the cluster’s **Overview** tab beneath **Health** status

- On the cluster’s **Nodes** tab in the node’s **Health** column

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**

3. Select the cluster with maintenance mode active and download the [kubeconfig](./kubeconfig.md) file.

![The cluster details page with the two Kubeconfig files elements highlighted](/clusters_cluster--management_kubeconfig_cluster-details-kubeconfig-files.webp)
   
4. Open a terminal window and set the environment variable `KUBECONFIG` to point to the kubeconfig file you downloaded.

```bash
export KUBECONFIG=~/Downloads/admin.aws-maintenance-test.kubeconfig
```

5. Confirm that the node is in a maintenance state, indictated by a `STATUS` of `SchedulingDisabled`.

```bash
kubectl get nodes
```

```bash hideClipboard
NAME                            STATUS                      ROLES           AGE     VERSION
ip-10-0-1-174.ec2.internal      Ready                       control-plane   177m    v1.30.6
ip-10-0-1-26.ec2.internal       Ready                       <none>          174m    v1.30.6
ip-10-0-1-235.ec2.internal      Ready,SchedulingDisabled    <none>          174m    v1.30.6     
```

## Disable Maintenance Mode

When you are ready to change the node back to a schedulable state, select the three-dot **Menu** beside the maintenance node, and **Turn off maintenance mode**. 

:::info

Taking a node out of maintenance mode does not automatically rebalance workloads. 

:::