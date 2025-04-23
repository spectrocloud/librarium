---
sidebar_label: "Installation"
title: "Installation with Trusted Boot"
description: "Learn about how to install Palette Edge with Trusted Boot on your Edge device."
hide_table_of_contents: false
sidebar_position: 50
tags: ["edge"]
---

This page guides you through installing Palette Edge with Trusted Boot enabled on an Edge device. Some of the steps
included in this guide involve the Basic Input/Output System (BIOS) interface of the Edge device which varies from
machine to machine. This guide uses the Intel NUC 13 Pro as an example.

## Prerequisites

- Edge Installer ISO file. Check out the [Build Edge Artifacts with Trusted Boot](../edgeforge/build-trusted-iso.md) to
  learn how to create an Edge Installer ISO with Trusted Boot.
- The ability to modify the boot order settings to boot from a USB drive and to enter the BIOS interface. Typically this
  requires you to have a wired keyboard and a monitor to display the interface connected to the Edge device.
- A USB disk containing the installer ISO.

:::warning

Before proceeding with installation, check the maximum EFI size that your Edge host is able to boot and compare it
against the installer ISO and provider image. With secure boot enabled and keys enrolled, you won't be able to boot from
the EFI size checking ISO unless you disable secure boot or clear the keys. For more information, refer to
[Check EFI Size and Edge Host Boot Limit](../edgeforge/check-efi-limit.md).

:::

## Instructions

Follow these steps to install Palette Edge with Trusted Boot on your Edge Host.

### Enroll Secure Boot Keys into Edge Device

The following steps are written for the Intel NUC 13 Pro device. If you are using a different device, the exact sequence
of steps might be different. However, you should be able to find the same or similarly worded options in any device that
supports Secure Boot.

1. Insert the USB disk into the Edge device.

2. Power up your Edge device and enter the BIOS interface. Oftentimes you can accomplish this by pressing F2, F1, or F10
   on the keyboard immediately after powering up the device and before you select a boot volume, as is the case in Intel
   NUC 13 Pro. However, the exact method might be different on your Edge device. Consult the manufacturer of your Edge
   device to find out how to enter the BIOS interface.

3. From the BIOS interface, select the **Boot** tab. Then select **Secure Boot**.

4. From the **Secure Boot Menu**, make sure that secure boot is enabled. Then select **Restore to Setup Mode**. Two
   dialogue boxes will pop up to confirm this operation. Select **Yes** to confirm. This will make the device restart.

   :::info

   **User Mode** and **Setup Mode** are UEFI terms. Setting secure boot mode to **Setup Mode** means clearing the keys
   that are currently in the device. This allows you to enroll your own keys, while **User Mode** means you have
   enrolled your own keys.

   On some Edge hosts, the same actions or functionality might be named differently in the BIOS interface. Consult the
   manufacturer of your Edge host to find out how to clear the keys and enroll your own keys.

   :::

