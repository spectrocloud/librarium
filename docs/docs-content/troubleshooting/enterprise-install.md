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

## Scenario - Self-linking Error

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
