---
sidebar_label: "Packs"
title: "Troubleshooting steps for errors during a cluster deployment"
description: "Troubleshooting steps for errors during a cluster deployment."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["troubleshooting", "packs"]
---

The following are common scenarios that you may encounter when using Packs.

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

<!-- prettier-ignore -->
When deploying AWS EKS clusters using the <VersionedLink text="Cilium" url="/integrations/packs/?pack=cni-cilium-oss"/>
pack, worker node provisioning fails as the AWS VPC CNI and Cilium CNI clash with each other. This is because installation
of the AWS VPC CNI cannot be disabled by default on EKS cluster nodes.

To resolve this, you will need to make the following additions and changes:

- Kube-proxy must be replaced with eBPF.
- Specific Cilium configuration parameters must be set.
- An additional manifest must be included with the Cilium pack.
- The `charts.cilium.k8sServiceHost` parameter value must be manually changed to the cluster API server endpoint during
  deployment.

Use the following debug steps to learn how to make these configuration changes and additions.

:::warning

- You must use a pre-created static VPC for EKS deployments using Cilium.
- This workaround has only been validated on Cilium 1.15.3 and above.

:::

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles**.

3. On the **Profiles** page, click on your EKS cluster profile that uses Cilium as the network pack.

4. Click on the Cilium pack to view the **Edit Pack** page.

5. Click on the **Presets** button to expand the options drawer.

6. Scroll down the presets option menu and enable **Replace kube-proxy with eBPF**.

7. Review the following parameters and adjust to the required values as needed. Some of these parameters are changed
   automatically after enabling **Replace kube-proxy with eBPF**.

   | Parameter                                           | Required Value      | Description                                                                                                                                                                                                                                                            | Change Required After Enabling Preset? |
   | --------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
   | `charts.cilium.bpf.masquerade`                      | `false`             | Disables eBPF masquerading because AWS handles NAT and IP masquerading through the ENI interface.                                                                                                                                                                      | **True**                               |
   | `charts.cilium.endpointRoutes.enabled`              | `true`              | Enables per-endpoint routing to allow direct pod-to-pod communication in ENI mode without encapsulation.                                                                                                                                                               | **True**                               |
   | `charts.cilium.eni.enabled`                         | `true`              | Enables AWS ENI integration for direct networking instead of using an overlay network.                                                                                                                                                                                 | **True**                               |
   | `charts.cilium.ipam.mode`                           | `"eni"`             | Uses AWS ENI-based IP address management (IPAM) to allocate pod IPs directly from AWS VPC subnets.                                                                                                                                                                     | **True**                               |
   | `charts.cilium.enableIPv4Masquerade`                | `false`             | Disables IPv4 masquerading for outgoing packets because AWS ENI mode provides direct pod-to-pod routing without NAT.                                                                                                                                                   | **True**                               |
   | `charts.cilium.enableIPv6Masquerade`                | `false`             | Disables IPv6 masquerading for outgoing packets because AWS handles IPv6 routing without the need for masquerading.                                                                                                                                                    | **True**                               |
   | `charts.cilium.k8sServiceHost`                      | `auto`              | Ensures Cilium correctly connects to the EKS control plane. This value will be changed during cluster deployment.                                                                                                                                                      | **False**                              |
   | `charts.cilium.k8sServicePort`                      | `"443"`             | Uses port 443 to connect to the Kubernetes API server because EKS API server communication happens over HTTPS.                                                                                                                                                         | **True**                               |
   | `charts.cilium.kubeProxyReplacement`                | `"true"`            | Enables eBPF-based kube-proxy replacement because kube-proxy is disabled, and Cilium must handle service load balancing.                                                                                                                                               | **False**                              |
   | `charts.cilium.kubeProxyReplacementHealthzBindAddr` | `0.0.0.0:10256`     | Binds the health check service to `0.0.0.0:10256` for the kube-proxy replacement.                                                                                                                                                                                      | **False**                              |
   | `charts.cilium.autoDirectNodeRoutes`                | `false`             | Disables automatic direct routing between nodes because AWS ENI mode already manages routing, making additional direct routes unnecessary.                                                                                                                             | **True**                               |
   | `charts.cilium.ipv4NativeRoutingCIDR`               | `<POD_SUBNET_CIDR>` | Set this to a CIDR block that covers all AWS VPC subnets where your worker nodes will be deployed. For example, if your worker node subnets are `10.0.64.0/18`, `10.0.128.0/18`, and `10.0.192.0/18`, set this to `10.0.0.0/16` to ensure all ranges are encapsulated. | **True**                               |
   | `charts.cilium.routingMode`                         | `native`            | Uses native routing mode because AWS ENI mode supports direct pod-to-pod routing, making encapsulation unnecessary.                                                                                                                                                    | **False**                              |

