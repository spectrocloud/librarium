---
sidebar_label: "EC"
title: "EC"
description: "Reference resource for the EC command."
hide_table_of_contents: false
sidebar_position: 10
tags: ["palette-cli"]
---

The `ec` command installs a self-hosted Palette Enterprise Cluster (EC) in your target environment. The installation is
conducted through an interactive wizard that guides you through the various install configurations available. A local
kind cluster is created to facilitate creating the Enterprise cluster in the target environment. You do not need to
install kind or any other dependencies. The CLI includes all the required dependencies to set up the kind cluster. You
can use the `ec` command to install a
[self-hosted Palette](../../../enterprise-version/install-palette/install-palette.md) instance or a self-hosted
[VerteX](../../../vertex/install-palette-vertex/install-palette-vertex.md) instance.

The `ec` command exposes the following subcommand.

<br />

- `install` - Install a Palette Enterprise Cluster through an interactive wizard. A container runtime is required to
  install an EC cluster.

## Prerequisites

- Docker is required to install a PCG cluster. Refer to the [Docker](https://docs.docker.com/get-docker/) documentation
  to learn how to install Docker on your system.

## Install

The `install` subcommand installs a Palette Enterprise Cluster in your target environment. You can install Palette or
Palette VerteX using the `install` subcommand. The `install` subcommand can be used in interactive mode, which prompts
you for required values. Alternatively, you can use flags to generate a configuration file.

<br />

| Short Flag | Long Flag              | Description                                                                                                                                                                                                                    | Type    |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `-f`       | `--config-file`        | Install using a configuration file (optional). Use `-config-only` to generate a configuration file.                                                                                                                            | string  |
| `-o`       | `--config-only`        | Generate configuration file only. This command will not proceed with installation.                                                                                                                                             | boolean |
| `-v`       | `--custom-values-file` | Enterprise Cluster custom `values.yaml` configuration file (optional). Use this to customize the cluster profile of the Enterprise Cluster. Refer to the [custom value file](#custom-value-file) section for more information. | string  |
| `-p`       | `--update-passwords`   | Update passwords only. Do not proceed with installation. The `--config-file` flag must also be provided.                                                                                                                       | string  |

### Examples

Install an Enterprise Cluster in interactive mode.

<br />

```shell
palette ec install
```

<br />

Create a configuration file for the Enterprise Cluster installation.

<br />

```shell
palette ec install --config-only
```

<br />

Install an Enterprise Cluster using a configuration file. The configuration file is generated using the `--config-only`
flag.

<br />

```shell hideCliboard
palette ec install --config-file ~/.palette/ec/ec-20230807143205/ec.yaml
```

<br />

Update the passwords of an Enterprise Cluster using a configuration file. The configuration file is generated using the
`--config-only` flag.

<br />

```shell hideCliboard
palette ec install --config-file ~/.palette/ec/ec-20230807143205/ec.yaml --update-passwords
```

## Custom Value File

You can customize the [Cluster Profile](../../../glossary-all.md#cluster-profile) that makes up the Enterprise Cluster
by providing a custom **values.yaml** file that contains values for the various Cluster Profile layers that make up the
Enterprise Cluster. The custom **values.yaml** file is used to customize the Enterprise Cluster to your specific needs.
This is an advanced feature and should only be used by advanced users or when explicitly instructed by our support team.

The **values.yaml** file is made up of the following components:

<br />

- `os` The operating system layer of the Enterprise Cluster. This layer contains the values for the operating system
  that will be used to install the Enterprise Cluster.

- `k8s` The Kubernetes layer of the Enterprise Cluster. This layer contains the configuration values for the Kubernetes
  cluster that is created as part of the Enterprise Cluster installation.

- `csi` The Container Storage Interface (CSI) layer of the Enterprise Cluster. This layer contains the configuration
  values for the CSI driver that is used to provide persistent storage to the Enterprise Cluster.

- `cni` The Container Network Interface (CNI) layer of the Enterprise Cluster. This layer contains the configuration
  values for the CNI driver that is used to provide networking to the Enterprise Cluster.

- `mgmt` The management layer of the Enterprise Cluster. This layer contains the configuration values for the internal
  management components of the Enterprise Cluster.

  You can provide one or more layers in the **values.yaml** file. When you provide a layer configuration, the new
  configuration will be used instead of the default configuration. For example, if you provide a custom **values.yaml**
  file that contains the `os` layer, it will replace the default operating system configuration. The Enterprise Cluster
  profile as follows The **values.yaml** must use the following format:

<br />

```yaml hideClipboard
os: |-
  # ... values.yaml for OS layer go here.
k8s: |-
  # ... values.yaml for K8s layer go here.
csi: |-
  # ... values.yaml for CSI layer go here.
cni: |-
  # ... values.yaml for CNI layer go here.
mgmt: |-
  # ... values.yaml for spectro-mgmt layer go here.
```

The following example shows a custom **values.yaml** file that contains the `os` layer. The `os` layer contains the
configuration for the operating system that will be used to install the Enterprise Cluster.

<br />

```yaml hideClipboard
os: |-
kubeadmconfig:
  preKubeadmCommands:
    - echo "Executing pre kube admin config commands"
    - update-ca-certificates
    - "systemctl restart containerd; sleep 3"
    - 'while [ ! -S /var/run/containerd/containerd.sock ]; do echo "Waiting for containerd..."; sleep 1; done'
  postKubeadmCommands:
    - echo "Executing post kube admin config commands"
  files:
    - targetPath: /usr/local/share/ca-certificates/mycom.crt
      targetOwner: "root:root"
      targetPermissions: "0644"
      content: |
        -----BEGIN CERTIFICATE-----
        MIICyzCCAbOgAwIBAgIBADANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwprdWJl
        cm5ldGVzMB4XDTIwMDkyMjIzNDMyM1oXDTMwMDkyMDIzNDgyM1owFTETMBEGA1UE
        AxMKa3ViZXJuZXRlczCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMdA
        nZYs1el/6f9PgV/aO9mzy7MvqaZoFnqO7Qi4LZfYzixLYmMUzi+h8/RLPFIoYLiz
        qiDn+P8c9I1uxB6UqGrBt7dkXfjrUZPs0JXEOX9U/6GFXL5C+n3AUlAxNCS5jobN
        fbLt7DH3WoT6tLcQefTta2K+9S7zJKcIgLmBlPNDijwcQsbenSwDSlSLkGz8v6N2
        7SEYNCV542lbYwn42kbcEq2pzzAaCqa5uEPsR9y+uzUiJpv5tDHUdjbFT8tme3vL
        9EdCPODkqtMJtCvz0hqd5SxkfeC2L+ypaiHIxbwbWe7GtliROvz9bClIeGY7gFBK
        jZqpLdbBVjo0NZBTJFUCAwEAAaMmMCQwDgYDVR0PAQH/BAQDAgKkMBIGA1UdEwEB
        /wQIMAYBAf8CAQAwDQYJKoZIhvcNAQELBQADggEBADIKoE0P+aVJGV9LWGLiOhki
        HFv/vPPAQ2MPk02rLjWzCaNrXD7aPPgT/1uDMYMHD36u8rYyf4qPtB8S5REWBM/Y
        g8uhnpa/tGsaqO8LOFj6zsInKrsXSbE6YMY6+A8qvv5lPWpJfrcCVEo2zOj7WGoJ
        ixi4B3fFNI+wih8/+p4xW+n3fvgqVYHJ3zo8aRLXbXwztp00lXurXUyR8EZxyR+6
        b+IDLmHPEGsY9KOZ9VLLPcPhx5FR9njFyXvDKmjUMJJgUpRkmsuU1mCFC+OHhj56
        IkLaSJf6z/p2a3YjTxvHNCqFMLbJ2FvJwYCRzsoT2wm2oulnUAMWPI10vdVM+Nc=
        -----END CERTIFICATE-----
```
