---
sidebar_label: "Prepare User Data"
title: "Prepare User Data for Locally Managed Edge Installation"
description:
  "Get started with Kubernetes at the edge. Learn how to create and validate a user data file to customize your Edge
  installation."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["getting-started", "tutorial", "locally-managed", "edge"]
---

This tutorial is focuses on building locally managed Edge devices, and is part of the
[Edge Getting Started](../introduction-edge.md) series. You will learn how to create a
[user data](../../../../clusters/edge/edgeforge-workflow/prepare-user-data.md) file, which is a configuration file that
allows you to customize the Edge installation process on the host. The user data file is embedded into the Edge
installer ISO during the [EdgeForge](../../../../clusters/edge/edgeforge-workflow/edgeforge-workflow.md) process. When
the Edge host boots from the installer ISO, it applies the user data configuration to the host.

After creating the user data file, you will proceed to the next tutorial in this series, where you will learn how to
build the required Edge artifacts. You will then deploy your first Edge cluster.

## Prerequisites

To complete this tutorial, ensure the following prerequisites are in place.

- A [Palette account](https://www.spectrocloud.com/get-started).
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

- `stylus`:
  [Palette agent parameters](../../../../clusters/edge/edge-configuration/installer-reference.md#palette-agent-parameters)
  that control aspects of the Edge host's configuration, such as networking, logging, services, users, and permissions.
  The following configuration snippet specifies that the Edge device will be locally managed, and the
  [Terminal User Interface (TUI)](../../../../clusters/edge/site-deployment/site-installation/initial-setup.md) will be
  installed.

  ```shell
  #cloud-config
  stylus:
    managementMode: local
    includeTui: true
  ```

- `install`: The `install` block allows you to configure bind mounts, disk partitions, and post-installation actions
  such as powering off the Edge host once the installation completes, as displayed in the snippet below.

  ```shell
  install:
    poweroff: true
  ```

- `stages`: The `stages` block uses cloud-init stages to personalize the initialization of your Edge hosts during
  various stages of the system boot process. The following example wipes the local NVMe drive, and configures a `docs`
  user with a password during the `initramfs` stage.

  ```shell
  stages:
  before-install:
    - name: "Erase Old Partitions on Boot Disk"
      commands:
        - wipefs --all /dev/nvme0n1
  initramfs:
    - users:
        kairos:
          groups:
            - sudo
          passwd: kairos
      name: "Create user and assign to sudo group"
  ```

  :::tip

  Visit the
  [Edge Installer Configuration Reference](../../../../clusters/edge/edge-configuration/installer-reference.md) page for
  a complete list of configuration parameters, the
  [Prepare User Data](../../../../clusters/edge/edgeforge-workflow/prepare-user-data.md) guide for more examples of user
  data configurations, and the [Cloud Init Stages](../../../../clusters/edge/edge-configuration/cloud-init.md) page for
  the supported cloud init stages.

  :::

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

Check out the newest available tag. This tutorial uses the tag `v4.8.8` as an example.

```shell
git checkout v4.8.8
```

## Create User Data

In this section, you will create a user data file that identifies that the Edge device will be locally managed, and
contains Edge host login credentials. The login credentials allow you to SSH into your Edge host. The user data file
also includes an `install` parameter block to power off the host once the Edge installation completes.

Export your Edge host login credentials.

```shell
export USER=<host-user-name>
export PASSWORD=<user-name-password>
```

Next, issue the command below to create the `user-data` file using the user information.

```bash
cat << EOF > user-data
#cloud-config
stylus:
  managementMode: local
  includeTui: true

install:
  poweroff: false

stages:
  before-install:
    - name: "Erase Old Partitions on Boot Disk"
      commands:
        - wipefs --all /dev/nvme0n1
  initramfs:
    - users:
        $USER:
          groups:
            - sudo
          passwd: $PASSWORD
      name: "Create user and assign to sudo group"
EOF
```

:::info

The #cloud-config header is required by the cloud-init standard.

:::

Confirm that the file was created correctly.

```bash
cat user-data
```

The output should show your user data file, with the user and password to be created. This tutorial uses `kairos` as an
example for both the username and password.

```text hideClipboard
#cloud-config
stylus:
  managementMode: local
  includeTui: true

install:
  poweroff: false

stages:
  before-install:
    - name: "Erase Old Partitions on Boot Disk"
      commands:
        - wipefs --all /dev/nvme0n1
  initramfs:
    - users:
        kairos:
          groups:
            - sudo
          passwd: kairos
      name: "Create user and assign to sudo group"
```

## Validate

From the `CanvOS` directory that contains your user data file, issue the following command to validate the configuration
file. The validation also occurs automatically when you build the
[Edge Installer ISO](../../../../clusters/edge/edgeforge-workflow/edgeforge-workflow.md), ensuring the file follows the
expected schema.

```shell
sudo ./earthly.sh +validate-user-data
```

The output should contain a success message similar to the one displayed below, which means that the user data file is
valid.

```text hideClipboard
+validate-user-data | time="2026-02-13T19:26:14Z" level=info msg="user data validated successfully"
```

:::warning

The validation only checks that the user data follows the expected schema and does not catch issues with the data
itself. For example, an expired registration token will not be flagged by the validation process.

:::

## Next Steps

In this tutorial, you created a user data file that allows you to provide custom configuration to the Edge Installer
ISO. We recommend that you continue to the [Build Edge Artifacts](./build-edge-artifacts.md) tutorial to learn how to
use this file during the Edge Installer ISO build process.
