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
can use the `ec` command to install [self-hosted Palette](../../../self-hosted-setup/palette/palette.md) or
[Palette VerteX](../../../self-hosted-setup/vertex/vertex.md).

## Subcommands

The `ec` command exposes the following subcommand.

- `install` - Install a Palette Enterprise Cluster through an interactive wizard. A container runtime is required to
  install an EC cluster.

## Limitations

- <PartialsComponent category="palette-cli" name="credentials-breaking-change" />

## Prerequisites

- Docker is required to install a PCG cluster. Refer to the [Docker](https://docs.docker.com/get-docker/) documentation
  to learn how to install Docker on your system.

- You must provide an encryption passphrase to secure sensitive data. The passphrase must be between 8 to 32 characters
  long and contain a capital letter, a lowercase letter, a digit, and a special character. You can provide the
  passphrase through the `PALETTE_ENCRYPTION_PASSWORD` environment variable or the `-k` or `--encryption-passphrase`
  flag. Refer to the [Encryption](./../palette-cli.md#encryption) section for more information on encryption.

## Install

The `install` subcommand installs a Palette Enterprise Cluster in your target environment. You can install Palette or
Palette VerteX using the `install` subcommand. The `install` subcommand can be used in interactive mode, which prompts
you for required values. Alternatively, you can use flags to generate a configuration file.

| Short Flag | Long Flag                 | Description                                                                                                                                                                                                                                                                                                                                                                 | Type    |
| ---------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `-f`       | `--config-file`           | Install using a configuration file (optional). Use `-config-only` to generate a configuration file.                                                                                                                                                                                                                                                                         | string  |
| `-d`       | `--skip-teardown`         | Skip the teardown of the kind cluster in case of errors.                                                                                                                                                                                                                                                                                                                    | boolean |
| `-k`       | `--encryption-passphrase` | Encryption passphrase to secure sensitive data. The passphrase must be between 8 to 32 characters long and contain a capital letter, a lowercase letter, a digit, and a special character. Can be set through the environment variable `PALETTE_ENCRYPTION_PASSWORD`. Refer to the [Encryption](./../palette-cli.md#encryption) section for more information on encryption. | string  |
| `-o`       | `--config-only`           | Generate configuration file only. This command will not proceed with installation.                                                                                                                                                                                                                                                                                          | boolean |
| `-v`       | `--custom-values-file`    | Enterprise cluster custom values.yaml configuration file (optional). Use this to customize the cluster profile of the enterprise cluster. Refer to the [custom value file](#custom-value-file) section for more information.                                                                                                                                                | string  |
| -          | `--ubuntu-pro-token`      | The Canonical subscription token for [Ubuntu Pro](https://ubuntu.com/pro). An Ubuntu Pro subscription is required, and Ubuntu Pro must be enabled.                                                                                                                                                                                                                          | string  |
| `-p`       | `--update-passwords`      | Update passwords only. Do not proceed with installation. The `--config-file` flag must also be provided.                                                                                                                                                                                                                                                                    | string  |
| `-t`       | `--update-tokens`         | Update authentication tokens only. Do not proceed with installation. The `--config-file` flag must be provided.                                                                                                                                                                                                                                                             | boolean |
| -          | `--validate`              | Scan the environment and conduct validation before the enterprise cluster is installed.                                                                                                                                                                                                                                                                                     | boolean |

### Examples

Install an Enterprise Cluster in interactive mode.

```shell
palette ec install
```

Create a configuration file for the Enterprise Cluster installation.

```shell
palette ec install --config-only
```

Install an Enterprise Cluster using a configuration file. The configuration file is generated using the `--config-only`
flag.

```shell hideCliboard
palette ec install --config-file ~/.palette/ec/ec-20230807143205/ec.yaml
```

Update the passwords of an Enterprise Cluster using a configuration file. The configuration file is generated using the
`--config-only` flag.

```shell hideCliboard
palette ec install --config-file ~/.palette/ec/ec-20230807143205/ec.yaml --update-passwords
```

Install an Enterprise Cluster and validate the environment before installation. Check out the
[Validate Environment](#validate-environment) section for more information.

```shell
palette ec install --validate
```

## Custom Value File

You can customize the [Cluster Profile](../../../glossary-all.md#cluster-profile) that makes up the Enterprise Cluster
by providing a custom **values.yaml** file that contains values for the various Cluster Profile layers that make up the
Enterprise Cluster. The custom **values.yaml** file is used to customize the Enterprise Cluster to your specific needs.
This is an advanced feature and should only be used by advanced users or when explicitly instructed by our support team.

The **values.yaml** file is made up of the following components:

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

## Validate Environment

You can use the `--validate` flag to scan the environment and conduct validation before the Enterprise Cluster is
installed. The validation uses the open source project [Validator](https://github.com/validator-labs/validator) to check
for the following prerequisites:

- The required vSphere permissions and privileges are available for the provided user.
- At least five IP addresses are available in the provided IP range.
- Ensure vSphere tags for Kubernetes regions and zones are available.
- The provided vSphere data center is accessible and has the required compute resources available.

When you use the `--validate` flag, the standard installation wizard will proceed unless the `--config-file` flag is
provided. Once all user inputs are provided, the validation will begin. A kind cluster will be created that contains the
necessary components to conduct the validation checks. The Validator plugins will trigger the validation checks. The
validation results will be displayed in the terminal. Below is an example of the validation results.

```shell hideCliboard
Plugins will now execute validation checks.

You can list validation results via the following command:
kubectl -n validator get validationresults --kubeconfig /home/ubuntu/.palette/ec/ec-20240627215351/kind-cluster.kubeconfig

And you can view all validation result details via the following command:
kubectl -n validator describe validationresults --kubeconfig /home/ubuntu/.palette/ec/ec-20240627215351/kind-cluster.kubeconfig

Watching validation results, waiting for all to succeed
Using kubeconfig from validator configuration file: /home/ubuntu/.palette/ec/ec-20240627215351/kind-cluster.kubeconfig

Validation result for validator-plugin-vsphere-rules updated:

=================
Validation Result
=================

Plugin:           vSphere
Name:             validator-plugin-vsphere-rules
Namespace:        validator
State:            Succeeded

------------
Rule Results
------------

Validation Rule:        validation-folder-/Datacenter/vm/spectro-templates
Validation Type:        vsphere-entity-privileges
Status:                 True
Last Validated:         2024-06-27T21:57:04Z
Message:                All required vsphere-entity-privileges permissions were found for account: demo@vsphere.local

Validation Rule:        validation-demo@vsphere.local
Validation Type:        vsphere-role-privileges
Status:                 True
Last Validated:         2024-06-27T21:57:04Z
Message:                All required vsphere-role-privileges permissions were found

Validation Rule:        validation-tag-cluster-k8s-zone
Validation Type:        vsphere-tags
Status:                 True
Last Validated:         2024-06-27T21:57:04Z
Message:                Required entity tags were found

Validation Rule:        validation-tag-datacenter-k8s-region
Validation Type:        vsphere-tags
Status:                 True
Last Validated:         2024-06-27T21:57:04Z
Message:                Required entity tags were found

Validation Rule:        validation-cluster-Cluster2
Validation Type:        vsphere-compute-resources
Status:                 True
Last Validated:         2024-06-27T21:57:04Z
Message:                All required compute resources were satisfied

Watching for updates to validation results for [validator-plugin-network-rules]...

Validation result for validator-plugin-network-rules updated:

=================
Validation Result
=================

Plugin:           Network
Name:             validator-plugin-network-rules
Namespace:        validator
State:            Succeeded

------------
Rule Results
------------

Validation Rule:        IP range rule 1, start IP 10.10.189.10 with length 5
Validation Type:        network-ip-range
Status:                 True
Last Validated:         2024-06-27T21:57:04Z
Message:                All network-ip-range checks passed

-------
Details
-------
- Ensuring that 10.10.189.10 and 5 subsequent IPs are all unallocated
- ping [-c 3 -W 3 10.10.189.10] failed; err: exit status 1, stderr:
- ping [-c 3 -W 3 10.10.189.11] failed; err: exit status 1, stderr:
- ping [-c 3 -W 3 10.10.189.12] failed; err: exit status 1, stderr:
- ping [-c 3 -W 3 10.10.189.13] failed; err: exit status 1, stderr:
- ping [-c 3 -W 3 10.10.189.14] failed; err: exit status 1, stderr:

Validation Rule:        VSphere TCP Connection
Validation Type:        network-tcp-conn
Status:                 True
Last Validated:         2024-06-27T21:57:19Z
Message:

-------
Details
-------
- Ensuring that TCP connection(s) can be established to vcenter.spectrocloud.dev on port(s) [443]
- nc [-w 3 vcenter.spectrocloud.dev 443] succeeded

All validations have completed.
```

After the validation checks are complete, the kind cluster is removed. If any of the validation checks fail, the
installation will not proceed. The example below displays a failed network validation check.

```shell hideCliboard
Validation result for validator-plugin-network-rules updated:

=================
Validation Result
=================

Plugin:           Network
Name:             validator-plugin-network-rules
Namespace:        validator
State:            Failed

------------
Rule Results
------------

Validation Rule:        IP range rule 1, start IP 10.10.189.1 with length 4
Validation Type:        network-ip-range
Status:                 False
Last Validated:         2024-06-27T22:36:03Z
Message:                IP range check failed: one or more IPs in the provided range was allocated

-------
Details
-------
- Ensuring that 10.10.189.1 and 4 subsequent IPs are all unallocated
- ping [-c 3 -W 3 10.10.189.1] succeeded
- ping [-c 3 -W 3 10.10.189.2] failed; err: exit status 1, stderr:
- ping [-c 3 -W 3 10.10.189.3] failed; err: exit status 1, stderr:
- ping [-c 3 -W 3 10.10.189.4] failed; err: exit status 1, stderr:

--------
Failures
--------
- stdout: PING 10.10.189.1 (10.10.189.1) 56(84) bytes of data.
64 bytes from 10.10.189.1: icmp_seq=1 ttl=63 time=0.338 ms
64 bytes from 10.10.189.1: icmp_seq=2 ttl=63 time=0.065 ms
64 bytes from 10.10.189.1: icmp_seq=3 ttl=63 time=0.145 ms

--- 10.10.189.1 ping statistics ---
3 packets transmitted, 3 received, 0%!p(MISSING)acket loss, time 2052ms
rtt min/avg/max/mdev = 0.065/0.182/0.338/0.114 ms


Validation Rule:        VSphere TCP Connection
Validation Type:        network-tcp-conn
Status:                 True
Last Validated:         2024-06-27T22:36:14Z
Message:

-------
Details
-------
- Ensuring that TCP connection(s) can be established to vcenter.spectrocloud.dev on port(s) [443]
- nc [-w 3 vcenter.spectrocloud.dev 443] succeeded

All validations have completed.

helm delete validator --namespace validator --kubeconfig /tmp/1406656575

Uninstalled validator and validator plugin(s) successfully
Deleting cluster "validator-kind-cluster" ...
Deleted local Kind cluster: validator-kind-cluster
Error: failed to install Enterprise Cluster: environment validation failed
```
