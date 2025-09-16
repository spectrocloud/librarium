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

## Scenario - `x509: certificate signed by unknown authority` Errors during Agent Mode Cluster Creation

Agent mode Edge cluster creation may fail with logs showing the following error.

```shell
failed calling webhook "pod-registry.spectrocloud.com": tls: failed to verify certificate:
x509: certificate signed by unknown authority ("Spectro Cloud")
http: TLS handshake error ... remote error: tls: bad certificate
```

As a result, core components such as CNI, Harbor, and cluster controllers never start. All pods remain in **Pending** or
**Failed** state. In the Local UI, packs display **Invalid date** in the **Started On** and **Completed On** fields.

This issue occurs when the `stylus-webhook` agent admission webhook and its Transport Layer Security (TLS)
`stylus-webhook-tls` secret are temporarily mismatched due to a timing issue during cluster bootstrap. As a result, the
Kubernetes API server rejects the certificate as signed by an unknown authority, causing admission requests to fail.

### Debug Steps

1. Issue the following command on all cluster nodes to stop the Palette Agent operator service.

   ```bash
   systemctl stop spectro-stylus-operator
   ```

2. Issue the following commands on one of the control plane nodes to remove the mismatched webhook resources.

   ```bash
   kubectl delete secret --namespace spectro-system stylus-webhook-tls
   kubectl delete svc --namespace spectro-system stylus-webhook
   kubectl delete MutatingWebhookConfiguration stylus-webhook
   ```

3. Issue the following command on all cluster nodes to restart the Palette Agent operator service and regenerate a new,
   consistent set of webhook resources.

   ```bash
   systemctl restart spectro-stylus-operator
   ```

