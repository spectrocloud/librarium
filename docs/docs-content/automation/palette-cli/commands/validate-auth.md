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
      Azure subscription where the service principal performing the validation resides.
    - Client ID for the service principal that will perform the validation.
    - Client secret associated with the service principal that will perform the validation.
    - Service Principal ID for the service principal that will be deploying clusters in your environment.
    - Subscription ID for where the clusters will be deployed to.
    - Name of the resource group where the clusters will be deployed to.

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

<Tabs queryString="steps">

<TabItem label="AWS" value="aws">

1. Issue the `validate-auth` command using the Palette CLI.

   ```shell
   palette validate-auth
   ```

2. When prompted, select `AWS` for the cloud environment.

3. Provide the AWS Access Key ID for the IAM user that will perform the validation.

4. Provide the AWS Secret Access Key for the IAM user that will perform the validation.

5. Select either `IAM User` or `IAM Role` depending on what you want to check.

6. Provide the `IAM User name` or `IAM Role name` depending on what was chosen in step 5. This is the user or role that
   will be deploying clusters in your environment.

7. Choose the permission model to validate against. The `Comprehensive` model will check whether you have sufficient
   permissions for all Palette features. The `Minimal` model will only check for the privileges needed to create and
   delete clusters. Refer to the [Required IAM Policies](../../../clusters/public-cloud/aws/required-iam-policies.md) to
   learn more about AWS permissions needed by Palette.

8. You are prompted to answer `Will the cloud account be deploying EKS host clusters?`. Enter `y` if you want to check
   for sufficient permissions to deploy Amazon EKS clusters, or `n` if you do not.

9. Provide the default AWS region on which the validation will be performed. This should match the region where you
   intend to deploy clusters.

   Example.

   ```shell hideClipboard
   Default AWS region: eu-west-1
   ```

The validation process will now execute and output the results to your terminal.

</TabItem>

<TabItem label="Azure" value="azure">

