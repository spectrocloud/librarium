---
sidebar_label: "Provision an Edge Host VM Using iPXE Netboot"
title: "Provision an Edge Host VM Using iPXE Netboot"
description: "Learn how to provision a VM as a Palette Edge host using iPXE netboot and HTTP boot artifacts."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge", "tutorial"]
---

Palette Edge supports deployment through iPXE netboot. This method is helpful when you want to automate provisioning,
use external configuration, or avoid embedding `user-data` configuration into each ISO. It’s especially useful when
deploying many VMs or Edge hosts dynamically. This guide teaches you how to provision Edge hosts in VMware using iPXE.
To use iPXE provisioning, you must use an HTTP/HTTPS server to serve the necessary boot artifacts and the iPXE
configuration files, and configure the VMs to boot from a iPXE ISO file, which then chains a script that downloads the
boot artifacts and boot using those artifacts.

You do not need to customize the Palette Edge Installer ISO. It is only used to extract the generic kernel, `initrd`,
and root filesystem. Configuration is handled externally via a `config.yaml` file served over HTTP. This lets you reuse
the same boot artifacts across any number of nodes.

## Prerequisites

- A Palette Installer ISO built using CanvOS tag version 4.6.21 or later. You do not need to customize this installer
  using `user-data`, because you only need to extract a few boot artifacts from this ISO and it does not preserve
  customizations. For more information, refer to
  [Build Installer ISO](../../edgeforge-workflow/palette-canvos/build-installer-iso.md).

- A Linux host machine that is capable of serving files over an HTTP/HTTPS server. This guide uses Python 3 and the
  `http-server` module to serve the artifacts, but you can use any other tool to start your server.

- `govc` is installed on your Linux VM and available.

- Access to a VMware vCenter environment where you can provision new VMs and upload files to datastores. Your VMs in
  vCenter must be able to access the HTTP/HTTPS server you provision.

## Procedure

1. Mount your Palette Edge installer ISO onto your Linux host. Replace `/path/to/palette-edge-installer-<version>.iso`
   with the path to your Palette Edge installer ISO file. Create a folder to hold netboot files.

   ```bash
   sudo mount /path/to/palette-edge-installer-<version>.iso /mnt
   mkdir -p ~/ipxe/netboot
   ```

2. Copy the necessary boot artifacts into the netboot directory.

   ```bash
   cp /mnt/boot/kernel ~/ipxe/netboot/palette-kernel
   cp /mnt/boot/initrd ~/ipxe/netboot/palette-initrd
   cp /mnt/rootfs.squashfs ~/ipxe/netboot/palette.squashfs
   ```

   The files are the `initrd`, `kernel` and `squashfs`.

3. Unmount the ISO after you finish copying the files.

   ```bash
   sudo umount /mnt
   ```

4. Create a configuration file for the installer to use. This is equivalent to your `user-data` file you use to
   configure the Edge installer ISO. Refer to
   [Prepare User Data and Argument Files](../../edgeforge-workflow/prepare-user-data.md) for more information.

   ```bash
   cat > ~/ipxe/netboot/config.yaml <<'EOF'
   #cloud-config
   # ... your settings here ...
   EOF
   ```

5. Change into the `netboot` directory and start an HTTP server.

   ```bsh
   cd ~/ipxe/netboot
   python3 -m http.server 8080 &
   ```

   Leave this server running and perform the subsequent steps in a different terminal tab.

6. In a different terminal tab, but still on your Linux host, create an iPXE script that tells your VMs booted from the
   iPXE ISO to download the boot artifacts and boot using those artifacts. Replace `<YOUR_SERVER_IP>` with the IP
   address of your HTTP server. Often, this is the IP address of your Linux host unless you specify otherwise. You can
   use `ip addr show` to obtain your IP address if your do not know it.

   ```bash
   cat > ~/ipxe/netboot/palette.ipxe <<'EOF'
   #!ipxe
   kernel http://<YOUR_SERVER_IP>:8080/palette-kernel initrd=palette-initrd rd.neednet=1 ip=dhcp rd.cos.disable root=live:http://<YOUR_SERVER_IP>:8080/palette.squashfs netboot install-mode config_url=http://<YOUR_SERVER_IP>:8080/config.yaml console=tty1
   initrd http://<YOUR_SERVER_IP>:8080/palette-initrd
   boot
   EOF
   ```

7. Download the generic iPXE ISO and upload it to your vCenter datastore. Replace `path/to/datastore/iso` with the
   vCenter datastore path where you want to upload the ISO. You may need to configure the correct environment variables
   with credentials to your vCenter environment to use the `govc` command.

   ```bash
   wget https://boot.ipxe.org/ipxe.iso -O ~/ipxe/ipxe.iso
   govc datastore.upload ~/ipxe/ipxe.iso path/to/datastore/iso
   ```

   You are now done with all the steps you need to perform from your Linux host. Your `~/ipxe/netboot` folder should
   contain the following files.

   ```
   ~/ipxe/netboot/
    ├── palette-kernel
    ├── palette-initrd
    ├── palette.squashfs
    ├── config.yaml
    └── palette.ipxe
   ```

   Leave your HTTP server running and open your browser to your vCenter environment.

8. In your vCenter, create a new VM with the following hardware configurations.

   - 8 vCPUs
   - 32 GB RAM
   - 300 GB disk

9. Add a CD/DVD device to your VM. Choose the iPXE ISO you previously uploaded to your vCenter datastore. Make sure you
   check **Connect on Power On** option to ensure that the ISO is connected when your VM boots.

10. Finish configuring your VM and power it on.

11. Open the VM’s console via the vCenter web client to access your VM. As soon as the "iPXE boot image" screen shows,
    press **CTRL + B** to interrupt and enter the `iPXE>` prompt. The interval you have to press **CTRL + B** is very
    short. Therefore, make sure to launch the web console as soon as your VM boots and get ready to press the keys.

    :::tip

    If the VM does not register **CTRL + B**, try pressing **ESC + B** instead. Many BIOS-level environments and virtual
    terminals interpret **ESC + B** as a fallback for **CTRL + B**, especially when CTRL is not reliably passed through.

    :::

12. Issue the following commands in the `iPXE> prompt`.

    ```bash
    dhcp
    chain http://<YOUR_SERVER_IP>:8080/palette.ipxe
    ```

    This tells iPXE to download and execute the script you wrote, which kicks off the install using the boot artifacts
    and your config file. The VM then downloads `kernel`, `initrd`, and `rootfs` and begin the installation using your
    `config.yaml` (user-data).

## Validate

1. After installation is complete, power on your VM.

2. Ensure that the VM displays that the Edge host is ready to be added to a cluster in Palette or the address of Local
   UI, depending on how you configured the management mode for the Edge host.
