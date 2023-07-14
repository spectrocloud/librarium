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


- PCG IP address requirements: <br />

    - Depending on topology, either one IP address for a single-node PCG or three IP addresses for a three-node HA PCG.

    - One IP address for the Kubernetes control plane.

    - One additional Kubernetes control plane IP address for rolling upgrades.
    <br />

- Sufficient available IP addresses within the configured vSphere subnets.


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

# Create VMware Private Cloud Gateway (PCG)



## Prerequisites



You can set up the PCG as a single or three-node cluster based on your requirements for high availability (HA). The minimum PCG resource requirements are:

  <br />

  - Single-node cluster: 2 vCPU, 4 GB memory, 60 GB storage.


  - High-Availability (HA) three-node cluster: 6 vCPU, 12 GB memory, 70 GB storage.

  <br />

- Sufficient available IP addresses within the configured OpenStack subnets.

* Download the Palette CLI from the [Downloads](/spectro-downloads#palettecli) page and install the CLI. Refer to the [Palette CLI Install](/palette-cli/install-palette-cli) guide to learn more.


* A Palette API key. Refer to the [Create API Key](/user-management/user-authentication#apikey) page for guidance.


* If you are using the Palette CLI for the installation, a Linux x86-64 host with the Docker daemon installed is required.

<InfoBox>

Self-hosted Palette installations provide a system PCG out-of-the-box and typically do not require a separate, user-installed PCG. However, you can create additional PCGs as needed to support provisioning into remote data centers that do not have a direct incoming connection from the management console. 

</InfoBox>



## Install PCG

There are two supported PCG installation methods for VMware vSphere. You can use the Palette CLI, or you can use an OVA/OVF template. The Palette CLI can be used on any Linux x86-64 system that has docker daemon installed and has connectivity to the Palette Management console as well as VMware vSpher

<br />

<Tabs>

<Tabs.TabPane tab="CLI" key="cli">

## Install PCG

1. Use the Palette CLI `login` command to authenticate the CLI with Palette. When prompted, enter the information listed in the following table

    <br />

    ```shell
    palette login
    ```

    <br />

    |**Parameter**       | **Description**|
    |:-----------------------------|---------------|
    |**Spectro Cloud Console** |Enter the Palette endpoint URL. When using the Palette SaaS service, enter ``https://console.spectrocloud.com``. When using a dedicated instance of Palette, enter the URL for that instance. |
    |**Allow Insecure Connection** |Enabling this option bypasses x509 verification. Enter 'y' if you are using a self-hosted Palette instance with self-signed TLS certificates. Otherwise, enter 'n'.|
    |**Spectro Cloud API Key** |Enter your Palette API Key.|
    |**Spectro Cloud Organization** |Enter your Palette Organization.|
    |**Spectro Cloud Project** |Enter your desired Project within the selected Organization.|



2. Once you have authenticated successfully, invoke the PCG installer by executing the following command. When prompted, enter the information listed in each of the following tables.

    <br />

    ```bash
    palette pcg install
    ```

    <br />

    |**Parameter**       | **Description**|
    |:-----------------------------|---------------|
    |**Cloud Type**| Choose OpenStack.|
    |**Private Cloud Gateway Name** | Enter a custom name for the PCG. Example: ``openstack-pcg-1``.|
    |**Share PCG Cloud Account across platform Projects** |Enter `y`` if you want the Cloud Account associated with the PCG to be available from all projects within your organization. Enter 'n' if you want the Cloud Account to only be available at the tenant admin scope.|


3. Next, provide environment configuration for the cluster. Refer to the following table for information about each option.

  <br />

  |**Parameter**| **Description**|
  |:-------------|----------------|
  |**HTTPS Proxy**|Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: ``https://USERNAME:PASSWORD@PROXYIP:PROXYPORT``.|
  |**HTTP Proxy**|Leave this blank unless you are using an HTTP Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: ``http://USERNAME:PASSWORD@PROXYIP:PROXYPORT``.|
  |**No Proxy**|The default is blank. You can add a comma-separated list of local network CIDR addresses, hostnames, and domain names that should be excluded from being a proxy. This setting will be propagated to all the nodes to bypass the proxy server. Example if you have a self-hosted environment: ``maas.company.com,10.10.0.0/16``.|
  |**Proxy CA Certificate Filepath**|The default is blank. You can provide the file path of a CA certificate on the installer host. If provided, this CA certificate will be copied to each host in the PCG cluster during deployment. The provided path will be used on the PCG cluster hosts. Example: `/usr/local/share/ca-certificates/ca.crt`.|
  |**Pod CIDR**|Enter the CIDR pool that will be used to assign IP addresses to pods in the PCG cluster. The pod IP addresses should be unique and not overlap with any machine IPs in the environment.|
  |**Service IP Range**|Enter the IP address range that will be used to assign IP addresses to services in the PCG cluster. The service IP addresses should be unique and not overlap with any machine IPs in the environment.|




4. After the environment options, the next set of prompts is for configuring the PCG cluster for the VMware environment. The following table contains information about each prompt.

  <br />

  |**Parameter**                            | **Description**|
  |-----------------------------------------|----------------|
  |**vSphere Endpoint** | vSphere endpoint: FQDN or IP address, without the HTTP scheme `https://` or `http://`. <br />Example: `vcenter.mycompany.com`|
  |**vSphere Username**  | vSphere account username|
  |**vSphere Password** | vSphere account password|
  |**Allow Insecure Connection (Bypass x509 Verification)** |Enter `y` if using a vSphere instance with self-signed TLS certificates. Otherwise, enter `n`.|


5. Next, fill VMware account configurations. You will have the option to select or specify values for the following properties.

  * Datacenter
  * Folder
  * Fault Domain(s). Configure one or more fault domains by selecting values for the following properties:
    * Cluster
    * Network
    * Resource Pool
    * Storage Type (Datastore or VM Storage Policy)
  * NTP server(s)
  * SSH Public Key(s)
  * PCG cluster size: **1** or **3** nodes (HA)



6. Specify the Specify IP Pool configuration. You have the option to select a static placement or use Dynamic Domain Name Service (DDNS). With static placement, an IP pool is created and VMs are assigned IPs from that pool. With DDNS, VMs are assigned IPs via DNS. Review the following tables to learn more about each parameter.

  <br />

  ##### Static Placement Configuration
  |**Parameter**                            | **Description**|
  |-----------------------------------------|----------------|
  | **IP Start range** | Enter the first address in the PCG IP pool range.|
  | **IP End range** | Enter the last address in the PCG IP pool range.|
  | **Network Prefix** | Enter the network prefix for the IP pool range. Valid values are in [0, 32]. Example: `18`.|
  | **Gateway IP Address** | Enter the IP address of the static IP gateway.|
  | **Name servers** | Comma-separated list of DNS name server IP addresses.|
  | **Name server search suffixes (optional)** | Comma-separated list of DNS search domains.|

    ##### DDNS Placement Configuration
    |**Parameter**                            | **Description**|
    |-----------------------------------------|----------------|
    | **Search domains** | Comma-separated list of DNS search domains.|


7. Specify the cluster boot configuration. 

  <br />

  |**Parameter**                            | **Description**|
  |-----------------------------------------|----------------|
  | **Patch OS on boot** | This parameter indicates whether or not to patch the OS of the PCG hosts on the first boot.|
  | **Reboot nodes once OS patch is applied** | This parameter indicates whether or not to reboot PCG nodes after OS patches are complete. This only applies if the **Patch OS on boot** parameter is enabled.|


8. A new PCG configuration file is generated and its location is displayed on the console. You will receive an output similar to the following.

  <br />

  ```bash hideClipboard
  ==== PCG config saved ====
  Location: :/home/spectro/.palette/pcg/pcg-20230706150945/pcg.yaml
  ```

  <InfoBox>

  The ``CloudAccount.apiKey`` and ``Mgmt.apiKey`` values in the **pcg.yaml** are encrypted and cannot be manually updated. To change these values, restart the installation process using the `palette pcg install` command.

  </InfoBox>


The Palette CLI will now provision a PCG cluster in your VMware environment. 
If the deployment fails due to misconfiguration, update the PCG configuration file and rerun the installer. Refer to the Edit and Redeploy PCG section below. For additional assistance, visit our [Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals) portal.


<br />

## Edit and Redeploy PCG

Use the following steps if you want to edit the PCG configuration file directly and use it to redeploy a PCG.

<br />

1. Make the necessary changes to the PCG configuration file the CLI created during the installation. Use a text editor, such as vi or nano.

```bash hideClipboard
vi /home/demo-user/.palette/pcg/pcg-20230706150945/pcg.yaml
```

<br />

2. To redeploy the PCG, use the `install` command with the flags `--silent` and `--config-file` . Replace the PCG configuration file path with your respective file.

```bash hideClipboard
palette pcg install --silent --config-file /home/demo-user/.palette/pcg/pcg-20230706150945/pcg.yaml
```


</Tabs.TabPane>


<Tabs.TabPane tab="OVA/OVF Template" key="ova-ovf-template">



1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Navigate to **Tenant Settings** > **Private Cloud Gateway**.


3. Click the **Create Private Cloud Gateway** button and select **VMware**. PCG installation instructions are displayed.


4. Copy the PCG installer link. Alternatively, you can download the OVA and upload it to an accessible location and import it as a local file.


## vSphere - Deploy Gateway Installer

1. Deploy a new OVF template by providing the link to the installer OVA as the URL.


2. Proceed through the OVF deployment wizard, selecting the desired Name, Placement, Compute, Storage, and Network options.


3. At the **Customize Template** step, specify Palette properties as follows:

<br />

| **Parameter** | **Value** | **Description** |
|---|---|---|
|**Installer Name** | Desired Palette Gateway Name. | The name will be used to identify the PCG instance. Typical environments may only require a single PCG to be deployed. However, multiple PCGs may be required to manage clusters across multiple vCenters. We recommend you choose a name that clearly identifies the environment for which this PCG instance is being configured.|
| **Console endpoint** | URL to Palette management platform portal. | Default: https://console.spectrocloud.com |
|**Pairing Code** | PIN displayed on the Palette management platform portal's 'Create a new Private Cloud Gateway' dialogue. | |
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


## Launch PCG

1. Close the **Create New Gateway** installation instructions and navigate to the Private Cloud Gateway page under **Tenant Settings** if you have navigated away or logged out.


2. Wait for a PCG widget to display on the page and for the **Configure** option to become available. The IP address of the installer VM will be displayed on the PCG widget. This may take a few minutes after the VM is powered on. Failure of the installer to register with Palette within 10 minutes of powering on the Virtual Machine on vSphere might indicate an error. Follow steps in [Troubleshooting](/clusters/data-center/vmware#troubleshooting) to identify and resolve the issue.


3. Click on the **Configure** button to invoke the Palette Configuration dialogue. Provide vCenter credentials and proceed to the next configuration step.


4. Choose the desired values for the Data Center, Compute Cluster, Datastore, Network, Resource pool, and Folder. Optionally, provide one or more SSH Keys or NTP server addresses.


5. Choose the IP Allocation Scheme - Static IP or DHCP. Selecting static IP enables the option to create an IP pool. To create an IP pool, provide an IP range or a subnet. The IP addresses from the IP pool will be assigned to the PCG cluster. By default, the IP pool is available for use by other tenant clusters. You can prevent this by toggling on the **Restrict to a single cluster** option. 

<!-- A detailed description of all the fields involved in the creation of an IP pool can be found [here](/clusters?clusterType=vmware_cluster#ipaddressmanagement). -->


6. Click on **Confirm** to initiate PCG cluster provisioning. Cluster status should change to **Provisioning** and eventually to **Running**, when the PCG cluster is fully provisioned. This process can take about 10 minutes.

  You can click on the PCG widget in the UI to view a detailed provisioning sequence on the **Cluster Details** page. If PCG cluster provisioning results in errors or gets stuck, you can view the details on the **Summary** tab or the **Events** tab of the **Cluster Details** page.

  In certain cases where provisioning of the PCG cluster is stuck or failed due to invalid configuration, you can reset the process from the PCG widget.


7. When the PCG transitions to the **Running** state, it is fully provisioned and ready to handle tenant cluster provisioning requests.


8. Power off the installer OVA that you initially imported at the start of this installation process.

<InfoBox>

A PCG cluster installation automatically creates a cloud account using the credentials entered at the time the PCG cluster is deployed. You can use this account to provision clusters across all tenant projects.

</InfoBox>

</Tabs.TabPane>

</Tabs>


<br />

---



# Upgrade PCG

Palette maintains the OS image and all configurations for the PCG. Periodically, the OS images, configurations, or other components need to be upgraded to resolve security or functionality issues. Palette releases such upgrades when required and communication about the same is presented in the form of an upgrade notification on the PCG.

Administrators should review the changes and apply them at a suitable time. Upgrading a PCG does not result in any downtime for the Tenant Clusters. During the upgrade process, the provisioning of new clusters might be temporarily unavailable. New cluster requests are queued while the PCG is being upgraded and are processed as soon as the PCG upgrade is complete.


<br />

### Delete PCG

Use the following steps to delete the PCG:

1. As a Tenant Administrator, navigate to the **Private Cloud Gateway** page under **Settings**.


2. Invoke the **Delete** action on the PCG instance that needs to be deleted.


3. The system performs a validation to ensure there are no running tenant clusters associated with the PCG instance being deleted. If such instances are found, the system presents an error. Delete relevant running tenant clusters and retry the deletion of the PCG.


4. Delete the PCG Virtual Machines within vSphere.

<br />

### Resize PCG
You can set up the PCG as a single-node or as a three-node cluster for high availability (HA). For production environments, we recommend three nodes. A PCG can be initially set up with one node and resized to three nodes later. Use the following steps to resize a single-node PCG cluster to a three-node PCG cluster.

1. As a Tenant Administrator, navigate to the **Private Cloud Gateway** page under **Settings**.


2. Invoke the resize action for the relevant PCG instance.


3. Update the size from one (1) to three (3).


4. The PCG upgrade begins shortly after the update. Two new nodes are created on vSphere, and the PCG is upgraded to a three-node cluster.

<InfoBox>
Scaling a three-node cluster down to a single-node cluster is not permitted.<p></p> A load balancer instance is launched even for a single-node PCG to support future expansion.
</InfoBox>

# IP Address Management

Palette supports DHCP as well as Static IP based allocation strategies for the VMs that are launched during cluster creation. IP Pools can be defined, using a range or a subnet. Administrators can define one or more IP pools linked to a PCG.

Clusters created using a PCG can select from the IP pools linked to the corresponding PCG. By default, IP Pools are shared across multiple clusters, but can optionally be restricted to a cluster.

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
Configuring the PCG is a prerequisite task. A default cloud account is created when the PCG is configured. This cloud account can be used to create a cluster.
</InfoBox>

<InfoBox>
Enterprise version users should choose the <i>Use System Gateway</i> option.
</InfoBox>

In addition to the default cloud account already associated with the PCG, new user cloud accounts can be created for the different vSphere users.

| **Property** | **Description** |
|---|---|
|**Account Name** | Custom name for the cloud account |
| **Private cloud gateway** | Reference to a running PCG|
| **vCenter Server** | IP or FQDN of the vCenter server|
| **Username** | vCenter username|
| **Password** | vCenter password|

# Deploy a VMware Cluster

`video: title: "vmware-cluster-creation": ./cluster-creation-videos/vmware.mp4`

Use the following steps to provision a new VMware cluster.

<br />

1. Provide the basic cluster information like Name, Description, and Tags. Tags are currently not propagated to the Virtual Machines (VMs) deployed on the cloud/data center environments.


2. Select a Cluster Profile created for the VMware environment. The profile definition will be used as the cluster construction template.


3. Review and override Pack Parameters as desired. By default, parameters for all Packs are set with values defined in the Cluster Profile.


4. Provide a vSphere Cloud account and placement information.

    |**Parameter**                            | **Description**|
    |-----------------------------------------|----------------|
        | **Cloud Account** | Select the desired cloud account. Preconfigure VMware cloud accounts with credentials in **Project Settings**. An account is auto-created as part of the PCG setup and is available for tenant cluster provisioning if the administrator permits it.|
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
