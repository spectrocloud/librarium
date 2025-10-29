---
sidebar_label: "Set Up Environment with RHEL"
title: "Set Up Environment with Existing RHEL VM"
description: "Prepare your airgap environment for installing self-hosted Palette using an existing RHEL VM."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["self-hosted", "airgap", "vmware", "rhel"]
keywords: ["self-hosted", "airgap", "vmware", "rhel"]
---

This guide helps you prepare your VMware vSphere airgap environment for Palette installation using an existing Red Hat
Enterprise Linux (RHEL) VM.

You will learn how to execute an appliance binary in your VM that installs the necessary tools to deploy an OCI registry
for hosting Palette images and assists in starting the Palette installation.

:::info

This guide is for preparing your airgap environment only. For instructions on installing Palette on VMware, refer to the
[Install Palette](../../install/airgap.md) guide.

:::

## Limitations

- Currently, `9.4` is the only supported RHEL version.

<PartialsComponent
  category="self-hosted"
  name="setup-steps"
  edition="Palette"
  install="vmware"
  requirementsURL="/self-hosted-setup/palette/supported-environments/vmware/install#kubernetes-requirements"
/>
