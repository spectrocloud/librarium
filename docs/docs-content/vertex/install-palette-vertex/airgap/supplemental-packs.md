---
sidebar_label: "Additional Packs"
title: "Additional Packs"
description: "Learn how to install additional packs for an airgap VerteX install."
icon: ""
sidebar_position: 50
hide_table_of_contents: false
tags: ["vertex", "self-hosted", "airgap"]
keywords: ["self-hosted", "vertex"]
---

Review the following table to determine which pack binaries you need to download and upload to your OCI registry.

| **File Name**                                                         | **Download URL**                                                                                                                  |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `airgap-vertex-pack-edge-k8s-1.28.14.bin`                             | https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-vertex-pack-edge-k8s-1.28.14.bin                             |
| `airgap-vertex-pack-edge-k8s-1.29.9.bin`                              | https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-vertex-pack-edge-k8s-1.29.9.bin                              |
| `airgap-vertex-pack-edge-k8s-1.30.5.bin`                              | https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-vertex-pack-edge-k8s-1.30.5.bin                              |
| `airgap-vertex-pack-edge-rke2-1.28.13.bin`                            | https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-vertex-pack-edge-rke2-1.28.13.bin                            |
| `airgap-vertex-pack-edge-rke2-1.29.8.bin`                             | https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-vertex-pack-edge-rke2-1.29.8.bin                             |
| `airgap-vertex-pack-edge-rke2-1.30.4.bin`                             | https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-vertex-pack-edge-rke2-1.30.4.bin                             |
| `airgap-vertex-pack-kubernetes-1.28.14.bin`                           | https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-vertex-pack-kubernetes-1.28.14.bin                           |
| `airgap-vertex-pack-kubernetes-1.29.9.bin`                            | https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-vertex-pack-kubernetes-1.29.9.bin                            |
| `airgap-vertex-pack-kubernetes-1.30.5.bin`                            | https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-vertex-pack-kubernetes-1.30.5.bin                            |
| `airgap-vertex-pack-kubernetes-rke2-1.28.13-rke2r1-build20240815.bin` | https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-vertex-pack-kubernetes-rke2-1.28.13-rke2r1-build20240815.bin |
| `airgap-vertex-pack-kubernetes-rke2-1.29.8-rke2r1-build20240815.bin`  | https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-vertex-pack-kubernetes-rke2-1.29.8-rke2r1-build20240815.bin  |
| `airgap-vertex-pack-kubernetes-rke2-1.30.4-rke2r1-build20240815.bin`  | https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-vertex-pack-kubernetes-rke2-1.30.4-rke2r1-build20240815.bin  |

### Usage Instructions

