---
title: "MAAS"
metaTitle: "Creating new clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Following are some of the architectural highlights of bare-metal Kubernetes clusters deployed by Palette using Canonical's MAAS (an open-source tool that lets you discover, commission, deploy, and dynamically reconfigure a large network of individual units):

* Spectro Cloud developed and released an open sourced CNCF Cluster API contribution supporting Canonical’s MAAS interface (https://github.com/spectrocloud/cluster-api-provider-maas).
* The new contribution to the open source Kubernetes ecosystem addresses the need for organizations to easily deploy, run and manage Kubernetes clusters directly on top of bare metal servers, increasing performance and minimizing cost and operational effort.
* Palette provides cloud like experience to deploying clusters on bare metal servers.
* In order to facilitate communication between the Palette management platform and the bare metal machines as well as MAAS controller installed in the private datacenter, a Private Cloud Gateway needs to be set up within the environment.
* Private Cloud Gateway(PCG) is Palette's on-prem component to enable support for isolated private cloud or datacenter environments. The Palette PCG, once installed registers itself with Palette's SaaS portal and enables secure communication between the SaaS portal and the private cloud environment. The gateway enables installation and end-to-end lifecycle management of  Kubernetes clusters in private cloud environments from Palette's SaaS portal.


![maas_cluster_architecture.png](maas_cluster_architecture.png)

# Prerequisites

The following prerequisites must be met before deploying a bare-metal Kubernetes cluster using MAAS:

* You must enable API communication and retrieve the API key. The [key], [secret], [consumer_key] tokens are the three elements that compose the API key (API key = ‘[consumer_key]:[key]:[secret]’).
* You should have an Infrastructure cluster profile created in the Spectro Cloud Palette UI for MAAS.
* You should install a Private Cloud Gateway for MAAS as described in the "Installing Private Cloud Gateway - MAAS" section below. Installing the Private Cloud Gateway will automatically register a cloud account for MAAS in Palette. You can register your additional MAAS cloud accounts in Palette as described in the "Creating a MAAS Cloud account" section below.
* Egress access to the internet (direct or via proxy):
    * For proxy: HTTP_PROXY, HTTPS_PROXY (both required)
    * Outgoing internet connection on port 443 to api.spectrocloud.com
* DNS to resolve public internet names (e.g.: api.spectrocloud.com).
* A computer with a docker daemon installed and connectivity to both the Palette Management console and the MAAS identity endpoint. 
* Sufficient IPs for application workload services (e.g.: Load Balancer services).
* Per workload cluster IP requirements:
    * 1 per cluster node
    * 1 Kubernetes control-plane VIP

# Installing Private Cloud Gateway - MAAS

![maas-pcg-creation](/pcg-creation-video/maas.mp4)

The following system requirements should be met in order to install a private cloud gateway for MAAS:

* Private cloud gateway IP requirements:
    * 1 IP for a 1 node PCG or 3 IPs for a 3 node PCG
    * 1 IP for Kubernetes control-plane

Palette provides an installer in the form of a docker container temporarily deployed on your laptop, workstation or jump-box. This installer can be run on any system that has docker daemon installed and has connectivity to the Palette Management console as well as MAAS identity endpoint. 

## Generate pairing code

- Navigate to the Private Cloud Gateway page in the Palette UI under “My Organization” -> “Admin Settings” -> “Private Cloud Gateways” -> “Add New Private Cloud Gateway -> “MAAS”  -> “Add MAAS Account”. 
- Copy the pairing code displayed on the page. This will be used in subsequent steps.

## Generate gateway config

* Invoke the gateway installer in interactive mode from any system that has a docker daemon installed with connectivity to the Palette Management console and the MAAS identity endpoint. 

* To generate the gateway configuration file follow the instructions below to provide the Palette Management, MAAS cloud account, environment and  placement information when prompted by the installer.

```bash
docker run -it --rm \
 --net=host \
 -v /var/run/docker.sock:/var/run/docker.sock \
 -v /tmp:/opt/spectrocloud \
 gcr.io/spectro-images-public/release/spectro-installer:1.0.9 \
 -o true
```

#### Enter Spectro Cloud  Management Information:

* Copy and past the instructions above to your terminal with docker. Upon execution provide the following:
* Install Type: Choose either Private Cloud Gateway or Self Hosted Enterprise Cluster.  You may change your selection with the up or down keys.
* Cloud Type: MAAS.
* Input the name you wish to use for your Private Cloud Gateway.
* Enter the Spectro Cloud Palette Console endpoint e.g. https://customername.console.spectrocloud.com
* Enter your Spectro Cloud Username - Login email address e.g. user1@company.com.
* Enter your Spectro Cloud Password - The login password.
* Enter the Private Cloud Gateway pairing code generated from the Spectro Cloud Palette UI. For more info, please see the “Generate gateway config” section of this document. 

#### Enter Environment Configuration:

* HTTPS Proxy (--https_proxy): leave blank unless an HTTPS Proxy is used.
This setting will be propagated to all the nodes launched in the proxy network. e.g., http://USERNAME:PASSWORD@PROXYIP:PROXYPORT

* HTTP Proxy(--http_proxy): leave blank unless an HTTP Proxy is used.
This setting will be propagated to all the nodes launched in the proxy network. e.g., http://USERNAME:PASSWORD@PROXYIP:PROXYPORT

* No Proxy(--no_proxy): default is blank.
A comma-separated list of local network CIDRs, hostnames, domain names that should be excluded from proxying. This setting will be propagated to all the nodes to bypass the proxy server. e.g., maas.company.com,10.10.0.0/16

* Pod CIDR (--pod_cidr):
The CIDR pool is used to assign IP addresses to pods in the cluster. This setting will be used to assign IP addresses to pods in Kubernetes clusters. The pod IP addresses should be unique and should not overlap with any Virtual Machine IPs in the environment.

* Service IP Range (--svc_ip_range):
The IP address that will be assigned to services created on Kubernetes. This setting will be used to assign IP addresses to services in Kubernetes clusters. The service IP addresses should be unique and not overlap with any virtual machine IPs in the environment.

#### Enter MAAS Account Information:

* API Endpoint - MAAS API endpoint. Domain or IP address.
e.g. http://10.11.12.13:5240/MAAS

* API Key - Generate an API key from the MAAS UI and paste when prompted. This key is used for authentication.


#### Enter MAAS Machine configuration for the Private Cloud Gateway:

* Select the availability zone
* Choose the domain
* Choose the Resource Pool
* Number of nodes: choose between 1 and 3

After this step, a new gateway configuration file is generated and its location is displayed on the console.
E.g.: Config created:/opt/spectrocloud//User-define-MaaS-Gateway-Name-20210805155034/pcg.yaml

## Copy configuration file to known location:

Copy the pcg.yaml file to a known location for easy access and updates.


```bash
cp /tmp/install-User-define-MaaS-Gateway-Name-20210805155034/pcg.yaml  /tmp
```


## Deploy Private Cloud Gateway

Invoke the gateway installer in silent mode providing the gateway config file as input to deploy the gateway.

```bash
docker run -it --rm \
 --net=host \
 -v /var/run/docker.sock:/var/run/docker.sock \
 -v /tmp:/opt/spectrocloud \
 gcr.io/spectro-images-public/release/spectro-installer:1.0.9 \
 -s true \
 -c //opt/spectrocloud/pcg.yaml
```

Available bare-metal machines in your MAAS environment will be selected and a private cloud gateway will be installed on those machine(s). If the deployment fails due to misconfiguration, update the gateway configuration file and rerun the command.

## Upgrading a MAAS Cloud Gateway

Spectro Cloud maintains the OS image and all configurations for the cloud gateway. Periodically, the OS images, configurations, or other components need to be upgraded to resolve security or functionality issues. Palette releases such upgrades when required and communication about the same is presented in the form of an upgrade notification on the gateway.
Administrators should review the changes and apply them at a suitable time. Upgrading a cloud gateway does not result in any downtime for the tenant clusters. During the upgrade process, the provisioning of new clusters might be temporarily unavailable. New cluster requests are queued while the gateway is upgraded and are processed as soon as the gateway upgrade is complete.

## Deleting a MAAS cloud gateway
The following steps need to be performed to delete a cloud gateway:
* As a tenant administrator, navigate to the Private Cloud Gateway page under settings.
* Invoke the ‘Delete’ action on the cloud gateway instance that needs to be deleted.
* The system performs a validation to ensure that, there are no running tenant clusters associated with the gateway instance being deleted. If such instances are found, the system presents an error. Delete relevant running tenant clusters and retry the deletion of the cloud gateway.
* Delete the gateway.


## Resizing a MAAS gateway

A Cloud gateway can be set up as a 1-node or a 3-node cluster. For production environments, it is recommended that 3 nodes are set up. A cloud gateway can be initially set up with 1 node and resized to 3 nodes at a later time. The following steps need to be performed to resize a 1-node cloud gateway cluster to a 3-node gateway cluster:
* As a tenant administrator, navigate to the Private Cloud Gateway page under settings.
* Invoke the resize action for the relevant cloud gateway instance.
* Update the size from 1 to 3.
* The gateway upgrade begins shortly after the update. Two new nodes are created and the gateway is upgraded to a 3-node cluster.

# Creating a MAAS Cloud Account

A default cloud account is automatically created when the private cloud gateway is configured. This cloud account can be used to create tenant clusters. Additional cloud accounts may be created if desired.

To create a MAAS cloud account, proceed to project settings and select 'create cloud account' under MAAS. Fill the following values in the cloud account creation wizard.

|Property|Description |
|:---------------|:-----------------------|
|  Account Name |  Custom name for the cloud account   |
|   Private cloud gateway|    Reference to a running cloud gateway |
|  API Endpoint |  API Endpoint of the gateway   |
| API Key| API token |

Validate the above MAAS credentials to create your MAAS cloud account.

# Deploying a bare-metal cluster using MAAS

![maas-cluster-creation](./cluster-creation-videos/maas.mp4)

The following steps need to be performed to provision a new MAAS cluster:
* Provide basic cluster information like name, description, and tags.
* Select a cluster profile created for the  MAAS environment. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide a MAAS Cloud account and placement information.
   * Cloud Account - Select the desired cloud account.
MAAS cloud accounts with credentials need to be pre-configured in project settings. An account is auto-created as part of the cloud gateway setup and is available for provisioning of tenant clusters if permitted by the administrator.
   * Domain
* Configure the master and worker node pools. A master and a worker node pool are configured by default.
    * Name - A descriptive name for the node pool
    * Size - Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3, 5, etc.
    * Allow worker capability (master pool) - To workloads to be provisioned on master nodes
    * Resource Pool
    * Availability zones
    * Minimum CPU
    * Minimum Disk - Storage disk size in GB to be attached to the node.
    * Make your selection of Rolling Update of nodes. There are two choices of Rolling Update:
	 	* Expand First: Launches the new node and then shut down the old node
	 	* Contract First: Shut down the old node first and then launches the new node
* Configure the cluster management features if needed, these features can also be scheduled later for the running clusters.

    * Manage Machines
    * Scan Policies
    * Backup Policies

Click to get details on [cluster management feature](/clusters/cluster-management/#cluster-updates)
* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

# Deleting a MAAS Cluster
The deletion of a MAAS cluster results in the removal of all Virtual machines and associated storage disks created for the cluster. The following tasks need to be performed to delete a MAAS cluster:
* Select the cluster to be deleted from the cluster view and navigate to the cluster overview page.
* Invoke a delete action from the cluster settings: : cluster -> settings -> cluster settings -> Delete Cluster.
* Confirm delete action.
* Cluster status is updated to ‘Deleting’ while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to ‘Deleted’ and is removed from the cluster list.

<InfoBox>
Delete action is only available for clusters that are fully provisioned. For clusters that are still in the process of being provisioned, the ‘Abort’ action is available to stop provisioning and delete all resources.
</InfoBox>

# Cluster Force Deletion

A cluster stuck in the **Deletion** state can be force deleted by the user through the User Interface. The user can go for a force deletion of the cluster only if it is stuck in a deletion state for a minimum of **14 minutes**. Palette enables cluster force delete from the tenant admin and project admin scope. 

## To force delete a cluster:

* Login to the Palette Management Console
* Navigate to the Cluster details page of the cluster stuck in deletion.
  * If the deletion is stuck for more than 14 minutes, Click the `Force Delete Cluster` button from the `Settings` dropdown. 
  * If the `Force Delete Cluster` button is not enabled, wait for 14 minutes, The `Settings` dropdown will give the estimated time for the auto-enabling of the force delete button.

<WarningBox>
If there are any cloud resources still on the cloud, the user should cleanup those resources before going for the force deletion. 
</WarningBox>

