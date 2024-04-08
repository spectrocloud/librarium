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

The following list contains all the supported Palette CLI subcommands. Click on a subcommand to learn more about it.

- `completion` - Generate the autocompletion script for the specified shell.

- `help` - Help with any command.

- [`docs`](docs.md) - Start the Palette documentation site in your local environment for an offline experience.

- [`ec`](ec.md) - Palette Enterprise Cluster installation & pre-validation.

- [`import`](import.md) - Import clusters into Palette.

- [`login`](login.md) - Login to Palette.

- [`pcg`](pcg.md) - Private Cloud Gateway installation & pre-validation.

- [`pde`](pde.md) - Palette Developer Experience.

- [`project`](project.md) - Manage Palette Projects.

- [`validator`](validator.md) - Deploy a kind cluster and install the Validator framework to validate your environment
  is ready for Palette.

## Global Flags

Palette CLI supports the following global flags.

| Short Flag | Long Flag     | Description                                                                                       | Type   |
| ---------- | ------------- | ------------------------------------------------------------------------------------------------- | ------ |
| `-c`       | `--config`    | Config file location.                                                                             | string |
| `-h`       | `--help`      | Help with any command.                                                                            | N/A    |
| `-l`       | `--log-level` | Log level. Allowed values: `panic` `fatal` `error` `warn` `info` `debug` `trace` (default `info`) | string |
| `-w`       | `--workspace` | Workspace location for staging runtime configurations and logs (default `$HOME/.palette`)         | string |

## Resources

- [Docs](docs.md)

- [EC](ec.md)

- [Login](login.md)

- [PCG](pcg.md)

- [PDE](pde.md)

- [Project](project.md)

- [Validator](validator.md)

- [Import](import.md)
