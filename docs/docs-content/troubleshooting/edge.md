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

1. Power on the Edge host.

2. Press the keyboard key `E` after highlighting the menu in `grubmenu`.

3. Type `rd.cos.debugrw` and press `Enter`.

   ![The grub menu displays with the command rd.cos.debugrw typed in the terminal.](/troubleshooting_edge_grub-menu.webp)

4. Press `Ctrl+X` to boot the system.

5. Make the required changes to the image.

6. Reboot the system to resume the default read-only file system.

## Scenario - Pod State Unknown After Reboot with Overlay Network Enabled

On slower networks, it's possible that this is due to KubeVip leader election timeouts. To debug, you can manually
adjust the values of related environment variables in the KubeVip DaemonSet with the following steps.

### Debug Steps

1. Ensure you can access the cluster using kubectl. For more information, refer to
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md).

2. Issue the following command:

   ```shell
   kubectl edit ds kube-vip-ds --namespace kube-system
   ```

3. In the `env` of the KubeVip service, modify the environment variables to have the following corresponding values:

   ```yaml {4-9}
   env:
     - name: vip_leaderelection
       value: "true"
     - name: vip_leaseduration
       value: "30"
     - name: vip_renewdeadline
       value: "20"
     - name: vip_retryperiod
       value: "4"
   ```

4. Within a minute, the old Pods in unknown state will be terminated and Pods will come up with the updated values.

## Scenario - Palette Webhook Pods Fail to Start

If the Palette webhook pods fail to start, it may be due to the _palette-lite-controller-manager_ pods encountering
issues or not being available. Use the following steps to troubleshoot and resolve the issue.

### Debug Steps

1. Ensure you can access the Kubenetes cluster using kubectl. For more information, refer to
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md).

2. Open up a terminal session and issue the following command to check the status of the
   _palette-lite-controller-manager_ pods.

   ```shell
   kubectl get pods --all-namespaces | grep  palette-lite-controller-manager
   ```

   ```shell hideClipboard
   cluster-661acf1dfc746f8217de2712   palette-lite-controller-manager-6856746c8-7p9k2                 2/2     Running   0             6m
   ```

   If the pods are active and available with an age greater than five minutes, then the issue may be with the Palette
   webhook. Proceed to the next step.

   :::info

   If the pods are not active, use the command `kubectl describe pod <pod-name> --namespace palette-system` to check the
   pod logs for more information about why the pods are not starting. Replace `<pod-name>` with the name of the pod that
   is not starting. Scroll down to the `Events` section to view the logs. You can try to delete the pod and check if it
   starts successfully. If the issue persists, contact our support team by emailing.

   :::

3. Check the status of the Palette webhook pods. Use the following command to verify the status.

   ```shell
   kubectl get pods --namespace palette-system
   ```

   ```shell
   No resources found in palette-system namespace
   ```

   If the output displays a message stating **No resources found in palette-system namespace** then the lacking Palette
   webhook pods are the issue for the cluster not starting.

4. Delete all existing _palette-lite-controller-manager_ pods using the following commands.

   ```shell
   export NAMESPACE=$(kubectl get pods --all-namespaces | grep palette-lite-controller-manager | awk '{print $1}')
   export PALETTE_POD_NAME=$(kubectl get pods --all-namespaces | grep palette-lite-controller-manager | awk '{print $2}')
   kubectl delete pod $PALETTE_POD_NAME --namespace $NAMESPACE
   ```

5. After a few seconds, verify that the _palette-lite-controller-manager_ pods are active and available.

   ```shell
    kubectl get pods --all-namespaces | grep palette-lite-controller-manager
   ```

6. Check the status of the Palette webhook pods. A successful output should display the status of the _palette-webhook_
   pods.

   ```shell
   kubectl get pods --namespace palette-system
   ```

   ```shell
    NAME                               READY   STATUS    RESTARTS   AGE
    palette-webhook-548c55568c-p74zz   1/1     Running   0          2m
   ```

7. If you continue to encounter issues, contact our support team by emailing
   [support@spectrocloud.com](mailto:support@spectrocloud.com) so that we can provide you with further guidance.

## Scenario - systemd-resolved.service Enters Failed State

When you create a cluster with an Edge host that operates the FIPS-compliant RHEL Operating System (OS), you may
encounter an error where the `systemd-resolved.service` process enters the **failed** state. This prevents the
nameserver from being configured, which will result in cluster deployment failure.

### Debug Steps

1. Establish an SSH connection to the Edge host.

   Alternatively, press the keys **Fn + Ctrl +Cmd + F1** on a keyboard that is connected to the Edge host to log in to
   the terminal. If you are on Windows, press **Fn + Ctrl + Alt + F1**.

2. Issue the following command.

   ```shell
   chmod a+rwxt /var/tmp
   systemctl enable --now systemd-resolved.service
   ```

   This will start the `systemd-resolved.service` process and move the cluster creation process forward.
