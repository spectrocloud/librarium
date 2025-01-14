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
| `stylus.featureGate`           | This parameter contains a comma-separated list of features you want to enable on your host.                                                                                                                |
| `stylus.includeTui`            | Enable Palette TUI for initial Edge host configuration. Default value is `false`. For more information, refer to [Initial Edge Host Configuration](../site-deployment/site-installation/initial-setup.md). | `false`     |
| `stylus.installationMode`      | Allowed values are `connected` and `airgap`. Default value is `connected`. `connected` means that the Edge host has a connection to Palette; `airgap` means it does not have a connection to Palette.      | `connected` |
| `stylus.localUI.port`          | Specifies the port that Local UI is exposed on.                                                                                                                                                            | 5080        |
| `stylus.site`                  | Review Site Parameters for more information.                                                                                                                                                               |             |
| `stylus.enableMultiNode`       | When set to true, the host is allowed to link with other nodes and form a multi-node cluster. For more information, refer to [Link Hosts](../local-ui//cluster-management/link-hosts.md).                  | `False`     |
| `stylus.externalRegistries`    | Use this parameter to configure multiple external registries and to apply domain re-mapping rules. Review [External Registry Parameters](#multiple-external-registries) for more information.              | None        |
| `stylus.registryCredentials`   | Only used when a single external registry in use and no mapping rules are needed. Review [Single External Registry](#single-external-registry) for more information.                                       | None        |
| `stylus.trace`                 | Enable this parameter to display trace output. Allowed values are `true` or `false`.                                                                                                                       | `False`     |

### Feature Gates

`stylus.featureGate` contains a comma-separated list of features you want to enable on your host. These features are not
enabled by default unless you include the feature in the parameter. The following table displays the available features
you can enable using this parameter.

| Value          | Description                                                                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UserDataForm` | This value enables you to edit the installer user data after installation in Local UI. For more information, refer to [Edit User Data](../local-ui/host-management/edit-user-data.md). |

### Multiple External Registries

You can configure multiple external registries by using the `stylus.externalRegistries` parameter object. You can also
apply domain mapping rules to map domain names to external registries.

If you are using an external registry and want to use content bundles when deploying your Edge cluster, you must also
enable the local Harbor registry. For more information, refer to
[Build Content Bundles](../edgeforge-workflow/palette-canvos/build-content-bundle.md) and
[Enable Local Harbor Registry](../site-deployment/deploy-custom-registries/local-registry.md).

Review the following parameters to configure external registries.

| Parameter                                        | Description                                                                                                                                       | Default |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `stylus.externalRegistries.registries`           | A list of external registries. Refer to [Registry Parameters](#registry-parameters) for more details.                                             | None    |
| `stylus.externalRegistries.registryMappingRules` | A list of key-pair rules to map domain names to external registries. Refer to [Registry Mapping Rules](#registry-mapping-rules) for more details. | None    |

#### Registry Parameters

The `stylus.externalRegistries.registries` block accepts the following parameters.

| Parameter         | Description                                                         | Default |
| ----------------- | ------------------------------------------------------------------- | ------- |
| `domain`          | The domain of the registry.                                         | None    |
| `username`        | The username to authenticate with the registry.                     | None    |
| `password`        | The password to authenticate with the registry.                     | None    |
| `repositoryName`  | The name of the repository within the registry.                     | None    |
| `certificates`    | A list of certificates in PEM format to use to access the registry. | None    |
| `insecure`        | Whether to allow insecure connections to the registry.              | `False` |
| `encodedPassword` | Whether the password is base64 encoded.                             | `False` |

Below is an example of how to configure an external registry.

```yaml
stylus:
  externalRegistries:
    registries:
      - domain: "example.registry.com/internal-images"
        username: "admin"
        password: "***************"
        repositoryName: example-repository-private
        certificates:
          - |
            -----BEGIN CERTIFICATE-----
            MIIENDCCAxygAwIBAgIUSdnFq4anqjgKf2iRX2RP65LYpkwwDQYJKoZIhvcNAQEL
            BQAwfzEpMCcGA1UEAwwgc2hydXRoaS1haXJnYXAyLnNwZWN0cm9jbG91ZC5kZXYx
            FTATBgNVBAoMDFNwZWN0cm9DbG91ZDELMAkGA1UECwwCSVQxFDASBgNVBAcMC1Nh
            bnRhIENsYXJhMQswCQYDVQQIDAJDQTELMAkGA1UEBhMCVVMwHhcNMjQwMTExMDkz
            ODUzWhcNMzQwMTA4MDkzODUzWjB/MSkwJwYDVQQDDCBzaHJ1dGhpLWFpcmdhcDIu
            c3BlY3Ryb2Nsb3VkLmRldjEVMBMGA1UECgwMU3BlY3Ryb0Nsb3VkMQswCQYDVQQL
            DAJJVDEUMBIGA1UEBwwLU2FudGEgQ2xhcmExCzAJBgNVBAgMAkNBMQswCQYDVQQG
            EwJVUzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANcPucLatrCHmR+o
            h6pIReisVxbJI0jqlVfive+mDp64Z3aXbzlX634chbyjd6G8xmZXH0beIZE91yGD
            42atamrqDSADcZRvjUmqGzf/nrm3sOCHOKNMvMFZJ0uGFjwuwxIDf91+Vgj0FZRe
            j+nVRI3XQyAdJXP6sls8vu8bHk6RDMLYb+IzMWzFuPGDUv3fU41a3dijVfMxt6hj
            MdoUe6wzTr46ylUgm5rB/SKrMcg41ZNFcqYLhHt6KsS/0G8hjrvo7d+BeNcxf6GP
            xOWyimdq18suHqFQ82ieCxB8gR2Ig15ch8UG1p95JbVMjzLTi3tgU9EARuftsUK9
            spdn2cUCAwEAAaOBpzCBpDAdBgNVHQ4EFgQUDVk6cnlax94aPm3F+fubzHj8vaIw
            HwYDVR0jBBgwFoAUDVk6cnlax94aPm3F+fubzHj8vaIwDwYDVR0TAQH/BAUwAwEB
            /zA8BgNVHREENTAzgglsb2NhbGhvc3SHBH8AAAGCIHNocnV0aGktYWlyZ2FwMi5z
            cGVjdHJvY2xvdWQuZGV2MBMGA1UdJQQMMAoGCCsGAQUFBwMBMA0GCSqGSIb3DQEB
            CwUAA4IBAQATfu3drGJkmFD58KvUKuOhAY28TpVquH63W40JchVjhtOmg+WHfPIE
            8dvYYKiZtrpFZDUcAVtn/KJIZoNbq51o7mWj/rl6W5pcajBLoqcvlDH0zXzVgF+f
            +gj68SMegHwp+EO/dK9LfLp2bxNuBPCnvLj3eMs0HCdmZW1uzVm71YIXTSXwgm/2
            nMnI5ELi2kuufCZh5wQxr7km+qZgTteaZI2h+YNU88m/SreRFHfBP8QRfkqTumfW
            Sz3rWOQ93KXO/CEk+XySnVFgS+JdGtpmRalOfGeJ0Kk8hraX3h/2KkD0Vd99DIMN
            DlN636dYFSJBG3LjGuzyO66kEvbGJAIT
            -----END CERTIFICATE-----
    registryMappingRules:
      "us-east1-docker.pkg.dev/spectro-images/daily": "example.registry.com/internal-images"
      "us-docker.pkg.dev/palette-images": "example.registry.com/internal-images"
      "grc.io/spectro-dev-public": "example.registry.com/internal-images"
      "grc.io/spectro-images-public": "example.registry.com/internal-images"
```

#### Registry Mapping Rules

Use registry mapping rules to map a domain name to an external registry. The `registryMappingRules` parameter accepts a
list of key-value pairs where the key is the domain name and the value is URL mapping to the external registry.

Below is an example of registry mapping rules. The registry in the code snippet, `example.registry.com/internal-images`
is assumed to contain the images that are mapped from the external registries.

```yaml
stylus:
  externalRegistries:
    registries:
      - domain: "example.registry.com/internal-images"
        repositoryName: "primary-registry"
        username: "admin"
        password: "***************"
    registryMappingRules:
      "us-east1-docker.pkg.dev/spectro-images/daily": "example.registry.com/internal-images"
      "us-docker.pkg.dev/palette-images": "example.registry.com/internal-images"
      "grc.io/spectro-dev-public": "example.registry.com/internal-images"
      "grc.io/spectro-images-public": "example.registry.com/internal-images"
```

##### Airgap Environment

In an airgap environment, use the `registryMappingRules` parameter to map domain names to external registries that were
downloaded when creating the [content bundle](../edgeforge-workflow/palette-canvos/build-content-bundle.md).

:::info

<!-- prettier-ignore -->
Palette will automatically update the image path when <VersionedLink text="Harbor Edge-Native Config" url="/integrations/packs/?pack=harbor-edge-native-config" />  pack is enabled. For example, if you have a registry mapping rule such as the following.

```yaml
"us-east1-docker.pkg.dev/spectro-images/daily": "example.registry.com/internal-images"
```

Then the image tag will be updated with the prefix URL to the Harbor registry, such as
`https://10.10.100.45:30003/example.registry.com/internal-images`. Palette will do this for all registry mapping rules
specified in the user data. This allows the Edge host to find and pull images that came from an external registry
through the local Harbor registry.

:::

```yaml
stylus:
  installationMode: airgap
  externalRegistries:
    registryMappingRules:
      "us-east1-docker.pkg.dev/spectro-images/daily": "example.registry.com/internal-images"
      "us-docker.pkg.dev/palette-images": "example.registry.com/internal-images"
      "grc.io/spectro-dev-public": "example.registry.com/internal-images"
      "grc.io/spectro-images-public": "example.registry.com/internal-images"
```

### Single External Registry

You can point the Edge Installer to a non-default registry to load content from another source. Use the
`registryCredentials` parameter object to specify the registry configurations. If you have multiple external registries,
use the `stylus.externalRegistries` parameter object instead. Refer to the
[Multiple External Registries](#multiple-external-registries) section for more information.

If you are using an external registry and want to use content bundles when deploying your Edge cluster, you must also
enable the local Harbor registry. For more information, refer to
[Build Content Bundles](../edgeforge-workflow/palette-canvos/build-content-bundle.md) and
[Enable Local Harbor Registry](../site-deployment/deploy-custom-registries/local-registry.md).

| Parameter                                    | Description                                                                                                                                                                                                                                                                                                   | Default |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `stylus.registryCredentials.domain`          | The domain of the registry. You can use an IP address plus the port or a domain name.                                                                                                                                                                                                                         |         |
| `stylus.registryCredentials.encodedPassword` | Specifies whether the password as given is base64 encoded.`true` means that the provided password is base64 encoded and that when using the password to authenticate, the password must be decoded first. `false` means the password is not encoded and must be used as is to authenticate with the registry. | `False` |
| `stylus.registryCredentials.insecure`        | Whether to allow insecure connections to the registry.                                                                                                                                                                                                                                                        | `False` |
| `stylus.registryCredentials.password`        | The password to authenticate with the registry.                                                                                                                                                                                                                                                               |         |

```yaml
#cloud-config
stylus:
  registryCredentials:
    domain: 10.10.254.254:8000/spectro-images
    username: ubuntu
    password: <yourPassword>
    insecure: true
```

### Site Parameters

The `stylus.site` blocks accept the following parameters.

| Parameter                        | Description                                                                                                                                                                                                                                                  | Default |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `stylus.site.caCerts`            | The Secure Sockets Layer (SSL) Certificate Authority (CA) certificates. The certificates must be base64-encoded.                                                                                                                                             |         |
| `stylus.site.clusterId`          | The ID of the host cluster the edge host belongs to.                                                                                                                                                                                                         |         |
| `stylus.site.clusterName`        | The name of the host cluster the edge host belongs to.                                                                                                                                                                                                       |         |
| `stylus.site.deviceUIDPaths`     | Specify the file path for reading in product or board serial that can be used to set the device ID. The default file path is **/sys/class/dmi/id/product_uuid**. Refer to the [Device ID (UID) Parameters](#device-id-uid-parameters) section to learn more. |         |
| `stylus.site.edgeHostToken`      | A token created at the tenant scope that is required for auto registration.                                                                                                                                                                                  |         |
| `stylus.site.insecureSkipVerify` | This controls whether or not a client verifies the server's certificate chain and hostname.                                                                                                                                                                  |         |
| `stylus.site.name`               | Fully qualified domain name of the Edge host.                                                                                                                                                                                                                |         |
| `stylus.site.network`            | The network configuration settings. Review the [Site Network Parameters](#site-network-parameters) below for more details.                                                                                                                                   |         |
| `stylus.site.paletteEndpoint`    | The URL endpoint that points to Palette. Example: `api.spectrocloud.com`                                                                                                                                                                                     |         |
| `stylus.site.prefix`             | A prefix prepended to the Edge device hostname to form the Edge device ID. Only alphanumeric characters and the hyphen-minus character are allowed. By default, this value is set to `edge`.                                                                 |         |
| `stylus.site.projectName`        | The name of the project.                                                                                                                                                                                                                                     |         |
| `stylus.site.projectUid`         | The ID of the project the Edge host will belong to.                                                                                                                                                                                                          |         |
| `stylus.site.registrationURL`    | The URL that operators use to register the Edge host with Palette.                                                                                                                                                                                           |         |
| `stylus.site.tags`               | A parameter object you use to provide optional key-value pairs. Refer to the [Tags](#tags) section to learn more.                                                                                                                                            |         |
| `stylus.site.tagsFromFile`       | Specify tags from a file. Refer to the [Tags](#tags) section to learn more.                                                                                                                                                                                  |         |
| `stylus.site.tagsFromScript`     | Use a script to generate the tags. Refer to the [Tags](#tags) section to learn more.                                                                                                                                                                         |         |

:::info

If you do not specify a hostname for the Edge host with `stylus.site.name` , the system will generate one from the
serial number of the device. If the Edge Installer cannot identify the serial number, it will generate a random ID
instead. In cases where the hardware does not have a serial number, we suggest that you specify a value so there is
minimal chance of duplication. Use the value `"$random"` to generate a random ID. You can also use the `DeviceUIDPaths`
to read in a value from a system file.

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

#### Tags

You can specify tags from a file by using the `tagsFromFile` parameter object or from a script by using the
`tagsFromScript` parameter.

| Parameter                              | Description                                            | Default Value |
| -------------------------------------- | ------------------------------------------------------ | ------------- |
| `stylus.site.tagFromFile.fileName`     | The path to the file containing the tags.              | `''`          |
| `stylus.site.tagFromFile.delimiter`    | The delimiter used to separate the key-value pairs.    | `\n`          |
| `stylus.site.tagFromFile.separator`    | The separator used to separate the key from the value. | `:`           |
| `stylus.site.tagFromScript.scriptName` | The path to the script that returns a JSON object.     | `''`          |
| `stylus.site.tagFromScript.timeout`    | The timeout value in seconds.                          | `60`          |

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

You can specify tags from a script by using the `tagsFromScript` parameter object. The script must be executable and
return a JSON object that contains the tags in the following format.

```json hideClipboard
{
  "key": "value"
}
```

For example, if you have a Python script that returns the following JSON output:

```json
{
  "department": "sales",
  "owner": "p78125d"
}
```

You can configure `stylus.site.tagsFromScript` to point to the script, and it will add the tags `owner:p78125d` and
`department: sales` to the Edge host.

### Site Registry Parameters

Palette uses a webhook to redirect image pulls when you have specified an external registry or use a local Harbor
registry. If you find this redirect behavior to be limiting, you can disable the webhook. For more information, refer to
[Disable Webhook to Customize Image Pull Behavior](../site-deployment/deploy-custom-registries/webhook-disable.md).

| Parameter                            | Description                                            | Default |
| ------------------------------------ | ------------------------------------------------------ | ------- |
| `stylus.imageRedirectWebhook.enable` | Whether to enable the webhook to redirect image pulls. | `True`  |

## Install Parameters

The `install` block allows you to configure the installer to make bind mounts and disk partitions on the Edge host. In
addition, you can specify post-installation behavior, such as instructing the Edge host to power off automatically after
installation is complete.

| Parameter                                      | Description                                                                                                                                                      | Default |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `install.bind_mounts`                          | The list of folders to bind mount from the installer to the Edge host                                                                                            | None    |
| `install.grub_options.extra_cmdline`           | Kernel command-line parameters to add to the installer.                                                                                                          | None    |
| `install.partitions.persistent`                | A persistent partition object. Providing this parameter creates an extra persistent partition on the Edge host. Accepts two parameters as follows in this table. | None    |
| `install.partitions.persistent.size`           | The size of the persistent partition                                                                                                                             | None    |
| `install.partitions.persistent.fs`             | The type of the file system for the persistent partition                                                                                                         | None    |
| `install.partitions.extra-partitions`          | The list of extra partitions to create. Each list item accepts parameters as follows in this table.                                                              | None    |
| `install.partitions.extra-partitions[*].name`  | The name of the extra partition                                                                                                                                  | None    |
| `install.partitions.extra-partitions[*].size`  | The size of the extra partition                                                                                                                                  | None    |
| `install.partitions.extra-partitions[*].fs`    | The file system of the extra partition                                                                                                                           | None    |
| `install.partitions.extra-partitions[*].label` | The label of the extra partition                                                                                                                                 | None    |
| `install.poweroff`                             | Whether to power off the Edge host after installation is complete.                                                                                               | `False` |
| `install.reboot`                               | Whether to reboot the Edge host after installation is complete                                                                                                   | `False` |

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

| Parameter                     | Description                                                                                                                                           | Default |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `stages.*.users`              | The list of users to create at any cloud-init stage. Replace `*` with the specific stage. Each list item accepts parameters as follows in this table. | None    |
| `stages.*.users[*].groups`    | The list of groups that the user belongs to. Replace `*` with your username.                                                                          | None    |
| `stages.*.users[*].passwd`    | The password of the user. Replace `*` with your username.                                                                                             | None    |
| `stages.initramfs`            | The `initramfs` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md).                             | None    |
| `stages.rootfs`               | The `rootfs` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                                 | None    |
| `stages.boot`                 | The `boot` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                                   | None    |
| `stages.fs`                   | The `fs` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                                     | None    |
| `stages.network`              | The `network` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                                | None    |
| `stages.reconcile`            | The `reconcile` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                              | None    |
| `stages.after-install`        | The `after-install` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                          | None    |
| `stages.after-install-chroot` | The `after-install-chroot` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                   | None    |
| `stages.after-reset`          | The `after-reset` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                            | None    |
| `stages.after-reset-chroot`   | The `after-reset-chroot` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                     | None    |
| `stages.before-install`       | The `before-install` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                         | None    |
| `stages.before-upgrade`       | The `before-upgrade` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                         | None    |
| `stages.before-reset`         | The `before-reset` stage during Edge host installation. For more information, refer to [Cloud Init Stages](./cloud-init.md)                           | None    |