1. Set the following environment variables before issuing the Palette CLI command. These are needed in addition to the
   validation steps due to Azure's authentication and authorization requirements.

   ```shell
   export AZURE_TENANT_ID=<tenantId>
   export AZURE_CLIENT_ID=<clientId>
   export AZURE_CLIENT_SECRET=<azureClientSecret>
   export AZURE_ENVIRONMENT=<azureEnvironment>
   ```

   - Replace `<tenantId>` with the
     [Microsoft Entra tenant ID](https://learn.microsoft.com/en-us/entra/fundamentals/how-to-find-tenant) for your Azure
     subscription where the service principal performing the validation resides.
   - Replace `<clientId>` with the client ID for the service principal that will perform the validation.
   - Replace `<azureClientSecret>` with the client secret associated with the service principal that will perform the
     validation.
   - Replace `<azureEnvironment>` with the environment where you want to perform the validation. Use `AzureCloud` for
     the public Azure cloud or `AzureUSGovernment` for the
     [Azure Government](https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-welcome)
     environment.

2. Issue the `validate-auth` command using the Palette CLI.

   ```shell
   palette validate-auth
   ```

3. When prompted, select `Azure` for the cloud environment.

4. Provide the Tenant ID for your Azure subscription where the service principal performing the validation resides, and
   press Enter. This must match the environment variable set in step 1.

5. Provide the client ID for the service principal that will perform the validation. This must match the environment
   variable set in step 1.

6. Provide the client secret associated with the service principal that will perform the validation. This must match the
   environment variable set in step 1.

7. Select either `AzureCloud` or `AzureUSGovernment` as the environment where you want to perform the validation, and
   press Enter. This must match the environment variable set in step 1.

8. Select either `IaaS` or `AKS` depending on what type of clusters you will be deploying.

9. Select either `Dynamic placement` or `Static placement` depending on the network configuration you require for your
   clusters. Refer to the [Required Permissions](../../../clusters/public-cloud/azure/required-permissions.md) page to
   learn more about Azure permissions needed by Palette.

10. Provide the Service Principal ID for the service principal that will be deploying clusters in your environment.

11. Provide the Subscription ID where the clusters will be deployed to.

12. Provide the name of the resource group where the clusters will be deployed to. The resource group must exist within
    the Subscription ID provided in the previous step.

The validation process will now execute and output the results to your terminal.

</TabItem>

</Tabs>

### Validator File

During the interactive steps, a Validator file is generated that contains the permissions that the Validator is
searching for. It also contains the secret used to authorize the validation task. You are prompted to keep or remove
this file after the validation results are displayed.

Example.

```shell hideClipboard
 WARNING  Validator file validator-20250113_183600.yaml contains secret(s): AWS secret access key
Remove file validator-20250113_183600.yaml from disk? [Y/n]:
```

Enter `y` if you want to remove the Validator file, or `n` if you want to keep it.

## Review Validation Results

A report is generated and outputted to your terminal after the validation process is complete. The report varies
depending on the outcome.

### Succeeded

If the validation is successful, the `State` field is set to `Succeeded`. The output varies slightly depending on the
cloud environment.

<Tabs queryString="succeeded">

<TabItem label="AWS" value="aws">

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

</TabItem>

<TabItem label="Azure" value="azure">

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

Validation Rule:        validation-rule-1
Validation Type:        azure-rbac
Status:                 True
Last Validated:         2025-01-17T10:41:49Z
Message:                Principal has all required permissions.
```

</TabItem>

</Tabs>

### Failed

If the validation is not successful, the `State` field is set to `Failed`. The `Failures` section contains additional
information about the failure and will vary depending on the cloud environment.

<Tabs queryString="failed">

<TabItem label="AWS" value="aws">

In this example, several IAM permissions are missing for the `PaletteClusterOperator` IAM role.

```yaml hideClipboard {23-26}
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

</TabItem>

<TabItem label="Azure" value="azure">

In this example, validation failed for the `palette-spc` service principal due to missing permissions.

```yaml hideClipboard {23-25}
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

Validation Rule:        validation-rule-1
Validation Type:        azure-rbac
Status:                 False
Last Validated:         2025-01-17T10:41:49Z
Message:                Principal lacks required permissions. See failures for details.

--------
Failures
--------
- Action Microsoft.Network/routeTables/delete unpermitted because no role assignment permits it.
- Action Microsoft.Storage/storageAccounts/write unpermitted because no role assignment permits it.
- Action Microsoft.Compute/disks/write unpermitted because no role assignment permits it.
```

Use the output to help you address the validation failures. In this example, the Validator identified Azure RBAC
permissions that are missing from your role assignments.

To resolve the missing permissions, you would need to add them to the appropriate role definition, or ensure that the
service principal has been assigned a role that includes these permissions. The following table summarizes the missing
actions by their Azure Resource Provider.

| Azure Resource Provider | Missing Actions         | Permission Type |
| ----------------------- | ----------------------- | --------------- |
| `Microsoft.Network`     | `routeTables/delete`    | Role Assignment |
| `Microsoft.Storage`     | `storageAccounts/write` | Role Assignment |
| `Microsoft.Compute`     | `disks/write`           | Role Assignment |

</TabItem>

</Tabs>

### Resolve Failures

Each plugin can report different types of validation failures. The resolution steps will vary depending on the specific
plugin and failure type. Use the error output to identify and address each failure. The following table provides
guidance for common failure scenarios.

| **Plugin** | **Failure Message**                                                            | **Guidance**                                                                                                                                                                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AWS**    | One or more required IAM permissions was not found, or a condition was not met | The IAM user or role used by Palette is missing one or more required IAM permissions. Refer to [Required IAM Policies](../../../clusters/public-cloud/aws/required-iam-policies.md) for a comprehensive list of required IAM permissions and attach the missing permissions or policies.  |
| **Azure**  | Principal lacks required permissions. See failures for details.                | The service principal used by Palette is missing one or more required permissions. Refer to [Required Permissions](../../../clusters/public-cloud/azure/required-permissions.md) for a comprehensive list of required permissions and attach the missing permissions or role assignments. |

<!-- Saving in case we add quota checks in the future

| **Plugin** | **Failure Message**                                                            | **Guidance**                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **AWS**    | Usage for one or more service quotas exceeded the specified buffer             | The usage quota for a service or multiple service quotas are above the specified buffer. Refer to the [AWS Service Quotas](https://docs.aws.amazon.com/general/latest/gr/aws-service-information.html) documentation to review the default limits. Use the [Service Quotas](https://console.aws.amazon.com/servicequotas/) page in the AWS console to request an increase to your account, or remove resources to reduce the usage. |
| **Azure**  | Usage for one or more resources exceeded the quota plus specified buffer       | The usage quotas for a service or multiple service quotas are above the specified buffer. Refer to [Azure Service Quotas](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits) documentation to review the default limits. Use the [Quotas](https://portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/overview) page in the Azure portal to request an increase to your account, or remove resources to reduce the usage.     |

-->
