---
sidebar_label: "VMO"
title: "VMO"
description: "Reference resource for the vmo command."
hide_table_of_contents: false
sidebar_position: 60
tags: ["palette-cli"]
---

Use the `vmo` command to migrate Virtual Machines (VMs) and import and deploy vSphere Open Virtual Appliances (OVAs).
The VMs can then be used with the Virtual Machine Orchestrator (VMO).

## Subcommands

- [`deploy-ova`](#deploy-ova) - Deploy an imported vSphere OVA. This command requires you to have an OVA deployment
  file. If you do not have one, you can generate an OVA with the `import-ova` subcommand.

- [`import-ova`](#import-ova) - Import a vSphere OVA. This subcommand will generate an OVA deployment configuration
  file. The configuration can then be deployed using the `deploy-ova` subcommand.

- [`migrate-vm`](#migrate-vm) - Migrate one or more VMware vSphere VMs to Palette VMO.

## Prerequisites

- A Healthy VMO cluster. Refer to the [Create a VMO Profile](../../../vm-management/create-vmo-profile.md) for further
  guidance.
- One or more VMs hosted in VMware vSphere. The VMs should also operate one the
  [`virt-v2v` supported guest systems](https://libguestfs.org/virt-v2v-support.1.html).

## Limitations

- You can only use the `vmo` subcommand with VMs hosted in VMware vSphere.

## Deploy OVA

Use the `deploy-ova` subcommand to deploy an imported vSphere OVA to Palette VMO. The following flags are supported by
the `deploy-ova` subcommand.

| **Short Flag** | **Long Flag**   | **Description**                                                                       | **Type** |
| -------------- | --------------- | ------------------------------------------------------------------------------------- | -------- |
| `-f`           | `--config-file` | Specifies an OVA configuration file.                                                  | string   |
| `-o`           | `--config-only` | Update the OVA configuration file only, without proceeding with the deployment.       | boolean  |
| `-s`           | `--silent`      | Perform a silent OVA deployment. This flag requires the `--config-file` be specified. | boolean  |
| `-h`           | `--help`        | Help for the `deploy-ova` subcommand.                                                 | -        |

## Import OVA

Use the `import-ova` subcommand to import a vSphere OVA to Palette VMO. The following flags are supported by the
`import-ova` subcommand.

| **Short Flag** | **Long Flag**    | **Description**                                                               | **Type** |
| -------------- | ---------------- | ----------------------------------------------------------------------------- | -------- |
| `-f`           | `--config-file`  | Specifies an OVA configuration file.                                          | string   |
| `-o`           | `--config-only`  | Generate the OVA configuration file only, without proceeding with the import. | boolean  |
|                | `--skip-convert` | Skip OVA conversion.                                                          | boolean  |
|                | `--skip-image`   | Skip VM image upload.                                                         | boolean  |
| `-h`           | `--help`         | Help for the `deploy-ova` subcommand.                                         | -        |

## Migrate VM

Use the `migrate-vm` subcommand to migrate one or more VMs from VMware vSphere to Palette VMO. The following flags are
supported by the `migrate-vm` subcommand.

| **Short Flag** | **Long Flag**        | **Description**                                                                                                               | **Type** |
| -------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------- |
| `-f`           | `--config-file`      | Specifies a configuration file for the VM migration.                                                                          | string   |
| `-o`           | `--config-only`      | Generate the migration configuration file only, without proceeding with the migration.                                        | boolean  |
| `-p`           | `--update-passwords` | Update the vSphere and ESXi passwords save in the configuration file. This flag requires the `--config-file` to be specified. | boolean  |
| `-h`           | `--help`             | Help for the `migrate-vm` subcommand.                                                                                         | -        |
