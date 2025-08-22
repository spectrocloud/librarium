---
title: "Upgrade VerteX Management Appliance"
sidebar_label: "VerteX Management Appliance"
description: "Learn how to upgrade the VerteX Management Appliance"
hide_table_of_contents: false
# sidebar_custom_props:
#   icon: "chart-diagram"
tags: ["verteX management appliance", "self-hosted", "vertex"]
sidebar_position: 20
---

:::preview

This is a Tech Preview feature and is subject to change. Upgrades from a Tech Preview deployment may not be available.
Do not use this feature in production workloads.

:::

Follow the instructions to upgrade the
[VerteX Management Appliance](../install-palette-vertex/vertex-management-appliance.md) using a content bundle. The
content bundle is used to upgrade the Palette VerteX instance to a chosen target version.

:::info

The upgrade process will incur downtime for the Palette VerteX management cluster, but your workload clusters will
remain operational.

:::

## Prerequisites

<PartialsComponent
  category="self-hosted"
  name="upgrade-palette-prereqs"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>

- If you are upgrading from version 4.7.3, you must perform the following additional steps to prepare your Palette
  VerteX instance for the upgrade.

  <details>

  <summary>Additional Steps for upgrading from 4.7.3</summary>

  1. Log in to the Local UI of the leader node of the Palette VerteX management cluster.

  2. From the left main menu, click **Cluster**.

  3. Under **Services**, click on the `zot` service port to open the internal Zot registry user interface in a new tab.

  4. Log in to the internal Zot registry using the configured credentials.

     :::tip

     You can find the registry configuration in the **Cluster > Configuration** tab.

     :::

  5. In the search bar, enter `spectro-content/us-docker.pkg.dev/palette-images-fips/k8s/pause` and select the
     corresponding repository.

     If you have chosen a different base path for the registry, ensure you update the `spectro-content` part of the
     search query accordingly.

  6. Click the trash icon for each of the `3.8`, `3.9`, and `3.10` tags to delete them. Select the **DELETE** option in
     the pop-up window when prompted for each tag.

  7. If you are using an external registry, you must also delete the same image tags from your external registry.

  </details>

  :::caution

  If these steps are not performed, you may encounter content sync failures for these image tags on the **Content** page
  in Local UI. These errors will occur after uploading the content bundle to Local UI.

  In addition, if any other image tags fail to sync after the upgrade, you must manually delete those tags from the
  internal Zot registry and any external registry you are using. The following image is an example of a content sync
  failure in Local UI.

  ![Example content sync failure](/enterprise-version_upgrade_palette-management-appliance_content-sync-error_4.7.3.webp)

  :::

## Upgrade Palette VerteX

<PartialsComponent
  category="self-hosted"
  name="upgrade-palette-enablement"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>

## Validate

<PartialsComponent
  category="self-hosted"
  name="upgrade-palette-validate"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>
