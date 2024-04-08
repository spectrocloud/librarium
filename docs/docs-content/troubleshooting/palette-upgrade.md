---
sidebar_label: "Palette Upgrade"
title: "Palette Upgrade"
description: "Troubleshooting steps for errors encountered with upgrade actions."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["troubleshooting", "palette-upgrade"]
---

We recommend you review the [Release Notes](../release-notes.md) and the
[Upgrade Notes](../enterprise-version/upgrade.md) before attempting to upgrade Palette. Use this information to address
common issues that may occur during an upgrade.

## Ingress Errors

If you receive the following error message when attempting to upgrade to Palette versions greater than Palette 3.4.X in
a Kubernetes environment, use the debugging steps to address the issue.

<br />

```hideClipboard text
Error: UPGRADE FAILED: failed to create resource: admission webhook "validate.nginx.ingress.kubernetes.io" denied the request: host "_" and path "/v1/oidc" is already defined in ingress default/hubble-auth-oidc-ingress-resource
```

### Debug Steps

1. Connect to the cluster using the cluster's kubeconfig file. Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) for additional guidance.

2. Identify all Ingress resources that belong to _Hubble_ - an internal Palette component.

   <br />

   ```shell
   kubectl get ingress --namespace default
   ```

3. Remove each Ingress resource listed in the output that starts with the name Hubble. Use the following command to
   delete an Ingress resource. Replace `REPLACE_ME` with the name of the Ingress resource you are removing.

   <br />

   ```shell
   kubectl delete ingress --namespace default <REPLACE_ME>
   ```

4. Restart the upgrade process.

<br />

## Volume Attachment Errors Volume in VMware Environment

If you deployed Palette in a VMware vSphere environment and are experiencing volume attachment errors for the MongoDB
pods during the upgrade process, it may be due to duplicate resources in the cluster causing resource creation errors.
Palette versions between 4.0.0 and 4.3.0 are affected by a known issue where cluster resources are not receiving unique
IDs. Use the following steps to correctly identify the issue and resolve it.

### Debug Steps

1. Open up a terminal session in an environment that has network access to the Kubernetes cluster.

2. Configure kubectl CLI to connect to the self-hosted Palette or VerteX's Kubernetes cluster. Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) for additional guidance.

3. Verify the MongoDB pods are not starting correctly by issuing the following command.

   ```shell
   kubectl get pods --namespace=hubble-system --selector='app=spectro,role=mongo'
   ```

   ```shell {4} hideClipboard
   NAME      READY   STATUS              RESTARTS   AGE
   mongo-0   2/2     Running             0          17h
   mongo-1   2/2     Running             0          17h
   mongo-2   0/2     ContainerCreating   0          16m
   ```

4. Inspect the pod that is not starting correctly. Use the following command to describe the pod. Replace `mongo-2` with
   the name of the pod that is not starting.

   ```shell
   kubectl describe pod mongo-2 --namespace=hubble-system
   ```

5. Review the event output for any errors. If an error related to the volume attachment is present, proceed to the next
   step.

   ```shell hideClipboard
   Events:
   Type     Reason              Age                  From                     Message
   ----     ------              ----                 ----                     -------
   Warning  FailedAttachVolume  106s (x16 over 18m)  attachdetach-controller  AttachVolume.Attach failed for volume "pvc-94cbb8f5-9145-4b18-9bf9-ee027b64d0c7" : volume attachment is being deleted
   Warning  FailedMount         21s (x4 over 16m)    kubelet                  Unable to attach or mount volumes: unmounted volumes=[mongo-data], unattached volumes=[spectromongokey kube-api-access-sz5lz mongo-data spectromongoinit spectromongopost]: timed out waiting for the condition
   ```

6. The remaining steps may need to be performed on all MongoDB pods and their associated Persistent Volume (PV), and
   Persistent Volume Claim (PVC). Do each step sequentially for each MongoDB pod that is encountering the volume
   attachment error.

   :::warning

   Only do the steps for one MongoDB pod at a time to prevent data loss. Wait for the pod to come up correctly before
   proceeding to the next pod.

   :::

7. Delete the PVC associated with the MongoDB pod. Replace `mongo-2` with the name of the pod that is not starting.

   ```shell
   kubectl delete pvc mongo-data-mongo-2 --namespace=hubble-system
   ```

8. Delete the PV associated with the MongoDB pod. Use the following command to list all PVs and find the PV associated
   with the MongoDB pod you started with. In this example, the PV associated with `mongo-2` is
   `pvc-94cbb8f5-9145-4b18-9bf9-ee027b64d0c7`. Make a note of this name.

   ```shell
    kubectl get pv | grep 'mongo-data-mongo-2'
   ```

   ```shell hideClipboard
   pvc-94cbb8f5-9145-4b18-9bf9-ee027b64d0c7   20Gi       RWO            Delete           Bound    hubble-system/mongo-data-mongo-2   spectro-storage-class            18h
   ```

9. Using the PV name from the previous step, delete the PV.

   ```shell
   kubectl delete pv pvc-94cbb8f5-9145-4b18-9bf9-ee027b64d0c7
   ```

   :::tip

   The kubectl command may hang after issuing the delete command, press `Ctrl+C` to exit the command and proceed to the
   next step.

   :::

10. Delete the MongoDB pod that was not starting correctly. Replace `mongo-2` with the name of the pod that is not
    starting.

    ```shell
    kubectl delete pod mongo-2 --namespace=hubble-system
    ```

11. Wait for the pod to come up correctly. Use the following command to verify the pod is up and available.

    ```shell
    kubectl get pods --namespace=hubble-system --selector='app=spectro,role=mongo'
    ```

    ```shell {4} hideClipboard
    NAME      READY   STATUS              RESTARTS   AGE
    mongo-0   2/2     Running             0          18h
    mongo-1   0/2     ContainerCreating   0          4s
    mongo-2   2/2     Running             0          68s
    ```

    Palette will proceed with the upgrade and attempt to upgrade the remaining MongoDB pods. Repeat the steps for each
    of the MongoDB pods that are not starting correctly due to the volume attachment error.

The upgrade process will continue once all MongoDB pods are up and available. Verify the new nodes deployed successfully
by checking the status of the nodes. Log in to the
[system console](../enterprise-version/system-management/system-management.md#access-the-system-console), navigate to
left **Main Menu** and select **Enterprise Cluster**. The **Nodes** tab will display the status of the nodes in the
cluster.

![A view of three nodes in a healthy status](/troubleshootig_palette-upgrade_nodes-healthy.webp)

If you continue to encounter issues, contact our support team by emailing
[support@spectrocloud.com](mailto:support@spectrocloud.com) so that we can provide you with further guidance.
