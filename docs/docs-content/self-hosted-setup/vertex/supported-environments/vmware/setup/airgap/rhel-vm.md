---
sidebar_label: "Set Up Environment with RHEL"
title: "Set Up Environment with Existing RHEL VM"
description: "Prepare your airgap environment for installing self-hosted Palette VerteX using an existing RHEL VM."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["self-hosted", "vertex", "airgap", "vmware", "rhel"]
keywords: ["self-hosted", "vertex", "airgap", "vmware", "rhel"]
---

This guide helps you prepare your VMware vSphere airgap environment for VerteX installation using an existing Red Hat
Enterprise Linux (RHEL) VM.

You will learn how to execute an appliance binary in your VM that installs the necessary tools to deploy an OCI registry
for hosting VerteX images and assists in starting the VerteX installation.

:::info

This guide is for preparing your airgap environment only. For instructions on installing VerteX on VMware, refer to the
[Install VerteX](../../install/airgap.md) guide.

:::

## Limitations

- Currently, `9.4` is the only supported RHEL version.

<PartialsComponent
  category="self-hosted"
  name="setup-steps"
  edition="VerteX"
  requirementsURL="/self-hosted-setup/vertex/supported-environments/vmware/install#kubernetes-requirements"
/>
