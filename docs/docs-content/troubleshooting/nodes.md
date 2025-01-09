---
sidebar_label: "Nodes & Clusters"
title: "Nodes and Clusters"
description: "Troubleshooting steps for Kubernetes nodes and clusters when managed by Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["troubleshooting", "nodes", "clusters"]
---

This page covers common debugging scenarios for nodes and clusters after they have been deployed.

## Nodes

## Scenario - Repaved Nodes

Palette performs a rolling upgrade on nodes when it detects a change in the `kubeadm` config. Below are some actions
that cause the `kubeadm` configuration to change and result in nodes being upgraded:

- OS layer changes
- Kubernetes layer changes
- Kubernetes version upgrade
- Kubernetes control plane upsize
- Machine pool updates for disk size
- Changes in availability zones
- Changes in instance types

Logs are provided in Palette for traceability. However, these logs may be lost when the pods are relaunched. To ensure
that the cause and context is persisted across repaving, refer to the `status.upgrades: []` field in the in the
`SpectroCluster` object in the `/v1/dashboard/spectroclusters/:uid/overview` API.

The following example shows the `status.upgrades` field for a cluster that had Kubernetes configuration changes that
resulted in a node repave. The API payload is incomplete for brevity.

```json hideClipboard
"upgrades": [
    {
        "reason": [
            "{v1beta1.KubeadmConfigSpec}.ClusterConfiguration.APIServer.ControlPlaneComponent.ExtraArgs[\"oidc-client-id\"] changed from <invalid reflect.Value> to xxxxxxxxxxx",
            "{v1beta1.KubeadmConfigSpec}.ClusterConfiguration.APIServer.ControlPlaneComponent.ExtraArgs[\"oidc-groups-claim\"] changed from <invalid reflect.Value> to groups",
            "{v1beta1.KubeadmConfigSpec}.ClusterConfiguration.APIServer.ControlPlaneComponent.ExtraArgs[\"oidc-issuer-url\"] changed from <invalid reflect.Value> to https://console.spectrocloud.com/v1/oidc/tenant/XXXXXXXXXXXX",
            "{v1beta1.KubeadmConfigSpec}.ClusterConfiguration.APIServer.ControlPlaneComponent.ExtraArgs[\"oidc-username-claim\"] changed from <invalid reflect.Value> to email"
        ],
        "timestamp": "2023-09-18T19:49:33.000Z"
    }
]
```

For detailed information, review the cluster upgrades [page](../clusters/clusters.md).

## Clusters

## Scenario - vSphere Cluster and Stale ARP Table

Sometimes vSphere clusters encounter issues where nodes with an assigned Virtual IP Address (VIP) cannot contact the
node with a VIP. The problem is caused by Address Resolution Protocol (ARP) entries becoming stale on non-VIP nodes.

To minimize this situation, vSphere clusters deployed through Palette now have a daemon set that cleans the ARP entry
cache every five minutes. The cleaning process forces the nodes to periodically re-request an ARP entry of the VIP node.
This is done automatically without any user action.

You can verify the cleaning process by issuing the following command on non-VIP nodes and observing that the ARP cache
is never older than 300 seconds.

```shell
watch ip -statistics neighbour
```

## EKS Cluster Worker Pool Failures

