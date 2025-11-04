---
sidebar_label: "Upgrade Airgap Palette"
title: "Upgrade Airgap Palette on VMware vSphere"
description: "Upgrade a self-hosted, airgap Palette instance installed on VMware vSphere using the Palette CLI."
icon: ""
sidebar_position: 10
tags: ["self-hosted", "airgap", "vmware", "upgrade", "cli"]
keywords: ["self-hosted", "airgap", "vmware", "upgrade", "cli"]
---

This guide takes you through the process of upgrading a self-hosted airgap Palette instance installed on VMware vSphere.
Before upgrading Palette to a new major version, you must first update it to the latest patch version of the latest
minor version available. Refer to the [Supported Upgrade Paths](./upgrade.md#supported-upgrade-paths) section for
details.

:::warning

If you are upgrading from a Palette version that is older than 4.4.14, ensure that you have executed the utility script
to make the CNS mapping unique for the associated PVC. For more information, refer to the
[Troubleshooting guide](../../../../../troubleshooting/enterprise-install.md#scenario---non-unique-vsphere-cns-mapping).

:::

If your setup includes a PCG, you must also
[allow the PCG to upgrade automatically](../../../../../clusters/pcg/manage-pcg/pcg-upgrade.md) before each major or
minor Palette upgrade.

## Prerequisites

- Access to the Palette system console.

- Access to the Palette airgap support Virtual Machine (VM) that you used for the initial Palette installation.

- Refer to [Access Palette](../../../palette.md#access-palette) to download the new airgap Palette installation bin.

- Contact our Support Team at support@spectrocloud.com to learn if the new version of Palette requires a new OS and
  Kubernetes OVA. If necessary, they will provide you with a link to the OVA, which you will use to upgrade Palette.

- A diff or text comparison tool of your choice.

- The Kubernetes cluster must be set up on a version of Kubernetes that is compatible to your upgraded version. Refer to
  the [Kubernetes Requirements](../install/install.md#kubernetes-requirements) section to find the version required for
  your Palette installation.

## Upgrade

:::info

If the new version of Palette requires you to update the underlying OS or Kubernetes distribution, proceed with the
steps one through four. Otherwise, start at step five.

:::

1. Log in to vCenter.
2. Right-click the cluster or resource group that hosts your self-hosted Palette instance and select **Deploy OVF
   Template**.
3. In the **Deploy OVF Template** wizard, at the **Select an OVF template** step, enter the link to the new OS and
   Kubernetes OVA that you received from our support.

   Consider the following example for reference.

   ```shell
   https://vmwaregoldenimage-console.s3.us-east-2.amazonaws.com/u-2204-0-k-12610-0.ova
   ```

4. At the **Select a name and folder** step:

   - In the **Virtual machine name** field, append the `r_` prefix to the prepopulated OVA name and remove the `.ova`
     extension.

     Consider the following example for reference.

     ```shell
     u-2204-0-k-12610-0.ova >>> r_u-2204-0-k-12610-0
     ```

     :::info

     It is important that you follow this naming convention. Otherwise, Palette will not be able to identify the OS and
     Kubernetes OVA and you will not be able to upgrade your Palette instance.

     :::

   - Under the **Select a location for the virtual machine** selector, choose the **spectro-templates** folder you
     created during installation.

   Once the OS and Kubernetes OVA is available in your **spectro-templates** directory, you can terminate its
   deployment. Refer to the
   [Deploy an OVF or OVA Template](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vm-administration/GUID-AFEDC48B-C96F-4088-9C1F-4F0A30E965DE.html)
   guide for more information on deploying OVAs in vCenter.

5. In your terminal, use the following command template to SSH into the Palette airgap support VM. Enter the path to
   your private SSH key, your username, and the IP or domain of the airgap support VM. The default username is `ubuntu`.

   ```shell
   ssh -i </path/to/private/key> ubuntu@<vm-ip-or-domain>
   ```

   Consider the following command example for reference.

   ```shell
   ssh -i /docs/ssh-private-key.pem ubuntu@palette.example.com
   ```

6. Use the following command to switch to the `root` user account, which you need to proceed with the upgrade.

   ```shell
   sudo --login
   ```

7. Use the following command template to download the new Palette airgap installation bin. Enter the username, password,
   and the Palette airgap installation URL you received from our support team. In the output file name, replace
   `<version>` with the Palette version you are downloading.

   ```shell
   curl --user <username>:<password> --output airgap-<version>.bin <url-to-airgap-installation-bin>
   ```

   Consider the following command example for reference.

   ```shell
   curl --user <username>:<password> --output airgap-4.2.12.bin https://software.spectrocloud.com/airgap-v4.2.12.bin
   ```

8. Refer to the [Additional Packs](../../../../../downloads/self-hosted-palette/additional-packs.md) page and update the
   packs you are currently using. You must update each pack separately.

9. Use the following command template to execute the new Palette airgap installation bin.

   ```shell
   chmod +x airgap-<version>.bin && ./airgap-<version>.bin
   ```

   Consider the following example for reference.

   ```shell
   chmod +x airgap-v4.2.13.bin && ./airgap-v4.2.13.bin
   ```

10. After the Palette airgap binary is verified and uncompressed, it uploads the updates to your existing Palette
    instance. This step takes some time to complete.

    ```shell
    Verifying archive integrity...  100%   MD5 checksums are OK. All good.
    Uncompressing Airgap Setup - Version 4.2.13  100%
    Setting up CLI
    Setting up Manifests
    Setting up Packs
    ...

    //highlight-next-line
    Setup Completed
    ```

    Once the airgap binary is executed, you will receive a **Setup Completed** success message.

11. Log in to the Palette system console.

12. From the left **Main Menu**, select **Enterprise Cluster** and then select the **Profile** tab.

13. Copy the configurations for your CSI, CNI, and Kubernetes layers to an external location for backup.

    :::tip

    If your Enterprise Cluster profile has configuration changes or additions, make sure to back up all the customized
    values to preserve them after the upgrade.

    :::

    ![Self-hosted Palette system console with the highlighted Enterprise Cluster profile configuration values.](/enterprise-version_upgrade-upgrade_vmware_non-airgap_copy_configurations.webp)

14. From the left **Main Menu**, select **Administration** > **Pack Registries**. Then, next to your **spectro-packs**
    registry, select the **three-dot Menu** > **Sync**.

    Palette initiates a registry sync, which can take up to 30 minutes to complete.

15. From the left **Main Menu**, select **Update Management**. Once the registry sync is done, Palette will prompt you
    to update to the new version. Click **Update**.

    ![Self-hosted Palette system console with Update Management open and the Update button highlighted.](/enterprise-version_upgrade-upgrade_vmware_non-airgap_update.webp)

16. In the **Palette version update** preview modal, from the left **Main Menu**, select the **Kubernetes** layer. The
    **Incoming changes** pane displays the changes that the upgrade introduces. The **Current configuration** pane
    displays your current layer configuration.

    :::info

    To complete the Palette upgrade, we recommend using an external diff or text comparison tool. Proceed with the
    following steps once you have the comparison tool available next to the Palette system console.

    :::

17. Copy the configurations from both **Incoming changes** and **Current configuration** panes to your comparison tool.

18. From your current configuration, transfer only those differences that are custom to your self-hosted Palette
    instance (for example, the `podCIDR` and `serviceClusterIpRange` values). Do not override any other changes or
    upgrades.

    ![Self-hosted Palette system console with the upgrade preview pane.](/enterprise-version_upgrade-upgrade_vmware_diff-checker.webp)

19. After you finish merging the configurations, copy the resulting configuration, and then paste it to the **Current
    configuration** pane in the Palette system console.

    ![Self-hosted Palette system console with the upgrade preview pane.](/enterprise-version_upgrade-upgrade_vmware_palette-upgrade-preview.webp)

20. Repeat steps six through eight for each Enterprise Cluster profile layer.

21. In the bottom-right corner of the **Palette version update** preview modal, select **Confirm**.

    The system console locks for a couple of minutes while the upgrade is applied.

## Validate

1. Log in to the Palette system console.

2. On the **Summary** page, Palette should display messages that state **You are using the latest version of Palette**
   and **On-prem system console is healthy**.
