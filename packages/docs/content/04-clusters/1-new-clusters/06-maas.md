---
title: "MaaS"
metaTitle: "Creating new clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';


# MAAS Cluster

Spectro Cloud supports the users to create a data centre from their bare-metal servers with MaaS support. We succor the provisioning of Kubernetes clusters in the MaaS environment to manage a large number of physical machines by merging them into user-defined resource pools. MAAS expanded as “Metal As A Service” aids in converting your bare-metal servers into cloud instances of virtual machines. It helps in the quick provisioning and de-provisioning of instances, similar to instances hosted in public clouds like Amazon AWS, Google GCE, or Microsoft Azure.


A Private Cloud Gateway needs to be set up within the environment, to facilitate communication between the Spectro Cloud management platform and the MaaS environment. The gateway establishes a secure communication channel with the management console thereby eliminating an incoming connection into the Maas environment.


![maas_cluster_architecture.png](maas_cluster_architecture.png)

## Prerequisites

* Minimum capacity required for tenant clusters: ~26 vCPU, 50GB memory, 600GB storage.
* Minimum capacity required for a Private Cloud Gateway:
    * 1 node - 2 vCPU, 4GB memory, 30GB storage.
    * 3 nodes - 6 vCPU, 12GB memory, 90GB storage.
* Per tenant cluster IP requirements:
    * 1 per node.
    * 1 Kubernetes control-plane VIP.
* Private cloud gateway IP requirements:
    * 1 node - 1 IP or 3 nodes - 3 IPs.
    * 1 Kubernetes control-plane VIP.
    * 1 Kubernetes control-plane extra.
* IPs for application workload services (e.g.: Load Balancer services).
* Subnet with egress access to the internet (direct or via proxy):
    * For proxy: HTTP_PROXY, HTTPS_PROXY (both required).
    * Outgoing internet connection on port 443 to api.spectrocloud.com.
* DNS to resolve public internet names (e.g.: api.spectrocloud.com).
* NTP configured on all Hosts.
* MaaS permission set.


## Creating a MaaS gateway

Spectro Cloud provides an installer in the form of a docker container. This installer can be run on any system that has docker daemon installed and has connectivity to the Spectro Cloud Management console as well as MaaS identity endpoint.


#### Generate pairing code

Navigate to the Private Cloud Gateway page under Administration and Create a new MaaS gateway. Copy the pairing code displayed on the page. This will be used in subsequent steps.

#### Generate gateway config

Invoke gateway installer in interactive mode to generate the gateway configuration file. Follow the prompts to provide the Spectro Cloud Management, MaaS cloud account, Environment and, Placement information as requested.

```bash
docker run --rm  \
  --net=host \
  -it  \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp:/opt/spectrocloud \
    gcr.io/spectro-images-public/release/spectro-installer:v1.0.3 \
    pcg  \
    User-define-MaaS-Gateway-Name \
    MaaS \
  -w=/opt/spectrocloud/ \
  -o=true
```


#### Enter Spectro Cloud  Management Information:

* Spectro Cloud Console - Management Console endpoint e.g. https://console.spectrocloud.com
* Spectro Cloud Username - Login email address e.g. user1@company.com
* Spectro Cloud Password - The login password
* Private Cloud Gateway pairing code: The unique authentication code generated in the previous step.

#### Enter Environment Configuration:

* HTTPS Proxy (--https_proxy):

The endpoint for the HTTPS proxy server. This setting will be propagated to all the nodes launched in the proxy network. Eg., http://USERNAME:PASSWORD@PROXYIP:PROXYPORT

* HTTP Proxy(--http_proxy):
The endpoint for the HTTP proxy server. This setting will be propagated to all the nodes launched in the proxy network. Eg., http://USERNAME:PASSWORD@PROXYIP:PROXYPORT

* No Proxy(--no_proxy):
A comma-separated list of local network CIDRs, hostnames, domain names that should be excluded from proxying. This setting will be propagated to all the nodes to bypass the proxy server. Eg., maas.company.com,10.10.0.0/16

* Pod CIDR (--pod_cidr):
The CIDR pool is used to assign IP addresses to pods in the cluster. This setting will be used to assign IP addresses to pods in Kubernetes clusters. The pod IP addresses should be unique and should not overlap with any Virtual Machine IPs in the environment.

* Service IP Range (--svc_ip_range):
The IP address that will be assigned to services created on Kubernetes. This setting will be used to assign IP addresses to services in Kubernetes clusters. The service IP addresses should be unique and not overlap with any virtual machine IPs in the environment.

#### Enter MaaS Account Information:

MaaS API Endpoint - MaaS API endpoint. Domain or IP address.
e.g. http://10.11.130.10:5240/MAAS

MaaS API Key - MAAS generates an API key when creating your MAAS account, which is used for authentication.


#### Enter MaaS Machine configuration for the Private Cloud Gateway:

* Select the availability zone
* Choose flavor
* Number of nodes: choose between 1 and 3

After this step, a new gateway configuration file is generated and its location is displayed on the console.

E.g.:
Config created:/opt/spectrocloud//User-define-MaaS-Gateway-Name-20210805155034/pcg.yaml


