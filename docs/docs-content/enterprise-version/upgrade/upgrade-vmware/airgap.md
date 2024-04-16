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

:::

If your setup includes a PCG, you must also
[allow the PCG to upgrade automatically](../../../clusters/pcg/manage-pcg/pcg-upgrade.md) before each major or minor
Palette upgrade.

## Prerequisites

- Access to the Palette system console.

- Access to the Palette airgap support Virtual Machine (VM) that you used for the initial Palette installation.

- Refer to [Access Palette](/enterprise-version/#access-palette) to download the new airgap Palette installation bin.

- A diff or text comparison tool of your choice.

## Upgrade

1.  Use the following command template to SSH into the Palette airgap support VM. Enter the path to your private SSH
    key, your username, and the IP or domain of the airgap support VM. The default username is `ubuntu`.

    ```shell
    ssh -identity_file </path/to/private/key> ubuntu@<vm-ip-or-domain>
    ```

    Consider the following command example for reference.

    ```shell
    ssh -identity_file /docs/ssh-private-key.pem ubuntu@palette.example.com
    ```

2.  Use the following command to switch to the `root` user account, which you need to proceed with the upgrade.

    ```shell
    sudo --login
    ```

3.  Use the following command template to download the new Palette airgap installation bin. Enter the username,
    password, and the Palette airgap installation URL you received from our support team. In the output file name,
    replace `<version>` with the Palette version you are downloading.

    ```shell
    curl --user <username>:<password> --output airgap-<version>.bin <url-to-airgap-installation-bin>
    ```

    Consider the following command example for reference.

    ```shell
    curl --user <username>:<password> --output airgap-4.2.12.bin https://software.spectrocloud.com/airgap-v4.2.12.bin
    ```

4.  Refer to the [Additional Packs](../../install-palette/airgap/supplemental-packs.md) page and update the packages you
    are currently using. You must update each package separately.

5.  Use the following command template to execute the new Palette airgap installation bin.

    ```shell
    chmod +x airgap-<version>.bin && ./airgap-<version>.bin
    ```

    Consider the following example for reference.

    ```shell
    chmod +x airgap-v4.2.13.bin && ./airgap-v4.2.13.bin
    ```

6.  After the Palette airgap binary is verified and uncompressed, it uploads the updates to your existing Palette
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

7.  Log in to the Palette system console.

8.  From the left **Main Menu**, select **Enterprise Cluster** and then select the **Profile** tab.

9.  Copy the configurations for your CSI, CNI, and Kubernetes layers to an external location for backup.

    :::tip

    If your Enterprise Cluster profile has configuration changes or additions, make sure to back up all the customized
    values to preserve them after the upgrade.

    :::

    ![Self-hosted Palette system console with the highlighted Enterprise Cluster profile configuration values.](/enterprise-version_upgrade-upgrade_vmware_non-airgap_copy_configurations.webp)

10. From the left **Main Menu**, select **Administration** > **Pack Registries**. Then, next to your **spectro-packs**
    registry, select the **three-dot Menu** > **Sync**.

    Palette initiates a registry sync, which can take up to 30 minutes to complete.

11. From the left **Main Menu**, select **Update Management**. Once the registry sync is done, Palette will prompt you
    to update to the new version. Click **Update**.

    ![Self-hosted Palette system console with Update Management open and the Update button highlighted.](/enterprise-version_upgrade-upgrade_vmware_non-airgap_update.webp)

12. In the **Palette version update** preview modal, from the left menu, select the **Kubernetes** layer. The **Incoming
    changes** pane displays the changes that the upgrade introduces. The **Current configuration** pane displays your
    current layer configuration.

    :::info

    To complete the Palette upgrade, we recommend using an external diff or text comparison tool. Proceed with the
    following steps once you have the comparison tool available next to the Palette system console.

    :::

13. Copy the configurations from both **Incoming changes** and **Current configuration** panes to your comparison tool.

14. From your current configuration, transfer only those differences that are custom to your self-hosted Palette
    instance (for example, the `podCIDR` and `serviceClusterIpRange` values). Do not override any other changes or
    upgrades.

    ![Self-hosted Palette system console with the upgrade preview pane.](/enterprise-version_upgrade-upgrade_vmware_diff-checker.webp)

15. After you finish merging the configurations, copy the resulting configuration, and then paste it to the **Current
    configuration** pane in the Palette system console.

    ![Self-hosted Palette system console with the upgrade preview pane.](/enterprise-version_upgrade-upgrade_vmware_palette-upgrade-preview.webp)

16. Repeat steps six through eight for each Enterprise Cluster profile layer.

17. In the bottom-right corner of the **Palette version update** preview modal, select **Confirm**.

    The system console locks for a couple of minutes while the upgrade is applied.

## Validate

1. Log in to the Palette system console.

2. On the **Summary** page, Palette should display messages that state **You are using the latest version of Palette**
   and **On-prem system console is healthy**.