8. Click the **New manifest** option, and provide a name for the manifest, such as `job-fix-cni`. Click the tick button
   afterwards.

9. Copy the following manifest into the YAML editor. This manifest disables the `kube-proxy` and `aws-node` DaemonSets
   by applying a node selector that does not match any nodes. It also removes existing Cilium, `kube-dns`, and
   `cert-manager` pods to ensure a clean state for Cilium deployment.

   ```yaml
   apiVersion: batch/v1
   kind: Job
   metadata:
     name: ds-fix
     namespace: kube-system
   spec:
     template:
       metadata:
         name: ds-fix
       spec:
         serviceAccountName: ds-fix-sa
         hostNetwork: true
         dnsPolicy: ClusterFirstWithHostNet
         initContainers:
           - name: kubectl-init-pod-1
             image: bitnami/kubectl
             args:
               - "-n"
               - "kube-system"
               - "patch"
               - "daemonset"
               - "kube-proxy"
               - "aws-node"
               - --patch={"spec":{"template":{"spec":{"nodeSelector":{"io.cilium/aws-node-enabled":"true"}}}}}
         containers:
           - name: kubectl-pod-1
             image: bitnami/kubectl
             args:
               - "delete"
               - "pod"
               - "-n"
               - "kube-system"
               - "-l app.kubernetes.io/part-of=cilium"
           - name: kubectl-pod-2
             image: bitnami/kubectl
             args:
               - "delete"
               - "pod"
               - "-n"
               - "kube-system"
               - "-l k8s-app=kube-dns"
           - name: kubectl-pod-3
             image: bitnami/kubectl
             args:
               - "delete"
               - "pod"
               - "-n"
               - "cert-manager"
               - "--all"
         restartPolicy: Never
   ---
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: ds-fix-sa
     namespace: kube-system
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: Role
   metadata:
     name: ds-fix-role
     namespace: kube-system
   rules:
     - apiGroups:
         - apps
       resources:
         - daemonsets
       resourceNames:
         - kube-proxy
         - aws-node
       verbs:
         - get
         - patch
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRole
   metadata:
     name: ds-fix-role
   rules:
     - apiGroups:
         - ""
       resources:
         - pods
       verbs:
         - list
         - delete
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: RoleBinding
   metadata:
     name: ds-fix-rolebinding
     namespace: kube-system
   subjects:
     - kind: ServiceAccount
       name: ds-fix-sa
       namespace: kube-system
   roleRef:
     kind: Role
     name: ds-fix-role
     apiGroup: rbac.authorization.k8s.io
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRoleBinding
   metadata:
     name: ds-fix-rolebinding
   subjects:
     - kind: ServiceAccount
       name: ds-fix-sa
       namespace: kube-system
   roleRef:
     kind: ClusterRole
     name: ds-fix-role
     apiGroup: rbac.authorization.k8s.io
   ```

10. Click **Confirm Updates** after making the required changes.

11. Click **Save Changes** on the cluster profile page.

12. Click **Deploy** on the cluster profile page, and click **OK** in the pop-up window.

13. Provide the basic information for the cluster and click **Next**.

14. Click **Next** on the **Cluster Profile** page.

15. On the **Cluster Config** page, configure the cluster as required, and ensure you select **Enable static placement
    (Optional)** to provide your AWS VPC details. Click **Next** when complete.

16. Configure the remaining settings as needed, and deploy the cluster. Refer to
    [Create and Manage AWS EKS Cluster](../clusters/public-cloud/aws/eks.md#deploy-an-aws-eks-cluster) if you need
    guidance on the available options.

17. As soon as it is available, obtain the **API server endpoint** for the cluster.

    If using the AWS Console, go to **AWS > Clusters > `<clusterName>`** and view the **Overview** tab for the cluster.
    Click the clipboard icon next to the **API server endpoint** field.

    If using the AWS CLI, issue the following command to obtain the API endpoint for the cluster. Replace
    `<clusterName>` with the name of your cluster, and `<awsRegion>` with your AWS region.

    ```shell
    aws eks update-kubeconfig --region <awsRegion> --name <clusterName>
    aws eks describe-cluster --name <clusterName> --query "cluster.endpoint" --output text
    ```

    Example output.

    ```shell hideClipboard
    https://MY2567C9923FENDPOINT882F9EXAMPLE.gr7.us-east-1.eks.amazonaws.com
    ```

18. On your cluster page in Palette, click the **Profile** tab.

19. Select the Cilium layer and find the `k8sServiceHost` parameter in the YAML editor.

20. Change the value from `auto` to the cluster API server endpoint discovered in step 17, but _without_ the `https://`
    portion.

    For example, `"MY2567C9923FENDPOINT882F9EXAMPLE.gr7.us-east-1.eks.amazonaws.com"`.

21. Click **Save**.

The EKS cluster will now deploy successfully.
