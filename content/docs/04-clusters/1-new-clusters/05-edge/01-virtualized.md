---
title: "Virtualized Edge"
metaTitle: "Creating new clusters on virtualized edge cluster"
metaDescription: "The methods of creating clusters for a speedy deployment Virtualized edge device"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';



# Overview

Kubernetes nodes for master and worker pools are launched as KVM-based virtual machines in the virtualized mode. Each VM represents a Kubernetes node. Users can specify placement settings for these virtual machines to ensure they are launched in the desired network and storage pool. Users can also configure VM hardware settings such as CPU, Memory, Disk size, etc.

# Prerequisites

* Create an Admin account/Tenant Admin account in Palette Console.


* Bare metal is refreshed with latest release Spectro Cloud Palette Installer Bin.

# Detailed Instructions

The following sections cover the prerequisites and detailed instructions for deploying clusters on a virtualised edge appliances.

## Appliance Registration

* Login to Palette Console as a tenant.


* Go to the **Clusters** page and click open the **Appliances** tab.


* Click on “Add Appliances” to open the wizard.


* Navigate to the appliance section under the 'Clusters' menu and register the appliance by providing its unique ID.


* This ID should match the ID sent over by the PCG-Edge running on the appliance. By default, PCG-E uses the machine ID, but it can be overridden to something different (e.g. 'store-1').


* Optionally specify one or more tags for the appliance. For example, Palette supports a unique 'name' tag. If specified, Palette would use the value of this tag in other UIs to make identification of the device easier.


* Open the kebab (three-dot elipsis) menu and click delete to delete the appliance.

<InfoBox>
The appliance will register with the PCG-E once PCG-E is installed successfully.
</InfoBox>

## Create your Edge System Profile:

System profiles provide a way to bootstrap the system with an initial set of virtual applications. System profiles are the templates created with pre-configured layers/components required for VM deployment for a Virtualized Edge device. System Profiles are configured specifically to virtualized edge devices and edge-specific workload management. 
The following steps need to be performed to create a new system profile:

1. Login to Palette management console and go to `Profiles` and open the `System Profile` tab and click **Add System Profiles**.


2. Provide basic profile information such as **System profile name**, **Description** (optional), and **Tags** (optional). Tags on a cluster profile are propagated to the VMs deployed on the edge device when clusters are created from the system profile.


3. Additional layers such as Monitoring, Security, Load Balancers, etc. may be added and configured as desired. These add-on layers can be added in one of the following ways:
    * **Add New** - Add a Palette Pack from a pack registry or a Helm Chart from a chart registry. The public Spectro Cloud Pack registry and a few popular helm chart repositories are already available out of the box. Additional pack registries or public/private chart registries can be added to Palette.
    * **Add Manifest** - Layers can be constructed using raw manifests to provision Kubernetes resources that are not available via Palette or Charts. Pack Manifests provide a pass-through mechanism wherein additional Kubernetes resources can be orchestrated onto a cluster along with the rest of the stack. 
    * Fill the wizard with a **Layer name**, enable *VM manifest* and give optional layer value and install order. Users can also avail themselves of the option to `attach a manifest`.


4. Click on the `Confirm Updates` button to save the configuration.


5. Click on the `Next` button to go to the review page.


6. Click on the `Finish` button to save the system profile.

<InfoBox>
Users can add other Virtualized applications as layers to your system profile as desired. You can also make changes to the profile after deployment to update the system at a later point.
</InfoBox>

<br />

## Download System Profile 

* Click on the system profile previously created to navigate to the profile details page. 


