---
sidebar_label: "Environment Setup with RHEL"
title: "Environment Setup with an Existing RHEL VM"
description: "Learn how to prepare your airgap environment for Palette installation using an existing RHEL VM"
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["self-hosted", "enterprise", "airgap", "vmware", "vsphere", "rhel"]
keywords: ["self-hosted", "enterprise"]
---

This guide helps you prepare your VMware vSphere airgap environment for Palette installation using an existing Red Hat
Enterprise Linux (RHEL) VM.

You will learn how to execute an appliance binary in your VM that installs the necessary tools to deploy an OCI registry
for hosting Palette images and assists in starting the Palette installation.

:::info

This guide is for preparing your airgap environment only. For instructions on installing Palette on VMware, refer to the
[Install Palette](../install.md) guide.

:::

## Limitations

- Currently, `9.4` is the only supported RHEL version.

<PartialsComponent
  category="self-hosted"
  name="setup-steps"
  edition="Palette"
  requirementsURL="/enterprise-version/install-palette#kubernetes-requirements"
/>
