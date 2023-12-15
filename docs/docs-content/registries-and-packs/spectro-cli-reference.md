---
sidebar_label: "Spectro Cloud CLI Tool"
title: "Spectro Cloud CLI Tool"
description: "A reference sheet for the Spectro Cloud CLI tool"
icon: ""
hide_table_of_contents: false
sidebar_position: 10
---




# Overview

The Spectro CLI tool is a command-line interface for the Spectro Cloud Pack Registry server to upload or download the packs using commands.

## Prerequisites

- A custom pack registry server must be up and running.

## Installation

The Spectro CLI tool is currently available for OSX and Linux.

1. Download the CLI binary file:

    <Tabs>
    
    <TabItem label="OSX" value="osx_cli">
    
    ```bash
    wget https://spectro-cli.s3.amazonaws.com/v4.1.0/osx/spectro
    ```
    
    </TabItem>
    
    <TabItem label="Linux" value="linux_cli">
    
    ```bash
    wget https://spectro-cli.s3.amazonaws.com/v4.1.0/linux/spectro
    ```
    
    </TabItem>
    
    </Tabs>

2. Provide the executable permission to the CLI spectro.

    ```bash
    chmod +x spectro
    ```

## Global Arguments

List of Arguments available to all the Spectro CLI commands:

## Global Flags

* List of Flags available to all the Spectro CLI commands:

    * h, --help - help for each command

## Commands

<Tabs queryString="cliCommands">

<TabItem label="LOGIN" value="cli_login">

## LOGIN

Authenticate user with Spectro Cloud pack registry by using the login command:

<Tabs queryString="cliLogin">

<TabItem label="Usage" value="cli_login_usage">

```bash
 spectro registry login [SERVER]
```

</TabItem>

<TabItem label="Example" value="cli_login_example">

```bash
 spectro registry login spectro.io:5000
```

```bash
 spectro registry login spectro.io:5000 --insecure --default
```

</TabItem>

</Tabs>

### Args

SERVER - Spectro Cloud pack registry server in the format [host:port]


### Flags

-i, --insecure - Insecure is used when the pack registry is installed in HTTP or HTTPS with self-signed certificates.

-d, --default - Set the server as default Spectro Cloud pack registry for all the CLI commands.

**Note:** In case of HTTPS, if you have access to the pack registry's CA certificate, there is no need for the insecure flag; simply place the CA certificate at /etc/spectro/certs.d/[SERVER]/ca.crt.

</TabItem>

<TabItem label="BUILD" value="cli_build">

## BUILD

Generate Spectro Cloud pack in the target directory using a helm chart.

<Tabs queryString="cliBuild">

<TabItem label="Usage" value="cli_build_usage">

```bash
 spectro pack build [PACK_NAME] [TARGET_DIR]
```

</TabItem>

<TabItem label="Usage" value="cli_build_example">
```bash
 spectro pack build my-awesome-pack ./my-awesome-pack
```

</TabItem>

</Tabs>

### Args

PACK_NAME - Name of the pack 
TARGET_DIR - Directory containing the pack data 

### FLAGS

-p, --push - Push the pack on the registry after creation

-r, --registry-server - Override the default Spectro registry



</TabItem>

<TabItem label="PUSH" value="cli_push">

## PUSH

Upload the pack content from the pack source dir to the Spectro Cloud pack registry.

<Tabs queryString="cliPush">

<TabItem label="Usage" value="cli_push_usage">

```bash
 spectro pack push [PACK_SOURCE_DIR] [flags]
```

</TabItem>

<TabItem label="Example" value="cli_push_example">

```bash
 spectro pack push /tmp/packs/nginx-1.16.1
```

```bash
 spectro pack push /tmp/packs/nginx-1.16.1 --registry-server spectro.io:5000
```

```bash
 spectro pack push /tmp/packs/nginx-1.16.1 --force --message "updated nginx pack values"
```

</TabItem>

</Tabs>

### Args

PACK_SOURCE_DIR: Directory location where pack content is located.

### Flags

-r, --registry-server string - To override the default Spectro Cloud pack registry

-f, --force - If a pack with the same tag already exists in the registry, then the *force* option can be used to overwrite the pack contents in the registry.

-m, --message - A short description about the pack changes. It is mandatory to set this flag when the force option is enabled.

