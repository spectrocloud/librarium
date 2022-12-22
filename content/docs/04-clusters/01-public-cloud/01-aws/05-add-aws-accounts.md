---
title: "Register and Manage AWS Accounts"
metaTitle: "Add an AWS Account to Palette"
metaDescription: "Learn how to add an AWS account to Palette."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Add AWS Account

Palette supports integration with AWS Cloud Accounts. This also includes support for [AWS GovCloud (US)](https://aws.amazon.com/govcloud-us/?whats-new-ess.sort-by=item.additionalFields.postDateTime&whats-new-ess.sort-order=desc) accounts. This section explains how to create an AWS cloud account in Palette. You can use any of the following authentication methods to register your cloud account.

- [AWS credentials](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html)

- [Security Token Service (STS)](https://docs.aws.amazon.com/STS/latest/APIReference/welcome.html)

<br />

<Tabs>

<Tabs.TabPane tab="AWS Account" key="AWS Account">

<Tabs>

<Tabs.TabPane tab="Using the Access Credentials Method" key="Using the Access Credentials Method">

To add an AWS cloud account using access credentials follow the steps below:

## Prerequisites

- An AWS account
- Sufficient access to create an IAM role or IAM user.
- Palette IAM policies. Please review the [Required IAM Policies](/clusters/public-cloud/aws/required-iam-policies) section for guidance.


## Add AWS Account to Palette
1. Create an IAM Role or IAM User for Palette. Use the following resources if you need additional help.
    - [IAM Role creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html).
    - [IAM User creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).


2. In the AWS console, assign the Palette required IAM policies to the role or the IAM user that Palette will use.


3. Log in to [Palette](https://console.spectrocloud.com) as Tenant Admin.


4. Go to **Tenant Settings** > **Cloud Accounts** and click **+Add AWS Account**.


5. In the cloud account creation wizard provide the following information:
   * **Account Name:** Custom name for the cloud account.

   * **Description:** Optional description for the cloud account.
   * **Partition:** Choose **AWS** from the drop-down menu.

   * **Credentials:**
       * AWS Access key
       * AWS Secret access key


6. Click the **Validate** button to validate the credentials. 

7. Once the credentials are validated, the **Add IAM Policies** toggle displays. Toggle **Add IAM Policies** on.

8. A drop-down menu displays a lists of available AWS IAM policies in your AWS account. Select any desired IAM policies you want to assign to Palette IAM role or IAM user.


## Validate

You can validate the account is available in Palette by reviewing the list of cloud accounts. To review the list of cloud accounts navigate to the left **Main Menu**. Click on **Tenant Settings**. Next, click on **Cloud Accounts**. Your newly added AWS cloud account is listed under the AWS sections.

</Tabs.TabPane>

<Tabs.TabPane tab="Using the Security Token Service (STS) Method" key="Using the Security Token Service (STS) Method">

<!-- The following video demonstrates how to create an IAM Role in AWS and attach the four necessary policies.

`video: title: "AWS-Cloud-Account": /cloud-accounts/aws-sts.mp4` -->

To add an AWS cloud account using STS credentials follow the steps below:

## Prerequisites

- An AWS account
- Sufficient access to create an IAM role or IAM user.
- Palette IAM policies. Please review the [Required IAM Policies](/clusters/public-cloud/aws/required-iam-policies) section for guidance.


## Add AWS Account to Palette

1. Log in to [Palette](https://console.spectrocloud.com) as Tenant Admin.


2. Go to **Tenant Settings** > **Cloud Accounts** and click **+Add AWS Account**.


3. In the cloud account creation wizard give the following information:
   * **Account Name**
   * **Description**
   * Select **STS** authentication for validation:


4. You will be provided with information on the right hand-side of the wizard. You will need this information to create an IAM Role for Palette. The following table lists out the information provided by the wizard after your selects **STS**.

    |**Parameter**|**Description**|
    |---------|---------------|
    |**Trusted Entity Type**| Another AWS account|
    |**Account ID**|Copy the Account ID displayed on the UI|
    |**Require External ID**| Enable|
    |**External ID**|Copy the External ID displayed on the UI|
    |**Permissions Policy**|Search and select the 4 policies added in step #2|
    |**Role Name**|SpectroCloudRole|

5. In the AWS console, create a new IAM role for Palette. Use the following resources if you need additional help.
    - [IAM Role creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html).
    - [IAM User creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).


6. In the AWS console, assign the [Palette required IAM policies](/clusters/public-cloud/aws/required-iam-policies) to the role that Palette will use.
    

7. In the AWS console, browse to the **Role Details** page and copy the Amazon Resource Name (ARN) for the role.


8. In Palette, paste the role arn into the **ARN** input box. 


9. Click the **Validate** button to validate the credentials.


## Validate

You can validate the account is available in Palette by reviewing the list of cloud accounts. To review the list of cloud accounts navigate to the left **Main Menu**. Click on **Tenant Settings**. Next, click on **Cloud Accounts**. Your newly added AWS cloud account is listed under the AWS sections.

</Tabs.TabPane>
</Tabs>




</Tabs.TabPane>

<Tabs.TabPane tab="AWS GovCloud Account" key="AWS GovCloud Account">

Palette supports integration with [AWS GovCloud (US)](https://aws.amazon.com/govcloud-us/?whats-new-ess.sort-by=item.additionalFields.postDateTime&whats-new-ess.sort-order=desc). Using Palette you can deploy Kubernetes clusters to your AWS GovCloud account. To get started with AWS GovClud and Palette, use the following steps.
<br />

<Tabs>

<Tabs.TabPane tab="Using the Access Credentials Method" key="GovCloud Using the Access Credentials Method">



To add an AWS GovCloud cloud account using the access credentials method follow the steps below:

## Prerequisites

- An AWS account
- Sufficient access to create an IAM role or IAM user.
- Palette IAM policies. Please review the [Required IAM Policies](/clusters/public-cloud/aws/required-iam-policies) section for guidance.

## Add AWS GovCloud Account to Palette

1. Create an IAM Role or IAM User for Palette. Use the following resources if you need additional help.
    - [IAM Role creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html).
    - [IAM User creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).


2. In the AWS console, assign the Palette required IAM policies to the role or the IAM user that Palette will use.


3. Log in to [Palette](https://console.spectrocloud.com) as Tenant Admin.


4. Go to **Tenant Settings** > **Cloud Accounts** and click **+Add AWS Account**.


5. In the cloud account creation wizard provide the following information:
   * **Account Name:** Custom name for the cloud account.

   * **Description:** Optional description for the cloud account.
   * **Partition:** Choose **AWS GovCloud US** from the drop-down menu.

   * **Credentials:**
       * AWS Access key
       * AWS Secret access key


6. Click the **Validate** button to validate the credentials. 

7. Once the credentials are validated, the **Add IAM Policies** toggle displays. Toggle **Add IAM Policies** on.

8. A drop-down menu displays a lists of available AWS IAM policies in your AWS account. Select any desired IAM policies you want to assign to Palette IAM role or IAM user.


## Validate

You can validate the account is available in Palette by reviewing the list of cloud accounts. To review the list of cloud accounts navigate to the left **Main Menu**. Click on **Tenant Settings**. Next, click on **Cloud Accounts**. Your newly added AWS cloud account is listed under the AWS sections.

</Tabs.TabPane>

<Tabs.TabPane tab="Using the Security Token Service (STS) Method" key="GovCloud Using the Security Token Service (STS) Method">

To add an AWS GovCloud cloud account using STS credentials follow the steps below:

## Prerequisites

- An AWS account
- Sufficient access to create an IAM role or IAM user.
- Palette IAM policies. Please review the [Required IAM Policies](/clusters/public-cloud/aws/required-iam-policies) section for guidance.


## Add AWS GovCloud Account to Palette

1. Log in to [Palette](https://console.spectrocloud.com) as Tenant Admin.


2. Go to **Tenant Settings** > **Cloud Accounts** and click **+Add AWS Account**.


3. In the cloud account creation wizard give the following information:
   * **Account Name**
   * **Description**
   * Select **STS** authentication for validation:


4. You will be provided with information on the right hand-side of the wizard. You will need this information to create an IAM Role for Palette. The following table lists out the information provided by the wizard after your selects **STS**.

    |**Parameter**|**Description**|
    |---------|---------------|
    |**Trusted Entity Type**| Another AWS account|
    |**Account ID**|Copy the Account ID displayed on the UI|
    |**Require External ID**| Enable|
    |**External ID**|Copy the External ID displayed on the UI|
    |**Permissions Policy**|Search and select the 4 policies added in step #2|
    |**Role Name**|SpectroCloudRole|

5. In the AWS console, create a new IAM role for Palette. Use the following resources if you need additional help.
    - [IAM Role creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html).
    - [IAM User creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).


6. In the AWS console, assign the [Palette required IAM policies](/clusters/public-cloud/aws/required-iam-policies) to the role that Palette will use.
    

7. In the AWS console, browse to the **Role Details** page and copy the Amazon Resource Name (ARN) for the role.


8. In Palette, paste the role arn into the **ARN** input box. 


9. Click the **Validate** button to validate the credentials.


## Validate

You can validate the account is available in Palette by reviewing the list of cloud accounts. To review the list of cloud accounts navigate to the left **Main Menu**. Click on **Tenant Settings**. Next, click on **Cloud Accounts**. Your newly added AWS cloud account is listed under the AWS sections.

</Tabs.TabPane>
</Tabs>

</Tabs.TabPane>


</Tabs>


# Next Steps

Now that you have added an AWS account to Palette, you can start deploying Kubernetes clusters to your AWS account. To learn how to get started with deploying Kubernetes clusters to AWS, check out the [Create and Manage AWS Iaas Cluster](/clusters/public-cloud/aws/create-cluster) guide or the [Create and Manage AWS EKS Cluster](/clusters/public-cloud/aws/eks) guide.