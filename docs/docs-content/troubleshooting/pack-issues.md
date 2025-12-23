---
sidebar_label: "Packs"
title: "Packs"
description: "Troubleshooting steps for common Pack scenarios."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["troubleshooting", "packs"]
---

The following are common scenarios that you may encounter when using Packs.

## Scenario - Pods with NamespaceLabels are Stuck on Deployment

When deploying a workload cluster with packs that declare `namespaceLabels`, the associated Pods never start if the
cluster was deployed via self-hosted [Palette](../enterprise-version/enterprise-version.md) or
[Palette VerteX](../vertex/vertex.md) or if the `palette-agent` ConfigMap has `data.feature.workloads: disable`. This is
due to the necessary labels not being applied to the target namespace, resulting in the namespace lacking the elevated
privileges the Pods require and the Kubernetes’ PodSecurity admission blocks the Pods.

To resolve this issue, force-apply the PodSecurity policies directly to the namespace of the affected Pods.

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**. Choose the affected cluster.

3. On the cluster **Overview** tab, click the **Kubeconfig file** link to download the cluster's `kubeconfig` file.

4. Open a terminal session and set the `KUBECONFIG` environment variable to the path of the `kubeconfig` file.

   ```bash
   export KUBECONFIG=<path-to-kubeconfig-file>
   ```

5. Use `kubectl` to identify any Pods in the cluster that are not running. Note the namespace that belongs to the Pods
   associated with the pack using `namespaceLabels`.

   ```bash
   kubectl get pods --all-namespaces --field-selector status.phase!=Running
   ```

   ```bash title="Example output" hideClipboard
   NAME                                                  READY   STATUS                     RESTARTS   AGE
   lb-metallb-helm-metallb-full-speaker-abcde            0/1     Pending                    0          3m
   lb-metallb-helm-metallb-full-speaker-fghij            0/1     CreateContainerConfigError 0          3m
   ```

6. Confirm the namespace is missing the `privileged` labels. Replace `<namespace>` with the namespace of the affected
   Pods.

   ```bash
   kubectl get namespace <namespace> --show-labels
   ```

   ```bash title="Example output" hideClipboard
   NAME             STATUS   AGE    LABELS
   metallb-system   Active   10m    kubernetes.io/metadata.name=metallb-system
   ```

7. Force-apply the `privileged` labels to the namespace.

   ```bash
   kubectl label namespace <namespace> \
     pod-security.kubernetes.io/enforce=privileged \
     pod-security.kubernetes.io/audit=privileged \
     pod-security.kubernetes.io/warn=privileged \
     --overwrite
   ```

8. Verify the labels are now present.

   ```bash
   kubectl get namespace <namespace> --show-labels
   ```

   ```bash title="Example output" hideClipboard
   NAME             STATUS   AGE    LABELS
   metallb-system   Active   12m    kubernetes.io/metadata.name=metallb-system,
                                       pod-security.kubernetes.io/enforce=privileged,
                                       pod-security.kubernetes.io/audit=privileged,
                                       pod-security.kubernetes.io/warn=privileged
   ```

9. Delete the stuck Pods so that they pick up the new labels.

```bash
kubectl delete pods --namespace <namespace> --all
```

10. Wait for the Pods to be redeployed and come up in a `Running` state.

```bash
kubectl get pods --namespace <namespace>
```

```bash title="Example output"
NAME                                                  READY   STATUS    RESTARTS   AGE
lb-metallb-helm-metallb-full-speaker-abcde            1/1     Running   0          30s
lb-metallb-helm-metallb-full-speaker-fghij            1/1     Running   0          30s
```

## Scenario - Calico Fails to Start when IPv6 is Enabled

When deploying clusters with the <VersionedLink text="Calico" url="/integrations/packs/?pack=cni-calico"/> pack and IPv6
enabled, Calico fails to start on hosts running specific Linux kernel versions due to missing or incompatible kernel
modules required for `ip6tables` `MARK` support. You can observe the following error in the pod logs.

