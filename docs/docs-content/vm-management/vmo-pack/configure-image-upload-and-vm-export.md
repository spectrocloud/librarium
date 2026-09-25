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

The `directAccess` mechanism that earlier pack versions used for these proxies is deprecated. Keep
`charts.virtual-machine-orchestrator.directAccess.enabled` set to `false`, and expose the CDI upload proxy and KubeVirt
export proxy through the Ingress or `LoadBalancer` configuration described on this page.

:::

## Choose an Exposure Method

The VMO UI route is separate from the CDI and KubeVirt proxy endpoints. Enabling the VMO UI Ingress does not expose CDI
upload or virtual machine export on its own. Configure one of the following methods.

| Method                            | CDI upload                       | Virtual machine export                        | Manual routes required |
| --------------------------------- | -------------------------------- | --------------------------------------------- | ---------------------- |
| Native Ingress                    | CDI Ingress on `/v1beta1/upload` | KubeVirt Ingress on `/api/export.kubevirt.io` | No                     |
| `LoadBalancer` Services           | `cdi-uploadproxy-lb` Service     | `virt-exportproxy-lb` Service                 | No                     |
| `virtctl vmexport --port-forward` | Not applicable                   | Local port forward through the Kubernetes API | No                     |

## Expose the Proxies with Ingress

Add one of the following overrides to the VMO pack values. Replace the placeholder addresses with the address or DNS
name that clients use to reach your ingress controller. Do not append `/v1beta1/upload` to either CDI URL value, because
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

When the resolved class is Traefik, the chart creates the required `ServersTransport` objects and HTTPS Service
annotations. Do not create those objects manually.

</TabItem>

<TabItem label="Nginx" value="nginx">

Use explicit DNS names and the following controller settings.

```yaml
charts:
  virtual-machine-orchestrator:
    vmo-manager:
      platform:
        cdiExternalUploadUrl: "https://cdi-upload.example.com"

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
          - host: cdi-upload.example.com
            paths:
              - path: /v1beta1/upload
                pathType: Prefix
      cdiResource:
        additionalConfig:
          uploadProxyURLOverride: "https://cdi-upload.example.com"

    kubevirt:
      ingress:
        enabled: true
        ingressClassName: nginx
        annotations:
          nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
        hosts:
          - host: vm-export.example.com
            paths:
              - path: /api/export.kubevirt.io
                pathType: ImplementationSpecific
```

Retain the unlimited request-body setting, the 600-second read and send timeouts, and the disabled request buffering. A
disk image upload can be large, and a proxy with lower request-size or timeout limits causes the upload to fail.

</TabItem>

</Tabs>

Set `className` and `ingressClassName` explicitly when the cluster has more than one ingress controller. With native
Ingress enabled, the chart creates the following resources, and no separate `IngressRoute`, route, or VMO application
route is required.

| Resource                                                                   | Namespace  |
| -------------------------------------------------------------------------- | ---------- |
| CDI Ingress `cdi-uploadproxy` and Service `cdi-uploadproxy-ingress`        | `cdi`      |
| KubeVirt Ingress `virt-exportproxy` and Service `virt-exportproxy-ingress` | `kubevirt` |

## Expose the Proxies with `LoadBalancer` Services

As an alternative to Ingress, disable native Ingress and expose both proxies directly through `LoadBalancer` Services.

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

The chart creates the `cdi-uploadproxy-lb` Service in the `cdi` namespace and the `virt-exportproxy-lb` Service in the
`kubevirt` namespace. Obtain their external addresses.

```bash
kubectl get service cdi-uploadproxy-lb --namespace cdi
kubectl get service virt-exportproxy-lb --namespace kubevirt
```

After the CDI Service receives an external address, publish that exact address to VMO and CDI. Do not append
`/v1beta1/upload` to either value.

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

## Verify the External CDI URL

Confirm that CDI advertises the address that you configured.

```bash
kubectl get cdiconfig config \
  --output jsonpath='{.status.uploadProxyURL}{"\n"}' \
  --kubeconfig="$KUBECONFIG"
```

The result must be the externally reachable CDI base URL, for example `https://cdi.example.com`.

## Upload a Disk Image

Before you upload, confirm the access mode and volume mode that your StorageClass supports. CDI must write the
destination volume during upload, so a read-only access mode does not work. The following combinations apply to the
`linstor-lvm-storage` StorageClass.

| Access mode     | Volume mode  | Upload support                                                                              |
| --------------- | ------------ | ------------------------------------------------------------------------------------------- |
| `ReadWriteOnce` | `filesystem` | Supported                                                                                   |
| `ReadWriteOnce` | `block`      | Supported when the StorageProfile advertises the `ReadWriteOnce` and `Block` pair           |
| `ReadWriteMany` | `filesystem` | Supported only when the StorageProfile advertises the `ReadWriteMany` and `Filesystem` pair |
| `ReadWriteMany` | `block`      | Supported only when the StorageProfile advertises the `ReadWriteMany` and `Block` pair      |
| `ReadOnlyMany`  | Either       | Not supported                                                                               |

