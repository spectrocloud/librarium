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

1. Appliance mode is supported only for RHEL-based images and is not supported for Rocky Linux.

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

## Scenario - Canonical Edge Clusters in Proxied Environments Experience Failure upon Reboot

When rebooting nodes in an Edge cluster using Palette Optimized Canonical deployed in a proxied environment, the nodes
may fail to come back online. To prevent this, add the second IP address in the `service_cidr` range from the Canonical
pack to the `NO_PROXY` list in your Edge installer `user-data`.

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles**. Then select the profile you will use to deploy your cluster.

3. Select the Kubernetes layer, the `Palette Optimized Canonical` pack. Click **values.yaml** to view the values.

4. Take note of the `service_cidr` value in `pack.cluster.config`.

5. Add the second IP of the CIDR block in the `service_cidr` range to the `stylus.site.network.noProxy` parameter. For
   example, if your `service_cidr` is `192.169.0.0/16`, you need to add `192.169.0.1` to the parameter.

   ```yaml {14} title="Example"
   #cloud-config
   stylus:
     site:
       paletteEndpoint: api.spectrocloud.com
       edgeHostToken: <yourRegistrationToken>
       projectName: edge-sites
       tags:
         city: chicago
         building: building-1
         zip-code: 95135
       network:
         httpProxy: http://proxy.example.com
         httpsProxy: https://proxy.example.com
         noProxy: 10.10.128.10,10.0.0.0/8,192.169.0.1
         nameserver: 1.1.1.1
   ```

## Scenario - Cilium Pod Stuck During Kubernetes Upgrade Due to nsenter Permission Issue

During a Kubernetes upgrade, the Cilium pod may get stuck in the `Init:CrashLoopBackoff` state due to nsenter permission
issues. To address the issue, patch the cilium DaemonSet with the specified annotations.

### Debug Steps

1. [Connect to your cluster](../../clusters/cluster-management/palette-webctl.md) via `kubectl`.

2. Issue the following command to edit the DaemonSet.

   ```shell
   kubectl --namespace kube-system edit ds cilium
   ```

3. Add the following annotations to the DaemonSet.

   ```yaml
   spec:
     template:
       metadata:
         annotations:
           container.apparmor.security.beta.kubernetes.io/cilium-agent: "unconfined"
           container.apparmor.security.beta.kubernetes.io/mount-cgroup: "unconfined"
           container.apparmor.security.beta.kubernetes.io/clean-cilium-state: "unconfined"
           container.apparmor.security.beta.kubernetes.io/apply-sysctl-overwrites: "unconfined"
   ```

## Scenario - Cluster Creation Failure Due to Nodeadm not Found

