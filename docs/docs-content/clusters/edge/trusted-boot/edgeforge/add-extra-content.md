---
sidebar_label: "Add Static Binaries to Persistent Partition"
title: "Add Static Binaries to Persistent Partition with Trusted Boot"
description: "Learn about how to add content to the persistent partition of your Edge host with Trusted Boot."
hide_table_of_contents: false
sidebar_position: 60
tags: ["edge"]
---

During EdgeForge, you are able to customize the resulting installed Operating System (OS) of your Edge host. This allows
you to add various utilities that can be useful in setting up your Edge host and getting it ready for cluster creation
as well as using those utilities for host maintenance.

However, if you want to use Trusted Boot, the firmware can impose limitations on the maximum size of a bootable
Extensible Firmware Interface (EFI) file. This means that you can no longer add such utilities to your OS as freely as
before. If the EFI becomes too large in size, the Edge host might not be able to boot it. Refer to
[Check EFI Boot Size Limit](./check-efi-limit.md) to learn how to determine if your Edge host is capable of booting the
Edge artifacts.

If you would like to add software that can be used after the ISO installation, you can instead use the approach
described in this guide to add the compiled static binaries of the software packages to the persistent partition of the
installation partition instead of to the OS image itself. You will be able to access the content both before cluster
formation and after. Because the content is placed in the persistent partitions, it will be encrypted by default.

## Prerequisites

- The approach described in this guide is based on EdgeForge. You should become familiar with
  [how to use EdgeForge to build ISO with Trusted Boot](./build-trusted-iso.md) before using this approach to add
  software packages to your Edge host.

- A physical or virtual Linux machine with _AMD64_ (also known as x86_64) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 32 GB memory
  - 100 GB storage

- Static compiled binaries of the software package you are adding to the Edge host.

- [Git](https://www.git-scm.com/downloads). You can ensure git installation by issuing the git --version command.

## Instructions

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS.git) GitHub repository containing the starter code.

   ```bash
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change to the **CanvOS/** directory.

   ```bash
   cd CanvOS
   ```

3. View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).

   ```bash
   git tag
   ```

4. Check out the latest available tag. This guide uses **v4.4.0** tag as an example.

   ```shell
   git checkout v4.4.0
   ```

5. Copy the static binaries of the software packages you'd like to add to the Edge host to **overlay/files-iso/**.
   **overlay/files-iso** will be mounted at **/run/initramfs/live/** during installation, enabling the installer to copy
   files from there into place during installation.

6. In your `user-data` file, add the following section, and replace `YOUR_FILE` with the name of the static binary file.
   If you have multiple files, you should add multiple lines, one line for each file.

   ```yaml {11}
   after-install:
     - name: Persist iso files
       if: '[ -e "/run/cos/uki_install_mode" ]'
       commands:
         - echo "Copying files to persistent path"
         - if mount | grep /usr/local >/dev/null; then umount /usr/local; fi
         - for d in /dev/mapper/*; do if [ ! "$d" = "/dev/mapper/control" ]; then cryptsetup close $d; fi; done
         - /usr/lib/systemd/systemd-cryptsetup attach persistent $(findfs PARTLABEL=persistent) - tpm2-device=auto
         - mount /dev/mapper/persistent /usr/local
         - mkdir -p /usr/local/bin
         - cp -rfv /run/initramfs/live/YOUR_FILE /usr/local/bin/
         - umount /dev/mapper/persistent
         - if [ -e /dev/mapper/persistent ]; then cryptsetup close /dev/mapper/persistent; fi
   ```

   For example, if you want to add `wget` and `ping`, you would put both binaries under `overlay/files-iso` and add the
   following to your `user-data` file.

   ```yaml {11}
   after-install:
     - name: Persist iso files
       if: '[ -e "/run/cos/uki_install_mode" ]'
       commands:
         - echo "Copying files to persistent path"
         - if mount | grep /usr/local >/dev/null; then umount /usr/local; fi
         - for d in /dev/mapper/*; do if [ ! "$d" = "/dev/mapper/control" ]; then cryptsetup close $d; fi; done
         - /usr/lib/systemd/systemd-cryptsetup attach persistent $(findfs PARTLABEL=persistent) - tpm2-device=auto
         - mount /dev/mapper/persistent /usr/local
         - mkdir -p /usr/local/bin
         - cp -rfv /run/initramfs/live/wget /usr/local/bin/
         - cp -rfv /run/initramfs/live/ping /usr/local/bin/
         - umount /dev/mapper/persistent
         - if [ -e /dev/mapper/persistent ]; then cryptsetup close /dev/mapper/persistent; fi
   ```

7. You have now configured the installer to copy the static binaries you provided to the `/usr/local/bin` folder, which
   is included in the `PATH` variable.

   You can perform further customization of the Installer ISO in your `user-data` file and customize the build script
   with the **.arg** file before starting the build. Follow
   [Build Installer ISO with Trusted Boot](./build-trusted-iso.md) to build the installer ISO.

## Validate

1. Follow the [Installation Guide](../deployment-day2/install.md) to install Palette on your Edge host.

2. Issue the command that evokes the static binary. For example, `wget` and confirm that the software package has been
   installed successfully.
