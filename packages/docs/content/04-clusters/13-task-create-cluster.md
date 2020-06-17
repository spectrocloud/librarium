---
title: "Task: Create an AWS Cluster"
metaTitle: "Task: Create Cluster in AWS through Spectro Cloud"
metaDescription: "How to create a Cluster in AWS through Spectro Cloud"
icon: ""
---

# Task: Create Cluster

The following steps need to be performed to provision a new AWS cluster:

* Provide basic cluster information like name, description and tags. Tags on a cluster are propagated to the VMs deployed on the cloud / data center environments.
* Select a cluster profile created for AWS cloud. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide AWS Cloud account and placement information.
    * Cloud Account - Select the desired cloud account. AWS cloud accounts with AWS credentials need to be pre-configured in project settings.
    * Region - Choose the desired AWS region where you would like cluster be be provisioned.
    * SSH Key Pair Name - Choose the desired SSH Key pair. SSH key pairs need to be pre-configured on AWS for the desired regions. The selected key is inserted into the VMs provisioned.
    * Static Placement - By default Spectro Cloud uses dynamic placement wherein a new VPC with a public and private subnet is created to place cluster resources for every cluster. These resources are fully managed by Spectro Cloud and deleted when the corresponding cluster is deleted. Turn on the Static Placement option if its desired to place resources into pre-existing VPCs and subnets.
* Configure master and worker node pools. A master and a worker node pool is configured by default.
    * Name - a descriptive name for the node pool
    * Size - Number of VMs to be provisioned for the node pool. For master pool, this number can be 1, 3 or 5
    * Allow worker capability (master pool) - Select this option for allowing workloads to be provisioned on master nodes
    * Instance type - Select the AWS instance type to be used for all nodes in the node pool
    * Availability Zones - Choose one or more availability zones. Spectro Cloud provides fault tolerance to guard against failures like hardware failures, network failures etc. by provisioning nodes across availability zones if multiple zones are selected.
* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

**WARNING:**

> *New worker pools may be added if its desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the ‘m3.large’ instance types for general purpose workloads and another worker pool with instance type ‘g2.2xlarge’ can be configured to run GPU workloads.*
