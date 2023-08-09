---
title: "Cloud Init Stages"
metaTitle: "Edge Install Cloud Init Stages"
metaDescription: "Learn how to use cloud-init stages when installing an Edge device with Palette."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Cloud-Init Stages

The installation process supports all the cloud-init stages exposed by [Kairos](https://kairos.io/docs/architecture/cloud-init/). Kairos is an open-source project that is used to create immutable images, Kairos is a container layer that enables you to specify dependencies and create resources before locking down the image. 

The following diagram displays the available cloud-init stages you can use to customize the device installation.

![A diagram that displays all the cloud-init stages supported. The stages are listed in the markdown table below.](/clusters_edge_cloud-init_cloud-init-stages-supported.png)

You can read more about Kairos and cloud-init by reviewing [Kairo's cloud-init](https://kairos.io/docs/architecture/cloud-init/) resource. For your convenience, all the supported cloud-init stages are listed below.


| Stage             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------|
| `rootfs`            | This is the earliest stage, running before switching to root. It happens right after the root is mounted in /sysroot and before applying the immutable rootfs configuration. This stage is executed over initrd root, no chroot is applied.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |      |
| `initramfs`         | This is still an early stage, running before switching to root. Here you can apply changes to the booting setup of Elemental. Despite executing this before switching to root, this invocation is chrooted into the target root after the immutable rootfs is set up and ready.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |      |
| `boot`              | This stage executes after initramfs has switched to root and during the systemd boot-up process.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |      |
| `fs`                | This stage is executed when fs is mounted and is guaranteed to have access to the state and persistent partitions ( COS_STATE and COS_PERSISTENT respectively).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |      |
| `network`           | This stage executes when the network is available                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |      |
| `reconcile`         | This stage executes 5m after boot up and every 60m.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |      |
| `after-install`     | This stage executes after the installation of the OS ends.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |      |
| `after-install-chroot` | This stage executes after the installation of the OS ends.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |      |
| `after-upgrade`     | This stage executes after the OS upgrade ends.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |      |
| `after-upgrade-chroot` | This stage executes after the OS upgrade ends (chroot call).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |      |
| `after-reset`       | This stage executes after the OS resets.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |      |
| `after-reset-chroot` | This stage executes after the OS resets (chroot call).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |      |
| `before-install`    | This stage executes before installation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |      |
| `before-upgrade`    | This stage executes before the upgrade.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |      |
| `before-reset`      | This stage executes before reset.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |      |


<InfoBox>

 Each stage has a before and after hook you can use to achieve more granular customization. For example, you can use `network.after` to verify network connectivity.

 </InfoBox>


# Where to Apply Cloud-Init Stages

You may ask yourself where to use cloud-init stages, as both the Edge Installer and the OS pack support the usage of cloud-init stages. Use the following statements to help you decide. 
<br />


* If you need to apply a set of configurations to a specific site, then use the Edge Installer user data configuration file and its cloud-init stages to provide site settings to that specific site. 


* If you have common configurations across a fleet of Edge host devices, customize the OS pack and use the cloud-init stages to apply those configurations. 

# Example Use Cases


To help you become familiar with the cloud-init stages and better understand how to use them to achieve your goals, check out the following use cases. 

<br />

<WarningBox>

Remember that the following code snippets are only intended to help you understand how cloud-init can be used to customize the edge host. 
You can use countless combinations of the Edge Installer and OS cloud-init stages to achieve the desired customization. Check out the Kairos [stages](https://kairos.io/docs/reference/configuration/#stages) resource to learn more about other key terms, options, and advanced examples.

</WarningBox>

<br />

## Edge Configuration Stages

Use the Edge Installer user data to apply specific site configurations to the edge host. 


<br />

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

For situations where you need to configure a registry mirror, you can use the following example that uses the `initramfs` stage.

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

####  Erase Partitions

You can use the `before-install` stage to remove partitions if needed.

<br />

```yaml
stages:
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

This is an Edge Installer user data configuration that configures the user `kairos` and prepares the edge host by providing network settings and adding SSL certificates.

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

You can also customize the device by using the OS cloud-init stages. As mentioned previously, use OS cloud-init stages to apply common configurations to many edge hosts.

<br />

####  Assign User to Group

In this example snippet, the OS pack is using the cloud-init stage `initramfs` to assign a default password to the user `kairos` and add the user to the `sudo` group.
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

This is an example of moving files to a different location prior to another stage or boot-up process that requires the file.
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
<br />

```yaml
boot.after:
  - |
    sftp  -i /credentials/ssh/id_rsa.pub@cv543.example.internal.abc:/inventory/2023/site-inventory.json
    mv site-inventory.json /location/inventory/
```

# How to Use Sensitive Information in the User Data?

You get two opportunities to apply user data to edge hosts in the edge deployment lifecycle. The steps below describe the events when you can apply user data. 
<br />

- **Installer Handoff Step** - When you prepare your edge hosts for the initial installation, you use a USB stick to boot the edge hosts. The USB stick contains an ISO that includes the Edge Installer, the user data, and, optionally, a content bundle. In this step, the edge host boots from the USB stick, and the entire USB stick data is copied to the edge host. The edge host will reboot by default upon the installation completion unless you specify `powerOff: true` in the install section of the user data. Once the edge host is prepared with the initial installation, you remove the USB stick, and ship your devices to the site for installation. This step is also called the *installer handoff* step. You can refer to the [Prepare Edge Host
](/clusters/edge/site-deployment/stage#prepareedgehost) guide to learn more about driving the installer handoff step. 


- **Site Installation Step** - When your devices arrive at the site, you perform the site installation if you need to apply any unique configurations to a set of devices. In this step, you create another USB using an ISO that contains your additional user data. You plug the USB into the device. Then, you power on the device to allow the Edge Installer to complete the site installation process and apply the additional user data. The [Multiple User Data Use Case](/clusters/edge/edgeforge-workflow/prepare-user-data#multipleuserdatausecase) guide describes the use cases when you should utilize the additional user data, and the [Perform Site Install](/clusters/edge/site-deployment/site-installation) guide describes the site installation process in detail. 


In either of the steps mentioned above, the installer handoff step or the site installation step, the user data from the USB stick is copied to the **/run/stylus/userdata** file or the **/oem/userdata** file on the edge hosts. 

Suppose you plan to use sensitive information in any of your user data stages. In that case, you may not want to expose the sensitive information to edge hosts. The points below will help you decide how to use sensitive information before the installer handoff step and during the site installation step. 
<br />

- **Use Sensitive Information Before the Installer Handoff Step** - If you want to pass some sensitive information in the user data before the installer handoff step. In that case, you must specify `powerOff: true` in the install section of user data. You can name your stages per your choice. After preparing the user data, you build the Edge Installer ISO. When the edge host boots from the Edge Installer ISO, all your user data stages will be persisted into configuration files on the edge host.


- **Use Sensitive Information During the Site Installation Step** - If you want to use sensitive information, such as credentials for patching the OS on your edge hosts, in any user data stage during the site installation step. In such scenarios, you must use the `skip-copy-[string]` naming convention for your user data stages. Replace the `[string]` placeholder with any meaningful string per your requirements. The Edge Installer will skip copying the stages whose name matches the regular expression `skip-copy-*` to the edge hosts. The stages will execute as long as the USB drive is mounted to the edge hosts.  

  For example, assume you have prepared a USB stick containing your user data and plugged it into an edge device to perform the site installation. The example stage below presents one of the stages of your user data. In the example below, the `skip-copy-subscribe` stage follows the `skip-copy-[string]` naming convention. Therefore, the Edge Installer will skip copying the stage to the edge device. However, the stage will execute as long as you have plugged in the USB stick. You must unmount the USB stick from the edge device after the device registers with Palette and before you deploy a Kubernetes cluster on the device.  
  <br />

  ```yaml
  stages:
    network.after:
      - name: skip-copy-subscribe
        if: [ -f "/usr/sbin/subscription-manager" ]
        commands:
          - subscription-manager register --username "name" --password 'password' 
  ```