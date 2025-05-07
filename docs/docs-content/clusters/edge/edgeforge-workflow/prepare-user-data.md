---
sidebar_label: "Prepare User Data and Argument Files"
title: "Prepare User Data and Argument Files"
description: "Learn about building your staging user data and .arg file"
hide_table_of_contents: false
sidebar_position: 0
tags: ["edge"]
---

The EdgeForge process requires two configuration files. the `.arg` file and the `user-data` file. Each is responsible
for a different aspect of the EdgeForge process. The `.arg` file configures the build process itself as well as its
output, while the `user-data` file configures the Edge installer ISO. The following table briefly summarizes the
differences between the two files.

| **Aspect**            | **`.arg` File**                                                                             | **`user-data` File**                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Purpose**           | Configures the build process of the Edge Installer ISO and provider images.                 | Configures the installation and the immediate post-installation environment of the Edge host.       |
| **When It's Applied** | During Edge artifact generation (before deployment).                                        | During actual Edge host installation (after ISO boot).                                              |
| **Format**            | Key-value pairs.                                                                            | YAML in [cloud-init](https://cloudinit.readthedocs.io/) format                                      |
| **Main Contents**     | Image architecture, OS/K8s versions, image registry information, secure boot settings, etc. | Site information, proxy settings, network interfaces, cloud-init stages, tags, registration tokens. |
| **Focus**             | Artifact generation and packaging.                                                          | System initialization and registration.                                                             |
| **Controls**          | What gets built and how. For example, FIPS, SELinux, installer ISO name.)                   | How the Edge host behaves post-install. For example, network config, certs, power off behavior.     |

Since the `.arg` file controls the build process, you must ensure you provide the correct settings during build. If you
provide the wrong arguments or miss any arguments, you will need to restart the build process to make changes. With
`user-data`, you have an additional opportunity to provide additional configuration during site deployment as
site-specific configuration. This can replace, supplement, or override your installer configuration you provide to the
installer ISO. For more information, refer to
[Apply Site User Data](../site-deployment/site-installation/site-user-data.md).

After installation, you can also use Local UI to make edits to the user data file before you create a cluster. Refer to
[Edit User Data](../local-ui/host-management/edit-user-data.md) for more information.

This article guides you through several important parameters in the `.arg` file and configuration blocks in the
`user-data` file. However, you can use many additional parameters to further customize your installation. Review the
[Edge Artifact Build Configurations](../edgeforge-workflow/palette-canvos/arg.md) and
[Installer Reference](../edge-configuration/installer-reference.md) resource to learn more about all the supported
configuration parameters you can use in the configuration user data.

The [Appliance Studio](./applicance-studio.md) is a lightweight Graphic User Interface (GUI) that allows you to design
both files with zero risk of syntax errors and is our recommended approach to creating both files. However, since both
`.arg` and `user-data` are plain text files, you can also manually create and edit these files once you are familiar
with the parameters.

<Tabs>

<TabItem value="Manual File Creation">

## Prerequisites

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

## Procedure

1. Clone the **CanvOS** repository.

   ```shell
    git clone https://github.com/spectrocloud/CanvOS.git
   ```

   From the **CanvOS** directory, copy the **user-data.template** file and name the copy **user-data**. This is a
   template that you can use as a starting point to build your own user data file.

2. View the available git tag.

   ```shell
   git tag
   ```

3. Check out the latest available tag. This guide uses the tag v4.6.c as an example.

   ```bash
   git checkout v4.6.c
   ```

### Prepare .arg File

2. Specify the system architecture and OS distribution and version. These configurations will apply to both the OS of
   your Edge host before and after cluster formation.

3. Specify the Kubernetes distribution. The Kubernetes distribution is used together with the OS distribution and
   version to create an immutable provider image that has your specified OS and Kubernetes.

   The Kubernetes version is specified in a different file named `k8s_version.json`.

4. Specify the image registry, image repository name, and image tag that will be used to tag your provider images. The
   custom tag, together with the Palette agent version (the same number as the Git tag you are using), the version and
   distribution of Kubernetes and the OS distribution used by the image forms the tag of the image.

   For example, if your `.arg` file contains the following arguments, the full image reference would be
   `ttl.sh/ubuntu:k3s-1.32.1-v4.6.c-demo`.

   ```text
   IMAGE_REGISTRY=ttl.sh
   IMAGE_REPO=ubuntu
   CUSTOM_TAG=demo
   K8S_DISTRIBUTION=k3s
   OS_DISTRIBUTION=ubuntu
   OS_VERSION=22
   ```