To download a binary you must provide the username and password for the support team's private repository. Reach out to
our support team to [obtain the credentials](../../vertex.md#access-palette-vertex).

The following example shows how to download the `airgap-vertex-pack-cni-calico-3.25.1.bin` binary. Replace `XXXX` with
your username and `YYYY` with your password.

<Tabs>
<TabItem label="curl" value="curl">

```bash
curl --user 'XXXX:YYYY' \
https://software-private.spectrocloud.com/airgap-fips/packs/airgap-vertex-pack-cni-calico-3.25.1.bin \
--output airgap-vertex-pack-cni-calico-3.25.1.bin
```

Once the download is complete, issue the following command to start the binary and the upload process. Replace the
binary name with the one you downloaded.

```bash
chmod +x airgap-vertex-pack-cni-calico-3.25.1.bin && \
./airgap-vertex-pack-cni-calico-3.25.1.bin
```

</TabItem>

<TabItem label="wget" value="wget">

```shell
wget --user='XXXX' --password='YYYY' \
--output-document=airgap-vertex-pack-cni-calico-3.25.1.bin \
https://software-private.spectrocloud.com/airgap-fips/packs/airgap-vertex-pack-cni-calico-3.25.1.bin
```

Once the download is complete, issue the following command to start the binary and the upload process. Replace the
binary name with the one you downloaded.

```bash
chmod +x airgap-vertex-pack-cni-calico-3.25.1.bin && \
./airgap-vertex-pack-cni-calico-3.25.1.bin
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

The following table lists additional OVAs that may be required depending on the Kubernetes version and distribution you
want to use for your workload clusters.

| **Kubernetes Version** | **OVA Name**                   | **Download URL**                                                                    |
| ---------------------- | ------------------------------ | ----------------------------------------------------------------------------------- |
| Kubernetes 1.27.13     | u-2004-0-k-12713-fips.ova      | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-12713-fips.ova`      |
| Kubernetes 1.27.15     | u-2004-0-k-12715-fips.ova      | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-12715-fips.ova`      |
| Kubernetes 1.27.16     | u-2004-0-k-12716-fips.ova      | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-12716-fips.ova`      |
| Kubernetes 1.28.9      | u-2004-0-k-1289-fips.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-1289-fips.ova`       |
| Kubernetes 1.28.11     | u-2004-0-k-12811-fips.ova      | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-12811-fips.ova`      |
| Kubernetes 1.28.12     | u-2004-0-k-12812-fips.ova      | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-12812-fips.ova`      |
| Kubernetes 1.28.13     | u-2004-0-k-12813-fips.ova      | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-12813-fips.ova`      |
| Kubernetes 1.28.14     | u-2004-0-k-12814-fips.ova      | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-12814-fips.ova`      |
| Kubernetes 1.29.4      | u-2004-0-k-1294-fips.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-1294-fips.ova`       |
| Kubernetes 1.29.6      | u-2004-0-k-1296-fips.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-1296-fips.ova`       |
| Kubernetes 1.29.7      | u-2004-0-k-1297-fips.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-1297-fips.ova`       |
| Kubernetes 1.29.8      | u-2004-0-k-1298-fips.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-1298-fips.ova`       |
| Kubernetes 1.29.9      | u-2004-0-k-1299-fips.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-1299-fips.ova`       |
| Kubernetes 1.30.4      | u-2004-0-k-1304-fips.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-1304-fips.ova`       |
| Kubernetes 1.30.5      | u-2004-0-k-1305-fips.ova       | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-1305-fips.ova`       |
| RKE2 1.27.11           | u-2004-0-k-rke2-12711-fips.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-12711-fips.ova` |
| RKE2 1.27.13           | u-2004-0-k-rke2-12713-fips.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-12713-fips.ova` |
| RKE2 1.27.14           | u-2004-0-k-rke2-12714-fips.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-12714-fips.ova` |
| RKE2 1.27.15           | u-2004-0-k-rke2-12715-fips.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-12715-fips.ova` |
| RKE2 1.28.9            | u-2004-0-k-rke2-1289-fips.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-1289-fips.ova`  |
| RKE2 1.28.10           | u-2004-0-k-rke2-12810-fips.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-12810-fips.ova` |
| RKE2 1.28.11           | u-2004-0-k-rke2-12811-fips.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-12811-fips.ova` |
| RKE2 1.28.12           | u-2004-0-k-rke2-12812-fips.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-12812-fips.ova` |
| RKE2 1.28.13           | u-2004-0-k-rke2-12813-fips.ova | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-12813-fips.ova` |
| RKE2 1.29.4            | u-2004-0-k-rke2-1294-fips.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-1294-fips.ova`  |
| RKE2 1.29.5            | u-2004-0-k-rke2-1295-fips.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-1295-fips.ova`  |
| RKE2 1.29.6            | u-2004-0-k-rke2-1296-fips.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-1296-fips.ova`  |
| RKE2 1.29.7            | u-2004-0-k-rke2-1297-fips.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-1297-fips.ova`  |
| RKE2 1.29.8            | u-2004-0-k-rke2-1298-fips.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-1298-fips.ova`  |
| RKE2 1.30.3            | u-2004-0-k-rke2-1303-fips.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-1303-fips.ova`  |
| RKE2 1.30.4            | u-2004-0-k-rke2-1304-fips.ova  | `https://vmwaregoldenimage-console.s3.amazonaws.com/u-2004-0-k-rke2-1304-fips.ova`  |

### Usage Instructions

Use the provided download URL to download the OVA and upload it to your vSphere environment. The OVA must be uploaded to
the `spectro-templates ` so VerteX can access it. One additional note about uploaded OVAs, the OVA name must be prefixed
with `r_` to be recognized by VerteX. You can rename the OVA before you upload it or after you upload it to vSphere.

<Tabs>
<TabItem label="curl" value="curl">

The following example shows how to download the `u-2004-0-k-1259-fips.ova` OVA and rename it to
`r_u-2004-0-k-1259-fips.ova` using `curl` and the `--output` flag.

```shell
curl --output r_u-2004-0-k-1259-fips.ova \
https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2004-0-k-1259-fips.ova
```

</TabItem>

<TabItem label="wget" value="wget">

The following example shows how to download the `u-2004-0-k-1259-fips.ova` OVA and rename it to
`r_u-2004-0-k-1259-fips.ova` using `wget` and the `--output-document` flag.

```shell
wget --quiet --show-progress \
--output-document=r_u-2004-0-k-1259-fips.ova \
https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2004-0-k-1259-fips.ova
```

</TabItem> 
</Tabs>
