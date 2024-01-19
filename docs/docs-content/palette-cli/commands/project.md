---
sidebar_label: "Project"
title: "Project"
description: "Reference resource for the project command."
hide_table_of_contents: false
sidebar_position: 50
tags: ["palette-cli"]
---

Use the `project` command to manage projects, the project scope for the CLI, and list all available projects. The
`project` command supports the following subcommands.

{" "}

<br />

- `deactivate` - Deactivate your active Palette project. This command requires you to have tenant admin privileges.

- `list` - List Palette projects. Only projects you have access to are listed.

- `switch` - Switch your active Palette project. You can only switch to projects you have access to.

## Deactivate

Use the `deactivate` subcommand to deactivate your active Palette project. This command requires you to have tenant
admin privileges.

:::warning

Before you deactivate your active Palette project, ensure all active resources are deleted. You will not be to remove a
project with active resources.

:::

## List

Use the `list` subcommand to list all Palette projects. Only projects you have access to are listed.

## Switch

You can switch your active Palette project using the `switch` subcommand. You can only switch to projects you have
access to. The following flags are supported by the `switch` subcommand.

| **Flag** | **Description**                                                                            | **Type** |
| -------- | ------------------------------------------------------------------------------------------ | -------- |
| `--name` | Project name (optional). If specified, only the project with the specified name is listed. | string   |
| `--help` | Help for the `switch` subcommand.                                                          | -        |
