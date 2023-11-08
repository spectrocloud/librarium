---
sidebar_label: "Register and Manage AWS Accounts"
title: "Add an AWS Account to Palette"
description: "Learn how to add an AWS account to Palette."
hide_table_of_contents: false
tags: ["public cloud", "aws", "iam"]
sidebar_position: 10
---


Palette supports integration with AWS Cloud Accounts. This also includes support for [AWS GovCloud (US)](https://aws.amazon.com/govcloud-us/?whats-new-ess.sort-by=item.additionalFields.postDateTime&whats-new-ess.sort-order=desc) accounts. This section explains how to create an AWS cloud account in Palette. You can use any of the following authentication methods to register your cloud account.

- AWS 
    - [Static Access Credentials](#static-access-credentials)
    - [Dynamic Access Credentials](#dynamic-access-credentials)
- AWS GovCloud
    - [Static Access Credentials](#static-access-credentials-1)
    - [Dynamic Access Credentials](#dynamic-access-credentials-1)



## AWS Account

This section provides guidance in creating an AWS account that uses static or dynamic access credentials.

### Static Access Credentials

Use the steps below to add an AWS cloud account using static access credentials.

#### Prerequisites

- An AWS account
- Sufficient access to create an IAM role or IAM user.
- Palette IAM policies. Review the [Required IAM Policies](required-iam-policies.md) section for guidance.


#### Add AWS Account to Palette
1. Create an IAM Role or IAM User for Palette. Use the following resources if you need additional help.
    - [IAM Role creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html).
    - [IAM User creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).


2. In the AWS console, assign the Palette-required IAM policies to the IAM role or the IAM user that Palette will use.


3. Log in to [Palette](https://console.spectrocloud.com) as tenant admin.


4. From the left **Main Menu**, click on **Tenant Settings**. 


5. Select **Cloud Accounts**, and click **+Add AWS Account**.


6. In the cloud account creation wizard provide the following information:
   * **Account Name:** Custom name for the cloud account.

   * **Description:** Optional description for the cloud account.
   * **Partition:** Choose **AWS** from the **drop-down Menu**.

   * **Credentials:**
       * AWS Access key
       * AWS Secret access key


7. Click the **Validate** button to validate the credentials. 

8. Once the credentials are validated, the **Add IAM Policies** toggle displays. Toggle **Add IAM Policies** on.

9. Use the **drop-down Menu**, which lists available IAM policies in your AWS account, to select any desired IAM policies you want to assign to Palette IAM role or IAM user.


#### Validate

You can validate the account is available in Palette by reviewing the list of cloud accounts. To review the list of cloud accounts, navigate to the left **Main Menu** and click on **Tenant Settings**. Next, click on **Cloud Accounts**. Your newly added AWS cloud account is listed under the AWS section.



### Dynamic Access Credentials

Use the steps below to add an AWS cloud account using Security Token Service (STS) credentials.

#### Prerequisites

- An AWS account.
- Sufficient access to create an IAM role or IAM user.
- Palette IAM policies. Review the [Required IAM Policies](required-iam-policies.md) section for guidance.


#### Add AWS Account to Palette

1. Log in to [Palette](https://console.spectrocloud.com) as tenant admin.


2. From the left **Main Menu**, click on **Tenant Settings**.


3. Select **Cloud Accounts**, and click **+Add AWS Account**.


4. In the cloud account creation wizard give the following information:
   * **Account Name**:  Custom name for the cloud account.
   * **Description**: Optional description for the cloud account.
   * Select **STS** authentication for validation.


5. You will be provided with information on the right side of the wizard. You will need this information to create an IAM Role for Palette. The following table lists the information provided by the wizard after you select **STS**.

    |**Parameter**|**Description**|
    |---------|---------------|
    |**Trusted Entity Type**| Another AWS account|
    |**Account ID**|Copy the Account ID displayed on the UI|
    |**Require External ID**| Enable|
    |**External ID**|Copy the External ID displayed on the UI|
    |**Permissions Policy**|Search and select the 4 policies added in step 2|
    |**Role Name**|SpectroCloudRole|

6. In the AWS console, create a new IAM role for Palette. Use the following resources if you need additional help.
    - [IAM Role creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html).
    - [IAM User creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).


7. In the AWS console, assign the [Palette required IAM policies](required-iam-policies.md) to the role that Palette will use.
    

8. In the AWS console, browse to the **Role Details** page and copy the Amazon Resource Name (ARN) for the role.


9. In Palette, paste the role ARN into the **ARN** input box. 


10. Click the **Validate** button to validate the credentials.


#### Validate

You can validate the account is available in Palette by reviewing the list of cloud accounts. To review the list of cloud accounts navigate to the left **Main Menu**. Click on **Tenant Settings**. Next, click on **Cloud Accounts**. Your newly added AWS cloud account is listed under the AWS section.






## AWS GovCloud Account

Palette supports integration with [AWS GovCloud (US)](https://aws.amazon.com/govcloud-us/?whats-new-ess.sort-by=item.additionalFields.postDateTime&whats-new-ess.sort-order=desc). Using Palette you can deploy Kubernetes clusters to your AWS GovCloud account. This section provides guidance in creating an AWS GovCloud account that uses static or dynamic access credentials.

### Static Access Credentials

Use the steps below to add an AWS cloud account using static access credentials.


#### Prerequisites

- An AWS account
- Sufficient access to create an IAM role or IAM user.
- Palette IAM policies. Please review the [Required IAM Policies](required-iam-policies.md) section for guidance.

#### Add AWS GovCloud Account to Palette

1. Create an IAM Role or IAM User for Palette. Use the following resources if you need additional help.
    - [IAM Role creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html).
    - [IAM User creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).


2. In the AWS console, assign the Palette required IAM policies to the role or the IAM user that Palette will use.


3. Log in to [Palette](https://console.spectrocloud.com) as Tenant admin.


4. From the left **Main Menu**, click on **Tenant Settings**.


5. Select **Cloud Accounts**, and click **+Add AWS Account**.


6. In the cloud account creation wizard provide the following information:
   * **Account Name:** Custom name for the cloud account.

   * **Description:** Optional description for the cloud account.
   * **Partition:** Choose **AWS GovCloud US** from the drop-down menu.

   * **Credentials:**
       * AWS Access key
       * AWS Secret access key


7. Click on the **Validate** button to validate the credentials. 

8. Once the credentials are validated, the **Add IAM Policies** toggle displays. Toggle **Add IAM Policies** on.

9. Use the **drop-down Menu**, which lists available IAM policies in your AWS account, to select any desired IAM policies you want to assign to Palette IAM role or IAM user.


#### Validate

You can validate the account is available in Palette by reviewing the list of cloud accounts. To review the list of cloud accounts navigate to the left **Main Menu**. Click on **Tenant Settings**. Next, click **Cloud Accounts**. Your newly added AWS cloud account is listed under the AWS section.

### Dynamic Access Credentials

Use the steps below to add an AWS cloud account using STS credentials.

#### Prerequisites

- An AWS account
- Sufficient access to create an IAM role or IAM user.
- Palette IAM policies. Please review the [Required IAM Policies](required-iam-policies.md) section for guidance.


#### Add AWS GovCloud Account to Palette

1. Log in to [Palette](https://console.spectrocloud.com) as Tenant admin.


2. From the left **Main Menu**, click on **Tenant Settings**.


3. Select **Cloud Accounts**, and click **+Add AWS Account**.


4. In the cloud account creation wizard give the following information:
   * **Account Name**
   * **Description**
   * Select **STS** authentication for validation:


5. You will be provided with information on the right side of the wizard. You will need this information to create an IAM Role for Palette. The following table lists the information provided by the wizard after you select **STS**.

    |**Parameter**|**Description**|
    |---------|---------------|
    |**Trusted Entity Type**| Another AWS account|
    |**Account ID**|Copy the Account ID displayed on the UI|
    |**Require External ID**| Enable|
    |**External ID**|Copy the External ID displayed on the UI|
    |**Permissions Policy**|Search and select the 4 policies added in step #2|
    |**Role Name**|SpectroCloudRole|

6. In the AWS console, create a new IAM role for Palette. Use the following resources if you need additional help.
    - [IAM Role creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html).
    - [IAM User creation guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).


7. In the AWS console, assign the [Palette required IAM policies](required-iam-policies.md) to the role that Palette will use.
    

8. In the AWS console, browse to the **Role Details** page and copy the Amazon Resource Name (ARN) for the role.


9. In Palette, paste the role ARN into the **ARN** input box. 


10. Click on the **Validate** button to validate the credentials.


#### Validate

You can validate the account is available in Palette by reviewing the list of cloud accounts. To review the list of cloud accounts navigate to the left **Main Menu**. Click on **Tenant Settings**. Next, click on **Cloud Accounts**. Your newly added AWS cloud account is listed under the AWS sections.


## Next Steps

Now that you have added an AWS account to Palette, you can start deploying Kubernetes clusters to your AWS account. To learn how to get started with deploying Kubernetes clusters to AWS, check out the [Create and Manage AWS IaaS Cluster](create-cluster.md) guide or the [Create and Manage AWS EKS Cluster](eks.md) guide.