5. (Optional) If your build machine isn't in a restricted network environment, or your build process does not require
   access to a proxy server, skip this step.

   You can use `HTTP_PROXY` and `HTTPS_PROXY` to specify the URLs of the proxy servers to be used for your build.

6. Refer to [Edge Artifact Build Configurations](./palette-canvos/arg.md) for a comprehensive list of arguments you can
   use to customize the build.

### Prepare User Data

7. Decide whether you want to deploy an Edge host that is connected to a Palette instance. The default configuration is
   a connected Edge host. If you want to deploy an Edge host that is not connected to a Palette instance, you need to
   change the installation mode to `airgap`. Add the `installationMode` parameter to under the `stylus` parameter.

   ```yaml
   #cloud-init
   stylus:
     installationMode: airgap
   ```

   Edge hosts installed in airgap mode require you to provide assets needed to provision clusters. For more information
   about the deployment lifecycle of airgap Edge hosts, refer to
   [Edge Deployment Lifecycle](../edge-native-lifecycle.md).

8. If you want to deploy the Edge host in `airgap` mode, skip this step.

   If you want to deploy the Edge host in connected mode, you need to provide the Palette endpoint, in addition to
   either a registration token or QR code registration configuration. For more information about Edge host registration,
   refer to [Edge Host Registration](../site-deployment/site-installation/edge-host-registration.md). For example, the
   following configuration provides the default Palette endpoint, a registration token, an a project name.

   ```yaml
   #cloud-config
   stylus:
     site:
       # The Palette API endpoint to use. The default value is api.spectrocloud.com.
       paletteEndpoint: api.spectrocloud.com

       # The edgeHostToken is an auto-registration token to register the Edge host with Palette upon bootup.
       # This token can be generated by navigating to the Tenant Settings -> Registration Token.
       # Specify a name and select the project id with which the Edge host should register itself.
       edgeHostToken: aUAxxxxxxxxx0ChYCrO

       # The Palette project ID the Edge host should pair with. This is an optional field if an edgeHostToken is used and the token was assigned to a project.
       projectUid: 12345677788
   ```

#### Configure Cloud Init Stages (Optional)

9. Cloud-init stages allow you to configure your Edge host declaratively. For more information about cloud-init stages,
   refer to [Cloud-init Stages](../edge-configuration/cloud-init.md).

   To configure clout-init stages for your Edge host, use the `stages` block. For example, the following configuration
   installs Amazon Systems Manager agent on your Edge host during the `after-install-chroot` stage.

   ```yaml
   #cloud-init
   stages:
     after-install-chroot:
       - name: "Install SSM"
         commands:
           - snap install amazon-ssm-agent --classic
   ```

   :::tip

   You can also use the Operating System (OS) pack to apply additional customization using cloud-init stages. Both the
   Edge Installer configuration file and the OS pack support the usage of cloud-init stages. Refer to the
   [Cloud-Init Stages](../edge-configuration/cloud-init.md) to learn more.

   :::

#### Configure Users

10. If you would like to have SSH access to your Edge host, you must configure Operating System (OS) users on your Edge
    host. You can do this using the `stages.initramfs.users` block. Replace `USERNAME` with the name of your user and
    replace the value of the password with your password. You can also add the user to user groups, or add SSH keys to
    the list of authorized keys for that user.

```yaml
#cloud-init
stages:
 initramfs:
   - users:
       USERNAME:
         passwd: ******
         groups:
         - sudo
         ssh_authorized_keys:
         - ssh-rsa AAAAB3N…
     name: Create user and assign SSH key
```

#### Configure Proxy Settings (Optional)

11. Optionally, you can configure HTTP/HTTPS proxy settings for your Edge host. This instructs the Edge host OS as well
    as the Palette agent to use the proxy server for outbound communications. Use the parameters from the table below to
    configure proxy settings for your Edge host.

    These settings are different from the proxy settings you provide to the `.arg` file. The settings in the `.arg` file
    apply to the builder machine during the build process, while the settings in `user-data` apply to the Edge host
    after installation.

    | Parameter                | Description                                                                           |
    | ------------------------ | ------------------------------------------------------------------------------------- |
    | `siteNetwork.httpProxy`  | The URL of the HTTP proxy endpoint.                                                   |
    | `siteNetwork.httpsProxy` | The URL of the HTTPS proxy endpoint.                                                  |
    | `siteNetwork.noProxy`    | The list of IP addresses or CIDR ranges to exclude routing through the network proxy. |

    :::warning

    The proxy settings in user data configure Palette services to use the proxy network. However, these settings do not
    automatically apply to application workloads. To configure applications to use the proxy configurations, refer to
    [Configure Applications to Use Proxy Server](../../cluster-management/cluster-proxy.md).

    :::

