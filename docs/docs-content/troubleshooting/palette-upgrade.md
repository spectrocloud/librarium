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

```text hideClipboard
Error: UPGRADE FAILED: failed to create resource: admission webhook "validate.nginx.ingress.kubernetes.io" denied the request: host "_" and path "/v1/oidc" is already defined in ingress default/hubble-auth-oidc-ingress-resource
```

### Debug Steps

1. Connect to the cluster using the cluster's kubeconfig file. Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) for additional guidance.

2. Identify all Ingress resources that belong to _Hubble_ - an internal Palette component.

   ```shell
   kubectl get ingress --namespace default
   ```

3. Remove each Ingress resource listed in the output that starts with the name Hubble. Use the following command to
   delete an Ingress resource. Replace `REPLACE_ME` with the name of the Ingress resource you are removing.

   ```shell
   kubectl delete ingress --namespace default <REPLACE_ME>
   ```

4. Restart the upgrade process.

## Mongo DNS Configmap Value is Incorrect

In VMware vSphere VerteX installations, if you encounter an error during the upgrade process where the MongoDB DNS
ConfigMap value is incorrect, use the following steps to resolve the issue.

### Debug Steps

1. Open up a terminal session in an environment that has network access to the Kubernetes cluster. Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) for additional guidance.

2. Verify that the pods in the `hubble-system` namespace are not starting correctly by issuing the following command.

   ```shell
   kubectl get pods --namespace=hubble-system
   ```

3. Verify that the configmap for the _configserver_ in the _hubble-system_ namespace contains the incorrect host value
   `mongo-1.mongohubble-system.svc.cluster`. Use the following command to describe the configmap and search for the host
   value.

   ```shell
   kubectl describe configmap configserver --namespace hubble-system | grep host
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
