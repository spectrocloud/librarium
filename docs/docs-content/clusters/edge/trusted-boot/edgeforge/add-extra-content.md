---
sidebar_label: "Add Static Binaries to Persistent Partition"
title: "Add Static Binaries to Persistent Partition with Trusted Boot"
description: "Learn about how to add content to the persistent partition of your Edge host with Trusted Boot."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

During EdgeForge, you are able to customize the Operating System (ISO) used by the Installer ISO image. This allows you
to add various utilities that can be useful in setting up your Edge host and getting it ready for cluster creation.

However, if you want to use Trusted Boot, there is a limitation to the size of a bootable Extensible Firmware Interface
(EFI) file. This means that you can no longer add such utilities to your OS as freely as before. If the EFI becomes too
large in size, the Edge host might not be able to boot.

If you would like to add software that can be used after ISO installation, you can instead use the approach described in
this guide to add the compiled static binaries of the software packages to the persistent partition of the installation
partition instead of to the OS image itself. You will be able to access the content both before cluster formation and
after.

## Prerequisites

- The approach described in this guide is based on EdgeForge. You should become familiar with
  [how to use EdgeForge to build ISO with Trusted Boot](./build-trusted-iso.md) before using this approach to add
  software packages to your Edge host.

- Static compiled binaries of the software package you are adding to the Edge host.

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

4. Check out the newest available tag. This guide uses **v4.4.0** tag as an example.

   ```shell
   git checkout v4.4.0
   ```

5. Copy the static binaries of the software package you'd like to add to the Edge host to **overlay/files-iso**.

6. In your **user-data**, add the following section, and replace `YOUR_FILE` with the name of the static binary file. If
   you have multiple files, you should add multiple lines, one line for each file.

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

   For example, if you want to add `wget` and `ping`, you would put both binaries under **overlay/files-iso** and add
   the following to user data.

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

7. Follow [Build Installer ISO with Trusted Boot](./build-trusted-iso.md) to build the installer ISO.

## Validate

1. Follow the [Installation Guide](../deployment-day2/install.md) to install Palette on your Edge host.

2. Issue the command that evokes the static binary. For example, `wget` and confirm that the software package has been
   installed successfully.
