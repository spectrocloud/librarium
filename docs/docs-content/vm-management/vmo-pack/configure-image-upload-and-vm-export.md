---
sidebar_label: "Image Upload and VM Export"
title: "Configure Image Upload and VM Export"
description:
  "Expose the CDI upload proxy and KubeVirt export proxy in the Virtual Machine Orchestrator pack, upload a disk image,
  and export a virtual machine disk."
icon: " "
hide_table_of_contents: false
sidebar_position: 28
tags: ["vmo", "vmo pack"]
---

Virtual Machine Orchestrator (VMO) can expose the Containerized Data Importer (CDI) upload proxy and the KubeVirt export
proxy so that you can upload disk images with `virtctl image-upload` and export virtual machine disks with
`virtctl vmexport`. This page explains how to expose these proxies through native Ingress or `LoadBalancer` Services,
upload an Ubuntu disk image, create a virtual machine from the uploaded disk, and export that disk.

:::warning

In VMO pack version 4.10.7 and later, the `directAccess` Traefik route no longer exposes the CDI upload proxy or the
KubeVirt export proxy. Expose both proxies through the Ingress or `LoadBalancer` configuration on this page. If you use
[Direct](./deployment-modes.md#direct) mode, keep `directAccess` enabled, because Direct mode still uses it for the VM
dashboard route.

:::

## Prerequisites

- A workload cluster with VMO pack version 4.10.7 or later deployed. Refer to
  [Create a VMO Profile](./create-vmo-profile.md) for guidance.

- Kubectl installed and access to the **kubeconfig** file for the VMO cluster. Refer to the
  [Kubectl](../../clusters/cluster-management/palette-webctl.md#access-cluster-with-cli) guide to learn how to set up
  `kubectl` and get the **kubeconfig** file. Export its path so that the commands on this page can use it, and run the
  commands in the same terminal session.

  ```shell
  export KUBECONFIG=<path-to-kubeconfig>
  ```

  Replace `<path-to-kubeconfig>` with the path to the kubeconfig file for the VMO cluster.

- The [virtctl](https://kubevirt.io/user-guide/user_workloads/virtctl_client_tool/) command-line tool installed on your
  workstation.

- An Ubuntu cloud image on your workstation, such as `ubuntu-24.04-server-cloudimg-amd64.img` from
  [Ubuntu Cloud Images](https://cloud-images.ubuntu.com/).

- To export a virtual machine disk, the following permissions in the `virtual-machines` namespace.

  - `create`, `get`, and `delete` on `virtualmachineexports.export.kubevirt.io`.

  - `get` on Secrets, because the export token is stored in a Secret.

  - `get` on the source virtual machine, PersistentVolumeClaim, and DataVolume.

## Choose an Exposure Method

The VMO UI route is separate from the CDI and KubeVirt proxy endpoints. Enabling the VMO UI Ingress does not expose CDI
upload or virtual machine export on its own. Configure one of the following methods.

| **Method**                        | **CDI upload**                   | **Virtual machine export**                    |
| --------------------------------- | -------------------------------- | --------------------------------------------- |
| Native Ingress                    | CDI Ingress on `/v1beta1/upload` | KubeVirt Ingress on `/api/export.kubevirt.io` |
| `LoadBalancer` Services           | `cdi-uploadproxy-lb` Service     | `virt-exportproxy-lb` Service                 |
| `virtctl vmexport --port-forward` | Not applicable                   | Local port forward through the Kubernetes API |

None of these methods requires a manual route.

CDI upload works with either method. For virtual machine export, `virtctl` can download without `--port-forward` only
when the export proxy is exposed on a hostname, for example through an Ingress behind an AWS load balancer, because
`virtctl` detects the export host. If the export proxy is exposed on an IP address, such as through an IP-based
`LoadBalancer` Service, always use `--port-forward`. The export procedure on this page uses `--port-forward`, so it
works with either method.

## Expose the Proxies with Ingress

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**, and then select your VMO cluster.

3. Select the **Profile** tab. Then, select the **Virtual Machine Orchestrator** layer and select **Values**. The values
   editor appears.

4. Add one of the following overrides to the values. Do not append `/v1beta1/upload` to either CDI URL value, because
   VMO and `virtctl` append the upload API path.

   <Tabs>

   <TabItem label="Traefik" value="traefik">

   Use Ingress rules on a shared external address. This configuration does not require separate CDI or KubeVirt DNS
   records.

   ```yaml
   charts:
     virtual-machine-orchestrator:
       vmo-manager:
         platform:
           cdiExternalUploadUrl: "https://<vmo-external-address>"

       cdi:
         ingress:
           enabled: true
           className: traefik
           hosts:
             - host: "<vmo-external-address>"
               paths:
                 - path: /v1beta1/upload
                   pathType: Prefix
         cdiResource:
           additionalConfig:
             uploadProxyURLOverride: "https://<vmo-external-address>"

       kubevirt:
         ingress:
           enabled: true
           ingressClassName: traefik
           hosts:
             - host: <vmo-external-address>
               paths:
                 - path: /api/export.kubevirt.io
                   pathType: ImplementationSpecific
   ```

   Replace `<vmo-external-address>` with the address or DNS name that clients use to reach your ingress controller.

   When the ingress class is `traefik`, the chart creates the `ServersTransport` objects and HTTPS Service annotations
   that Traefik needs. Do not create them manually.

   </TabItem>

   <TabItem label="Nginx" value="nginx">

   Use explicit DNS names and the following controller settings.

   ```yaml
   charts:
     virtual-machine-orchestrator:
       vmo-manager:
         platform:
           cdiExternalUploadUrl: "https://<cdi-upload-dns-name>"

       cdi:
         ingress:
           enabled: true
           className: nginx
           annotations:
             nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
             nginx.ingress.kubernetes.io/proxy-body-size: "0"
             nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
             nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
             nginx.ingress.kubernetes.io/proxy-request-buffering: "off"
           hosts:
             - host: "<cdi-upload-dns-name>"
               paths:
                 - path: /v1beta1/upload
                   pathType: Prefix
         cdiResource:
           additionalConfig:
             uploadProxyURLOverride: "https://<cdi-upload-dns-name>"

       kubevirt:
         ingress:
           enabled: true
           ingressClassName: nginx
           annotations:
             nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
           hosts:
             - host: "<vm-export-dns-name>"
               paths:
                 - path: /api/export.kubevirt.io
                   pathType: ImplementationSpecific
   ```

   Replace `<cdi-upload-dns-name>` and `<vm-export-dns-name>` with the DNS names that clients use to reach your ingress
   controller.

   Retain the unlimited request-body setting, the 600-second read and send timeouts, and request buffering turned off. A
   disk image upload can be large, and a proxy with lower request-size or timeout limits causes the upload to fail.

   </TabItem>

   </Tabs>

   Set `className` and `ingressClassName` explicitly when the cluster has more than one ingress controller.

5. Select **Save**. Wait for Palette to finish updating the cluster.

When you enable native Ingress, the chart creates the following resources.

| **Resource**                                                               | **Namespace** |
| -------------------------------------------------------------------------- | ------------- |
| CDI Ingress `cdi-uploadproxy` and Service `cdi-uploadproxy-ingress`        | `cdi`         |
| KubeVirt Ingress `virt-exportproxy` and Service `virt-exportproxy-ingress` | `kubevirt`    |

## Expose the Proxies with `LoadBalancer` Services

As an alternative to Ingress, expose both proxies directly through `LoadBalancer` Services.

1. Open the values editor of the **Virtual Machine Orchestrator** layer, as described in steps 1 through 3 of
   [Expose the Proxies with Ingress](#expose-the-proxies-with-ingress). Add the following overrides to turn off native
   Ingress and create the `LoadBalancer` Services.

   ```yaml
   charts:
     virtual-machine-orchestrator:
       cdi:
         ingress:
           enabled: false
         service:
           type: LoadBalancer
           port: 443
           targetPort: 8443

       kubevirt:
         ingress:
           enabled: false
         service:
           type: LoadBalancer
           port: 443
           targetPort: 8443
   ```

   Select **Save**. Wait for Palette to finish updating the cluster.

2. Get the external addresses of the `cdi-uploadproxy-lb` Service in the `cdi` namespace and the `virt-exportproxy-lb`
   Service in the `kubevirt` namespace.

   ```bash
   kubectl get service cdi-uploadproxy-lb --namespace cdi
   kubectl get service virt-exportproxy-lb --namespace kubevirt
   ```

   The `EXTERNAL-IP` column shows the external address of each Service.

   ```text hideClipboard title="Example Output"
   NAME                 TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)         AGE
   cdi-uploadproxy-lb   LoadBalancer   10.100.5.141   192.0.2.93    443:31874/TCP   25h
   NAME                  TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)         AGE
   virt-exportproxy-lb   LoadBalancer   10.102.131.217   192.0.2.92    443:30698/TCP   25h
   ```

3. After the CDI Service receives an external address, update the profile a second time. In the values editor of the
   **Virtual Machine Orchestrator** layer, add that address for both VMO and CDI. Do not append `/v1beta1/upload` to
   either value.

   ```yaml
   charts:
     virtual-machine-orchestrator:
       vmo-manager:
         platform:
           cdiExternalUploadUrl: "https://<cdi-loadbalancer-address>"
       cdi:
         cdiResource:
           additionalConfig:
             uploadProxyURLOverride: "https://<cdi-loadbalancer-address>"
   ```

   Replace `<cdi-loadbalancer-address>` with the external address of the `cdi-uploadproxy-lb` Service.

   Select **Save**. Wait for Palette to finish updating the cluster.

## Verify the External CDI URL

Confirm that CDI advertises the address that you configured.

```bash
kubectl get cdiconfig config \
  --output jsonpath='{.status.uploadProxyURL}{"\n"}'
```

The result must be the externally reachable CDI base URL, without `/v1beta1/upload`. For example, if
`<cdi-upload-dns-name>` is `cdi-upload.example.com`, the command returns the following output.

```text hideClipboard title="Example Output"
https://cdi-upload.example.com
```

## Upload a Disk Image

1. Confirm the access mode and volume mode that your StorageClass supports. CDI must write the destination volume during
   upload, so a read-only access mode does not work. For example, the `linstor-lvm-storage` StorageClass supports the
   following combinations.

   | **Access mode** | **Volume mode** | **Upload support**                                                                          |
   | --------------- | --------------- | ------------------------------------------------------------------------------------------- |
   | `ReadWriteOnce` | `filesystem`    | Supported                                                                                   |
   | `ReadWriteOnce` | `block`         | Supported when the StorageProfile advertises the `ReadWriteOnce` and `Block` pair           |
   | `ReadWriteMany` | `filesystem`    | Supported only when the StorageProfile advertises the `ReadWriteMany` and `Filesystem` pair |
   | `ReadWriteMany` | `block`         | Supported only when the StorageProfile advertises the `ReadWriteMany` and `Block` pair      |
   | `ReadOnlyMany`  | Either          | Not supported                                                                               |

2. Check the exact combinations that the StorageClass advertises.

   ```bash
   kubectl get storageprofile <storage-class-name> \
     --output jsonpath='{range .status.claimPropertySets[*]}accessModes={.accessModes}, volumeMode={.volumeMode}{"\n"}{end}'
   ```

   Replace `<storage-class-name>` with the name of your StorageClass. Use only a pair that this command prints. The
   Kubernetes API uses `Filesystem` and `Block`, and the corresponding `virtctl` flag values are `filesystem` and
   `block`.

3. Upload the image. The following example uploads an Ubuntu cloud image to a `10Gi` DataVolume named `ubuntu-image` in
   the `virtual-machines` namespace.

   ```bash
   virtctl image-upload dv ubuntu-image \
     --namespace=virtual-machines \
     --size=10Gi \
     --storage-class=<storage-class-name> \
     --access-mode=ReadWriteOnce \
     --volume-mode=filesystem \
     --image-path="ubuntu-24.04-server-cloudimg-amd64.img" \
     --insecure \
     --force-bind \
     --retry=10 \
     --wait-secs=600
   ```

   Replace `<storage-class-name>` with the name of your StorageClass. To upload to a block-mode volume, set
   `--volume-mode=block`. Use block mode only if the command in step 2 lists the `ReadWriteOnce` and `Block` pair.

   The following example shows the command output without the upload progress bar.

   ```text hideClipboard title="Example Output"
   PVC virtual-machines/ubuntu-image not found
   DataVolume virtual-machines/ubuntu-image created
   Waiting for PVC ubuntu-image upload pod to be ready...
   Pod now ready
   Uploading data to https://192.0.2.93
   Uploading data completed successfully, waiting for processing to complete, you can hit ctrl-c without interrupting the progress
   Processing completed successfully
   Uploading ubuntu-24.04-server-cloudimg-amd64.img completed successfully
   ```

   :::warning

   The `--insecure` flag skips certificate verification and is intended for an endpoint that presents a certificate that
   the client does not trust. In production, install a certificate that the client trusts and remove `--insecure`.

   :::

4. Confirm that the DataVolume completed.

   ```bash
   kubectl get datavolume ubuntu-image \
     --namespace virtual-machines
   ```

   The `PHASE` column must show `Succeeded`.

   ```text hideClipboard title="Example Output"
   NAME           PHASE       PROGRESS   RESTARTS   AGE
   ubuntu-image   Succeeded   N/A                   115s
   ```

## Create a Virtual Machine from the Uploaded Disk

Create a halted virtual machine that uses the uploaded disk. The following example creates a virtual machine named
`example-vm`.

```bash
virtctl create vm \
  --name=example-vm \
  --run-strategy=Halted \
  --memory=2Gi \
  --infer-preference=false \
  --volume-pvc=src:ubuntu-image |
kubectl apply \
  --namespace virtual-machines \
  --filename -
```

The command returns the following output.

```text hideClipboard title="Example Output"
virtualmachine.kubevirt.io/example-vm created
```

Confirm that the virtual machine is halted.

```bash
kubectl get vm example-vm \
  --namespace virtual-machines
```

The `STATUS` column must show `Stopped`.

```text hideClipboard title="Example Output"
NAME         AGE   STATUS    READY
example-vm   1s    Stopped   False
```

:::warning

Keep the virtual machine halted while you export the disk. The export cannot mount a `ReadWriteOnce` disk that a running
virtual machine is using.

:::

## Export a Virtual Machine Disk

1. Export the disk with port forwarding. This path requires no external KubeVirt Ingress, `LoadBalancer` Service, DNS
   record, or route.

   ```bash
   virtctl vmexport download example-vm-export \
     --vm=example-vm \
     --namespace=virtual-machines \
     --volume=ubuntu-image \
     --format=gzip \
     --output=example-vm-disk.img.gz \
     --insecure \
     --port-forward \
     --delete-vme \
     --readiness-timeout=10m
   ```

   The command creates a temporary `VirtualMachineExport`, waits for the export service, opens a local port forward,
   downloads the volume, and deletes the temporary export. The following example shows the command output without the
   download progress bar.

   ```text hideClipboard title="Example Output"
   VirtualMachineExport 'virtual-machines/example-vm-export' created succesfully
   waiting for VM Export example-vm-export status to be ready...
   service virt-export-example-vm-export is ready for port-forwarding
   Forwarding from 127.0.0.1:61055 -> 8443
   Forwarding from [::1]:61055 -> 8443
   Port forwarding is ready.
   Handling connection for 61055
   Download finished succesfully
   VirtualMachineExport 'virtual-machines/example-vm-export' deleted succesfully
   ```

2. Validate the downloaded file.

   ```bash
   file example-vm-disk.img.gz
   gzip --test example-vm-disk.img.gz
   ```

   The `file` command must report gzip-compressed data, and `gzip --test` prints nothing when the archive is intact. If
   you download without `--port-forward`, an HTML document indicates that the request reached an incorrect route or a
   proxy error page.

   ```text hideClipboard title="Example Output"
   example-vm-disk.img.gz: gzip compressed data, original size modulo 2^32 2057306112
   ```

## Troubleshooting

### Scenario - Image Upload Cannot Discover the Upload Proxy

Confirm the advertised upload proxy URL.

```bash
kubectl get cdiconfig config \
  --output jsonpath='{.status.uploadProxyURL}{"\n"}'
```

If the result is empty or incorrect, set
`charts.virtual-machine-orchestrator.cdi.cdiResource.additionalConfig.uploadProxyURLOverride` to the exact external
scheme and address. Do not include `/v1beta1/upload`.

### Scenario - Ingress Returns HTTP 500 or 502

- If you use Traefik, confirm that `className` and `ingressClassName` are both set to `traefik` so that the chart
  creates the backend `ServersTransport` resources.

- If you use Nginx, confirm that both proxy Ingresses use the `nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"`
  annotation.

### Scenario - The Image Upload Times Out

For Nginx, retain the unlimited request-body setting, the 600-second read and send timeouts, and request buffering
turned off, as shown in [Expose the Proxies with Ingress](#expose-the-proxies-with-ingress). Do not send a large upload
through a proxy whose request-size or timeout limits are lower.

### Scenario - The Export Remains Pending

Confirm that the virtual machine is halted and that no pod mounts the source disk.

```bash
kubectl get vm example-vm \
  --namespace virtual-machines

kubectl get virtualmachineexport example-vm-export \
  --namespace virtual-machines \
  --output yaml
```

In the first command's output, the `STATUS` column must show `Stopped`. If it shows `Running`, stop the virtual machine
with `virtctl stop example-vm --namespace virtual-machines`. In the second command's output, the `status.conditions`
list shows why the export is not ready.

## Next Steps

Review the [Deployment Modes](./deployment-modes.md) reference to understand how the pack's network topology and TLS
settings interact with these proxy endpoints.