In the **.arg** file, if you set the `AUTO_ENROLL_SECUREBOOT_KEYS` argument to `true` when you built the installation
ISO, key enrollment will begin automatically the first time the device boots from the installer ISO. You can skip the
following steps to proceed to [Install Palette Edge with Trusted Boot](#install-palette-edge-with-trusted-boot). In
Virtual Machines (VM), keys will always be auto-enrolled.

5. If you did not set `AUTO_ENROLL_SECUREBOOT_KEYS` to `true` when you built the ISO, you will need to select the
   **Enroll Secure Boot keys: Auto** option in the GRUB menu when the Edge host restarts. This will start the key
   enrollment process.

   :::warning

   There is currently a known issue where if `AUTO_ENROLL_SECUREBOOT_KEYS` is set to `false`, it's possible for manual
   key enrollment to take a few attempts to be successful.

   :::

### Install Palette Edge with Trusted Boot

6. When the keys are finished enrolling, the installation will start automatically after a reboot. Installation
   typically takes about 5 minutes, but can vary depending on your hardware.

7. When installation finishes, the terminal will display the text "Installation has finished, rebooting in 5 seconds" on
   your screen. Remove the USB disk from your Edge device.

   :::info

   If you have more than one boot device, it is good security practice to go into the BIOS again and ensure that the
   target installation disk is prioritized in the boot sequence.

   :::

8. After installation finishes, power up the device. Let your device automatically choose the option from the GRand
   Unified Bootloader (GRUB) Menu. It should boot directly to Edge device registration. Refer to
   [Edge Host Registration](../../site-deployment/site-installation/edge-host-registration.md) to learn more about Edge
   host registration.

## Validate

Use the following steps to validate that Trusted Boot has been enabled on your Edge host. This requires you to have
configured a user on your Edge host. Refer to [Installer Reference](../../edge-configuration/installer-reference.md) for
more information.

1. Press **ALT + RIGHT ARROW**, or **CTRL + ALT + F1**. Replace **ALT** with **OPTION** on a Mac keyboard. This will bring up a
   terminal and allow you to log in with the credentials you configured with the `user-data` file.

   Alternatively, you can establish an SSH connection to your Edge device if you have network access to it.

2. Issue the following command.

   ```shell
   ls -ltr /run/cos/
   ```

   You should receive an output that's similar to the following.

   ```
   total 12
   -rwxr-xr-x  1 root root 1 Apr 30 15:59 uki_boot_mode
   -rwxr-xr-x  1 root root  1 Apr 30 15:59 active_mode
   -rw-r--r--  1 root root 534 Apr 30 15:59 cos-layout.env
   ```

   This confirms that your Edge device was booted with a Unified Kernel Image (UKI), a specific file format tailored to
   achieve a tamper-proof system and encryption of persistent partitions. You can confirm that the device was booted
   from a UKI by the text `uki_boot_mode`.

3. Issue the following command to verify disk encryption.

   ```shell
   lsblk
   ```

   An output similar to the following is displayed. Verify that the **/oem** portion and various directories containing
   sensitive user data are of the `crypt` type and are encrypted. This means that if the boot process is ever altered by
   an unauthorized party, they will not be able to gain access to the encrypted data.

   ```hideClipboard
   NAME          MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINTS
    nvme0n1       259:0    0 476.9G  0 disk
    ├─nvme0n1p1   259:1    0    15G  0 part  /efi
    ├─nvme0n1p2   259:2    0     5G  0 part
    │ └─nvme0n1p2 252:0    0     5G  0 crypt /oem
    └─nvme0n1p3   259:3    0 456.9G  0 part
    └─nvme0n1p3 252:1    0 456.9G  0 crypt /usr/share/pki/trust/anchors
                                            /usr/share/pki/trust
                                            /var/lib/wicked
                                            /var/lib/snapd
                                            /var/lib/rancher
                                            /var/lib/longhorn
                                            /var/lib/kubelet
                                            /var/lib/extensions
                                            /var/lib/dbus
                                            /var/lib/containerd
                                            /var/lib/cni
                                            /etc/ssl/certs
                                            /var/lib/ca-certificates
                                            /etc/zfs
                                            /etc/systemd
                                            /etc/sysconfig
                                            /etc/ssh
                                            /var/snap
                                            /etc/runlevels
                                            /etc/rancher
                                            /etc/modprobe.d
                                            /var/log
                                            /usr/libexec
                                            /etc/kubernetes
                                            /etc/iscsi
                                            /etc/cni
                                            /snap
                                            /root
                                            /opt
                                            /home
                                            /usr/local
   ```

## Next Steps

After you have installed Palette Edge on your Edge device with Trusted Boot, the next step is to register the Edge host
and create your cluster. The process of creating a cluster with Trusted Boot enabled is identical to creating a regular
cluster. However, air-gapped clusters are not supported.

- [Edge Host Registration](../../site-deployment/site-installation/edge-host-registration.md)
- [Cluster Creation](../../site-deployment/cluster-deployment.md)
