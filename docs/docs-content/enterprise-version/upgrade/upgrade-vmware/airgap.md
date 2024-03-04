---
sidebar_label: "Airgap"
title: "Upgrade Airgap Palette Installed on VMware vSphere"
description: "Learn how to upgrade self-hosted airgap Palette in VMware."
icon: ""
sidebar_position: 10
tags: ["palette", "self-hosted", "vmware", "airgap", "upgrade"]
keywords: ["self-hosted", "enterprise"]
---

This guide takes you through the process of upgrading a self-hosted airgap Palette instance installed on VMware vSphere.

:::warning

Before upgrading Palette to a new major version, you must first update it to the latest minor version available. Refer
to the [Supported Upgrade Paths](../upgrade.md#supported-upgrade-paths) section for details.

If your setup includes a PCG, you must also
[allow the PCG to upgrade automatically](../../../clusters/pcg/manage-pcg/pcg-upgrade.md) before each major or minor
Palette upgrade. Additionally, if the new Palette version updates Kubernetes, you need to apply the Kubernetes updates
to your Enterprise Cluster Profile.

:::

## Prerequisites

- Access to the Palette system console.

- Access to the Palette airgap support Virtual Machine (VM) that you used for the initial Palette instalaltion.

- Refer to [Access Palette](/enterprise-version/#access-palette) to download the following from our support:

  - The new airgap Palette installation bin.
  - The OVA with the Operating System (OS) and Kubernetes distribution required for the Palette nodes (if the new
    version of Palette requires a new version of the OS and Kubernetes).

## Upgrade

1. SSH into the support VM.
2. Download the new binary to your support VM.
3. Execute the binary.
4. Run pack sync from the system console.
5. Once the packs sync, you will see the upgrade button from the system console.
6. Upgrade as you would a non-airgap instance.

---

1. SSH into the support VM.
2. Run the airgap setup script.
3. Get the setup script values.
4.

---

:::info

If the new version of Palette requires you to update the underlying OS and Kubernetes distribution, proceed with the
steps 1 through 3. Otherwise, start at step 4.

:::

1. Log in to your vCenter.
2. Right-click the cluster or resource group that hosts Palette and select **Deploy OVF Template**.
3. In the **Deploy OVF Template** wizard, at the **Select an OVF template** step, enter a link to the OVA with the new
   OS and Kubernetes distribution.

   Consider the following example for reference.

   ```shell
   https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2204-0-k-12610-0.ova
   ```

   At the **Select a name and folder** step:

   - In the **Virtual machine name** field, append the `r_` prefix to the populated OVA name and remove the `.ova`
     ending.

     :::info

     It's important that you follow this naming convention. Otherwise, Palette will not be able to identify the OS and
     Kubernetes OVA and you will not be able to upgrade your Palette instance.

     :::

     Consider the following example for reference.

     ```shell
     r_u-2204-0-k-12610-0
     ```

   - Under the **Select a location for the virtual machine** selector, choose the **spectro-templates** folder you
     created during installation.

   Once the OS and Kubernetes OVA is available in your **spectro-templates** directory, you can terminate its
   deployment. Refer to the
   [Deploy an OVF or OVA Template](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vm-administration/GUID-AFEDC48B-C96F-4088-9C1F-4F0A30E965DE.html)
   guide for more information on deploying OVAs in vCenter.

   :::tip

   If, during the OVA deployment, you encounter an error message stating **Unable to retrieve manifest or certificate**,
   refer to this [known issue](https://kb.vmware.com/s/article/79986) from the VMware knowledge base for a guide on how
   to resolve it.

4. Right-click the cluster or resource group that hosts Palette and select **Deploy OVF Template**.

---

1. Use the following command template to SSH into the Palette airgap support VM. Enter the path to your private SSH key,
   your username, and the IP or domain of the airgap support VM. The default username is `ubuntu`.

   ```shell
   ssh -identity_file </path/to/private/key> <username>@<vm-ip-or-domain>
   ```

   Consider the following command example for reference.

   ```shell
   ssh -identity_file /docs/ssh-private-key.pem ubuntu@palette.example.com
   ```

2. Use the following command to switch to the `root` user account, which you need to proceed with the upgrade.

   ```shell
   sudo --login
   ```

3. Use the following command template to donwload the new Palette airgap installation bin. Enter the username, password,
   and the Palette airgap installation URL you received from our support team. In the output file name, replace
   `<version>` with the Palette version you're downloading.

   ```shell
   curl --user <username>:<password> <link-to-airgap-installation-bin> --output airgap-<version>.bin
   ```

   Consider the following command example for reference.

   ```shell
   curl --user <username>:<password> https://software-private.spectrocloud.com/airgap/4.1.12/airgap-v4.1.12.bin --output airgap-4.1.12.bin
   ```

4. Select one of the following tabs to initialize the airgap Palette installation script either with the IP address or
   the domain of your airgap support VM. Be aware that the script generates a self-signed certificate for the IP or
   domain you provide.

   <Tabs>

   <TabItem value="domain" label="Domain">

   Use the following command template to start the airgap initialization binary.

   ```shell
   /bin/airgap-setup.sh <domain>
   ```

   Consider the following command example for reference.

   ```shell
   /bin/airgap-setup.sh palette.example.com
   ```

   You should receive an output similar to the following.

   ```shell
   Setting up SSL Certs
   Setting up Harbor

   Details:
   -------
   Spectro Cloud Repository
   Location: https://palette.example.com:8443
   UserName: ********
   Password: ********
   CA certificate filepath: /opt/spectro/ssl/server.crt

   Pack OCI Registry
   Endpoint: https://palette.example.com
   Base Content Path: spectro-packs
   CA certificate Filepath: /opt/spectro/ssl/server.crt
   Username: ********
   Password: ********

   Image OCI Registry
   Endpoint: https://palette.example.com
   Base Content Path: spectro-images
   CA certificate Filepath: /opt/spectro/ssl/server.crt
   Username: ********
   Password: ********
   ```

   </TabItem>

   <TabItem value="ip" label="IP Address">

   Use the following command template to start the airgap initialization binary.

   ```shell
   /bin/airgap-setup.sh <ip-address>
   ```

   Consider the following command example for reference.

   ```shell
   /bin/airgap-setup.sh 10.10.1.1
   ```

   You should receive an output similar to the following. This output contains credentials and values that your need to
   complete installation with the Palette CLI.

   ```shell
   Setting up SSL Certs
   Setting up Harbor

   Details:
   -------
   Spectro Cloud Repository
   Location: 10.10.1.1:8443
   UserName: ********
   Password: ********
   CA certificate filepath: /opt/spectro/ssl/server.crt

   Pack OCI Registry
   Endpoint: 10.10.1.1
   Base Content Path: spectro-packs
   CA certificate Filepath: /opt/spectro/ssl/server.crt
   Username: ********
   Password: ********

   Image OCI Registry
   Endpoint: 10.10.1.1
   Base Content Path: spectro-images
   CA certificate Filepath: /opt/spectro/ssl/server.crt
   Username: ********
   Password: ********
   ```

   </TabItem>

   </Tabs>

5. Refer to the [Additional Packs](../../install-palette/airgap/supplemental-packs.md) page and update the packages you
   are currently using. You must update each package separetely.

   To update a package, use the following command template to download and execute the pack binary.

   ```shell
   chmod +x <pack-name-version>.bin && ./<pack-name-version>.bin
   ```

   Consider the following example for reference.

   ```shell
   chmod +x airgap-pack-aws-alb-2.5.1.bin && ./airgap-pack-aws-alb-2.5.1.bin
   ```

   ```shell
   Verifying archive integrity...  100%   MD5 checksums are OK. All good.
   Uncompressing Airgap Pack - aws-alb Version 4.0.17  100%
   Setting up Packs
   - Pushing Pack aws-alb:2.5.1
   Setting up Images
   Setup Completed
   ```

6. Use the following Palette CLI command to upgrade your airgap instance and packages.

   ```shell
   palette ec install
   ```

## Validate
