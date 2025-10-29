---
sidebar_label: "Upgrade"
title: "Upgrade Palette VerteX with Management Appliance"
description: "Upgrade self-hosted Palette VerteX installed with the VerteX Management Appliance."
hide_table_of_contents: false
tags: ["management appliance", "self-hosted", "vertex", "upgrade"]
sidebar_position: 50
---

:::preview

This is a Tech Preview feature and is subject to change. Upgrades from a Tech Preview deployment may not be available.
Do not use this feature in production workloads.

:::

Follow the instructions to upgrade the [VerteX Management Appliance](./management-appliance.md) using a content bundle.
The content bundle is used to upgrade the Palette VerteX instance to a chosen target version.

:::info

The upgrade process will incur downtime for the Palette VerteX management cluster, but your workload clusters will
remain operational.

:::

## Supported Upgrade Paths

:::danger

Before upgrading Palette VerteX to a new major version, you must first update it to the latest patch version of the
latest minor version available.

:::

| **Source Version** | **Target Version** | **Support** |
| ------------------ | ------------------ | ----------- |
| 4.7.3              | 4.7.15             | :x:         |

## Prerequisites

<PartialsComponent
  category="self-hosted"
  name="upgrade-palette-prereqs"
  install="management-appliance"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>

- If you are upgrading from version 4.7.3, you must perform the following additional steps to prepare your Palette
  VerteX instance for the upgrade.

  <details>

  <summary>Additional steps for upgrading from 4.7.3</summary>

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
  in Local UI. These errors will occur after uploading the content bundle to Local UI. The following image is an example
  of a content sync failure in Local UI.

  ![Example content sync failure](/enterprise-version_upgrade_palette-management-appliance_content-sync-error_4.7.3.webp)

  In addition, on the **Diagnostics** page within the **Logs** tab, errors may be displayed relating to these image tags
  that are similar to the following:

  ```shell
  Aug 27 12:44:06 edge-1d3f3842cb0fdcef14b65cb510b5974f stylus-operator.sh[18752]: time="2025-08-27T12:44:06Z" level=error msg="failed to push artifact to registrywriting index: PUT https://10.11.12.13:30003/v2/spectro-content/us-docker.pkg.dev/palette-images-fips/k8s/pause/manifests/3.9: MANIFEST_INVALID: manifest invalid; map[description:During upload, manifests undergo several checks ensuring validity. If those checks fail, this error MAY be returned, unless a more specific error is included. The detail will contain information the failed validation. reason:changing manifest media-type from \"application/vnd.docker.distribution.manifest.v2+json\" to \"application/vnd.docker.distribution.manifest.list.v2+json\" is disallowed reference:3.9]" version=v4.7.2 cluster
  ```

  If any other image tags fail to sync with a similar error after the content bundle is uploaded, you must manually
  delete those tags from the internal Zot registry and any external registry you are using.

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

:::info

If the upgrade process stalls, this may be due to the `linstor-satellite.*` pods not using the correct image for the
`drbd-module-loader` container. Refer to
[Scenario - VerteX Management Appliance Fails to Upgrade due to Stuck Linstor Satellite Pods](../../../../troubleshooting/enterprise-install.md#scenario---vertex-management-appliance-fails-to-upgrade-due-to-stuck-linstor-satellite-pods)
for more information.

:::

## Validate

<PartialsComponent
  category="self-hosted"
  name="upgrade-palette-validate"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>
