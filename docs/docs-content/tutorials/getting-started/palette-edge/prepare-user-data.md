---
sidebar_label: "Prepare User Data"
title: "Prepare User Data for Edge Installation"
description:
  "Get started with Kubernetes at the edge. Learn how to create and validate a user data file to customize your Edge
  installation."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["getting-started", "tutorial", "edge"]
---

This tutorial is the first in the [Edge Getting Started](./introduction-edge.md) series. You will learn how to create a
[user data](../../../clusters/edge/edgeforge-workflow/prepare-user-data.md) file, which is a configuration file that
allows you to customize the Edge installation process on the host. The user data file is embedded into the Edge
installer ISO during the [EdgeForge](../../../clusters/edge/edgeforge-workflow/edgeforge-workflow.md) process. When the
Edge host boots from the installer ISO, it applies the user data configuration to the host.

After creating the user data file, you will proceed to the next tutorial in this series, where you will learn how to
build the required Edge artifacts. You will then install the Palette agent on your host and use it as a node to deploy
your first Edge cluster.

## Prerequisites

To complete this tutorial, ensure the following prerequisites are in place.

- A [Palette account](https://www.spectrocloud.com/get-started) with
  [tenant admin](../../../tenant-settings/tenant-settings.md) access.
- A physical or virtual Linux machine with an AMD64 (also known as x86_64) processor architecture and the following
  minimum hardware configuration:
  - 4 CPUs
  - 8 GB memory
  - 150 GB storage
- The following software installed on the Linux machine:
  - [Docker Engine](https://docs.docker.com/engine/install/) with `sudo` privileges. Alternatively, you can install
    [Earthly](https://earthly.dev/), in which case you will not need `sudo` privileges.
  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## User Data Configuration Blocks

The user data file supports multiple parameters that allow you to customize the Edge installation and consists of three
main configuration blocks:

- `stylus`: Palette agent parameters that control aspects of the Edge host's configuration, such as networking, logging,
  services, users, and permissions. The following configuration snippet specifies the Palette endpoint, a registration
  token, and the Palette project name that the host uses to register with Palette. It also provides tags that are
  assigned to the device as labels.

  ```shell
  #cloud-config
  stylus:
    site:
      paletteEndpoint: api.spectrocloud.com
      edgeHostToken: aUAxxxxxxxxx0ChYCrO
      projectUid: Default
      tags:
        city: london
        building: building-1
  ```

- `install`: The `install` block allows you to configure bind mounts, disk partitions, and post-installation actions
  such as powering off the Edge host once the installation completes, as displayed in the snippet below.

  ```shell
  install:
    poweroff: true
  ```

- `stages`: The `stages` block uses cloud-init stages to personalize the initialization of your Edge hosts during
  various stages of the system boot process. The following example configures a `docs` user with a password and SSH key
  during the `initramfs` stage.

  ```shell
  stages:
    initramfs:
      - users:
          docs:
            passwd: ******
            groups:
            - sudo
            ssh_authorized_keys:
            - ssh-rsa AAAAB3N…
  ```

  :::tip

  Visit the [Edge Installer Configuration Reference](../../../clusters/edge/edge-configuration/installer-reference.md)
  page for a complete list of configuration parameters, the
  [Prepare User Data](../../../clusters/edge/edgeforge-workflow/prepare-user-data.md) guide for more examples of user
  data configurations, and the [Cloud Init Stages](../../../clusters/edge/edge-configuration/cloud-init.md) page for the
  supported cloud init stages.

  :::

## Create Palette Registration Token

Registration tokens allow Edge hosts to register with Palette and are provided through the user data file.

To create a registration token, log in to [Palette](https://console.spectrocloud.com/) as a tenant admin and switch to
the **Tenant Admin** scope.

Next, navigate to the left main menu and select **Tenant Settings** > **Registration Tokens**.

Click **Add New Registration Token**, then provide a token name, default project, and expiration date. Confirm your
changes and copy the generated registration token.

## Check Out Starter Code

Open up a terminal window on your Linux machine and clone the `CanvOS` repository. This repository contains the files
and scripts required to build Edge artifacts.

```shell
git clone https://github.com/spectrocloud/CanvOS.git
```

Navigate to the `CanvOS` directory.

```shell
cd CanvOS
```

Check the available git tags.

```shell
git tag --sort=v:refname
```

Check out the newest available tag. This tutorial uses the tag `v4.6.24` as an example.

```shell
git checkout v4.6.24
```

## Create User Data

In this section, you will create a user data file that contains your Palette registration token, Palette endpoint, and
Edge host login credentials. The login credentials allow you to SSH into your Edge host, while the Palette registration
token and endpoint enable the host to register with your Palette instance. The user data file also includes an `install`
parameter block to power off the host once the Edge installation completes.

Export your Palette registration token and Edge host login credentials.

```bash
export TOKEN=<palette-registration-token>
export USER=<host-user-name>
export PASSWORD=<user-name-password>
```

Next, issue the command below to create the `user-data` file using the exported token and user information.

```bash
cat << EOF > user-data
#cloud-config
stylus:
  site:
    edgeHostToken: $TOKEN
    paletteEndpoint: api.spectrocloud.com

stages:
  initramfs:
    - users:
        $USER:
          passwd: $PASSWORD

install:
  poweroff: true
EOF
```

:::info

The #cloud-config header is required by the cloud-init standard.

:::

Confirm that the file was created correctly.

```bash
cat user-data
```

The output should show your user data file, with the value of your Palette registration token assigned to the
`edgeHostToken` parameter, as well as the user and password to be created. This tutorial uses `kairos` as an example for
both the username and password.

```text hideClipboard
#cloud-config
stylus:
  site:
    edgeHostToken: ****************
    paletteEndpoint: api.spectrocloud.com

stages:
  initramfs:
    - users:
        kairos:
          passwd: kairos

install:
  poweroff: true
```

## Validate

From the `CanvOS` directory that contains your user data file, issue the following command to validate the configuration
file. The validation also occurs automatically when you build the
[Edge Installer ISO](../../../clusters/edge/edgeforge-workflow/edgeforge-workflow.md), ensuring the file follows the
expected schema.

```shell
sudo ./earthly.sh +validate-user-data
```

The output should contain a success message similar to the one displayed below, which means that the user data file is
valid.

```text hideClipboard
+validate-user-data | time="2025-06-25T14:00:07Z" level=info msg="user data validated successfully"
```

:::warning

The validation only checks that the user data follows the expected schema and does not catch issues with the data
itself. For example, an expired registration token will not be flagged by the validation process.

:::

## Next Steps

In this tutorial, you created a user data file that allows you to provide custom configuration to the Edge Installer
ISO. We recommend that you continue to the [Build Edge Artifacts](./build-edge-artifacts.md) tutorial to learn how to
use this file during the Edge Installer ISO build process.
