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

The following table summarizes which AWS clouds, cluster types, and credential types are supported by Palette or Palette
VerteX.

| **AWS Cloud**                                                                        | **Palette Enterprise** | **Palette VerteX** |      **IaaS**      |      **EKS**       | **Static Access**  | **Dynamic Access** | **EKS Pod Identity** | **Secure Compliance Validation** |
| ------------------------------------------------------------------------------------ | :--------------------: | :----------------: | :----------------: | :----------------: | :----------------: | :----------------: | :------------------: | :------------------------------: |
| [AWS Commercial Cloud](https://aws.amazon.com/)                                      |   :white_check_mark:   | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |  :white_check_mark:  |               :x:                |
| [AWS GovCloud](https://aws.amazon.com/govcloud-us/)                                  |   :white_check_mark:   | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |  :white_check_mark:  |               :x:                |
| <TpBadge /> [AWS Secret Cloud](https://aws.amazon.com/federal/secret-cloud/)         |          :x:           | :white_check_mark: |        :x:         | :white_check_mark: | :white_check_mark: |        :x:         |         :x:          |        :white_check_mark:        |
| <TpBadge /> [AWS Top Secret Cloud](https://aws.amazon.com/federal/top-secret-cloud/) |          :x:           | :white_check_mark: |        :x:         | :white_check_mark: | :white_check_mark: |        :x:         |         :x:          |        :white_check_mark:        |

## AWS Commercial Cloud

This section provides guidance on creating an AWS account that uses static or dynamic access credentials as well as EKS
Pod Identity.

### Static Access Credentials

Use the steps below to add an AWS cloud account using static access credentials.

#### Prerequisites

<PartialsComponent
  category="clusters-aws-account-setup"
  name="aws-static-credentials-prerequisites"
  edition="Palette"
/>

#### Add AWS Account to Palette

<PartialsComponent category="clusters-aws-account-setup" name="aws-static-credentials-enablement-1" />

6. <PartialsComponent category="clusters-aws-account-setup" name="aws-static-credentials-enablement-2" />

#### Validate

<PartialsComponent category="clusters-aws-account-setup" name="aws-account-setup-validate" />

### Dynamic Access Credentials

Use the steps below to add an AWS cloud account using Security Token Service (STS) credentials.

#### Prerequisites

- A Palette account with [tenant admin](../../../tenant-settings/tenant-settings.md) access.

- An AWS account with the [required Palette IAM policies](required-iam-policies.md).

- The ability to create an [IAM role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html)
  that Palette can assume using STS. You will create the role while adding your AWS account to Palette.

- (Self-hosted Palette and Palette VerteX only) By default, adding AWS accounts using STS is disabled in self-hosted
  Palette and Palette VerteX. To allow tenants to add AWS accounts using STS, refer to the appropriate
  [Enable Adding AWS Accounts Using STS - Palette](../../../enterprise-version/system-management/configure-aws-sts-account.md)
  or [Enable Adding AWS Accounts Using STS - VerteX](../../../vertex/system-management/configure-aws-sts-account.md)
  guide.

#### Add AWS Account to Palette

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Cloud Accounts**.

4. Locate the **AWS** section and select **Add AWS Account**.

5. Fill out the following information.

   | **Palette Parameter**      | **Description**                                                                                     |
   | -------------------------- | --------------------------------------------------------------------------------------------------- |
   | **Account Name**           | Enter a custom account name. The account name must be unique within the tenant scope.               |
   | **Description (Optional)** | Enter a description for the cloud account.                                                          |
   | **Partition**              | Select **AWS**.                                                                                     |
   | **STS**                    | Select **STS** to authenticate your AWS account using STS credentials and reveal the **ARN** field. |

6. When you select **STS**, the right side of the wizard populates with details on how to create an IAM role for
   Palette. Log in to your AWS account and begin the IAM role creation process by navigating to **IAM > Roles > Create
   role**. The following table expands on the information provided by the wizard. Use it to configure your IAM role.

   | **AWS Parameter**        | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Trusted entity type**  | Select **AWS account**. In the **An AWS account** section, select **Another AWS account**.                                                                                                                                                                                                                                                                                                                                                                                                         |
   | **Account ID**           | Copy the **Account ID** displayed on the Palette wizard. If using a self-hosted instance, this is the same AWS account that you configured for your Palette or VerteX instance to enable STS. Refer to the appropriate [Enable Adding AWS Accounts Using STS - Palette](../../../enterprise-version/system-management/configure-aws-sts-account.md) or [Enable Adding AWS Accounts Using STS - VerteX](../../../vertex/system-management/configure-aws-sts-account.md) guide for more information. |
   | **Require external ID**  | In the **An AWS account** section, below **Options**, select **Require External ID**.                                                                                                                                                                                                                                                                                                                                                                                                              |
   | **External ID**          | Copy the **External ID** displayed on the Palette wizard. This ID is generated by Palette or VerteX and is different for each tenant. Select **Next** when finished.                                                                                                                                                                                                                                                                                                                               |
   | **Permissions policies** | Search for and select the [required IAM policies](required-iam-policies.md): **PaletteControllerPolicy**, **PaletteControlPlanePolicy**, **PaletteDeploymentPolicy**, and **PaletteNodesPolicy**. If deploying EKS clusters, the **PaletteControllersEKSPolicy** is also required. Select **Next** when finished.                                                                                                                                                                                  |
   | **Role name**            | In the **Role details** section, enter `SpectroCloudRole` for the **Role name**. Select **Create role**.                                                                                                                                                                                                                                                                                                                                                                                           |

7. Your new role appears in the **Roles** list. Locate and select the new role. In the **Summary** section, copy the
   Amazon Resource Name (**ARN**) for the role.

8. In Palette, paste the role ARN into the **ARN** field.

9. <PartialsComponent category="clusters-aws-account-setup" name="aws-static-credentials-enablement-2" />

#### Validate

<PartialsComponent category="clusters-aws-account-setup" name="aws-account-setup-validate" />

### EKS Pod Identity

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-intro" partition="AWS" />

#### Limitations

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-limitations" partition="AWS" />

#### Prerequisites

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-prerequisites" partition="AWS" />

#### Enablement

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-enablement" partition="AWS" />

#### Validate

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-validate" partition="AWS" />

## AWS GovCloud

Palette supports integration with
[AWS GovCloud (US)](https://aws.amazon.com/govcloud-us/?whats-new-ess.sort-by=item.additionalFields.postDateTime&whats-new-ess.sort-order=desc).
Using Palette, you can deploy Kubernetes clusters to your AWS GovCloud account. This section provides guidance on
creating an AWS GovCloud account that uses static or dynamic access credentials as well as EKS Pod Identity.

### Static Access Credentials

Use the steps below to add an AWS cloud account using static access credentials.

#### Prerequisites

<PartialsComponent
  category="clusters-aws-account-setup"
  name="aws-static-credentials-prerequisites"
  edition="Palette"
/>

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

<PartialsComponent category="clusters-aws-account-setup" name="aws-account-setup-validate" />

### Dynamic Access Credentials

Use the steps below to add an AWS cloud account using STS credentials.

#### Prerequisites

- A Palette account with [tenant admin](../../../tenant-settings/tenant-settings.md) access.

- If you are using a self-hosted instance of Palette or VerteX, you must configure an AWS account at the instance-level
  to allow tenants to add AWS accounts using STS. For more information, refer to
  [Enable Adding AWS Accounts Using STS - Palette](../../../enterprise-version/system-management/configure-aws-sts-account.md)
  or [Enable Adding AWS Accounts Using STS - VerteX](../../../vertex/system-management/configure-aws-sts-account.md).

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

   | **Parameter**           | **Description**                                                                                                                                                                                   |
   | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Trusted Entity Type** | Another AWS account.                                                                                                                                                                              |
   | **Account ID**          | Copy the Account ID displayed on the UI. If using a self-hosted instance, this is the same AWS account that you configured for your Palette or VerteX instance to enable STS.                     |
   | **Require External ID** | Enable.                                                                                                                                                                                           |
   | **External ID**         | Copy the External ID displayed on the UI. This ID is generated by Palette or VerteX and is different per tenant.                                                                                  |
   | **Permissions Policy**  | Search for and select the [required IAM policies](required-iam-policies.md): **PaletteControllerPolicy**, **PaletteControlPlanePolicy**, **PaletteDeploymentPolicy**, and **PaletteNodesPolicy**. |
   | **Role Name**           | SpectroCloudRole.                                                                                                                                                                                 |

6. In the AWS console, browse to the **Role Details** page and copy the ARN for the role.

7. In Palette, paste the role ARN into the **ARN** input box.

8. Click the **Validate** button to validate the credentials.

#### Validate

<PartialsComponent category="clusters-aws-account-setup" name="aws-account-setup-validate" />

### EKS Pod Identity

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-intro" partition="AWS US Gov" />

#### Limitations

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-limitations" partition="AWS US Gov" />

#### Prerequisites

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-prerequisites" partition="AWS US Gov" />

#### Enablement

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-enablement" partition="AWS US Gov" />

#### Validate

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-validate" partition="AWS US Gov" />

## AWS Secret Cloud (SC2S) and Top Secret Cloud (C2S)

You can configure [AWS Secret cloud](https://aws.amazon.com/federal/secret-cloud/) and
[Top Secret cloud](<(https://aws.amazon.com/federal/top-secret-cloud/)>) accounts in
[Palette VerteX](../../../vertex/vertex.md) to deploy AWS EKS clusters in AWS Secret and Top Secret clouds. Depending on
your organization's compliance requirements, you can choose between standard authentication (IAM user access key and
secret access key-pairs) or secure compliance validation using your SC2S Access Portal (SCAP) or C2S Access Portal (CAP)
credentials to register your AWS Secret or Top Secret cloud account in Palette VerteX.

:::preview

:::

### Limitations

- Only [AWS EKS clusters](./eks.md) clusters can be deployed in AWS Secret and Top Secret clouds. AWS IaaS clusters are
  not supported.

- User-provided Certificate Authority (CA) certificates are not automatically mounted on worker nodes in EKS clusters
  that are deployed in AWS Secret and Top Secret clouds. As a result, applications or services that rely on custom CAs
  for Transport Layer Security (TLS) communication may fail to establish secure connections, and integrations with
  external services that require custom CAs may encounter Secure Socket Layer (SSL) or TLS verification issues.

  - Workloads requiring custom CAs for internal trust validation must use an alternative configuration, such as using a
    [sidecar container](https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/) to provide the CA
    certificate at runtime or embedding the CA certificate within the application. For guidance on embedding
    certificates within applications, refer to the official Kubernetes documentation on
    [using Secrets as files from a Pod](https://kubernetes.io/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod)
    and
    [creating pods that access Secret data through a Volume](https://kubernetes.io/docs/tasks/inject-data-application/distribute-credentials-secure/#create-a-pod-that-has-access-to-the-secret-data-through-a-volume).

### Static Access Credentials

Use the steps below to add an AWS Secret Cloud account using static access credentials.

#### Prerequisites

- [Palette VerteX installed](../../../vertex/install-palette-vertex/install-palette-vertex.md).

- <PartialsComponent
    category="clusters-aws-account-setup"
    name="aws-static-credentials-prerequisites"
    edition="Palette VerteX"
  />

- The **AwsSecretPartition** [feature flag](../../../vertex/system-management/feature-flags.md) enabled in the Palette
  VerteX [system console](../../../vertex/system-management/system-management.md).

- A secure connection to your AWS Secret Cloud or Top Secret Cloud account, such as via a
  [Private Cloud Gateway (PCG)](../../../clusters/pcg/pcg.md), Wide Area Network (WAN) tunnel, or AWS Private Link.

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

<PartialsComponent category="clusters-aws-account-setup" name="aws-account-setup-validate" />

### Secure Compliance Validation Credentials

Use the steps below to add an AWS Secret Cloud account using SCAP secure compliance validation credentials.

#### Prerequisites

- Palette VerteX [installed](../../../vertex/install-palette-vertex/install-palette-vertex.md).

- A Palette VerteX account with [tenant admin](../../../tenant-settings/tenant-settings.md) access.

- The **AwsSecretPartition** [feature flag](../../../vertex/system-management/feature-flags.md) enabled in the Palette
  VerteX [system console](../../../vertex/system-management/system-management.md).

- An AWS Secret or Top Secret account configured for CAP/SCAP access. Your CAP/SCAP administrator must provide the
  target Agency, Account, and CAP/SCAP role values. The CAP/SCAP role must be assigned the
  [required IAM policies](./required-iam-policies.md).

- A Non-Person Entity (NPE) (service identity) provisioned and authorized to access the target Agency, Account, and
  CAP/SCAP role.

- A trusted client certificate and private key issued for the NPE and mapped to the NPE identity in your organization’s
  identity access management system. This is required for CAP/SCAP to authenticate and authorize the certificate
  identity.

- The CA certificate (root, intermediate, or chain of trust), the client certificate, and the private key in PEM-encoded
  format.

- A secure connection to your AWS Secret Cloud or Top Secret Cloud account, such as via a
  [Private Cloud Gateway (PCG)](../../../clusters/pcg/pcg.md), WAN tunnel, or AWS Private Link.

#### Add AWS Secret Cloud to Palette VerteX

1. Log in to Palette VerteX as tenant admin.

2. From the left **Main Menu**, click on **Tenant Settings**.

3. Select **Cloud Accounts**, and click **Add AWS Account**.

4. In the cloud account creation wizard, enter the following information:

   - **Account Name:** Custom name for the cloud account.

   - **Description:** Optional description for the cloud account.
   - **Partition:** Choose **AWS US Secret** from the **drop-down Menu**.

5. Toggle on **Secure Compliance Validation** and enter the following information.

   | **Parameter**                      | **Description**                                                                                                                                                                                                                                                                                                                                                                      |
   | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Agency Name**                    | Enter the CAP/SCAP agency name.                                                                                                                                                                                                                                                                                                                                                      |
   | **Account Name**                   | Enter the CAP/SCAP account name or number.                                                                                                                                                                                                                                                                                                                                           |
   | **CAP/SCAP Role Name**             | Enter the role name provided by the CAP/SCAP administrator. This role determines the AWS permissions granted to the account.                                                                                                                                                                                                                                                         |
   | **Role Prefix (Optional)**         | Choose a prefix to standardize role names. If no prefix is provided, a default prefix of `PROJECT_` is used. For example, if the initial role name is `DevOpsRole`, the full role name would be `PROJECT_DevOpsRole`. <br /> <br /> **Note**: The role name, including the prefix, cannot exceed 64 characters.                                                                      |
   | **Permission Boundary (Optional)** | If you want to apply a permission boundary and limit the maximum permissions a role or user can have, provide the IAM policy ARN (for example, `arn:aws:iam::123456789012:policy/MyPermissionBoundaryPolicy`). Refer to [Permissions boundaries for IAM entities](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) page for additional information. |
   | **Certificate Authority**          | Paste the CA certificate chain (root and intermediates) that signs the CAP/SCAP endpoint certificate or is required to validate the TLS chain. The chain must be in PEM-encoded format.                                                                                                                                                                                              |
   | **User Certificate**               | Paste your user-issued digital certificate in PEM-encoded format.                                                                                                                                                                                                                                                                                                                    |
   | **User Key**                       | Provide the private cryptographic key associated with the user certificate in PEM-encoded format.                                                                                                                                                                                                                                                                                    |

   :::info

   Palette VerteX is configured to work with CAP/SCAP endpoints for US regions. Users who need alternate endpoints can
   change these configurations on their [self-hosted Palette VerteX](../../../vertex/vertex.md) installation.

   <details>

   <summary> Custom CAP/SCAP endpoints </summary>

   1. Open a terminal window on a host that can connect to the Palette VerteX management cluster.
      [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/) must be installed on the host.

   2. Download the Palette VerteX management cluster's [Kubeconfig](../../cluster-management/kubeconfig.md) file.

   3. Open a terminal window and set the environment variable `KUBECONFIG` to point to the file you downloaded.

      ```shell
      export KUBECONFIG=<path-to-downloaded-kubeconfig-file>
      ```

   4. Use the following command to set a custom endpoint. Replace `<customized-endpoint-url>` with your own value.

      <Tabs>

      <TabItem value="secret" label="AWS Secret Cloud">

      ```shell
      kubectl --namespace hubble-system set env deployment/cloud CUSTOM_ISO_URL="<customized-endpoint-url>"
      ```

      </TabItem>

      <TabItem value="top-secret" label="AWS Top Secret Cloud">

      ```shell
      kubectl --namespace hubble-system set env deployment/cloud CUSTOM_ISOB_URL="<customized-endpoint-url>"
      ```

      </TabItem>

      </Tabs>

   5. Verify the change was applied.

      ```shell
      kubectl --namespace hubble-system get deploy cloud --output jsonpath='{.spec.template.spec.containers[*].env}'
      ```

      ```hideClipboard title="Example output"
      [{"name":"CUSTOM_ISO_URL","value":"<customized-endpoint-url>"}]
      ```

   </details>

   :::

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

<PartialsComponent category="clusters-aws-account-setup" name="aws-account-setup-validate" />

<!-- ### EKS Pod Identity

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-intro" partition="AWS US Secret" />

#### Limitations

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-limitations" partition="AWS US Secret" />

#### Prerequisites

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-prerequisites" partition="AWS US Secret" />

#### Enablement

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-enablement" partition="AWS US Secret" />

#### Validate

<PartialsComponent category="eks-pod-identity" name="eks-pod-identity-validate" partition="AWS US Secret" /> -->

## Next Steps

Now that you have added an AWS account to Palette, you can start deploying Kubernetes clusters to your AWS account. To
learn how to get started with deploying Kubernetes clusters to AWS, check out the following guides:

- [Create and Manage AWS IaaS Cluster](create-cluster.md)
- [Create and Manage AWS EKS Cluster](eks.md)
- [EKS Hybrid Nodes](./eks-hybrid-nodes/eks-hybrid-nodes.md)
