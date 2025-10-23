---
sidebar_label: "Validator"
title: "Validator"
description: "Reference resource for the validator command."
hide_table_of_contents: false
sidebar_position: 50
tags: ["palette-cli"]
---

The Palette CLI has built-in support for the open source [Validator](https://github.com/validator-labs/validator)
framework and its plugins ecosystem. You can use the Validator to verify your environment is ready for an installation
of self-hosted Palette, VerteX, or for deployment of Kubernetes clusters through Palette.

## Subcommands

The `validator` command exposes the following subcommands.

- [`describe`](#describe) - Describe the Validator results in a Kubernetes cluster.

- [`install`](#install) - Install the Validator framework and configure Validator plugins.

- [`uninstall`](#uninstall) - Uninstall the Validator framework and remove all Validator plugins.

- [`upgrade`](#upgrade) - Upgrade Validator & reconfigure validator plugins.

## Prerequisites

The Validator requires the following dependencies.

- [Docker](https://docs.docker.com/get-docker) - The Validator requires Docker.

:::warning

Credentials and other permissions may be required depending on the Validator plugins you use. For example, the AWS
plugin requires AWS credentials with elevated permissions to validate your AWS environment. Refer to the
[Validator](https://github.com/validator-labs/validator) GitHub repository for more information about the Validator and
its plugins.

:::

## Install

Use the `install` subcommand to install the Validator framework and configure Validator plugins. An interactive wizard
will guide you through the installation process. You can also use a configuration file to install the Validator.

:::info

A [kind](https://kind.sigs.k8s.io/) cluster will be deployed as part of the Validator installation. The name of the kind
cluster is `validator-kind-cluster`. You can find the `kind` binary installed in the `$HOME/.palette/bin` directory. You
can install the Validator into an existing Kubernetes cluster by using the Helm chart. Refer to the
[Validator Helm Install](https://github.com/validator-labs/validator?tab=readme-ov-file#installation) steps for more
information.

:::

The `install` subcommand accepts the following flags.

| **Short Flag** | **Long Flag**   | **Description**                                                                                                                                            | **Type** |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `-f`           | `--config-file` | Install the Validator using a configuration file (optional). Provide the file path to the configuration file.                                              | string   |
| `-o`           | `--config-only` | Generate a configuration file without proceeding with an actual install. Default: false                                                                    | boolean  |
| `-h`           | `--help`        | Help with any command.                                                                                                                                     | -        |
| `-r`           | `--reconfigure` | Reconfigure Validator and plugins prior to installation. The `--config-file` flag must be included. Default: false.                                        | boolean  |
| `-p`           | `--password`    | Update credentials provided in the configuration file. This does not proceed with installation. The `--config-file` flag must be included. Default: false. | boolean  |

### Examples

Below are some examples of using the `install` subcommand and its supported workflows.

Interactive Install

```shell
palette validator install
```

Install using a configuration file

```shell
palette validator install \
--config-file /Users/demo/.palette/validator/validator-20231109135306/validator.yaml
```

Generate a configuration file without proceeding with an actual installation

```shell
palette validator install --config-only
```

Update credentials provided in the configuration file. This does proceed with installation but will prompt for new
credentials.

```shell
palette validator install --password --config-file /Users/demo/.palette/validator/validator-20231109135306/validator.yaml
```

### Configuration Files

After the install wizard completes, the Validator will generate a configuration file. You can use the generated
configuration file to install the Validator using with the same configuration you specified in the wizard. You also need
this configuration file to uninstall the Validator.

Once Validator is installed, the configuration file is located in the `$HOME/.palette/validator` directory and is named
`validator.yaml`.

The install output displays the location of the configuration file. In the example below, the configuration file is
located at `/Users/demo/.palette/validator/validator-20231109135306/validator.yaml`. The output is truncated for
brevity.

```shell hideClipboard {1,11}
validator configuration file saved: /Users/demo/.palette/validator/validator-20231109135306/validator.yaml
Creating cluster "validator-kind-cluster" ...
 ✓ Ensuring node image (kindest/node:v1.24.7) 🖼
 • Preparing nodes 📦   ...
 • Writing configuration 📜  ...
 ✓ Starting control-plane 🕹️
 • Installing CNI 🔌  ...
 ✓ Installing StorageClass 💾
Set kubectl context to "kind-validator-kind-cluster"
You can now use your cluster with:
kubectl cluster-info --context kind-validator-kind-cluster --kubeconfig /Users/demo/.palette/validator/validator-20231109135306/kind-cluster.kubeconfig
```

The kubeconfig file to the kind cluster is also located in the `$HOME/.palette/validator` directory and is named
`kind-cluster.kubeconfig`. Its location is displayed in the install output.

### Review Validation Results

The Validator generates a report after the validation process is complete. All validations are stored as a
[Custom Resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) (CR) in the
`validator` namespace. Each plugin you specified during installation will have its own CR. Additionally, the Validator
creates a CR containing all the validation results and Validator configurations.

:::tip

The kind cluster's kubeconfig file is located in the `$HOME/.palette/validator` directory and is named
`kind-cluster.kubeconfig`. Its location is displayed in the install output. You can use this kubeconfig file to access
the kind cluster and view the CRs.

Example: `/Users/demo/.palette/validator/validator-20231109135306/kind-cluster.kubeconfig`

:::

Below is example output of the CRs the Validator creates after a successful validation process. Two plugins were used in
this example: the `aws` plugin and the `network` plugin.

```shell hideClipboard
NAME                                             CREATED AT
awsvalidators.validation.spectrocloud.labs       2023-11-09T21:02:41Z
networkvalidators.validation.spectrocloud.labs   2023-11-09T21:02:45Z
validationresults.validation.spectrocloud.labs   2023-11-09T21:02:12Z
validatorconfigs.validation.spectrocloud.labs    2023-11-09T21:02:12Z
```

You can use the `kubectl` command to view the validation results. To review all the results collectively, use the
`describe` command to display the `validationresults` CR.

:::tip

Use the `validator describe` command to view the validation results. The `validator describe`command provides a more
user-friendly output of the validation results. Refer to the [Describe](#describe) section for more information.

:::

```shell
kubectl describe validationresults --namespace validator
```

```yaml
Name:         validator-plugin-aws-aws-validator-spectro-cloud-base
Namespace:    validator
Labels:       <none>
Annotations:  <none>
API Version:  validation.spectrocloud.labs/v1alpha1
Kind:         ValidationResult
Metadata:
  Creation Timestamp:  2023-11-09T21:03:14Z
  Generation:          1
  Resource Version:    721
  UID:                 766f0465-8867-48e9-89e5-a6f819795b17
Spec:
  Plugin:  AWS
Status:
  Conditions:
    Failures:
      v1alpha1.IamRoleRule SpectroCloudRole missing action(s): [s3:DeleteObject s3:PutBucketOwnershipControls s3:PutBucketPolicy s3:PutBucketPublicAccessBlock s3:PutObjectAcl s3:PutObject] for resource arn:*:s3:::* from policy Controllers Policy
    Last Validation Time:  2023-11-09T21:03:14Z
    Message:               One or more required IAM permissions was not found, or a condition was not met
    Status:                False
    Validation Rule:       validation-SpectroCloudRole
    Validation Type:       aws-iam-role-policy
  State:                   Failed
Events:                    <none>


Name:         validator-plugin-aws-validator-plugin-aws
Namespace:    validator
Labels:       <none>
Annotations:  <none>
API Version:  validation.spectrocloud.labs/v1alpha1
Kind:         ValidationResult
Metadata:
  Creation Timestamp:  2023-11-09T21:03:12Z
  Generation:          1
  Resource Version:    713
  UID:                 73e2f1c6-feb0-493b-bf8a-161e662e02b5
Spec:
  Plugin:  AWS
Status:
  Conditions:
    Details:
      EC2-VPC Elastic IPs: quota: 10, buffer: 5, max. usage: 0, max. usage entity: us-east-1
    Last Validation Time:  2023-11-09T21:03:12Z
    Message:               Usage for all service quotas is below specified buffer
    Status:                True
    Validation Rule:       validation-ec2
    Validation Type:       aws-service-quota
  State:                   Succeeded
Events:                    <none>


Name:         validator-plugin-aws-validator-plugin-network
Namespace:    validator
Labels:       <none>
Annotations:  <none>
API Version:  validation.spectrocloud.labs/v1alpha1
Kind:         ValidationResult
Metadata:
  Creation Timestamp:  2023-11-09T21:03:12Z
  Generation:          1
  Resource Version:    734
  UID:                 256006fb-5729-4b44-a4e1-58b7d32068b9
Spec:
  Plugin:  Network
Status:
  Conditions:
    Details:
      nc [-w 3 google.com 443] succeeded
    Last Validation Time:  2023-11-09T21:03:17Z
    Status:                True
    Validation Rule:       default
    Validation Type:       network-tcp-conn
  State:                   Failed
Events:                    <none>
```

#### Success

The `State` field in the `Status` section of the `ValidationResult` CR indicates if the validation was successful or
not. If the validation was successful, the `State` field is set to `Succeeded`.

In the example below, the `State` field is set to `Succeeded` for the `validator-plugin-aws-validator-plugin-aws` CR.
This check was successful because the usage for all service quotas is below the specified buffer. The output is
truncated for brevity.

```yaml hideClipboard {12}
Name:         validator-plugin-aws-validator-plugin-aws
...
Status:
  Conditions:
    Details:
      EC2-VPC Elastic IPs: quota: 10, buffer: 5, max. usage: 0, max. usage entity: us-east-1
    Last Validation Time:  2023-11-09T21:03:12Z
    Message:               Usage for all service quotas is below specified buffer
    Status:                True
    Validation Rule:       validation-ec2
    Validation Type:       aws-service-quota
  State:                   Succeeded
```

#### Fail

If the validation is not successful, the `State` field is set to `Failed`. The `Conditions.Failures` section contains
additional information about the failure. In this example, several IAM permissions are missing for the
`SpectroCloudRole` IAM role. The output is truncated for brevity.

```yaml hideClipboard {6,8,12}
Name:         validator-plugin-aws-aws-validator-spectro-cloud-base
...
Status:
  Conditions:
    Failures:
      v1alpha1.IamRoleRule SpectroCloudRole missing action(s): [s3:DeleteObject s3:PutBucketOwnershipControls s3:PutBucketPolicy s3:PutBucketPublicAccessBlock s3:PutObjectAcl s3:PutObject] for resource arn:*:s3:::* from policy Controllers Policy
    Last Validation Time:  2023-11-09T21:03:14Z
    Message:               One or more required IAM permissions was not found, or a condition was not met
    Status:                False
    Validation Rule:       validation-SpectroCloudRole
    Validation Type:       aws-iam-role-policy
  State:                   Failed
```

Use the error output to help you address the failure. In this example, you would need to add the missing IAM permissions
to the `SpectroCloudRole` IAM role. Other failures may require you to update your environment to meet the validation
requirements.

#### Resolve Failures

Each plugin may have its own set of failures. Resolving failures will depend on the plugin and the failure. Use the
error output to help you address the failure. Below are some tips to help you resolve failures.

| **Plugin** | **Failure Scenario**              | **Guidance**                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AWS        | Missing IAM permissions           | The IAM role used by Palette is missing one or more required IAM permissions. Refer to [Required IAM Policies](../../../clusters/public-cloud/aws/required-iam-policies.md) for a comprehensive list of required IAM permissions and attach the missing permissions or policies.                                                                                                                                                                  |
| AWS        | Insufficient Service Quota Buffer | The usage quota for a service or multiple service quotas is above the specified buffer. Refer to AWS [Service Quotas](https://docs.aws.amazon.com/general/latest/gr/aws-service-information.html) documentation to review the default limits. Use the [Service Quotas](https://console.aws.amazon.com/servicequotas/) console to request an increase to your account, or remove resources to reduce the usage.                                    |
| Network    | TCP connection error              | The Validator could not establish a Transmission Control Protocol (TCP) connection to the specified host and port. Ensure the host and port are accessible from the Validator's current network. If the current network is not in scope, ensure you conduct the test from a network in scope. Refer to the [Network Ports](../../../architecture/networking-ports.md) resource for a list of Palette required ports.                              |
| Network    | Unable to connect                 | This could be caused by several issues. If you require network connections to use a proxy server, specify the usage of a network proxy and provide the required proxy server information.                                                                                                                                                                                                                                                         |
| Network    | Unable to resolve DNS             | The Validator was unable to resolve the specified DNS name. Ensure the DNS name is valid and accessible from the Validator's current network default DNS resolver. Use network tools such as `dig` and `nslookup` to debug DNS issues.                                                                                                                                                                                                            |
| Network    | Insufficient IP Addresses         | The Validator was unable to find a sufficient number of IP addresses in the specified IP range. Ensure the IP range is valid and has enough IP addresses to satisfy the Validator's requirements. Discuss these findings with your network administrator.                                                                                                                                                                                         |
| vSphere    | Missing permissions               | The user account used by Palette or VerteX is missing one or more required permissions. Refer to the [self-hosted Palette Required vSphere Permissions](../../../../docs-content/self-hosted-setup/palette/vmware/setup/non-airgap/vmware-system-requirements.md) or [VerteX Required vSphere Permissions](../../../../docs-content/self-hosted-setup/vertex/vmware/setup/non-airgap/vmware-system-requirements.md) guide for more information.   |
| vSphere    | Missing tags                      | Kubernetes regions and zone tags are missing from the vSphere environment. Refer to the [self-hosted Palette Required vSphere Tags](../../../../docs-content/self-hosted-setup/palette/vmware/setup/non-airgap/vmware-system-requirements.md#zone-tagging)or the [VerteX Required vSphere Tags](../../../../docs-content/self-hosted-setup/vertex/vmware/setup/non-airgap/vmware-system-requirements.md#zone-tagging) guide for more information. |
| vSphere    | Folder missing or not accessible  | The `spectro-templates` folder is missing or not accessible. Ensure the folder exists and the user account used by Palette or VerteX has read access to the folder. The `spectro-templates` folder is used by Palette and VerteX to download OVAs during the install.                                                                                                                                                                             |

Every 30 seconds, the Validator will continuously re-issue a validation and update the `ValidationResult` CR with the
result of the validation. The validation results are hashed, and result events are only emitted if the result has
changed. Once you resolve the failure, the Validator will update the `ValidationResult` CR with the new result.

Use the `kubectl describe` command to view the validation results.

:::tip

Use the `validator describe` command to view the validation results. The `validator describe` command provides a more
user-friendly output of the validation results. Refer to the [Describe](#describe) section for more information.

:::

```shell
kubectl describe validationresults --namespace validator
```

## Uninstall

Use the `uninstall` subcommand to uninstall the Validator framework and remove all Validator plugins. To remove the
Validator, you must specify the `--config-file` flag.

The `uninstall` subcommand accepts the following flags.

| **Short Flag** | **Long Flag**      | **Description**                                                                                                  | **Type** |
| -------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- | -------- |
| `-f`           | `--config-file`    | Uninstall the Validator using a configuration file (required). Provide the file path to the configuration file.  | string   |
| `-d`           | `--delete-cluster` | Delete the Validator kind cluster. This does not apply if using a preexisting Kubernetes cluster. Default: true. | bool     |
| `-h`           | `--help`           | Help with any command.                                                                                           | -        |

### Examples

Remove the Validator, its plugins, and the kind cluster.

```shell
palette validator uninstall  \
--config-file /Users/demo/.palette/validator/validator-20231109135306/validator.yaml \
--delete-cluster
```

Remove the Validator, its plugins, but not the kind cluster.

```shell
palette validator uninstall  \
--config-file /Users/demo/.palette/validator/validator-20231109135306/validator.yaml \
--delete-cluster=false
```

## Describe

Use the `describe` subcommand to describe the Validator results in a Kubernetes cluster. The `describe` subcommand
prints out the validation results in a user-friendly format.

The `describe` subcommand accepts the following flags.

| **Short Flag** | **Long Flag**   | **Description**                                                                                                                                                       | **Type** |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `-f`           | `--config-file` | File path to the configuration file. This flag is required. Refer to the [Configuration Files](#configuration-files) section to learn more about configuration files. | string   |
| `-h`           | `--help`        | Help with any command.                                                                                                                                                | -        |

### Examples

The following example uses the `describe` subcommand to display the validation results in a user-friendly format.

```shell hideClipboard
palette validator describe \
 --config-file /Users/demo/.palette/validator/validator-20231109135306/validator.yaml
```

```shell hideClipboard
Using kubeconfig from validator configuration file: /home/ubuntu/.palette/validator/validator-20240311151646/kind-cluster.kubeconfig

=================
Validation Result
=================

Plugin:            AWS
Name:              validator-plugin-aws-validator-plugin-aws-iam-base
Namespace:         validator
State:             Failed
Sink State:        N/A

------------
Rule Results
------------

Validation Rule:        validation-SpectroCloudRole
Validation Type:        aws-iam-role-policy
Status:                 False
Last Validated:         2024-03-11T15:20:58Z
Message:                One or more required SCP permissions was not found, or a condition was not met

--------
Failures
--------
- Action: autoscaling:DescribeAutoScalingGroups is denied due to an Organization level SCP policy for role: SpectroCloudRole
- Action: autoscaling:DescribeInstanceRefreshes is denied due to an Organization level SCP policy for role: SpectroCloudRole
- Action: ec2:AllocateAddress is denied due to an Organization level SCP policy for role: SpectroCloudRole
- Action: ec2:AssociateRouteTable is denied due to an Organization level SCP policy for role: SpectroCloudRole
- Action: ec2:AttachInternetGateway is denied due to an Organization level SCP policy for role: SpectroCloudRol
```

## Upgrade

Use the `upgrade` subcommand to upgrade Validator and reconfigure the Validator plugins. The `upgrade` subcommand
requires the Validator configuration file. Use the `--config-file` flag to specify the configuration file.

The `upgrade` subcommand accepts the following flags.

| **Short Flag** | **Long Flag**   | **Description**                                                                                                                               | **Type** |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `-f`           | `--config-file` | Upgrade using a configuration file. Refer to the [Configuration Files](#configuration-files) section to learn more about configuration files. | string   |
| `-h`           | `--help`        | Help for the upgrade command.                                                                                                                 | -        |

### Examples

In the following example, the Validator version is upgraded. The configuration file located at
`/Users/demo/.palette/validator/validator-20231109135306/validator.yaml` was updated to use Validator version `v0.0.36`
from version `v0.0.30`.

```yaml {5} hideClipboard
helmRelease:
  chart:
    name: validator
    repository: https://validator-labs.github.io/validator
    version: v0.0.36
    insecureSkipVerify: true
  values: ""
helmReleaseSecret:
```

Once the configuration file is updated, use the `upgrade` subcommand to upgrade the Validator.

```shell
palette validator upgrade \
--config-file /Users/demo/.palette/validator/validator-20231109135306/validator.yaml
```

```shell hideClipboard
==== Installing/upgrading validator Helm chart ====
helm upgrade validator validator --repo https://validator-labs.github.io/validator --version v0.0.36 --insecure-skip-tls-verify --kubeconfig /tmp/2773008921 --namespace validator --install --create-namespace --values /tmp/1655869680

==== Kubectl Command ====
/home/ubuntu/.palette/bin/kubectl wait --for=condition=available --timeout=600s deployment/validator-controller-manager -n validator --kubeconfig=/home/ubuntu/.palette/validator/validator-20240311153652/kind-cluster.kubeconfig
deployment.apps/validator-controller-manager condition met
Pausing for 20s for validator to establish a lease & begin plugin installation

==== Kubectl Command ====
/home/ubuntu/.palette/bin/kubectl wait --for=condition=available --timeout=600s deployment/validator-plugin-aws-controller-manager -n validator --kubeconfig=/home/ubuntu/.palette/validator/validator-20240311153652/kind-cluster.kubeconfig
deployment.apps/validator-plugin-aws-controller-manager condition met

validator and validator plugin(s) installed successfully

==== Applying AWS plugin validator(s) ====

==== Kubectl Command ====
/home/ubuntu/.palette/bin/kubectl apply -f /home/ubuntu/.palette/validator/validator-20240311154338/manifests/rules.yaml --kubeconfig=/home/ubuntu/.palette/validator/validator-20240311153652/kind-cluster.kubeconfig
awsvalidator.validation.spectrocloud.labs/rules unchanged

==== Kubectl Command ====
/home/ubuntu/.palette/bin/kubectl apply -f /home/ubuntu/.palette/validator/validator-20240311154338/manifests/awsvalidator-iam-role-spectro-cloud-base.yaml --kubeconfig=/home/ubuntu/.palette/validator/validator-20240311153652/kind-cluster.kubeconfig
awsvalidator.validation.spectrocloud.labs/validator-plugin-aws-iam-base unchanged

Plugins will now execute validation checks.

You can list validation results via the following command:
kubectl -n validator get validationresults --kubeconfig /home/ubuntu/.palette/validator/validator-20240311153652/kind-cluster.kubeconfig

And you can view all validation result details via the following command:
kubectl -n validator describe validationresults --kubeconfig /home/ubuntu/.palette/validator/validator-20240311153652/kind-cluster.kubeconfig
```
