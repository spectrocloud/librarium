---
title: "Edge (Beta)"
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

Edge clusters are Kubernetes clusters set up on appliances installed in isolated locations such as hospitals, grocery stores, restaurants, etc., unlike a data center or cloud environment. These appliances can be bare metal machines or virtual machines and are managed by operators at these remote sites. Palette provides the provisioning of workload clusters on such edge appliances from its SaaS-based management console. Besides provisioning of the cluster, Palette also provides end-to-end management of these clusters through operations such as scaling, upgrades, reconfiguration, etc.

# Private Cloud Gateway - Edge (PCG-E)

Deploying edge clusters requires a Private Cloud Gateway - Edge (PCG-E) to be installed on the appliances for Palette to discover the appliance and provision workload clusters on them. A  PCG-E is Palette's on-prem component to support remote Edge devices. Palette PCG-E, once installed on-prem, registers itself with Palette's SaaS portal and enables secure communication between the SaaS portal and the Edge Clusters.

# Cluster Types

Palette supports the following two configurations for edge clusters:

## Virtualized

Kubernetes nodes for master and worker pools are launched as KVM-based virtual machines in the virtualized mode. Each VM represents a Kubernetes node. Users can specify placement settings for these virtual machines to ensure they are launched in the desired network and storage pool. Users can also configure VM hardware settings such as CPU, Memory, Disk size, etc.

![virtualized-edge.png](virtualized-edge.png)

## Containerized

Kubernetes nodes for the master and worker pools are launched as docker containers in the containerized mode. Each container represents a Kubernetes node.

![containerized-edge.png](containerized-edge.png)

# Edge Appliances

Palette supports several kinds of appliances at the edge. These appliances can be registered with the Palette Management console and used for provisioning a Virtualized or Containerized cluster. Following is a list of all the supported edge appliance types:

| Appliance Type                            | Cluster Type     |
| :-------------                            | :----------      |
| Virtual Machine                           | Containerized    |
| Bare Metal Machine with Libvirt           | Virtualized      |
| Bare Metal Machine without Libvirt        | Containerized    |

# High-level orchestration flow

* A communication and orchestration component called Private Cloud Gateway - Edge (PCG-E) is installed on the edge appliance. Several environment-specific properties, such as proxy settings, Pod CIDRs, etc., are specified in PCG-E.
* PCG-E performs fundamental device discovery and registration with the Palette Management Console.
* User can register the appliance on the Palette Management Console at any time by specifying a unique appliance ID. This ID can be customized while starting up PCG-E. By default, the appliance's machine ID is used as a unique appliance ID.
* Upon initial registration of the appliance, its status will become 'Unpaired.' Once PCG-Edge sends back the appliance information, the appliance is paired up, and the status changes to 'Ready.'
* The rest of the provisioning workflow is similar to any other cloud in Palette. An environment-specific cluster profile needs to be created and used to provision the appliance cluster.

# Prerequisites

* A tenant account in Palette Manage Console.
* Linux based operating systems like Ubuntu/CentOS
* Docker installed on the system
**Note**: The snap-installed Docker on Ubuntu does not work. Uninstall the same and install using Official Docker steps. <https://docs.docker.com/engine/install/>)
* Make sure to have root access to the machine

# Detailed Instructions

The following sections cover the prerequisites and detailed instructions for deploying clusters on containerized edge appliances.

## Appliance Registration

* Login to Palette Console as a tenant.
* Go to the **Clusters** page and click open the **Appliances** tab.
* Click on “Add Appliances” to open the wizard.
* Navigate to the appliance section under the 'Clusters' menu and register the appliance by providing its unique ID.
* This ID should match the ID sent over by the PCG-Edge running on the appliance. By default, PCG-E uses the machine ID, but it can be overridden to something different (e.g. 'hospital-1').
* Optionally specify one or more tags for the appliance. For example, Palette supports a unique 'name' tag. If specified, Palette would use the value of this tag in other UIs to make identification of the device easier.
* Open the kebab (three-dot) menu and click delete to delete the appliance.

<InfoBox>
The appliance will register with the PCG-E once PCG-E is installed successfully.
</InfoBox>

## PCG-Edge Install

* Download the edge installer binary from the following location onto the appliance:
<https://spectro-images.s3.amazonaws.com/edge-v2.3x.bin>
* A Bootstrapper mechanism for installing the Palette component “PCG-E” is baked into the Palette PCG-E binary.
* As the root user run the PCG-E installation command:

```bash
./edge-installer.bin -- -i  <IP address of the local machine/vm> 
                                   -d  <Custom Device id [Optional]> 
                                   -a  <Endpoint for Hubble API [Optional][default:api.spectrocloud.com]> 
                                   --http-proxy <Proxy for Http connections> 
                                   --https-proxy <Proxy for Https connections> 
                                   --no-proxy <comma separated list for No Proxy>
```

**Example:**

```bash
./edge-installer.bin -- -i 10.200.3.126 -d hospital-docker-app-01 -a console.gehc-ehl.spectrocloud.com --http-proxy http://10.10.132.89:3128 --https-proxy http://10.10.132.89:3128 --no-proxy 10.10.128.10,.spectrocloud.local,10.0.0.0/8
```

## Cluster Profile Creation

Cluster profiles are created by configuring various layers of the Kubernetes infrastructure stack. The following steps need to be performed to create a new cluster profile:

