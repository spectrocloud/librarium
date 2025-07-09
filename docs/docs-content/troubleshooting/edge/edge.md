---
sidebar_label: "Edge"
title: "Edge"
description: "Troubleshooting steps for common Edge scenarios."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["edge", "troubleshooting"]
---

The following are common scenarios that you may encounter when using Edge.

## Scenario – PXK-E Clusters on RHEL and Rocky 8 Fail Kubernetes Initialization

<VersionedLink text="Palette eXtended Kubernetes - Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" /> clusters
running Kubernetes v1.32.x or later on RHEL or Rocky Linux 8.x may experience failure during Kubernetes initialization.
This occurs because RHEL and Rocky 8.x come with kernel version 4.18.x, which does not meet the
[kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/) system requirements introduced in Kubernetes
v1.32.x. You can observe the following error in `kube-init` logs.

```shell
[ERROR SystemVerification]: kernel release 4.18.0-553.16.1.el8_10.x86_64 is unsupported. Recommended LTS version from the 4.x series is 4.19. Any 5.x or 6.x versions are also supported. For cgroups v2 support, the minimal version is 4.15 and the recommended version is 5.8+...
```

There are several possible ways to troubleshoot this issue:

- Rebuild the OS using RHEL or Rocky Linux 9.x, as they come with kernel 5.14+ by default.
- [Update the kernel version](#debug-steps---update-the-kernel-version).

### Debug Steps - Update the Kernel Version

#### Limitations

- Appliance mode is supported only for RHEL-based images and is not supported for Rocky Linux.

#### Debug Steps - Update the Kernel Version for Appliance Mode

1. Customize the `Dockerfile` in the `CanvOS` directory. Find the conditional block for RHEL.

   ```dockerfile
   RUN if [ "${OS_DISTRIBUTION}" = "rhel" ]; then \
       cp -a /certs/. /etc/pki/ca-trust/source/anchors/ && \
       update-ca-trust; \
       fi
   ```

   Update it as in the example below to install a supported kernel version using ELRepo.

   ```dockerfile
   RUN if [ "${OS_DISTRIBUTION}" = "rhel" ]; then \
       cp --archive /certs/. /etc/pki/ca-trust/source/anchors/ && \
       update-ca-trust && \
       dnf install --assumeyes https://www.elrepo.org/elrepo-release-8.el8.elrepo.noarch.rpm && \
       dnf update --assumeyes && \
       dnf --enablerepo=elrepo-kernel install --assumeyes kernel-lt kernel-lt-modules-extra && \
       dnf clean all; \
       fi
   ```

2. Rebuild the ISO and provider image and redeploy the cluster.
3. After the deployment is complete, issue the following command on the node to ensure the kernel version is 5.x.

   ```shell
   uname --kernel-release
   ```

#### Debug Steps - Update the Kernel Version for Agent Mode

1. Install a supported kernel version using ELRepo. Establish an SSH connection to the PXK-E node and issue the
   following commands.

   ```shell
   dnf install --assumeyes https://www.elrepo.org/elrepo-release-8.el8.elrepo.noarch.rpm
   dnf update --assumeyes
   dnf --enablerepo=elrepo-kernel install --assumeyes kernel-lt kernel-lt-modules-extra
   reboot
   ```

2. Issue the following command after the reboot to ensure the kernel version is 5.x.

   ```shell
   uname --kernel-release
   ```

## Scenario - PXK-E Clusters in VerteX Deployments Experience Failure upon Reboot

<!-- prettier-ignore -->
When rebooting control plane nodes in <VersionedLink text="Palette eXtended Kubernetes - Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" /> clusters
deployed via VerteX, the `kube-vip` component may fail to start due to early DNS resolution issues. You can observe
repeated errors in the system logs using `journalctl --unit=kubelet`.

```shell title="Example output"
E0619 21:53:53.613367       1 leaderelection.go:327] error retrieving resource lock kube-system/plndr-cp-lock: Get "https://kubernetes:6443/apis/coordination.k8s.io/v1/namespaces/kube-system/leases/plndr-cp-lock": dial tcp: lookup kubernetes on 10.10.128.8:53: no such host
E0619 21:54:00.647219       1 leaderelection.go:327] error retrieving resource lock kube-system/plndr-cp-lock: Get "https://kubernetes:6443/apis/coordination.k8s.io/v1/namespaces/kube-system/leases/plndr-cp-lock": dial tcp: lookup kubernetes on 10.10.128.8:53: no such host
```

Although DNS becomes available shortly after boot, `kube-vip` does not recover automatically. To fix this, stop and
remove the container manually. The kubelet then restarts the component using the current system state.
svetlana-efimova marked this conversation as resolved.

### Debug Steps

1. On each control plane node, list all operating `kube-vip` containers using the
   [`crictl`](https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/) tool.

   ```shell
   crictl ps 2>/dev/null | grep kube-vip | awk '{print $1}'
   ```

2. Stop and remove each container.

   ```shell
   crictl stop <container-id> && crictl rm <container-id>
   ```
   
## Scenario - IP Address not Assigned to Edge Host

When you add a new VMware vSphere Edge host to an Edge cluster, the IP address may fail to be assigned to the Edge host
after a reboot.

### Debug Steps

1. Access the Edge host through the
   [vSphere Web Console](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.vm_admin.doc/GUID-92986CAA-4FDE-4AA0-A9E9-084FF9E03323.html).

2. Issue the following command.

   ```bash
   networkctl reload
   ```

   This command restarts the Edge host network and allows the Edge host to receive an IP address.

## Scenario - Override or Reconfigure Read-only File System Stage

If you need to override or reconfigure the read-only file system, you can do so using the following steps.

## Debug Steps

1. Power on the Edge host.

2. Press the keyboard key `E` after highlighting the menu in `grubmenu`.

3. Type `rd.cos.debugrw` and press `Enter`.

   ![The grub menu displays with the command rd.cos.debugrw typed in the terminal.](/troubleshooting_edge_grub-menu.webp)

4. Press the keys **CTRL + X** to boot the system.

5. Make the required changes to the image.

6. Reboot the system to resume the default read-only file system.

## Scenario - Pod State Unknown After Reboot with Overlay Network Enabled

On slower networks, it's possible that this is due to KubeVip leader election timeouts. To debug, you can manually
adjust the values of related environment variables in the KubeVip DaemonSet with the following steps.

### Debug Steps

1. Ensure you can access the cluster using kubectl. For more information, refer to
   [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md).

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

1. Ensure you can access the Kubernetes cluster using kubectl. For more information, refer to
   [Access Cluster with CLI](../../clusters/cluster-management/palette-webctl.md).

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

When you create a cluster with an Edge host that operates the Red Hat Enterprise Linux (RHEL) and Ubuntu Operating
Systems (OS), you may encounter an error where the `systemd-resolved.service` process enters the **failed** state. This
prevents the nameserver from being configured, which will result in cluster deployment failure.

### Debug Steps

1. Establish an SSH connection to the Edge host.

   Alternatively, press the keys **FN + CTRL + CMD + F1** on a keyboard that is connected to the Edge host to log in to
   the terminal. If you are on Windows, press **FN + CTRL + ALT + F1**.

2. Issue the following command.

   ```shell
   chmod a+rwxt /var/tmp
   systemctl enable --now systemd-resolved.service
   ```

   This will start the `systemd-resolved.service` process and move the cluster creation process forward.
