---
sidebar_label: "Non-airgap"
title: "Upgrade Palette Installed on VMware vSphere"
description: "Learn how to upgrade self-hosted Palette in VMware vSphere."
icon: ""
sidebar_position: 0
tags: ["palette", "self-hosted", "vmware", "non-airgap", "upgrade"]
keywords: ["self-hosted", "enterprise"]
---

This guide takes you through the process of upgrading a self-hosted Palette instance installed on VMware vSphere.

:::warning

Before upgrading Palette to a new major version, you must first update it to the latest minor version available. Refer
to the [Supported Upgrade Paths](../upgrade.md#supported-upgrade-paths) section for details.

:::

If your setup includes a PCG, you must also
[allow the PCG to upgrade automatically](../../../clusters/pcg/manage-pcg/pcg-upgrade.md) before each major or minor
Palette upgrade.

## Prerequisites

- Access to the Palette system console.
- A diff or text comparison tool of your choice.

## Upgrade

1. Log in to the Palette system console.

2. From the left **Main Menu**, select **Enterprise Cluster** and then select the **Profile** tab.

3. Copy the configurations for your CSI, CNI, and Kubernetes layers to an external location for backup.

   :::tip

   If your Enterprise Cluster profile has configuration changes or additions, make sure to back up all the customized
   values to preserve them after the upgrade.

   :::

   ![Self-hosted Palette system console with the highlighted Enterprise Cluster profile configuration values.](/enterprise-version_upgrade-upgrade_vmware_non-airgap_copy_configurations.webp)

4. From the left **Main Menu**, select **Update Management** and click **Update**.

   ![Self-hosted Palette system console with Update Management open and the Update button highlighted.](/enterprise-version_upgrade-upgrade_vmware_non-airgap_update.webp)

5. In the **Palette version update** preview modal, from the left menu, select the **Kubernetes** layer. The **Incoming
   changes** pane displays the changes that the upgrade introduces. The **Current configuration** pane displays your
   current layer configuration.

:::info

To complete the Palette upgrade, you need an external diff or text comparison tool. Proceed with the following steps
once you have the comparison tool available next to the Palette system console.

:::

6. Copy the configurations from both **Incoming changes** and **Current configuration** panes to your comparison tool.

7. From your current configuration, transfer only those differences that are custom to your self-hosted Palette instance
   (for example, the `podCIDR` and `serviceClusterIpRange` values). Do not override any other changes or upgrades.

   ![Self-hosted Palette system console with the upgrade preview pane.](/enterprise-version_upgrade-upgrade_vmware_diff-checker.webp)

8. After you finish merging the configurations, copy the resulting configuration, and then paste it to the **Current
   configuration** pane in the Palette system console.

   ![Self-hosted Palette system console with the upgrade preview pane.](/enterprise-version_upgrade-upgrade_vmware_palette-upgrade-preview.webp)

9. Repeat steps six through eight for each Enterprise Cluster profile layer.

10. In the bottom-right corner of the **Palette version update** preview modal, select **Confirm**.

    The system console locks for a couple of minutes while the upgrade is applied.

## Validate

1. Log in to the Palette system console.

2. On the **Summary** page, Palette should display messages that state **You are using the latest version of Palette**
   and **On-prem system console is healthy**.