#### Configure Post-Installation Behavior (Optional)

7. You can use some parameters of the `install` block to configure what you'd like the Edge host to do after
   installation is complete. The default behavior for the Edge host is to stay on the "Installation Complete" screen,
   but you can configure it to power off or restart automatically. For example, the following configuration instructs
   the Edge host to power off automatically post-installation.

   ```yaml
   #cloud-init
   install:
     poweroff: true
   ```

   :::warning

   If your want your Edge host to restart automatically, ensure that you remove the installation disk after the
   installation is complete and before the restart happens. Otherwise, the Edge host might start the installation
   process again.

   :::

</TabItem>

<TabItem value="EdgeForge Studio">

## Prerequisites

## Procedure

### Create .arg file

1. Visit the Appliance Studio in your browser.

2. Click **Design**. Then under **Argument files**, click **New .arg file**. If you have previously created and saved
   preset, you can choose **Continue with presets**. Otherwise, click **Start from scratch**.

3. Fill out each field in the form to customize your `.arg` file. Fields marked with `*` are mandatory. As you fill out
   each field, you can preview the `.arg` file in the code pane on the right. You can also make edits in the code pane
   directly, which will automatically update the form.

   Refer to [Edge Artifact Build Configurations](./palette-canvos/arg.md) for a descriptions of each argument.

4. When you are done, click **Confirm & Save**. Give your new configuration a name and optionally tags that will help
   you identify it.

5. After you save the file, the file will appear under **Argument files**. Hover over the file to reveal the three-dot
   menu. Click on it and click **Download** to download the file.

### Create user-data File

1. Visit the Appliance Studio in your browser.

2. Click **Design**. Then under **User data configuration**, click **New user-data configuration**. If you have
   previously created and saved preset, you can choose **Continue with presets**. Otherwise, click **Start from
   scratch**.

3. Fill out each field in the form to customize your `user-data` file. Fields marked with `*` are mandatory. As you fill
   out each field, you can preview the `user-data` file in the code pane on the right. You can also make edits in the
   code pane directly, which will automatically update the form.

   Refer to [Installer Configuration Reference](../edge-configuration/installer-reference.md) for a descriptions of each
   parameter.

4. When you are done, click **Confirm & Save**. Give your new configuration a name and optionally tags that will help
   you identify it.

   Once you save a `user-data` or `.arg` file, you can made edits to it at any time. To make edits, click on the file
   entry and the form will appear for you to make edits.

5. After you save the file, the file will appear under **User data files**. Hover over the file to reveal the three-dot
   menu. Click on it and click **Download** to download the file.

### (Optional) Create Presets for .arg and user-data Files

You can create presets to use as templates for future instances of your configuration files.

1. Visit the Appliance Studio in your browser.

2. Under either **Argument files** or **User data configuration**, click on the **Presets** tab.

3. Fill out each field in the form to customize your configuration. Since you are creating a preset, there are no
   mandatory fields.

4. When you are done, click **Confirm & Save**. Give your new preset a name and optionally tags that will help you
   identify it.

   The next time you create a new instance of either the `user-data` file or `.arg` file, you will see be able to use
   your preset as a template and make customizations on top of it.

</TabItem>

</Tabs>

## Validate

If you downloaded the file directly from Appliance Studio, your file is guaranteed to be valid schematically and there
is no need for you use the `+validate-user-data` earthly build target to validate the files.

You can use the `+validate-user-data` build target of EdgeForge to validate that your user data follows the expected
schema. You need to perform this action on an AMD64 (also known as x86_64) machine.

From the **CanvOS** directory, issue the following command to validate your user data.

```shell
sudo ./earthly.sh +validate-user-data
```

```hideClipboard
+validate-user-data | time=*2024-07-25T20:19:172* level=info msg="Validation successful"
```

## Full User Data Samples

You may encounter the following scenarios when creating an Edge Installer configuration user data file. Use these
examples as a starting point to help you create user data configurations that fit your needs.

