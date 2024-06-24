---
sidebar_label: "Palette Upgrade"
title: "Palette Upgrade"
description: "Troubleshooting steps for errors encountered with upgrade actions."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["troubleshooting", "palette-upgrade"]
---

We recommend you review the [Release Notes](../release-notes/release-notes.md) and the
[Upgrade Notes](../enterprise-version/upgrade/upgrade.md) before attempting to upgrade Palette. Use this information to
address common issues that may occur during an upgrade.

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

## Mongo DNS Configmap Value is Incorrect

In VMware vSphere VerteX installations, if you encounter an error during the upgrade process where the MongoDB DNS
ConfigMap value is incorrect, use the following steps to resolve the issue.

### Debug Steps

1. Open up a terminal session in an environment that has network access to the Kubernetes cluster. Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) for additional guidance.

2. Verify the pods in the `hubble-system` namespace are not starting correctly by issuing the following command.

   ```shell
   kubectl get pods --namespace=hubble-system
   ```

3. Verify the configmap for the _configserver_ in the _hubble-system_ namespace contains the incorrect host value
   `mongo-1.mongohubble-system.svc.cluster`. Use the following command to describe the configmap and search for the host
   value.

   ```shell
   kubectl describe configmap configserver --namespace hubble-system |grep host
   ```

   ```shell hideClipboard
    host: mongo-0.mongo.hubble-system.svc.cluster.local,mongo-1.mongohubble-system.svc.cluster.local,mongo-2.mongo.hubble-system.svc.cluster.local
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
    host: '0.0.0.0'
   ```

4. If the host value is incorrect, log in to the System Console. You can find guidance on how to access the System
   Console in the
   [Access the System Console](../vertex/system-management/system-management.md#access-the-system-console)
   documentation.

5. Navigate to the **Main Menu** and select **Enterprise Cluster**. From the **System Profiles** page, select the
   **Spectro** pack.

   ![A view of the Spectro pack in the System Profiles page](/troubleshooting_enterprise_install_system-profile-pack.webp)

6. In the YAML editor, locate the parameter `databaseUrl` and update the value
   `mongo-1.mongohubble-system.svc.cluster.local` to `mongo-1.mongo.hubble-system.svc.cluster.local`.

   Below is what the updated `databaseUrl` value should look like.

   ```yaml
   databaseUrl: "mongo-0.mongo.hubble-system.svc.cluster.local,mongo-1.mongo.hubble-system.svc.cluster.local,mongo-2.mongo.hubble-system.svc.cluster.local"
   ```

7. Click **Save** to apply the changes.

8. Verify the system pods are starting correctly by issuing the following command.

   ```shell
   kubectl get pods --namespace=hubble-system
   ```

   ```hideClipboard text
     NAME                                   READY   STATUS    RESTARTS   AGE
     auth-64b88d97dd-5z7ph                  1/1     Running   0          31m
     auth-64b88d97dd-bchr7                  1/1     Running   0          31m
     cloud-b8796c57d-5r7d9                  1/1     Running   0          31m
     cloud-b8796c57d-xpbx7                  1/1     Running   0          31m
     configserver-778bd7c4c9-mrtc6          1/1     Running   0          31m
     event-5869c6bd75-2n7jl                 1/1     Running   0          31m
     event-5869c6bd75-xnvmj                 1/1     Running   0          31m
     foreq-679c7b7f6b-2ts2v                 1/1     Running   0          31m
     hashboard-9f865b6c8-c52bb              1/1     Running   0          31m
     hashboard-9f865b6c8-rw6p4              1/1     Running   0          31m
     hutil-54995bfd6b-sh4dt                 1/1     Running   0          31m
     hutil-54995bfd6b-tlqbj                 1/1     Running   0          31m
     memstore-7584fdd94f-479pj              1/1     Running   0          31m
     mgmt-68c8dbfd58-8gxsx                  1/1     Running   0          31m
     mongo-0                                2/2     Running   0          29m
     mongo-1                                2/2     Running   0          30m
     mongo-2                                2/2     Running   0          30m
     msgbroker-7d7655559b-zxxfq             1/1     Running   0          31m
     oci-proxy-6fdf95885f-qw58g             1/1     Running   0          31m
     reloader-reloader-845cfd7fdf-2rq5t     1/1     Running   0          31m
     spectrocluster-5c4cb4ff58-658w9        1/1     Running   0          31m
     spectrocluster-5c4cb4ff58-fn8g5        1/1     Running   0          31m
     spectrocluster-5c4cb4ff58-zvwfp        1/1     Running   0          31m
     spectrocluster-jobs-5b54bf6bcf-mtgh8   1/1     Running   0          31m
     system-6678d47874-464n6                1/1     Running   0          31m
     system-6678d47874-rgn55                1/1     Running   0          31m
     timeseries-6564699c7d-b6fnr            1/1     Running   0          31m
     timeseries-6564699c7d-hvv94            1/1     Running   0          31m
     timeseries-6564699c7d-jzmnl            1/1     Running   0          31m
     user-866c7f779d-drf9w                  1/1     Running   0          31m
     user-866c7f779d-rm4hw                  1/1     Running   0          31m
   ```
