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
