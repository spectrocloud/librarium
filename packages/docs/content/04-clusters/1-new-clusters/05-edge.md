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
* User can register the appliance on the Palette Management Console at any time by specifying a unique appliance ID. This ID can be customized while starting up PCG-E. The appliance's machine ID is used as a unique appliance ID by default.
* Upon initial registration of the appliance, its status will become 'Unpaired.' Once PCG-Edge sends back the appliance information, the appliance is paired up, and the status changes to 'Ready.'
* The rest of the provisioning workflow is similar to any other cloud in Palette. An environment-specific cluster profile needs to be created and used to provision the appliance cluster. 


# Prerequisites

* Create an Admin account/Tenant Admin account in Palette Console.
* Edge Latest Installer Binary is downloaded and is available in the Device/Appliance. The latest Binary can be downloaded from:
		<BINARY_LOCATION>
* For Containerized Edge Cluster Installation:
   * Linux based operating systems like Ubuntu/CentOS
   * Docker installed on the system
Note: The snap-installed Docker on Ubuntu does not work. Uninstall the same and install using Official Docker steps. https://docs.docker.com/engine/install/)
	* Make sure to have root access to the machine
* For Virtualized Installation:
	* Bare metal machine with Linux based Operating system
	* Libvirt is installed on the machines. 

# Edge Terminology
**System Profile** - The model or blueprint for a set of system applications that the edge system needs to be bootstrapped. Like cluster profiles, system profiles are constructed using layers with optional dependencies between them. Each layer is configured using a Spectro Cloud pack, a helm chart, or a raw Kubernetes manifest. 

**VM Operator** - To support virtualized applications, they need to be defined declaratively in system profiles. VM operator that runs in both the System Kind cluster and the application cluster looks for these definitions and orchestrates the VM as specified. Virtualized applications need to be modeled in the profiles as a Manifest. Palette UI provides some out-of-the-box presets for standard VM configurations to assist in modeling these VM applications. 

**Spectro Cloud Harbor** – Content registry hosts Spectro Cloud Palette artifacts such as container images, VM images, Packs, etc. This is an interim solution until Spectro Cloud artifacts can also be hosted in Flexera Harbor.

**Local Harbor** – Harbor registry installed in the System Kind cluster. It synchronizes content from Flexera Harbor through a content-sync process and synchronizes content from Spectro Cloud Harbor through a content-replication process. 

**Content sync** – Process used by Palette to download desired content from an online Harbor registry to a local Harbor registry. The content to be downloaded is specified as ‘content’ tags in the cluster or system profiles. 

**Content tags** – YAML block in the cluster or system profiles to identify the source of remote content that needs to be downloaded from Flexera Harbor. 

**Unattended.yaml** – YAML file to be provided by the site operator with site-specific properties to initiate the deployment at the edge. In future milestones, a Text User Interface (TUI) will be provided for the site operator to provide site-specific properties and the unattended.yaml file will be generated from that. 

**Registry Credentials** – Section in the unattended YAML file, where credentials for the Flexera Harbor and Spectro Cloud Harbor registries are specified.

