---
sidebar_label: "Connect Edge Host to Wifi"
title: "Connect Edge Host to Wifi"
description: "Learn how to connect an Edge host to Wi-Fi using wpa_supplicant."
hide_table_of_contents: false
sidebar_position: 80
tags: ["edge"]
---

This how-to walks you through how to connect an Edge host to a Wi-Fi network with
[wpa_supplicant](https://linux.die.net/man/8/wpa_supplicant), using an Intel mini-PC as an example. You can apply the
steps in this how-to with other hardware, but steps for configuring the network interface might be different.

To connect an Edge host to Wi-Fi using `wpa_supplicant`, you need to build `wpa_supplicant` into the Operating System
(OS) image used for the Edge host and provide the Wi-Fi credentials to the Edge host. Depending on how Edge devices are
managed at an organization, these two steps are often done by different teams. If they are being done by the same team
or person, you can merge the user-data in the step [Supply Site-Specific User Data](#supply-site-specific-user-data)
with the original user data you use to build Edge artifacts and skip that step.

## Build OS Image with wpa_supplicant Included

### Prerequisites

- A physical or virtual Linux machine with AMD64 (also known as x86_64) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```shell
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:
  - 4 CPU
  - 8 GB memory
  - 50 GB storage
- A bootable device such as a USB drive, or a Preboot Execution Environment (PXE) server.
- A [Spectro Cloud](https://console.spectrocloud.com/) account. If you have not signed up, you can sign up for a
  [free trial](https://www.spectrocloud.com/free-tier/).
- Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to
  generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](../site-deployment/site-installation/create-registration-token.md) guide.

### Procedure

1. Clone the CanvOS repository.

   ```shell
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Edit the file **Dockerfile** in the root directory of the repository. At the bottom of the file, add the following
   lines.

   ```
   RUN apt-get update && apt-get install wpasupplicant && \
       mkdir /var/lib/wpa
   ```

   :::tip

   Consider including some other lightweight network utilities in the OS image as well that can help you troubleshoot or
   set up network configurations alternatively if needed. For example, if you are using Ubuntu, consider replacing the
   RUN statement with the following to also include network manager and ping.

   ```
   RUN apt-get update && apt-get install wpasupplicant -y && \
    apt-get update && apt-get install network-manager -y && \
    apt-get install iputils-ping -y && \
    mkdir /var/lib/wpa
   ```

   :::

3. Follow the rest of the steps in the guide [Build Edge Artifact](../edgeforge-workflow/palette-canvos.md). When
   finished, identify the **palette-edge-installer.iso** file in the **build** folder.
4. Plug in your bootable device and flash it with the ISO image.
5. Plug the bootable device into the Edge host and power on the Edge host. When the Edge host powers on, open the boot
   menu by pressing F10, and select the bootable device as your boot volume.
6. Wait for installation to finish. The Edge host will reboot by default upon completion unless you specify a different
   option in the Edge Installer configuration user data.

### Validate

You can validate that the Edge host is ready for the site installation by powering on the Edge host and simulating a
site deployment. The simulation process will require you to complete the installation process and reset the device after
the validation.

## Supply Site-Specific User Data

It's likely that your Wi-Fi network name and passwords are site-specific, which means you won't be able to include the
network credentials in the installer. You can use site-specific user data to provide this information to you Edge hosts
instead.

### Prerequisites

- A bootable device such as a USB drive, or a Preboot Execution Environment (PXE) server.
- `mkisofs`, or `genisoimage`, or similar ISO management software.
  - `cdrtools` or `wodim` for Windows.
- An Edge host that has already been prepared for installation.

### Procedure

1. Create a file named `user-data`, and include the following content. Replace `network-name` and `network-password`
   with the name and password of your Wifi network.

   ```yaml
    #cloud-config
    install:
        bind_mounts:
            - /var/lib/wpa

    stages:
        network.before:
        - name: "Connect to Wi-Fi"
        commands:
            - |
            # Find the first wireless network interface
            wireless_interface=""
            for interface in $(ip link | grep -oP '^\d+: \K[^:]+(?=:)')
            do
                if [ -d "/sys/class/net/$interface/wireless" ]; then
                    wireless_interface=$interface
                    break
                fi
            done

            # Check if a wireless interface was found and connect it to WiFi
            if [ -n "$wireless_interface" ]; then
                wpa_passphrase network-name network-password | tee /var/lib/wpa/wpa_supplicant.conf
                wpa_supplicant -B -c /var/lib/wpa/wpa_supplicant.conf -i $wireless_interface
                dhclient $wireless_interface
            else
                echo "No wireless network interface found."
            fi
   ```

2. Follow the rest of the steps in [Apply Site User Data](../site-deployment/site-installation/site-user-data.md).

### Validate

1. Power up the Edge host and wait for it to boot to the registration screen. Do not connect the Edge host with a wired
   connection.
2. In the **Default Address** field, confirm that the Edge host has an IP address. This means the Edge host is connected
   to a network. Since you did not connect the Edge host with a wired connection, this means that the Edge host has
   successfully connected to your wireless network and received an IP address.
