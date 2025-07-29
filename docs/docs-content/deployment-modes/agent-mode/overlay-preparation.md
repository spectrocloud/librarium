---
sidebar_label: "Configure networkd to Prepare Host for Overlay Network"
title: "Configure networkd to Prepare Host for Overlay Network"
description: "Learn how to configure your host to prepare it for enabling overlay network during cluster creation."
hide_table_of_contents: false
toc_max_heading_level: 2
sidebar_position: 10
tags: ["edge", "agent mode"]
---

Kubernetes clusters expect stable IP addresses that are not always possible in Edge network environments.
Palette Edge allows you to enable an overlay network to ensure the cluster has stable IP addresses even if the
underlying physical IPs change.

However, overlay networks on Palette clusters rely on `systemd-networkd` and `systemd-resolved` to function. Since
clusters deployed in agent mode have independent Operating System (OS) configurations that are not managed by the
Palette agent, you must configure your host OS properly to meet the prerequisites before creating your cluster.

This guide walks you through configuring your host to use `systemd-networkd` for interface management and
`systemd-resolved` for DNS resolution. If your host already uses these services, you can skip this guide entirely. You
can use the [Validate](#validate) steps to verify if your host already uses `systemd-networkd` and `systemd-resolved`.

## Prerequisites

- This guide assumes your host uses Ubuntu as its OS. If you use a different OS distribution, you may need to find the
  equivalent commands that can accomplish the same goals in your OS.

- A Linux host that meets
  [the minimum requirements for agent mode deployments](architecture.md#minimum-device-requirements).

## Configure networkd

You can configure your host to make it overlay-ready either by issuing commands in the terminal to install the
prerequisite packages and configuring them, or by using a declarative block in the installer configuration user data to
run those commands automatically during agent installation.

<Tabs groupId="method">

<TabItem value="Manual Configuration in Command-line">

1. Issue the following commands to enable and restart `systemd-resolved`, and create a symlink between
   `/run/systemd/resolve/resolv.conf` and `/etc/resolv.conf`. This ensures that `systemd-resolved` starts managing DNS
   resolution for your host immediately.

   ```bash
   sudo systemctl enable systemd-resolved
   sudo systemctl restart systemd-resolved
   sudo ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
   ```

2. Create a backup of your current DNS configurations and remove them. The following commands are an example of how to
   create a backup if you are using `netplan`.

   ```bash
   sudo mkdir -p /etc/netplan/backup
   sudo mv /etc/netplan/*.yaml /etc/netplan/backup/
   ```

3. Issue the following command to mask the service `systemd-networkd-wait-online.service`. This prevents the system from
   waiting for the network to come online at boot.

   ```bash
   sudo systemctl mask systemd-networkd-wait-online.service
   ```

4. Issue the following commands to create a configuration file for `systemd-networkd`. This configuration tells
   `systemd-networkd` to manage all interfaces with names starting with `en`. If your network interfaces have different
   naming schemes, change this pattern so that the configuration matches.

   ```bash {3}
   cat > /etc/systemd/network/20-dhcp.network << EOF
   [Match]
   Name=en*
   [Network]
   DHCP=yes
   [DHCP]
   ClientIdentifier=mac
   EOF
   ```

5. Issue the following commands to enable and restart `systemd-networkd`. If you are connected to your host with an SSH
   connection, this will terminate the session because your host IP will change.

   ```bash
   sudo systemctl enable systemd-networkd
   sudo systemctl restart systemd-networkd
   ```

6. You have now configured your host to use `systemd-networkd` for DNS resolution, and your cluster with this host will
   now support overlay network.

</TabItem>

<TabItem value="User Data Block During Agent Installation">

The installer configuration user data can declaratively configure your host to perform specified actions during
`cloud-init` stages. You can use one user data block to configure the same DNS settings across different hosts. We break
down the configuration step by step to explain each block. However, if you would like to copy the entire configuration,
expand the following details block.

<details>

<summary>Full User Data YAML</summary>

```yaml
#cloud-config
stages:
  initramfs:
    - name: "Backup and disable Netplan"
      if: "[ -d /etc/netplan ] && ls /etc/netplan/*.yaml >/dev/null 2>&1"
      commands:
        - mkdir -p /etc/netplan/backup
        - mv /etc/netplan/*.yaml /etc/netplan/backup/

    - name: "Mask systemd-networkd-wait-online"
      commands:
        - systemctl mask systemd-networkd-wait-online.service

    - name: "Create systemd-networkd config for en* interfaces"
      if: "[ ! -f /etc/systemd/network/20-dhcp.network ]"
      files:
        - path: /etc/systemd/network/20-dhcp.network
          permissions: 0644
          owner: 0
          group: 0
          # Change the match pattern to match your interface names
          content: |
            [Match]
            Name=en*

            [Network]
            DHCP=yes

            [DHCP]
            ClientIdentifier=mac

    - name: "Create systemd-networkd config for eth* interfaces"
      if: "[ ! -f /etc/systemd/network/20-dhcp-legacy.network ]"
      files:
        - path: /etc/systemd/network/20-dhcp-legacy.network
          permissions: 0644
          owner: 0
          group: 0
          content: |
            [Match]
            Name=eth*

            [Network]
            DHCP=yes

            [DHCP]
            ClientIdentifier=mac

    - name: "Enable and restart systemd-networkd"
      commands:
        - systemctl enable systemd-networkd.service
        - systemctl restart systemd-networkd.service

    - name: "Enable and restart systemd-resolved"
      commands:
        - systemctl enable systemd-resolved.service
        - systemctl restart systemd-resolved.service

    - name: "Link systemd-resolved DNS to /etc/resolv.conf"
      if: '[ ! -L /etc/resolv.conf ] || [ "$(readlink -f /etc/resolv.conf)" != "/run/systemd/resolve/resolv.conf" ]'
      commands:
        - ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
```

</details>

1. Add the following block to your `user-data` file. This block disables `netplan` and backs up its configurations.

   ```yaml
   #cloud-config
   stages:
     initramfs:
       - name: "Backup and disable Netplan"
         if: "[ -d /etc/netplan ] && ls /etc/netplan/*.yaml >/dev/null 2>&1"
         commands:
           - mkdir -p /etc/netplan/backup
           - mv /etc/netplan/*.yaml /etc/netplan/backup/
   ```

2. Mask the `systemd-networkd-wait-online` service to prevent the system from hanging during boot if interfaces are not
   immediately available.

   ```yaml
   #cloud-config
   stages:
     initramfs:
       - name: "Mask systemd-networkd-wait-online"
         commands:
           - systemctl mask systemd-networkd-wait-online.service
   ```

3. Add a `systemd-networkd` configuration for interfaces with names starting with `en*` to enable DHCP.

   ```yaml {13}
   #cloud-config
   stages:
     initramfs:
       - name: "Create systemd-networkd config for en* interfaces"
         if: "[ ! -f /etc/systemd/network/20-dhcp.network ]"
         files:
           - path: /etc/systemd/network/20-dhcp.network
             permissions: 0644
             owner: 0
             group: 0
             content: |
               [Match]
               Name=en*

               [Network]
               DHCP=yes

               [DHCP]
               ClientIdentifier=mac
   ```

4. Add a fallback configuration for interfaces with names starting with `eth*`, to support legacy systems or naming
   schemes.

   ```yaml
   #cloud-config
   stages:
     initramfs:
       - name: "Create systemd-networkd config for eth* interfaces"
         if: "[ ! -f /etc/systemd/network/20-dhcp-legacy.network ]"
         files:
           - path: /etc/systemd/network/20-dhcp-legacy.network
             permissions: 0644
             owner: 0
             group: 0
             content: |
               [Match]
               Name=eth*

               [Network]
               DHCP=yes

               [DHCP]
               ClientIdentifier=mac
   ```

5. Enable and restart the `systemd-networkd` service so it takes over interface management.

   ```yaml
   #cloud-config
   stages:
     initramfs:
       - name: "Enable and restart systemd-networkd"
         commands:
           - systemctl enable systemd-networkd.service
           - systemctl restart systemd-networkd.service
   ```

6. Enable and restart `systemd-resolved` to handle DNS resolution consistently with `systemd`.

   ```yaml
   #cloud-config
   stages:
     initramfs:
       - name: "Enable and restart systemd-resolved"
         commands:
           - systemctl enable systemd-resolved.service
           - systemctl restart systemd-resolved.service
   ```

7. Ensure `/etc/resolv.conf` points to the DNS configuration managed by `systemd-resolved`.

   ```yaml
   #cloud-config
   stages:
     initramfs:
       - name: "Link systemd-resolved DNS to /etc/resolv.conf"
         if: '[ ! -L /etc/resolv.conf ] || [ "$(readlink -f /etc/resolv.conf)" != "/run/systemd/resolve/resolv.conf" ]'
         commands:
           - ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
   ```

</TabItem>

</Tabs>

## Validate

Use the following steps to ensure that your DNS is now managed by `systemd-networkd`.

1. Issue the following command to retrieve the list of your network interfaces.

   ```bash
   networkctl
   ```

   `networkctl` is installed as part of the `systemd` package. If `networkctl` is not installed, then it is unlikely
   that your network is being managed by `systemd-networkd`.

   Look for entries similar to the following.

   ```bash
   IDX LINK  TYPE     OPERATIONAL SETUP
   1 lo    loopback carrier     unmanaged
   2 enp0s3 ether    routable    configured
   ```

2. Issue the following command for interfaces whose `TYPE` is not `loopback`.

   ```bash
   networkctl status enp0s3
   ```

   Look for the following to confirm that your expected interfaces are managed by `systemd-networkd`.

   ```bash
   Managed by: systemd-networkd
   ```

   This confirms that your host is using `systemd-networkd` for interface management.

3. Issue the following command to confirm the `systemd-resolved` service is active.

   ```bash
   systemctl is-active systemd-resolved
   ```

4. Issue the following command to check if `/etc/resolv.conf` is symlinked to `resolved`.

   ```bash
   readlink -f /etc/resolv.conf
   ```

   The expected output should be the following. This output, together with the service itself being active, confirms
   that your host uses `systemd-resolved` for DNS management.

   ```text
   /run/systemd/resolve/resolv.conf
   ```

## Next Steps

The overlay network can only be enabled during cluster creation. Once a cluster is already created, you cannot enable
the overlay network without first tearing down the cluster. Refer to
[Enable Overlay Network - Centrally Managed Cluster](../../clusters/edge/networking/vxlan-overlay.md) to learn more
about whether or not you should enable network overlay.

Refer to [Create Local Cluster](../../clusters/edge/local-ui/cluster-management/create-cluster.md) to learn how to create a local cluster and choose whether to enable the overlay network.