This will resolve the issue, and cluster creation will proceed as expected.

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
- [Update the kernel version](#debug-steps---update-the-kernel-version) to 4.19 or later in the 4.x series, or to any
  5.x or 6.x version.

:::info

To view all available versions of the `kernel-lt` (long-term support) package from ELRepo, run the following command on
a system that uses `dnf`, such as RHEL, Rocky Linux, CentOS, or a compatible container.

```bash
dnf --showduplicates --enablerepo=elrepo-kernel list available kernel-lt
```

:::

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

   Update the conditional block as in the example below to install the latest available version in the 5.4.x Long-Term
   Support (LTS) kernel line using ELRepo.

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

   Alternatively, you can update the conditional block as in the example below to pin an exact version. Replace
   `5.4.261-1.el8.elrepo` with the required version.

   ```dockerfile
   RUN if [ "${OS_DISTRIBUTION}" = "rhel" ]; then \
       cp --archive /certs/. /etc/pki/ca-trust/source/anchors/ && \
       update-ca-trust && \
       dnf install --assumeyes https://www.elrepo.org/elrepo-release-8.el8.elrepo.noarch.rpm && \
       dnf update --assumeyes && \
       dnf --enablerepo=elrepo-kernel install --assumeyes \
          kernel-lt-5.4.261-1.el8.elrepo \
          kernel-lt-modules-extra-5.4.261-1.el8.elrepo && \
      dnf clean all; \
      fi
   ```

2. Rebuild the ISO and provider image and redeploy the cluster.
3. After the deployment is complete, issue the following command on the node to ensure you updated the kernel version to
   a supported one.

   ```shell
   uname --kernel-release
   ```

#### Debug Steps - Update the Kernel Version for Agent Mode

1. Install the latest available version in the 5.4.x LTS kernel line using ELRepo. Establish an SSH connection to the
   PXK-E node and issue the following commands.

   ```shell
   dnf install --assumeyes https://www.elrepo.org/elrepo-release-8.el8.elrepo.noarch.rpm
   dnf update --assumeyes
   dnf --enablerepo=elrepo-kernel install --assumeyes kernel-lt kernel-lt-modules-extra
   reboot
   ```

   Alternatively, you can issue the following command to pin an exact version. Replace `5.4.261-1.el8.elrepo` with the
   required version.

   ```shell
   dnf install --assumeyes https://www.elrepo.org/elrepo-release-8.el8.elrepo.noarch.rpm
   dnf update --assumeyes
   dnf --enablerepo=elrepo-kernel install --assumeyes \
       kernel-lt-5.4.261-1.el8.elrepo \
       kernel-lt-modules-extra-5.4.261-1.el8.elrepo
   reboot
   ```

2. Issue the following command after the reboot to ensure you updated the kernel version to a supported one.

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

### Debug Steps

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

3. In the `env` of the KubeVip service, modify the environment variables to have the following corresponding values.

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

## Scenario - Degraded Performance on Disk Drives

If you are experiencing degraded performance on disk drives, such as Solid-State Drive or Nonvolatile Memory Express
drives, and you have [Trusted Boot](../../clusters/edge/trusted-boot/trusted-boot.md) enabled. The degraded performance
may be caused by TRIM operations not being enabled on the drives. TRIM allows the OS to notify the drive which data
blocks are no longer in use and can be erased internally. To enable TRIM operations, use the following steps.

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Profiles**.

3. Select the **Cluster Profile** that you want to use for your Edge cluster.

4. Click on the BYOOS layer to access its YAML configuration.

5. Add the following configuration to the YAML to enable TRIM operations on encrypted partitions.

   ```yaml
   stages:
     boot.after:
       - name: Ensure encrypted partitions can be trimmed
         commands:
           - |
             DEVICES=$(lsblk -p -n -l -o NAME)
             if cat /proc/cmdline | grep rd.immucore.uki; then TRUSTED_BOOT="true"; fi
             for part in $DEVICES
             do
               if cryptsetup isLuks $part; then
                 echo "Detected encrypted partition $part, ensuring TRIM is enabled..."
                 if ! cryptsetup status ${part#/dev/} | grep discards; then
                   echo "TRIM is not enabled on $part, enabling TRIM..."
                   if [ "$TRUSTED_BOOT" = "true" ]; then
                     cryptsetup refresh --allow-discards --persistent ${part#/dev/}
                   else
                     if cryptsetup status ${part#/dev/} | grep LUKS2; then OPTIONS="--persistent"; fi
                     passphrase=$(echo '{ "data": "{ \"label\": \"LABEL\" }"}' | /system/discovery/kcrypt-discovery-challenger "discovery.password" | jq -r '.data')
                     echo $passphrase | cryptsetup refresh --allow-discards $OPTIONS ${part#/dev/}
                   fi
                   if [ "$?" = "0" ]; then
                     echo "TRIM is now enabled on $part"
                   else
                     echo "TRIM coud not be enabled on $part!"
                   fi
                 else
                   echo "TRIM is already enabled on $part, nothing to do."
                 fi
               fi
             done
   ```

6. Click on **Confirm Updates** to save the changes.

7. Use the updated profile to create a [new Edge cluster](../../clusters/edge/site-deployment/cluster-deployment.md) or
   update an existing Edge cluster.

## Scenario - Clusters with Cilium and RKE2 Experiences Kubernetes Upgrade Failure

When you upgrade your cluster from RKE2 1.29 to 1.30 and your cluster uses the Cilium CNI, the upgrade could fail with
error messages similar to the following. This is due to an
[upstream issue](https://github.com/rancher/rancher/issues/46726). You can fix this issue by adding a few annotations to
the Cilium DaemonSet.

### Debug Steps

1. Connect to your cluster using kubectl. For more information, refer to
   [Access Cluster with kubectl](../../clusters/cluster-management/palette-webctl.md).

2. Issue the following command from the terminal edit the Cilium DaemonSet.
   ```bash
   kubectl edit ds cilium --namespace kube-system
   ```
3. Under `metadata.annotations`, add the following annotations.
   ```yaml
   metadata:
   annotations:
     deprecated.daemonset.template.generation: "1"
     meta.helm.sh/release-name: cilium-cilium
     meta.helm.sh/release-namespace: kube-system
     container.apparmor.security.beta.kubernetes.io/cilium-agent: "unconfined"
     container.apparmor.security.beta.kubernetes.io/clean-cilium-state: "unconfined"
     container.apparmor.security.beta.kubernetes.io/mount-cgroup: "unconfined"
     container.apparmor.security.beta.kubernetes.io/apply-sysctl-overwrites: "unconfined"
   ```
