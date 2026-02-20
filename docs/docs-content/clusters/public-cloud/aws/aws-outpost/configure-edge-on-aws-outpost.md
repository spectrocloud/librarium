---
sidebar_label: "Configure Edge on AWS Outpost"
title: "Configure Edge on AWS Outpost"
description: "Learn how to configure AWS Outpost and install edge hosts to them."
hide_table_of_contents: false
tags: ["public cloud", "aws", "aws outpost"]
sidebar_position: 30
---



## Prerequisites

You must order and [install an AWS Outpost server](https://docs.aws.amazon.com/outposts/latest/install-server/install-server.html) at your site before you can install Edge. 

## Configure your AWS Outpost for Edge

To create the Edge server on your Outpost server, enter the following into the user data section. 


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
          edgeHostToken: abc123def456ghi789jkl012mno345pqr678stu901vw ## Replace this with your Edge Host Token.
          paletteEndpoint: api.spectrocloud.com
          projectName: OutpostName ## Replace this with your outpost's name.
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