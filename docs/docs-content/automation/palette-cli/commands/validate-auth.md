---
sidebar_label: "Validate-Auth"
title: "Validate-Auth"
description: "Reference resource for the validate-auth command."
hide_table_of_contents: false
sidebar_position: 50
tags: ["palette-cli"]
---

The Palette CLI has built-in support for the open source [Validator](https://github.com/validator-labs/validator)
framework and its plugins ecosystem. You can use the Palette CLI to verify you have the necessary permissions to deploy
Kubernetes clusters in your targeted environment through Palette.

## Limitations

- AWS and Azure are the only supported cloud environments.

## Prerequisites

- If validating permissions for an AWS environment, ensure you have the minimal AWS-managed permission policies required
  to perform the validation. Refer to
  [Minimal AWS managed IAM permission policies by validation type](https://github.com/validator-labs/validator-plugin-aws?tab=readme-ov-file#minimal-aws-managed-iam-permission-policies-by-validation-type)
  for guidance.

  - You will need to provide the following details during the validation steps:

    - Access Key ID for the IAM user that will perform the validation.
    - Secret Access Key for the IAM user that will perform the validation.
    - The IAM user name or IAM role name that will be deploying clusters in your environment.

- If validating permissions for an Azure environment, ensure you have the minimal Azure Role-Based Access Control (RBAC)
  permissions required to perform the validation. Refer to
  [Minimal Azure RBAC permissions by validation type](https://github.com/validator-labs/validator-plugin-azure?tab=readme-ov-file#minimal-azure-rbac-permissions-by-validation-type)
  for guidance.

  - You will need to provide the following details during the validation steps:

    - [Microsoft Entra tenant ID](https://learn.microsoft.com/en-us/entra/fundamentals/how-to-find-tenant) for your
      Azure subscription.
    - Client ID for the service principal that will perform the validation.
    - Client secret for the service principal that will perform the validation.
    - Service Principal ID for the service principal that will be deploying clusters in your environment.
    - Subscription ID for where the clusters will be deployed to.

## Usage

Use the `validate-auth` command to verify permissions for your targeted environment. Interactive steps will guide you
through the process.

The `validate-auth` command accepts the following flags.

| **Short Flag** | **Long Flag** | **Description**                                                                                                                                                       | **Type** |
| -------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
|                | `--cloud-env` | The target cloud environment to validate permissions on. This can also be selected in the interactive wizard. The supported cloud environments are `aws` and `azure`. | string   |
|                | `--outdir`    | Output directory for generated resources. Defaults to `$(pwd)/out`.                                                                                                   | string   |
| `-h`           | `--help`      | Help with any command.                                                                                                                                                | -        |

### Examples

Here are some examples of using the `validate-auth` command and its supported flags.

Start the interactive steps.

```shell
palette validate-auth
```

Start the interactive steps and choose the cloud environment in advance.

```shell
palette validate-auth --cloud-env <aws|azure>
```

Start the interactive steps and specify the output directory for any generated resources.

```shell
palette validate-auth --outdir $(pwd)/resources
```

### Interactive Steps

The interactive steps change depending on the cloud environment chosen.

#### AWS

1. Issue the `validate-auth` command using the Palette CLI.

   ```shell
   palette validate-auth
   ```

2. When prompted, select `AWS` for the cloud environment, and press Enter.

3. Provide the AWS Access Key ID for the IAM user that will perform the validation, and press Enter.

4. Provide the AWS Secret Access Key for the IAM user that will perform the validation, and press Enter.

5. Select either `IAM User` or `IAM Role` depending on what you want to check, and press Enter.

6. Provide the `IAM User name` or `IAM Role name` depending on what was chosen in step 5, and press Enter. This is the
   user or role that will be deploying clusters in your environment.

7. Choose the permission model to validate against. The `Comprehensive` model will check whether you have
   sufficient permissions for all Palette features. The `Minimal` model will only check for the privileges needed to
   create and delete clusters. Refer to the [Required IAM Policies](../../../clusters/public-cloud/aws/required-iam-policies.md) to learn more about AWS permissions needed by Palette.

   Once you have selected the permission model, press Enter.

8. You are prompted to answer `Will the cloud account be deploying EKS host clusters?`. Enter `y` if you want to check
   for sufficient permissions to deploy Amazon EKS clusters, or `n` if you do not.

9. Provide the default AWS region that the validation will be performed on. This does not have to match the region where
   you intend to deploy clusters. Press Enter after providing the region.

   Example.

   ```shell hideClipboard
   Default AWS region: eu-west-1
   ```

The validation process will now execute and output the results to your terminal.

#### Azure

1. Issue the `validate-auth` command using the Palette CLI.

   ```shell
   palette validate-auth
   ```

2. When prompted, select `Azure` for the cloud environment, and press Enter.

3. Provide the Tenant ID for your Azure subscription, and press Enter.

4. Provide the client ID for the service principal that will perform the validation, and press Enter.

5. Provide the client secret for the service principal that will perform the validation, and press Enter.

6. Select either `AzureCloud` or `AzureUSGovernment` as the environment that you want to perform the validation in, and
   press Enter.

7. Select either `IaaS` or `AKS` depending on what type of clusters you will be deploying, and press Enter.

8. Select either `Dynamic placement` or `Static placement` depending on the network configuration you require for your
   clusters, and press Enter. Refer to the [Required Permissions](../../../clusters/public-cloud/azure/required-permissions.md) page to learn more about Azure permissions needed by Palette.

9. Provide the Service Principal ID for the service principal that will be deploying clusters in your environment, and
   press Enter.

10. Provide the Subscription ID where the clusters will be deployed to, and press Enter.

11. Provide the resource group where the clusters will be deployed to, and press Enter. The resource group must exist
    within the Subscription ID provided in the previous step.

The validation process will now execute and output the results to your terminal.

### Validator File

During the interactive steps, a Validator file is generated that contains the permissions that the Validator is
searching for. It also contains the secret used to authorize the validation task. You are prompted to keep or remove
this file after the validation results are displayed.

Example.

```shell hideClipboard
 WARNING  Validator file validator-20250113_183600.yaml contains secret(s): AWS secret access key
Remove file validator-20250113_183600.yaml from disk? [Y/n]:
```

Enter `y` if you want to remove the specification file, or `n` if you want to keep it.

## Review Validation Results

A report is generated and outputted to your terminal after the validation process is complete. The report varies
depending on the outcome.

### Succeeded

If the validation is successful, the `State` field is set to `Succeeded`. The output varies slightly depending on the
cloud environment.

#### AWS

When the IAM user or role provided has all sufficient privileges, then the validation results will appear similar to the
following example.

```yaml hideClipboard
=================
Validation Result
=================

Plugin:           AWS
Name:             validator-plugin-aws-aws-validator
Namespace:        N/A
State:            Succeeded

------------
Rule Results
------------

Validation Rule:        validation-paletteclusteroperator
Validation Type:        aws-iam-user-policy
Status:                 True
Last Validated:         2025-01-14T19:58:12Z
Message:                All required IAM user policy permissions were found
```

#### Azure

When the service principal provided has all sufficient privileges, then the validation results will appear similar to
the following example.

```yaml hideClipboard
=================
Validation Result
=================

Plugin:           Azure
Name:             validator-plugin-azure-azure-validator
Namespace:        N/A
State:            Succeeded

------------
Rule Results
------------

Validation Rule:        validation-paletteclusteroperator
Validation Type:        azure-rbac
Status:                 True
Last Validated:         2025-01-14T19:58:12Z
Message:                Principal has all required permissions.
```

### Failed

If the validation is not successful, the `State` field is set to `Failed`. The `Failures` section contains additional
information about the failure and will vary depending on the cloud environment.

#### AWS

In this example, several IAM permissions are missing for the `PaletteClusterOperator` IAM role.

```yaml hideClipboard
=================
Validation Result
=================

Plugin:           AWS
Name:             validator-plugin-aws-aws-validator
Namespace:        N/A
State:            Failed

------------
Rule Results
------------

Validation Rule:        validation-paletteclusteroperator
Validation Type:        aws-iam-user-policy
Status:                 False
Last Validated:         2025-01-14T18:48:36Z
Message:                One or more required IAM permissions was not found, or a condition was not met

--------
Failures
--------
- Condition StringLike: iam:AWSServiceName=[autoscaling.amazonaws.com];  not applied to action(s) [iam:CreateServiceLinkedRole] for resource arn:*:iam::*:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling from policy PaletteControllerPolicy
- v1alpha1.IamUserRule PaletteClusterOperator missing action(s): [autoscaling:CreateAutoScalingGroup autoscaling:DeleteAutoScalingGroup] for resource arn:*:autoscaling:*:*:autoScalingGroup:*:autoScalingGroupName/* from policy PaletteControllerPolicy
- v1alpha1.IamUserRule PaletteClusterOperator missing action(s): [s3:DeleteObject] for resource arn:*:s3:::* from policy PaletteControllerPolicy
- v1alpha1.IamUserRule PaletteClusterOperator missing action(s): [secretsmanager:CreateSecret secretsmanager:DeleteSecret] for resource arn:*:secretsmanager:*:*:secret:aws.cluster.x-k8s.io/* from policy PaletteNodesPolicy
```

Use the output to help you address the validation failures. In this example, the Validator identified two types of IAM
permission issues, which are missing actions and missing conditions.

To resolve the missing actions, add the missing IAM permissions to the **PaletteClusterOperator** IAM user. The
following table summarizes the missing actions and their required resource scopes, identifying which Palette policy
should contain these permissions.

| **IAM Policy**              | **Missing Actions**                                                              | **Resource Scope**                                                |
| --------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **PaletteControllerPolicy** | `autoscaling:CreateAutoScalingGroup` <br /> `autoscaling:DeleteAutoScalingGroup` | `arn:*:autoscaling:*:*:autoScalingGroup:*:autoScalingGroupName/*` |
| **PaletteControllerPolicy** | `s3:DeleteObject`                                                                | `arn:*:s3:::*`                                                    |
| **PaletteNodesPolicy**      | `secretsmanager:CreateSecret` <br /> `secretsmanager:DeleteSecret`               | `arn:*:secretsmanager:*:*:secret:aws.cluster.x-k8s.io/*`          |

To resolve the missing conditions, apply the required conditions to the specified actions. From interpreting the example
extract below, the Validator detected that the **PaletteControllerPolicy** IAM policy requires a condition to be added
for the `iam:CreateServiceLinkedRole` action to restrict service-linked role creation specifically to Auto Scaling
services.

```yaml hideClipboard
- Condition StringLike:
    iam:AWSServiceName=[autoscaling.amazonaws.com];  not applied to action(s) [iam:CreateServiceLinkedRole] for resource
    arn:*:iam::*:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling from policy
    PaletteControllerPolicy
```

#### Azure

<!-- TBC -->
In this example, validation failed for the `palette-spc` service principal due to missing permissions.

```yaml hideClipboard
=================
Validation Result
=================

Plugin:           Azure
Name:             validator-plugin-azure-azure-validator
Namespace:        N/A
State:            Failed

------------
Rule Results
------------

Validation Rule:        validation-palette-spc
Validation Type:        azure-rbac
Status:                 False
Last Validated:         2025-01-14T20:37:24Z
Message:                Principal lacks required permissions. See failures for details.

--------
Failures
--------
...
```

Use the output to help you address the validation failures.

### Resolve Failures

Each plugin can report different types of validation failures. The resolution steps will vary depending on the specific
plugin and failure type. Use the error output to identify and address each failure. The following table provides
guidance for common failure scenarios.

| **Plugin** | **Failure Message**                                                            | **Guidance**                                                                                                                                                                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AWS**    | One or more required IAM permissions was not found, or a condition was not met | The IAM role used by Palette is missing one or more required IAM permissions. Refer to [Required IAM Policies](../../../clusters/public-cloud/aws/required-iam-policies.md) for a comprehensive list of required IAM permissions and attach the missing permissions or policies.          |
| **Azure**  | Principal lacks required permissions. See failures for details.                | The service principal used by Palette is missing one or more required permissions. Refer to [Required Permissions](../../../clusters/public-cloud/azure/required-permissions.md) for a comprehensive list of required permissions and attach the missing permissions or role assignments. |

<!-- Saving in case we add quota checks in the future

| **Plugin** | **Failure Message**                                                            | **Guidance**                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **AWS**    | Usage for one or more service quotas exceeded the specified buffer             | The usage quota for a service or multiple service quotas are above the specified buffer. Refer to the [AWS Service Quotas](https://docs.aws.amazon.com/general/latest/gr/aws-service-information.html) documentation to review the default limits. Use the [Service Quotas](https://console.aws.amazon.com/servicequotas/) page in the AWS console to request an increase to your account, or remove resources to reduce the usage. |
| **Azure**  | Usage for one or more resources exceeded the quota plus specified buffer       | The usage quotas for a service or multiple service quotas are above the specified buffer. Refer to [Azure Service Quotas](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits) documentation to review the default limits. Use the [Quotas](https://portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/overview) page in the Azure portal to request an increase to your account, or remove resources to reduce the usage.     |

-->