* Provide basic profile information such as Name, Description, Profile Type, and Tags. Profile Type (Full, Infra, Add-on) will dictate the layers configured in the cluster profile. Tags on a cluster profile are propagated to the edge device when clusters are created from the cluster profile.
* Select the environment as ' Edge' for Infra or Full cluster profile (**for containerized edge cluster, toggle the virtualized button**).
* Configure the layers of the infrastructure stack. The following layers are considered "core infrastructure" layers. Configuring these layers is mandatory for cluster profiles of Infra or Full. These layers are not configurable for "Add-On" cluster profiles:
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

Following are the specific considerations that need to be taken into account for virtualized and containerized clusters when using Rook-Ceph for storage:

    * Add three disks to the bare-metal machine or the VM instance.
    * Configure pack settings to use device filter and set up only one OSD per device. As an example, if the disks added were sdd, sde, sdf, the following device filters would need to be set:

**Example:**  

```json
 storage: 
   useAllNodes: true
   useAllDevices: false
   deviceFilter: ^sd[d-f]
   config:
     osdsPerDevice: "1" # this value can be overridden at the node or device level

```
  
</InfoBox>

* Additional layers such as Monitoring, Security, Load Balancers, etc., may be added and configured as desired. These layers may be configured for "Full" or "Add-On" profiles. The add-on layers can be added in one of the following ways:
  * Add New - Add a Palette Pack from a pack registry or a Helm Chart from a chart registry. The public Palette Pack registry and a few popular helm chart repositories are already available out of the box.
  * Additional pack registries or public/private chart registries can be added to Palette.
* Pack Manifests - Layers can be constructed using raw manifests to provide Kubernetes resources unavailable via Palettes or Charts. Pack Manifests provide a pass-through mechanism wherein additional Kubernetes resources can be orchestrated onto a cluster along with the rest of the stack.

* Configure each layer as follows:

  * Choosing the desired version includes pinning to a specific version (e.g., 1.1.1) or picking a major or minor train such as 1.x or 1.1.x. Picking a major/minor train results in a dynamic version association. The latest release from that train is linked to the pack at any given point. Future release updates on the train will result in the pack being relinked to the newest version. This allows clusters to always be at the latest released version without making subsequent updates to the profile.
  * The configuration option and version selected might provide configuration parameters to provide granular control or fine-tune certain aspects of the functionality. The configuration parameters are set to values based on standard best practices for the packs provided out of the box. Users may override these parameters as desired. Additionally, for specific layers, Palette provides a bunch of presets to enable or configure a feature within the add-on quickly. These presets are a group of properties preset with defaults to provide a quick and easy way to modify a set of relevant properties. If available, users can also enable one or more presets as appropriate.
  * Attach additional manifests to the layer if desired. Attach manifests provide a way for provisioning additional Kubernetes resources that support integration or an add-on. For example, specific integration offered through packs or charts may require creating resources like secrets, crds, etc., to complete the installation end to end. This can be achieved by adding one or more 'Attach Manifests' to the layer.
* Review your changes and save the cluster profile.

## Cluster Deployment

The following steps need to be performed to provision a new Edge cluster:

* Provide basic cluster information like name, description, and tags. Tags are currently not propagated to the VMs deployed on the edge device.

* Select a cluster profile created for the ‘Containerized’ or ‘Virtualized’ Edge environment depending on the type of cluster to be deployed. The profile definition will be used as the cluster construction template.

* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.

* Provide the cluster configuration details:
  * SSH Keys (optional) - Public key to configure remote SSH access to the nodes (User: spectro).

* Configure the master and worker node pools. A master and a worker node pool are configured by default:

  * Node Pool Name - A descriptive name for the node pool
  * Size - Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5
  * Allow worker capability (master pool) - Workloads to be provisioned on master nodes
  * Appliances - Select the registered appliance from the drop-down. Can add multiple appliances for pool configuration.
* Rolling Update - For pool scale up and scale down, there are two choices of Rolling Update.
  * Expand First - Launches the new node and then shut down the old node
  * Contract First - Shut down the old node first and then launches the new node
* Set the Cluster Policies as per requirement. For example, these policies could be set or scheduled later when the clusters start running.
  * Manage Machines: Schedule the OS Patching to update the latest patches to the cluster.
  * Scan Policies: Users can schedule the security scans from the following options:
    * Kubernetes Configuration Security
    * Kubernetes Penetration Testing
    * Kubernetes Conformance Testing
  * Backup Policies:  
 Palette provides a convenient backup option to backup the Kubernetes cluster state into object storage and restores it at a later point in time if required to the same or a different cluster.
* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

For more details on Day 2 Cluster management please refer [Cluster Management](/clusters/#cluster-management).

## Deleting an Edge Cluster

The deletion of an Edge cluster results in the removal of all virtual machines and associated storage disks created for the cluster. The following tasks need to be performed to delete an Edge cluster:

* Select the cluster to be deleted from the cluster view and navigate to the cluster overview page.
* Invoke a delete action available on the page : cluster -> settings -> cluster settings -> Delete Cluster.
* Confirm delete action.
* Cluster status is updated to ‘Deleting’ while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to ‘Deleted’ and it is removed from the list of clusters.

<InfoBox>
Delete action is only available for clusters that are fully provisioned. For clusters that are still in the process of being provisioned, ‘Abort’ action is available to stop provisioning and delete all resources.
</InfoBox>