If your EKS cluster worker pool ends up in `Failed`, `Create Failed` or `Error nodes failed to join` state, refer to the
Amazon EKS
[Runbook](https://docs.aws.amazon.com/systems-manager-automation-runbooks/latest/userguide/automation-awssupport-troubleshooteksworkernode.html)
for troubleshooting guidance.

## Palette Agents Workload Payload Size Issue

A cluster comprised of many nodes can create a situation where the workload report data the agent sends to Palette
exceeds the 1 MB threshold and fails to deliver the messages. If the agent encounters too many workload report
deliveries, the agent container may transition into a _CrashLoopBackOff_ state.

If you encounter this scenario, you can configure the cluster to stop sending workload reports to Palette. To disable
the workload report feature, create a _configMap_ with the following configuration. Use a cluster profile manifest layer
to create the configMap.

```shell
apiVersion: v1
kind: ConfigMap
metadata:
  name: palette-agent-config
  namespace: "cluster-{{ .spectro.system.cluster.uid }}"
data:
  feature.workloads: disable
```

## OS Patch Fails

When conducting [OS Patching](../clusters/cluster-management/os-patching.md), sometimes the patching process can time
out and fail. This issue is due to some OS patches requiring GRUB packages. GRUB updates often require user prompts, and
if a user prompt is required during the OS patching process, the patching process will fail.

### Debug Steps

To resolve this issue, use the following steps:

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From left **Main Menu**, select **Clusters**.

3. Select the cluster that is experiencing the issue and click on its row to access the cluster details page.

4. From the cluster details page, select the **Nodes** tab.

5. Click on a cluster node to access its details page. Review the network information, such as the subnet and the
   network the node is in.

6. Log in to the infrastructure provider console and acquire the node IP address.

7. SSH into one of the cluster nodes and issue the following command.

   ```shell
   rm /var/cache/debconf/config.dat && \
   dpkg --configure -a
   ```

8. A prompt may appear asking you to select the boot device. Select the appropriate boot device and press **Enter**.

   :::tip

   If you are unsure of the boot device, use a disk utility such as `lsblk` or `fdisk` to identify the boot device.
   Below is an example of using `lsblk` to identify the boot device. The output is abbreviated for brevity.

   ```shell
   lsblk --output NAME,TYPE,MOUNTPOINT
   ```

   ```shell {10} hideClipboard
   NAME    TYPE MOUNTPOINT
   fd0     disk
   loop0   loop /snap/core20/1974
   ...
   loop10  loop /snap/snapd/20092
   loop11  loop /snap/snapd/20290
   sda     disk
   ├─sda1  part /
   ├─sda14 part
   └─sda15 part /boot/efi
   sr0     rom
   ```

   The highlighted line displays the boot device. In this example, the boot device is `sda15`, mounted at `/boot/efi`.
   The boot device may be different for your node.

   :::

9. Repeat the previous step for all nodes in the cluster.

### OS Patch Fails on AWS with Microk8s 1.27

If OS patching fails on an AWS cluster with Microk8s 1.27, use the following debug steps to resolve the issue.

#### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the cluster that is experiencing the issue and click on its row to access the cluster details page.

4. From the cluster details page, select the **Nodes** tab.

5. Click on a cluster node to access its details page. Review the network information, such as the subnet and the
   network the node is in.

6. Log in to the infrastructure provider console and acquire the node IP address.

7. SSH into one of the cluster nodes

8. Find out the partition name to which `boot/efi` is mounted with the following command.

   ```shell
   mount | grep /boot/efi
   ```

   The command produces output similar to the following.

   ```shell
   /dev/xvda15 on /boot/efi type vfat (rw,relatime,fmask=0077,dmask=0077,codepage=437,iocharset=iso8859-1,shortname=mixed,errors=remount-ro)
   ```

   The name of the partition is the partition at the start of the line before `on /boot/efi`: `/dev/xvda15`

9. Issue the following command. Replace `partition-name` with the name of the partition.

   ```shell
   grub-install --efi-directory=/boot/efi <partition-name> --force
   ```

10. Issue the following commands.

    ```shell
    grub-mkconfig -o /boot/grub/grub.cfg
    update-grub
    apt-get update
    apt-get upgrade
    ```

### Scenario - Remove Deprecated Cloud Providers

If you want to remove unsupported Custom Resource Definitions (CRDs) for deprecated cloud providers in your Kubernetes
workload cluster, you can follow the steps below.

#### Debug Steps

1. Open a terminal session that has [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) installed.

2. Set up your terminal session to use the kubeconfig file for your Kubernetes workload cluster. You can find the
   kubeconfig for your cluster in the Palette UI by visiting the cluster's details page. Check out the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md#access-cluster-with-cli) guide for
   guidance on how to set up your terminal session to use the kubeconfig file.

3. Issue the following command to list the CRDs in your target cluster.

   ```shell
   kubectl get crd
   ```

4. Identify the CRDs for the deprecated cloud providers you want to remove. For example, to remove the Tencent Cloud
   CRD, issue the following command.

   ```shell
   kubectl delete crd tencentcloudconfigs.cluster.spectrocloud.com
   ```

Once the CRD is removed, it will not be recreated by Palette.
