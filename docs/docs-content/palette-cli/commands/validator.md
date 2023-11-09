---
sidebar_label: "Validator"
title: "Validator"
description: "Reference resource for the validator command."
hide_table_of_contents: false
sidebar_position: 50
tags: ["palette-cli"]
---


The Palette CLI has built-in support for the open-source [Validator](https://github.com/spectrocloud-labs/validator) framework and its plugins ecosystem. You can use the Validator to verify your environment is ready for an installation of self-hosted Palette, VerteX, or for deployment of Kubernetes clusters through Palette. 



The `validator` command exposes the following subcommands.

- [`install`](#install) - Install the Validator framework and configure Validator plugins.

- [`uninstall`](#uninstall) - Uninstall the Validator framework and remove all sValidator plugins.



## Install

Use the `install` subcommand to install the Validator framework and configure Validator plugins. An interactive wizard will guide you through the installation process. You can also use a configuration file to install the Validator. 


:::info

A [kind](https://kind.sigs.k8s.io/) cluster will be deployed as part of the Validator installation. The name of the kind cluster is `validator-kind-cluster`. You can find the `kind` binary installed in the `$HOME/.palette/bin` directory. 

:::


The `install` subcommand accepts the following flags.

| **Short Flag** | **Long Flag**  | **Description**  | **Type**    |
|-|----------|------------------|-------------|
| `-f` |`--config-file` | Install the Validator using a configuration file (optional). Provide the file path to the configuration file. | string |
| `-o` |`--config-only` | Generate a configuration file without proceeding with an actual installat. Default: false| bool |
| `-h` |`--help`| Help with any command. | - |

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

## Review Validation Results

The Validator will generate a report after the validation process is complete. All validations are stored as a Custom Resourced Definition (CRD) in the `validator` namespace. Each plugin you specified in the installation process will have its own CRD. Additionaly, the Validator will create a CRD containing all the validation results, and the Validator configurations. 

Below is an example output of the CRDs created by the Validator after a successful validation process. Two plugins were used in this example, the `aws` plugin and the `network` plugin


```shell hideClipboard
NAME                                             CREATED AT
awsvalidators.validation.spectrocloud.labs       2023-11-09T21:02:41Z
networkvalidators.validation.spectrocloud.labs   2023-11-09T21:02:45Z
validationresults.validation.spectrocloud.labs   2023-11-09T21:02:12Z
validatorconfigs.validation.spectrocloud.labs    2023-11-09T21:02:12Z
```

You can use the `kubectl` command to view the validation results. To review all the results collectively, use the `describe` command to display the `validationresults` CRD. 

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
### Success

The `State` field in the `Status` section of the `ValidationResult` CRD will indicate if the validation was successful or not. If the validation was successful, the `State` field will be set to `Succeeded`. 

In the example below, the `State` field is set to `Succeeded` for the `validator-plugin-aws-validator-plugin-aws` CRD. This check was successful because the usage for all service quotas is below the specified buffer. The output is truncated for brevity.

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

### Fail

If the validation was not successful, the `State` field will be set to `Failed`. The `Conditions.Failures` section will contain additional information about the failure. In this example, several IAM permissions are missing for the `SpectroCloudRole` IAM role. The output is truncated for brevity.


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

Use the error output to help you address the failure. In this example, the user needs to add the missing IAM permissions to the `SpectroCloudRole` IAM role. Other failures may require you to update your environment to meet the validation requirements.