```shell
Failed to execute ip(6)tables-restore command error=exit status 2 errorOutput=... MARK: bad value for option \"--set-mark\", or out of range (0–4294967295)...
```

There are several possible ways to troubleshoot this issue:

- Use a Container Network Interface (CNI) other than Calico. This is a preferred approach if Calico is optional.
- [Use an unaffected or fixed kernel version](#debug-steps---use-an-unaffected-or-fixed-kernel-version). This is a
  preferred approach if you need Calico and IPv6.
- [Disable IPv6 on the Calico pack level](#debug-steps---disable-ipv6-on-the-calico-pack-level). This is a preferred
  approach if you need Calico but not IPv6.
- [Disable IPv6 on the BYOS Edge OS pack level](#debug-steps---disable-ipv6-on-the-byos-edge-os-pack-level). We do not
  recommend using this approach on its own, as it may not fully resolve the issue. For completeness, pair it with
  disabling IPv6 at the Calico pack level.
- [Disable IPv6 in User Data for Edge Deployment](#debug-steps---disable-ipv6-in-user-data-for-edge-deployment). We do
  not recommend using this approach on its own, as it may not fully resolve the issue. For completeness, pair it with
  disabling IPv6 at the Calico pack level.

### Debug Steps - Use an Unaffected or Fixed Kernel Version

1. Check your current kernel version using the command below.

   ```shell
   uname --kernel-release
   ```

2. Compare your version with the affected list below.

   | Branch         | Affected Versions      | Fixed Version |
   | -------------- | ---------------------- | ------------- |
   | 5.15.0 generic | 5.15.0-127, 5.15.0-128 | 5.15.0-130    |
   | 6.8.0 generic  | 6.8.0-57, 6.8.0-58     | 6.8.0-60      |
   | 6.8.0 cloud    | 6.8.0-1022             | 6.8.0-1027    |

3. If your current kernel version matches any affected version, update it to a fixed or unaffected version. The method
   for updating depends on your deployment environment.

   :::warning

   When updating kernel version for Edge deployments, ensure that the `UPDATE_KERNEL` parameter value in the `.arg` file
   is `false`. This prevents Kairos from updating the kernel during runtime upgrades.

   :::

#### Example - Pin Kernel Version in Kairos Base Image (`Dockerfile.ubuntu`)

Use this approach if you are building a Kairos image from `Dockerfile.ubuntu` and want to pin the kernel version.

1. Clone the [Kairos GitHub Repository](https://github.com/kairos-io/kairos) and check out the required version.

   ```shell
   git clone https://github.com/kairos-io/kairos.git
   cd kairos
   git checkout v3.1.3
   ```

2. Customize the `images/Dockerfile.ubuntu` file. Remove the following lines.

   ```dockerfile
   RUN [ -z "$(ls -A /boot/vmlinuz*)" ] && apt-get install -y --no-install-recommends \
       linux-image-generic-hwe-24.04 || true
   RUN apt-get clean && rm -rf /var/lib/apt/lists/*
   ```

   Paste the following lines instead. In this example, the kernel version is set to `6.8.0-60-generic`. Replace it with
   the required version.

   ```dockerfile
   RUN [ -z "$(ls -A /boot/vmlinuz*)" ] && apt-get install --yes --no-install-recommends \
      linux-image-6.8.0-60-generic linux-modules-extra-6.8.0-60-generic || true
   RUN apt-get clean && rm -rf /var/lib/apt/lists/*
   ```

3. Issue the following command to generate a custom Kairos base image. For Trusted Boot (Unified Kernel Image) builds,
   replace `--BOOTLOADER=grub` with `--BOOTLOADER=systemd-boot`.

   ```shell
   ./earthly.sh +base-image \
    --FLAVOR=ubuntu \
    --FLAVOR_RELEASE=24.04 \
    --FAMILY=ubuntu \
    --MODEL=generic \
    --VARIANT=core \
    --BASE_IMAGE=ubuntu:24.04 \
    --BOOTLOADER=grub
   ```

4. Once the build is complete, tag the image for your registry and version.

   ```shell
   docker tag <local-image> <your-registry>/<your-kairos-image>:<your-version>
   ```

   ```shell title="Example"
   docker tag kairos/ubuntu-core-base:latest my-registry.io/kairos/kairos-base:6.8.0-60
   ```

5. Push the image to your registry.

   ```shell title="Example"
   docker push my-registry.io/kairos/kairos-base:6.8.0-60
   ```

6. Set the `BASE_IMAGE` value in the `.arg` file in the `CanvOS` directory to the image name.

   ```shell title="Example"
   BASE_IMAGE=my-registry.io/kairos/kairos-base:6.8.0-60
   ```

7. Build the custom provider image and use it for cluster deployment.

   :::info

   For more information on how to build provider images and ISO artifacts for Edge deployments and how to use them in
   your cluster setup, refer to
   [Build Edge Artifacts](../clusters/edge/edgeforge-workflow/palette-canvos/palette-canvos.md).

   :::

#### Example - Pin Kernel Version with Full Boot Configuration (`Dockerfile`)

Use this approach if you are building a Kairos image from a `Dockerfile` and need full control over the kernel and boot
configuration.

1. Customize the `Dockerfile` in the `CanvOS` directory. For example, add the command below to set a specific kernel
   version for Ubuntu. Replace `6.8.0-60-generic` with the required version.

   ```dockerfile
   ...
   ########################### Add any other image customizations here #######################
   # Install specific kernel version if KERNEL_VERSION is provided
   RUN if [ "${OS_DISTRIBUTION}" = "ubuntu" ]; then \
           apt-get update && \
           apt-get install --yes "linux-image-6.8.0-60-generic" "linux-headers-6.8.0-60-generic" "linux-modules-6.8.0-60-generic" && \
           apt-get purge --yes $(dpkg-query --list | awk '/^ii\s+linux-(image|headers|modules)/ {print $2}' | grep --invert-match "6.8.0-60-generic") && \
           apt-get autoremove --yes && \
           rm --recursive --force /var/lib/apt/lists/* && \
           kernel=$(ls /boot/vmlinuz-* | grep "6.8.0-60-generic" | head --lines=1) && \
           ln --symbolic --force "${kernel#/boot/}" /boot/vmlinuz && \
           kernel=$(ls /lib/modules | grep "6.8.0-60-generic" | head --lines=1) && \
           dracut --force "/boot/initrd-${kernel}" "${kernel}" && \
           ln --symbolic --force "initrd-${kernel}" /boot/initrd && \
           depmod --all "${kernel}"; \
       fi; \
   ```

   :::info

   For more information on how to build provider images and ISO artifacts for Edge deployments and how to use them in
   your cluster setup, refer to
   [Build Edge Artifacts](../clusters/edge/edgeforge-workflow/palette-canvos/palette-canvos.md). For details on
   `Dockerfile` usage in EdgeForge, refer to the advanced workflow.

   :::

2. Build the required image and use it for cluster deployment.

#### Example - Pin Kernel Version During MAAS Provisioning

Use this approach if you want to override the kernel during MAAS provisioning without rebuilding the OS image.

1. To pin the kernel version during host provisioning with MAAS, create or modify the appropriate file depending on the
   image type you're deploying:

   - If you are using MAAS to deploy an official unmodified Ubuntu image for Agent Mode clusters, create the
     `/var/lib/snap/maas/current/preseeds/curtin_userdata_ubuntu` file.
   - If you are using MAAS to deploy a custom OS image, modify the
     `/var/lib/snap/maas/current/preseeds/curtin_userdata_custom` file.

   In both cases, add the following contents to pin the kernel. Replace `6.8.0-60-generic` with the required version.

   <!-- prettier-ignore -->
   ```yaml
   #cloud-config
   kernel:
     package: linux-image-6.8.0-60-generic
     flavor: hwe
   debconf_selections:
     maas: |
       {{for line in str(curtin_preseed).splitlines()}}
       {{line}}
       {{endfor}}
   late_commands:
     maas: [wget, '--no-proxy', {{node_disable_pxe_url|escape.json}}, '--post-data', {{node_disable_pxe_data|escape.json}}, '-O', '/dev/null']
     extra_modules: ["curtin", "in-target", "--", "apt", "install", "--yes", "linux-modules-extra-6.8.0-60-generic"]
   ```

2. Deploy the node through MAAS to apply the pinned kernel during installation. Refer to
   [Create and Manage MAAS Clusters](../clusters/data-center/maas/create-manage-maas-clusters.md) for the details.

### Debug Steps - Disable IPv6 on the Calico Pack Level

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles**.

3. On the **Profiles** page, click on your cluster profile, which uses Calico as the network pack.

4. Click on the Calico pack to view the **Edit Pack** page.

5. In the pack's YAML file, uncomment the following parameter and set its value to `false`.

   ```yaml
   env:
     calicoNode:
       FELIX_IPV6SUPPORT: false
   ```

6. Click **Confirm Updates** after making the required changes.

7. Click **Save Changes** on the cluster profile page.

8. Deploy a new cluster using this profile or update an existing cluster to apply the change.

### Debug Steps - Disable IPv6 on the BYOS Edge OS Pack Level

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles**.

3. On the **Profiles** page, click on your cluster profile that uses the BYOS Edge OS pack.

4. Click on the BYOS pack to view the **Edit Pack** page.

5. In the pack's YAML file, add the following lines.

   ```yaml
   stages:
     boot:
       - name: disable-ipv6
         commands:
           - sysctl --write net.ipv6.conf.all.disable_ipv6=1
           - sysctl --write net.ipv6.conf.default.disable_ipv6=1
   ```

6. Click **Confirm Updates** after making the required changes.

7. Click **Save Changes** on the cluster profile page.

8. Deploy a new cluster using this profile.

   If the cluster is already operating and you need to update it, reboot the nodes. Establish an SSH connection to each
   node and use the following command to trigger a reboot.

   ```shell
   sudo reboot
   ```

### Debug Steps - Disable IPv6 in User Data for Edge Deployment

1. Add the following lines to the `user-data` file.

   ```yaml
   stages:
     boot:
       - name: disable-ipv6
         commands:
           - sysctl --write net.ipv6.conf.all.disable_ipv6=1
           - sysctl --write net.ipv6.conf.default.disable_ipv6=1
   ```

2. If you don't have an ISO image or the cluster is already operating, build a new ISO image and deploy (or redeploy)
   the cluster.

   If you already have an ISO image, but the cluster is not operating yet, create an ISO file containing the additional
   user data and apply the changes. Refer to
   [Apply Site User Data](../clusters/edge/site-deployment/site-installation/site-user-data.md) for more information.

## Scenario - AWS EKS Cluster Deployment Fails when Cilium is Used as CNI

<!-- prettier-ignore-start -->

When deploying AWS EKS clusters using the <VersionedLink text="Cilium" url="/integrations/packs/?pack=cni-cilium-oss"/>
pack, worker node provisioning fails due to the AWS VPC CNI and Cilium CNI clashing. This is because installation
of the AWS VPC CNI cannot be disabled by default on EKS cluster nodes. To resolve this issue, you must configure specific values for certain parameters in the Cilium pack.

<!-- prettier-ignore-end -->

:::warning

You must use a pre-created static VPC for EKS deployments using Cilium.

:::

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. On the **Profiles** page, select your EKS cluster profile that uses Cilium as the network pack.

4. Select the Cilium layer to view the pack **Values** on the **Edit Pack** page.

5. Expand the **Presets** drawer.

6. In the **Kube-proxy replacement** section, select **Replace Kube-Proxy With EBPF**.

7. Review the following parameters and adjust to the required values as needed.

   | **Parameter**                                       | **Required Value** | **Description**                                                                                                                            |
   | --------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
   | `charts.cilium.bpf.masquerade`                      | `false`            | Disables eBPF masquerading because AWS handles NAT and IP masquerading through the ENI interface.                                          |
   | `charts.cilium.endpointRoutes.enabled`              | `true`             | Enables per-endpoint routing to allow direct pod-to-pod communication in ENI mode without encapsulation.                                   |
   | `charts.cilium.eni.enabled`                         | `true`             | Enables AWS ENI integration for direct networking instead of using an overlay network.                                                     |
   | `charts.cilium.ipam.mode`                           | `"eni"`            | Uses AWS ENI-based IP address management (IPAM) to allocate pod IPs directly from AWS VPC subnets.                                         |
   | `charts.cilium.enableIPv4Masquerade`                | `false`            | Disables IPv4 masquerading for outgoing packets because AWS ENI mode provides direct pod-to-pod routing without NAT.                       |
   | `charts.cilium.enableIPv6Masquerade`                | `false`            | Disables IPv6 masquerading for outgoing packets because AWS handles IPv6 routing without the need for masquerading.                        |
   | `charts.cilium.kubeProxyReplacement`                | `"true"`           | Enables eBPF-based kube-proxy replacement because kube-proxy is disabled, and Cilium must handle service load balancing.                   |
   | `charts.cilium.kubeProxyReplacementHealthzBindAddr` | `0.0.0.0:10256`    | Binds the health check service to `0.0.0.0:10256` for the kube-proxy replacement.                                                          |
   | `charts.cilium.autoDirectNodeRoutes`                | `false`            | Disables automatic direct routing between nodes because AWS ENI mode already manages routing, making additional direct routes unnecessary. |
   | `charts.cilium.routingMode`                         | `native`           | Uses native routing mode because AWS ENI mode supports direct pod-to-pod routing, making encapsulation unnecessary.                        |

8. Select **Confirm Updates** to return to the cluster profile overview page. Select **Save Changes**.

9. In the top-right, select **Deploy > OK** to begin the cluster deployment process.

10. Enter a unique **Name** for the cluster and choose the appropriate AWS **Cloud account**. Select **Next**.

11. On the **Cluster Profile** page, select **Next**.

12. On the **Cluster Config** page, ensure you select **Enable static placement (Optional)** and provide your AWS VPC
    details.

13. Configure your remaining cluster settings as needed and deploy your cluster. Refer to
    [Create and Manage AWS EKS Cluster](../clusters/public-cloud/aws/eks.md#deploy-an-aws-eks-cluster) for additional
    guidance.

## Scenario - Control Plane Node Fails to Upgrade in Sequential MicroK8s Upgrades

In clusters that use <VersionedLink text="MicroK8s" url="/integrations/packs/?pack=kubernetes-microk8s"/> as the
Kubernetes distribution, there is a known issue when using the `InPlaceUpgrade` strategy for sequential Kubernetes
upgrades. For example, upgrading from version 1.25.x to version 1.26.x and then to version 1.27.x may cause the control
plane node to fail to upgrade. Use the following steps to troubleshoot and resolve the issue.

### Debug Steps

1. Execute the first MicroK8s upgrade in your cluster. For example, upgrade from version 1.25.x to version 1.26.x.

2. Ensure you can access your cluster using kubectl. Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) guide for more information.

3. After the first upgrade is complete, issue the following command to delete the pod named `upgrade-pod`.

   ```shell
   kubectl delete pod upgrade-pod --namespace default
   ```

4. Once the pod is deleted, proceed to the next upgrade. For example, upgrade from version 1.26.x to version 1.27.x.

5. Within a few minutes, the control plane node will be upgraded correctly.
