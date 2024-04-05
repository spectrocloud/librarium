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

If your setup includes a PCG, you must also
[allow the PCG to upgrade automatically](../../../clusters/pcg/manage-pcg/pcg-upgrade.md) before each major or minor
Palette upgrade. Additionally, if the new Palette version updates Kubernetes, you need to apply the Kubernetes updates
to your Enterprise Cluster profile.

:::

## Prerequisites

- Access to the Palette system console.

## Upgrade

1. Log in to the Palette system console.

2. From the left **Main Menu**, select **Enterprise Cluster** and then select the **Profile** tab.

3. Copy the configurations for your CSI, CNI, and Kubernetes layers to an external location for backup.

   :::warning

   If your Enterprise Cluster profile has configuration changes or additions, make sure to back up all the customized
   values to preserve them after the upgrade.

   :::

   ![Self-hosted Palette system console with the highlighted Enterprise Cluster profile configuration values.](/enterprise-version_upgrade-upgrade_vmware_non-airgap_copy_configurations.webp)

4. From the left **Main Menu**, select **Update Management** and click **Update**.

   ![Self-hosted Palette system console with Update Management open and the Update button highlighted.](/enterprise-version_upgrade-upgrade_vmware_non-airgap_update.webp)

5. Review the changes that the upgrade introduces. If your Enterprise Cluster Profile had any configuration changes or
   additions, add them to the **Current configuration** pane and select **Confirm**.

   :::warning

   Make sure to transfer the configuration changes and additions in all Enterprise Cluster Profile layers to preserve
   them after the upgrade.

   :::

   ![Self-hosted Palette system console with the upgrade preview pane.](/enterprise-version_upgrade-upgrade_vmware_non-airgap_upgrade-preview.webp)

   The system console locks for a couple of minutes while the upgrade is applied.

:::info

Proceed with the following steps if the Palette upgrade introduces a new version of Kubernetes.

:::

6. Once the system console unlocks, from the left **Main Menu**, select **Enterprise Cluster** and then select the
   **Profile** tab.

7. Open each Enterprise Cluster profile layer and replace their configurations with the values you received from our
   support team.

   The Enterprise Cluster initiates the Kubernetes upgrade and reconciles the Palette instance nodes.

## Validate

1. Log in to the Palette system console.

2. On the **Summary** page, Palette should display a message that states **You are using the latest version of
   Palette**.

   ![Self-hosted Palette system console with upgraded system.](/enterprise-version_upgrade-upgrade_vmware_non-airgap_upgraded.webp)
