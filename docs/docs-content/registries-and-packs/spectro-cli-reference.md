---
sidebar_label: "Spectro Cloud CLI Tool"
title: "Spectro Cloud CLI Tool"
description: "A reference sheet for the Spectro Cloud CLI tool"
icon: ""
hide_table_of_contents: false
sidebar_position: 10
---

The Spectro CLI tool is a command-line interface to interact with Palette registry server. You can use the CLI to upload
or download packs and perform other operations.

:::info

We recommend using an OCI registry to store and maintain your packs. Refer to the
[OCI registry](registries/oci-registry/oci-registry.md) section for more information.

:::

## Prerequisites

- A Legacy Pack Registry server must be available and accessible from the CLI. Refer to the
  [Add Custom Registries](./adding-a-custom-registry.md) section for more information.

## Installation

The Spectro CLI tool is currently available for OSX and Linux.

1. Download the CLI file for your operating system.

   <PartialsComponent category="cli-tools" name="spectro-cloud-cli-tool-download" />

2. Provide the executable permission to the CLI spectro.

   ```bash
   chmod +x spectro
   ```

## Global Flags

The following flags are available for all the Spectro CLI commands

| Short Flag | Long Flag | Description                                      | Type    |
| ---------- | --------- | ------------------------------------------------ | ------- |
| `-h`       | `--help`  | Help for the command                             | boolean |
| `-s`       | `--home`  | Spectro home directory (default: $HOME/.spectro) | string  |

## Commands

Reference information for all the Spectro CLI commands.

## Registry

### Login

Authenticate user with Spectro Cloud pack registry by using the login command:

```bash
 spectro registry login [SERVER]
```

#### Examples

```bash
 spectro registry login spectro.io:5000
```

```bash
 spectro registry login spectro.io:5000 --insecure --default
```

#### Arguments

SERVER - Spectro Cloud pack registry server in the format [host:port]

#### Flags

-i, --insecure - Insecure is used when the pack registry is installed in HTTP or HTTPS with self-signed certificates.

-d, --default - Set the server as default Spectro Cloud pack registry for all the CLI commands.

:::tip

If you have access to the pack registry's Certificate Authority (CA) certificate. Place the CA certificate in the
**/etc/spectro/certs.d/[SERVER]/ca.crt** folder. Replace the [SERVER] with the pack registry server name.

:::

## Pack

The following subcommands are available for the `pack` command.

### Build

Generate a pack in the target directory using a Helm Chart.

```bash
 spectro pack build [PACK_NAME] [TARGET_DIR]
```

#### Examples

```bash
 spectro pack build my-awesome-pack ./my-awesome-pack
```

#### Arguments

PACK_NAME - Name of the pack TARGET_DIR - Directory containing the pack data

#### Flags

-p, --push - Push the pack on the registry after creation

-r, --registry-server - Override the default Spectro registry

### Push

Upload the pack content from the pack source dir to the Spectro Cloud pack registry.

```bash
 spectro pack push [PACK_SOURCE_DIR] [flags]
```

#### Examples

```bash
 spectro pack push /tmp/packs/nginx-1.16.1
```

```bash
 spectro pack push /tmp/packs/nginx-1.16.1 --registry-server spectro.io:5000
```

```bash
 spectro pack push /tmp/packs/nginx-1.16.1 --force --message "updated nginx pack values"
```

#### Arguments

PACK_SOURCE_DIR: Directory location where pack content is located.

#### Flags

-r, --registry-server string - To override the default Spectro Cloud pack registry

-f, --force - If a pack with the same tag already exists in the registry, then the _force_ option can be used to
overwrite the pack contents in the registry.

-m, --message - A short description about the pack changes. It is mandatory to set this flag when the force option is
enabled.

--skip-digest-check - By default, the _force_ option can push the pack only if the pack content digest is different than
the registry pack digest. So the _skip digest_ command can be used to skip the comparison of the digests.

### List

List all the packs from the Spectro Cloud pack registry:

```bash
 spectro pack ls [flags]
```

#### Examples

```bash
 spectro pack ls spectro.io:5000
```

```bash
 spectro pack ls spectro.io:5000 --name ubuntu --registry-server spectro.io:5000
```

#### Flags

-n, --name string - packs can be filtered by pack name

-r, --registry-server string - To override the default pack registry

Download the packs from the pack registry to a pack target location:

```bash
 spectro pack pull NAME[:TAG|@DIGEST] TARGET_DIR [flags]
```

#### Examples

```bash
 spectro pack pull nginx:1.16.1 /tmp/packs
```

```bash
 spectro pack pull nginx@sha256:5269f073ac8e3c2536270b496ca1cc537e32e44186a5a014b8c48cddca3c6e87 /tmp/packs --registry-server spectro.io:5000
```

### Tag

#### Arguments

PACK_NAME: TAG|@DIGEST - Name of the pack for a particular tag or a SHA digest.

PACK_TARGET_DIR - Directory location where pack content will be pulled.

#### Flags

-r, --registry-server string - To override the default pack registry.

Create a new tag to a pack which is already pushed to the pack registry:

```bash
 spectro pack tag add SOURCE_PACK:TAG TARGET_LABEL [flags]
```

#### Examples

```bash
 spectro pack tag add ubuntu:lts__14.4.3 stable
```

```bash
 spectro pack tag add ubuntu:lts__14.4.3 14.4.3-beta -g lts -r spectro.io:5000
```

:::info

Tag is a combination of label and the group name. The label is mandatory, whereas the group is optional.

:::

Using the example `lts___14.4.3`, the following is the breakdown of the tag:

| Element       | Description                                                      | Required |
| ------------- | ---------------------------------------------------------------- | -------- |
| `lts`         | The group name.                                                  | No       |
| `14.4.3 `     | The label.                                                       | Yes      |
| `lts__14.4.3` | The tag, which is a combination of the group name and the label. | Yes      |

#### Arguments

PACK_NAME: TAG - Name of the pack for a particular tag to which a new tag will be created.

TARGET_LABEL - Target tag label.

#### Flags

-g, --group string - Target tag group.

-r, --registry-server string - To override the default Spectro Cloud pack registry.

To remove a tag from a pack which is already pushed to the pack registry use the `pack tag delete` subcommand.

```bash
 spectro pack tag delete PACK:TAG [flags]
```

#### Examples

```bash
 spectro pack tag delete ubuntu:14.4.3
```

```bash
 spectro pack tag delete ubuntu:14.4.3 -r spectro.io:5000
```

:::info

Parent tags, such as major version (Ex: 14.x) and minor version (Ex: 14.4.x) can not be deleted. These tags are
auto-generated by the system. If no tags are associated with the pack then these are auto-deleted by the system. For
example, if the tag `14.4.3` is deleted, then the major and minor version tags are auto-linked to the remaining tags of
a pack.

:::

#### Arguments

PACK_NAME: TAG - Pack name and Tag which needs to be deleted.

#### Flags

-r, --registry-server string - To override the default Spectro Cloud pack registry.

## Version

Check the version of the Spectro CLI that is currently installed.

```shell
spectro version
```

<!-- spectro-cli-version-output -->

```bash hideClipboard
Spectro CLI Version 4.7.0 linux/amd64
```
