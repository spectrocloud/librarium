---
sidebar_label: "Install Palette"
title: "Install Self-Hosted Palette Using Palette Management Appliance"
description: "Learn how to install self-hosted Palette using the Palette Management Appliance"
hide_table_of_contents: false
tags: ["management appliance", "self-hosted", "install"]
sidebar_position: 30
---

:::danger

This has been split from the former
[Palette Management Appliance](https://docs.spectrocloud.com/enterprise-version/install-palette/palette-management-appliance/)
page.

:::

Follow the instructions to install Palette using the Palette Management Appliance on your infrastructure platform.

## Limitations

- Only public image registries are supported if you are choosing to use an external registry for your pack bundles.

## Prerequisites

<PartialsComponent
  category="self-hosted"
  name="installation-steps-prereqs"
  edition="Palette"
  version="Palette"
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
[Self-Hosted Installation - Troubleshooting](../../../troubleshooting/enterprise-install.md#scenario---palettevertex-management-appliance-installation-stalled-due-to-piraeus-operator-pack-in-error-state)
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
