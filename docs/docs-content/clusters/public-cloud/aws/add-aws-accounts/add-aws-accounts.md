---
sidebar_label: "Register and Manage AWS Accounts"
title: "Add an AWS Account to Palette"
description: "Learn how to add an AWS account to Palette."
hide_table_of_contents: false
tags: ["public cloud", "aws", "iam"]
sidebar_position: 10
---

Palette supports integration with Amazon Web Services (AWS) Cloud Accounts, including
[AWS GovCloud (US)](https://aws.amazon.com/govcloud-us/?whats-new-ess.sort-by=item.additionalFields.postDateTime&whats-new-ess.sort-order=desc)
and [AWS Secret Cloud (US)](https://aws.amazon.com/federal/secret-cloud/) accounts. This section explains how to create
an AWS cloud account in Palette. You can use any of the following authentication methods to register your cloud account.

- AWS

  - [Static Access Credentials](#static-access-credentials)
  - [Dynamic Access Credentials](#dynamic-access-credentials)

- AWS GovCloud (US)

  - [Static Access Credentials](#static-access-credentials-1)
  - [Dynamic Access Credentials](#dynamic-access-credentials-1)

- AWS Secret Cloud (SC2S) (US)

  - [Static Access Credentials](#static-access-credentials-2)
  - [Secure Compliance Validation Credentials](#secure-compliance-validation-credentials)

## AWS Account

This section provides guidance on creating an AWS account that uses static or dynamic access credentials.

### Static Access Credentials

Use the steps below to add an AWS cloud account using static access credentials.

#### Prerequisites

- A Palette account with [tenant admin](../../../tenant-settings/tenant-settings.md) access.

- An AWS account with an [IAM role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) or
  [IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) for Palette.

- An AWS account with the [required IAM policies](required-iam-policies.md) assigned to the Palette IAM user or IAM
  role.

#### Add AWS Account to Palette

<PartialsComponent category="palette-setup" name="aws-static-credentials" />

#### Validate

You can verify that the account is available in Palette by reviewing the list of cloud accounts. To review the list of
cloud accounts, navigate to the left **Main Menu** and click on **Tenant Settings**. Next, click on **Cloud Accounts**.
Your newly added AWS cloud account is listed under the AWS section.

### Dynamic Access Credentials

Use the steps below to add an AWS cloud account using Security Token Service (STS) credentials.

#### Prerequisites

- A Palette account with [tenant admin](../../../tenant-settings/tenant-settings.md) access.

- If you are using a self-hosted instance of Palette or VerteX, you must configure an AWS account at the instance-level
  to allow tenants to add AWS accounts using STS. For more information, refer to the
  [Add AWS Accounts Using STS](../../../public-cloud/aws/add-aws-accounts/configure-aws-sts-account.md) guide.

- An AWS account with an [IAM role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) or
  [IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) for Palette.

- An AWS account with the [required IAM policies](required-iam-policies.md) assigned to the Palette IAM user or IAM
  role.

#### Add AWS Account to Palette

1. Log in to [Palette](https://console.spectrocloud.com) as tenant admin.

2. From the left **Main Menu**, click on **Tenant Settings**.

3. Select **Cloud Accounts**, and click **Add AWS Account**.

4. In the cloud account creation wizard, enter the following information:

   - **Account Name**: Custom name for the cloud account.
   - **Description**: Optional description for the cloud account.
   - Select **STS** authentication for validation.

5. You will be provided with information on the right side of the wizard. You will need this information to create an
   IAM role for Palette. The following table lists the information provided by the wizard after you select **STS**.

   | **Parameter**           | **Description**                                                                                                                                                               |
   | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Trusted Entity Type** | Another AWS account.                                                                                                                                                          |
   | **Account ID**          | Copy the Account ID displayed on the UI. If using a self-hosted instance, this is the same AWS account that you configured for your Palette or VerteX instance to enable STS. |
   | **Require External ID** | Enable.                                                                                                                                                                       |
   | **External ID**         | Copy the External ID displayed on the UI. This ID is generated by Palette or VerteX and is different per tenant.                                                              |
   | **Permissions Policy**  | Search and select the 4 policies added in step 2.                                                                                                                             |
   | **Role Name**           | SpectroCloudRole.                                                                                                                                                             |

6. In the AWS console, browse to the **Role Details** page and copy the Amazon Resource Name (ARN) for the role.

7. In Palette, paste the role ARN into the **ARN** field.

8. Click the **Validate** button to validate the credentials.

#### Validate

You can verify that the account is available in Palette by reviewing the list of cloud accounts. To review the list of
cloud accounts, navigate to the left **Main Menu**. Click on **Tenant Settings**. Next, click on **Cloud Accounts**.
Your newly added AWS cloud account is listed under the AWS section.

## AWS GovCloud Account (US)

Palette supports integration with
[AWS GovCloud (US)](https://aws.amazon.com/govcloud-us/?whats-new-ess.sort-by=item.additionalFields.postDateTime&whats-new-ess.sort-order=desc).
Using Palette, you can deploy Kubernetes clusters to your AWS GovCloud account. This section provides guidance on
creating an AWS GovCloud account that uses static or dynamic access credentials.

### Static Access Credentials

Use the steps below to add an AWS cloud account using static access credentials.

#### Prerequisites

- A Palette account with [tenant admin](../../../tenant-settings/tenant-settings.md) access.

- An AWS account with an [IAM role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) or
  [IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) for Palette.

- An AWS account with the [required IAM policies](required-iam-policies.md) assigned to the Palette IAM user or IAM
  role.

#### Add AWS GovCloud Account to Palette

1. Log in to [Palette](https://console.spectrocloud.com) as tenant admin.

2. From the left **Main Menu**, click on **Tenant Settings**.

3. Select **Cloud Accounts**, and click **Add AWS Account**.

4. In the cloud account creation wizard provide the following information:

   - **Account Name:** Custom name for the cloud account.

   - **Description:** Optional description for the cloud account.
   - **Partition:** Choose **AWS US Gov** from the **drop-down Menu**.

   - **Credentials:**

     - AWS Access key
     - AWS Secret access key

5. Click the **Validate** button to validate the credentials.

6. Once the credentials are validated, verified by a green check mark, the **Add IAM Policies** toggle is displayed.
   Toggle **Add IAM Policies** on.

7. Use the **drop-down Menu**, which lists available IAM policies in your AWS account, to select any desired IAM
   policies you want to assign to the Palette IAM role or IAM user.

#### Validate

You can verify that the account is available in Palette by reviewing the list of cloud accounts. To review the list of
cloud accounts, navigate to the left **Main Menu**. Click on **Tenant Settings**. Next, click **Cloud Accounts**. Your
newly added AWS cloud account is listed under the AWS section.

### Dynamic Access Credentials

Use the steps below to add an AWS cloud account using STS credentials.

#### Prerequisites

- A Palette account with [tenant admin](../../../tenant-settings/tenant-settings.md) access.

- If you are using a self-hosted instance of Palette or VerteX, you must configure an AWS account at the instance-level
  to allow tenants to add AWS accounts using STS. For more information, refer to the
  [Add AWS Accounts Using STS](../../../public-cloud/aws/add-aws-accounts/configure-aws-sts-account.md) guide.

- An AWS account with an [IAM role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) or
  [IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) for Palette.

- An AWS account with the [required IAM policies](required-iam-policies.md) assigned to the Palette IAM user or IAM
  role.

#### Add AWS GovCloud Account to Palette

1. Log in to [Palette](https://console.spectrocloud.com) as Tenant admin.

2. From the left **Main Menu**, click on **Tenant Settings**.

3. Select **Cloud Accounts**, and click **Add AWS Account**.

4. In the cloud account creation wizard, enter the following information:

   - **Account Name**
   - **Description**
   - Select **STS** authentication for validation.

5. You will be provided with information on the right side of the wizard. You will need this information to create an
   IAM Role for Palette. The following table lists the information provided by the wizard after you select **STS**.

   | **Parameter**           | **Description**                                                                                                                                                               |
   | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Trusted Entity Type** | Another AWS account.                                                                                                                                                          |
   | **Account ID**          | Copy the Account ID displayed on the UI. If using a self-hosted instance, this is the same AWS account that you configured for your Palette or VerteX instance to enable STS. |
   | **Require External ID** | Enable.                                                                                                                                                                       |
   | **External ID**         | Copy the External ID displayed on the UI. This ID is generated by Palette or VerteX and is different per tenant.                                                              |
   | **Permissions Policy**  | Search and select the 4 policies added in step #2.                                                                                                                            |
   | **Role Name**           | SpectroCloudRole.                                                                                                                                                             |

6. In the AWS console, browse to the **Role Details** page and copy the ARN for the role.

7. In Palette, paste the role ARN into the **ARN** input box.

8. Click the **Validate** button to validate the credentials.

#### Validate

You can verify that the account is available in Palette by reviewing the list of cloud accounts. To review the list of
cloud accounts, navigate to the left **Main Menu**. Click on **Tenant Settings**. Next, click on **Cloud Accounts**.
Your newly added AWS cloud account is listed under the AWS section.

## AWS Secret Cloud Account (US)

You can configure [AWS Secret Cloud](https://aws.amazon.com/federal/secret-cloud/) accounts in
[Palette VerteX](../../../vertex/vertex.md) to deploy AWS EKS clusters in the AWS Secret region. Depending on your
organization's compliance requirements, you can choose between standard authentication (standard access credentials) or
secure compliance validation using your SC2S Access Portal (SCAP) credentials.

:::preview

:::

### Limitations

- Only Amazon Linux 2-based Amazon Machine Images are supported for Kubernetes control plane and worker nodes. Workloads
  deployed in the cluster should use Linux-based container images to ensure compatibility with the node operating
  system.

- User-provided Certificate Authority (CA) certificates are not automatically mounted on worker nodes in EKS clusters
  that are deployed in the AWS Secret region. As a result, applications or services that rely on custom CAs for
  Transport Layer Security (TLS) communication may fail to establish secure connections, and integrations with external
  services that require custom CAs may encounter Secure Socket Layer (SSL) or TLS verification issues.

  - Workloads requiring custom CAs for internal trust validation must use an alternative configuration, such as using a
    [sidecar container](https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/) to provide the CA
    certificate at runtime or embedding the CA certificate within the application. For guidance on embedding
    certificates within applications, refer to the official Kubernetes documentation on
    [using Secrets as files from a Pod](https://kubernetes.io/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod)
    and
    [creating pods that access Secret data through a Volume](https://kubernetes.io/docs/tasks/inject-data-application/distribute-credentials-secure/#create-a-pod-that-has-access-to-the-secret-data-through-a-volume).

### Prerequisites

- [Palette VerteX installed](../../../vertex/install-palette-vertex/install-palette-vertex.md) and
  [tenant admin](../../../tenant-settings/tenant-settings.md) access.

- The **AwsSecretPartition** [feature flag](../../../vertex/system-management/feature-flags.md) enabled in the Palette
  VerteX [system console](../../../vertex/system-management/system-management.md).

- An AWS account with an [IAM role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) or
  [IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) for Palette VerteX.

- An AWS account with the [required IAM policies](required-iam-policies.md) assigned to the Palette VerteX IAM user or
  IAM role.

- A secure connection to your AWS Secret Cloud account, such as via a
  [Private Cloud Gateway (PCG)](../../../clusters/pcg/pcg.md), Wide Area Network tunnel, or AWS Private Link.

### Static Access Credentials

Use the steps below to add an AWS Secret Cloud account using static access credentials.

#### Add AWS Secret Cloud to Palette VerteX

1. Log in to Palette VerteX as tenant admin.

2. From the left **Main Menu**, click on **Tenant Settings**.

3. Select **Cloud Accounts**, and click **Add AWS Account**.

4. In the cloud account creation wizard provide the following information:

   - **Account Name:** Custom name for the cloud account.

   - **Description:** Optional description for the cloud account.
   - **Partition:** Choose **AWS US Secret** from the **drop-down Menu**.

   - **Credentials:**

     - AWS Access key
     - AWS Secret access key

   - **Certificate Authority:** Paste the root, intermediate, or chain of trust certificate in PEM-encoded format.
     Contact your organization's security team or AWS Secret Cloud administrator to obtain this certificate.

5. Click the **Validate** button to validate the credentials.

6. Once the credentials are validated, verified by a green check mark, the **Add IAM Policies** toggle is displayed.
   Toggle **Add IAM Policies** on.

7. Use the **drop-down Menu**, which lists available IAM policies in your AWS account, to select any desired IAM
   policies you want to assign to the Palette IAM role or IAM user.

8. If you are using a PCG to connect to your AWS Secret Cloud account to Palette VerteX, toggle **Connect Private Cloud
   Gateway** on, and select a **Private Cloud Gateway** from the list. This list is populated automatically with the
   **Private Cloud Gateways** listed in **Tenant Settings**. For more information, refer to the
   [Private Cloud Gateway](../../../clusters/pcg/pcg.md) page.

9. Click **Confirm** to create your AWS Secret Cloud account.

#### Validate

You can verify that the account is available in Palette by reviewing the list of cloud accounts. To review the list of
cloud accounts, navigate to the left **Main Menu**. Click on **Tenant Settings**. Next, click **Cloud Accounts**. Your
newly added AWS cloud account is listed under the AWS section.

### Secure Compliance Validation Credentials

Use the steps below to add an AWS Secret Cloud account using SCAP secure compliance validation credentials.

#### Add AWS Secret Cloud to Palette VerteX

1. Log in to Palette VerteX as tenant admin.

2. From the left **Main Menu**, click on **Tenant Settings**.

3. Select **Cloud Accounts**, and click **Add AWS Account**.

4. In the cloud account creation wizard, enter the following information:

   - **Account Name:** Custom name for the cloud account.

   - **Description:** Optional description for the cloud account.
   - **Partition:** Choose **AWS US Secret** from the **drop-down Menu**.

5. Toggle on **Secure Compliance Validation** and enter the following information.

   | **Parameter**                      | **Description**                                                                                                                                                                                                                                                                                                                                                                                                       |
   | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Agency Name**                    | Enter the SCAP agency name.                                                                                                                                                                                                                                                                                                                                                                                           |
   | **Account Name**                   | Enter the SCAP account name or number.                                                                                                                                                                                                                                                                                                                                                                                |
   | **CAP/SCAP Role Name**             | Enter the role name provided by the SCAP administrator. This role determines the AWS permissions granted to the account. Note that AWS Top Secret Cloud Access Portal (CAP) credentials are not supported at this time.                                                                                                                                                                                               |
   | **Role Prefix (Optional)**         | Choose a prefix to standardize role names. If no prefix is provided, a default prefix of `PROJECT_` is used. For example, if the initial role name is `DevOpsRole`, the full role name would be `PROJECT_DevOpsRole`.                                                                                                                                                                                                 |
   | **Permission Boundary (Optional)** | If you want to apply a permission boundary and limit the maximum permissions a role or user can have, provide the IAM policy ARN (for example, `arn:aws:iam::123456789012:policy/MyPermissionBoundaryPolicy`). Refer to the AWS [Permissions boundaries for IAM entities](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) page for additional information on permission boundaries. |
   | **Certificate Authority**          | Paste the root, intermediate, or chain of trust certificate in PEM-encoded format. Contact your organization's security team or AWS Secret Cloud administrator to obtain this certificate.                                                                                                                                                                                                                            |
   | **User Certificate**               | Paste your user-issued digital certificate in PEM-encoded format.                                                                                                                                                                                                                                                                                                                                                     |
   | **User Key**                       | Provide the private cryptographic key associated with the user certificate in PEM-encoded format.                                                                                                                                                                                                                                                                                                                     |

6. Click the **Validate** button to validate the credentials.

7. Once the credentials are validated, verified by a green check mark, the **Add IAM Policies** toggle is displayed.
   Toggle **Add IAM Policies** on.

8. Use the **drop-down Menu**, which lists available IAM policies in your AWS account, to select any desired IAM
   policies you want to assign to the Palette IAM role or IAM user.

9. If you are using a PCG to connect to your AWS Secret Cloud account to Palette VerteX, toggle **Connect Private Cloud
   Gateway** on, and select a **Private Cloud Gateway** from the list. This list is populated automatically with the
   **Private Cloud Gateways** listed in **Tenant Settings**. For more information, refer to the
   [Private Cloud Gateway](../../../clusters/pcg/pcg.md) page.

10. Click **Confirm** to create your AWS Secret Cloud account.

#### Validate

You can verify that the account is available in Palette by reviewing the list of cloud accounts. To review the list of
cloud accounts, navigate to the left **Main Menu**. Click on **Tenant Settings**. Next, click **Cloud Accounts**. Your
newly added AWS cloud account is listed under the AWS section.

## Next Steps

Now that you have added an AWS account to Palette, you can start deploying Kubernetes clusters to your AWS account. To
learn how to get started with deploying Kubernetes clusters to AWS, check out the following guides:

- [Create and Manage AWS IaaS Cluster](create-cluster.md)
- [Create and Manage AWS EKS Cluster](eks.md)
- [EKS Hybrid Nodes](./eks-hybrid-nodes/eks-hybrid-nodes.md)
