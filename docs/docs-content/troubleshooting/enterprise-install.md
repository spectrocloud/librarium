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

## Scenario - Unexpected Logouts in Tenant Console After Palette/VerteX Management Appliance Installation

After installing self-hosted Palette/Palette VerteX using the
[Palette Management Appliance](../enterprise-version/install-palette/palette-management-appliance.md) or
[VerteX Management Appliance](../vertex/install-palette-vertex/vertex-management-appliance.md), you may experience
unexpected logouts when using the tenant console. This can be caused by a time skew on your Palette/VerteX management
cluster nodes, which leads to authentication issues.

To check this, open a terminal session on each node in your Palette/VerteX management cluster and issue the following
command to check the system time.

```bash
timedatectl
```

An output similar to the following will be displayed. A time skew is indicated by the `Local time` and `Universal time`
values being different across the nodes.

<Tabs>

<TabItem value="node1" label="Example output from node 1">

````shell hideClipboard

```shell hideClipboard title="Example output from node 1"
               Local time: Fri 2025-07-11 09:41:42 UTC
           Universal time: Fri 2025-07-11 09:41:42 UTC
                 RTC time: Fri 2025-07-11 09:41:42
                Time zone: UTC (UTC, +0000)
System clock synchronized: no
              NTP service: active
          RTC in local TZ: no
````

</TabItem>

<TabItem value="node2" label="Example output from node 2">

```shell hideClipboard
               Local time: Fri 2025-07-11 09:41:45 UTC
           Universal time: Fri 2025-07-11 09:41:45 UTC
                 RTC time: Fri 2025-07-11 09:41:45
                Time zone: UTC (UTC, +0000)
System clock synchronized: no
              NTP service: active
          RTC in local TZ: no
```

</TabItem>

<TabItem value="node3" label="Example output from node 3">

```shell hideClipboard
               Local time: Fri 2025-07-11 09:41:49 UTC
           Universal time: Fri 2025-07-11 09:41:49 UTC
                 RTC time: Fri 2025-07-11 09:41:49
                Time zone: UTC (UTC, +0000)
System clock synchronized: no
              NTP service: active
          RTC in local TZ: no