#### Copy configuration file to known location:

Copy the pcg.yaml file to a known location for easy access and updates.


```bash
cp /tmp/install-User-define-MaaS-Gateway-Name-20210805155034/pcg.yaml  /tmp
```


#### Deploy Private Cloud Gateway

Invoke the gateway installer in silent mode providing the gateway config file as input to deploy the gateway.

```bash
docker run --rm  \
  --net=host \
  -it  \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp:/opt/spectrocloud \
    gcr.io/spectro-images-public/release/spectro-installer:v1.0.3 \
    pcg  \
    User-define-MaaS-Gateway-Name \
    MaaS \
  -w=/opt/spectrocloud/ \
  -s=true \
  -c=/opt/spectrocloud/pcg.yaml
```

New machine(s) will be launched in your MaaS environment and a gateway will be installed on those machine(s). If the deployment fails due to misconfiguration, update the gateway configuration file and rerun the command.

## Upgrading a MaaS cloud gateway

Spectro Cloud maintains the OS image and all configurations for the cloud gateway. Periodically, the OS images, configurations, or other components need to be upgraded to resolve security or functionality issues. Spectro Cloud releases such upgrades when required and communication about the same is presented in the form of an upgrade notification on the gateway.
Administrators should review the changes and apply them at a suitable time. Upgrading a cloud gateway does not result in any downtime for the tenant clusters. During the upgrade process, the provisioning of new clusters might be temporarily unavailable. New cluster requests are queued while the gateway is upgraded and are processed as soon as the gateway upgrade is complete.

## Deleting a MaaS cloud gateway
The following steps need to be performed to delete a cloud gateway:
* As a tenant administrator, navigate to the Private Cloud Gateway page under settings.
* Invoke the ‘Delete’ action on the cloud gateway instance that needs to be deleted.
* The system performs a validation to ensure that, there are no running tenant clusters associated with the gateway instance being deleted. If such instances are found, the system presents an error. Delete relevant running tenant clusters and retry the deletion of the cloud gateway.
* Delete the gateway.


## Resizing a MaaS gateway

A Cloud gateway can be set up as a 1-node or a 3-node cluster. For production environments, it is recommended that 3 nodes are set up. A cloud gateway can be initially set up with 1 node and resized to 3 nodes at a later time. The following steps need to be performed to resize a 1-node cloud gateway cluster to a 3-node gateway cluster:
* As a tenant administrator, navigate to the Private Cloud Gateway page under settings.
* Invoke the resize action for the relevant cloud gateway instance.
* Update the size from 1 to 3.
* The gateway upgrade begins shortly after the update. Two new nodes are created and the gateway is upgraded to a 3-node cluster.


## Creating a MaaS Cloud Account

A default cloud account is automatically created when the private cloud gateway is configured. This cloud account can be used to create tenant clusters. Additional cloud accounts may be created if desired within the same gateway.

To create a MaaS cloud account, proceed to project settings and select 'create cloud account' under MaaS. Fill the following values to the cloud account creation wizard.

|Property|Description |
|:---------------|:-----------------------|
|  Account Name |  Custom name for the cloud account   |
|   Private cloud gateway|    Reference to a running cloud gateway |
|  API Endpoint |  API Endpoint of the gateway   |
| API Key|

Validate the above MaaS credentials to create your MaaS cloud account.

## Creating a MaaS Cluster

The following steps need to be performed to provision a new MaaS cluster:

* Provide basic cluster information like name, description, and tags. Tags are currently not propagated to the machines deployed on the cloud/data center environments.

* Select a cluster profile created for the  MaaS environment. The profile definition will be used as the cluster construction template.

* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.

* Provide a MaaS Cloud account and placement information.

   * Cloud Account - Select the desired cloud account.
MaaS cloud accounts with credentials need to be pre-configured in project settings. An account is auto-created as part of the cloud gateway setup and is available for provisioning of tenant clusters if permitted by the administrator.

   * Domain

* Configure the master and worker node pools. A master and a worker node pool are configured by default.
    * Name - A descriptive name for the node pool.
    * Size - Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3, 5, etc.
    * Allow worker capability (master pool) - To workloads to be provisioned on master nodes.
    * Resource Pool
    * Availability zones
    * Minimum CPU
    * Minimum Disk - Storage disk size in GB to be attached to the node.
    * Rolling Update
* Expand first
* Contract First

* Configure the cluster policies/features.
    * Manage Machines
    * Scan Policies
    * Backup Policies

* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

## Deleting a MaaS Cluster
The deletion of a MaaS cluster results in the removal of all Virtual machines and associated storage disks created for the cluster. The following tasks need to be performed to delete a MaaS cluster:
* Select the cluster to be deleted from the cluster view and navigate to the cluster overview page
* Invoke a delete action from the cluster settings
* Confirm delete action
* Cluster status is updated to ‘Deleting’ while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to ‘Deleted’ and is removed from the cluster list.

<InfoBox>
Delete action is only available for clusters that are fully provisioned. For clusters that are still in the process of being provisioned, the ‘Abort’ action is available to stop provisioning and delete all resources.
</InfoBox>