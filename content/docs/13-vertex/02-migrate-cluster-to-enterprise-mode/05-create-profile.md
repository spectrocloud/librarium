---
title: "Create a Cluster Profile"
metaTitle: "Create a Cluster Profile"
metaDescription: "Learn how to create a FIPS-enabled cluster profile."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

If you created tenants to use for a POC prior to enterprise cluster migration, you can use that tenant to create a cluster profile. When you create the profile, you need to enable FIPS. The following steps guide you to create a FIPS-enabled cluster profile in a tenant.

# Prerequisites

- Completed migrating a VM instance to a three-node High Availability (HA) cluster.

- An Amazon Web Services (AWS) cloud account.


# Create a FIPS-Enabled Cluster Profile

1. If you have not already created a tenant, click the **New Tenant** button. 


2. In the **Left Main Menu**, navigate to **Tenant Management** and select **Activate** in the **three-dot Menu**. A message will display that contains an activation link. 


3. Copy the activation link to the clipboard.


4. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


5. Add the FIPS Artifact Repository to Palette by invoking the command below. ??Or does customer use an API??

    ``./update-scar.sh <Palette_URL> <system_admin_username> <system_admin_password>``

<br />

6. Navigate to the **Left Main Menu** and select **Profiles**. 


7. Click on **Add Cluster Profile**.


8. Enter a cluster profile name and select the type ??. Click on **Next**.


9. In the next screen that displays, select **Full** or **Infrastructure**


10. Select cloud type **AWS**.


11. Use the following information to find the FIPS-enabled Operating System (OS) and Kubernetes packs.
    - **Pack Type**: OS
    - **Registry**: Public Repo
    - **Pack Name**: Ubuntu
    - **Pack Version**: ubuntu-aws LTS__20.04 or higher

    <br />

12. Click **Presets** to the right of the YAML file, enable the **Ubuntu Advantage** option, and provide your user authorization key in the **Token** field. 


13. Toggle on the **fips** and **fips-updates** options.


14. Use the following information to find the FIPS-enabled Operating System (OS) and Kubernetes packs.
    - **Pack Type**: Kubernetes
    - **Registry**: Public Repo
    - **Pack Name**: Kubernetes (Fips)
    - **Pack Version**: 1.23.x or higher

    <br />

15. Add the network and storage layers to the profile. We recommend using Amazon EBS CSI for your network layer. 


16. Click **Next**, then click **Finish** to save and publish the profile.


# Validation

You can validate the cluster profile is created. 

<br />

1. Navigate to the **Left Main Menu** and select **Profiles**.


2. The profile you created will be listed in the table. 


3. You can select the profile to review its details. 


# Next Steps

Now you are ready to create your FIPS-enabled cluster and apply the FIPS-enabled profile to it.


# Resources

- [Create a FIPS-Enabled Cluster](/vertex/migrate-cluster-to-enterprise-mode/create-cluster)




 




