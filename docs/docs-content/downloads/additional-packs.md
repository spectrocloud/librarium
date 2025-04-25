---
sidebar_label: "Additional Packs for Airgap Environments"
title: "Additional Packs for Airgap Environments"
description: "Learn how to download and install additional packs for an airgapped Palette environments."
sidebar_position: 30
hide_table_of_contents: false
sidebar_custom_props:
  icon: "nodes"
tags: ["palette", "self-hosted", "airgap", "downloads", "vertex"]
keywords: ["self-hosted", "enterprise", "vertex"]
---

Review the following table to determine which pack binaries you need to download and upload to your OCI registry.

## Cluster Profile Packs

<PartialsComponent category="self-hosted" name="airgap-cluster-profile-packs" />

## Additional Deployment Options

Palette [Virtual Machine Orchestrator](../vm-management/vm-management.md) (VMO) and
[Virtual Clusters](../clusters/palette-virtual-clusters/palette-virtual-clusters.md) can also be installed for airgapped
self-hosted instances of Palette and Palette VerteX.

| File Name                                            | URL                                                                                                       |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `airgap-pack-virtual-machine-orchestrator-4.5.7.bin` | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-virtual-machine-orchestrator-4.5.7.bin |
| `airgap-pack-vcluster-4.5.10.bin`                    | https://software-private.spectrocloud.com/airgap/packs/airgap-pack-vcluster-4.5.10.bin                    |

### Usage Instructions

<Tabs groupId="Palette">
<TabItem label="Self-hosted Palette" value="self-hosted-palette">

You must SSH into your Palette airgap support VM to download and install the binary. You must also provide the username
and password for the support team's private repository. Reach out to our support team to
[obtain the credentials](../enterprise-version/enterprise-version.md#access-palette).

The following example shows how to download the `airgap-pack-aws-alb-2.5.1.bin` binary. Replace `XXXX` with your
username and `YYYY` with your password.

1. In your terminal, use the following command template to SSH into the Palette airgap support VM. Enter the path to
   your private SSH key, username, and the IP or domain of the airgap support VM. The default username is `ubuntu`.

   ```shell
   ssh -i </path/to/private/key> <username>@<vm-ip-or-domain>
   ```

   Consider the following command example for reference.

   ```shell
   ssh -i /docs/ssh-private-key.pem ubuntu@palette.example.com
   ```

2. Execute the following command to switch to the `root` user account.

   ```shell
   sudo --login
   ```

3. Download the binary using the provided username and password.

   <Tabs>

   <TabItem label="curl" value="curl">

   ```bash
   curl --user 'XXXX:YYYY' \
   https://software-private.spectrocloud.com/airgap/packs/airgap-pack-csi-aws-ebs-1.26.1.bin \
   --output airgap-pack-csi-aws-ebs-1.26.1.bin
   ```

   </TabItem>

   <TabItem label="wget" value="wget">

   ```shell
   wget --user='XXXX' --password='YYYY' \
   --output-document=airgap-pack-csi-aws-ebs-1.26.1.bin \
   https://software-private.spectrocloud.com/airgap/packs/airgap-pack-csi-aws-ebs-1.26.1.bin
   ```

   </TabItem>

   </Tabs>

4. Once the download is complete, issue the following command to start the binary and the upload process. Replace the
   binary name with the one you downloaded.

   ```bash
   chmod +x airgap-pack-csi-aws-ebs-1.26.1.bin && \
   ./airgap-pack-csi-aws-ebs-1.26.1.bin
   ```

</TabItem>

<TabItem label="Palette VerteX" value="palette-vertex">

You must SSH into your Palette VerteX airgap support VM to download and install the binary. You must also provide the
username and password for the support team's private repository. Reach out to our support team to
[obtain the credentials](../vertex/vertex.md#access-palette-vertex).

The following example shows how to download the `airgap-vertex-pack-cni-calico-3.25.1.bin` binary. Replace `XXXX` with
your username and `YYYY` with your password.

1. In your terminal, use the following command template to SSH into the Palette airgap support VM. Enter the path to
   your private SSH key, username, and the IP or domain of the airgap support VM. The default username is `ubuntu`.

   ```shell
   ssh -i </path/to/private/key> <username>@<vm-ip-or-domain>
   ```

   Consider the following command example for reference.

   ```shell
   ssh -i /docs/ssh-private-key.pem ubuntu@palette.example.com
   ```

2. Execute the following command to switch to the `root` user account.

   ```shell
   sudo --login
   ```

3. Download the binary using the provided username and password.

   <Tabs>

   <TabItem label="curl" value="curl">

   ```bash
   curl --user 'XXXX:YYYY' \
   https://software-private.spectrocloud.com/airgap-fips/packs/airgap-vertex-pack-cni-calico-3.25.1.bin \
   --output airgap-vertex-pack-cni-calico-3.25.1.bin
   ```

   </TabItem>

   <TabItem label="wget" value="wget">

   ```shell
   wget --user='XXXX' --password='YYYY' \
   --output-document=airgap-vertex-pack-cni-calico-3.25.1.bin \
   https://software-private.spectrocloud.com/airgap-fips/packs/airgap-vertex-pack-cni-calico-3.25.1.bin
   ```

   </TabItem>

   </Tabs>

4. Once the download is complete, issue the following command to start the binary and the upload process. Replace the
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
binary contains the packs required to use the [Compliance Scan](../clusters/cluster-management/compliance-scan.md)
capabilities. The conformance binary can be found in the pack table above. The binary has the prefix
`airgap-thirdparty-`. Follow the [Usage Instructions](#usage-instructions) to upload the conformance packs to the OCI
registry.

## Additional OVAs

The following tables list additional OVAs you may need depending on the Kubernetes version and distribution you want to
use for the workload clusters.

<PartialsComponent category="self-hosted" name="airgap-additional-ovas" />

### Usage Instructions

<Tabs groupId="Palette">
<TabItem label="Self-hosted Palette" value="self-hosted-palette">

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

</TabItem>

<TabItem label="Palette VerteX" value="palette-vertex">

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

</TabItem>

</Tabs>

## Kubernetes Requirements for Palette VMware Installations

<!-- prettier-ignore-start -->

The following table presents the Kubernetes version corresponding to each Palette version for
[VMware](../enterprise-version/install-palette/install-on-vmware/install-on-vmware.md) and
[Kubernetes](../enterprise-version/install-palette/install-on-kubernetes/install-on-kubernetes.md) installations.
Additionally, for VMware installations, it provides the download URLs for the required Operating System and Kubernetes
distribution OVA. Ensure that you use the FIPS OVA URL if you require a
<VersionedLink text="FIPS" url="/vertex/fips/" /> compliant installation.

<!-- prettier-ignore-end -->

<PartialsComponent category="self-hosted" name="kubernetes-palette-versions" />
