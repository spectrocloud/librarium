---
sidebar_label: "Additional Packs"
title: "Additional Packs"
description: "Learn how to download and install additional packs for an airgapped self-hosted Palette environment."
sidebar_position: 10
hide_table_of_contents: false
tags: ["palette", "self-hosted", "airgap", "downloads"]
keywords: ["self-hosted", "enterprise"]
---

Review the following table to determine which pack binaries you need to download and upload to your OCI registry.

## Cluster Profile Packs

<PartialsComponent category="self-hosted" name="airgap-cluster-profile-packs" />

## Additional Deployment Options

<PartialsComponent category="self-hosted-and-vertex" name="additional-deployment-options" />

## Usage Instructions

You must SSH into your Palette airgap support VM to download and install the binary. You must also provide the username
and password for the support team's private repository. Reach out to our support team to
[obtain the credentials](../../self-hosted-setup/palette/palette.md#access-palette).

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

:::info

All binaries require the OCI environment variables to be set and for the registry credentials to be available.

:::

## Conformance Capabilities

In an airgap installation, you need to upload the conformance packs to the self-hosted OCI registry. The conformance
binary contains the packs required to use the [Compliance Scan](../../clusters/cluster-management/compliance-scan.md)
capabilities. The conformance binary can be found in the [Cluster Profile Packs](#cluster-profile-packs) table. The
binary has the prefix `airgap-thirdparty-`. Follow the [Usage Instructions](#usage-instructions) to upload the
conformance packs to the OCI registry.
