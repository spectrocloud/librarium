---
sidebar_label: "Upgrade Palette"
title: "Upgrade Self-Hosted Palette with the Palette Management Appliance"
description: "Upgrade self-hosted Palette installed with the Palette Management Appliance."
hide_table_of_contents: false
tags: ["management appliance", "self-hosted", "upgrade"]
sidebar_position: 50
---

:::preview

This is a Tech Preview feature and is subject to change. Upgrades from a Tech Preview deployment may not be available.
Do not use this feature in production workloads.

:::

Follow the instructions to upgrade the [Palette Management Appliance](./management-appliance.md) using a content bundle.
The content bundle is used to upgrade the Palette instance to a chosen target version.

:::info

The upgrade process will incur downtime for the Palette management cluster, but your workload clusters will remain
operational.

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
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

## Upgrade Palette

<PartialsComponent
  category="self-hosted"
  name="upgrade-palette-enablement"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

## Validate

<PartialsComponent
  category="self-hosted"
  name="upgrade-palette-validate"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>
