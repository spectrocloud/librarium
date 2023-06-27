---
title: "VMware"
metaTitle: "Create VMware clusters in Palette"
metaDescription: "Learn how to configure VMware to create VMware clusters in Palette."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';



# Overview

The following are some architectural highlights of Kubernetes clusters provisioned by Palette on VMware:

<br />

- Kubernetes nodes can be distributed across multiple-compute clusters, which serve as distinct fault domains.


- Support for static IP as well as DHCP. If your are using DHCP, Dynamic DNS is required.


- IP pool management for assigning blocks of IPs dedicated to clusters or projects.


- A Private Cloud Gateway (PCG) that you set up within the environment facilitates communications between the Palette management platform and vCenter installed in the private data center.

  <br />
  
  The PCG is Palette's on-prem component to enable support for isolated, private cloud, or data center environments. When the PCG is installed on-prem, it registers itself with Palette's SaaS portal and enables secure communications between the SaaS portal and private cloud environment. 

![vmware_arch_oct_2020.png](/vmware_arch_oct_2020.png)

# Prerequisites

The following prerequisites must be met before deploying a Kubernetes clusters in VMware:

<br />

- vSphere version 7.0 or above. vSphere 6.7 is supported but we do not recommend it, as it reached end of general support in 2022.


- A Resource Pool configured across the hosts onto which the workload clusters will be provisioned. Every host in the Resource Pool will need access to shared storage, such as vSAN, to be able to make use of high-availability (HA) control planes. 


- Network Time Protocol (NTP) configured on each ESXi host.