```

</TabItem>

</Tabs>

<!-- You may also notice errors in the auth service logs similar to the following.

```shell hideClipboard
auth-5f95c77cb-xslmk Jul  7 12:35:30.306 ERROR [err_logger.go:47/root.LogError] [reqId:r1751891730295getb911939434c9] [Unable to read the 'Authorization' cookie dat
a] [arg1=[null] code=CookieReadError mtd=GET ref=xyz uri=/v1/auth/cookie/refresh ]
auth-5f95c77cb-xslmk Jul  7 17:02:22.548 INFO [auth_broker.go:46/service.(*AuthBrokerService).AuthBroker] [reqId:r1751907742548pose5396e802750] [Client service 'all
y' got authorized] [orgId= sessionId=ally5a03 ]
auth-5f95c77cb-xslmk Jul  7 17:22:12.673 ERROR [hubble_token.go:426/hucontext.getClaimsFromToken] [Unable to parse the token 'abcd...1234' due to Token used before
issued]
auth-5f95c77cb-xslmk Jul  7 17:22:16.004 INFO [auth_login.go:450/internal.(*AuthLoginService).CreateUserToken] [reqId:r1751908935214posa171c4b915ad] [Auth success:
12345abc67890def12345abc,johndoe/johndoe@company.com - Going for MFA false] [orgId=johndoe tenantUid=12345abc67890def12345abc ]
auth-5f95c77cb-xslmk Jul  7 17:22:46.378 ERROR [hubble_token.go:426/hucontext.getClaimsFromToken] [Unable to parse the token 'abcd...1234' due to Token used before
issued]
auth-5f95c77cb-xslmk Jul  7 17:22:46.378 ERROR [auth_service.go:282/service.(*AuthService).Logout] [provided token 'xxxxx' is not valid Token used before issued]
auth-5f95c77cb-xslmk Jul  7 17:22:57.473 INFO [auth_login.go:450/internal.(*AuthLoginService).CreateUserToken] [reqId:r1751908976769pos6533ca18ccb3] [Auth success:
12345abc67890def12345abc,johndoe/johndoe@company.com - Going for MFA false] [orgId=johndoe tenantUid=12345abc67890def12345abc ]
``` -->

This indicates that the system time on your Palette/VerteX management cluster nodes is not synchronized with a Network
Time Protocol (NTP) server. To resolve this issue, you can configure an NTP server in the Palette/VerteX management
cluster settings.

### Debug Steps

1. Log in to Local UI of the leader node of your Palette/VerteX management cluster.

2. On the left main menu, click **Cluster**.

3. Click **Actions** in the top-right corner and select **Cluster Settings** from the drop-down menu.

4. In the **Network Time Protocol (NTP) (Optional)** field, enter the NTP server that you want to use for your
   Palette/VerteX management cluster. For example, you can use `pool.ntp.org` or any other NTP server that is accessible
   from your Palette/VerteX management cluster nodes.

5. Click **Save Changes** to apply the changes.

## Scenario - IP Pool Exhausted During Airgapped Upgrade

When upgrading a self-hosted airgapped cluster to version 4.6.32, the IPAM controller may report an `Exhausted IP Pools`
error despite having available IP addresses. This is due to a race condition in CAPV version 1.12.0, which may lead to
an orphaned IP claim when its associated VMware vSphere machine is deleted during the control plane rollout. When this
occurs, the IP claim and IP address are not cleaned up, keeping the IP reserved and exhausting the IP pool. To complete
the upgrade, you must manually release the orphaned claim holding the IP address.

### Debug Steps

1. Open up a terminal session in an environment that has network access to the cluster. Refer to
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) for additional guidance.

2. Issue the following command to list the IP addresses of the current nodes in the cluster.

   :::info

   The airgap support VM is not listed, only the nodes in the cluster.

   :::

   ```bash
   kubectl get nodes \
   --output jsonpath='{range .items[*]}{.status.addresses[?(@.type=="InternalIP")].address}{"\n"}{end}'
   ```

   ```bash hideClipboard title="Example output"
   10.10.227.13
   10.10.227.11
   10.10.227.14
   ```

3. List all IP claims in the `spectro-mgmt` namespace. The base `spectro-mgmt-cluster` claim belongs to the airgap
   support VM.

   ```bash
   kubectl get ipclaim --namespace spectro-mgmt
   ```

   ```bash hideClipboard title="Example output"
   NAMESPACE      NAME                                   AGE
   spectro-mgmt   spectro-mgmt-cluster                   29h
   spectro-mgmt   spectro-mgmt-cluster-cp-43978-dw858-0  14h
   spectro-mgmt   spectro-mgmt-cluster-cp-43978-p2bpg-0  29h
   spectro-mgmt   spectro-mgmt-cluster-cp-dt44d-0        14h
   spectro-mgmt   spectro-mgmt-cluster-cp-qx4vw-0        6m
   ```

4. Map each claim to its allocated IP.

   ```bash
   kubectl get ipclaim --namespace spectro-mgmt \
   --output jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.address.name}{"\n"}{end}'
   ```

   Compare the IP addresses of the nodes in the cluster to the IP addresses in the claim list, ignoring the
   `spectro-mgmt-cluster` claim of the airgap support VM. The IP that appears in the claim list that does not appear in
   the node list is the orphaned claim. In the below example, the orphaned claim is `spectro-mgmt-cluster-cp-qx4vw-0`,
   which is tied to the IP address 10.10.227.12 (`spectro-mgmt-cluster-cluster1-10-10-227-12`).

   ```bash hideClipboard title="Example output" {5}
   spectro-mgmt-cluster                   spectro-mgmt-cluster-cluster1-10-10-227-10
   spectro-mgmt-cluster-cp-43978-dw858-0  spectro-mgmt-cluster-cluster1-10-10-227-14
   spectro-mgmt-cluster-cp-43978-p2bpg-0  spectro-mgmt-cluster-cluster1-10-10-227-13
   spectro-mgmt-cluster-cp-dt44d-0        spectro-mgmt-cluster-cluster1-10-10-227-11
   spectro-mgmt-cluster-cp-qx4vw-0        spectro-mgmt-cluster-cluster1-10-10-227-12
   ```

5. Delete the orphaned claim.

   ```bash
   kubectl delete ipclaim --namespace spectro-mgmt <claim-name>
   ```

   ```bash hideClipboard title="Example command"
   kubectl delete ipclaim --namespace spectro-mgmt spectro-mgmt-cluster-cp-qx4vw-0
   ```

6. Re-run the upgrade. For guidance, refer to the applicable upgrade guide for your airgapped instance of
   [Palette](../enterprise-version/upgrade/upgrade-vmware/airgap.md) or
   [VerteX](../vertex/upgrade/upgrade-vmware/airgap.md).

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

## Scenario - "Too Many Open Files" in Cluster

When viewing logs for Enterprise or [Private Cloud Gateway](../clusters/pcg/pcg.md) clusters, you may encounter a "too
many open files" error, which prevents logs from tailing after a certain point. To resolve this issue, you must increase
the maximum number of file descriptors for each node on your cluster.

### Debug Steps

Repeat the following process for each node in your cluster.

1. Log in to a node in your cluster.

   ```bash
   ssh -i <key-name> <spectro@hostname>
   ```

2. Switch to `sudo` mode using the command that best fits your system and preferences.

   ```bash
   sudo --login
   ```

3. Increase the maximum number of file descriptors that the kernel can allocate system-wide.

   ```bash
   echo "fs.file-max = 1000000" > /etc/sysctl.d/99-maxfiles.conf
   ```

4. Apply the updated `sysctl` settings. The increased limit is returned.

   ```bash
   sysctl -p /etc/sysctl.d/99-maxfiles.conf
   ```

   ```bash hideClipboard
   fs.file-max = 1000000
   ```

5. Restart the `kubelet` and `containerd` services.

   ```bash
   systemctl restart kubelet containerd
   ```

6. Confirm that the change was applied.

   ```bash
   sysctl fs.file-max
   ```

   ```bash hideClipboard
   fs.file-max = 1000000
   ```

## Scenario - MAAS and VMware vSphere Clusters Fail Image Resolution in Non-Airgap Environments

In Palette or VerteX non-airgap installations with versions 4.2.13 to 4.5.22, MAAS and VMware vSphere clusters may fail
to provision due to image resolution errors. These environments have incorrectly configured default image endpoints. To
resolve this issue, you must manually set these endpoints.

### Debug Steps

1. Open a terminal with connectivity to your self-hosted environment.

2. Execute the following command to save the base URL of your Palette instance API to the `BASE_URL` environment value.
   Add your correct URL in place of `REPLACE_ME`.

   ```shell
   export BASE_URL="REPLACE ME"
   ```

3. Use the following command to log in to the Palette System API by using the `/v1/auth/syslogin` endpoint. Ensure you
   replace the credentials below with your system console credentials.

   ```bash
   curl --location '$BASE_URL/v1/auth/syslogin' \
   --header 'Content-Type: application/json' \
   --data '{
     "password": "**********",
     "username": "**********"
   }'
   ```

   The output displays the authorization token.

   ```json hideClipboard
   {
     "Authorization": "**********.",
     "IsPasswordReset": true
   }
   ```

4. Copy the authorization token to your clipboard and assign it to an environment variable. Replace the placeholder
   below with the value from the output.

   ```shell hideClipboard
   export TOKEN=**********
   ```

5. Execute the following command to set the MAAS image endpoint to `https://maasgoldenimage.s3.amazonaws.com`. Replace
   the `caCert` value below with the Certificate Authority (CA) certificate for your self-hosted environment.

   ```shell
   curl --request PUT '$BASE_URL/v1/system/config/maas/image' \
   --header 'Authorization: $TOKEN' \
   --header 'Content-Type: application/json' \
   --data '{
      "spec": {
         "imagesHostEndpoint": "https://maasgoldenimage.s3.amazonaws.com",
         "insecureSkipVerify": false,
         "caCert": "**********"
      }
   }'
   ```

6. Execute the following command to set the VMware vSphere image endpoint to
   `https://vmwaregoldenimage.s3.amazonaws.com`. Replace the `caCert` value below with the Certificate Authority (CA)
   certificate for your self-hosted environment.

   ```shell
   curl --request PUT '$BASE_URL/v1/system/config/vsphere/image' \
   --header 'Authorization: $TOKEN' \
   --header 'Content-Type: application/json' \
   --data '{
      "spec": {
         "imagesHostEndpoint": "https://vmwaregoldenimage.s3.amazonaws.com",
         "insecureSkipVerify": false,
         "caCert": "**********"
      }
   }'
   ```

MAAS and VMware vSphere clusters will now be successfully provisioned on your self-hosted Palette environment.