* Click on the `Download System Profile’ button at the bottom of the panel to download the profile definition as an archive. 

<br />

## Register Appliance 

Login to the Palette console and register a new appliance with a unique ID, such as _device-123_.

<br />

<WarningBox> 
Please note that this ID needs to be globally unique across all tenants and users. This ID needs to be provided at the edge site as part of the creation of the unattended.yaml file.
</WarningBox> 

<br />

## Install Edge Services

The following steps describe the interim process for installing services into the bare metal appliance. This will be replaced in future milestones when these steps will be integrated into the AutoYast based manufacturing process.

1. SSH into the appliance


2. Switch to root user `sudo -i`


3. Access the **unattended.yaml** file with site properties 

    * After the installation, the Palette PCG-E service waits for the site-specific properties such as proxy, LAN IP, WAN IP, etc to be provided in a file called **unattended.yaml**. 
    * Get access to the unattended yaml template at `opt/spectrocloud/conf/`with the contents in the unattended.yaml file:
 Please validate the format of your YAML contents. Copying and pasting YAML blocks might cause formatting issues.
    * Update the device_id
    * Update the proxy settings
    * Make the below changes to the unattended yaml:
        * Edge appliance id : Same as the appliance Id created via UI or Use an Id and create an appliance with same Id.
        * HA/Standalone Configuration
        * Palette end-point : console.spectrocloud.com 


4. Apply the unattended yaml to initiate the site TUI Installation.


5. Once applied unattended yaml, the PCG-E service proceeds to start the system cluster (kind cluster), starts up the Harbor registry with an initial set of artifacts supplied during installation and deploys system applications as specified in the system profile. 


The PCG-E service starts deploying the bootstrap container, which in turn launches the system kind cluster. The high-level logs are in the edge.log file located at `/opt/spectrocloud`.

The edge service pairs up with the appliance registered in Palette SaaS during this process and associates it with the System Profile provided during installation. This creates a live link between the System Profile and the PCG-E. Changes to the System Profile are picked up by the PCG-E and System Applications are created/modified/deleted as specified.

**Note:**: Monitor the progress of the System Cluster

## Monitor your VM 

As the system kind cluster comes up, Palette services read the system profile definition provided during installation and deploy system applications. The VM operator service running in system kind cluster will launch a new virtual machine using the server image and configure network properties such as Lan IP, WAN IP, DHCP Pool range, etc. by using the templatized configuration of confg.xml in the system profile, with the site properties specified in unattended.yaml.

## Cluster Profile Creation

Cluster profiles are created by configuring various layers of the Kubernetes infrastructure stack. The following steps need to be performed to create a new cluster profile:

1. Provide basic profile information such as **Name, Description, Profile Type,** and **Tags**. Profile Type (Full, Infra, Add-on) will dictate the layers configured in the cluster profile. Tags on a cluster profile are propagated to the edge device when clusters are created from the cluster profile.


2. Select the environment as `Edge` for Infra or Full cluster profile.


3. Configure the layers of the infrastructure stack. The following layers are considered "core infrastructure" layers. Configuring these layers is mandatory for cluster profiles of Infra or Full. These layers are not configurable for "Add-On" cluster profiles:
    * OS
    * Kubernetes
    * Network
    * Storage 


<InfoBox>
For the OS pack, if a custom CA certificate is required for outgoing traffic, make sure to specify it.

**Example:**

     Kubeadmconfig:
     preKubeadmCommands:
     - echo "Executing pre kube admin config commands"
     - update-ca-certificates
     - 'systemctl restart containerd; sleep 3'
     - 'while [ ! -S /var/run/containerd/containerd.sock ]; do echo "Waiting for containerd..."; sleep     1; done'
    postKubeadmCommands:
     - echo "Executing post kube admin config commands"
    files:
     - targetPath: /usr/local/share/ca-certificates/mycom.crt
    targetOwner: "root:root"
    targetPermissions: "0644"
    content: |
      -----BEGIN CERTIFICATE-----

           Certificate Content

      -----END CERTIFICATE-----

For Kubernetes packs, please ensure that the Pod CIDR and service CIDR do not overlap with any IP ranges assigned in your network.
</InfoBox>

<InfoBox>

If workloads deployed to the edge clusters require persistence, we recommend using the Rook-Ceph pack for the storage layer. Rook-Ceph turns distributed storage systems into self-managing, self-scaling, self-healing storage services. It automates the storage administrator tasks such as: deployment, bootstrapping, configuration, provisioning, scaling, upgrading, migration, disaster recovery, monitoring, and resource management.

The Rook-Ceph pack in Palette provides a couple of preset configurations. You can choose one of these configurations as a starting point and further tune configurations as desired:

* Multi-Node Cluster With Replication (Default) - This recommended configuration sets up a three-node Ceph cluster. This setting requires at least three nodes selected for the worker pool.

* Single Node Cluster - This configuration creates a single node Ceph cluster.

Following are the specific considerations that need to be taken into account for Virtualized clusters when using Rook-Ceph for storage:

* In the cluster provisioning flow, we need to add additional disks for all nodes in the worker pool.

* No changes to the pack settings are required. Ceph cluster config is set to useAllDevices by default.
	 
</InfoBox>

* Additional layers such as Monitoring, Security, Load Balancers, etc., may be added and configured as desired. These layers may be configured for "Full" or "Add-On" profiles. The add-on layers can be added in one of the following ways: 
    * **Add New** - Add a Palette Pack from a pack registry or a Helm Chart from a chart registry. The public Palette Pack registry and a few popular helm chart repositories are already available out of the box.
    
    * **Additional** pack registries or public/private chart registries can be added to Palette.


* **Pack Manifests** - Layers can be constructed using raw manifests to provide Kubernetes resources unavailable via Palettes or Charts. Pack Manifests provide a pass-through mechanism wherein additional Kubernetes resources can be orchestrated onto a cluster along with the rest of the stack.


4. Configure each layer as follows:

   * Choosing the desired version includes pinning to a specific version (e.g., 1.1.1) or picking a major or minor train such as 1.x or 1.1.x. Picking a major/minor train results in a dynamic version association. The latest release from that train is linked to the pack at any given point. Future release updates on the train will result in the pack being relinked to the newest version. This allows clusters to always be at the latest released version without making subsequent updates to the profile.
   
   * The configuration option and version selected might provide configuration parameters to provide granular control or fine-tune certain aspects of the functionality. The configuration parameters are set to values based on standard best practices for the packs provided out of the box. Users may override these parameters as desired. Additionally, for specific layers, Palette provides a bunch of presets to enable or configure a feature within the add-on quickly. These presets are a group of properties preset with defaults to provide a quick and easy way to modify a set of relevant properties. If available, users can also enable one or more presets as appropriate.
   
   * Attach additional manifests to the layer if desired. Attach manifests provide a way for provisioning additional Kubernetes resources that support integration or an add-on. For example, specific integration offered through packs or charts may require creating resources like secrets, crds, etc., to complete the installation end to end. This can be achieved by adding one or more 'Attach Manifests' to the layer.
   

5. Review your changes and save the cluster profile.


## Cluster Deployment

The following steps need to be performed to provision a new Edge cluster:

1. Provide basic cluster information like name, description, and tags. Tags are currently not propagated to the VMs deployed on the edge device.


2. Select a cluster profile created for the ‘Virtualized’ Edge environment depending on the type of cluster to be deployed. The profile definition will be used as the cluster construction template.


3. Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.


4. Provide the cluster configuration details for Virtualized Clusters:
      * Virtual-IP
      * SSH Keys (optional)
      * NTP servers  (optional)


5. Configure the master and worker node pools. A master and a worker node pool are configured by default:

    * **Node Pool Name** - A descriptive name for the node pool

    * **Size** - Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5

    * **Allow worker capability (master pool)** - Workloads to be provisioned on master nodes

    * **Pool Configuration** - This field applies to the Virtualized clusters only. Provide the resource requirements in terms of the following parameters:

        * CPU: number of virtual CPUs required
        * Memory: Memory to be allocated in GB
        * Root Disk: Secondary disk required in GB
        * CPUs Set - optional number of CPU grouping 

    * **Appliances** - Select the registered appliance from the drop-down. Can add multiple appliances for pool configuration. For Virtualized cluster provisioning, in addition to the appliance selection, a few extra pieces of information need to be provided, such as:
        * Network Type: Select the network type from the drop-down
        * Network Names: Make the selection of the network from the drop-down
        * Image Storage Pool: Pool where the virtual machine images are located
        * Target Storage Pool: Pool where the source virtual machine is cloned to before launch
        * Data Storage Pool: Pool where the virtual storage is located

   * **Rolling Update** - For pool scale up and scale down, there are two choices of Rolling Update.
        * Expand First - Launches the new node and then shut down the old node
        * Contract First - Shut down the old node first and then launches the new node

   * Set the Cluster Policies as per requirement. For example, these policies could be set or scheduled later when the clusters start running. 
        * **Manage Machines**: Schedule the OS Patching to update the latest patches to the cluster.
        * **Scan Policies**: Users can schedule the security scans from the following options:
           * Kubernetes Configuration Security 
           * Kubernetes Penetration Testing
           * Kubernetes Conformance Testing
        * **Backup Policies**: Palette provides a convenient backup option to backup the Kubernetes cluster state into object storage and restores it at a later point in time if required to the same or a different cluster.


6. Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

**Note:** For more details on Day 2 Cluster management please refer [Cluster Management](/clusters/cluster-management).

## Monitor Local Harbor Registry 
The local Harbor registry is deployed in the system cluster and exposed as a node-port service running on port 10443. Login credentials for the local harbor registry can be used for this purpose.

**Note:**
Workload Cluster progress can be monitored inside the box via TUI also.

## Deleting an Edge Cluster

The deletion of an Edge cluster results in the removal of all virtual machines and associated storage disks created for the cluster. The following tasks need to be performed to delete an Edge cluster:

* Select the cluster to be deleted from the cluster view and navigate to the cluster overview page.


* Invoke a delete action available on the page : **cluster > settings > cluster settings > Delete Cluster.**


* Confirm **Delete** action.


* Cluster status is updated to `Deleting` while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to `Deleted` and it is removed from the list of clusters.

<InfoBox>
Delete action is only available for clusters that are fully provisioned. For clusters that are still in the process of being provisioned, Abort action is available to stop provisioning and delete all resources.
</InfoBox>

