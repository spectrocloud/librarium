---
title: "Commands"
metaTitle: "Commands"
metaDescription: "Reference resource for all the supported Palette CLI commands."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';


# Overview

You start the Palette CLI with a single command, `palette`. The CLI accepts various subcommands such as `pde`, `help`, and more. The Palette CLI will return a non-zero exit status during error scenarios. You can use the CLI flags `-h` and `--help` to learn more about each subcommand.

The complete list of subcommands is:

<br />

  * `completion` - Generate the autocompletion script for the specified shell.


  * `help`       -   Help with any command.


  * [`ec`](#ec)         - Palette Enterprise Cluster installation & pre-validation.


  * [`login`](#login)      -  Login to Palette.


  * [`pcg`](#pcg)        -   Private Cloud Gateway installation & pre-validation.


  * [`pde`](#pde)        -   Palette Developer Experience.




# Global Flags

Palette CLI supports the following global flags.

| Short Flag | Long Flag              | Description                                                              | Type    |
|------------|------------------------|--------------------------------------------------------------------------|---------|
| `-c`       | `--config`      | Config file location.                                                     | string  |
| `-h`       | `--help`               | Help with any command.                                                         | N/A     |
| `-l`       | `--log-level`   | Log level. Allowed values: `panic` `fatal` `error` `warn` `info` `debug` `trace` (default `info`) | string |
| `-w`       | `--workspace`   | Workspace location for staging runtime configurations and logs (default `$HOME/.palette`) |   string      |      


# EC

The `ec` subcommand installs a self-hosted Palette Enterprise Cluster (EC) in your target environment. The installation is conducted through an interactive wizard that guides you through the various install configurations available. A local kind cluster is created to faciliate the creation the of the Enterprise cluster in the target environment. You do not need to install kind or any other dependencies, the CLI includes all the required dependencies to stand up the kind cluster. You can use the `ec` command to install self-hosted Palette instance or a self-hosted [VerteX](/vertex/install-palette-vertex) instance. 

The `ec` subcommand exposes the following subcommands.

  <br />

  * `install` - Install a Palette Enterprise Cluster through an interactive wizard.


# Login

The `login` subcommand authenticates the Palette CLI with Palette. The `login` subcommand can be used in interactive mode, which prompts you for required values. Or, you can use flags to provide the subcommand with all the required values such as the API key, the organization ID, and the Palette URL.

  <br />

| Flag                  | Description                                                                          | Type    |  |
|-----------------------|--------------------------------------------------------------------------------------|---------|
| `--api-key`           | Palette API key (omit for interactive login).                                         | string  |
| `--cluster-group-name`| Palette Cluster Group name (optional). Specifies the active Cluster Group.               | string  |
| `--cluster-group-scope`| Palette Cluster Group scope. Required with `--cluster-group-name`. Allowed values are: `project`, `tenant` , and `system`. |string |
| `--console-url`       | Palette URL (omit for interactive login).                                    | string  |
| `--help`              | Help for the `login` subcommand.                                                                       | -       |
| `--insecure`          | Skip Transport Layer Security (TLS) (bypass x509 verification).                                                  | -       |
| `--org`               | Palette Organization name (omit for interactive login).                               | string  |
| `--project`           | Palette Project name (optional). Specifies the active Project.                           | string  |



Example:

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


Upon successful login, a local configuration file named **palette.yaml** is created. This file contains the metadata for CLI operations and is created in your $HOME directory under the folder name **.palette**. The following output is an example of a **palette.yaml** configuration file. Sensitive values, such as passwords, tokens, and API keys are encrypted at rest.

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

# PCG

The `pcg` subcommand supports Private Cloud Gateway (PCG) operations, such as installing a PCG cluster and validating its installation. A local [kind](https://kind.sigs.k8s.io/) cluster is created to facilitate creating the PCG cluster in the target environment. You do not need to install kind or any other dependencies, the CLI includes all the required dependencies to stand up the kind cluster. 


The `pcg` command exposes the following subcommand.

  <br />

  * `install` - Install a PCG through an interactive wizard. 


<br />

## Install

Use the `install` subcommand to install a PCG cluster in the following environments.

<br />


| Platform | Install Guide |
|---|---|
| MAAS | [Link](/clusters/data-center/maas/install-manage-maas-pcg#installpcg) |
| OpenStack | [Link](/clusters/data-center/openstack#installingprivatecloudgateway-openstack) |
| VMware | [Link](/clusters/data-center/vmware/#createvmwareprivatecloudgateway(pcg)) |


To learn more about installing a PCG cluster. Refer to each platform's respective PCG install guide.

# PDE

The `pde` subcommand interacts with the Palette Dev Engine (PDE) platform and its resources. You can use the `pde` command to log in to Palette, manage virtual clusters, and switch the project scope. 

The `pde` command exposes the following subcommands.

  <br />

  * `cluster-group` -   Manage Palette Cluster Groups.


  * `login`         -   Log in to Spectro Cloud Palette. 


  * `project`       -   Manage Palette Projects. 


  * `virtual-cluster` - Manage Palette Virtual Clusters.


## `cluster-group`

Use this command to change the target cluster group commands will target. You can also list all available clusters. The `cluster-group` supports the following subcommands.

  <br />

  * `list`   -      List Palette Cluster Groups.



  * `switch` -      Switch your active Palette Cluster Group.



## `login`

Use this command to authenticate with Palette. This command requires a [Palette API key](/user-management/user-authentication/#api-key). The `login` command has no subcommands but exposes a set of flags to help you log in to the correct Palette environment and scope. The following CLI flags are available for the `login` command.

  <br />

  | Flag                    | Description                                          | Type | Required |
  |-------------------------|------------------------------------------------------|------|----------|
  | `--api-key`             | The Palette API key.                                  |  string    | Yes |
  | `--cluster-group-name`  | The Palette Cluster Group name.                        |  string    |   No       |
  | `--cluster-group-scope` | Palette Cluster Group scope.                           |   string   | No |
  | `--console-url`         | The Palette login URL. The default value is `https://console.spectrocloud.com`                             |  string    | No |
  | `--project`             | The Palette Project name. Defaults to `Default`.    |    string  |     No     |



  Example:

  ```shell
  palette pde login --api-key yourApiKeyHere --console-url https://console.spectrocloud.com
  ```

## `project`

Use this command to change the project scope and list all available projects. You can also deactivate a project with this command. The `project` command supports the following subcommands.


  <br />

  * `deactivate` -  Deactivate your active Palette project and switch to the tenant admin scope.


  * `list`   -      List Palette projects.


  * `switch` -      Switch your active Palette project.


## `virtual-cluster`

You can use the `virtual-cluster` command to manage virtual cluster resources. Below is a list of all the supported subcommands you can use. Use the `--help` flag to learn more about each subcommand.

  <br />

- `create` - Create a Palette Virtual Cluster.


- `delete` - Delete a Palette Virtual Cluster.


- `download-kubeconfig` - Download the kubeconfig for a Palette Virtual Cluster.


- `events` - View events for a Palette Virtual Cluster.


- `lifecycle` - Pause or resume a Palette Virtual Cluster.


- `list` - List Palette Virtual Clusters.


- `resize` - Resize a Palette Virtual Cluster.



<br />
