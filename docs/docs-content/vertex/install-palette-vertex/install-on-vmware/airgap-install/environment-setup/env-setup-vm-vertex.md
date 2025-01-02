---
sidebar_label: "Environment Setup with RHEL"
title: "Environment Setup with an Existing RHEL VM"
description: "Learn how to prepare your airgap environment for VerteX installation using an existing RHEL VM"
icon: ""
hide_table_of_contents: false
sidebar_position: 35
tags: ["self-hosted", "vertex", "airgap", "vmware", "vsphere", "rhel"]
keywords: ["self-hosted", "vertex"]
---

This guide helps you prepare your VMware vSphere airgap environment for VerteX installation using an existing Red Hat
Enterprise Linux (RHEL) VM.

You will learn how to execute an appliance binary in your VM that installs the necessary tools to deploy an OCI registry
for hosting VerteX images and assists in starting the VerteX installation.

:::info

This guide is for preparing your airgap environment only. For instructions on installing VerteX on VMware, refer to the
[Install VerteX](../install.md) guide.

:::

## Limitations

- Currently, `9.4` is the only supported RHEL version.

<PartialsComponent
  category="self-hosted"
  name="setup-steps"
  edition="VerteX"
  requirementsURL="/vertex/install-palette-vertex#kubernetes-requirements"
/>
