---
sidebar_label: "OS Patching"
title: "OS Patching"
description: "Learn how to patch the operating system on your cluster nodes."
hide_table_of_contents: false
sidebar_position: 60
tags: ["clusters", "cluster management"]
---

Palette deploys Kubernetes clusters using pre-built VM images. The operating system (OS) on these images is the latest
patch version when building the image for the supported major-minor streams. For example, if Ubuntu 18.04 is selected
for the OS layer during provisioning, the OS on the cluster nodes might be using 18.04.3 LTE, assuming that was the
latest version available at the time the VM image was built. However, newer versions continue to be published in the
upstream repositories as improvements, bug fixes, and security patches are released.

OS Patching allows the operating system on the running cluster nodes to be updated to the latest patch version so that
it is up-to-date with the latest fixes. Assume Ubuntu 18.04.4 LTE and 18.04.5 LTE are released over time to fix
important security issues. The OS Patching operation will identify 18.04.5 as the latest version and upgrade it on the
cluster nodes.

The following options are available for OS patching:

- [Patch OS on boot](#patch-os-on-boot)
- [Enable scheduled patching](#enable-scheduled-patching)
- [Patch OS on-demand](#perform-on-demand-patching)

You can use a combination of these options to patch the operating system to the latest version. For example, you can
patch OS on boot, set up scheduled patching every month, and also perform on-demand patches at any given point in time.

Palette offers the option to provide custom node drain configuration, which gives you fine-grained control of drain
behaviour during updates. Refer to the [Configure OS Patching Drain Policy](#configure-os-patching-drain-policy) for
further information.

## Patch OS on Boot

During the cluster creation, while configuring the cluster, you can select **Patch OS on boot**. In this case, the
operating system on all cluster nodes will be updated to the latest when the cluster VMs are initially deployed.

### Prerequisites

- A cluster profile in Palette.

### Instructions

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Cluster**. And then, click **Create Cluster**. Proceed in the cluster creation
   wizard until you reach the **Settings** step.

   For more information on cluster creation, refer to the [Clusters](../clusters.md) section and any page that is
   relevant to your choice of cloud provider.

3. In the **Setting** step, click on the **Manage machines** tab, and select the checkbox for **Patch OS on boot** and
   **Reboot if required**.

   The **Reboot if required** option allows your nodes to reboot if an OS patch requires a reboot. If you do not select
   this option, your node will not be able to reboot even if a patch requires it and the respective patch may not
   succeed.

4. Finish cluster creation and deploy your cluster.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Click on the cluster you patched to view cluster details.

3. Click on the **Nodes** tab of the cluster details page. You can find the current OS version and when the most recent
   patch was applied.

   | **Field**               | **Description**                         |
   | ----------------------- | --------------------------------------- |
   | Last Applied Patch Time | The date and time of the last OS patch. |
   | Patched Version         | The latest patched version.             |

## Enable Scheduled Patching

Palette also supports OS patching through a schedule. The patching schedule can be set initially when creating a cluster
and at any given point later.

### Prerequisites

- A cluster profile in Palette.

### Instructions

<Tabs>

<TabItem value="active-cluster" label="Active cluster">

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the **Main Menu** and click on **Clusters**.

3. Click on the cluster for which you want to enable scheduled patching to view its details.

4. In the upper-right corner, click on **Settings** and select **Cluster settings**. And then, click on the **Machine
   Management** tab.

5. Select a patching schedule in the **OS Patching Schedule** field, and then select the **Reboot if required**
   checkbox.

   The **Reboot if required** option allows your nodes to reboot if an OS patch requires a reboot. If you do not select
   this option, your node will not be able to reboot even if a patch requires it and the respective patch may not
   succeed.

</TabItem>

<TabItem value="new-cluster" label="New cluster">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Cluster**. And then, click **Create Cluster**. Proceed in the cluster creation
   wizard until you reach the **Settings** step.

   For more information on cluster creation, refer to the [Clusters](../clusters.md) section and any page that is
   relevant to your choice of cloud provider.

3. In the **Setting** step, click on the **Manage machines** tab, select a patching schedule in the **OS Patching
   Schedule** field, and then select the **Reboot if required** checkbox.

   The **Reboot if required** option allows your nodes to reboot if an OS patch requires a reboot. If you do not select
   this option, your node will not be able to reboot even if a patch requires it and the respective patch may not
   succeed.

4. Finish cluster creation and deploy your cluster.

To enable **OS Patching Schedule**, ensure you are in the **Settings** step of the cluster creation wizard. Next, click
on the **Manage machines** tab, and select the drop-down input for **OS Patching Schedule**.

</TabItem>

</Tabs>

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Click on the cluster you patched to view cluster details.

3. Click on the **Nodes** tab of cluster details page. You can find the current OS version and when the most recent
   patch was applied.

   | **Field**               | **Description**                         |
   | ----------------------- | --------------------------------------- |
   | Last Applied Patch Time | The date and time of the last OS patch. |
   | Patched Version         | The latest patched version.             |

## Perform On-Demand Patching

You can request an on-demand OS patch after creating a cluster. This option allows you to you to perform immediate
updates.

### Limitations

- This operation is not available for existing Kubernetes clusters imported into Palette.
- This operation is not available for managed Kubernetes Services such as EKS and AKS.
  - For EKS clusters, you can trigger OS updates from Palette. This would request AWS to update cluster node groups to
    the latest patch version.

### Prerequisites

- An active cluster in Palette.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters**. Select the cluster you want to patch to view cluster details.

3. In the upper-right corner, click on **Settings** and select **On-Demand Update**. This will trigger an OS update
   immediately if a newer version is available.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Click on the cluster you patched to view cluster details.

3. Click on the **Nodes** tab of the cluster details page. You can find the current OS version and when the most recent
   patch was applied.

   | **Field**               | **Description**                         |
   | ----------------------- | --------------------------------------- |
   | Last Applied Patch Time | The date and time of the last OS patch. |
   | Patched Version         | The latest patched version.             |

## Configure OS Patching Drain Policy

The node drain operation refers to the process of evicting all of your pods from a node before you perform maintenance
operations on the node. Typical node maintenance operations are hardware upgrades, kernel updates and OS patching.
Palette provides the ability to configure the drain policy during on-boot, scheduled, and on-demand OS patching. Users
can specify a node drain policy using a ConfigMap, which can be applied to deployed clusters using a cluster profile or
through `kubectl`.

### Limitations

- This operation is not available for existing Kubernetes clusters that have been previously imported into Palette.
- This operation is not available for managed Kubernetes Services such as EKS and AKS.
  - For EKS clusters, you can trigger OS updates from Palette. This would request AWS to update cluster node groups to
    the latest patch version.

### Prerequisites

- An active cluster in Palette.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Profiles**. Then, click **Add Cluster Profile**. The cluster profile creation
   wizard appears.

3. Fill in a name in the **Name** field. Optionally, add a description in the **Description** field. Select the
   **Add-on** box for the **Type**. Click **Next**.

4. Click **Add Manifest**. The manifest editor appears.

5. Add a name in the **Layer Name** field. Then, click **New manifest**. Assign a name to the internal manifest and
   click on the blue button. An empty editor displays on the right side of the screen.

6. Paste the snippet below into the empty editor. This snippet includes example values within a ConfigMap to demonstrate
   how to control the drain policy of the cluster. The ConfigMap provides the following drain configuration parameters.

   | **Parameter**                         | **Description**                                                                                                                                                 | **Value Type**       | **Default Value** |
   | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------------- |
   | `data.profiling`                      | Flag to indicate whether the profiling server should capture profiling data. If enabled, the port `8082` should be exposed to the profiling server.             | `enable` / `disable` | `disable`         |
   | `data.feature.workloads`              | Flag to indicate whether to push workload metadata to the Palette server.                                                                                       | `enable` /`disable`  | `enable`          |
   | `data.drain.timeout`                  | The length of time, specified in nanoseconds, to wait for the drain operation to complete. There is no configured timeout if set to zero.                       | `duration`           | `unset`           |
   | `data.drain.gracePeriod`              | The period of time, specified in seconds, to wait for each pod to terminate gracefully. The value provided by the pods will be used if set to a negative value. | `int`                | `-1`              |
   | `data.drain.deleteLocalData`          | Flag to indicate whether to continue if one or more affected pods do not have specified volumes, resulting in the deletion of their local data.                 | `boolean`            | `false`           |
   | `data.drain.ignoreDaemonSets`         | Flag to indicate whether to ignore DaemonSet managed pods.                                                                                                      | `boolean`            | `false`           |
   | `data.drain.force`                    | Flag to indicate whether to continue if one or more affected pods do not have a declared controller.                                                            | `boolean`            | `false`           |
   | `data.drain.disableEviction`          | Flag to indicate whether to force drain to use delete operations.                                                                                               | `boolean`            | `false`           |
   | `data.drain.skipWaitForDeleteTimeout` | The length of time, in seconds, to wait for pod deletion to complete. If the time elapses, the drain will continue.                                             | `int`                | `0`               |

   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
   name: palette-agent-config
   namespace: "cluster-{{ .spectro.system.cluster.uid }}"
   data:
   profiling: disable
   feature.workloads: enable
   drain: |
     {
        "timeout": 600000000,
        "gracePeriod": 600,
        "deleteLocalData": true,
        "ignoreDaemonSets": true,
        "force": true,
        "disableEviction": false,
        "skipWaitForDeleteTimeout": 600
     }
   ```

   :::info

   You can also specify the drain policy ConfigMap directly on the cluster by using `kubectl`. Download the
   [Kubeconfig](./kubeconfig.md) file to connect to the cluster and issue the
   `kubectl create configmap palette-agent-config --namespace <cluster-id>` command. Then, execute the command
   `kubectl edit configmap palette-agent-config --namespace <cluster-id>` command and paste the configuration provided.

   :::

7. Click **Confirm & Create** to save the manifest. The manifest editor closes.

8. Click **Next**. The summary of your Add-on cluster profile appears. Then, click **Finish Configuration** to complete
   the cluster profile creation flow. The list of cluster profiles displays.

9. From the left **Main Menu**, click **Clusters**. Select the cluster you want to patch to view cluster details.

10. Select the **Profile** tab. Then, click `+` next to **Addon Layers**, then select the Add-on profile you created
    previously. Click **Confirm**, then click **Save**. Wait for Palette to apply this manifest to your cluster.

11. In the upper-right corner, click on **Settings** and select **On-Demand Update**. This will trigger an OS update
    immediately if a newer version is available.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Click on the cluster you patched to view cluster details.

3. Click on the **Nodes** tab of the cluster details page. You can find the current OS version and when the most recent
   patch was applied.

   | **Field**               | **Description**                         |
   | ----------------------- | --------------------------------------- |
   | Last Applied Patch Time | The date and time of the last OS patch. |
   | Patched Version         | The latest patched version.             |

4. Select the **Workloads** tab. The list of namespaces appears. Then, select the **Pods** tab. The list of deployed
   pods and their details appears. The **Age** column of the pods shows that they were migrated, not restarted, during
   cluster patching.
