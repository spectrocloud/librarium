---
sidebar_label: "Installer Configuration"
title: "Edge Installer Configuration"
description: "Review the available Edge Installer configuration options."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

The Edge Installer configuration user data accepts a parameter named `stylus`. In addition to the `stylus` parameter,
the user data file also supports the use of cloud-init stages and other Kairos-supported parameters. The `stylus.site`
parameter is how you primarily configure the Edge host, but you can also use cloud-init stages to customize the
installation. Refer to the [Site Parameters](#site-parameters) for a list of all the parameters supported in the
`stylus.site` parameter block.

# User Data Parameters

### Defaults

The Edge Installer is configured with a set of default values.

| Parameter         | Default                                        | Description                                                                    |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| `PaletteEndpoint` | `api.console.spectrocloud.com`                 | The Palette API endpoint.                                                      |
| `Prefix`          | `edge`                                         | The default prefix to apply to the unique identifier.                          |
| `RegistrationURL` | `https://edge-registration-generic.vercel.app` | The URL that operators should use when registering the Edge host with Palette. |

The default values assume you are installing the Edge host in an environment without a network proxy, do not require
remote access to the Edge host, and are using Palette SaaS. If you have requirements different from the default values,
you must provide the Edge Installer with additional information.

You can provide the installer with additional configuration values in the user data configuration file. The following
table contains all the supported user data parameters the installer accepts.

### Debug Parameters

You can enable the `debug` and `trace` parameters when you need to troubleshoot Edge Installer issues.

| Parameter       | Description                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| `debug`         | Enable this parameter for debug output. Allowed values are `true` or `false`. Default value is `false`.       |
| `trace`         | Enable this paramter to display trace output. Allowed values are `true` or `false`. Default value is `false`. |
| `imageOverride` | You can specify a different Edge Installer image versus the default image.                                    |

```yaml
stylus:
  debug: true
  trace: true
  imageOverride: "example.com/example-installer:v1.4.0"
```

### Install Mode

You can specify the mode the Edge Installer should prepare the installation for. The Edge Installer supports two
different modes.

<br />

- Connected: The site has internet connectivity and the installation is initiated through Palette.

- Air-Gapped: The site does not have internet connectivity. The Installation is initiated through the Palette Edge CLI.

| Parameter          | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `installationMode` | Allowed values are `connected`. Default value is `connected`. |

<br />

```yaml
stylus:
  installationMode: "connected"
```

### External Registry

You can point the Edge Installer to a non-default registry to load content from another source. Use the
`registryCredentials` parameter object to specify the registry configurations.

| Parameter  | Description                                                                           |
| ---------- | ------------------------------------------------------------------------------------- |
| `domain`   | The domain of the registry. You can use an IP address plus the port or a domain name. |
| `username` | The username to authenticate with the registry.                                       |
| `password` | The password to authenticate with the registry.                                       |
| `insecure` | Whether to allow insecure connections to the registry. Default value is `false`.      |

<br />

```yaml
stylus:
  registryCredentials:
    domain: 10.10.254.254:8000/spectro-images
    username: ubuntu
    password: <yourPassword>
    insecure: true
```

### Site Parameters

The `stylus.site` blocks accept the following parameters.

| Parameter            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `paletteEndpoint`    | The URL endpoint that points to Palette. Example: `api.spectrocloud.com`                                                                                                                                                                                                                                                                                                                                                                                                      |
| `edgeHostToken`      | A token created at the tenant scope that is required for auto registration.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `projectUid`         | The id of the project the Edge host will belong to.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `projectName`        | The name of the project.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `name`               | If you do not specify an Edge hostname, the system will generate one from the serial number of the device. If Stylus is unable to identify the serial number, it will generate a random ID instead. In cases where the hardware does not have a serial number, we suggest that you specify a value so there is minimal chance of duplication. Use the value `"$random"` to generate a random ID. You can also use the `DeviceUIDPaths` to read in a value from a system file. |
| `prefix`             | The system assigns a prefix value to the device UID generated by the Edge Installer. By default, this value is set to `edge`.                                                                                                                                                                                                                                                                                                                                                 |
| `network`            | The network configuration settings. Review the [Site Network Parameters](#site-network-parameters) below for more details.                                                                                                                                                                                                                                                                                                                                                    |
| `registrationURL`    | The URL that operators should use to register the Edge host with Palette.                                                                                                                                                                                                                                                                                                                                                                                                     |
| `insecureSkipVerify` | This controls whether or not a client verifies the server's certificate chain and host name.                                                                                                                                                                                                                                                                                                                                                                                  |
| `caCerts`            | The Secure Sockets Layer (SSL) certificate authority (CA) certificates.                                                                                                                                                                                                                                                                                                                                                                                                       |
| `clusterId`          | The id of the host cluster the edge host belongs to.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `clusterName`        | The name of the host cluster the edge host belongs to.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `tags`               | A parameter object you use to provide optional key-value pairs.                                                                                                                                                                                                                                                                                                                                                                                                               |

### Site Network Parameters

Use the site network parameters to configure network settings so the edge host can communicate with Palette.

| Parameter                | Description                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `siteNetwork.httpProxy`  | The URL of the HTTP proxy endpoint.                                                                                                   |
| `siteNetwork.httpsProxy` | The URL of the HTTPS proxy endpoint.                                                                                                  |
| `siteNetwork.noProxy`    | The list of IP addresses or CIDR ranges to exclude routing through the network proxy.                                                 |
| `siteNetwork.interfaces` | The network settings respective to the interfaces. Review the [Network Parameters](#network-parameters) table below for more details. |
| `siteNetwork.nameserver` | The IP address of the global DNS nameserver that requests should be routed to.                                                        |

### Network Parameters

Network settings specific to the network interface of the edge host. You can configure multiple interfaces.

| Parameter                     | Description                                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| `networkInterface.ipAddress`  | The assigned IP address to the network interface.                                                  |
| `networkInterface.mask`       | The network mask for the assigned IP address.                                                      |
| `networkInterface.type`       | Defines how the IP address is assigned. Allowed values are `dhcp` or `static`. Defaults to `dhcp`. |
| `networkInterface.gateway`    | The network gatway IP address.                                                                     |
| `networkInterface.nameserver` | The IP address of the DNS nameserver this interface should route requests to.                      |

# Example Configuration

The following example shows how user data configuration is used to customize the edge host installation process.

<br />

```yaml
stylus:
  site:
    paletteEndpoint: api.spectrocloud.com
    edgeHostToken: yourEdgeRegistrationTokenHere
    projectUid: 12345677788
    tags:
      env: east
      terraform_managed: true
      os: ubuntu

    name: edge-59d3f182-35fe-4e10-b0a0-d7f761f1a142
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

<br />

:::info

Check out the [Prepare User Data](../edgeforge-workflow/prepare-user-data.md) resource for more examples.

:::

## Additional Configurations

The Edge Installer will honor other Kairos parameters, such as `install`, and `options`. To learn more about Kairos
parameters, refer to the [Kairos configuration](https://kairos.io/docs/reference/configuration/) page.

The following is an example Edge installer configuration that is using the `install` parameter block to power off the
device upon completion of the installation process.

<br />

```yaml
stylus:
  site:
    paletteEndpoint: api.spectrocloud.com
    registrationURL: https://edge-registration.vercel.app
    projectUid: yourProjectIdHere
    edgeHostToken: yourEdgeRegistrationTokenHere
    tags:
      myTag: myValue
      myOtherTag: myOtherValue
  reboot: false

stages:
  initramfs:
    - users:
        palette:
          groups:
            - sudo
          passwd: palette

install:
  poweroff: true
```