```yaml
#cloud-config
stylus:
  site:
    # The Palette API endpoint to use. The default value is api.spectrocloud.com.
    paletteEndpoint: api.spectrocloud.com

    # The edgeHostToken is an auto-registration token to register the Edge host with Palette upon bootup.
    # This token can be generated by navigating to the Tenant Settings -> Registration Token.
    # Specify a name and select the project id with which the Edge host should register itself.
    edgeHostToken: aUAxxxxxxxxx0ChYCrO

    # The Palette project ID the Edge host should pair with. This is an optional field if an edgeHostToken is used and the token was assigned to a project.
    projectUid: 12345677788
    # Tags which that will be assigned to the device as labels.
    tags:
      key1: value1
      key2: value2
      key3: value3

    # The device's name, may also be referred to as the Edge ID or Edge host ID.  If no Edge hostname is specified,
    # a hostname will be generated from the device serial number.  If the Edge Installer cannot identify the device serial number, then a random ID will
    # be generated and used instead. In the case of hardware that does not have a serial number, we recommended specifying a
    # random name, with minimal chances of being re-used by a different Edge host.
    name: edge-appliance-1

    # Optional
    # If the Edge host requires a proxy to connect to Palette or to pull images, then specify the proxy information in this section
    network:
      # configures http_proxy
      httpProxy: http://proxy.example.com
      # configures https_proxy
      httpsProxy: https://proxy.example.com
      # configures no_proxy
      noProxy: 10.10.128.10,10.0.0.0/8

      # Optional: configures the global  nameserver for the system.
      nameserver: 1.1.1.1
      # configure interface specific info. If omitted all interfaces will default to dhcp
      interfaces:
        enp0s3:
          # type of network dhcp or static
          type: static
          # Ip address including the mask bits
          ipAddress: 10.0.10.25/24
          # Gateway for the static ip.
          gateway: 10.0.10.1
          # interface specific nameserver
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

# There is no password specified to the default kairos user. You must specify authorized keys or passwords to access the Edge host console.
stages:
  initramfs:
    - users:
        kairos:
          groups:
            - sudo
          passwd: kairos
      name: Create user and assign to sudo group
```

### Connected Sites - Multiple User Data Configuration

In this example, two configuration user user data files are used. The first one is used in the staging phase and is
included with the Edge Installer image. Note how the first user data contains the registration information and creates a
user group. A bootable USB stick applies the second user data at the physical site. The secondary user data includes
network configurations specific to the edge location.

**Staging** - included with the Edge Installer.

```yaml
#cloud-config
stylus:
  site:
    paletteEndpoint: api.spectrocloud.com
    edgeHostToken: <yourRegistrationToken>
    tags:
      city: chicago
      building: building-1

install:
  poweroff: true

stages:
  initramfs:
    - users:
        kairos:
          groups:
            - sudo
          passwd: kairos
      name: Create user and assign to sudo group
```

**Site** - supplied at the edge location through a bootable USB drive. If specified, the `projectName` value overrides
project information specified in the `edgeHostToken` parameter. You can add optional tags to identify the city,
building, and zip-code. If the edge site requires a proxy for an outbound connection, provide it in the network section
of the site user data.

```yaml
#cloud-config
stylus:
  site:
    projectName: edge-sites
    tags:
      zip-code: 95135
```

### Connected Sites - Single User Data

This example configuration is for a _connected site_. In this scenario, only a single Edge Installer configuration user
data is used for the entire deployment process.

```yaml
#cloud-config
stylus:
  site:
    paletteEndpoint: api.spectrocloud.com
    edgeHostToken: <yourRegistrationToken>
    projectName: edge-sites
    tags:
      city: chicago
      building: building-1
      zip-code: 95135

install:
  poweroff: true

stages:
  initramfs:
    - users:
        kairos:
          groups:
            - sudo
          passwd: kairos
      name: Create user and assign to sudo group
```

### Apply Proxy & Certificate Settings

This example showcases how you can include network settings in a user data configuration.

