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

<PartialsComponent category="clusters-aws-account-setup" name="aws-static-credentials-enablement-1" partition="AWS" />

6. <PartialsComponent
     category="clusters-aws-account-setup"
     name="aws-static-dynamic-credentials-enablement-2"
     edition="Palette or Palette VerteX"
   />

#### Validate

<PartialsComponent category="clusters-aws-account-setup" name="aws-account-setup-validate" />

### Dynamic Access Credentials

Use the steps below to add an AWS cloud account using Security Token Service (STS) credentials.

#### Prerequisites

<PartialsComponent category="clusters-aws-account-setup" name="aws-dynamic-credentials-prerequisites" />

#### Add AWS Account to Palette

<PartialsComponent category="clusters-aws-account-setup" name="aws-dynamic-credentials-enablement-1" partition="AWS" />

9. <PartialsComponent
     category="clusters-aws-account-setup"
     name="aws-static-dynamic-credentials-enablement-2"
     edition="Palette or Palette VerteX"
   />

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
[AWS GovCloud](https://aws.amazon.com/govcloud-us/?whats-new-ess.sort-by=item.additionalFields.postDateTime&whats-new-ess.sort-order=desc).
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

<PartialsComponent
  category="clusters-aws-account-setup"
  name="aws-static-credentials-enablement-1"
  partition="AWS US Gov"
/>

6. <PartialsComponent
     category="clusters-aws-account-setup"
     name="aws-static-dynamic-credentials-enablement-2"
     edition="Palette or Palette VerteX"
   />

#### Validate

<PartialsComponent category="clusters-aws-account-setup" name="aws-account-setup-validate" />

### Dynamic Access Credentials

Use the steps below to add an AWS cloud account using STS credentials.

#### Prerequisites

<PartialsComponent category="clusters-aws-account-setup" name="aws-dynamic-credentials-prerequisites" />

#### Add AWS GovCloud Account to Palette

<PartialsComponent
  category="clusters-aws-account-setup"
  name="aws-dynamic-credentials-enablement-1"
  partition="AWS US Gov"
/>

9. <PartialsComponent
     category="clusters-aws-account-setup"
     name="aws-static-dynamic-credentials-enablement-2"
     edition="Palette or Palette VerteX"
   />

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

You can configure [AWS Secret](https://aws.amazon.com/federal/secret-cloud/) and
[Top Secret cloud](<(https://aws.amazon.com/federal/top-secret-cloud/)>) accounts in
[Palette VerteX](../../../vertex/vertex.md) to deploy AWS EKS clusters in AWS Secret and Top Secret clouds. Depending on
your organization's compliance requirements, you can register your AWS cloud account using either standard
authentication (access key and secret access key pairs for IAM users) or secure compliance validation (SC2S Access
Portal (SCAP) or C2S Access Portal (CAP) credentials).

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

Use the steps below to add an AWS Secret or Top Secret cloud account using static access credentials.

#### Prerequisites

- [Palette VerteX installed](../../../vertex/install-palette-vertex/install-palette-vertex.md).

- <PartialsComponent
    category="clusters-aws-account-setup"
    name="aws-static-credentials-prerequisites"
    edition="Palette VerteX"
  />

- The **AwsSecretPartition** [feature flag](../../../vertex/system-management/feature-flags.md) enabled in the Palette
  VerteX [system console](../../../vertex/system-management/system-management.md).

- The Certificate Authority (CA) certificate (root, intermediate, or chain of trust) for your AWS Secret or Top Secret
  cloud account in PEM-encoded format.

- A secure connection to your AWS Secret Cloud or Top Secret Cloud account, such as via a
  [Private Cloud Gateway (PCG)](../../../clusters/pcg/pcg.md), Wide Area Network (WAN) tunnel, or AWS Private Link.

#### Add AWS Secret or Top Secret Cloud to Palette VerteX

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Cloud Accounts**.

4. Locate the **AWS** section and select **Add AWS Account**.

5. Fill out the following information.

   | **Parameter**                    | **Description**                                                                                                                                                                                                                                                                      |
   | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Account Name**                 | Enter a custom account name. The account name must be unique within the tenant scope.                                                                                                                                                                                                |
   | **Description (Optional)**       | Enter a description for the cloud account.                                                                                                                                                                                                                                           |
   | **Partition**                    | Select either **AWS US Secret** or **AWS US Top Secret**.                                                                                                                                                                                                                            |
   | **Credentials**                  | Select **Credentials** to authenticate your AWS account using static access credentials.                                                                                                                                                                                             |
   | **Secure Compliance Validation** | Keep disabled.                                                                                                                                                                                                                                                                       |
   | **Access key**                   | Enter your IAM user's access key. This is found in the **Summary** section of your AWS **IAM > Users** dashboard. Refer to [Manage access keys for IAM users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) for more information on access keys. |
   | **Secret access key**            | Enter your IAM user's secret access key that corresponds to the **Access key**. This key cannot be viewed or regenerated after the initial creation of your **Access key**. If you cannot retrieve your secret access key, you must create a new access key pair.                    |
   | **Certificate Authority**        | Paste the PEM-encoded root, intermediate, or chain of trust CA certificate for your AWS Secret or Top Secret cloud account.                                                                                                                                                          |

6. <PartialsComponent
     category="clusters-aws-account-setup"
     name="aws-static-dynamic-credentials-enablement-2"
     edition="Palette VerteX"
   />

#### Validate

<PartialsComponent category="clusters-aws-account-setup" name="aws-account-setup-validate" />

### Secure Compliance Validation Credentials

Use the steps below to add an AWS Secret or Top Secret cloud account using CAP/SCAP credentials.

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

- The CA certificate (root, intermediate, or chain of trust) and private key in PEM-encoded format.

- A secure connection to your AWS Secret Cloud or Top Secret Cloud account, such as via a
  [Private Cloud Gateway (PCG)](../../../clusters/pcg/pcg.md), WAN tunnel, or AWS Private Link.

#### Add AWS Secret or Top Secret Cloud to Palette VerteX

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Cloud Accounts**.

4. Locate the **AWS** section and select **Add AWS Account**.

5. Fill out the following information.

   | **Parameter**                                    | **Description**                                                                                                                                                                                                                                                                                                 |
   | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Account Name**                                 | Enter a custom account name. The account name must be unique within the tenant scope.                                                                                                                                                                                                                           |
   | **Description (Optional)**                       | Enter a description for the cloud account.                                                                                                                                                                                                                                                                      |
   | **Partition**                                    | Select either **AWS US Secret** or **AWS US Top Secret**.                                                                                                                                                                                                                                                       |
   | **Credentials**                                  | Select **Credentials**.                                                                                                                                                                                                                                                                                         |
   | **Secure Compliance Validation**                 | Enable **Secure Compliance Validation** to authenticate with your CAP/SCAP credentials.                                                                                                                                                                                                                         |
   | **Agency Name**                                  | Enter the CAP/SCAP agency name.                                                                                                                                                                                                                                                                                 |
   | **Account Name**                                 | Enter the CAP/SCAP account name or number.                                                                                                                                                                                                                                                                      |
   | **CAP/SCAP Role Name**                           | Enter the role name provided by the CAP/SCAP administrator. This role determines the AWS permissions granted to the account.                                                                                                                                                                                    |
   | **Role Prefix (Optional)**                       | Choose a prefix to standardize role names. If no prefix is provided, a default prefix of `PROJECT_` is used. For example, if the initial role name is `DevOpsRole`, the full role name would be `PROJECT_DevOpsRole`. <br /> <br /> **Note**: The role name, including the prefix, cannot exceed 64 characters. |
   | **Permission Boundary (Optional)**               | If you want to apply a permission boundary and limit the maximum permissions a role or user can have, provide the IAM policy ARN. Refer to [Permissions boundaries for IAM entities](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) for additional information.              |
   | **Certificate Authority**                        | Paste the CA certificate chain (root and intermediates) that signs the CAP/SCAP endpoint certificate or is required to validate the TLS chain. The chain must be in PEM-encoded format.                                                                                                                         |
   | **User Certificate**                             |
   | Paste the NPE certificate in PEM-encoded format. |
   | **User Key**                                     | Paste the NPE certificate private key in PEM-encoded format.                                                                                                                                                                                                                                                    |

:::info

Palette VerteX is configured to work with CAP/SCAP endpoints for US regions. Users who need alternate endpoints can
change these configurations on their [self-hosted Palette VerteX](../../../vertex/vertex.md) installation.

   <details>

<summary> Custom CAP/SCAP endpoints </summary>

1.  Open a terminal window on a host that can connect to the Palette VerteX management cluster.
    [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/) must be installed on the host.

2.  Download the Palette VerteX management cluster's [Kubeconfig](../../cluster-management/kubeconfig.md) file.

3.  Open a terminal window and set the environment variable `KUBECONFIG` to point to the file you downloaded.

    ```shell
    export KUBECONFIG=<path-to-downloaded-kubeconfig-file>
    ```

4.  Use the following command to set a custom endpoint. Replace `<customized-endpoint-url>` with your own value.

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

5.  Verify the change was applied.

    ```shell
    kubectl --namespace hubble-system get deploy cloud --output jsonpath='{.spec.template.spec.containers[*].env}'
    ```

    ```hideClipboard title="Example output"
    [{"name":"CUSTOM_ISO_URL","value":"<customized-endpoint-url>"}]
    ```

   </details>

:::

6. <PartialsComponent
     category="clusters-aws-account-setup"
     name="aws-static-dynamic-credentials-enablement-2"
     edition="Palette VerteX"
   />

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
