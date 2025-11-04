---
sidebar_label: "Use Tailscale to Ensure Remote Host Access"
title: "Use Tailscale to Ensure Remote Host Access"
description: Tailscale for Palette Edge."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge", "integrations", "tailscale"]
---

You can use Tailscale on your Palette Edge hosts to ensure remote access to your Edge hosts that are connected to the
internet. Tailscale provides point-to-point, full-mesh VPN networking with high levels of performance and security. With
Tailscale installed, you can use always SSH to access your Edge hosts that have internet access, even if your Edge hosts
experience problems with Kubernetes.

## Limitations

- Tailscale magicDNS is not compatible with network overlay in Edge clusters. If your Edge cluster has
  [network overlay](../networking/vxlan-overlay.md) enabled, you must disable MagicDNS in Tailscale or ensure you don't
  use the 100.100.100.100 DNS server that MagicDNS configures.

## Prerequisites

- A Tailscale account. Visit [Tailscale official website](https://login.tailscale.com/start) to register a Tailscale
  account.

- A Tailscale authorization key. We recommend you use a reusable, non-ephemeral key that automatically tags the devices
  with one or more tags. For more information about auth keys, refer to
  [Tailscale documentation](https://tailscale.com/kb/1085/auth-keys).

- A host machine with an AMD64 processor architecture. You will use this host machine to build Edge artifacts using
  CanvOS.

- At least one Edge device with an AMD64 processor architecture registered with your Palette account.

- Your Edge devices must be able to connect to Tailscale. This usually means the Edge device must have an internet
  connection.

- An external volume that can be flashed with the Edge installer ISO. For example, a USB drive.

- This how-to uses the EdgeForge workflow to build artifacts used to provision Edge hosts. Review
  [EdgeForge Workflow](../edgeforge-workflow/palette-canvos/palette-canvos.md) to become familiar with how to build
  EdgeForge artifacts.

## Use Tailscale to Remotely Connect to Your Edge Cluster

1.  Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository. Change to the **CanvOS** directory
    and choose a version tag.

2.  Add the following content to the end of the file `Dockerfile` to include the Tailscale package in the Edge OS build:

          <Tabs>

    <TabItem value="ubuntu" label="Ubuntu">

    ```dockerfile
    RUN curl -fsSL "https://pkgs.tailscale.com/stable/ubuntu/kinetic.noarmor.gpg" | sudo tee /usr/share/keyrings/tailscale-archive-keyring.gpg >/dev/null && \
        curl -fsSL "https://pkgs.tailscale.com/stable/ubuntu/kinetic.tailscale-keyring.list" | sudo tee /etc/apt/sources.list.d/tailscale.list && \
        apt update -y && \
        apt install -y tailscale && \
        apt-get clean && rm -rf /var/lib/apt/lists/*
    ```

          </TabItem>

          <TabItem value="redhat" label="RedHat">

    ```dockerfile
    RUN dnf config-manager --add-repo https://pkgs.tailscale.com/stable/rhel/9/tailscale.repo && \
        dnf install tailscale && \
        dnf clean all
    ```

          </TabItem>

          <TabItem value="other" label="Other">

    If you use a different OS, adjust the commands in accordance with the Tailscale
    [documentation](https://tailscale.com/kb/1031/install-linux/).

          </TabItem>

    </Tabs>

    If you already have commands in your `Dockerfile` that install packages, you can either merge these together with
    the above content, or keep them as separate RUN statements. Note that every RUN statement creates its own image
    layer and fewer layers are generally better.

3.  Review the **.arg.template** file containing the customizable arguments and create an **.arg** file. Below is a
    command you can use to create an example **.arg** file. For more information, refer to the
    [Build Edge Artifacts](../edgeforge-workflow/palette-canvos/palette-canvos.md) guide.

    ```bash
    cat << EOF > .arg
    CUSTOM_TAG=$CUSTOM_TAG
    IMAGE_REGISTRY=spectrocloud
    OS_DISTRIBUTION=ubuntu
    IMAGE_REPO=ubuntu
    OS_VERSION=22
    K8S_DISTRIBUTION=k3s
    ISO_NAME=palette-edge-installer
    ARCH=amd64
    HTTPS_PROXY=
    HTTP_PROXY=
    PROXY_CERT_PATH=
    UPDATE_KERNEL=false
    EOF
    ```

4.  Issue the command below to save your tenant registration token to an environment variable. Replace
    `[your_token_here]` with your actual registration token.

    ```bash
    export token=[your_token_here]
    ```

5.  Issue the following command to create the **user-data** file. Note that we're adding a bind mount for
    `/var/lib/tailscale` to ensure the state of Tailscale is persisted across node reboots.

    ```yaml
    cat << EOF > user-data
    stylus:
      site:
        paletteEndpoint: api.spectrocloud.com
        edgeHostToken: $token
        projectName: Default
        name: edge-randomid
    install:
      poweroff: true
      bind_mounts:
      - /var/lib/tailscale
    users:
      - name: kairos
        passwd: kairos
    EOF
    ```

6.  Next, add a `stages` block to the **user-data** file to automatically enable Tailscale and register the Edge device.
    Replace `$AUTH-KEY` with your authorization key from Tailscale:

    ```yaml {14}
    stages:
      boot.after:
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
                tailscale up --authkey=$AUTH-KEY --ssh --hostname="edge-${ID}"
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

    If you already have a `stages` block in your user-data file, you must merge the existing block together with the
    above content. The `stages` block is based on Kairos cloud-init stages. For more information on cloud init stages,
    refer to [Cloud Init Stages](../edge-configuration/cloud-init.md).

    :::info

    In the above `stages` block, you are using the device ID of your Edge device that is read from the file
    **/sys/class/dmi/id/product_uuid**, as the hostname with which to register your device with Tailscale. For more
    information about how this ID is generated, refer to
    [Install Configurations](../edge-configuration/installer-reference.md#device-id-uid-parameters).

    If you want to use a different hostname, especially when using the `deviceUIDPaths` parameter in the **user-data**,
    you can adjust the two `ID=$(cat /sys/class/dmi/id/product_uuid)` lines in the content above to match your custom
    device naming configuration.

    :::

7.  Build the Edge device installation ISO and providers images.

    ```shell
    sudo ./earthly.sh +build-all-images
    ```

    This command may take up to 15-20 minutes to finish depending on the resources of the host machine. Upon completion,
    the command will display the manifest that you must use in your cluster profile to deploy your cluster.

    ```shell
    ===================== Earthly Build SUCCESS =====================
    Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
    ```

8.  Afterward, push the provider images to an image registry. For more information, refer to
    [Build Edge Artifacts](../edgeforge-workflow/palette-canvos/palette-canvos.md).

9.  Flash your external volume with the Edge installer ISO image. You can use [balena etcher](https://etcher.balena.io/)
    or any other tool of your choice to flash your volume.

10. Plug the external volume into your Edge device and boot up the device using the volume to install Palette Edge on
    your Edge host. For more information, refer to [Installation](../site-deployment/stage.md).

11. Remove the volume and boot up your device again to register your Edge host. If the Edge host has internet access, it
    will start up Tailscale and register your device with Tailscale.

## Validate

1. Log in to [Tailscale console](https://login.tailscale.com/admin/machines).

2. In the **Machines** tab, your Edge device is displayed in the Machines list. You can SSH to your host from any device
   that is also connected to your Tailscale network. Check out the
   [Tailscale SSH](https://tailscale.com/kb/1193/tailscale-ssh) documentation page to learn more about SSH with
   Tailscale.

## Troubleshooting

### All Traffic Dropped for 100.64.0.0/10 CIDR Range

Tailscale uses the 100.64.0.0/10 range of IP addresses for your Tailnets. That means that by default, this address
range, or parts of it, cannot be used for any of the following:

- Kubernetes cluster pod CIDR
- Kubernetes cluster service CIDR
- Palette Edge Overlay network CIDR

#### Debug Steps

If you want to use parts of the 100.64.0.0/10 range for your Kubernetes clusters or your Palette Edge Overlay networks,
you must limit the IP address range that your Tailnet uses to a fraction of the 100.64.0.0/10 range. Use the following
steps to limit your Tailnet range:

1. First, configure an IP Pool in Tailscale. We have found the following configuration works well to assign addresses in
   the new range to all nodes:

   ```json
     "nodeAttrs": [
       {
         "target": ["*"],
         "ipPool": ["100.74.0.0/16"],
       },
     ],
   ```

2. Next, in the OS pack of your cluster profile, add the following:

   ```yaml
   stages:
     initramfs:
       - name: "Tailscale fix systemD unit service"
         files:
           - path: /etc/systemd/system/tailscale-iptables-fix.service
             permissions: 0644
             owner: 0
             group: 0
             content: |
               [Unit]
               Description=Tailscale iptables fix service
               [Service]
               ExecStart=/etc/palette/tailscale-iptables.sh
               [Install]
               WantedBy=multi-user.target
       - name: "Tailscale fix systemD unit timer"
         files:
           - path: /etc/systemd/system/tailscale-iptables-fix.timer
             permissions: 0644
             owner: 0
             group: 0
             content: |
               [Unit]
               Description=Tailscale iptables fix schedule
               [Timer]
               OnBootSec=15
               OnUnitActiveSec=15
               [Install]
               WantedBy=timers.target
       - name: "Tailscale adjustment script"
         files:
           - path: /etc/palette/tailscale-iptables.sh
             permissions: 0755
             owner: 0
             group: 0
             content: |
               #!/bin/sh
               if iptables -L ts-input | grep DROP | grep 100.64.0.0/10; then
                 RULEFWD=$(iptables -L ts-forward --line-numbers | grep DROP | grep 100.64.0.0/10 | awk '{print $1}')
                 RULEINP=$(iptables -L ts-input --line-numbers | grep DROP | grep 100.64.0.0/10 | awk '{print $1}')
                 iptables -R ts-forward $RULEFWD -s 100.74.0.0/16 -o tailscale0 -j DROP
                 iptables -R ts-input $RULEINP -s 100.74.0.0/16 -o tailscale0 -j DROP
               fi
     network:
       - name: "Reduce scope of traffic dropped by Tailscale to just the Tailscale ipPool"
         commands:
           - |
             systemctl enable tailscale-iptables-fix.service
             systemctl enable tailscale-iptables-fix.timer
             systemctl start tailscale-iptables-fix.timer
   ```

   This will ensure Tailscale does not drop traffic for IP ranges that it doesn't own. This is due to a known bug in
   Tailscale. Even though we restricted the IP Pool, Tailscale still puts in `iptables` rule on every node that drops
   unknown traffic from any address in the entire 100.64.0.0/10 range.
