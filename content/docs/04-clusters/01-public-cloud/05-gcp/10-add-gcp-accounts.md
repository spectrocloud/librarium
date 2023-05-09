---
title: "Register and Manage GCP Accounts"
metaTitle: "Add a GCP Account to Palette"
metaDescription: "Learn how to add a GCP account to Palette."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Add GCP Account


Palette supports integration with Google Cloud Platform (GCP) accounts. This section explains how to create a GCP cloud account in Palette. 

# Prerequisites

* You must have a GCP service account available for use with Palette. For detailed instructions on creating a service account refers to [Creating and managing service accounts](https://cloud.google.com/iam/docs/creating-managing-service-accounts).



* The service account must at a minimum have the following roles assigned. 
    - Compute Admin
    - Service Account User
    - Storage Object Viewer

    <br />

    <InfoBox>

    Alternatively, you can create a custom role and assign the Palette required GCP permissions. Check out the [Required IAM Permission](/clusters/public-cloud/gcp/required-permissions) for a detailed list of all permissions.

    </InfoBox>




* Ensure you have access to the JSON credential file for your service account. Refer to the [GCP Credentials](https://developers.google.com/workspace/guides/create-credentials) documentation for additional guidance.

# Create Account


1. Log in to [Palette](https://console.spectrocloud.com) as Tenant admin.


2. Navigate to the left **Main Menu** and select **Tenant Settings**.


3. Select **Cloud Accounts** and click on **Add GCP Account**.


4. In the cloud account creation wizard provide the following information:
   * **Account Name:** Custom name for the cloud account.

   * **JSON Credentials:** The JSON credentials object.

    <br />

   <InfoBox>

    You can use the **Upload** button to upload the JSON file you downloaded from the GCP console.

   </InfoBox>


6. Click the **Validate** button to validate the credentials. 


7. Once the credentials are validated, click on **Confirm** to save your changes.

# Validation

You can validate the account is available in Palette by reviewing the list of cloud accounts. 

1. Log in to [Palette](https://console.spectrocloud.com) as Tenant admin.


2. To review the list of cloud accounts navigate to the left **Main Menu** and click on **Tenant Settings**. 


3. Next, click on **Cloud Accounts**. Your newly added GCP account is listed under the GCP section


# Next Steps


Now that you have added an AWS account to Palette, you can start deploying Kubernetes clusters to your GCP account. To learn how to get started with deploying Kubernetes clusters to GCP, check out the [Create and Manage GCP IaaS Cluster](/clusters/public-cloud/aws/create-cluster) guide or the [Create and Manage AWS GKE Cluster](/clusters/public-cloud/aws/eks) guide.