---
title: "Upgrade Palette Management Appliance"
sidebar_label: "Palette Management Appliance"
description: "Learn how to upgrade the Palette Management Appliance"
hide_table_of_contents: false
# sidebar_custom_props:
#   icon: "chart-diagram"
tags: ["palette management appliance", "self-hosted", "enterprise"]
sidebar_position: 20
---

:::preview

This is a Tech Preview feature and is subject to change. Upgrades from a Tech Preview deployment may not be available.
Do not use this feature in production workloads.

:::

Follow the instructions to upgrade the
[Palette Management Appliance](../install-palette/palette-management-appliance.md) using a content bundle. The content
bundle is used to upgrade the Palette instance to a chosen target version.

:::info

The upgrade process will incur downtime for the Palette management cluster, but your workload clusters will remain
operational.

:::

## Prerequisites

<PartialsComponent
  category="self-hosted"
  name="upgrade-palette-prereqs"
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
