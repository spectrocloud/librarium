---
title: "Create a Cluster"
metaTitle: "Create a Cluster Profile"
metaDescription: "Learn how to deploy a FIPS-enabled cluster."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview



# Prerequisites

- A FIPS-enabled cluster profile. Refer to [Create a FIPS-enabled Cluster Profile](/vertex/migrate-cluster-to-enterprise-mode/create-profile).



# Deploy a FIPS-Enabled Cluster

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Navigate to the **Left Main Menu** and select **Clusters**.


3. Click **Add New Cluster**. On the next screen that displays, click **Deploy New Cluster**. 


4. Select **AWS**.


5. Provide basic cluster information to the cluster creation wizard: Cluster name, Description, and Tags. Select your AWS cloud account, and click **Next**.


6. Select a region and provide the SSH key pair for your cloud account. 


7. Enable the **FIPS Mode** option to pull FIPS images from the artifact repository.


8. Configure the master-pool and worker-pool.


9. Enable settings for **Patch OS on boot** and **Reboot if required**. Click **Next**.


10. Review cluster details and click **Finish Configuration**. The Cluster Overview page displays Cluster Status as **Provisioning**.


11. To apply the FIPS-enabled profile to the cluster, click the **Settings drop-down Menu** and choose **Edit**.


12. In the **Edit Cluster** page, select the FIPS-enabled profile you created from the **Profile dropdown Menu**.


13. Save your changes.


# Validation


# Next Steps









