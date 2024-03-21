---
sidebar_label: "Cloud Init Stages"
title: "Cloud Init Stages"
description: "Learn how to use cloud-init stages when installing an Edge device with Palette."
hide_table_of_contents: false
sidebar_position: 0
tags: ["edge"]
---

The installation process supports all the cloud-init stages exposed by
[Kairos](https://kairos.io/docs/architecture/cloud-init/). Kairos is an open-source project that is used to create
immutable images, Kairos is a container layer that enables you to specify dependencies and create resources before
locking down the image.

The following diagram displays the available cloud-init stages you can use to customize the device installation.

![A diagram that displays all the cloud-init stages supported. The stages are listed in the markdown table below.](/clusters_edge_cloud-init_cloud-init-stages-supported.png)

You can read more about Kairos and cloud-init by reviewing the
[Kairo's cloud-init](https://kairos.io/docs/architecture/cloud-init/) resource. For your convenience, all the supported
cloud-init stages are listed below.

| Stage                  | Description                                                                                                                                                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rootfs`               | This is the earliest stage, running before switching to root. It happens right after the root is mounted in /sysroot and before applying the immutable rootfs configuration. This stage is executed over initrd root, no chroot is applied.                                     |
| `initramfs`            | This is still an early stage, running before switching to root. Here you can apply changes to the booting setup of Elemental. Despite executing this before switching to root, this invocation is chrooted into the target root after the immutable rootfs is set up and ready. |
| `boot`                 | This stage executes after initramfs has switched to root and during the systemd boot-up process.                                                                                                                                                                                |
| `fs`                   | This stage is executed when fs is mounted and is guaranteed to have access to the state and persistent partitions ( COS_STATE and COS_PERSISTENT respectively).                                                                                                                 |
| `network`              | This stage executes when the network is available.                                                                                                                                                                                                                              |
| `reconcile`            | This stage executes 5m after boot up and every 60m.                                                                                                                                                                                                                             |
| `after-install`        | This stage executes after the installation of the OS.                                                                                                                                                                                                                           |
| `after-install-chroot` | This stage executes after the installation of the OS ends.                                                                                                                                                                                                                      |
| `after-upgrade`        | This stage executes after the OS upgrade ends.                                                                                                                                                                                                                                  |
| `after-upgrade-chroot` | This stage executes after the OS upgrade ends (chroot call).                                                                                                                                                                                                                    |
| `after-reset`          | This stage executes after the OS resets.                                                                                                                                                                                                                                        |
| `after-reset-chroot`   | This stage executes after the OS resets (chroot call).                                                                                                                                                                                                                          |
| `before-install`       | This stage executes before installation.                                                                                                                                                                                                                                        |
| `before-upgrade`       | This stage executes before the upgrade.                                                                                                                                                                                                                                         |
| `before-reset`         | This stage executes before reset.                                                                                                                                                                                                                                               |

:::info

Each stage has a before and after hook you can use to achieve more granular customization. For example, you can use
`network.after` to verify network connectivity.

:::

## Where to Apply Cloud-Init Stages?

You may ask yourself where to use cloud-init stages, as both the Edge Installer and the OS pack support the usage of
cloud-init stages. Use the following statements to help you decide.

<br />

- If you need to apply a set of configurations to a specific site, then use the Edge Installer user data configuration
  file and its cloud-init stages to provide site settings to that specific site.

- If you have common configurations across a fleet of Edge host devices, customize the OS pack and use the cloud-init
  stages to apply those configurations.

## Example Use Cases

To help you become familiar with the cloud-init stages and better understand how to use them to achieve your goals,
check out the following use cases.

<br />

:::warning

Remember that the following code snippets are only intended to help you understand how cloud-init can be used to
customize the edge host. You can use countless combinations of the Edge Installer and OS cloud-init stages to achieve
the desired customization. Check out the Kairos [stages](https://kairos.io/docs/reference/configuration/#stages)
resource to learn more about other key terms, options, and advanced examples.

:::

Use the Edge Installer user data to apply specific site configurations to the edge host.

#### Set the User Password

The `initramfs` stage is used to set the password for the user, `kairos`.

```yaml
stages:
  initramfs:
    - users:
        kairos:
          passwd: kairos
```

#### Assign a User to a Group

Another example of the `initramfs`, but this time the user is assigned to the `sudo` group.

```yaml
stages:
  initramfs:
    - users:
        kairos:
          groups:
            - sudo
```

#### Assign an SSH Key

An example configuration of assigning an SSH key to a user.

```yaml
stages:
  initramfs:
    - users:
        kairos:
          ssh_authorized_keys:
            - ssh-rsa AAAAB3N…
```

#### Configure a Registry Mirror

For situations where you need to configure a registry mirror, you can use the following example that uses the
`initramfs` stage.

```yaml
stages:
  initramfs:
    files:
      - path: "/etc/rancher/k3s/registries.yaml"
        permissions: 0644
        owner: 0
        group: 0
        content: |
          mirrors:
            "gcr.io":
              endpoint:
                - "https://my-mirror.example.com"
              rewrite:
                "(^.*)": "test/$1"
          configs:
            "my-mirror.example.com":
              auth:
                username: "user1"
                password: "mysupermagicalpassword"
              tls:
                insecure_skip_verify: true
```

#### Configure Network With Netplan

You can use the `initramfs` stage and [Netplan](https://netplan.io) to configure network settings before the network
initialization. Netplan is a tool that enables you to specify network configurations on Linux systems. Note that this
approach is available for Linux systems with Netplan installed. Refer to the
[Netplan Documentation](https://netplan.readthedocs.io/en/stable/) for installation guidance and the
[Netplan How-to Guides](https://netplan.readthedocs.io/en/stable/examples/) for more information.

```yaml
stages:
  initramfs:
    - users:
        kairos:
          groups:
            - sudo
          passwd: kairos
    - commands:
        - netplan apply
      files:
        - content: |
            network:
              version: 2
              renderer: networkd
              ethernets:
                ens160:
                  dhcp4: false
                  addresses:
                    - 10.10.190.11/18
                  gateway4: 10.10.128.1
                  nameservers:
                    addresses:
                      - 8.8.8.8
                      - 1.1.1.1
          encoding: ""
          group: 0
          owner: 0
          ownerstring: ""
          path: /etc/netplan/99_config.yaml
          permissions: 420
      name: Config network with Netplan
```

:::tip

When using the EdgeForge workflow with CanvOS, ensure you add Netplan to the Dockerfile. In the example below, Netplan
is installed in an Ubuntu image.

```shell
apt-get update && apt-get install netplan.io -y
```

:::

#### Erase Partitions

You can use the `before-install` stage to remove partitions if needed.

<br />

```yaml
tages:
  before-install:
    - name: "Erase Old Partitions on Boot Disk"
      commands:
        - wipefs -a /dev/nvme0n1
```

#### Install Tooling

This is an example of installing third-party software or tooling.

<br />

```yaml
stages:
  after-install-chroot:
    - name: "Install SSM"
      commands:
        - snap install amazon-ssm-agent --classic
```

#### Complete Example

This is an Edge Installer user data configuration that configures the user `kairos` and prepares the edge host by
providing network settings and adding SSL certificates.

<br />

```yaml
stages:
  boot:
    - users:
        kairos:
          groups:
            - sudo
          passwd: kairos
stylus:
  site:
    paletteEndpoint: api.spectrocloud.com
    name: edge-randomid
    registrationURL: https://edge-registration-app.vercel.app/
    network:
      httpProxy: http://proxy.example.com
      httpsProxy: https://proxy.example.com
      noProxy: 10.10.128.10,10.0.0.0/8
      nameserver: 1.1.1.1
      interfaces:
        enp0s3:
          type: static
          ipAddress: 10.0.10.25/24
          gateway: 10.0.10.1
          nameserver: 10.10.128.8
        enp0s4:
          type: dhcp
    caCerts:
      - |
        ------BEGIN CERTIFICATE------
        *****************************
        *****************************
        ------END CERTIFICATE------
      - |
        ------BEGIN CERTIFICATE------
        *****************************
        *****************************
        ------END CERTIFICATE------
```

## OS User Data Stages

You can also customize the device by using the OS cloud-init stages. As mentioned previously, use OS cloud-init stages
to apply common configurations to many edge hosts.

<br />

#### Assign User to Group

In this example snippet, the OS pack is using the cloud-init stage `initramfs` to assign a default password to the user
`kairos` and add the user to the `sudo` group.

<br />

```yaml
stages:
  initramfs:
    - users:
        kairos:
          groups:
            - sudo
          passwd: kairos
```

#### Custom Commands

This is an example of moving files to a different location prior to another stage or boot-up process that requires the
file.

<br />

```yaml
stages:
  initramfs:
    - name: "Move Files"
      commands:
        - |
          mv  /myCLI/customCLI /usr/local/bin/
          rm -R /myCLI
```

#### Update Network Settings

The network settings will get updated when the `network` stage takes effect.

<br />

```yaml
stages:
  network:
    - name: "Configure DNS host"
      commands:
        - echo "10.100.45.98 example.local" >> /etc/hosts
```

#### Invoke Custom Script

An example of applying logic after the device has booted by using the `boot.after` stage.

```yaml
boot.after:
  - |
    sftp  -i /credentials/ssh/id_rsa.pub@cv543.example.internal.abc:/inventory/2023/site-inventory.json
    mv site-inventory.json /location/inventory/
```