```yaml
#cloud-config
stylus:
  site:
    paletteEndpoint: api.spectrocloud.com
    edgeHostToken: <yourRegistrationToken>
    projectName: edge-sites
    tags:
      city: chicago
      building: building-1
      zip-code: 95135
    network:
      httpProxy: http://proxy.example.com
      httpsProxy: https://proxy.example.com
      noProxy: 10.10.128.10,10.0.0.0/8
      nameserver: 1.1.1.1
      # configure interface specific info. If omitted all interfaces will default to dhcp
      interfaces:
        enp0s3:
          # type of network dhcp or static
          type: static
          # Ip address including the mask bits
          ipAddress: 10.0.10.25/24
          # Gateway for the static ip.
          gateway: 10.0.10.1
          # interface specific nameserver
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

install:
  poweroff: true

stages:
  initramfs:
    - users:
        kairos:
          groups:
            - sudo
          passwd: kairos
      name: Create user and assign to sudo group
```

### Load Content From External Registry

In this example, content is downloaded from an external registry.

```yaml
#cloud-config
stylus:
  registryCredentials:
    domain: 10.10.254.254:8000/spectro-images
    username: ubuntu
    password: <yourPassword>
    insecure: true
  site:
    debug: true
    insecureSkipVerify: false
    paletteEndpoint: api.console.spectrocloud.com
    name: edge-appliance-1
    caCerts:
      - |
        -----BEGIN CERTIFICATE-----

        -----END CERTIFICATE-----

install:
  poweroff: false

stages:
  initramfs:
    - users:
        kairos:
          groups:
            - sudo
          passwd: kairos
      name: Create user and assign to sudo group
```

### Create Bind Mounts

Palette Edge allows you to create bind mounts from your Edge host to your cluster through the installer configuration
file named **user-data**, which allows your cluster to use directories or files from your Edge host directly within your
Kubernetes cluster. This setup is useful for scenarios where your applications are active in the cluster and need direct
access to files or directories on the Edge host.

<!-- prettier-ignore -->
Several packs require you set up bind mounts in order to function. For example, the <VersionedLink text="Portworx pack" url="/integrations/packs/?pack=csi-portworx-generic" /> requires several folders to be mounted on Edge deployments. You can use the `install.bind_mounts` parameter to specify folders to be mounted. For
example, the following user data mounts three folders required by Portworx from the Edge host to the cluster.

```yaml
#cloud-config
stylus:
  site:
    debug: true
    insecureSkipVerify: false
    paletteEndpoint: api.console.spectrocloud.com
    name: edge-appliance-1
    caCerts:
      - |
        -----BEGIN CERTIFICATE-----

        -----END CERTIFICATE-----

install:
  bind_mounts:
    - /etc/pwx
    - /var/lib/osd
    - /var/cores
```

## Multiple User Data Use Case

If you don't need to apply any unique configurations on the device once it arrives at the physical site, then your site
deployment flow would look like the following.

![The flow of an install process not requiring additional customization](/clusters_site-deployment_prepare-edge-configuration_install-flow.webp)

Should you need to apply different configurations once the device arrives at the physical site, you can use a secondary
user data to support this use case.

Use the additional user data to override configurations from the previous user data that was flashed into the device or
to inject new configuration settings. Using secondary user data at the physical site is a common pattern for
organizations that need to change settings after powering on the Edge host at the physical location.

To use additional user data, create a bootable device, such as a USB stick, that contains the user data in the form of
an ISO image. The Edge Installer will consume the additional user data during the installation process.

![The flow of an install process with an additional customization occurring at the physical site. The additional customization is using a USB stick to upload the new user data.](/clusters_site-deployment_prepare-edge-configuration_install-flow-with-more-user-data.webp)

When creating your Edge Installer, you can embed the user data into the installer image to eliminate providing it via a
USB drive.

In the staging phase, you may identify user data parameter values that apply uniformly to all your edge sites. But you
may also have some edge locations that require different configurations such as site network proxy, site certs, users
and groups, etc. Site-specific configurations are typically not included in the Edge installer image. For the latter
scenario, you can use a secondary user data configuration. Refer to the
[Apply Site User Data](../site-deployment/site-installation/site-user-data.md) guide to learn more about applying
secondary site-specific user data.

:::info

For your initial testing, your user data may include global settings and site-specific properties in a single user data.
As you gain more experience, you should evaluate whether secondary site-specific user data is a better design for your
use case.

:::

## Next Steps

After you have finalized your Installer configuration, you can build the configuration into the Edge Installer ISO, or
turn the **user-data** file into an ISO file to use before site deployment.

- Check out the [Build Edge Installer ISO](palette-canvos/palette-canvos.md) guide to learn how to build the Edge
  Installer ISO image.

- Check out the [Apply Site User Data](../site-deployment/site-installation/site-user-data.md) guide to learn how to
  provide site user data.
