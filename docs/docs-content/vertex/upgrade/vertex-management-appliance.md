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
