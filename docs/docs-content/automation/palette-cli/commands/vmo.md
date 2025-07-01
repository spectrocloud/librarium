---
sidebar_label: "VMO"
title: "VMO"
description: "Reference resource for the VMO command."
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

## Limitations

- You can use the `vmo` subcommand only with VMs hosted in VMware vSphere.

- You can migrate only VMs whose operating systems are present in the
  [`virt-v2v` supported guest systems](https://libguestfs.org/virt-v2v-support.1.html) list. Refer to
  [Verified Migrations](../../../vm-management/vm-migration-assistant/vm-migration-assistant.md#verified-migrations) for
  a list of operating systems and migration combinations verified by Spectro Cloud.

## Prerequisites

- A healthy VMO cluster. Refer to the [Create a VMO Profile](../../../vm-management/create-vmo-profile.md) for further
  guidance.

- One or more VMs hosted in VMware vSphere.

## Deploy OVA

### Usage

Use the `deploy-ova` subcommand to deploy an imported vSphere OVA to Palette VMO. The following flags are supported by
the `deploy-ova` subcommand. Refer to the
[Import and Deploy OVAs to Palette VMO](../../../vm-management/create-manage-vm/advanced-topics/deploy-import-ova.md)
guide for further details on importing and deploying vSphere OVAs.

| **Short Flag** | **Long Flag**   | **Description**                                                                                                                      | **Type** |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| `-f`           | `--config-file` | Specifies an OVA configuration file.                                                                                                 | string   |
| `-o`           | `--config-only` | Update the OVA configuration file only, without proceeding with the deployment. This flag requires the `--config-file` be specified. | boolean  |
| `-s`           | `--silent`      | Perform a silent OVA deployment. This flag requires the `--config-file` be specified.                                                | boolean  |
| `-h`           | `--help`        | Help for the `deploy-ova` subcommand.                                                                                                | -        |

### Examples

Deploy a vSphere OVA previously imported to Palette VMO in interactive mode.

```shell
palette vmo deploy-ova --config-file ~/.palette/vmo/vms/my-ova-name/my-ova-name.yaml
```

Update the OVA configuration file without proceeding with the deployment.

```shell
palette vmo import-ova --config-file ~/.palette/vmo/vms/my-ova-name/my-ova-name.yaml --config-only
```

Deploy a vSphere OVA previously imported to Palette VMO in interactive mode silently, without blocking the terminal.

```shell
palette vmo deploy-ova --config-file ~/.palette/vmo/vms/my-ova-name/my-ova-name.yaml --silent
```

## Import OVA

### Usage

Use the `import-ova` subcommand to import a vSphere OVA to Palette VMO. The following flags are supported by the
`import-ova` subcommand. The OVA will be converted to the QCOW2 virtual disk storage format. This subcommand generates
an OVA deployment configuration file. You can then either directly upload the imported image to a `DataVolume` or upload
it a Docker image registry. Refer to the
[Import and Deploy OVAs to Palette VMO](../../../vm-management/create-manage-vm/advanced-topics/deploy-import-ova.md)
guide for further details on importing and deploying vSphere OVAs

| **Short Flag** | **Long Flag**    | **Description**                                                               | **Type** |
| -------------- | ---------------- | ----------------------------------------------------------------------------- | -------- |
| `-f`           | `--config-file`  | Specifies an OVA configuration file.                                          | string   |
| `-o`           | `--config-only`  | Generate the OVA configuration file only, without proceeding with the import. | boolean  |
|                | `--skip-convert` | Skip OVA conversion to QCOW2 format.                                          | boolean  |
|                | `--skip-image`   | Skip VM image upload.                                                         | boolean  |
| `-h`           | `--help`         | Help for the `deploy-ova` subcommand.                                         | -        |

### Examples

Import a vSphere OVA to Palette VMO in interactive mode.

```shell
palette vmo import-ova
```

Create a configuration file for the OVA import without proceeding with the import.

```shell
palette vmo import-ova --config-only
```

Import an OVA to Palette VMO using a configuration file. The configuration file is generated using the `--config-only`
flag.

```shell hideCliboard
palette vmo import-ova --config-file ~/.palette/vmo/vms/my-ova-name/my-ova-name.yaml
```

Import an OVA to Palette VMO without converting it to QCOW2 format.

```shell hideCliboard
palette vmo import-ova --skip-convert
```

Import an OVA to Palette VMO without uploading it.

```shell hideCliboard
palette vmo import-ova --skip-image
```

## Migrate VM

### Prerequisites

Refer to
[Migrate a VM to a VMO cluster using the Palette CLI](../../../vm-management/create-manage-vm/advanced-topics/migrate-vm-kubevirt.md#prerequisites)
for a full list of prerequisites.

### Usage

Use the `migrate-vm` subcommand to migrate one or more VMs from VMware vSphere to Palette VMO. The following flags are
supported by the `migrate-vm` subcommand. The migration consists of two phases. First, all guest disks are transferred
to Persistent Volumes (PVs) in K8s using KubeVirt CDI and VMware Virtual Disk Development Kit (VDDK). Then, the guest OS
on the root disk is made bootable and drivers are installed using [virt-v2v](https://libguestfs.org/virt-v2v.1.html).
Refer to the
[Migrate a VM to a VMO cluster using the Palette CLI](../../../vm-management/create-manage-vm/advanced-topics/migrate-vm-kubevirt.md)
guide for further details on migrating a vSphere VM to Palette VMO.

| **Short Flag** | **Long Flag**        | **Description**                                                                                                                | **Type** |
| -------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- |
| `-f`           | `--config-file`      | Specifies a configuration file for the VM migration.                                                                           | string   |
| `-o`           | `--config-only`      | Generate the migration configuration file only, without proceeding with the migration.                                         | boolean  |
| `-p`           | `--update-passwords` | Update the vSphere and ESXi passwords saved in the configuration file. This flag requires the `--config-file` to be specified. | boolean  |
| `-h`           | `--help`             | Help for the `migrate-vm` subcommand.                                                                                          | -        |

### Examples

Migrate a VM to Palette VMO in interactive mode.

```shell
palette vmo migrate-vm
```

Create a configuration file for the VM migration without proceeding with the migration.

```shell
palette vmo migrate-vm --config-only
```

Migrate a VM using a configuration file. The configuration file is generated using the `--config-only` flag.

```shell hideCliboard
palette vmo migrate-vm --config-file ~/.palette/vmo/migrations/migration-123/config.yaml
```

Update the passwords of an VM migration using a configuration file. The configuration file is generated using the
`--config-only` flag.

```shell hideCliboard
palette vmo migrate-vm --config-file ~/.palette/vmo/migrations/migration-123/config.yaml --update-passwords
```
