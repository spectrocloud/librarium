---
sidebar_label: "Additional Packs"
title: "Additional Packs"
description: "Learn how to download and install additional packs for an airgapped Palette VerteX environment."
sidebar_position: 10
hide_table_of_contents: false
tags: ["palette", "airgap", "downloads", "vertex"]
keywords: ["enterprise", "vertex"]
---

Review the following table to determine which pack binaries you need to download and upload to your OCI registry.

## Cluster Profile Packs

<PartialsComponent category="vertex" name="airgap-cluster-profile-packs" />

## Additional Deployment Options

<PartialsComponent category="self-hosted-and-vertex" name="additional-deployment-options" />

## Usage Instructions

You must SSH into your Palette VerteX airgap support VM to download and install the binary. You must also provide the
username and password for the support team's private repository. Reach out to our support team to
[obtain the credentials](../../vertex/vertex.md#access-palette-vertex).

The following example shows how to download the `airgap-vertex-pack-cni-calico-3.30.2.bin` binary. Replace `<username>`
with your username and `<password>` with your password.

1. In your terminal, use the following command template to SSH into the Palette airgap support VM. Enter the path to
   your private SSH key, username, and the IP or domain of the airgap support VM. The default username is `ubuntu`.

   ```shell
   ssh -i </path/to/private/key> <username>@<vm-ip-or-domain>
   ```

   ```shell title="Example command" hideClipboard
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
   curl --user '<username>:<password>' <download-link> \
   --output <filename>
   ```

   ```bash title="Example command" hideClipboard
   curl --user 'username:password' https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-vertex-pack-cni-calico-3.30.2.bin  \
   --output airgap-vertex-pack-cni-calico-3.30.2.bin
   ```

   </TabItem>

   <TabItem label="wget" value="wget">

   ```shell
   wget --user='<username>' --password='<password>' \
   --output-document=<filename> \
   <download-link>
   ```

   ```shell title="Example command" hideClipboard
   wget --user='username' --password='password' \
   --output-document airgap-vertex-pack-cni-calico-3.30.2.bin \
   https://software-private.spectrocloud.com/airgap-vertex/packs/airgap-vertex-pack-cni-calico-3.30.2.bin
   ```

   </TabItem>

   </Tabs>

4. Once the download is complete, issue the following command to start the binary and the upload process. Replace the
   binary name with the one you downloaded.

   ```bash
   chmod +x <filename> && ./<filename>
   ```

   ```bash title="Example command" hideClipboard
   chmod +x airgap-vertex-pack-cni-calico-3.30.2.bin && ./airgap-vertex-pack-cni-calico-3.30.2.bin
   ```

:::info

All binaries require the OCI environment variables to be set and for the registry credentials to be available.

:::

## Conformance Capabilities

To perform [Compliance Scans](../../clusters/cluster-management/compliance-scan.md) in airgapped environments, you must upload the necessary conformance packs to your self-hosted OCI registry. The conformance binary contains the packs required perform compliance scans. 
Download the **Palette Third Party Conformance** binary from
[Artifact Studio](https://artifact-studio.spectrocloud.com/) and follow the [Usage Instructions](#usage-instructions) to
upload the conformance packs to the OCI registry. Refer to our [Artifact Studio](../artifact-studio.md) guide for more
information on how to use Artifact Studio.

![Conformance pack download from Artifact Studio](/additional-packs_third-party-conformance-artifact-studio-download.webp)