Check the exact combinations that the StorageClass advertises.

```bash
kubectl get storageprofile linstor-lvm-storage \
  --output jsonpath='{range .status.claimPropertySets[*]}accessModes={.accessModes}, volumeMode={.volumeMode}{"\n"}{end}' \
  --kubeconfig="$KUBECONFIG"
```

Use only a pair that this command prints. The Kubernetes API uses `Filesystem` and `Block`, and the corresponding
`virtctl` flag values are `filesystem` and `block`.

Upload the image. The following example uploads an Ubuntu cloud image to a `10Gi` DataVolume named `ubuntu-image` in the
`virtual-machines` namespace.

```bash
virtctl image-upload dv ubuntu-image \
  --namespace=virtual-machines \
  --size=10Gi \
  --storage-class=linstor-lvm-storage \
  --access-mode=ReadWriteOnce \
  --volume-mode=filesystem \
  --image-path="ubuntu-24.04-server-cloudimg-amd64.img" \
  --insecure \
  --force-bind \
  --retry=10 \
  --wait-secs=600 \
  --kubeconfig="$KUBECONFIG"
```

:::warning

The `--insecure` flag skips certificate verification and is intended for an endpoint that presents a certificate the
client does not trust. In production, install a certificate that the client trusts and remove `--insecure`.

:::

To upload to a block-mode volume instead, change only `--volume-mode=block`, and use it only when the StorageProfile
advertises the `ReadWriteOnce` and `Block` pair.

Confirm that the DataVolume completed.

```bash
kubectl get datavolume ubuntu-image \
  --namespace virtual-machines \
  --kubeconfig="$KUBECONFIG"
```

The DataVolume phase must be `Succeeded`.

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
  --kubeconfig="$KUBECONFIG" \
  --filename -
```

The command returns `virtualmachine.kubevirt.io/example-vm created`.

:::warning

Keep the virtual machine halted while you export the disk. A `ReadWriteOnce` disk cannot be mounted by a running virtual
machine during export.

:::

## Export a Virtual Machine Disk

Export the disk with port forwarding. This path requires no external KubeVirt Ingress, `LoadBalancer` Service, DNS
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
  --readiness-timeout=10m \
  --kubeconfig="$KUBECONFIG"
```

The command creates a temporary `VirtualMachineExport`, waits for the export service, opens a local port forward,
downloads the volume, and deletes the temporary export. Validate the downloaded file.

```bash
file example-vm-disk.img.gz
gzip --test example-vm-disk.img.gz
```

The `file` command must report gzip-compressed data. An HTML document indicates that the request reached an incorrect
route or a proxy error page.

### Required Export Permissions

The user that runs `virtctl vmexport` must have the following permissions in the `virtual-machines` namespace.

- `create`, `get`, and `delete` on `virtualmachineexports.export.kubevirt.io`.
- `get` on Secrets, because the export token is stored in a Secret.
- `get` on the source virtual machine, PersistentVolumeClaim, and DataVolume.

## Troubleshooting

### virtctl image-upload Cannot Discover the Upload Proxy

Confirm the advertised upload proxy URL.

```bash
kubectl get cdiconfig config \
  --output jsonpath='{.status.uploadProxyURL}{"\n"}' \
  --kubeconfig="$KUBECONFIG"
```

If the result is empty or incorrect, set `cdi.cdiResource.additionalConfig.uploadProxyURLOverride` to the exact external
scheme and address. Do not include `/v1beta1/upload`.

### Ingress Returns HTTP 500 or 502

- Traefik: confirm that both ingress-class fields are `traefik`, so the chart creates the backend `ServersTransport`
  resources.
- Nginx: confirm that both proxy Ingresses use the `nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"` annotation.

### The Image Upload Times Out

For Nginx, retain the unlimited request-body setting, the 600-second read and send timeouts, and the disabled request
buffering shown in the Nginx example. Do not send a large upload through a proxy whose request-size or timeout limits
are lower.

### The Export Remains Pending

Confirm that the virtual machine is halted and that no pod mounts the source disk.

```bash
kubectl get vm example-vm \
  --namespace virtual-machines \
  --kubeconfig="$KUBECONFIG"

kubectl get virtualmachineexport example-vm-export \
  --namespace virtual-machines \
  --kubeconfig="$KUBECONFIG" \
  --output yaml
```

## Next Steps

Review the [Deployment Modes](./deployment-modes.md) reference to understand how the pack's network topology and TLS
settings interact with these proxy endpoints.
