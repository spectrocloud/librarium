---
sidebar_label: "Installation with Trusted Boot"
title: "Installation with Trusted Boot"
description: "Learn about how to install Palette Edge with Trusted Boot on your Edge device."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

This page guides you through installing Palette Edge with Trusted Boot enabled on an Edge device. Some of the steps
included in this guide involve the BIOS interface of the Edge device which varies from machine to machine. We use the
Intel NUC 13 Pro as an example.

## Prerequisites

- Edge Installer ISO file. Check out the [Build Edge Artifacts with Trusted Boot](./build-trusted-iso.md) to learn how
  to create an Edge Installer ISO with Trusted Boot.
- The ability to modify the boot order settings to boot from a USB drive and to enter the BIOS interface. Typically this
  requires you to have a wired keyboard and a monitor to display the interface connected to the Edge device.
- A USB disk containing the installer ISO.

## Instructions

### Enroll Secure Boot Keys into Edge Device

The following steps are written for the Intel NUC 13 Pro device. If you are using a different device, the exact sequence
of steps might be different. However, you should be able to find the same or similarly worded options in any device that
supports Secure Boot.

1. Insert the USB disk into the Edge device.

2. Power up your Edge device and enter the BIOS interface. Oftentimes you can accomplish this by pressing F2 on the
   keyboard immediately after powering up the deice and before you select a boot volume, as is the case in Intel NUC 13
   Pro. However, the exact method might be different on your Edge device. Consult the manufacturer of your Edge device
   to find out how to enter the BIOS interface.

3. From the BIOS menu, select the **Boot** tab. Then select **Secure Boot**.

4. From the **Secure Boot Menu**, make sure that secure boot is enabled. Then select **Restore to Setup Mode**. Two
   dialogue boxes will pop up to confirm this operation. Select **Yes** to confirm. This will make the device restart.

   If you set the `AUTO_ENROLL_SECUREBOOT_KEYS` argument to `true` when you built the installation ISO, key enrollment
   will begin automatically once the device restarts. You can skip the following steps in proceed to
   [Install Palette Edge with Trusted Boot](#install-palette-edge-with-trusted-boot).

5. If you did not set `AUTO_ENROLL_SECUREBOOT_KEYS` to `true` when you built the ISO, you will need to select the
   **Enroll Secure Boot keys: Auto** option in the boot menu when the Edge device restarts. This will start the key
   enrollment process.

### Install Palette Edge with Trusted Boot

6. When the keys are finished enrolling, the installation will start automatically. Installation typically takes about 5
   minutes, but can vary depending on your hardware.

7. When installation finishes, you will see the text "Installation has finished, rebooting in 5 seconds" on your screen.
   Remove the USB disk from your Edge device.

## Validate

1. After installation finishes, power up the device. Let your device automatically choose the boot volume. It should
   boot directly to registration.

2. Press **Alt + right arrow key**, or **Ctrl + Alt + F1**. Replace **Alt** with **Options** on a Mac keyboard. This
   will bring up a terminal and allow you to log in with the credentials you configured with the **user-data** file.

   Alternatively, you can establish an SSH connection to your Edge device if you have network access to it.

3. Issue the following command:

   ```shell
   ls -ltr / run/cos/
   ```

   You should receive an output that's similar to the following:

   ```
   total 12
   -rwxr-xr-x  1 root root 1 Apr 30 15:59 uki_boot_mode
   -rwxr-xr-x  1 root root  1 Apr 30 15:59 active_mode
   -rw-r--r--  1 root root 534 Apr 30 15:59 cos-layout.env
   ```

   This confirms that your Edge device was booted with a Unified Kernel Image, a specific file format tailored to
   achieve a tamper-proof system and encryption of persistent partitions.

4. Issue the following command:

   ```shell
   lsblk
   ```

   You should see output similar to the following and verify that the **/oem** portion and various directories
   containing sensitive user data are encrypted.

   ```
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
