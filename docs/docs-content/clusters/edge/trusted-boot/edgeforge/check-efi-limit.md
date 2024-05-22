---
sidebar_label: "Check EFI Size and Edge Host Boot Limit"
title: "Check EFI Size and Device Limit with Trusted Boot"
description:
  "Learn about how to check the EFI size limit of your Edge host and avoid creating an EFI that is too large to boot."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

When you use Trusted Boot, your OS becomes part of the Extensible Firmware Interface (EFI) file that gets loaded by the
firmware of the Edge host and booted directly. This means that the EFI file will grow quite large due to the size of the
OS, and you must ensure that your Edge host has the capacity to boot the large EFI file.

This page guides you through how to estimate the bootable EFI limit of your Edge host as well as the EFI size of your
installer ISO. You need to ensure that the bootable EFI size limit is greater than the size of the EFI partition in your
ISO file.

## Prerequisites

- The host machine (not the Edge host) used to build the software that will verify the EFI boot limit meets the
  following hardware requirements:

  - Processor architecture: X86_64
  - Minimum CPU: 4
  - Minimum RAM: 8
  - Minimum Storage: 150 GB

- Your Edge host supports Unified Extensible Firmware Interface (UEFI) boot options.

- You have already built the installer ISO file that you will use to install Palette on your Edge host. For more
  information, refer to [Build Installer ISO with Trusted Boot](./build-trusted-iso.md).

- You can only perform the action in this guide **prior to** enrolling keys in your Edge host. The ISO that is used to
  check the EFI boot limit will not have your keys on it. If your device has already enrolled your custom keys and have
  secure boot enabled, the Edge host will not be able to boot from the unsigned volume.

## Check Bootable EFI Size Limit for Hardware

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

5. Issue the following command to build the ISO image that is used to check your hardware EFI boot limit.

   ```
   ./earthly +iso-efi-size-check
   ```

   This will generate an ISO image located at **./build/efi-size-check.iso**.

6. Flash the ISO onto a USB drive. You can use [balena Etcher](https://etcher.balena.io/) or any other similar tool to
   flash volumes.

7. Plug the USB drive into your Edge host. Have a keyboard ready and connected to the Edge host before you boot it up.

8. Boot up the Edge host. Use the keyboard to enter the boot menu. Usually you can press the F10 key to enter the boot
   menu, but the exact key varies by hardware.

9. Select the USB as the boot volume.

10. As the Edge host boots up, the console will produce output similar to the following on the screen.

    ```shell
    BdsDxe: loading Boot0001 "UEFI QEMU DVD-ROM QM00003 " from PciRoot(0x0)/Pci(0x1,0x1)/Ata(Secondary,Master,0x0)
    BdsDxe: starting Boot0001 "UEFI QEMU DVD-ROM QM00003 " from PciRoot(0x0)/Pci(0x1,0x1)/Ata(Secondary,Master,0x0)
    [ INFO]:  src/main.rs@032: Starting EFI size checker...
    [ INFO]:  src/main.rs@042: start to do file read check...
    [ INFO]:  src/main.rs@056: Reading 100.00 MB bytes into buffer
    [ INFO]:  src/main.rs@065: Successfully read 100.00 MB into buffer
    [ INFO]:  src/main.rs@056: Reading 200.00 MB bytes into buffer
    [ INFO]:  src/main.rs@065: Successfully read 200.00 MB into buffer
    [ INFO]:  src/main.rs@056: Reading 300.00 MB bytes into buffer
    [ INFO]:  src/main.rs@065: Successfully read 300.00 MB into buffer
    [ INFO]:  src/main.rs@056: Reading 400.00 MB bytes into buffer
    [ INFO]:  src/main.rs@065: Successfully read 400.00 MB into buffer
    [ INFO]:  src/main.rs@056: Reading 500.00 MB bytes into buffer
    [ INFO]:  src/main.rs@065: Successfully read 500.00 MB into buffer
    [ INFO]:  src/main.rs@056: Reading 600.00 MB bytes into buffer
    [ INFO]:  src/main.rs@065: Successfully read 600.00 MB into buffer
    [ INFO]:  src/main.rs@056: Reading 700.00 MB bytes into buffer
    ```

11. Pay attention to the output on the screen. At a certain point, the output will break and produce a large number of
    new lines before producing the same output as the beginning again.

    The last line before the white space indicates the upper bound of your EFI boot limit. For example, in the following
    output, the EFI boot limit of your Edge host is between 600 and 700 MB.

    ```shell
    [ INFO]:  src/main.rs@056: Reading 600.00 MB bytes into buffer
    [ INFO]:  src/main.rs@065: Successfully read 600.00 MB into buffer
    [ INFO]:  src/main.rs@056: Reading 700.00 MB bytes into buffer









    BdsDxe: loading Boot0001 "UEFI QEMU DVD-ROM QM00003 " from PciRoot(0x0)/Pci(0x1,0x1)/Ata(Secondary,Master,0x0) BdsDxe:
    starting Boot0001 "UEFI QEMU DVD-ROM QM00003 " from PciRoot(0x0)/Pci(0x1,0x1)/Ata(Secondary,Master,0x0) [ INFO]:
    src/main.rs@032: Starting EFI size checker... [ INFO]: src/main.rs@042: start to do file read check... [ INFO]:
    src/main.rs@056: Reading 100.00 MB bytes into buffer [ INFO]: src/main.rs@065: Successfully read 100.00 MB into buffer
    ```

## Check EFI Size of Installer ISO

12. From the **CanvOS** directory, issue the following commands to make two directories.

    ```shell
    mkdir -p image
    mkdir -p image-efi
    ```

13. Issue the following command to mount the installer ISO to the directories you created in the previous step.

    ```shell
    sudo mount --options loop build/palette-edge-installer.iso image/
    sudo mount --options loop image/efiboot.img image-efi
    ```

14. Issue the following command to find out the size of the EFI file.

    ```shell
    ls -ltrh image-efi/EFI/kairos/*.efi
    ```

    In the following example, the size of the EFI file in the ISO image is 722 MB.

    ```
    -rwxr-xr-x 1 root root 722M May 14 18:52 image-efi/EFI/kairos/norole_install-mode_stylus.registration.efi
    ```

## Check EFI Size of Provider Images

15. Issue the following command to find the size of your provider image. Replace `image-tag` with the tag of your
    provider image.

    ```shell
    docker run --interactive --tty image-tag ls -ltrh /trusted-boot/EFI/kairos
    ```

    In the following example, the size of the EFI file in the provider image is 767 MB.

    ```
    total 767M
    -rw-r--r-- 1 root root 767M Apr 16  2020 norole.efi
    ```

## Compare Hardware Boot Limit with EFI Size

16. To ensure that the Edge host is able to boot, the hardware limit must be greater than the EFI size of both the ISO
    and the provider image.

    In the examples used through out this guide, the hardware limit is between 600 - 700 MB. The EFI of the ISO is 722
    MB, and the EFI of the provider image is 767 MB. The hardware limit is smaller than the EFI of both the ISO and the
    provider image. Therefore, the Edge host will not be able to boot and an Edge host with a higher EFI boot limit is
    needed.

## Validate

If the hardware EFI boot limit is greater than the EFI size of both the ISO and the provider image. Proceed to install
Palette on the Edge host and provision a cluster. For more information, refer to
[Installation with Trusted Boot](../deployment-day2/install.md) and
[Cluster Creation](../../site-deployment/site-installation/cluster-deployment.md) for more information.
