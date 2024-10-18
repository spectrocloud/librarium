---
sidebar_label: "Additional Packs"
title: "Additional Packs"
description: "Learn how to install additional packs for an airgap Palette install."
icon: ""
sidebar_position: 50
hide_table_of_contents: false
tags: ["palette", "self-hosted", "airgap"]
keywords: ["self-hosted", "enterprise"]
---

Review the following table to determine which pack binaries you need to download and upload to your OCI registry.

| **File Name**                                                  | **Download URL**                                                                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `airgap-pack-byoi-agent-mode-1.0.0.bin`                        | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-byoi-agent-mode-1.0.0.bin                        |
| `airgap-pack-csi-rook-ceph-helm-1.14.9.bin`                    | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-csi-rook-ceph-helm-1.14.9.bin                    |
| `airgap-pack-csi-rook-ceph-helm-addon-1.14.9.bin`              | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-csi-rook-ceph-helm-addon-1.14.9.bin              |
| `airgap-pack-custom-cni-1.0.0.bin`                             | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-custom-cni-1.0.0.bin                             |
| `airgap-pack-custom-csi-1.0.0.bin`                             | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-custom-csi-1.0.0.bin                             |
| `airgap-pack-edge-k3s-1.28.14.bin`                             | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-edge-k3s-1.28.14.bin                             |
| `airgap-pack-edge-k3s-1.29.9.bin`                              | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-edge-k3s-1.29.9.bin                              |
| `airgap-pack-edge-k3s-1.30.5.bin`                              | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-edge-k3s-1.30.5.bin                              |
| `airgap-pack-edge-k8s-1.28.14.bin`                             | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-edge-k8s-1.28.14.bin                             |
| `airgap-pack-edge-k8s-1.29.9.bin`                              | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-edge-k8s-1.29.9.bin                              |
| `airgap-pack-edge-k8s-1.30.5.bin`                              | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-edge-k8s-1.30.5.bin                              |
| `airgap-pack-edge-rke2-1.28.13.bin`                            | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-edge-rke2-1.28.13.bin                            |
| `airgap-pack-edge-rke2-1.29.8.bin`                             | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-edge-rke2-1.29.8.bin                             |
| `airgap-pack-edge-rke2-1.30.4.bin`                             | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-edge-rke2-1.30.4.bin                             |
| `airgap-pack-kubernetes-1.28.14.bin`                           | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-kubernetes-1.28.14.bin                           |
| `airgap-pack-kubernetes-1.29.9.bin`                            | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-kubernetes-1.29.9.bin                            |
| `airgap-pack-kubernetes-1.30.5.bin`                            | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-kubernetes-1.30.5.bin                            |
| `airgap-pack-kubernetes-rke2-1.28.13-rke2r1-build20240815.bin` | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-kubernetes-rke2-1.28.13-rke2r1-build20240815.bin |
| `airgap-pack-kubernetes-rke2-1.29.8-rke2r1-build20240815.bin`  | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-kubernetes-rke2-1.29.8-rke2r1-build20240815.bin  |
| `airgap-pack-kubernetes-rke2-1.30.4-rke2r1-build20240815.bin`  | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-kubernetes-rke2-1.30.4-rke2r1-build20240815.bin  |
| `airgap-pack-nginx-1.11.2.bin`                                 | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-nginx-1.11.2.bin                                 |
| `airgap-pack-spectro-proxy-1.5.4.bin`                          | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-spectro-proxy-1.5.4.bin                          |
| `airgap-pack-vault-0.28.1.bin`                                 | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-vault-0.28.1.bin                                 |

## Download Instructions