- An active vCenter account with all the permissions listed in [VMware Privileges](/clusters/data-center/vmware#vmwareprivileges).


- Installed PCG for VMware. Installing the PCG will automatically register a cloud account for VMware in Palette. You can register your additional VMware cloud accounts in Palette as described in the [Create VMware Cloud Account](/clusters/data-center/vmware#createavmwarecloudaccount) section.


- A subnet with egress access to the internet (direct or via proxy):

    - For proxy: HTTP_PROXY, HTTPS_PROXY (both required).
    - Outgoing internet connection on port 443 to api.spectrocloud.com.


- PCG IP requirements are:

    - One node with one IP address or three nodes for HA with three IP addresses.
    - One Kubernetes control-plane (VIP).
    - One Kubernetes control-plane (extra).


- IPs for application workload services, such as LoadBalancer service.


- A DNS to resolve public internet names, such as `api.spectrocloud.com`.


- Shared Storage between vSphere hosts.


- A cluster profile created in Palette for VMWare.


- Zone tagging for dynamic storage allocation for persistent storage.


<InfoBox>

The following naming conventions apply to vSphere Region and Zone tags:

<br />

- Valid tags consist of alphanumeric characters.


- Tags must start and end with an alphanumeric character.


- The regex used for validation is `(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?`

Some example Tags are: `MyValue`, `my_value`, and `12345`.

</InfoBox>

## Zone Tagging

Zone tagging is required for dynamic storage allocation across fault domains when you provision workloads that require persistent storage. This is required for Palette installation and is also useful for workloads deployed in the tenant clusters that require persistent storage. Use unique vSphere tags on data centers (k8s-region) and compute clusters (k8s-zone) to create distinct zones in your environment. Tag values must be unique.

  For example, assume your vCenter environment includes three compute clusters (cluster-1, cluster-2, and cluster-3) that are part of data center dc-1. You can tag them as follows:

| **vSphere Object**       | **Tag Category**     | **Tag Value**     |
| :-------------       | :----------      | :-----------  |
|  dc-1                | k8s-region       | region1       |
| cluster-1            | k8s-zone         | az1           |
| cluster-2            | k8s-zone         | az2           |
| cluster-3            | k8s-zone         | az3           |


<br />

# VMware Privileges

The vSphere user account that deploys Palette must have the minimum toot-level vSphere privileges listed in the table below. The **Administrator** role provides superuser access to all vSphere objects. For users without the **Administrator** role, one or more custom roles can be created based on tasks the user will perform.
Permissions and privileges vary depending on the vSphere version you are using. 

Select the tab for your vSphere version.

<br />

<WarningBox>

If the network is a Distributed Port Group under a vSphere Distributed Switch (VDS), ReadOnly access to the VDS without “Propagate to children” is required.

</WarningBox>

<br />

<Tabs identifier="vm-privileges">

<Tabs.TabPane tab="8.0" key="8.0" >

<br />

## Root-Level Role Privileges

Root-level role privileges listed in the table are applied only to root object and data center objects.



**vSphere Object**    |**Privileges**|
|---------------|----------|
|**Cns**|Searchable|
|**Datastore**|Browse datastore
|**Host**|Configuration
||* Storage partition configuration
|**vSphere** **Tagging**|Create vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Sessions**|Validate session|
|**VM Storage Policies**|View VM storage policies|
|**Storage views**|View|

<br />

## Spectro Role Privileges


The Spectro role privileges listed in the table must be applied to the spectro-template folder, hosts, clusters, virtual machines, templates, datastore, and network objects. 

<br />

<InfoBox>

Palette downloads images and Open Virtual Appliance (OVA) files to the spectro-templates folder and clones images from it to create nodes.

</InfoBox>


|**vSphere Object**    |**Privileges**|
|---------------|----------|
|**spectro-templates** |Read only|  
|**Cns**|Searchable
|**Datastore**|Allocate space|
||Browse datastore|
||Low level file operations|
||Remove file|
||Update virtual machine files|
||Update virtual machine metadata|
|**Folder**|Create folder|
||Delete folder|
||Move folder|
||Rename folder|
|**Host**|Local operations|
||Reconfigure virtual machine|
|**vSphere Tagging**|Assign or Unassign vSphere Tag|
||Create vSphere Tag|
||Delete vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Resource**|Apply recommendation|
||Assign virtual machine to resource pool|
||Migrate powered off virtual machine|
||Migrate powered on virtual machine|
||Query vMotion|
|**Sessions**|Validate session|
|**VM Storage Policies**|View VM storage policies|
|**Storage views**|Configure service|
||View|
|**Tasks**|Create task|
||Update task|
|**vApp**|Export|
||Import|
||View OVF environment|
||vApp application configuration|
||vApp instance configuration|
|**Virtual machines**|**Change Configuration**|
||* Acquire disk lease|
||* Add existing disk|
||* Add new disk|
||* Add or remove device|
||* Advanced configuration|
||* Change CPU count|
||* Change Memory|
||* Change Settings|
||* Change Swapfile placement|
||* Change resource|
||* Configure Host USB device|
||* Configure Raw device|
||* Configure managedBy|
||* Display connection settings|
||* Extend virtual disk|
||* Modify device settings|
||* Query Fault Tolerance compatibility|
||* Query unowned files|
||* Reload from path|
||* Remove disk|
||* Rename|
||* Reset guest information|
||* Set annotation|
||* Toggle disk change tracking|
||* Toggle fork parent|
||* Upgrade virtual machine compatibility|
||**Edit Inventory**|
||* Create from existing|
||* Create new|
||* Move|
||* Register|
||* Remove|
||* Unregister|
||**Guest operations**|
||* Guest operation alias modification|
||* Guest operation alias query|
||* Guest operation modifications|
||* Guest operation program execution|
||* Guest operation queries|
||**Interaction**|
||* Console interaction|
||* Power off|
||* Power on|
||**Provisioning**|
||* Allow disk access|
||* Allow file access|
||* Allow read-only disk access|
||* Allow virtual machine download|
||* Allow virtual machine files upload|
||* Clone template|
||* Clone virtual machine|
||* Create template from virtual machine|
||* Customize guest|
||* Deploy template|
||* Mark as template|
||* Mark as virtual machine|
||* Modify customization specification|
||* Promote disks|
||* Read customization specifications|
||**Service configuration**|
||* Allow notifications|
||* Allow polling of global event notifications|
||* Manage service configurations|
||* Modify service configuration|
||* Query service configurations|
||* Read service configuration|
||**Snapshot management**|
||* Create snapshot|
||* Remove snapshot|
||* Rename snapshot|
||* Revert to snapshot|
||**vSphere Replication**|
||* Configure replication|
||* Manage replication|
||* Monitor replication|
|**vSAN**|Cluster|
||ShallowRekey|



</Tabs.TabPane>
<Tabs.TabPane tab="7.0" key="7.0" >

<br />

## Root-Level Role Privileges

Root-level role privileges listed in the table are applied only to root object and data center objects.

**vSphere Object**    |**Privileges**|
|---------------|----------|
|**Cns**|Searchable|
|**Datastore**|Browse datastore
|**Host**|Configuration
||* Storage partition configuration
|**vSphere** **Tagging**|Create vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Sessions**|Validate session|
|**Profile-driven storage**|Profile-driven storage view|
|**Storage views**|View|

<br />

## Spectro Role Privileges


The Spectro role privileges listed in the table must be applied to the spectro-template folder, hosts, clusters, virtual machines, templates, datastore, and network objects. 

<br />

<InfoBox>

Palette downloads images and Open Virtual Appliance (OVA) files to the spectro-templates folder and clones images from it to create nodes.

</InfoBox>

|**vSphere Object**    |**Privileges**|
|---------------|----------|
|**spectro-templates** |Read only| 
|**Cns**|Searchable
|**Datastore**|Allocate space|
||Browse datastore|
||Low level file operations|
||Remove file|
||Update virtual machine files|
||Update virtual machine metadata|
|**Folder**|Create folder|
||Delete folder|
||Move folder|
||Rename folder|
|**Host**|Local operations|
||Reconfigure virtual machine|
|**vSphere Tagging**|Assign or Unassign vSphere Tag|
||Create vSphere Tag|
||Delete vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Resource**|Apply recommendation|
||Assign virtual machine to resource pool|
||Migrate powered off virtual machine|
||Migrate powered on virtual machine|
||Query vMotion|
|**Sessions**|Validate session|
|**Profile-driven storage**|Profile-driven storage view|
|**Storage views**|Configure service|
||View|
|**Tasks**|Create task|
||Update task|
|**vApp**|Export|
||Import|
||View OVF environment|
||vApp application configuration|
||vApp instance configuration|
|**Virtual machines**|**Change Configuration**|
||* Acquire disk lease|
||* Add existing disk|
||* Add new disk|
||* Add or remove device|
||* Advanced configuration|
||* Change CPU count|
||* Change Memory|
||* Change Settings|
||* Change Swapfile placement|
||* Change resource|
||* Configure Host USB device|
||* Configure Raw device|
||* Configure managedBy|
||* Display connection settings|
||* Extend virtual disk|
||* Modify device settings|
||* Query Fault Tolerance compatibility|
||* Query unowned files|
||* Reload from path|
||* Remove disk|
||* Rename|
||* Reset guest information|
||* Set annotation|
||* Toggle disk change tracking|
||* Toggle fork parent|
||* Upgrade virtual machine compatibility|
||**Edit Inventory**|
||* Create from existing|
||* Create new|
||* Move|
||* Register|
||* Remove|
||* Unregister|
||**Guest operations**|
||* Guest operation alias modification|
||* Guest operation alias query|
||* Guest operation modifications|
||* Guest operation program execution|
||* Guest operation queries|
||**Interaction**|
||* Console interaction|
||* Power off|
||* Power on|
||**Provisioning**|
||* Allow disk access|
||* Allow file access|
||* Allow read-only disk access|
||* Allow virtual machine download|
||* Allow virtual machine files upload|
||* Clone template|
||* Clone virtual machine|
||* Create template from virtual machine|
||* Customize guest|
||* Deploy template|
||* Mark as template|
||* Mark as virtual machine|
||* Modify customization specification|
||* Promote disks|
||* Read customization specifications|
||**Service configuration**|
||* Allow notifications|
||* Allow polling of global event notifications|
||* Manage service configurations|
||* Modify service configuration|
||* Query service configurations|
||* Read service configuration|
||**Snapshot management**|
||* Create snapshot|
||* Remove snapshot|
||* Rename snapshot|
||* Revert to snapshot|
||**vSphere Replication**|
||* Configure replication|
||* Manage replication|
||* Monitor replication|
|**vSAN**|Cluster|
||ShallowRekey|


</Tabs.TabPane>
<Tabs.TabPane tab="6.7" key="6.7" >

<br />

## Root-Level Role Privileges


Root-level role privileges listed in the table are applied only to root object and data center objects.


**vSphere Object**    |**Privileges**|
|---------------|----------|
|**Cns**|Searchable|
|**Datastore**|Browse datastore
|**Host**|Configuration
||* Storage partition configuration
|**vSphere** **Tagging**|Create vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Sessions**|Validate session|
|**Profile-driven storage**|Profile-driven storage view|
|**Storage views**|View|

<br />

## Spectro Role Privileges

The Spectro role privileges listed in the table must be applied to the spectro-template folder, hosts, clusters, virtual machines, templates, datastore, and network objects. 

<br />

<InfoBox>

Palette downloads images and Open Virtual Appliance (OVA) files to the spectro-templates folder and clones images from it to create nodes.

</InfoBox>

|**vSphere Object**    |**Privileges**|
|---------------|----------|
|**spectro-templates** |Read only| 
|**Cns**|Searchable
|**Datastore**|Allocate space|
||Browse datastore|
||Low level file operations|
||Remove file|
||Update virtual machine files|
||Update virtual machine metadata|
|**Folder**|Create folder|
||Delete folder|
||Move folder|
||Rename folder|
|**Host**|Local operations|
||Reconfigure virtual machine|
|**vSphere Tagging**|Assign or Unassign vSphere Tag|
||Create vSphere Tag|
||Delete vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Resource**|Apply recommendation|
||Assign virtual machine to resource pool|
||Migrate powered off virtual machine|
||Migrate powered on virtual machine|
||Query vMotion|
|**Sessions**|Validate session|
|**Profile-driven storage**|Profile-driven storage view|
|**Storage views**|Configure service|
||View|
|**Tasks**|Create task|
||Update task|
|**vApp**|Export|
||Import|
||View OVF environment|
||vApp application configuration|
||vApp instance configuration|
|**Virtual machines**|**Change Configuration**|
||* Acquire disk lease|
||* Add existing disk|
||* Add new disk|
||* Add or remove device|
||* Advanced configuration|
||* Change CPU count|
||* Change Memory|
||* Change Settings|
||* Change Swapfile placement|
||* Change resource|
||* Configure Host USB device|
||* Configure Raw device|
||* Configure managedBy|
||* Display connection settings|
||* Extend virtual disk|
||* Modify device settings|
||* Query Fault Tolerance compatibility|
||* Query unowned files|
||* Reload from path|
||* Remove disk|
||* Rename|
||* Reset guest information|
||* Set annotation|
||* Toggle disk change tracking|
||* Toggle fork parent|
||* Upgrade virtual machine compatibility|
||**Edit Inventory**|
||* Create from existing|
||* Create new|
||* Move|
||* Register|
||* Remove|
||* Unregister|
||**Guest operations**|
||* Guest operation alias modification|
||* Guest operation alias query|
||* Guest operation modifications|
||* Guest operation program execution|
||* Guest operation queries|
||**Interaction**|
||* Console interaction|
||* Power off|
||* Power on|
||**Provisioning**|
||* Allow disk access|
||* Allow file access|
||* Allow read-only disk access|
||* Allow virtual machine download|
||* Allow virtual machine files upload|
||* Clone template|
||* Clone virtual machine|
||* Create template from virtual machine|
||* Customize guest|
||* Deploy template|
||* Mark as template|
||* Mark as virtual machine|
||* Modify customization specification|
||* Promote disks|
||* Read customization specifications|
||**Service configuration**|
||* Allow notifications|
||* Allow polling of global event notifications|
||* Manage service configurations|
||* Modify service configuration|
||* Query service configurations|
||* Read service configuration|
||**Snapshot management**|
||* Create snapshot|
||* Remove snapshot|
||* Rename snapshot|
||* Revert to snapshot|
||**vSphere Replication**|
||* Configure replication|
||* Manage replication|
||* Monitor replication|
|**vSAN**|Cluster|
||ShallowRekey|


</Tabs.TabPane>

</Tabs>


---

# Create VMware Cloud Gateway

<!-- `video: title: "vsphere-pcg-creation": /pcg-creation-video/vmware.mp4` -->

<br />

You can set up the PCG as a single- or three-node cluster based on your requirements for high availability (HA). The minimum capacity required for a PCG are:

  <br />

  - Single-node cluster: 2 vCPU, 4 GB memory, 60 GB storage.


  - High-Availability (HA) three-node cluster: 6 vCPU, 12 GB memory, 70 GB storage.

  <br />


The following points give an overview of what you will do to set up the PCG:

  <br />

  - Initiate the installation from the tenant portal.


  - Deploy the gateway installer VM in vSphere.


  - Launch the cloud gateway from the tenant portal.

<InfoBox>

Self-hosted Palette installations provide a system gateway out-of-the-box and typically do not require a PCG. However, you can create additional gateways as needed to support provisioning into remote data centers that do not have a direct incoming connection from the management console.

</InfoBox>

<br />

## Tenant Portal - Initiate Install

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Navigate to **Tenant Settings** > **Private Cloud Gateway**.


3. Click the **Create Private Cloud Gateway** button and select **VMware**. Private Gateway installation instructions are displayed.


4. Copy the gateway-installer link. Alternatively, you can download the OVA and upload it to an accessible location and import it as a local file.


<br />

## vSphere - Deploy Gateway Installer

1. Deploy a new OVF template by providing the link to the installer OVA as the URL.


2. Proceed through the OVF deployment wizard, selecting the desired Name, Placement, Compute, Storage, and Network options.


3. At the **Customize Template** step, specify Palette properties as follows:

<br />

| **Parameter** | **Value** | **Description** |
|---|---|---|
|**Installer Name** | Desired Palette Gateway Name. | The name will be used to identify the gateway instance. Typical environments may only require a single gateway to be deployed. However, multiple gateways may be required to manage clusters across multiple vCenters. We recommend choosing a name that readily identifies the environment for which this gateway instance is being configured.|
| **Console endpoint** | URL to Palette management platform portal. | Default: https://console.spectrocloud.com |
|**Pairing Code** | PIN displayed on the Palette management platform portal's 'Create a new gateway' dialogue. | |
| **SSH Public Key** | Optional key for troubleshooting purposes. | We recommended having an SSH key, as it enables SSH access to the VM as 'ubuntu' user. |
| **Pod CIDR** | Optional IP range exclusive to pods. | This range should be different to prevent an overlap with your network CIDR. |
| **Service cluster IP range** | Optional IP range in the CIDR format exclusive to the service clusters. | This range also must not overlap with either the pod CIDR or your network CIDR. |


Proxy environments require additional property settings. Each of the proxy properties may or may not have the same value but all the three properties are required.


| **Parameter** | **Value** | **Remarks** |
|---|---|---|
|HTTP PROXY | Endpoint for the HTTP proxy server. | This setting will be propagated to all the nodes launched in the proxy network. For example: `http://USERNAME:PASSWORD@PROXYIP:PROXYPORT` |
| HTTPS PROXY | Endpoint for the HTTPS proxy server. | This setting will be propagated to all the nodes launched in the proxy network. For example: `http://USERNAME:PASSWORD@PROXYIP:PROXYPORT` |
| NO Proxy | A comma-separated list of vCenter server, local network CIDR, hostnames, and domain names that should be excluded from proxying. | This setting will be propagated to all the nodes to bypass the proxy server. For example: `vcenter.company.com`, `.company.org`, and `10.10.0.0/16` |
| Certificate | The base64-encoded value of the proxy server's cerficate OR the base64-encoded root and issuing certificate authority (CA) certificates used to sign the proxy server's certificate. | Depending on how the certificate is decoded, an additonal `=` character may appear at the end of the value. You can use this command to properly encode the certificate: `base64 -w0 &vert; sed "s/=$//"`.

4. Complete the OVF deployment wizard and wait for the OVA to be imported and the Virtual Machine (VM) to be deployed.


5. Power on the VM.


## Tenant Portal - Launch Cloud Gateway

1. Close the **Create New Gateway** installation instructions and navigate to the Private Cloud Gateway page under **Tenant Settings** if you have navigated away or logged out.


2. Wait for a gateway widget to display on the page and for the **Configure** option to become available. The IP address of the installer VM will be displayed on the gateway widget. This may take a few minutes after the VM is powered on. Failure of the installer to register with Palette within 10 minutes of powering on the Virtual Machine on vSphere might indicate an error. Follow steps in [Troubleshooting](/clusters/data-center/vmware#troubleshooting) to identify and resolve the issue.


3. Click on the **Configure** button to invoke the Palette Configuration dialogue. Provide vCenter credentials and proceed to the next configuration step.


4. Choose the desired values for the Data Center, Compute Cluster, Datastore, Network, Resource pool, and Folder. Optionally, provide one or more SSH Keys or NTP server addresses.


5. Choose the IP Allocation Scheme - Static IP or DHCP. Selecting static IP enables the option to create an IP pool. To create an IP pool, provide an IP range or a subnet. The IP addresses from the IP pool will be assigned to the gateway cluster. By default, the IP pool is available for use by other tenant clusters. You can prevent this by toggling on the **Restrict to a single cluster** option. 

<!-- A detailed description of all the fields involved in the creation of an IP pool can be found [here](/clusters?clusterType=vmware_cluster#ipaddressmanagement). -->


6. Click on **Confirm** to initiate gateway cluster provisioning. Cluster status should change to **Provisioning** and eventually to **Running**, when the gateway cluster is fully provisioned. This process can take about 10 minutes.

  You can click on the Cloud Gateway widget in the UI to view a detailed provisioning sequence on the **Cluster Details** page. If gateway cluster provisioning results in errors or gets stuck, you can view the details on the **Summary** tab or the **Events** tab of the **Cluster Details** page.

  In certain cases where provisioning of the gateway cluster is stuck or failed due to invalid configuration, you can reset the process from the Cloud Gateway widget.


7. When the Gateway transitions to the **Running** state, it is fully provisioned and ready to bootstrap tenant cluster requests.


8. Power off the installer OVA that you initially imported at the start of this installation process.

<InfoBox>

A Gateway cluster installation automatically creates a cloud account using the credentials entered at the time the gateway cluster is deployed. You can use this account to provision clusters across all tenant projects.

</InfoBox>


# Troubleshooting
<br />

### Gateway Installer - Unable to register with the Tenant Portal

When powered on, the installer VM goes through a bootstrap process and registers itself with the Tenant Portal. This process typically takes 5 to 10 minutes. If the installer fails to register with the Tenant Portal within this timeframe, it could indicate a bootstrapping error.

SSH into the installer virtual machine using the username "ubuntu" and the key provided during OVA import and inspect the log file located at **/var/log/cloud-init-output.log**. This log file will contain error messages in the event there are failures with connecting to Palette, authenticating, or downloading installation artifacts. A common cause for these errors is the Palette console endpoint or the pairing code was mistyped.

Ensure that the Tenant Portal console endpoint does not have a trailing slash. If these properties were incorrectly specified, power down and delete the installer VM and relaunch with the correct values.

Another potential issue is a lack of outgoing connectivity from the VM. The installer VM needs to have outbound connectivity directly or via a proxy. Adjust proxy settings (if applicable) to fix the connectivity or power down and delete the installer VM and relaunch it in a network that enables outgoing connections.

If the above steps do not resolve your issues, you can copy the following script to the installer VM and invoke it to generate a logs archive. Please contact our support team by sending an email to support@spectrocloud.com and attach the logs archive to the ticket so our Support team can troubleshoot the issue and provide further guidance.

<br />

``` bash
#!/bin/bash

DESTDIR="/tmp/"

CONTAINER_LOGS_DIR="/var/log/containers/"
CLOUD_INIT_OUTPUT_LOG="/var/log/cloud-init-output.log"
CLOUD_INIT_LOG="/var/log/cloud-init.log"
KERN_LOG="/var/log/kern.log"
KUBELET_LOG="/tmp/kubelet.log"
SYSLOGS="/var/log/syslog*"

FILENAME=spectro-logs-$(date +%-Y%-m%-d)-$(date +%-HH%-MM%-SS).tgz

journalctl -u kubelet > $KUBELET_LOG

tar --create --gzip -h --file=$DESTDIR$FILENAME $CONTAINER_LOGS_DIR $CLOUD_INIT_LOG $CLOUD_INIT_OUTPUT_LOG $KERN_LOG $KUBELET_LOG $SYSLOGS

retVal=$?
if [ $retVal -eq 1 ]; then
    echo "Error creating spectro logs package"
else
    echo "Successfully extracted spectro cloud logs: $DESTDIR$FILENAME"
fi
```
<br />

### Gateway Cluster - Provisioning Stalled or Failed

An installation of the gateway cluster may run into errors or might get stuck in the provisioning state due to several reasons, such as lack of infrastructure resources, unavailable IP addresses, inability to perform a Network Time Protocol (NTP) sync.

While these are most common, some other issue might be related to the underlying VMware environment. The Cluster Details page, which can be accessed by clicking anywhere on the gateway widget, contains details of every orchestration step including an indication of the current task being executed.

Any intermittent errors will be displayed on this page next to the relevant orchestration task. The **Events** tab on this page, also provides a useful resource to look at lower-level operations being performed for the various orchestration steps.

If you think that the orchestration is stuck or failed due to incorrectly selected infrastructure resources or an intermittent problem with the infrastructure, you can reset the gateway by clicking on the **Reset** button on the gateway widget. This resets the gateway state to **Pending** and allows you to reconfigure the gateway and start provisioning a new gateway cluster.

If the problem persists, please contact our support team by sending an email to support@spectrocloud.com.
<br />

### Upgrade VMware Cloud Gateway

Palette maintains the OS image and all configurations for the cloud gateway. Periodically, the OS images, configurations, or other components need to be upgraded to resolve security or functionality issues. Palette releases such upgrades when required and communication about the same is presented in the form of an upgrade notification on the gateway.

Administrators should review the changes and apply them at a suitable time. Upgrading a cloud gateway does not result in any downtime for the Tenant Clusters. During the upgrade process, the provisioning of new clusters might be temporarily unavailable. New cluster requests are queued while the gateway is being upgraded and are processed as soon as the gateway upgrade is complete.


<br />

### Delete a VMware Cloud Gateway

The following steps need to be performed to delete a cloud gateway:

1. As a Tenant Administrator, navigate to the **Private Cloud Gateway** page under **Settings**.


2. Invoke the **Delete** action on the cloud gateway instance that needs to be deleted.


3. The system performs a validation to ensure there are no running tenant clusters associated with the gateway instance being deleted. If such instances are found, the system presents an error. Delete relevant running tenant clusters and retry the deletion of the cloud gateway.


4. Delete the Gateway Virtual Machines from vSphere.

<br />

### Resize a VMware Cloud Gateway

A cloud gateway can be set up as a 1-node or a 3-node cluster.  For production environments, it is recommended that three (3) nodes are set up. A cloud gateway can be initially set up with one (1) node and resized to three (3) nodes at a later time. The following steps need to be performed to resize a 1-node cloud gateway cluster to a 3-node gateway cluster:

1. As a Tenant Administrator, navigate to the **Private Cloud Gateway** page under **Settings**.


2. Invoke the resize action for the relevant cloud gateway instance.


3. Update the size from one (1) to three (3).


4. The gateway upgrade begins shortly after the update. Two new nodes are created on vSphere and the gateway is upgraded to a 3-node cluster.

<InfoBox>
Scaling a 3-node cluster down to a 1-node cluster is not permitted.<p></p> A load balancer instance is launched even for a 1-node gateway to support future expansion.
</InfoBox>

# IP Address Management

Palette supports DHCP as well as Static IP based allocation strategies for the VMs that are launched during cluster creation. IP Pools can be defined, using a range or a subnet. Administrators can define one or more IP pools linked to a private cloud gateway.

Clusters created using a private cloud gateway can select from the IP pools linked to the corresponding private cloud gateway. By default, IP Pools are shared across multiple clusters, but can optionally be restricted to a cluster.

The following is a description of various IP Pool properties:

| **Property** | **Description** |
|---|---|
| **Name** | Descriptive name for the IP Pool. This name will be displayed for IP Pool selection when static IP is chosen as the IP allocation strategy |
| **Network Type** | Select **Range** to provide a start and an end IP address. IPs within this range will become part of this pool. Alternately select 'Subnet' to provide the IP range in CIDR format.|
| **Start** | First IP address for a range based IP Pool E.g. 10.10.183.1|
| **End** | Last IP address for a range based IP Pool.  E.g. 10.10.183.100 |
| **Subnet** | CIDR to allocate a set of IP addresses for a subnet based IP Pool.  E.g. 10.10.183.64/26 |
| **Subnet Prefix** | Network subnet prefix. e.g. /18|
| **Gateway** | Network Gateway E.g. 10.128.1.1 |
| **Name server addresses** | A comma-separated list of name servers. e.g., 8.8.8.8 |
| **Restrict to a Single Cluster** | Select this option to reserve the pool for the first cluster that uses this pool. By default, IP pools can be shared across clusters.|

# Create a VMware Cloud Account

<InfoBox>
Configuring the private cloud gateway is a prerequisite task. A default cloud account is created when the private cloud gateway is configured. This cloud account can be used to create a cluster.
</InfoBox>

<InfoBox>
Enterprise version users should choose the <i>Use System Gateway</i> option.
</InfoBox>

In addition to the default cloud account already associated with the private cloud gateway, new user cloud accounts can be created for the different vSphere users.

| **Property** | **Description** |
|---|---|
|**Account Name** | Custom name for the cloud account |
| **Private cloud gateway** | Reference to a running cloud gateway|
| **vCenter Server** | IP or FQDN of the vCenter server|
| **Username** | vCenter username|
| **Password** | vCenter password|

# Deploy a VMware Cluster

<!-- `video: title: "vmware-cluster-creation": ./cluster-creation-videos/vmware.mp4` -->

Use the following steps to provision a new VMware cluster.

<br />

1. Provide the basic cluster information like Name, Description, and Tags. Tags are currently not propagated to the Virtual Machines (VMs) deployed on the cloud/data center environments.


2. Select a Cluster Profile created for the VMware environment. The profile definition will be used as the cluster construction template.


3. Review and override Pack Parameters as desired. By default, parameters for all Packs are set with values defined in the Cluster Profile.


4. Provide a vSphere Cloud account and placement information.

    |**Parameter**                            | **Description**|
    |-----------------------------------------|----------------|
        | **Cloud Account** | Select the desired cloud account. <br />VMware cloud accounts with credentials need to be preconfigured <br /> in the Project Settings section. An account is auto-created as <br /> part of the cloud gateway setup and is available for <br /> provisioning of Tenant Clusters if permitted by the administrator.|
        | **Datacenter** |The vSphere data center where the cluster nodes will be launched.|
        | **Deployment Folder**      | The vSphere VM Folder where the cluster nodes will be launched.|                                                                                                                                                                                                                                                     |
        | **Image Template Folder**  | The vSphere folder to which the Spectro templates are imported.|
        | **SSH Keys (Optional)** | Public key to configure remote SSH access to the nodes (User: spectro).|
        | **NTP Server (Optional)** | Setup time synchronization for all the running nodes.|
        | **IP Allocation strategy** | DHCP or Static IP|

5. Configure the master and worker node pools. Fill out the input fields in the **Add node pool** page. The following table contains an explanation of the available input parameters.

### Master Pool

|**Parameter**     | **Description**|
|------------------|---------------|
|**Name**          |A descriptive name for the node pool.|
|**Size**          |Number of VMs to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5.|
|**Allow worker capability**|Select this option for allowing workloads to be provisioned on master nodes.|
|**[Labels](/clusters/cluster-management/taints#overviewonlabels)**| Add a label to apply placement constraints on a pod, such as a node eligible for receiving the workload.
|**[Taints](/clusters/cluster-management/taints#overviewontaints)**|To set toleration to pods and allow (but do not require) the pods to schedule onto nodes with matching taints.|
|**Instance type** |Select the compute instance type to be used for all nodes in the node pool.|
|**Availability Zones**| Choose one or more availability zones. Palette provides fault tolerance to guard against hardware failures, network failures, etc., by provisioning nodes across availability zones if multiple zones are selected.|
|**Disk Size**|Give the required storage size|

### Worker Pool

|**Parameter**     | **Description**|
|------------------|---------------|
|**Name**          |A descriptive name for the node pool.|
|**Enable Autoscaler**|You can enable the autoscaler by toggling the **Enable Autoscaler** button. Autoscaler scales resources up and down between the defined minimum and maximum number of nodes to optimize resource utilization.|
||Set the scaling limit by setting the **Minimum Size** and **Maximum Size**, as per the workload the number of nods will scale up from minimum set value to maximum set value and the scale down from maximum set value to minimum set value|
|**Size**          |Number of VMs to be provisioned for the node pool.|
|**Rolling Update**| Rolling update has two available options. Review the [Update Parameter](#update-parameter-table) table below for more details.
|**[Labels](/clusters/cluster-management/taints#overviewonlabels)**|Add a label to apply placement constraints on a pod, such as a node eligible for receiving the workload.
|**[Taints](/clusters/cluster-management/taints#overviewontaints)**|To set toleration to pods and allow (but do not require) the pods to schedule onto nodes with matching taints.|
|**Instance type** |Select the compute instance type to be used for all nodes in the node pool.|
|**Availability Zones**| Choose one or more availability zones. Palette provides fault tolerance to guard against hardware failures, network failures, etc., by provisioning nodes across availability zones if multiple zones are selected.|
|**Disk Size**|Provide the required storage size

6. Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>
New worker pools may be added if it is desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with 4 CPUs, 8 GB of memory for general-purpose workloads, and another worker pool with 8 CPUs, 16 GB of memory for advanced workloads that demand larger resources.
</InfoBox>

# Delete a VMware Cluster

The deletion of a VMware cluster results in the removal of all Virtual machines and associated storage disks created for the cluster. The following tasks need to be performed to delete a VMware cluster:


1. Select the cluster to be deleted from the **Cluster** **View** page and navigate to the **Cluster Overview** page.


2. Invoke the delete action available on the page: **Cluster** > **Settings** > **Cluster** **Settings** > **Delete** **Cluster**.


3. Click **Confirm** to delete.


The Cluster Status is updated to **Deleting** while the Cluster Resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the Cluster Status changes to **Deleted** and is removed from the list of Clusters.

<InfoBox>
The Delete action is only available for Clusters that are fully provisioned. For Clusters that are still in the process of being provisioned, <b> Abort </b> action is available to stop provisioning and delete all resources.
</InfoBox>

# Force Delete a Cluster

A cluster stuck in the **Deletion** state can be force deleted by the user through the User Interface. The user can go for a force deletion of the cluster, only if it is stuck in a deletion state for a minimum of **15 minutes**. Palette enables cluster force delete from the Tenant Admin and Project Admin scope.

## To force delete a cluster:

1. Log in to the Palette Management Console.


2. Navigate to the **Cluster Details** page of the cluster stuck in deletion mode.

      - If the deletion status is stuck for more than 15 minutes, click the **Force Delete Cluster** button from the **Settings** dropdown.

      - If the **Force Delete Cluster** button is not enabled, wait for 15 minutes. The **Settings** dropdown will give the estimated time for the auto-enabling of the **Force Delete** button.


<WarningBox>
If there are any cloud resources still on the cloud, the user should cleanup those resources before going for the force deletion.
</WarningBox>
