---
sidebar_label: "PCG"
title: "PCG"
description: "Reference resource for the PCG command."
hide_table_of_contents: false
sidebar_position: 30
tags: ["palette-cli"]
---

The `pcg` command supports Private Cloud Gateway (PCG) operations, such as installing a PCG cluster and validating its
installation. A local [kind](https://kind.sigs.k8s.io/) cluster is created to facilitate creating the PCG cluster in the
target environment. You do not need to install kind or any other dependencies. The CLI includes all the required
dependencies to set up the kind cluster.

## Subcommands

The `pcg` command exposes the following subcommand.

<br />

- `install` - Install a PCG through an interactive wizard. A container runtime is required to install a PCG cluster.

## Limitations

- Passwords set using Palette CLI version 4.7.1 or earlier are not compatible with Palette CLI version 4.7.2 or later.
  As a result, users cannot use configuration files created using version 4.7.1 or earlier to perform Palette CLI
  operations after upgrading to version 4.7.2 or later. Users must update their password by either running the command
  `palette pcg install --config-file <pcg-yaml-location> --update-passwords` and completing the subsequent prompts or
  deleting the existing `pcg.yaml` file.

## Prerequisites

- Docker is required to install a PCG cluster. Refer to the [Docker](https://docs.docker.com/get-docker/) documentation
  to learn how to install Docker on your system.
- You must log in to Palette using the `login` command before importing clusters.
- You must provide an encryption passphrase to secure sensitive data. The passphrase must be between 8 to 32 characters
  long and contain a capital letter, a lowercase letter, a digit, and a special character. You can provide the
  passphrase through the `PALETTE_ENCRYPTION_PASSWORD` environment variable or the `-k` or `--encryption-passphrase`
  flag. Refer to the [Encryption](./../palette-cli.md#encryption) section for more information on encryption.

## Install

Use the `install` subcommand to install a PCG cluster in the following environments. The following flags are supported
by the `install` subcommand.

<br />

| **Short Flag** | **Long Flag**             | **Description**                                                                                                                                                                                                                                                                                                                                                             | **Type** |
| -------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `-f`           | `--config-file`           | Install using a configuration file (optional). Use `-config-only` to generate a configuration file.                                                                                                                                                                                                                                                                         | string   |
| `-k`           | `--encryption-passphrase` | Encryption passphrase to secure sensitive data. The passphrase must be between 8 to 32 characters long and contain a capital letter, a lowercase letter, a digit, and a special character. Can be set through the environment variable `PALETTE_ENCRYPTION_PASSWORD`. Refer to the [Encryption](./../palette-cli.md#encryption) section for more information on encryption. | string   |
| `-o`           | `--config-only`           | Generate configuration file only. This command will not proceed with installation.                                                                                                                                                                                                                                                                                          | boolean  |
| `-h`           | `--help`                  | Help for the install command.                                                                                                                                                                                                                                                                                                                                               | boolean  |
| `-p`           | `--update-passwords`      | Use to update the PCG password. This does not proceed with installation. The `--config-file` flag must be provided. Default: false.                                                                                                                                                                                                                                         | boolean  |

:::warning

Use the latest version of the Palette CLI that matches the version of your Palette or Palette VerteX instance. You can
find the newest version of the Palette CLI on the [Downloads](../../../downloads/cli-tools.md#palette-cli) page.

:::

### Generate a Configuration File

Use the `--config-only` flag to generate a configuration file. The configuration file is used to install a PCG cluster
with pre-defined values without having to go through the interactive wizard.

```shell
palette pcg install --config-only
```

Upon completion of the wizard installation, the configuration file is generated in the HOME directory under the folder
path **.palette/pcg/**. The configuration file is named **pcg.yaml**.

```shell hideClipboard
==== Create PCG reference config ====
==== PCG config saved ====
Location: /Users/demo/.palette/pcg/pcg-20240108150653/pcg.yaml
```

### Install With a Configuration File

Use the `--config-file` flag to install a PCG cluster with a configuration file. You can generate a configuration file
using the `--config-only` flag. Refer to the [Generate a Configuration File](#generate-a-configuration-file) section for
more information.

```shell
palette pcg install --config-file <path-to-config-file>
```

### Update Passwords

You can update the Ubuntu Pro token and the platform credentials in the configuration file using the
`--update-passwords` flag. The `--config-file` flag must be provided. The `--update-passwords` flag does not proceed
with installation.

```shell
palette pcg install --config-file <path-to-config-file> --update-passwords
```

### Supported Environments

You can use the `install` subcommand to install a PCG cluster in the following environments.

| **Platform** | **Install Guide**                                     |
| ------------ | ----------------------------------------------------- |
| MAAS         | [Link](../../../clusters/pcg/deploy-pcg/maas.md)      |
| OpenStack    | [Link](../../../clusters/pcg/deploy-pcg/openstack.md) |
| VMware       | [Link](../../../clusters/pcg/deploy-pcg/vmware.md)    |
