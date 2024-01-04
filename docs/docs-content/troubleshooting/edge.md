---
sidebar_label: "Edge"
title: "Edge"
description: "Troubleshooting steps for common Edge scenarios."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["edge", "troubleshooting"]
---

The following are common scenarios that you may encounter when using Edge.

## Scenario - Override or Reconfigure Read-only File System Stage

If you need to override or reconfigure the read-only file system, you can do so using the following steps.

## Debug Steps

<br />

1. Power on the Edge host.

2. Press the keyboard key `E` after highlighting the menu in `grubmenu`.

3. Type `rd.cos.debugrw` and press `Enter`.

![The grubmenu displays with the command rd.cos.debugrw typed in the terminal.](/troubleshooting_edge_grub-menu.png)

4. Press `Ctrl+X` to boot the system.

5. Make the required changes to the image.

6. Reboot the system to resume the default read-only file system.

## Scenario - Cluster with Overlay Enabled Goes into Unknown State After Reboot

On slower networks, it's possible that this is due to KubeVip leader election timeouts. You can manually adjust the values of the following environment variables in the KubeVip daemon set following the steps below. 

### Debug Steps

1. Ensure you can access the cluster using kubectl.  For more information, refer to [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md).

2. Issue the following command:

  ```shell
  kubectl edit ds kube-vip-ds -n kube-system
  ```

3. In the `env`  of the KubeVip service, modify the values of the following environment variables:

  ```yaml
  - name: vip_leaseduration
    value: "30"
  - name: vip_renewdeadline
    value: "20"
  - name: vip_retryperiod
    value: "4"
  ```
