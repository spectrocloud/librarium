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

- `pde` - Palette Developer Experience.

# Global Flags

Palette CLI supports the following global flags.

| Short Flag | Long Flag     | Description                                                                                       | Type   |
| ---------- | ------------- | ------------------------------------------------------------------------------------------------- | ------ |
| `-c`       | `--config`    | Config file location.                                                                             | string |
| `-h`       | `--help`      | Help with any command.                                                                            | N/A    |
| `-l`       | `--log-level` | Log level. Allowed values: `panic` `fatal` `error` `warn` `info` `debug` `trace` (default `info`) | string |
| `-w`       | `--workspace` | Workspace location for staging runtime configurations and logs (default `$HOME/.palette`)         | string |

## PDE

The `pde` subcommand interacts with the Palette Dev Engine (PDE) platform and its resources. You can use the `pde`
command to log in to Palette, manage virtual clusters, and switch the project scope. The `pde` command exposes the
following subcommands.

{" "}

<br />

- `cluster-group` - Manage Palette Cluster Groups.

- `login` - Log in to Spectro Cloud Palette.

- `project` - Manage Palette Projects.

- `virtual-cluster` - Manage Palette Virtual Clusters.

### `cluster-group`

Use this command to change the target cluster group commands will target. You can also list all available clusters. The
`cluster-group` supports the following subcommands.

{" "}

<br />

- `list` - List Palette Cluster Groups.

- `switch` - Switch your active Palette Cluster Group.

### `login`

Use this command to authenticate with Palette. This command requires a
[Palette API key](../user-management/user-management.md#user-login). The `login` command has no subcommands but exposes
a set of flags to help you log in to the correct Palette environment and scope. The following CLI flags are available
for the `login` command.

{" "}

<br />

| Flag                    | Description                                                                    | Type   | Required |
| ----------------------- | ------------------------------------------------------------------------------ | ------ | -------- |
| `--api-key`             | The Palette API key.                                                           | string | Yes      |
| `--cluster-group-name`  | The Palette Cluster Group name.                                                | string | No       |
| `--cluster-group-scope` | Palette Cluster Group scope.                                                   | string | No       |
| `--console-url`         | The Palette login URL. The default value is `https://console.spectrocloud.com` | string | No       |
| `--project`             | The Palette Project name. Defaults to `Default`.                               | string | No       |

Example:

```shell
palette pde login --api-key yourApiKeyHere --console-url https://console.spectrocloud.com
```

### `project`

Use this command to change the project scope and list all available projects. You can also deactivate a project with
this command. The `project` command supports the following subcommands.

{" "}

<br />

- `deactivate` - Deactivate your active Palette project and switch to the tenant admin scope.

- `list` - List Palette projects.

- `switch` - Switch your active Palette project.

## `virtual-cluster`

You can use the `virtual-cluster` command to manage virtual cluster resources. Below is a list of all the supported
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