<!-- prettier-ignore -->
When attempting to deploy a cluster with <VersionedLink text="Palette eXtended Kubernetes - Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" />
and [agent mode](../../deployment-modes/agent-mode/agent-mode.md) on Palette agent version 4.5.14, adding a custom `stylus.path` to
the **user-data** file causes cluster creation to fail as it cannot find
[kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/). A custom `stylus.path` can be added during the
[Install Palette Agent](../../deployment-modes/agent-mode/install-agent-host.md#install-palette-agent) steps.

:::tip

Refer to
[Identify the Target Agent Version](../../clusters/edge/cluster-management/agent-upgrade-airgap.md#identify-the-target-agent-version)
for guidance in retrieving your Palette agent version number.

:::

<!-- prettier-ignore -->
To resolve this scenario, add a cloud-init stage to your <VersionedLink text="BYOS Edge OS" url="/integrations/packs/?pack=edge-native-byoi" />
pack configuration by following the debug steps below.

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Profiles**.

3. On the **Profiles** page, find and click on your cluster profile.

4. Select the **OS** layer of your cluster profile.

5. Click **Values** in the **Pack Details** section. In the YAML editor, add the following entry.

   ```yaml
   stages:
     initramfs:
       - name: "Workaround for kubeadm path issue in Palette agent v4.5.14"
         if: "[ ! -f /usr/bin/kubeadm ]"
         commands:
           - cp <customStylusPath>/usr/bin/kubeadm /usr/bin/
           - reboot now
   ```

   Replace `<customStylusPath>` with the custom `stylus.path` you provided in the **user-data** file during the
   [Install Palette Agent](../../deployment-modes/agent-mode/install-agent-host.md#install-palette-agent) steps, as
   demonstrated in the following example.

   ```yaml hideClipboard {7-13}
   pack:
     content:
       images:
         - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
   options:
   ---
   stages:
     initramfs:
       - name: "Workaround for kubeadm path issue in Palette agent v4.5.14"
         if: "[ ! -f /usr/bin/kubeadm ]"
         commands:
           - cp /persistent/spectro/usr/bin/kubeadm /usr/bin/
           - reboot now
   ```

6. Click **Confirm Updates** to save your changes.

7. Click **Save Changes** on the cluster profile page.

8. Deploy your cluster using the updated cluster profile.

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

When you upgrade your cluster from RKE2 1.29 to 1.30 and your cluster uses the Cilium Container Network Interface (CNI),
the upgrade could fail with error messages similar to the following. This is due to an
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

## Download Node Logs from Edge Clusters

If you experience issues with your Edge cluster control plane or workloads, you can download the logs of your cluster
nodes to help investigate the root cause as long as your cluster is in **Healthy** status.

The downloaded log archive includes the following systemd service log files as well as other log files related to the
Palette agent:

- **stylus-agent.service**
- **stylus-operator.service**
- **spectro-stylus-agent.service**
- **spectro-stylus-operator.service**
- **k3s.service**
- **k3s-agent.service**
- **rke2.service**
- **rke2-agent.service**
- **/var/log/stylus-upgrade.log**
- **/var/log/stylus-upgrade-script.log**
- **/var/log/stylus-init-upgrade.log**
- **/var/log/kube-init.log**
- **/var/log/kube-join.log**
- **/var/log/kube-upgrade.log**
- **/var/log/kube-post-init.log**
- **/proc/cmdline**

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Clusters**.

3. Select the cluster whose logs you want to download.

4. In the upper-right corner of the cluster page, click **Settings**.

5. In the **drop-down Menu** that appears, click **Download Logs**.

6. Check the **Node Logs** box and click **Download**. You may also download logs from other components at the same
   time.

## Scenario - Kubelet Process Cannot Access kubeadm-flags

If using the FIPS version of [Agent Mode](../../deployment-modes/agent-mode/install-agent-host.md) on a Rocky Linux edge
host, SELinux may incorrectly label the **kubeadm-flags.env** file during cluster deployment or when certain
configurations are adjusted, preventing the Kubelet from accessing it and properly managing the cluster. To resolve this
issue, reset the SELinux context of the Kubelet environment variable to its default state based on SELinux policy rules.

### Debug Steps

1. After deploying the cluster, monitor the Kubelet status.

   ```shell
   systemctl status kubelet
   ```

2. Check the logs for messages related to SELinux denials and **kubeadm-flags.env**.

   ```shell
   ausearch -message avc --start recent | grep kubeadm-flags.env
   ```

   The following output indicates that SELinux security policies are denying read operations attempted by the Kubelet.

   ```shell hideClipboard
   time->Wed Jan 17 14:32:01 2025
   type=AVC msg=audit(1673968321.452:456): avc:  denied  { read } for  pid=1234 comm="kubelet" name="kubeadm-flags.env" dev="sda1" ino=56789 scontext=system_u:system_r:kubelet_t:s0 tcontext=unconfined_u:object_r:default_t:s0 tclass=file permissive=0
   ```

3. Reset the SELinux context of the Kubelet environment variable to its default state.

   ```shell
   restorecon -v /var/lib/kubelet/kubeadm-flags.env
   ```

4. Restart the Kubelet to apply your changes.

   ```shell
   systemctl restart kubelet
   ```

## Scenario - Agent Mode Deployments CNI Folder Permission Issues

Agent mode clusters that use PKX-E as the Kubernetes layer have the contents of the `/opt/cni/bin` folder set
incorrectly. This prevents the CNI that do not run as root, such as Cilium, from operating.

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Profiles**.

3. Click on the profile used by your agent mode cluster.

4. In the OS pack of your agent mode cluster profile, configure the following cloud-init stages. The same commands are
   executed in multiple stages to ensure that they take effect.

   ```yaml
   stages:
   boot.before:
      - name: "Ensure CNI directory permissions on restart"
         if: '[ -d /opt/cni/bin ]'
         commands:
         - chown root:root -R /opt/cni/bin
   boot:
      - name: "Ensure CNI directory permissions on restart"
         if: '[ -d /opt/cni/bin ]'
         commands:
         - chown root:root -R /opt/cni/bin
   boot.after:
      - name: "Ensure CNI directory permissions on restart"
         if: '[ -d /opt/cni/bin ]'
         commands:
         - chown root:root -R /opt/cni/bin
   ```

5. Save the changes as a new version of the cluster profile and update your agent mode cluster to use the updated
   profile. For more information, refer to [Update a Cluster](../../clusters/cluster-management/cluster-updates.md).
