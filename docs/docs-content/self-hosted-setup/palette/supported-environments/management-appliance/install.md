---
sidebar_label: "Install"
title: "Install Palette with Management Appliance"
description: "Learn how to install self-hosted Palette using the Palette Management Appliance."
hide_table_of_contents: false
tags: ["management appliance", "self-hosted", "install"]
sidebar_position: 30
---

:::preview

This is a Tech Preview feature and is subject to change. Upgrades from a Tech Preview deployment may not be available.
Do not use this feature in production workloads.

:::

:::danger

This has been split from the former
[Palette Management Appliance](https://docs.spectrocloud.com/enterprise-version/install-palette/palette-management-appliance/)
page.

:::

Follow the instructions to install Palette using the Palette Management Appliance on your infrastructure platform.

## Size Guidelines

<PartialsComponent
  category="self-hosted"
  name="size-guidelines-management-appliance"
  edition="Palette"
  app="Palette Management Appliance"
/>

## Limitations

- Only public image registries are supported if you are choosing to use an external registry for your pack bundles.

## Prerequisites

<PartialsComponent
  category="self-hosted"
  name="installation-steps-prereqs"
  edition="Palette"
  version="Palette"
  install="management-appliance"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

## Install Palette

<PartialsComponent
  category="self-hosted"
  name="installation-steps-enablement"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

:::warning

If your installation is not successful, verify that the `piraeus-operator` pack was correctly installed. For more
information, refer to the
[Self-Hosted Installation - Troubleshooting](../../../../troubleshooting/enterprise-install.md#scenario---palettevertex-management-appliance-installation-stalled-due-to-piraeus-operator-pack-in-error-state)
guide.

:::

## Validate

<PartialsComponent
  category="self-hosted"
  name="installation-steps-validate"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

## Next Steps
