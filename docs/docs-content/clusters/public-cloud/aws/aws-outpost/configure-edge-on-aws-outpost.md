---
sidebar_label: "Configure Edge on AWS Outposts"
title: "Configure Edge on AWS Outposts"
description: "Learn how to configure AWS Outposts and install edge hosts to them."
hide_table_of_contents: false
tags: ["public cloud", "aws", "aws outposts"]
sidebar_position: 30
---

Palette supports creating and managing Kubernetes clusters deployed on an
[AWS Outposts](https://docs.aws.amazon.com/outposts/latest/server-userguide/what-is-outposts.html) server. This document
guides you through configuring a Kubernetes cluster on an AWS Outposts server that is managed by Palette Edge.

## Prerequisites

- An active Palette account.
- An installed [AWS Outposts server](https://docs.aws.amazon.com/outposts/latest/install-server/install-server.html).
- Access to the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).
- An AWS[ EC2 key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html).

## Configure AWS Outposts for Edge

Your AWS Outposts server requires you to configure your capacity and a subnet before you can convert it to an Edge
instance.

### Configure the Outpost's capacity

Perform the following steps to set your AWS outposts server capacity. It may take several hours for your server to
configure your chosen capacity.

1. Log in to the [AWS Outposts console](https://console.aws.amazon.com/outposts).
2. Select your Outposts server.
3. [Create a capacity task](https://docs.aws.amazon.com/outposts/latest/userguide/modify-instance-capacity.html). Set
   the **Instance size** to **c6id.metal** and the **Instance quantity** to **1**.

   :::info

   Palette only supports AWS Outposts servers with one instance.

   :::

4. **Remove** any previously created instances.

   ![AWS Outposts Capacity configuration](/aws_outposts-capacity-config.webp "Capacity configuration example")

### Create a subnet

1. Log in to the [AWS Outposts console](https://console.aws.amazon.com/outposts).
2. Select your AWS Outposts server.
3. [Create a subnet](https://docs.aws.amazon.com/outposts/latest/server-userguide/launch-instance.html#create-subnet)
   for your Outpost.

4. In the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html), enable the new
   subnet for your local network. You must set the secondary instance to a value of **1**. This ensures that Palette
   Edge can communicate properly with your server.

   ```bash

   aws ec2 modify-subnet-attribute
   --subnet-id <subnet-id>
   --enable-lni-at-device-index 1

   ```

:::info

Make a note of your new subnet name. It is required to create your Edge host.

:::

## Create the Edge Host

To configure the Edge server on your Outpost server, perform the following steps.

1.  From the [AWS Outposts console](https://console.aws.amazon.com/outposts), select your AWS Outpost server and click
    [**Launch instance**](https://docs.aws.amazon.com/outposts/latest/server-userguide/launch-instance.html#launch-instances).
2.  In the **Application and OS Images (Amazon Machine Image)** section, select **Ubuntu**.
3.  Verify that the **Instance type** is **c6id.metal**.
4.  Enter your security key pair.
5.  In the **Network settings** section, click **Edit** then select the Outpost **VPC** and **Subnet** that you created
    previously. ![AWS Outposts Network settings](/aws_outposts-network-settings.webp "AWS Outposts Network settings")
6.  Expand the **Advanced network configuration** section and click **Add network interface**.
7.  Ensure that the **Device index** is set to `1` and enter a name in the **Description** field.
8.  Expand the **Advanced details** section.
9.  Enter the following information in the **User data - optional** section. Replace the following placeholders in the
    YAML file:

    - `<remote-network-cidr>` - The remote network's CIDR block.
    - `<upstream-gateway-ip>` - The remote network's gateway IP address.
    - `<interface-ip-cidr>` - The interface's static IP address.
    - `<default-gateway-ip>` - The default gateway IP address.
    - `<edge-token>` - The Palette Edge registration token.
    - `<project-name>` - The AWS Outpost project name.
    - `<username>` - The local username for the instance.
    - `<password>` - The username's password.

    ```yaml

    #cloud-config

    write_files:
      - path: /etc/netplan/99-custom-network.yaml
        permissions: "0600"
        content: |
          network:
            version: 2
            renderer: networkd
            ethernets:
              ens1:
                dhcp4: true
                dhcp4-overrides:
                  use-routes: false
                routes:
                  - to: <remote-network-cidr>
                    via: <upstream-gateway-ip>
                  - to: <remote-network-cidr>
                    via: <upstream-gateway-ip>
                  - to: <remote-network-cidr>
                    via: <upstream-gateway-ip>
              ens2:
                dhcp4: false
                dhcp6: false
                addresses:
                  - <interface-ip-cidr>
                routes:
                  - to: 0.0.0.0/0
                    via: <default-gateway-ip>
                    metric: 50

       - path: /opt/palette/user-data
         owner: root:root
         permissions: "0644"
         content: |
           #cloud-config
           stylus:
             site:
               edgeHostToken: <edge-token>
               paletteEndpoint: api.spectrocloud.com
               projectName: <project-name>
             install:
               reboot: true
             stages:
               initramfs:
                 - users:
                     <username>:
                       groups:
                         - sudo
                       passwd: <password>

    runcmd:
      - touch /var/log/cloud-init-userdata.log

      # Remove all default netplan configs that might enable DHCP
      - rm -f /etc/netplan/50-cloud-init.yaml >> /var/log/cloud-init-userdata.log 2>&1
      - rm -f /etc/netplan/01-network-manager-all.yaml >> /var/log/cloud-init-userdata.log 2>&1
      - rm -f /etc/netplan/00-installer-config.yaml >> /var/log/cloud-init-userdata.log 2>&1

      # Ensure your config has priority
      - chmod 600 /etc/netplan/99-custom-network.yaml >> /var/log/cloud-init-userdata.log 2>&1
      - netplan apply >> /var/log/cloud-init-userdata.log 2>&1
      - sleep 10 >> /var/log/cloud-init-userdata.log 2>&1

      # Install Palette Agent Pre-requisites
      - apt-get update >> /var/log/cloud-init-userdata.log 2>&1
      - apt-get install -yes bash jq zstd rsync systemd-timesyncd iptables rsyslog conntrack --no-install-recommends >> /var/log/cloud-init-userdata.log 2>&1

      # Install SSM
      - snap install amazon-ssm-agent --classic >> /var/log/cloud-init-userdata.log 2>&1
      - systemctl enable snap.amazon-ssm-agent.amazon-ssm-agent.service >> /var/log/cloud-init-userdata.log 2>&1
      - systemctl start snap.amazon-ssm-agent.amazon-ssm-agent.service >> /var/log/cloud-init-userdata.log 2>&1

      # Set user-data file for Palette Agent download and install
      - echo "USERDATA=/opt/palette/user-data" >> /etc/environment
      - mkdir -p /opt/palette >> /var/log/cloud-init-userdata.log 2>&1
      - curl --location --output /opt/palette/palette-agent-install.sh https://github.com/spectrocloud/agent-mode/releases/latest/download/palette-agent-install.sh >> /var/log/cloud-init-userdata.log 2>&1
      - chmod +x /opt/palette/palette-agent-install.sh >> /var/log/cloud-init-userdata.log 2>&1
      - echo 'USERDATA=/opt/palette/user-data' >> /etc/environment >> /var/log/cloud-init-userdata.log 2>&1
      - cd /opt/palette && export USERDATA=./user-data && sudo --preserve-env ./palette-agent-install.sh >> /var/log/cloud-init-userdata.log 2>&1

      - sleep 30
      - reboot

    ```

## Verify your instance appears in Palette

1. Log in to [Palette](https://console.spectrocloud.com/).
2. Navigate to your Project.
3. In the left main menu, select **Clusters**.
4. Click the **Edge Hosts** tab to view the registered hosts.
5. Verify that your Edge host appears with a **Healthy** and **Ready** status.
