---
sidebar_label: "Tailscale"
title: "Tailscale"
description: Tailscale for Palette Edge."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge", "integrations", "tailscale"]
---

Tailscale provides point-to-point, full mesh VPN networking with high levels of performance and security. It is a great solution for [remote access](https://tailscale.com/use-cases/remote-access/) to your infrastructure. You can use Tailscale on your Palette Edge hosts to ensure remote access to these hosts, even when there is a problem with Kubernetes on those devices.

Tailscale provides a [free tier](https://tailscale.com/pricing/) that can be used up to 100 devices, for a maximum of 3 unique user accounts. While their public pricing only shows per-user based subscription options, you can also get per-device based subscription options if you contact their Sales.

The free tier option can be used for smaller Palette Edge installations in production, or to just get started with the software and try it out first. If you expand beyond the free tier limits, a free subscription can be converted to a paid subscription without requiring device reconfiguration.

Integrating Tailscale with Palette Edge is done in 4 steps:

1. Add the Tailscale package to the EdgeForge Dockerfile

2. Add commands to activate Tailscale to the EdgeForge user data

3. Generate a new set of Edge artifacts

4. Flash your Edge device(s) with the newly generated ISO


## Add the Tailscale package to the EdgeForge Dockerfile


Follow the [Edge artifacts creation instructions](https://docs.spectrocloud.com/clusters/edge/edgeforge-workflow/palette-canvos#instructions) to set up the CanvOS git repository on your build system. On Step 5 of those instructions ("Review the files relevant for this guide"), open the `Dockerfile` in the root of the repo to adjust its contents.

Add the following content to the end of the `Dockerfile`:

```
RUN curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/kinetic.noarmor.gpg | sudo tee /usr/share/keyrings/tailscale-archive-keyring.gpg >/dev/null && \
    curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/kinetic.tailscale-keyring.list | sudo tee /etc/apt/sources.list.d/tailscale.list && \
    apt update -y && \
    apt install -y tailscale && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
```

If you already have commands in your `Dockerfile` that install packages, you can either merge these together with the above content, or keep them as seperate RUN statements. Note that every RUN statement creates its own image layer and fewer layers are generally better.


:::info

This example is for Ubuntu. If you use a different OS, adjust the commands in accordance with the Tailscale [documentation](https://tailscale.com/kb/1031/install-linux/).

:::


## Add commands to activate Tailscale to the EdgeForge user data


After Step 9 of the [Edge artifacts creation instructions](https://docs.spectrocloud.com/clusters/edge/edgeforge-workflow/palette-canvos#instructions), edit the `user-data` file to add the following content to the file:

First, add an additional bind mount to the `install:` block so that we can persist the state for Tailscale:

```
install:
  bind_mounts:
  - /var/lib/tailscale
```


Next, add a `stages:` block to automate the registration and enabling of Tailscale:

```
stages:
  network.after:
    - name: "Register device with Tailscale"
      if: '[ ! -f "/run/cos/recovery_mode" ] && ! grep _current-profile /var/lib/tailscale/tailscaled.state'
      commands:
        - |
          ID=$(cat /sys/class/dmi/id/product_uuid)
          if [ -f /oem/tailscale/tailscaled.state ]; then
            systemctl stop tailscaled
            cp /oem/tailscale/tailscaled.state /var/lib/tailscale/tailscaled.state
            systemctl start tailscaled
            tailscale up --ssh --hostname="edge-${ID}"
          else
            tailscale up --authkey=tskey-auth-............................................. --ssh --hostname=$ID
            mkdir /oem/tailscale
            cp /var/lib/tailscale/tailscaled.state /oem/tailscale/tailscaled.state
          fi
    - name: "Enable Tailscale"
      if: '[ ! -f "/run/cos/recovery_mode" ] && grep _current-profile /var/lib/tailscale/tailscaled.state'
      commands:
        - |
          ID=$(cat /sys/class/dmi/id/product_uuid)
          tailscale up --ssh --hostname="edge-${ID}"
```

Make sure to adjust the `tailscale up --authkey=` line with the Tailscale authorization key you want to use to register the devices. You can generate this key in the Settings section of the Tailscale web console. The recommended approach is a reusable, non-ephemeral key that automatically tags the devices with one or more tags.

If you already have a `stages:` section in your user-data file, you must merge the existing section together with the above content.


:::info

Due to how the immutable OS in Palette Edge works, we must specify the `--hostname` parameter for Tailscale to prevent devices registering with `localhost` as their device names. In the above example, we emulate the default device naming behavior of Palette Edge by reading the motherboard's product UUID from `/sys/class/dmi/id/product_uuid` and prefixing this value with `edge-` to form the final hostname.

If you use the `deviceUIDPaths` parameter in the user-data to [adjust the automatic naming](https://docs.spectrocloud.com/clusters/edge/edge-configuration/installer-reference#device-id-uid-parameters) of your Edge devices, you can adjust the above content to generate the same hostname that matches your custom configuration.

Matching the hostnames in Tailscale with the Edge host names in Palette is not a hard requirement though.

:::


## Generate a new set of Edge artifacts

Follow the remaining steps of the [Edge artifacts creation instructions](https://docs.spectrocloud.com/clusters/edge/edgeforge-workflow/palette-canvos#instructions) to generate the device installation ISO and the provider images.


## Flash your Edge device(s) with the newly generated ISO

Boot your Edge device with the generated ISO to prepare your Edge host. When the procedure completes, let your Edge device boot to the Registration mode at least once. This will start up Tailscale and register the device. The device should now show up in your Tailscale Machines list.