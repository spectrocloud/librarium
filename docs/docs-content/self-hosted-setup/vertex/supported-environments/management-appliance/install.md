---
sidebar_label: "Install"
title: "Install Palette VerteX with Management Appliance"
description: "Install self-hosted Palette VerteX using the VerteX Management Appliance."
hide_table_of_contents: false
tags: ["management appliance", "self-hosted", "vertex", "install"]
sidebar_position: 30
---

:::danger

This has been split from the former
[VerteX Management Appliance](https://docs.spectrocloud.com/vertex/install-palette-vertex/vertex-management-appliance/)
page.

:::

Follow the instructions to install Palette VerteX using the VerteX Management Appliance on your infrastructure platform.

## Size Guidelines

<PartialsComponent
  category="self-hosted"
  name="size-guidelines-management-appliance"
  edition="VerteX"
  app="VerteX Management Appliance"
/>

## Limitations

- Only public image registries are supported if you are choosing to use an external registry for your pack bundles.

## Prerequisites

<PartialsComponent
  category="self-hosted"
  name="installation-steps-prereqs"
  edition="VerteX"
  version="Palette VerteX"
  install="management-appliance"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>

## Install Palette VerteX

<PartialsComponent
  category="self-hosted"
  name="installation-steps-enablement"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
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
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>

## Next Steps
