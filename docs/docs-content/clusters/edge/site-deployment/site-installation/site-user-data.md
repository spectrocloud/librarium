---
sidebar_label: "Apply Site User Data"
title: "Apply Site User Data"
description: "Learn how to create a secondary Edge Installer configuration user data."
hide_table_of_contents: false
sidebar_position: 0
tags: ["edge"]
---

You can provide site-specific Edge Installer configuration user data if you need to apply new values or override default
values from the Edge Installer user data you created in [EdgeForge](../../edgeforge-workflow/prepare-user-data.md).

Use the following steps to create an ISO file containing the additional user data and load it to a bootable device, such
as a USB stick.

## Prerequisites

- A bootable device such as a USB drive, or a Preboot Execution Environment (PXE) server.

- An Edge host with Palette Edge installed. Refer to [Installation](../stage.md) for more information.

- `mkisofs`, or `genisoimage`, or similar ISO management software.

  - `cdrtools` or `wodim` for Windows.

## Create ISO

1.  Create a file called `user-data` that contains the additional configurations you want to override or inject. Ensure
    that the file starts with a line that only contains `#cloud-config`. Only include configurations you would like to
    add or override. There is no need to include user data that was already present when the ISO image was build in the
    [Build Edge Artifacts](../../edgeforge-workflow/palette-canvos/palette-canvos.md) step.

    ```shell
    touch user-data
    ```

    For example, you can include the following content in the `user-data` file to connect your Edge host to Wi-Fi.
    Replace `wifi-network-name` with the name of your Wi-Fi network and the `wifi-password` with the password of your
    network. This requires wpa_supplicant to be included in your base OS image. For more information, refer to
    [Connect Intel NUC Edge Host to Wifi](../../networking/connect-wifi.md).

    ```yaml
    #cloud-config
    install:
      bind_mounts:
         - /var/lib/wpa

    stages:
      network.before:
         - name: "Connect to wifi"
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
                  wpa_passphrase wifi-network-name wifi-password | tee /var/lib/wpa/wpa_supplicant.conf
                  wpa_supplicant -B -c /var/lib/wpa/wpa_supplicant.conf -i $wireless_interface
                  dhclient $wireless_interface
               else
                  echo "No wireless network interface found."
               fi
    ```

2.  Create an empty `meta-data` file.

    ```shell
    touch meta-data
    ```

3.  Create an ISO file using the following command.

      <Tabs>

      <TabItem label="macOS/Linux" value="mac-linux">

    ```shell
    mkisofs -output site-user-data.iso -volid cidata -joliet -rock user-data meta-data
    ```

      </TabItem>

      <TabItem label="Windows" value="windows">

    ```shell
    genisoimage -output site-user-data.iso -volid cidata -joliet -rock user-data meta-data
    ```

      </TabItem>

      </Tabs>

    This generates an ISO file called `site-user-data.iso` in the current directory.

4.  Flash your bootable device such as a USB drive with the ISO file you just created.

    You can use several software tools to create a bootable USB drive, such as
    [balenaEtcher](https://www.balena.io/etcher). For a PXE server, there are open source projects such as
    [Fog](https://fogproject.org/download.php) or
    [Windows Deployment Services](https://learn.microsoft.com/en-us/windows/deployment/wds-boot-support) for Windows.

    :::info

    The site user data ISO file is not bootable. It contains only configuration data, which the system reads after
    booting from the internal disk. If you use a tool like [balenaEtcher](https://etcher.balena.io/) to write the ISO
    file to a USB stick, it may display the corresponding warning. You can safely ignore it and continue writing the
    image to USB.

    :::

5.  Once the Edge host arrives at the physical site, load the USB drive to the Edge host before powering it on. The
    system boots from the internal disk, detects the USB drive, and automatically applies the additional user data
    configuration during this first site boot.

## Validate

You can validate that the ISO file is not corrupted by attempting to flash a bootable device. Most software that creates
a bootable device will validate the ISO file before the flash process.

If you have SSH access, you can also SSH into the Edge host and locate your `user-data` file in either `/oem` or
`/run/stylus`. The site-specific user data is named `user-data` while the original user data file is named something
similar to `90_custom.yaml`. If you can find the files on the Edge host, it means the user data has been applied
successfully.

## Next Steps

Before you register your Edge host with Palette you must have a tenant registration token. Review the
[Create Registration Token](create-registration-token.md) guide for steps on how to create a tenant registration token.
