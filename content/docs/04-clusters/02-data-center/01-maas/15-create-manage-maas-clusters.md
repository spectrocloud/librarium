---
title: "Create and Manage MAAS Clusters"
metaTitle: "Create and Manage MAAS Clusters"
metaDescription: "Learn how to create and manage MAAS clusters in Palette."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview 

Palette supports creating and managing Kubernetes clusters deployed to a MAAS account. This section guides you on how to create a Kubernetes cluster in MAAS that is managed by Palette.

# Prerequisites

- An installed Private Cloud Gateway (PCG). Review [Install and Manage MAAS Gateway](/clusters/data-center/maas/install-manage-maas-pcg) for guidance.


- A MAAS account registered in Palette. Refer to the [Register and Manage MAAS Cloud Accounts](/clusters/data-center/maas/register-manage-maas-cloud-accounts) if you need to register a MAAS account in Palette.


- A cluster profile for the MAAS environment. Review [Cluster Profiles](/cluster-profiles) for more information. 

# Deploy a MAAS cluster

To deploy a new MAAS cluster:

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Navigate to the **Main Menu** and click **Clusters**. Then click the **Add New Cluster** button.


3. Click **Deploy New Cluster** on the Create a New Cluster page.


4. Select **MAAS** and click the **Start MAAS Configuration** button.


5. Provide basic cluster information: **Cluster name**, **Description**, and **Tags**.


6. Select your MAAS cloud account from the **drop-down Menu** and click **Next**.


7. Select the cluster profile for your MAAS cluster. 


8. Review and override pack parameters as desired and click **Next**. By default, parameters for all packs are set with values defined in the cluster profile.


9. Select a domain from the **Domain drop-down Menu** and click **Next**. 


10. Configure the master and worker node pools. Review the [Node Pool management](https://docs.spectrocloud.com/clusters/cluster-management/node-pool) page to learn more.


11. You can configure the following cluster management features now if needed, or you can do it later:

    - Manage machines
    - Schedule scans
    - Schedule backups
    - Role-based access control (RBAC)
    - Location 


12. Review settings and deploy the cluster. 


## Validation

You can validate your cluster is available by reviewing the cluster details page. Navigate to the left **Main Menu** and click **Clusters**. The **Clusters** page lists all available clusters that Palette manages. Select the cluster to review its details page. Ensure the **Cluster Status** field contains the value **Running**.

<br />

# Delete a MAAS Cluster

When you delete a MAAS cluster, all machines and associated storage disks that were created for the cluster are removed. 

Follow these steps to delete a MAAS cluster.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Navigate to the **Main Menu** and click **Clusters**. 


3. Select the cluster you want to delete.


4. Click the **Settings drop-down Menu**, and choose **Delete**.

The cluster status is updated to **Deleting** while cluster resources are being deleted. When all resources are successfully deleted, the cluster status is updated to **Deleted** and the cluster is removed from the list. The delete operation returns the edge hosts to the **Ready** state. All the artifacts related to the Kubernetes distribution are removed.

<br />

## Force Delete a Cluster

If a cluster is stuck in the Deletion state for a minimum of 15 minutes it becomes eligible for force deletion. You can force delete a cluster from the tenant and project admin scopes. To force delete a cluster, follow the same steps outlined in [Delete a MAAS Cluster](/clusters/data-center/maas/create-manage-maas-clusters#deleteamaascluster). After 15 minutes, a **Force Delete Cluster** option is available in the **Settings drop-down menu**. The drop-down menu will provide you with an estimated remaining duration before the force deletion becomes available.

<br />

<WarningBox>

A force delete can result in Palette-provisioned resources being missed during the removal process. Verify that any MAAS machines associated with the cluster have been released. Failure to remove provisioned resources can result in unexpected costs.

</WarningBox>

# Next Steps

Now that you’ve deployed a MAAS cluster, you can start developing and deploying applications to your cluster. We recommend you review the Day-2 operations and become familiar with the cluster management tasks. Check out the [Manage Clusters](/clusters/cluster-management) documentation to learn more about Day-2 responsibilities.



<br />

<br />
