---
sidebar_label: "Enterprise Install"
title: "Enterprise Install"
description: "Troubleshooting steps for errors encountered when installing an Enterprise Cluster."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["troubleshooting", "self-hosted", "palette", "vertex"]
---

Refer to the following sections to troubleshoot errors encountered when installing an Enterprise Cluster.

## Scenario - Self-Linking Error

When installing an Enterprise Cluster, you may encounter an error stating that the enterprise cluster is unable to
self-link. Self-linking is the process of Palette or VerteX becoming aware of the Kubernetes cluster it is installed on.
This error may occur if the self-hosted pack registry specified in the installation is missing the Certificate Authority
(CA). This issue can be resolved by adding the CA to the pack registry.

### Debug Steps

1. Log in to the pack registry server that you specified in the Palette or VerteX installation.

2. Download the CA certificate from the pack registry server. Different OCI registries have different methods for
   downloading the CA certificate. For Harbor, check out the
   [Download the Harbor Certificate](https://goharbor.io/docs/1.10/working-with-projects/working-with-images/pulling-pushing-images/#download-the-harbor-certificate)
   guide.

3. Log in to the system console. Refer to
   [Access Palette system console](../enterprise-version/system-management/system-management.md#access-the-system-console)
   or [Access Vertex system console](../vertex/system-management/system-management.md#access-the-system-console) for
   additional guidance.

4. From the left navigation menu, select **Administration** and click on the **Pack Registries** tab.

5. Click on the **three-dot Menu** icon for the pack registry that you specified in the installation and select
   **Edit**.

6. Click on the **Upload file** button and upload the CA certificate that you downloaded in step 2.

7. Check the box **Insecure Skip TLS Verify** and click on **Confirm**.

![A pack registry configuration screen.](/troubleshooting_enterprise-install_pack-registry-tls.webp)

After a few moments, a system profile will be created and Palette or VerteX will be able to self-link successfully. If
you continue to encounter issues, contact our support team by emailing
[support@spectrocloud.com](mailto:support@spectrocloud.com) so that we can provide you with further guidance.

## Scenario - Enterprise Backup Stuck

In the scenario where an enterprise backup is stuck, a restart of the management pod may resolve the issue. Use the
following steps to restart the management pod.

### Debug Steps

1. Open up a terminal session in an environment that has network access to the Kubernetes cluster. Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) for additional guidance.

2. Identify the `mgmt` pod in the `hubble-system` namespace. Use the following command to list all pods in the
   `hubble-system` namespace and filter for the `mgmt` pod.

   ```shell
   kubectl get pods --namespace hubble-system | grep mgmt
   ```

   ```shell hideClipboard
   mgmt-f7f97f4fd-lds69                   1/1     Running   0             45m
   ```

3. Restart the `mgmt` pod by deleting it. Use the following command to delete the `mgmt` pod. Replace `<mgmt-pod-name>`
   with the actual name of the `mgmt` pod that you identified in step 2.

   ```shell
   kubectl delete pod <mgmt-pod-name> --namespace hubble-system
   ```

   ```shell hideClipboard
   pod "mgmt-f7f97f4fd-lds69" deleted
   ```

## Scenario - Non-Unique vSphere CNS Mapping

In Palette and VerteX releases 4.4.8 and earlier, Persistent Volume Claims (PVCs) metadata do not use a unique
identifier for self-hosted Palette clusters. This causes incorrect Cloud Native Storage (CNS) mappings in vSphere,
potentially leading to issues during node operations and upgrades.

This issue is resolved in Palette and VerteX releases starting with 4.4.14. However, upgrading to 4.4.14 will not
automatically resolve this issue. If you have self-hosted instances of Palette in your vSphere environment older than
4.4.14, you should execute the following utility script manually to make the CNS mapping unique for the associated PVC.

### Debug Steps

1. Ensure your machine has network access to your self-hosted Palette instance with `kubectl`. Alternatively, establish
   an SSH connection to a machine where you can access your self-hosted Palette instance with `kubectl`.

2. Log in to your self-hosted Palette instance System Console.

3. In the **Main Menu**, click **Enterprise Cluster**.

4. In the cluster details page, scroll down to the **Kubernetes Config File** field and download the kubeconfig file.

5. Issue the following command to download the utility script.

   ```bash
   curl --output csi-helper https://software.spectrocloud.com/tools/csi-helper/csi-helper
   ```

6. Adjust the permission of the script.

   ```bash
   chmod +x csi-helper
   ```

7. Issue the following command to execute the utility script. Replace the placeholder with the path to your kubeconfig
   file.

   ```bash
   ./csi-helper --kubeconfig=<PATH_TO_KUBECONFIG>
   ```

8. Issue the following command to verify that the script has updated the cluster ID.

   ```bash
   kubectl describe configmap vsphere-cloud-config --namespace=kube-system
   ```

   If the update is successful, the cluster ID in the ConfigMap will have a unique ID assigned instead of
   `spectro-mgmt/spectro-mgmt-cluster`.

   ```hideClipboard {12}
   Name:         vsphere-cloud-config
   Namespace:    kube-system
   Labels:       component=cloud-controller-manager
               vsphere-cpi-infra=config
   Annotations:  cluster.spectrocloud.com/last-applied-hash: 17721994478134573986

   Data
   ====
   vsphere.conf:
   ----
   [Global]
   cluster-id = "896d25b9-bfac-414f-bb6f-52fd469d3a6c/spectro-mgmt-cluster"

   [VirtualCenter "vcenter.spectrocloud.dev"]
   insecure-flag = "true"
   user = "example@vsphere.local"
   password = "************"

   [Labels]
   zone = "k8s-zone"
   region = "k8s-region"


   BinaryData
   ====

   Events:  <none>
   ```

## Scenario - "Too Many Open Files" in Management Cluster

When viewing logs for enterprise management clusters or management clusters using a [Private Cloud Gateway](../clusters/pcg/pcg.md), you may encounter a "too many open files" error, which prevents logs from tailing after a certain point. To resolve this issue, you must increase the maximum number of file descriptors for each node on your cluster. 

### Debug Steps

Repeat the following process for each node in your management cluster.

1. Log in to a node in your management cluster.
   
   ```bash
   ssh -i <key-name> <user@hostname>
   ```
   
2. Switch to `sudo` mode.
   
   ```bash
   sudo --login
   ```

3. Increase the maximum number of file descriptors that the kernel can allocate system-wide.
     
   ```bash
   echo "fs.file-max = 1000000" > /etc/sysctl.d/99-maxfiles.conf
   ```

4. Apply the updated `sysctl` settings.

   ```bash
   sysctl -p /etc/sysctl.d/99-maxfiles.conf
   ```

5. Restart the `kubelet` and `containerd` services.

   ```bash
   systemctl restart kubelet containerd
   ```