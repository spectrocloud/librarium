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

- At least one preconfigured MAAS cloud account with credentials.

# Enablement

`video: title: "maas-cluster-creation": ./cluster-creation-videos/maas.mp4`


To deploy a new MAAS cluster:

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the **Main** menu and click **Clusters**. Then click the **Add New Cluster** button.

3. Click **Deploy New Cluster** on the Create a New Cluster page. 

4. Select **MAAS** and click the **Start MAAS Configuration** button.

5. Provide basic cluster information: cluster name, description, and tags.

6. Select a cloud account from the drop-down menu and click **Next**.

7. Select a cluster profile created for the MAAS environment. The profile will be used as the cluster template.

8. Review and override pack parameters as desired and click **Next**. By default, parameters for all packs are set with values defined in the cluster profile.

9. Select a MAAS Cloud account and provide placement information.

    An account is auto-created as part of the cloud gateway setup and is available for provisioning of tenant clusters if permitted by the administrator.

10. Select a domain from the drop-down menu and click Next. ??? When permitted, the domain name is displayed in the Domain drop-down menu. ??

11. Configure the master and worker node pools. Enter values for properties listed in the tables.

#### Master Node Pool

| Property | Description |
|-----------|-------------|
| Name | A descriptive name for the node pool. |
| Size | Number of VMs to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5. |
| Allow worker capability | Select this option to allow workloads to be provisioned on master nodes. |
| Labels | Labels apply placement constraints on a pod. For example, you can add a label to make a node eligible to receive the workload. |
| Taints | Sets toleration to pods and allows (but does not require) the pods to schedule onto nodes with matching taints. |
| Instance type | The compute instance type to be used for all nodes in the node pool. |
| Availability Zones | These are multiple, isolated locations within each Region. When you choose one or more availability zones, Palette provides fault tolerance to guard against hardware failures and network failures by provisioning nodes across availability zones if multiple zones are selected. |
| Disk Size | Specify the required storage size. |


#### Worker Node Pool

| Property | Description |
|-----------|-------------|
| Name | A descriptive name for the node pool. |
| Size | Number of VMs to be provisioned for the node pool.|
| Rolling Update | Rolling update has two available options. Review the Update Parameter list below for more details. ?? |
| Labels | Labels apply placement constraints on a pod. For example, you can add a label to make a node eligible to receive the workload. |
| Taints | Sets toleration to pods and allows (but does not require) the pods to schedule onto nodes with matching taints. |
| Instance type | The compute instance type to be used for all nodes in the node pool. |
| Availability Zones | These are multiple, isolated locations within each Region. When you choose one or more availability zones, Palette provides fault tolerance to guard against hardware failures and network failures by provisioning nodes across availability zones if multiple zones are selected. |
| Disk Size | Specify the required storage size. |


12. You can configure the following cluster management features now if needed, or you can do it later:

- Manage Machines
- Scan Policies
- Backup Policies
- Review settings and deploy the cluster. 

13. Review settings and deploy the cluster. 


# Validation

As your cluster is created, its status displays as Provisioning. To view provisioning status and provisioning tasks select Clusters in the Main Menu.



[Find a better place for this ] An account is auto-created as part of the cloud gateway setup and is available for provisioning tenant clusters if you permit it. When permitted, the domain name is displayed in the Domain drop-down menu.

# Delete a MAAS Cluster

When you delete a MAAS cluster, all virtual machines and associated storage disks that were created for the cluster are removed. 

Follow these steps to delete a MAAS cluster:

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the **Main** menu and click **Clusters**. 
3. Select the cluster you want to delete,
4. Click the **Settings drop-down Menu**, and choose **Delete**.

The cluster status is updated to Deleting while cluster resources are being deleted. When all resources are successfully deleted, the cluster status is updated to Deleted and the cluster is removed from the list. The delete operation returns the edge hosts to the Ready state. All the artifacts related to the Kubernetes distribution are removed. After the delete process, the edge hosts are available for deployment to a new cluster.


## Force Delete a Cluster

If a cluster is stuck in the Deletion state for a minimum of 15 minutes it becomes eligible for force deletion. You can force delete a cluster from the tenant and project admin scope. To force delete a cluster follow the same steps outlined in Delete a MAAS Cluster. However, after 15 minutes, a Force Delete Cluster option is available in the Settings drop-down menu. The Settings drop-down menu will provide you with an estimated time left before the force deletion becomes available.

<InfoBox>
A force delete can result in resources Palette provisioned to be missed in the removal process. Verify there are no remaining Palette provisioned resources such as:

- VPC
- Elastic IP
- Elastic Network Interfaces
- Internet Gateway
- Elastic Load Balancers
- EBS Volumes
- NAT Gateway

Failure to remove provisioned resources can result in unexpected costs.
</InfoBox>

# Next Steps

Now that you’ve deployed a MAAS cluster, you can start developing and deploying applications to your cluster. We recommend you review the day two responsibilities and become familiar with the cluster management tasks. Check out the Manage Clusters documentation to learn more about day two responsibilities.



<br />

<br />
