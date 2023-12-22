---
sidebar_label: "Use Tailscale to Ensure Remote Host Access"
title: "Use Tailscale to Ensure Remote Host Access"
description: Tailscale for Palette Edge."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge", "integrations", "tailscale"]
---

You can use Tailscale on your Palette Edge hosts to ensure remote access to your Edge hosts that are connected to the internet. Tailscale provides point-to-point, full-mesh VPN networking with high levels of performance and security. With Tailscale installed, you can use always SSH to access your Edge hosts that have internet access, even if your Edge hosts experience problems with Kubernetes. 

## Prerequisites

- A Tailscale account. Visit [Tailscale official website](https://login.tailscale.com/start) to register a Tailscale account. 

- A Tailscale authorization key. We recommend you use a reusable, non-ephemeral key that automatically tags the devices with one or more tags. For more information about auth keys, refer to [Tailscale documentation](https://tailscale.com/kb/1085/auth-keys). 

- A host machine with an AMD64 processor architecture. You will use this host machine to build Edge artifacts using CanvOS. 

- At least one Edge device with an AMD64 processor architecture registered with your Palette account.

- Your Edge devices must be able to connect to Tailscale. This usually means the edge device must have an Internet connection. 

- An external volume that can be flashed with the Edge installer ISO. For example, a USB drive. 

- This how-to uses the EdgeForge workflow to build artifacts used to provision Edge hosts. Review [EdgeForge Workflow](https://docs.spectrocloud.com/clusters/edge/edgeforge-workflow/) to become familiar with how to build EdgeForge artifacts. 

### Use Tailscale to Remotely Connect to Your Edge Cluster

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code. 

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


4. Check out the newest available tag. This guide uses the tag **v4.0.6** as an example. 

  ```shell
  git checkout v4.0.6
  ```

5. Add the following content to the end of the file `Dockerfile`:

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

  <TabItem value="debian" label="Debian">

  ```
  RUN curl -fsSL https://pkgs.tailscale.com/stable/debian/bookworm.noarmor.gpg | sudo tee /usr/share/keyrings/tailscale-archive-keyring.gpg >/dev/null && \
      curl -fsSL https://pkgs.tailscale.com/stable/debian/bookworm.tailscale-keyring.list | sudo tee /etc/apt/sources.list.d/tailscale.list && \
      sudo apt-get update
      sudo apt-get install tailscale
      sudo tailscale up
      tailscale ip -4
  ```

  </TabItem>

  <TabItem value="other" label="Other">
  
  If you use a different OS, adjust the commands in accordance with the Tailscale [documentation](https://tailscale.com/kb/1031/install-linux/).

  </TabItem>
  </Tabs>

  If you already have commands in your `Dockerfile` that install packages, you can either merge these together with the above content, or keep them as separate RUN statements. Note that every RUN statement creates its own image layer and fewer layers are generally better.

6. Issue the command below to assign an image tag value that will be used when creating the provider images. This guide uses the value `tailscale` as an example. However, you can assign any lowercase and alphanumeric string to the `CUSTOM_TAG` argument. 

  ```bash
  export CUSTOM_TAG=tailscale
  ```

7. Issue the command below to create the **.arg** file containing the custom tag. The remaining arguments in the **.arg** file will use the default values. For example, `ubuntu` is the default operating system, `demo` is the default tag, and [ttl.sh](https://ttl.sh/) is the default image registry. Refer to the existing **.arg.template** file in the current directory or the [README](https://github.com/spectrocloud/CanvOS#readme) to learn more about the available customizable arguments.

  Using the arguments defined in the **.arg** file, the final provider images you generate will have the following naming convention, `[IMAGE_REGISTRY]/[IMAGE_REPO]:[CUSTOM_TAG]`. For example, one of the provider images will be `ttl.sh/ubuntu:k3s-1.27.2-v4.0.6-palette-learn`.   

  ```bash
  cat << EOF > .arg
  CUSTOM_TAG=$CUSTOM_TAG
  IMAGE_REGISTRY=ttl.sh
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
  
  View the newly created file to ensure the customized arguments are set correctly.
 
  ```bash
  cat .arg
  ```

8. Issue the command below to save your tenant registration token to an environment variable. Replace `[your_token_here]` with your actual registration token. 

  ```bash
  export token=[your_token_here]
  ```


9. Issue the following command to create the **user-data** file. 

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

10. Next, add a `stages` block to the **user-data** file to automatically enable Tailscale and register the Edge device. Replace `AUTH-KEY` with your authorization key from Tailscale:

  ```yaml {14}
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
              tailscale up --authkey=AUTH-KEY --ssh --hostname=$ID
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

  If you already have a `stages` block in your user-data file, you must merge the existing block together with the above content. The `stages` block is based on Kairos cloud-init stages. For more information on cloud init stages, refer to [Cloud Init Stages](../edge-configuration/cloud-init.md).


  :::info

  In the above `stages` block, you are using the device ID of your Edge device as the hostname with which to register your device with Tailscale. For more information about how this ID is generated, refer to [Install Configurations](../edge-configuration/installer-reference.md#device-id-uid-parameters).

  If you want to use a different hostname, you can change the parameter to the hostname you'd like to use. However, you cannot use `localhost` as the hostname. 

  :::

11. Build the Edge device installation ISO and providers images. Afterward, push the provider images to an image registry. For more information, refer to [Build Edge Artifacts](../edgeforge-workflow/palette-canvos.md).

12. Flash your external volume with the Edge installer ISO image. We recommend using [balena etcher](https://etcher.balena.io/) to flash your volume. 

13. Plug the external volume into your Edge device and boot up the device using the volume to prepare your Edge device for installation. For more information, refer to [Prepare Edge Host for Installation](../site-deployment/stage.md). 

14. Remove the volume and boot up your device again to register your Edge host. If the Edge host has internet access, it will start up Tailscale and register your device with Tailscale. 


## Validate

1. Log in to [Tailscale console](https://login.tailscale.com/admin/machines). 

2. In the **Machines** tab, your Edge device is displayed in the Machines list. You can SSH to your 