To download a binary you must provide the username and password for the support team's private repository. Reach out to
our support team to [obtain the credentials](../../enterprise-version.md#access-palette). The following example shows
how to download the `airgap-pack-aws-alb-2.5.1.bin` binary.

```bash
curl --user XXXXX:YYYYY https://software-private.spectrocloud.com/airgap/packs/airgap-pack-csi-aws-ebs-1.26.1.bin \
 --output airgap-pack-csi-aws-ebs-1.26.1.bin
```

<Tabs>
<TabItem label="curl" value="curl">

```bash
curl --user 'XXXX:YYYY' \
https://software-private.spectrocloud.com/airgap/packs/airgap-pack-csi-aws-ebs-1.26.1.bin \
--output airgap-pack-csi-aws-ebs-1.26.1.bin
```

Once the download is complete, issue the following command to start the binary and the upload process. Replace the
binary name with the one you downloaded.

```bash
chmod +x airgap-pack-csi-aws-ebs-1.26.1.bin && \
./airgap-pack-csi-aws-ebs-1.26.1.bin
```

</TabItem>

<TabItem label="wget" value="wget">

```shell
wget --user='XXXX' --password='YYYY' \
--output-document=airgap-pack-csi-aws-ebs-1.26.1.bin \
https://software-private.spectrocloud.com/airgap/packs/airgap-pack-csi-aws-ebs-1.26.1.bin
```

Once the download is complete, issue the following command to start the binary and the upload process. Replace the
binary name with the one you downloaded.

```bash
chmod +x airgap-pack-csi-aws-ebs-1.26.1.bin && \
./airgap-pack-csi-aws-ebs-1.26.1.bin
```

</TabItem> 
</Tabs>

:::info

All binaries require the OCI environment variables to be set and for the registry credentials to be available.

:::

## Conformance Capabilities

In an airgap installation, you need to upload the conformance packs to the self-hosted OCI registry. The conformance
binary contains the packs required to use the [Compliance Scan](../../../clusters/cluster-management/compliance-scan.md)
capabilities. The conformance binary can be found in the pack table above. The binary has the prefix
`airgap-thirdparty-`. Follow the [Usage Instructions](#usage-instructions) to upload the conformance packs to the OCI
registry.

## Additional OVAs

The following table lists additional OVAs you may need depending on the Kubernetes version and distribution you want to
use for the workload clusters.

| **Kubernetes Version** | **OVA Name**                | **Download URL**                                                                 |
| ---------------------- | --------------------------- | -------------------------------------------------------------------------------- |
| Kubernetes 1.27.13     | u-2204-0-k-12713-0.ova      | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-12713-0.ova`      |
| Kubernetes 1.27.15     | u-2204-0-k-12715-0.ova      | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-12715-0.ova`      |
| Kubernetes 1.27.16     | u-2204-0-k-12716-0.ova      | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-12716-0.ova`      |
| Kubernetes 1.28.9      | u-2204-0-k-1289-0.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-1289-0.ova`       |
| Kubernetes 1.28.11     | u-2204-0-k-12811-0.ova      | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-12811-0.ova`      |
| Kubernetes 1.28.12     | u-2204-0-k-12812-0.ova      | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-12812-0.ova`      |
| Kubernetes 1.28.13     | u-2204-0-k-12813-0.ova      | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-12813-0.ova`      |
| Kubernetes 1.28.14     | u-2204-0-k-12814-0.ova      | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-12814-0.ova`      |
| Kubernetes 1.29.4      | u-2204-0-k-1294-0.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-1294-0.ova`       |
| Kubernetes 1.29.6      | u-2204-0-k-1296-0.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-1296-0.ova`       |
| Kubernetes 1.29.7      | u-2204-0-k-1297-0.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-1297-0.ova`       |
| Kubernetes 1.29.8      | u-2204-0-k-1298-0.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-1298-0.ova`       |
| Kubernetes 1.29.9      | u-2204-0-k-1299-0.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-1299-0.ova`       |
| Kubernetes 1.30.4      | u-2204-0-k-1304-0.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-1304-0.ova`       |
| Kubernetes 1.30.5      | u-2204-0-k-1305-0.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-1305-0.ova`       |
| RKE2 1.27.11           | u-2204-0-k-rke2-12711-0.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-12711-0.ova` |
| RKE2 1.27.13           | u-2204-0-k-rke2-12713-0.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-12713-0.ova` |
| RKE2 1.27.14           | u-2204-0-k-rke2-12714-0.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-12714-0.ova` |
| RKE2 1.27.15           | u-2204-0-k-rke2-12715-0.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-12715-0.ova` |
| RKE2 1.28.9            | u-2204-0-k-rke2-1289-0.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-1289-0.ova`  |
| RKE2 1.28.10           | u-2204-0-k-rke2-12810-0.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-12810-0.ova` |
| RKE2 1.28.11           | u-2204-0-k-rke2-12811-0.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-12811-0.ova` |
| RKE2 1.28.12           | u-2204-0-k-rke2-12812-0.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-12812-0.ova` |
| RKE2 1.28.13           | u-2204-0-k-rke2-12813-0.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-12813-0.ova` |
| RKE2 1.29.4            | u-2204-0-k-rke2-1294-0.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-1294-0.ova`  |
| RKE2 1.29.5            | u-2204-0-k-rke2-1295-0.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-1295-0.ova`  |
| RKE2 1.29.6            | u-2204-0-k-rke2-1296-0.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-1296-0.ova`  |
| RKE2 1.29.7            | u-2204-0-k-rke2-1297-0.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-1297-0.ova`  |
| RKE2 1.29.8            | u-2204-0-k-rke2-1298-0.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-1298-0.ova`  |
| RKE2 1.30.3            | u-2204-0-k-rke2-1303-0.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-1303-0.ova`  |
| RKE2 1.30.4            | u-2204-0-k-rke2-1304-0.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2204-0-k-rke2-1304-0.ova`  |

### Usage Instructions

Use the provided download URL to download the OVA and upload it to your vSphere environment. The OVA must be uploaded to
the `spectro-templates ` so Palette can access it.

One additional note about uploaded OVAs, the OVA name must be prefixed with `r_` to be recognized by Palette. You can
rename the OVA before you upload it or after you upload it to vSphere. Use the following command examples to download
and rename the necessary OVA files with `curl` or `wget`.

<Tabs>
<TabItem label="curl" value="curl">

```shell
curl --output r_u-2204-0-k-12610-0.ova \
https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2204-0-k-12610-0.ova
```

</TabItem>

<TabItem label="wget" value="wget">

```shell
wget --quiet --show-progress \
--output-document=r_u-2204-0-k-12610-0.ova \
https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2204-0-k-12610-0.ova
```

</TabItem> 
</Tabs>
