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

## Palette Agent Parameters

These parameters start with the prefix `stylus`. Palette agent parameters control various aspects of the Edge host's
configuration, including networking, logging, services, as well as users and permissions. Parameters in this section are
listed in alphabetical order.

| Parameter                      | Description                                                                                                                                                                                                | Default     |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `stylus.debug`                 | Enable this parameter for debug output. Allowed values are `true` or `false`.                                                                                                                              | `False`     |
| `stylus.disablePasswordUpdate` | Disables the ability to update Operating System (OS) user password from Local UI if set to true. Updating the password through the OS and API is still allowed.                                            | `False`     |
| `stylus.includeTui`            | Enable Palette TUI for initial Edge host configuration. Default value is `false`. For more information, refer to [Initial Edge Host Configuration](../site-deployment/site-installation/initial-setup.md). | `false`     |
| `stylus.installationMode`      | Allowed values are `connected` and `airgap`. Default value is `connected`. `connected` means that the Edge host has a connection to Palette; `airgap` means it does not have a connection to Palette.      | `connected` |
| `stylus.localUI.port`          | Specifies the port that Local UI is exposed on.                                                                                                                                                            | 5080        |
| `stylus.site`                  | Review Site Parameters for more information.                                                                                                                                                               |             |
| `stylus.registryCredentials`   | Review [External Registry Parameters](#external-registry-parameters) for more information.                                                                                                                 | None        |
| `stylus.trace`                 | Enable this parameter to display trace output. Allowed values are `true` or `false`.                                                                                                                       | `False`     |

### External Registry Parameters

You can point the Edge Installer to a non-default registry to load content from another source. Use the
`registryCredentials` parameter object to specify the registry configurations.

If you are using an external registry and want to use content bundles when deploying your Edge cluster, you must also
enable the local Harbor registry. For more information, refer to
[Build Content Bundles](../edgeforge-workflow/palette-canvos/build-content-bundle.md) and
[Enable Local Harbor Registry](../site-deployment/deploy-custom-registries/local-registry.md).

| Parameter                                    | Description                                                                                                 | Type    | Default |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------- | ------- |
| `stylus.registryCredentials.domain`          | The domain of the registry. You can use an IP address plus a port or a domain name.                         | String  | `''`    |
| `stylus.registryCredentials.username`        | The username to authenticate with the registry.                                                             | String  | `''`    |
| `stylus.registryCredentials.password`        | The password to authenticate with the registry.                                                             | String  | `''`    |
| `stylus.registryCredentials.encodedPassword` | Set to `true` if the password given is base64 encoded. Set to `false` if the password given is not encoded. | boolean | `false` |

```yaml
#cloud-config
stylus:
  registryCredentials:
    domain: 10.10.254.254:8000/spectro-images
    username: ubuntu
    password: <yourPassword>
```

### Site Parameters

The `stylus.site` blocks accept the following parameters.

| Parameter                        | Description                                                                                                                                                                                                                                                 | Type                             | Default |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------- |
| `stylus.site.caCerts`            | The Secure Sockets Layer (SSL) Certificate Authority (CA) certificates. The certificates must be base64-encoded.                                                                                                                                            | Array of strings                 | None    |
| `stylus.site.clusterId`          | The ID of the cluster the Edge host belongs to.                                                                                                                                                                                                             | String                           | `''`    |
| `stylus.site.clusterName`        | The name of the cluster the Edge host belongs to.                                                                                                                                                                                                           | String                           | `''`    |
| `stylus.site.deviceUIDPaths`     | A list of file paths for reading in a product or board serial that can be used to set the device ID. The default file path is `/sys/class/dmi/id/product_uuid`. Refer to the [Device ID (UID) Parameters](#device-id-uid-parameters) section to learn more. | Array of `FileList`              | None    |
| `stylus.site.edgeHostToken`      | A token created at the tenant scope that is required for auto registration.                                                                                                                                                                                 | String                           | `''`    |
| `stylus.site.hostName`           | The host name for the Edge host. This will also be the node's name when the host is added to a cluster. If you do not specify a host name, the `stylus.site.name` value becomes the host name.                                                              | string                           | `''`    |
| `stylus.site.insecureSkipVerify` | This controls whether or not a client verifies the server’s certificate chain and hostname.                                                                                                                                                                 | boolean                          | `false` |
| `stylus.site.name`               | The Edge host ID with which the host registers with Palette.                                                                                                                                                                                                | String                           | `''`    |
| `stylus.site.network`            | The network configuration settings. Refer to [Site Network Parameters](#site-network-parameters) for more details.                                                                                                                                          | Object                           | None    |
| `stylus.site.paletteEndpoint`    | The URL endpoint that points to Palette. Example: `api.spectrocloud.com`                                                                                                                                                                                    | String                           | `''`    |
| `stylus.site.prefix`             | A prefix prepended to the Edge device hostname to form the Edge device ID. Only alphanumeric characters and `-` are allowed.                                                                                                                                | String                           | `edge`  |
| `stylus.site.projectName`        | The name of the project to which the Edge host belongs.                                                                                                                                                                                                     | String                           | `''`    |
| `stylus.site.projectUid`         | The ID of the project to which the Edge host belongs.                                                                                                                                                                                                       | String                           | `''`    |
| `stylus.site.registrationURL`    | The URL that operators use to register the Edge host with Palette.                                                                                                                                                                                          | String                           | `''`    |
| `stylus.site.tags`               | A parameter object you can use to provide optional key-value pairs. Refer to the [Tags](#tags) section to learn more.                                                                                                                                       | Map of `string` and object value | None    |
| `stylus.site.tagsFromFile`       | Specify tags from a file. Refer to [Tags](#tags) for more information.                                                                                                                                                                                      | `TagsFromFile` object            | None    |
| `stylus.site.tagsFromScript`     | Use a script to generate tags. Refer to [Tags](#tags) for more information.                                                                                                                                                                                 | `TagsFromScript` object          | None    |

:::info

If you do not specify an Edge host ID for the Edge host with `stylus.site.name` , the system will generate one from the
serial number of the device in the format of `edge-<serial-number>`. If the Edge Installer cannot identify the serial
number, it will generate a random ID instead. In cases where the hardware does not have a serial number, we suggest that
you specify a value so there is minimal chance of duplication. Use the value `"$random"` to generate a random ID. You
can also use the `DeviceUIDPaths` to read in a value from a system file.

:::

#### Device ID (UID) Parameters

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

| Parameter                             | Description                                      |
| ------------------------------------- | ------------------------------------------------ |
| `stylus.site.deviceUIDPaths[*].name`  | The path of the file containing the UID.         |
| `stylus.site.deviceUIDPaths[*].regex` | The regular expression pattern to match the UID. |

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

#### Site Network Parameters

Use the site network parameters to configure network settings so the edge host can communicate with Palette.

| Parameter                                              | Description                                                                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `stylus.site.network.httpProxy`                        | The URL of the HTTP proxy endpoint.                                                                                             |
| `stylus.site.network.httpsProxy`                       | The URL of the HTTPS proxy endpoint.                                                                                            |
| `stylus.site.network.noProxy`                          | The list of IP addresses or CIDR ranges to exclude routing through the network proxy.                                           |
| `stylus.site.network.interfaces`                       | The network settings respective to the interfaces. This parameter accepts a list of objects with keys as follows in this table. |
| `stylus.site.network.interfaces.[NIC-NAME].ipAddress`  | The assigned IP address to the network interface.                                                                               |
| `stylus.site.network.interfaces.[NIC-NAME].mask`       | The network mask for the assigned IP address.                                                                                   |
| `stylus.site.network.interfaces.[NIC-NAME].type`       | Defines how the IP address is assigned. Allowed values are `dhcp` or `static`. Defaults to `dhcp`.                              |
| `stylus.site.network.interfaces.[NIC-NAME].gateway`    | The network gateway IP address.                                                                                                 |
| `stylus.site.network.interfaces.[NIC-NAME].nameserver` | The IP address of the DNS nameserver this interface should route requests to.                                                   |
| `stylus.site.network.nameserver`                       | The IP address of the global DNS nameserver that requests should be routed to.                                                  |

:::warning

The proxy settings in user data configure Palette services to use the proxy network. However, these settings do not
automatically apply to application workloads. To configure applications to use the proxy configurations, refer to
[Configure Applications to Use Proxy Server](../../cluster-management/cluster-proxy.md).

:::

#### Tags

You can specify tags from a file by using the `tagsFromFile` parameter object or from a script by using the
`tagsFromScript` parameter.

| Parameter                               | Description                                            | Default Value |
| --------------------------------------- | ------------------------------------------------------ | ------------- |
| `stylus.site.tagsFromFile.fileName`     | The path to the file containing the tags.              | `''`          |
| `stylus.site.tagsFromFile.delimiter`    | The delimiter used to separate the key-value pairs.    | `\n`          |
| `stylus.site.tagsFromFile.separator`    | The separator used to separate the key from the value. | `:`           |
| `stylus.site.tagsFromScript.scriptName` | The path to the script that returns a JSON object.     | `''`          |
| `stylus.site.tagsFromScript.timeout`    | The timeout value in seconds.                          | `60`          |

With tags from a file, you can specify different delimiters and separators to parse the content of a file depending on
how the content is formatted. For example, assume the file **/etc/palette/tags.txt** contains the following content.

```text hideClipboard
Location:Mumbai,India; Latitude:48.856614; Longitude:2.352221; owner:p78125d
```

The following configuration can produce these tags: `Location: Mumbai,India`, `Latitude: 48.856614`,
`Longitude:2.352221`, `owner:p78125d`, `department: sales`.

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

You can specify tags from a script by using the `tagsFromScript` parameter object. The script must be bash script that
is executable and return a JSON object that contains the tags in the following format.

```json hideClipboard
{
  "key": "value"
}
```

For example, if you have a bash script that returns the following JSON output:

```json
{
  "department": "sales",
  "owner": "p78125d"
}
```

You can configure `stylus.site.tagsFromScript` to point to the script, and it will add the tags `owner:p78125d` and
`department: sales` to the Edge host.

## Install Parameters

The `install` block allows you to configure the installer to make bind mounts and disk partitions on the Edge host. In
addition, you can specify post-installation behavior, such as instructing the Edge host to power off automatically after
installation is complete.

| Parameter                            | Description                                                                                                                                                      | Default |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `install.bind_mounts`                | The list of folders to bind mount from the installer to the Edge host                                                                                            | None    |
| `install.grub_options.extra_cmdline` | Kernel command-line parameters to add to the installer.                                                                                                          | None    |
| `install.partitions.persistent`      | A persistent partition object. Providing this parameter creates an extra persistent partition on the Edge host. Accepts two parameters as follows in this table. | None    |
| `install.partitions.persistent.size` | The size of the persistent partition                                                                                                                             | None    |
| `install.partitions.persistent.fs`   | The type of the file system for the persistent partition. You must provide a value for this parameter (for example, `ext4`).                                     | None    |
| `install.extra-partitions`           | The list of extra partitions to create. Each list item accepts parameters as follows in this table.                                                              | None    |
| `install.extra-partitions[*].name`   | The name of the extra partition                                                                                                                                  | None    |
| `install.extra-partitions[*].size`   | The size of the extra partition                                                                                                                                  | None    |
| `install.extra-partitions[*].fs`     | The file system of the extra partition                                                                                                                           | None    |
| `install.extra-partitions[*].label`  | The label of the extra partition                                                                                                                                 | None    |
| `install.poweroff`                   | Whether to power off the Edge host after installation is complete.                                                                                               | `False` |
| `install.reboot`                     | Whether to reboot the Edge host after installation is complete                                                                                                   | `False` |

## Cloud Init Stages

Cloud init stages allow you to automates the initialization of your Edge hosts during various stages of the system boot
process. You can perform For more information, refer to [Cloud-init Stages](./cloud-init.md).

:::info

You can configure users during any cloud-init stage. However, we strongly recommend that you use the `initramfs` stage
to configure users, because this is the earliest cloud-init stage.

If you need to debug the Edge host in the event it is unable to progress past a certain stage, you will be able to
establish an SSH connection into the Edge host because the users are already there. On the other hand, if you configure
users at a later stage and your Edge host is not able to progress to that stage during installation, you will not be
able to access your Edge host because there are no users.

:::

| Parameter                               | Description                                                                                                                                           | Default |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `stages.*.users`                        | The list of users to create at any cloud-init stage. Replace `*` with the specific stage. Each list item accepts parameters as follows in this table. | None    |
| `stages.*.users[*].groups`              | The list of groups that the user belongs to. Replace `*` with your username.                                                                          | None    |
| `stages.*.users[*].passwd`              | The password of the user. Replace `*` with your username.                                                                                             | None    |
| `stages.*.users[*].lock_passwd`         | When set to `true`, disables password configuration by the user. Replace `*` with your username.                                                      | `false` |
| `stages.*.users[*].ssh_authorized_keys` | The list of public SSH keys authorized for the user. Replace `*` with your username.                                                                  | None    |
| `stages.initramfs`                      | The `initramfs` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md).                             | None    |
| `stages.rootfs`                         | The `rootfs` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                                 | None    |
| `stages.boot`                           | The `boot` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                                   | None    |
| `stages.fs`                             | The `fs` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                                     | None    |
| `stages.network`                        | The `network` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                                | None    |
| `stages.reconcile`                      | The `reconcile` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                              | None    |
| `stages.after-install`                  | The `after-install` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                          | None    |
| `stages.after-install-chroot`           | The `after-install-chroot` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                   | None    |
| `stages.after-reset`                    | The `after-reset` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                            | None    |
| `stages.after-reset-chroot`             | The `after-reset-chroot` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                     | None    |
| `stages.before-install`                 | The `before-install` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                         | None    |
| `stages.before-upgrade`                 | The `before-upgrade` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                         | None    |
| `stages.before-reset`                   | The `before-reset` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                           | None    |
