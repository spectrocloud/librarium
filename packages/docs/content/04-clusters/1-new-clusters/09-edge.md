---
title: "Edge"
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

Edge clusters are Kubernetes clusters that are set up on appliances installed in isolated locations such as hospitals, grocery stores, restaurants, etc  (as opposed to in a data center or cloud). These appliances can be bare-metal machines or virtual machines and are managed by operators at these remote sites. Spectro Cloud provides provisioning of workload clusters on such edge appliances from its SaaS based management console. Besides provisioning of the cluster, Spectro Cloud also provides end-to-end management of these cluters through operations such as scaling, upgrades, reconfguration, etc.

# Cluster Types

Spectro Cloud supports the following two configurations for edge clusters. :-

## Virtualized

In the virtualized mode, Kubernetes nodes for master and worker pools are launched as KVM based virtual machines. Each VM represents a Kubernetes node. Users can specify placement settings for these virtual machines to ensure they are launched in the desired network and storage pool. Users can also configure VM hardware settings such as CPU, Memory, Disk size etc.

## Containerized

In the containerized mode, Kubernetes nodes for the master and worker pools are launched as docker containers. Each container represents a kubernetes node.

# Edge Appliances

Spectro Cloud supports several kinds of appliances at the edge. These appliances can be registered with Spectro Management console and used for provisioning a Virtualized or Containerized cluster. Following is a list of all the supported edge appliance types:-

    | Appliance Type                            | Cluster Type     | 
    | :-------------                            | :----------      | 
    | Virtual Machine                           | Containerized    | 
    | Bare Metal Machine with LibVirt           | Virtualized      | 
    | Bare Metal Machine without Libvirt        | Containerized    | 


# High level orchestration flow

* A special edge appliance communication and orchestration component called Private Cloud Gateway - Edge (PCG-Edge)
is installed on the edge appliance. Several environment specific propertiies such as proxy settings, Pod CIDRs, etc are specified in PCG-E.
* PCG-Edge performs basic device discovery and initiates appliance registeration with the Spectro Cloud Management Console.
* User can register the appliance on the Spectro Cloud Management Console at any time by specifying a unique appliance ID. This ID can be customized while starting up PCG-E. By default, the appliance's machine ID is used as unique the appliance ID.
* Upon initial registraion of the appliance, it shows up as 'Unpaired'. Once PCG-Edge sends back the appliance information, the appliance is paired up with and the status changes to 'Ready'.
* The rest of the provisioning workflow is similar to that of any other cloud in Spectro Cloud. An environment specific cluster profile needs to be created and used for provisining cluster on the appliance. 


# Pre-requisites

* The appliance must have a standard Linux distribution such as CentOS or Ubuntu installed
* Docker runtime must be installed
* Outgoing interenet connectivity either directly or via a proxy


# Detailed Instructions

The following sections cover the prerequisites and detailed instructions for deploying clusters on these edge appliances.

## Appliance Registration
Navigate to the appliance section under 'Clusters' menu and register the appliance by provding its unique ID. This ID should match the ID that will be sent over by the PCG-Edge running on the appliance. By default PCG-Edge use the machine ID but it it can be overridden to something different (for e.g. - 'hospital-1'). Optionally specify one or more tags for the appliance. Spectro Cloud supports a special 'name' tag. If specified, Spectro Cloud would use the value of this tag in other UIs to make idenftification of the device easier.


## PCG-Edge Install
Copy the PCG-E binary (Contact Spectro Cloud support to get the location) on to the appliance and execute the following command. Please note that certain properties such as Libvirt Socket, etc are required when setting up a virtualized cluster (isvirtual true)
`
Usage: <edge-installer.bin> -- [ -i | --ip ] [ -a | --apiurl ]
                        [ -d | --deviceid device123 ]
                        [ -v | --isvirtual true ] 
                        [ -s | --sshkey /tmp/sshkey.pem ]
                        [ -u | --sshuser ubuntu ]
                        [ -x | --virtsock socketname ]
                        [ -m | --mode offline ]
                        [ --pod-cidr 192.168.0.0/16 ]
                        [ --service-cidr 10.96.0.0/12 ]
                        [ --http-proxy http://proxy.com ]
                        [ --https-proxy http://proxy.com ]
                        [ --no-proxy 172.0.0.1 ]
                        [ --user-no-proxy 172.0.0.1 ]
			
	example: <edge-installer.bin> -- -i 10.10.10.10 -a api.spectrocloud.com -d test123 -v true -s /tmp/ssh.pem -u ubuntu 
	
	-i  IP address of the local machine/vm [Mandatory]
	-d  Custom Device id [Optional]
	-a  Endpoint for Hubble API [Optional][default:api.spectrocloud.com]
	-v  false for Virtual Machine based install , true for Bare metal install. [Optional][default: false]
	-s  SSH key for connecting to libvirt [Mandatory if -v true]
	-u  SSH user for connecting to libvirt  [Mandatory if -v true] 
	-x  Libvirt socket name [Optional if -v true][default: /var/run/libvirt/libvirt-sock] 	
	-m  Installation mode [Optional][default: online]
	--pod-cidr Pod CIDR Range [Optional]
	--service-cidr Service CIDR Range  [Optional]
	--http-proxy Proxy for Http connections [Optional]
	--https-proxy Proxy for Https connections [Optional]
	--no-proxy comma separated list for No Proxy [Optional]
	--user-no-proxy comma separated list for User No Proxy [Optional]

`

## Cluster Profile Creation

Create a cluster profile with cloud type 'edge' and choose the virtualized option if LibVirt based virtualized cluster is desired. Specify the core layers  Operating System, Kubernetes, CSI and CNI. For virtualized clusters, you may choose standard CNCF Kubernetes distrbutions or Konvoy Kubernetes distributions.


## Cluster Deployment