--skip-digest-check - By default, the *force* option can push the pack only if the pack content digest is different than the registry pack digest. So the *skip digest* command can be used to skip the comparison of the digests.

</TabItem>

<TabItem label="LIST" value="cli_list">

## LIST

List all the packs from the Spectro Cloud pack registry:

<Tabs>

<TabItem label="Usage" value="cli_list_usage">

```bash
 spectro pack ls [flags]
```

</TabItem>

<TabItem label="Example" value="cli_list_example">

```bash
 spectro pack ls spectro.io:5000
```

```bash
 spectro pack ls spectro.io:5000 --name ubuntu --registry-server spectro.io:5000
```

</TabItem>

</Tabs>

### Flags

-n, --name string - packs can be filtered by pack name

-r, --registry-server string - To override the default Spectro Cloud pack registry

</TabItem>

<TabItem label="PULL" value="cli_pull">

## PULL

Download the packs from the Spectro Cloud pack registry to a pack target location:

<Tabs>

<TabItem label="Usage" value="cli_pull_usage">

```bash
 spectro pack pull NAME[:TAG|@DIGEST] TARGET_DIR [flags]
```

</TabItem>

<TabItem label="Example" value="cli_pull_example">

```bash
 spectro pack pull nginx:1.16.1 /tmp/packs
```

```bash
 spectro pack pull nginx@sha256:5269f073ac8e3c2536270b496ca1cc537e32e44186a5a014b8c48cddca3c6e87 /tmp/packs --registry-server spectro.io:5000
```

</TabItem>

</Tabs>

### Args

PACK_NAME: TAG|@DIGEST - Name of the pack for a particular tag or a sha digest.

PACK_TARGET_DIR - Directory location where pack content will be pulled.

### Flags

-r, --registry-server string - To override the default Spectro Cloud pack registry.

</TabItem>

<TabItem label="ADD" value="cli_tag_add">

## ADD (Add a Tag)

Create a new tag to a pack which is already pushed to the Spectro Cloud pack registry:

<Tabs>

<TabItem label="Usage" value="cli_add_usage">

```bash
 spectro pack tag add SOURCE_PACK:TAG TARGET_LABEL [flags]
```

</TabItem>

<TabItem label="Example" value="cli_add_example">

```bash
 spectro pack tag add ubuntu:lts__14.4.3 stable
```

```bash
 spectro pack tag add ubuntu:lts__14.4.3 14.4.3-beta -g lts -r spectro.io:5000
```

</TabItem>

</Tabs>

**Note:** Tag is a combination of label and the group name. The label is mandatory whereas the group is optional.

tag → &lt;group&gt;__&lt;label&gt;

Ex. lts___14.4.3 : lts → group, 14.4.3 → label

### Args

PACK_NAME: TAG - Name of the pack for a particular tag to which a new tag will be created.

TARGET_LABEL - Target tag label.

### Flags

-g, --group string - Target tag group.

-r, --registry-server string - To override the default Spectro Cloud pack registry.

</TabItem>

<TabItem label="DELETE" value="cli_tag_delete">

## DELETE (Delete a tag)

Delete a tag to a pack that is already pushed to the Spectro Cloud pack registry.

<Tabs>

<TabItem label="Usage" value="cli_delete_usage">

```bash
 spectro pack tag delete PACK:TAG [flags]
```

</TabItem>

<TabItem label="Example" value="cli_delete_example">

```bash
 spectro pack tag delete ubuntu:14.4.3
```

```bash
 spectro pack tag delete ubuntu:14.4.3 -r spectro.io:5000
```

</TabItem>

</Tabs>

**Note:** Parent tags like major version (Ex: 14.x) and minor version (Ex: 14.4.x) can not be deleted as these are auto-generated by the system. So, when no tags are associated with the pack then these are auto-deleted by the system. When a tag (Ex: 14.4.3) is deleted then the major and minor version tags are auto-linked to the remaining tags of a pack.

### Args

PACK_NAME: TAG - Pack name and Tag which needs to be deleted.

### Flags

-r, --registry-server string - To override the default Spectro Cloud pack registry.

</TabItem>

<TabItem label="VERSION" value="cli_version">

## VERSION

Check the version of the Spectro CLI that is currently installed.

```bash
 spectro  version
Spectro ClI Version 4.1.0 linux/amd64
```

</TabItem>

</Tabs>
