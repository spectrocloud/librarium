---
title: "GCP"
metaTitle: "Creating new clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';

# Overview

Following are some of the highlights of GCP clusters provisioned by Spectro Cloud:

* On the GCP cluster, control plane nodes and worker nodes are placed within a single private subnet spanning across different availability zones within a region.
* A new VPC Network is created with all the network infrastructure components like Cloud NAT and a Cloud Router. In addition, firewall rules are created to protect all the API endpoints.
* API server endpoint is exposed through a Global Load Balancer. Applications running with the cluster use a Regional Load Balancer to expose the load-balancer services.

![gcp_cluster_architecture.png](gcp_cluster_architecture.png)

# Prerequisites

The following are the prerequisites for deploying a workload cluster on GCP:

* You must have an active GCP service account with all the permissions listed below in the "GCP Cloud Account Permissions" section.
* You must register your GCP cloud account in Spectro Cloud as described in the "Creating a GCP Cloud account" section below.
* You should have an Infrastructure cluster profile created in Spectro Cloud for GCP.
* Spectro Cloud creates compute, network, and storage resources on GCP during the provisioning of Kubernetes clusters. Therefore, Sufficient capacity in the desired GCP region should exist for the creation of the cluster.
  
# GCP Cloud Account Permissions

You need to create a service account in GCP with the required permissions and register it with Spectro Cloud to create a GCP cloud account in Spectro Cloud.  To create a service account, you should have one of the following IAM roles:
`roles/iam.serviceAccountAdmin` or `roles/editor`. For detailed instructions on creating a service account refers to  https://cloud.google.com/iam/docs/creating-managing-service-accounts.

You can create a service account either using existing standard roles, or create a new role with custom permissions.

## Create Service Account with existing standard roles

The service account should have the following roles:

1. Compute Admin
1. Service Account User
1. Storage Object Viewer

## Create Service Account with a new role with custom permissions

The custom new role should include these minimum permissions:

```
compute.backendServices.create
compute.backendServices.delete
compute.backendServices.get
compute.backendServices.list
compute.backendServices.update
compute.backendServices.use
compute.disks.create
compute.firewalls.create
compute.firewalls.delete
compute.firewalls.get
compute.firewalls.list
compute.globalAddresses.create
compute.globalAddresses.delete
compute.globalAddresses.get
compute.globalAddresses.list
compute.globalAddresses.use
compute.globalForwardingRules.create
compute.globalForwardingRules.delete
compute.globalForwardingRules.get
compute.globalForwardingRules.list
compute.healthChecks.create
compute.healthChecks.delete
compute.healthChecks.get
compute.healthChecks.list
compute.healthChecks.useReadOnly
compute.instanceGroups.create
compute.instanceGroups.delete
compute.instanceGroups.get
compute.instanceGroups.list
compute.instanceGroups.update
compute.instanceGroups.use
compute.instances.create
compute.instances.delete
compute.instances.get
compute.instances.list
compute.instances.setLabels
compute.instances.setMetadata
compute.instances.setServiceAccount
compute.instances.setTags
compute.instances.use
compute.networks.create
compute.networks.delete
compute.networks.get
compute.networks.list
compute.networks.updatePolicy
compute.regions.get
compute.regions.list
compute.routers.create
compute.routers.delete
compute.routers.get
compute.routes.delete
compute.routes.get
compute.routes.list
compute.subnetworks.create
compute.subnetworks.delete
compute.subnetworks.get
compute.subnetworks.list
compute.subnetworks.use
compute.targetTcpProxies.create
compute.targetTcpProxies.delete
compute.targetTcpProxies.get
compute.targetTcpProxies.use
compute.zones.get
compute.zones.list
iam.serviceAccounts.actAs
iam.serviceAccounts.get
iam.serviceAccounts.list
resourcemanager.projects.get
resourcemanager.projects.list
storage.objects.get
storage.objects.list
```

Retrieve the JSON credential file for your service account. For detailed instructions on creating your service account keys refer to https://cloud.google.com/iam/docs/creating-managing-service-account-keys.

# Creating a GCP Cloud Account

To create a GCP cloud account, provide a name for the account and enter the JSON credentials for your service account either by pasting into the space provided or uploading from your JSON credential file. Then, Validate and save your account. 

# Deploying a GCP Cluster

 ![gcp-cluster-creation](./cluster-creation-videos/google-cloud.mp4)

The following steps need to be performed to provision a new GCP cluster:

* Provide basic cluster information like name, description, and tags. Tags on a cluster are propagated to the VMs deployed on the cloud/data center environments.
* Select a cluster profile created for GCP cloud. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide the GCP Cloud account and placement information.
  * Cloud Account - Select the desired cloud account. GCP cloud accounts with GCP credentials need to be pre-configured in project settings.
  * Project - The project to which the cluster belongs.
  * Region - Choose the desired GCP region where you would like the clusters to be provisioned.
  * SSH Key Pair Name - Choose the desired SSH Key-pair. It is the Public key to configure remote SSH access to the nodes.
  * Static Placement - By default, Spectro Cloud uses dynamic placement wherein a new VPC with a public and private subnet is created to place cluster resources for every cluster. These resources are fully managed by Spectro Cloud and deleted when the corresponding cluster is deleted. Turn on the Static Placement option if it is desired to place resources into preexisting VPCs and subnets. If the user is making the selection of static Placement of resources, the following placement information need to be provided:
   	 - Virtual Network
   	 - Control plane Subnet
   	 - Worker Network
  * Make the choice of updating the worker pool in parallel.
* Configure the master and worker node pools. A master and a worker node pool are configured by default.

|Parameter| Description|
|---------|---------------|   
|Name |A descriptive name for the node pool|
|Size | Number of VMs to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5|
|Allow worker capability (master pool)|Select this option for allowing workloads to be provisioned on master nodes|
|Instance type|Select the instance type to be used for all nodes in the node pool|
|**Rolling Update**|There are two choices of Rolling Update|
|Expand First|Launches the new node and then shut down the old node|
|Contract First|Shut down the old node first and then launches the new node|
|Availability Zones|Choose one or more availability zones. Spectro Cloud provides fault tolerance to guard against failures like hardware failures, network failures, etc. by provisioning nodes across availability zones if multiple zones are selected|
|Disk size |Set the desired disk size|
* Configure the worker pool as per requirements or copy the master pool configuration.
* Users can configure the cluster policies as per need. These could be scheduled after cluster creation also.
* Review the settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

# Deleting a GCP Cluster
  The deletion of a GCP cluster results in the removal of all Virtual machines and associated storage disks created for the cluster. The following tasks need to be performed to delete a GCP cluster:

* Select the cluster to be deleted from the cluster view and navigate to the cluster overview page.
* Invoke a delete action available on the page: cluster -> settings -> cluster settings -> Delete Cluster.
* Confirm delete.
Cluster status is updated to ‘Deleting’ while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to ‘Deleted’ and is removed from the list of clusters.
