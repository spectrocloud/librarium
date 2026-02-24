---
sidebar_label: "Configure Edge on AWS Outpost"
title: "Configure Edge on AWS Outpost"
description: "Learn how to configure AWS Outpost and install edge hosts to them."
hide_table_of_contents: false
tags: ["public cloud", "aws", "aws outpost"]
sidebar_position: 30
---

Palette supports creating and managing Kubernetes clusters deployed to an
[AWS Outpost](https://docs.aws.amazon.com/outposts/latest/server-userguide/what-is-outposts.html) server. This document
guides you on how to configure a Kubernetes cluster on AWS Outpost that is managed by Palette Edge.

## Prerequisites

You must order and
[install an AWS Outpost server](https://docs.aws.amazon.com/outposts/latest/install-server/install-server.html) at your
site before you can configure your Edge server.

## Configure your AWS Outpost for Edge

Use the following steps to convert your AWS Outpost server to an Edge instance.

1. Select your Outpost server and create a capacity task and remove any existing configured instances. Set the
   **Instance size** to `c61d.metal` and the **Instance quantity** to 1.

   Refer to
   [Modify AWS Outposts instance capacity ](https://docs.aws.amazon.com/outposts/latest/userguide/modify-instance-capacity.html)
   for more information about adjusting your Outpost's capacity.

2. [Create a subnet](https://docs.aws.amazon.com/outposts/latest/server-userguide/launch-instance.html#create-subnet)
   for your Outpost.

3. Enable the subnet for your local network. You must set the secondary instance to a value of 1.

   ```bash

   aws ec2 modify-subnet-attribute
   --subnet-id subnet-xxxxxxxxxxxxxxxxx
   --enable-lni-at-device-index 1

   ```

## Create the Edge Host

To configure the Edge server on your Outpost server, perform the following steps.

1.  Select your AWS Outpost server and click
    [**Launch instance**](https://docs.aws.amazon.com/outposts/latest/server-userguide/launch-instance.html#launch-instances).
2.  In the **Application and OS Images (Amazon Machine Image)** section, select Ubuntu.
3.  Verify that the Instance type is `c6id.metal`.
4.  Enter your security key pair.
5.  In the **Network settings** section, click **Edit** then select the Outpost and Subnet that you created previously.
6.  Expand the **Advanced network configuration** section and click **Add network interface**.
7.  Ensure that the **Device index** is set to `1` and enter a name in the **Description** field.
8.  Expand the **Advanced details** section.
9.  Enter the following in the **User data - optional** section.

        You must update the `write_files.content.network` section with your server's routes, the `write_files.content.stylus.site` section with your Palette Edge information, and the `write_files.content.stylus.stages` section with your login information.

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
                  - to: 172.25.1.0/24
                    via: 172.25.220.1
                  - to: 172.25.2.0/24
                    via: 172.25.220.1
                  - to: 172.25.3.0/24
                    via: 172.25.220.1
              ens2:
                dhcp4: false
                dhcp6: false
                addresses:
                  - 10.11.0.6/24
                routes:
                  - to: 0.0.0.0/0
                    via: 10.11.0.1
                    metric: 50

       - path: /opt/palette/user-data
         owner: root:root
         permissions: "0644"
         content: |
           #cloud-config
           stylus:
             site:
               edgeHostToken: abc123def456ghi789jkl012mno345pqr678stu901vw
               paletteEndpoint: api.spectrocloud.com
               projectName: Outpost
             install:
               reboot: true
             stages:
               initramfs:
                 - users:
                     kairos:
                       groups:
                         - sudo
                       passwd: kairos

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
      - apt-get install -y bash jq zstd rsync systemd-timesyncd iptables rsyslog conntrack --no-install-recommends >> /var/log/cloud-init-userdata.log 2>&1

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

10. Verify that your new Edge host is visible in Palette.
