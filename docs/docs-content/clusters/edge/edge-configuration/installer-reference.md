---
sidebar_label: "Installer Configuration Reference"
title: "Edge Installer Configuration Reference"
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

:::info

The `#cloud-config` value is a required cloud-init header required by the
[cloud-init](https://cloudinit.readthedocs.io/en/latest/explanation/format.html) standard.

:::

## Defaults

The Edge Installer is configured with a set of default values.

| Parameter             | Default                                        | Description                                                                                                                                                                                                           |
| --------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `paletteEndpoint`     | `api.spectrocloud.com`                         | The Palette API endpoint.                                                                                                                                                                                             |
| `prefix`              | `edge`                                         | The prefix prepended to the edge device hostname to form the unique identifier.                                                                                                                                       |
| `registrationURL`     | `https://edge-registration-generic.vercel.app` | The URL that operators should use when registering the Edge host with Palette.                                                                                                                                        |
| `disableAutoRegister` | `false`                                        | Set to `true` if you want to disable auto registration. Refer to the [Register Edge Host](../site-deployment/site-installation/edge-host-registration.md) reference page to learn more about Edge host registrations. |

The default values assume you are installing the Edge host in an environment without a network proxy, do not require
remote access to the Edge host, and are using Palette SaaS. If you have requirements different from the default values,
you must provide the Edge Installer with additional information.

You can provide the installer with additional configuration values in the user data configuration file. The following
table contains all the supported user data parameters the installer accepts.

## Debug Parameters

You can enable the `debug` and `trace` parameters when you need to troubleshoot Edge Installer issues.

| Parameter       | Description                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| `debug`         | Enable this parameter for debug output. Allowed values are `true` or `false`. Default value is `false`.        |
| `trace`         | Enable this parameter to display trace output. Allowed values are `true` or `false`. Default value is `false`. |
| `imageOverride` | You can specify a different Edge Installer image versus the default image.                                     |

```yaml
#cloud-config
stylus:
  debug: true
  trace: true
  imageOverride: "example.com/example-installer:v1.4.0"
```

## Install Mode

You can specify the mode the Edge Installer should prepare the installation for. The Edge Installer supports two
different modes.

- Connected: The site has internet connectivity and the installation is initiated through Palette.

- Air-Gapped: The site does not have internet connectivity. The Installation is initiated through the Palette Edge CLI.

| Parameter          | Description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| `installationMode` | Allowed values are `connected` and `airgap`. Default value is `connected`. |

```yaml
#cloud-config
stylus:
  installationMode: "connected"
```

## Initial Configuration

You can configure the Edge Installer to enable the initial configuration in the Palette Terminal User Interface (TUI)
when you boot up the Edge host for the first time. For more information about initial configuration, refer to
[Initial Edge Host Configuration](../site-deployment/site-installation/initial-setup.md).

| Parameter    | Description                                                                       |
| ------------ | --------------------------------------------------------------------------------- |
| `includeTui` | Enable Palette TUI for initial Edge host configuration. Default value is `false`. |

For example, the following configuration enables the Palette TUI.

```yaml {3}
#cloud-config
stylus:
  installationMode: airgap
  includeTui: true
  skipStylusUpgrade: true
```

## Local UI

You can change the port that the Edge management console is exposed on. The default port is 5080.

| Parameter        | Description                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------- |
| `emcServer.port` | Specifies the port that the Edge management console is exposed on. Default value is 5080. |

## External Registry

You can point the Edge Installer to a non-default registry to load content from another source. Use the
`registryCredentials` parameter object to specify the registry configurations.

| Parameter         | Description                                                                                                                                                                                                                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`          | The domain of the registry. You can use an IP address plus the port or a domain name.                                                                                                                                                                                                                                             |
| `username`        | The username to authenticate with the registry.                                                                                                                                                                                                                                                                                   |
| `password`        | The password to authenticate with the registry.                                                                                                                                                                                                                                                                                   |
| `insecure`        | Whether to allow insecure connections to the registry. Default value is `false`.                                                                                                                                                                                                                                                  |
| `encodedPassword` | Specifies whether the password as given is base64 encoded.`true` means that the provided password is base64 encoded and that when using the password to authenticate, the password must be decoded first. `false` means the password is not encoded and must be used as is to authenticate with the registry. Default is `false`. |

```yaml
#cloud-config
stylus:
  registryCredentials:
    domain: 10.10.254.254:8000/spectro-images
    username: ubuntu
    password: <yourPassword>
    insecure: true
```

## Site Parameters

The `stylus.site` blocks accept the following parameters.

| Parameter            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `paletteEndpoint`    | The URL endpoint that points to Palette. Example: `api.spectrocloud.com`                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `edgeHostToken`      | A token created at the tenant scope that is required for auto registration.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `projectUid`         | The ID of the project the Edge host will belong to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `projectName`        | The name of the project.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `name`               | Hostname of the Edge device. A hostname is composed of one label or a series of labels concatenated with dots. For example, `spectro-host` and `host.spectrocloud.com` are both valid host names. The entire hostname, including the delimiting dots, has a maximum of 253 ASCII characters. Each label may contain only the lower-case ASCII letters a through z, the digits 0 through 9, and the hyphen-minus character ('-'), and may contain no more than 63 characters. A hostname must start and end with alphanumeric characters. \  |
| `prefix`             | A prefix prepended to the Edge device hostname to form the Edge device ID. Only alphanumeric characters and the hyphen-minus character are allowed. By default, this value is set to `edge`.                                                                                                                                                                                                                                                                                                                                                |
| `network`            | The network configuration settings. Review the [Site Network Parameters](#site-network-parameters) below for more details.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `registrationURL`    | The URL that operators should use to register the Edge host with Palette.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `insecureSkipVerify` | This controls whether or not a client verifies the server's certificate chain and hostname.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `caCerts`            | The Secure Sockets Layer (SSL) certificate authority (CA) certificates.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `clusterId`          | The ID of the host cluster the edge host belongs to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `clusterName`        | The name of the host cluster the edge host belongs to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `tags`               | A parameter object you use to provide optional key-value pairs. Refer to the [Tags](#tags) section to learn more.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `tagsFromFile`       | Specify tags from a file. Refer to the [Tags](#tags) section to learn more.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `tagsFromScript`     | Use a script to generate the tags. Refer to the [Tags](#tags) section to learn more.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `deviceUIDPaths`     | Specify the file path for reading in product or board serial that can be used to set the device ID. The default file path is **/sys/class/dmi/id/product_uuid**. Refer to the [Device ID (UID) Parameters](#device-id-uid-parameters) section to learn more.                                                                                                                                                                                                                                                                                |

:::info

If you do not specify a hostname for the edge device, the system will generate one from the serial number of the device.
If the Edge Installer cannot identify the serial number, it will generate a random ID instead. In cases where the
hardware does not have a serial number, we suggest that you specify a value so there is minimal chance of duplication.
Use the value `"$random"` to generate a random ID. You can also use the `DeviceUIDPaths` to read in a value from a
system file.

:::

## Site Network Parameters

Use the site network parameters to configure network settings so the edge host can communicate with Palette.

| Parameter                | Description                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `siteNetwork.httpProxy`  | The URL of the HTTP proxy endpoint.                                                                                                   |
| `siteNetwork.httpsProxy` | The URL of the HTTPS proxy endpoint.                                                                                                  |
| `siteNetwork.noProxy`    | The list of IP addresses or CIDR ranges to exclude routing through the network proxy.                                                 |
| `siteNetwork.interfaces` | The network settings respective to the interfaces. Review the [Network Parameters](#network-parameters) table below for more details. |
| `siteNetwork.nameserver` | The IP address of the global DNS nameserver that requests should be routed to.                                                        |

## Network Parameters

Network settings specific to the network interface of the edge host. You can configure multiple interfaces.

| Parameter                     | Description                                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| `networkInterface.ipAddress`  | The assigned IP address to the network interface.                                                  |
| `networkInterface.mask`       | The network mask for the assigned IP address.                                                      |
| `networkInterface.type`       | Defines how the IP address is assigned. Allowed values are `dhcp` or `static`. Defaults to `dhcp`. |
| `networkInterface.gateway`    | The network gateway IP address.                                                                    |
| `networkInterface.nameserver` | The IP address of the DNS nameserver this interface should route requests to.                      |

## Device ID (UID) Parameters

The device ID is generated by a specific priority sequence. The below table outlines the priority order from top to
bottom when generating a UID for the Edge host. The UID generation starts with priority one, the device `name`, followed
by attributes within the `deviceUIDPAths`, and lastly generating a random UUID if all other methods are unsuccessful.

| Priority | Method           | Description                                                                |
| -------- | ---------------- | -------------------------------------------------------------------------- |
| 1        | `name`           | The device name is used as the primary identifier for the Edge host.       |
| 2        | `deviceUIDPaths` | Specifies the paths and associated regular expressions to extract the UID. |
| 3        | `"$random"`      | Assigns a random UUID as the Edge host ID.                                 |

By default, the product UID path is set to `/sys/class/dmi/id/product_uuid`. To modify this path and use other
attributes within the same folder, such as the product or board serial, use the `regex` parameter. For example, instead
of the default path **/sys/class/dmi/id/product_uuid**, you can use the board Serial Number path
**/sys/class/dmi/id/board_serial** by applying a `regex` parameter. Refer to the
[regex syntax](https://github.com/google/re2/wiki/Syntax) reference guide to learn more.

| Parameter | Description                                      |
| --------- | ------------------------------------------------ |
| `name`    | The path of the file containing the UID.         |
| `regex`   | The regular expression pattern to match the UID. |

You can use the `regex` parameter to remove unsupported characters from attributes to Refer to the warning box below for
a list of unsupported characters.

```yaml
#cloud-config
stylus:
  site:
    deviceUIDPaths:
      - name: /etc/palette/metadata-regex
        regex: "edge.*"
```

:::warning

The length of the UID truncates to a maximum allowed length of 128 characters. The following characters are unsupported:

`/ ? # & + % , $ ~ ! @ * () {} | = ; : <> ' . ^ "`

:::

## Tags

You can assign tags to the Edge host by specifying tags manually in the configuration file. The tags object accepts
key-value pairs. The following example shows how to assign tags manually to the Edge host.

```yaml
#cloud-config
stylus:
  site:
    tags:
      env: prod
      department: engineering
```

You can also specify tags through alternative methods that are more dynamic, such as reading in tags from a file or from
a script that returns a JSON object. You can combine the various methods to provide tags to the Edge host. The following
sections describe the various methods you can use to provide tags dynamically to the Edge host.

:::info

The order of precedence for tags is as follows:

1. Manually provided tags - `tags`.

2. Tags from a script - `tagsFromScript`.

3. Tags from a file - `tagsFromFile`.

Tags from higher priority orders override tags from lower priority. For example, if you specify a tag manually and also
specify the same tag in a `tagsFromFile`, the tag from the `tag` object is what the Edge installer will use.

:::

## Tags From a File

You can specify tags from a file by using the `tagsFromFile` parameter object. The `tagsFromFile` parameter object
accepts the following parameters.

| Parameter   | Description                                            | Default Value |
| ----------- | ------------------------------------------------------ | ------------- |
| `fileName`  | The path to the file containing the tags.              | `''`          |
| `delimiter` | The delimiter used to separate the key-value pairs.    | `\n`          |
| `separator` | The separator used to separate the key from the value. | `:`           |

```yaml
#cloud-config
stylus:
  site:
    tags:
      department: "sales"
    tagsFromFile:
      fileName: "/etc/palette/tags.txt"
      delimiter: ";"
      separator: ":"
```

Example:

You can specify different delimiters and separators to parse the content depending on how the content is formatted.
Assume the file **/etc/palette/tags.txt** contains the following content.

```text hideClipboard
Location:Mumbai,India; Latitude:48.856614; Longitude:2.352221; owner:p78125d
```

## Tags From a Script

You can specify tags from a script by using the `tagsFromScript` parameter object. The script must be executable and
return a JSON object that contains the tags in the following format.

```json hideClipboard
{
  "key": "value"
}
```

Example:

```json
{
  "department": "sales",
  "owner": "p78125d"
}
```

The `tagsFromScript` parameter object accepts the following parameters.

| Parameter    | Description                                        | Default Value |
| ------------ | -------------------------------------------------- | ------------- |
| `scriptName` | The path to the script that returns a JSON object. | `''`          |
| `timeout`    | The timeout value in seconds.                      | `60`          |

```yaml
#cloud-config
stylus:
  site:
    tags:
      department: "sales"
    tagsFromScript:
      scriptName: "/etc/palette/tags.py"
      timeout: 60
```
