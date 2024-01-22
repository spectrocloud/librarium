---
sidebar_label: "Commands"
title: "Commands"
description: "Reference resource for all the supported Palette CLI commands."
hide_table_of_contents: false
sidebar_position: 10
tags: ["palette-cli"]
---

You start the Palette CLI with a single command, `palette`. The CLI accepts various subcommands such as `pde`, `help`,
and more. The Palette CLI will return a non-zero exit status during error scenarios. You can use the CLI flags `-h` and
`--help` to learn more about each subcommand.

The complete list of subcommands is:

<br />

- `completion` - Generate the autocompletion script for the specified shell.

- `help` - Help with any command.

- [`ec`](#ec) - Palette Enterprise Cluster installation & pre-validation.

- [`login`](#login) - Login to Palette.

- [`pcg`](#pcg) - Private Cloud Gateway installation & pre-validation.

- [`pde`](#pde) - Palette Developer Experience.

- [`project`](#project) - Manage Palette Projects.

## Global Flags

Palette CLI supports the following global flags.

| Short Flag | Long Flag     | Description                                                                                       | Type   |
| ---------- | ------------- | ------------------------------------------------------------------------------------------------- | ------ |
| `-c`       | `--config`    | Config file location.                                                                             | string |
| `-h`       | `--help`      | Help with any command.                                                                            | N/A    |
| `-l`       | `--log-level` | Log level. Allowed values: `panic` `fatal` `error` `warn` `info` `debug` `trace` (default `info`) | string |
| `-w`       | `--workspace` | Workspace location for staging runtime configurations and logs (default `$HOME/.palette`)         | string |

## EC

The `ec` subcommand installs a self-hosted Palette Enterprise Cluster (EC) in your target environment. The installation
is conducted through an interactive wizard that guides you through the various install configurations available. A local
kind cluster is created to facilitate creating the Enterprise cluster in the target environment. You do not need to
install kind or any other dependencies. The CLI includes all the required dependencies to stand up the kind cluster. You
can use the `ec` command to install a [self-hosted Palette](../enterprise-version/install-palette/install-palette.md)
instance or a self-hosted [VerteX](../vertex/install-palette-vertex/install-palette-vertex.md) instance.

The `ec` subcommand exposes the following subcommand.

{" "}

<br />

- `install` - Install a Palette Enterprise Cluster through an interactive wizard. A container runtime is required to
  install an EC cluster.

### Install

The `install` subcommand installs a Palette Enterprise Cluster in your target environment. You can install Palette or
Palette VerteX using the `install` subcommand. The `install` subcommand can be used in interactive mode, which prompts
you for required values. Alternatively, you can use flags to generate a configuration file.

{" "}

<br />

| Short Flag | Long Flag              | Description                                                                                                                                                                                                                  | Type    |
| ---------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `-f`       | `--config-file`        | Install using a configuration file (optional). Use `-config-only` to generate a configuration file.                                                                                                                          | string  |
| `-o`       | `--config-only`        | Generate configuration file only. This command will not proceed with installation.                                                                                                                                           | boolean |
| `-v`       | `--custom-values-file` | Enterprise Cluster custom values.yaml configuration file (optional). Use this to customize the cluster profile of the Enterprise Cluster. Refer to the [custom value file](#custom-value-file) section for more information. | string  |
| `-p`       | `--update-passwords`   | Update passwords only. Do not proceed with installation. The `--config-file` flag must also be provided.                                                                                                                     | string  |

#### Examples

Install an Enterprise Cluster in interactive mode.

{" "}

<br />

```shell
palette ec install
```

{" "}

<br />

Create a configuration file for the Enterprise Cluster installation.

{" "}

<br />

```shell
palette ec install --config-only
```

{" "}

<br />

Install an Enterprise Cluster using a configuration file. The configuration file is generated using the `--config-only`
flag.

{" "}

<br />

```shell hideCliboard
palette ec install --config-file ~/.palette/ec/ec-20230807143205/ec.yaml
```

{" "}

<br />

Update the passwords of an Enterprise Cluster using a configuration file. The configuration file is generated using the
`--config-only` flag.

{" "}

<br />

```shell hideCliboard
palette ec install --config-file ~/.palette/ec/ec-20230807143205/ec.yaml --update-passwords
```

### Custom Value File

You can customize the [Cluster Profile](../glossary-all.md#cluster-profile) that makes up the Enterprise Cluster by
providing a custom **values.yaml** file that contains values for the various Cluster Profile layers that make up the
Enterprise Cluster. The custom **values.yaml** file is used to customize the Enterprise Cluster to your specific needs.
This is an advanced feature and should only be used by advanced users or when explicitly instructed by our support team.

The **values.yaml** file is made up of the following components:

<br />

- `os` The operating system layer of the Enterprise Cluster. This layer contains the values for the operating system
  that will be used to install the Enterprise Cluster.

- `k8s` The Kubernetes layer of the Enterprise Cluster. This layer contains the configuration values for the Kubernetes
  cluster that is created as part of the Enterprise Cluster installation.

- `csi` The Container Storage Interface (CSI) layer of the Enterprise Cluster. This layer contains the configuration
  values for the CSI driver that is used to provide persistent storage to the Enterprise Cluster.

- `cni` The Container Network Interface (CNI) layer of the Enterprise Cluster. This layer contains the configuration
  values for the CNI driver that is used to provide networking to the Enterprise Cluster.

- `mgmt` The management layer of the Enterprise Cluster. This layer contains the configuration values for the internal
  management components of the Enterprise Cluster.

  You can provide one or more layers in the **values.yaml** file. When you provide a layer configuration, the new
  configuration will be used instead of the default configuration. For example, if you provide a custom **values.yaml**
  file that contains the `os` layer, it will replace the default operating system configuration. The Enterprise Cluster
  profile as follows The **values.yaml** must use the following format:

<br />

```yaml hideClipboard
os: |-
  # ... values.yaml for OS layer go here.
k8s: |-
  # ... values.yaml for K8s layer go here.
csi: |-
  # ... values.yaml for CSI layer go here.
cni: |-
  # ... values.yaml for CNI layer go here.
mgmt: |-
  # ... values.yaml for spectro-mgmt layer go here.
```

The following example shows a custom **values.yaml** file that contains the `os` layer. The `os` layer contains the
configuration for the operating system that will be used to install the Enterprise Cluster.

<br />

```yaml hideClipboard
os: |-
kubeadmconfig:
  preKubeadmCommands:
    - echo "Executing pre kube admin config commands"
    - update-ca-certificates
    - "systemctl restart containerd; sleep 3"
    - 'while [ ! -S /var/run/containerd/containerd.sock ]; do echo "Waiting for containerd..."; sleep 1; done'
  postKubeadmCommands:
    - echo "Executing post kube admin config commands"
  files:
    - targetPath: /usr/local/share/ca-certificates/mycom.crt
      targetOwner: "root:root"
      targetPermissions: "0644"
      content: |
        -----BEGIN CERTIFICATE-----
        MIICyzCCAbOgAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl
        cm5ldGVzMB4XDTIwMDkyMjIzNDMyM1oXDTMwMDkyMDIzNDgyM1owFTETMBEGA1UE
        AxMKa3ViZXJuZXRlczCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMdA
        nZYs1el/6f9PgV/aO9mzy7MvqaZoFnqO7Qi4LZfYzixLYmMUzi+h8/RLPFIoYLiz
        qiDn+P8c9I1uxB6UqGrBt7dkXfjrUZPs0JXEOX9U/6GFXL5C+n3AUlAxNCS5jobN
        fbLt7DH3WoT6tLcQefTta2K+9S7zJKcIgLmBlPNDijwcQsbenSwDSlSLkGz8v6N2
        7SEYNCV542lbYwn42kbcEq2pzzAaCqa5uEPsR9y+uzUiJpv5tDHUdjbFT8tme3vL
        9EdCPODkqtMJtCvz0hqd5SxkfeC2L+ypaiHIxbwbWe7GtliROvz9bClIeGY7gFBK
        jZqpLdbBVjo0NZBTJFUCAwEAAaMmMCQwDgYDVR0PAQH/BAQDAgKkMBIGA1UdEwEB
        /wQIMAYBAf8CAQAwDQYJKoZIhvcNAQELBQADggEBADIKoE0P+aVJGV9LWGLiOhki
        HFv/vPPAQ2MPk02rLjWzCaNrXD7aPPgT/1uDMYMHD36u8rYyf4qPtB8S5REWBM/Y
        g8uhnpa/tGsaqO8LOFj6zsInKrsXSbE6YMY6+A8qvv5lPWpJfrcCVEo2zOj7WGoJ
        ixi4B3fFNI+wih8/+p4xW+n3fvgqVYHJ3zo8aRLXbXwztp00lXurXUyR8EZxyR+6
        b+IDLmHPEGsY9KOZ9VLLPcPhx5FR9njFyXvDKmjUMJJgUpRkmsuU1mCFC+OHhj56
        IkLaSJf6z/p2a3YjTxvHNCqFMLbJ2FvJwYCRzsoT2wm2oulnUAMWPI10vdVM+Nc=
        -----END CERTIFICATE-----
```

## Login

The `login` subcommand authenticates the Palette CLI with Palette. The `login` subcommand can be used in interactive
mode, which prompts you for required values. Or, you can use flags to provide the subcommand with all the required
values such as the API key, the organization ID, and the Palette URL.

{" "}

<br />

| Flag                    | Description                                                                                                                | Type   |     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------ | --- |
| `--api-key`             | Palette API key (omit for interactive login).                                                                              | string |
| `--cluster-group-name`  | Palette Cluster Group name (optional). Specifies the active Cluster Group.                                                 | string |
| `--cluster-group-scope` | Palette Cluster Group scope. Required with `--cluster-group-name`. Allowed values are: `project`, `tenant` , and `system`. | string |
| `--console-url`         | Palette URL (omit for interactive login).                                                                                  | string |
| `--help`                | Help for the `login` subcommand.                                                                                           | -      |
| `--insecure`            | Skip Transport Layer Security (TLS) (bypass x509 verification).                                                            | -      |
| `--org`                 | Palette Organization name (omit for interactive login).                                                                    | string |
| `--project`             | Palette Project name (optional). Specifies the active Project.                                                             | string |

#### Examples

<br />

```shell hideClipboard
palette login --api-key 123456789 --org demo-org --console-url https://console.spectrocloud.com
```

If you want to target a specific project when using the `login` command, use the `--project` flag.

<br />

```shell hideClipboard
palette login  \
 --api-key 123456789 \
 --org demo-org  \
 --console-url https://console.spectrocloud.com \
 --project dev-team
```

Upon successful login, a local configuration file named **palette.yaml** is created. This file contains the metadata for
CLI operations and is created in your $HOME directory under the folder name **.palette**. The following output is an
example of a **palette.yaml** configuration file. Sensitive values, such as passwords, tokens, and API keys are
encrypted at rest.

<br />

```yaml hideClipboard
paletteConfig:
  organization: demo-org
  scope: tenant
  projectName: dev-team
  projectUid: 6342eab2faa0813ead9082e0
  clusterGroupName: beehive
  clusterGroupUid: 635669ba4583891d109fe6c0
  tenantUid: 40b8a9a7f724831be814e5734ea744ed
  ubuntuConfig:
    enablefips: false
    token: ""
  scarConfig:
    scarLoc: ""
    scarUsername: ""
    scarPassword: ""
  mgmt:
    apikey: 2abVsxDfFcJpYZ08+6dNWhkk
    endpoint: https://console.spectrocloud.com
    insecure: false
    pairingcode: ""
runLoc: /Users/demo/.palette/
workspaceLoc: /Users/demo/.palette
```

## PCG

The `pcg` subcommand supports Private Cloud Gateway (PCG) operations, such as installing a PCG cluster and validating
its installation. A local [kind](https://kind.sigs.k8s.io/) cluster is created to facilitate creating the PCG cluster in
the target environment. You do not need to install kind or any other dependencies, the CLI includes all the required
dependencies to stand up the kind cluster.

:::warning

Use the latest version of the Palette CLI that matches the version of your Palette or Palette VerteX instance. You can
find the newest version of the Palette CLI on the [Downloads](../spectro-downloads.md#palette-cli) page.

:::

The `pcg` command exposes the following subcommand.

{" "}

<br />

- `install` - Install a PCG through an interactive wizard. A container runtime is required to install a PCG cluster.

<br />

### Install

Use the `install` subcommand to install a PCG cluster in the following environments. The following flags are supported
by the `install` subcommand.

<br />

| Short Flag | Long Flag        | Description                                                                                         | Type    |
| ---------- | ---------------- | --------------------------------------------------------------------------------------------------- | ------- |
| `-f`       | `--config-file`  | Install using a configuration file (optional). Use `-config-only` to generate a configuration file. | string  |
| `-o`       | `--config-only`  | Generate configuration file only. This command will not proceed with installation.                  | boolean |
| `-i`       | `--inspect-only` | Validate prerequisites for environment. Do not proceed with installation.                           | boolean |

:::warning

Use the latest version of the Palette CLI that matches the version of your Palette or Palette VerteX instance. You can
find the newest version of the Palette CLI on the [Downloads](../spectro-downloads.md#palette-cli) page.

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

| Platform  | Install Guide                                                                             |
| --------- | ----------------------------------------------------------------------------------------- |
| MAAS      | [Link](../clusters/data-center/maas/install-manage-maas-pcg.md#install-pcg)               |
| OpenStack | [Link](../clusters/data-center/openstack.md#installing-private-cloud-gateway---openstack) |
| VMware    | [Link](../clusters/data-center/vmware.md#create-vmware-cloud-gateway)                     |

## PDE

The `pde` subcommand interacts with the Palette Dev Engine (PDE) platform and its resources. You can use the `pde`
command to log in to Palette, manage virtual clusters, and switch the project scope.

The `pde` command exposes the following subcommands.

{" "}

<br />

- `cluster-group` - Manage Palette Cluster Groups.

- `project` - Manage Palette Projects.

- `virtual-cluster` - Manage Palette Virtual Clusters.

### Cluster Group

Use the `cluster-group` command to change the cluster group that commands will target. You can also list all available
clusters. The `cluster-group` supports the following subcommands.

{" "}

<br />

- `list` - List Palette Cluster Groups.

- `switch` - Switch your active Palette Cluster Group.

### Virtual Cluster

You can use the `virtual-cluster` subcommand to manage Palette Virtual Clusters. Below is a list of the supported
subcommands you can use. Use the `--help` flag to learn more about each subcommand.

{" "}

<br />

- `create` - Create a Palette Virtual Cluster.

- `delete` - Delete a Palette Virtual Cluster.

- `download-kubeconfig` - Download the kubeconfig for a Palette Virtual Cluster.

- `events` - View events for a Palette Virtual Cluster.

- `lifecycle` - Pause or resume a Palette Virtual Cluster.

- `list` - List Palette Virtual Clusters.

- `resize` - Resize a Palette Virtual Cluster.

## Project

Use the `project` command to manage projects, the project scope for the CLI, and list all available projects. The
`project` command supports the following subcommands.

{" "}

<br />

- `deactivate` - Deactivate your active Palette project. This command requires you to have tenant admin privileges.

- `list` - List Palette projects. Only projects you have access to are listed.

- `switch` - Switch your active Palette project. You can only switch to projects you have access to.

<br />
