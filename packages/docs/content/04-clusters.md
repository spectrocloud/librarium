---
title: "Clusters"
metaTitle: "Creating clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
icon: "clusters"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';

# Overview

Kubernetes clusters in Spectro Cloud are instantiated from cluster profiles. A cluster definition in Spectro Cloud consists of a reference to a cluster profile, cloud configuration, as well as the cluster size and placement configuration. The following high-level tasks are performed as part of the cluster creation:

* Orchestration of computing, network, and storage resources on the cloud environments along with the required placement infrastructure.
* Installation and configuration of various Kubernetes components like Kubelet, API servers, etcd, scheduler, etc.
* Installation and configuration of the cloud-specific network (CNI) and storage (CSI) plugins.
* Securing of the cluster infrastructure and configuration in accordance with the relevant OS, Kubernetes, and cloud security best practices.
* Deployment of additional add-ons such as Prometheus, Permissions Manager, Vault, etc., as specified in the cluster profile.

# Images

Spectro Cloud provides VM images for cluster computing infrastructure out of the box for the most recent versions of operating systems such as Ubuntu, CentOS, RHEL. These images are security-hardened based on the respective CIS Benchmarks. Kubernetes components such as kubelet, kubeadm, etc. are pre-installed in these images. The specific image for a cluster is derived from the Operating System and Kubernetes packs configured in the cluster profile.

The out of the box images are hosted either in the public cloud (AWS - AMI, Azure - VHD) or Spectro Cloud's storage repository (vSphere - OVA). During provisioning, the image is copied (if missing) to the desired cloud region or downloaded onto a private datacenter.

## Customization

Spectro Cloud provides various forms of customization options for VM images. All these customization options require a private pack registry to be set up with customized OS packs.

### Customize out of the box images

Spectro Cloud's out of the box images are security-hardened and have Kubernetes components pre-installed. Additional components can be installed on the images at runtime by defining one or more Ansible roles in the customized OS pack. Spectro Cloud’s orchestration engine creates a new image by instantiating a VM instance from the out of box image and executing the specified Ansible roles on the instance. This custom image is used for cluster provisioning. The customized image is tagged with a unique signature generated from the pack definition so that it can be reused for future cluster provisioning requests.

### Bring your own Image

Users can bring used their own OS image by building custom OS packs and providing a reference to the desired image in pack annotations. These images can be:

* Pre-configured with all desired OS packages and Kubernetes components for the desired version installed. No Ansible roles are specified in the OS pack. The “skip k8s installation” option in the OS pack is set to true. (`"skipK8sInstall": "true"`)

* Base images with none of the desired packages or Kubernetes components installed. Ansible roles are specified in the OS pack to install additional packages. The “skip K8s installation” option in the OS pack is set to false (`"skipK8sInstall": "false"`)

* A combination of the two options above.

Spectro Cloud’s orchestration engine examines the OS pack configuration and determines if customization is required. If customization is required, a VM instance is launched from the image reference provided in the pack. Installation of Kubernetes components and/or execution of additional Ansible roles is performed on this VM instance. A VM image is then created from this instance and used for cluster provisioning. The customized image is tagged with a unique signature generated from the pack definition so that it can be reused for future cluster provisioning requests.

# Security

Spectro Cloud secures the Kubernetes clusters provisioned by following security best practices at the OS, Kubernetes, and Cloud Infrastructure level.

## Operating System

Spectro Cloud’s out of the box VM images are hardened in accordance with the relevant OS CIS benchmark. Additionally, the images are scanned for vulnerabilities regularly and fixes are applied to these images when available from the provider. The upgraded images are released in the form of updated OS packs in Spectro Cloud’s pack registry and are available to the users to apply to their existing clusters at the time convenient to them.

## Kubernetes

Kubernetes components and configuration are hardened in accordance with the Kubernetes CIS Benchmark. Spectro Cloud executes Kubebench, a CIS Benchmark scanner by Aqua Security, for every Kubernetes  pack to ensure the master and worker nodes are configured securely.

## Cloud

Spectro Cloud follows security best practices recommended by the various cloud providers when provisioning and configuring the computing, network, and storage infrastructure for the Kubernetes clusters. These include practices such as isolating master and worker nodes in dedicated network domains, limiting access through use constructs like security groups. etc.

<InfoBox>
  The security measures mentioned above are implemented for Spectro Cloud’s out of the box OS and
  Kubernetes packs. For customized OS Kubernetes packs, users are responsible for taking the
  relevant measures to secure their clusters.
</InfoBox>

# Day-2 Management

Spectro Cloud provides several options to manage Kubernetes clusters on an ongoing basis. These include options to scale up/down the cluster by adding/reducing the number of nodes in a node pool, add additional worker pools, resize nodes in a node pool by modifying the instance type, and add additional fault domains such as availability zones to a node pool.

<InfoBox>
  Cluster management operations result in the update of cluster definitions in Spectro Cloud’s database. The updated definition is retrieved by the management agent running in the cluster. The  cluster control plane subsequently reconciles the changes to bring associated clusters to their desired state.
</InfoBox>

# Updates

Spectro Cloud supports various kids of updates to running clusters. Based on the nature of the change, one of the following two mechanisms can be used to apply cluster updates to the cluster.

## Cluster update notifications

Fundamental changes to the cluster’s definition, such as upgrading Kubernetes versions, installing new packs, uninstalling previously installed packs, and updating default pack configuration, need to be applied to the cluster profile. These changes result in update notifications on the clusters and can be propagated to the clusters at an appropriate time. The update notification consists of detailed information about all the changes applied to the profile since the initial installation or since the previous update.

Updates to pack configuration may result in a conflict if the configuration was previously overridden in the cluster. The conflicts are presented to the user and need to be resolved before changes are applied to the cluster.

## Configuration overrides

Configuration for packs can be updated in a cluster at any time. The changes are applied immediately to the cluster.

# Cluster Health

Spectro Cloud monitors cluster infrastructure on a regular basis and reports health on the management console.
Overall health is computed based on the following factors:

* Heartbeat - Spectro Cloud's management agent, which runs inside the cluster periodically sends a heartbeat to the management console. Missing heartbeats are typically indicative of a problem such as a cluster infrastructure going down, lack of network connectivity, etc. Failure to detect heartbeat over a period of time results in an unhealthy status for the cluster.
* Node Conditions - Kubernetes maintains status for each cluster node in the form of conditions such as DiskPressure, MemoryPressure, NetworkUnavailable, etc. Spectro Cloud monitors these conditions and reports back to the management console. Any node condition indicating a problem with the node results in an unhealthy status for the cluster.
* Metrics - Spectro Cloud collects usage metrics such as CPU, Disk, Memory, etc. The cluster is marked as unhealthy if the usage metrics cross specific thresholds over a period of time.

# Usage Monitoring

Spectro Cloud continuously monitors cluster resources and reports the usage for the cluster as well as individual nodes. The following metrics are reported on the cluster overview page of the management console. By default the metrics are only displayed for the worker nodes in the cluster:

* Cores Used - A cluster-wise break down of the number of cores used.
* CPU Usage - Current CPUs used across all cluster nodes. Additionally, usage over a period of time is presented as a chart
* Memory Usage - Current memory used across all cluster nodes. Additionally, usage over a period of time is presented as a chart
* CPU Requests - Total CPUs requested across all pods.
* Memory Requests - Total memory requested across all pods.

Additionally, usage metrics for individual nodes as well as node conditions are accessible from the node details page.

# Application Services

Spectro Cloud enables quick access to the application services installed on the Kubernetes clusters by providing a link to those on the management console. These include not only the applications and services deployed through Spectro Cloud but also the ones deployed through any other means. Services are monitored on an ongoing basis and all services of the type LoadBalancer or NodePort are displayed on the management console.

# Troubleshooting

Typically when a cluster lifecycle action such as provisioning, upgrade, or deletion runs into a failure, it does not result in an outright error on the cluster. The Spectro Cloud orchestration engine follows the reconciliation pattern wherein the system repeatedly tries to perform various orchestration tasks to bring the cluster to its desired state until it succeeds. Initial cluster provisioning or subsequent updates can run into a variety of issues related to cloud infrastructure availability, lack of resources, networking issues, etc.

## Cluster conditions

Spectro Cloud maintains specific milestones in a lifecycle and presents them as “conditions”. Examples include: Creating Infrastructure, Adding Control Plane Node, Customizing Image, etc. The active condition indicates what task Spectro Cloud’s orchestration system is trying to perform. If a task results in failures, the condition is marked as failed, with relevant error messages. Reconciliation however continues behind the scenes and continuous attempts are made to perform the task. Failed conditions are a great source of troubleshooting provisioning issues.

For example, failure to create a virtual machine in AWS due to the vCPU limit being exceeded would cause this error is shown to the end-users. They could choose to bring down some workloads in the AWS cloud to free up space. The next time a VM creation task is attempted, it would succeed and the condition would be marked as a success.

## Event Stream

Spectro Cloud maintains an event stream with low-level details of the various orchestration tasks being performed. This event stream is a good source for identifying issues in the event an operation does not complete for a long time.

<InfoBox>
  Due to Spectro Cloud’s reconciliation logic, intermittent errors show up in the event stream. As an example, after launching a node, errors might show up in the event stream regarding being unable to reach the node. However, the errors clear up once the node comes up.<p></p>
  Error messages that persist over a long time or errors indicating issues with underlying infrastructure are an indication of a real problem.
</InfoBox>

# Proxy Whitelists

This table lists the proxy requirements for enabling the Spectro Cloud management console.

| Top-level Domain | Port | Description |
| --- | --- | --- |
| spectrocloud.com | 443 | For the Spectro Cloud SaaS. |
| s3.amazonaws.com | 443 | To access the Spectro Cloud VMware OVA files. |
| gcr.io | 443 | To access the Spectro Cloud image files. |
| docker.io | 443 | To access the Spectro Cloud Pack Registries. |
| googleapis.com | 443 | For pulling Spectro Cloud images. |
| docker.com | 443 | To access the Spectro Cloud docker images. |
| raw.githubusercontent.com | 443 | |
| projectcalico.org | 443 | For egress management. |
| quay.io | 443 | Container image registry access. |
| grafana.com | 443 | To provide access to the dashboard metrics. |
| github.com | 443 | |

# Creating Clusters

The detailed steps for creating clusters (as well as scaling/removing/reconfiguring etc.) on different cloud service providers are detailed here.

<Tabs identifier="clusterType">

<Tabs.TabPane tab="AWS Cluster" key="aws_cluster">

## Overview

The following is the deployment architecture for an AWS cluster.

The Kubernetes nodes are distributed across multiple AZs to achieve high availability. For each of the AZ that you choose, a public subnet and a private subnet is created.

All the control plane nodes and worker nodes are created within the private subnets so there is no direct public access available.

A NAT gateway is created in the public subnet of each AZ, to allow nodes in the private subnet to be able to go out to the internet or call other AWS services.

An Internet gateway is created for each VPC, to allow SSH access to the bastion node for debugging purposes. SSH into Kubernetes nodes is only available through the Bastion node. A bastion node helps to provide access to the ec2 instances. This is because the ec2 instances are created in a private subnet and the bastion node operates as a secure, single point of entry into the infrastructure. The bastion node can be accessed via SSH or RDP.

The APIServer endpoint is accessible through an ELB, which load balancing across all the control plane nodes.

![aws_cluster_architecture.png](aws_cluster_architecture.png)

## Prerequisites

Spectro Cloud creates compute, network, and storage resources on AWS during the provisioning of Kubernetes clusters. The following pre-requisites should be met for the successful creation of clusters.

### Resource Capacity

Sufficient capacity in the desired AWS region should exist for the creation of the following resources:

* vCpu
* VPC
* Elastic IP
* Internet Gateway
* Elastic Load Balancers
* NAT Gateway

## AWS Cloud Account Permissions

To create an AWS cloud account, an access key as well as a secret access key will be needed.

Ensure that the IAM user or the ROOT user has the following minimum permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "autoscaling:DescribeAutoScalingGroups",
                "autoscaling:DescribeLaunchConfigurations",
                "autoscaling:DescribeTags",
                "cloudformation:CreateStack",
                "cloudformation:DescribeStacks",
                "cloudformation:UpdateStack",
                "ec2:AllocateAddress",
                "ec2:AssociateRouteTable",
                "ec2:AttachInternetGateway",
                "ec2:AttachVolume",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:CreateInternetGateway",
                "ec2:CreateNatGateway",
                "ec2:CreateRoute",
                "ec2:CreateRouteTable",
                "ec2:CreateSecurityGroup",
                "ec2:CreateSubnet",
                "ec2:CreateTags",
                "ec2:CreateVolume",
                "ec2:CreateVpc",
                "ec2:DeleteInternetGateway",
                "ec2:DeleteNatGateway",
                "ec2:DeleteRoute",
                "ec2:DeleteRouteTable",
                "ec2:DeleteSecurityGroup",
                "ec2:DeleteSubnet",
                "ec2:DeleteTags",
                "ec2:DeleteVolume",
                "ec2:DeleteVpc",
                "ec2:DescribeAccountAttributes",
                "ec2:DescribeAddresses",
                "ec2:DescribeAvailabilityZones",
                "ec2:DescribeImages",
                "ec2:DescribeInstances",
                "ec2:DescribeInternetGateways",
                "ec2:DescribeNatGateways",
                "ec2:DescribeNetworkInterfaceAttribute",
                "ec2:DescribeNetworkInterfaces",
                "ec2:DescribeRegions",
                "ec2:DescribeRouteTables",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeSubnets",
                "ec2:DescribeVolumes",
                "ec2:DescribeVpcAttribute",
                "ec2:DescribeVpcs",
                "ec2:DetachInternetGateway",
                "ec2:DetachVolume",
                "ec2:DisassociateAddress",
                "ec2:DisassociateRouteTable",
                "ec2:ModifyInstanceAttribute",
                "ec2:ModifyNetworkInterfaceAttribute",
                "ec2:ModifySubnetAttribute",
                "ec2:ModifyVolume",
                "ec2:ModifyVpcAttribute",
                "ec2:ReleaseAddress",
                "ec2:RevokeSecurityGroupIngress",
                "ec2:RunInstances",
                "ec2:TerminateInstances",
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:GetRepositoryPolicy",
                "ecr:DescribeRepositories",
                "ecr:ListImages",
                "ecr:BatchGetImage"
                "elasticloadbalancing:AddTags",
                "elasticloadbalancing:ApplySecurityGroupsToLoadBalancer",
                "elasticloadbalancing:AttachLoadBalancerToSubnets",
                "elasticloadbalancing:ConfigureHealthCheck",
                "elasticloadbalancing:CreateListener",
                "elasticloadbalancing:CreateLoadBalancer",
                "elasticloadbalancing:CreateLoadBalancerListeners",
                "elasticloadbalancing:CreateLoadBalancerPolicy",
                "elasticloadbalancing:CreateTargetGroup",
                "elasticloadbalancing:DeleteListener",
                "elasticloadbalancing:DeleteLoadBalancer",
                "elasticloadbalancing:DeleteLoadBalancerListeners",
                "elasticloadbalancing:DeleteTargetGroup",
                "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
                "elasticloadbalancing:DescribeListeners",
                "elasticloadbalancing:DescribeLoadBalancerAttributes",
                "elasticloadbalancing:DescribeLoadBalancerPolicies",
                "elasticloadbalancing:DescribeLoadBalancers",
                "elasticloadbalancing:DescribeTags",
                "elasticloadbalancing:DescribeTargetGroups",
                "elasticloadbalancing:DescribeTargetHealth",
                "elasticloadbalancing:DetachLoadBalancerFromSubnets",
                "elasticloadbalancing:ModifyListener",
                "elasticloadbalancing:ModifyLoadBalancerAttributes",
                "elasticloadbalancing:ModifyTargetGroup",
                "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
                "elasticloadbalancing:RegisterTargets",
                "elasticloadbalancing:RemoveTags",
                "elasticloadbalancing:SetLoadBalancerPoliciesForBackendServer",
                "elasticloadbalancing:SetLoadBalancerPoliciesOfListener",
                "iam:AddRoleToInstanceProfile",
                "iam:AddUserToGroup",
                "iam:AttachGroupPolicy",
                "iam:AttachRolePolicy",
                "iam:CreateGroup",
                "iam:CreateInstanceProfile",
                "iam:CreatePolicy",
                "iam:CreateRole",
                "iam:CreateServiceLinkedRole",
                "iam:CreateUser",
                "iam:DeleteGroup",
                "iam:DeleteInstanceProfile",
                "iam:DeletePolicy",
                "iam:DeleteRole",
                "iam:DetachGroupPolicy",
                "iam:DetachRolePolicy",
                "iam:GetGroup",
                "iam:GetInstanceProfile",
                "iam:GetPolicy",
                "iam:GetRole",
                "iam:GetUser",
                "iam:PassRole",
                "iam:RemoveRoleFromInstanceProfile",
                "iam:RemoveUserFromGroup",
                "kms:DescribeKey",
                "pricing:GetProducts",
                "tag:GetResources"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateServiceLinkedRole"
            ],
            "Resource": [
                "arn:*:iam::*:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing"
            ],
            "Condition": {
                "StringLike": {
                    "iam:AWSServiceName": "elasticloadbalancing.amazonaws.com"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:PassRole"
            ],
            "Resource": [
                "arn:*:iam::*:role/*.cluster-api-provider-aws.sigs.k8s.io"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:CreateSecret",
                "secretsmanager:DeleteSecret",
                "secretsmanager:GetSecretValue",
                "secretsmanager:TagResource"
            ],
            "Resource": [
                "arn:aws:secretsmanager:*:*:secret:aws.cluster.x-k8s.io/*"
            ]
        }
    ]
}
```

<WarningBox>
The policy below cannot be used as an inline policy, as it exceeds the 2048 non-whitespace character limit by AWS.
</WarningBox>

<WarningBox>
The following warning on this policy is expected:<p></p>
This policy defines some actions, resources, or conditions that do not provide permissions. To grant access, policies must have an action that has an applicable resource or condition.
</WarningBox>

## Create an AWS Cluster

The following steps need to be performed to provision a new AWS cluster:

* Provide basic cluster information like name, description, and tags. Tags on a cluster are propagated to the VMs deployed on the cloud/data center environments.
* Select a cluster profile created for AWS cloud. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide the AWS Cloud account and placement information.
    * Cloud Account - Select the desired cloud account. AWS cloud accounts with AWS credentials need to be pre-configured in project settings.
    * Region - Choose the desired AWS region where you would like the clusters to be provisioned.
    * SSH Key Pair Name - Choose the desired SSH Key pair. SSH key pairs need to be pre-configured on AWS for the desired regions. The selected key is inserted into the VMs provisioned.
    * Static Placement - By default, Spectro Cloud uses dynamic placement wherein a new VPC with a public and private subnet is created to place cluster resources for every cluster. These resources are fully managed by Spectro Cloud and deleted when the corresponding cluster is deleted. Turn on the Static Placement option if its desired to place resources into preexisting VPCs and subnets.
* Configure the master and worker node pools. A master and a worker node pool are configured by default.
    * Name - a descriptive name for the node pool.
    * Size - Number of VMs to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5.
    * Allow worker capability (master pool) - Select this option for allowing workloads to be provisioned on master nodes.
    * Instance type - Select the AWS instance type to be used for all nodes in the node pool.
    * Availability Zones - Choose one or more availability zones. Spectro Cloud provides fault tolerance to guard against failures like hardware failures, network failures, etc. by provisioning nodes across availability zones if multiple zones are selected.
* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>
New worker pools may be added if its desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the ‘m3.large’ instance types for general-purpose workloads, and another worker pool with instance type ‘g2.2xlarge’ can be configured to run GPU workloads.
</InfoBox>

## Scaling an AWS Cluster

Scaling a cluster up or down involves changing the size of node pools. The following steps need to be performed to scale up/down an AWS cluster.

* Access the ‘Nodes’ view of the cluster.
* For the desired node pool change the size directly from the nodes panel or by editing node pool settings.
* After the node pool configuration is updated, the scale-up/down operation is initiated in a few minutes.
* Provisioning status is updated with the ongoing progress of the scale operation.

<InfoBox>
Master node pool may be scaled from 1 to 3 or 3 to 5 nodes. Scale down operation is not supported for master nodes.
</InfoBox>

## Add an AWS worker pool

The following steps need to be performed to add a new worker node pool to a cluster:-

* Invoke the option to ‘Add Node Pool’ from the cluster’s node information page.

* Provide node pool settings as follows:
    * A descriptive name for the node pool.
    * The number of nodes in the node pool.
    * One or more availability zones.  Nodes are distributed across availability zones when multiple zones are selected.
    * The instance type to be used for all the nodes launched in the node pool.
    * Save the node pool settings. New worker pool settings are updated and cluster updates begin within a few minutes. The provisioning status is updated with the ongoing progress of tasks related to the addition of new nodes.

## Remove an AWS worker pool

The following steps need to be performed to remove a worker pool from the cluster:-

* Access the 'Nodes' view of the cluster.
* Delete the desired worker pool and confirm the deletion.
* Upon confirmation, the worker node deletion begins in a few minutes.

## Reconfigure AWS nodes

The following steps need to be performed to reconfigure worker pool nodes:-

* Access the 'Nodes' view of the cluster.
* Edit the settings of the desired node pool.
* Change the instance type to the desired instance type.
* Save the node pool settings. After the node pool settings are updated, the node pool reconfiguration begins within a few minutes. The older nodes in the node pool are deleted one by one and replaced by new nodes launched with the new instance type configured.
* The provisioning status is updated with the ongoing progress of nodes being deleted and added.

</Tabs.TabPane>

<Tabs.TabPane tab="Azure Cluster" key="azure_cluster">

## Overview

Azure cluster resources are placed within an existing Resource Group, and nodes will be provisioned within a Virtual Network that is either auto-created or preexisting, with one subnet for control plane nodes and one for worker nodes. These two subnets are secured with separate Network Security Groups. Both subnets can span across multiple AZs.  Worker nodes will be distributed across multiple AZs.

None of the control plane nodes and worker nodes have public IPs attached. The APIServer endpoint is accessed through a public LB.

![azure_cluster_architecture.png](azure_cluster_architecture.png)

## Creating an Azure cloud account

To create an Azure cloud account, we need:

* Client ID
* Tenant ID
* Client secret

For this, we first need to create an Azure Active Directory (AAD) Application which can be used with role-based access control. Follow the steps to get the required details:

* To create an AAD Application from the Azure portal, follow the [Create a new AAD Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application) link. With this, the ClientID and TenantID are created and can be noted down.
* On creating the application, a minimum required [ContributorRole](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) needs to be assigned. To assign any kind of role, the user must have a minimum role of [UserAccessAdministrator](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator). The role can be assigned by following the [Assign Role To Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) link.
* To create the client secret, [Create an Application Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret). Store the Client Secret safely as it will not be available in plaintext later.

## Creating an Azure Cluster

The following steps need to be performed to provision a new VMware cluster:-

* Provide the basic cluster information like name, description, and tags.
* Select a cluster profile created for the Azure environment. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide the Azure Cloud account and placement information.
    * Cloud Account - Select the desired cloud account. Azure cloud accounts with credentials need to be pre-configured in project settings.
    * Subscription - Select the subscription which is to be used to access Azure Services.
    * Region - Select a region in Azure in which the cluster should be deployed.
    * Resource Group - Select the resource group in which the cluster should be deployed.
    * SSH Key - Public key to configure remote SSH access to the nodes.
* Configure the master and worker node pools. A master and a worker node pool are configured by default.
    * Name - A descriptive name for the node pool.
    * Size - Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5.
    * Allow worker capability (master pool) - To allow workloads to be provisioned on master nodes.
    * Instance Type - Select the Azure instance type to be used for all the nodes in the pool.
    * Managed Disk - Select the managed disk type to be used.
    * Disk Size - Storage disk size in GB to be attached to the node.
    * Availability Zones - Choose one or more availability zones. Spectro Cloud provides fault tolerance to guard against failures like hardware failures, network failures, etc. by provisioning nodes across availability zones if multiple zones are selected. Zones are supported only for worker pools.

* Review the settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>
New worker pools may be added if its desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the ‘Standard_D2_v2’ instance types for general-purpose workloads and another worker pool with instance type ‘Standard_NC12s_v3’ can be configured to run GPU workloads.
</InfoBox>

## Scaling an Azure cluster

Scaling a cluster up or down involves changing the size of node pools. The following steps need to be performed to scale up/down an Azure cluster.

* Access the ‘Nodes’ view of the cluster.
* For the desired node pool, change the size directly from the nodes panel or by editing node pool settings.
* After the node pool configuration is updated, the scale-up/down operation is initiated in a few minutes.
* Provisioning status is updated with the ongoing progress of the scale operation.

<InfoBox>
The master node pool may be scaled from 1 to 3 or 3 to 5 nodes. Scale down operation is not supported for master nodes.
</InfoBox>

## Adding an Azure worker pool

The following steps need to be performed to add a new worker node pool to a cluster:-

* Invoke the option to ‘Add Node Pool’ from the cluster’s node information page.
* Provide node pool settings as follows:
    * A descriptive name for the node pool.
    * The number of nodes in the node pool.
    * One or more availability zones. Nodes are distributed across availability zones when multiple zones are selected.
    * Instance type to be used for all the nodes launched in the node pool.
    * Managed Disk and Size of the storage to be used.
    * Save the node pool settings. New worker pool settings are updated and cluster updates begin within a few minutes. Provisioning status is updated with the ongoing progress of tasks related to the addition of new nodes.

## Removing an Azure worker pool

The following steps need to be performed to remove a worker pool from the cluster:-

* Access the ‘Nodes’ view of the cluster.
* Delete the desired worker pool and confirm the deletion.
* Upon confirmation, the worker node deletion beings in a few minutes.

## Reconfiguring Azure nodes

The following steps need to be performed to reconfigure worker pool nodes:-

* Access the 'Nodes' view of the cluster.
* Edit the settings of the desired node pool.
* Change the instance type to the desired instance type.
* Update the Managed Disk  type and Size of the storage to be used.
* Save the node pool settings. After the node pool settings are updated, the node pool reconfiguration begins within a few minutes. The older nodes in the node pool are deleted one by one and replaced by new nodes launched with new instance type configured.
* Provisioning status is updated with the ongoing progress of nodes being deleted and added.

</Tabs.TabPane>

<Tabs.TabPane tab="GCP Cluster" key="google_cloud_cluster">

## Overview

On the GCP cluster, control plane nodes and worker nodes are placed within a single private subnet which spans across different availability zones within a region.

A new VPC Network is created together with all the network infrastructure components like Cloud NAT and a Cloud Router. Firewall rules are created to protect all the API endpoints.

API server endpoint is exposed through a Global Load Balancer. Applications running with the cluster use a Regional Load Balancer to expose the load-balancer services.

![gcp_cluster_architecture.png](gcp_cluster_architecture.png)

## Creating a GCP Cloud Account

To create a GCP cloud account, you need the JSON credentials (service account key) file of the service account.

To create a service account, the user should have one of the following IAM roles:
`roles/iam.serviceAccountAdmin` or `roles/iam.serviceAccountAdmin`.

To create a service account, refer to https://cloud.google.com/iam/docs/creating-managing-service-accounts.

The service account should have the following minimum roles:

1. Compute Admin
1. Service Account User
1. Storage Object Viewer
1. Viewer

The process of creating the JSON credential files is available here: https://cloud.google.com/iam/docs/creating-managing-service-account-keys.

</Tabs.TabPane>

<Tabs.TabPane tab="VMware Cluster" key="vmware_cluster">

## Overview

The Spectro Cloud management platform does not need direct access to the VMware environment. A Private Cloud Gateway needs to be set up within the VMware environment, to facilitate  communication between the Spectro Cloud management platform and the vCenter, to create and delete target Kubernetes clusters.

The Private Gateway supports going through an optional Proxy server to talk to Spectro Cloud. If the Gateway is configured to use a proxy, the Proxy server needs to support HTTP(S) proxy.

If the IP allocation type is DHCP, an HAProxy Load balancer VM will be created for each of the Kubernetes clusters as the LB for the apiserver endpoints. If the IP allocation type is Static IP, a VIP(virtual IP address) will be selected from the master ippool and allocated to the cluster instead of the loadbalancer.

![vmware_arch_oct_2020.png](vmware_arch_oct_2020.png)

## Prerequisites

* Minimum capacity required for tenant clusters: ~26 vCPU, 50GB memory, 600GB storage.
* Minimum capacity required for a Private Cloud Gateway:
	* 1 node - 2 vCPU, 4GB memory, 30GB storage.
	* 3 nodes - 6 vCPU, 12GB memory, 70GB storage.
* Per tenant cluster IP requirements:
    * 1 per node.
    * 1 Kubernetes control-plane VIP.
    * 1 Kubernetes control-plane extra.
* Private cloud gateway IP requirements:
    * 1 node - 1 IP or 3 nodes - 3 IPs.
    * 1 Kubernetes control-plane VIP.
    * 1 Kubernetes control-plane extra.
* IPs for application workload services (e.g.:LoadBalancer services).
* Subnet with egress access to the internet (direct or via proxy):
    * For proxy: HTTP_PROXY, HTTPS_PROXY (both required).
* DNS to resolve public internet names (e.g.: api.spectrocloud.com).
* vSphere [6.7U3](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/vsphere-esxi-67u3-release-notes.html) or later (recommended).
* NTP configured on all Hosts.
* Shared Storage between vSphere hosts.
* VMware vCenter [permissions](https://docs.spectrocloud.com/clusters?clusterType=vmware_cluster#permissions).

## Configuration Requirements

A Resource Pool needs to be configured across the hosts, onto which the workload clusters will be provisioned. Every host in the Resource Pool will need access to shared storage, such as VSAN, in order to be able to make use of high-availability control planes. Network Time Protocol (NTP) must be configured on each of the ESXi hosts.

## Permissions

The vSphere user account used in the various Spectro Cloud tasks must have the minimum vSphere privileges required to perform the task. The `Administrator` role provides super-user access to all vSphere objects. For users without the `Administrator` role, one or more custom roles can be created based on the tasks being performed by the user.

| vSphere Object | Privileges |
| --- | --- |
| Datastore | Allocate Space |
| | Browse Datastore |
| | Low level file operations |
| | Remove file |
| | Update virtual machine files |
| | Update virtual machine metadata |
| Folder | Create folder |
| | Delete folder |
| | Move folder |
| | Rename folder|
| Network | Assign Network |
| Resource | Apply recommendation
| | Assign virtual machine to resource pool |
| | Migrate powered off virtual machine |
| | Migrate powered on virtual machine |
| | Query vMotion |
| Sessions| Validate session |
| Storage views | View|
| Tasks | Create task |
| | Update Task |
| Virtual Machines | Change Configuration |
| | * Add existing disk |
| | * Add new disk
| | * Add or remove device
| | * Advanced configuration
| | * Change CPU count
| | * Change resource
| | * Configure managedBy
| | * Display connection settings
| | * Extend virtual disk
| | * Modify device settings
| | * Query Fault Tolerance compatibility
| | * Query unowned files
| | * Reload from path
| | * Remove disk
| | * Rename
| | * Reset guest information
| | * Set annotation
| | * Toggle fork parent
| | * Upgrade virtual machine compatibility
| | Guest operations
| | * Guest operation alias modification
| | * Guest operation alias query
| | * Guest operation modifications
| | * Guest operation program execution
| | * Guest operation queries
| | Interaction
| | * Power off
| | * Power on
| | Inventory
| | * Create from existing
| | * Create new
| | * Move
| | * Remove
| | Provisioning
| | * Allow disk access
| | * Allow file access
| | * Allow read-only disk access
| | * Allow virtual machine download
| | * Allow virtual machine files upload
| | * Clone template
| | * Clone virtual machine
| | * Create template from virtual machine
| | * Customize guest
| | * Deploy template
| | * Mark as template
| | * Mark as virtual machine
| | * Modify customization specification
| | * Promote disks
| | * Read customization specifications
| | Service Configuration
| | * Allow notifications
| | * Allow polling of global event notifications
| | * Manage service configurations
| | * Modify service configuration
| | * Query service configurations
| | * Read service configuration
| | Snapshot management
| | * Create snapshot
| | * Remove snapshot
| | * Rename snapshot
| | * Revert to snapshot
| | vSphere Replication
| | * Configure replication
| | * Manage replication
| | * Monitor replication
| vApp | Import
| | View OVF environment
| | vApp application configuration
| | vApp instance configuration
| vSphere Tagging| Create vSphere Tag
| | Edit vSphere Tag

## Creating a VMware cloud account

<InfoBox>
Configuring the private cloud gateway is a prerequisite task. A default cloud account is created when the private cloud gateway is configured. This cloud account can be used to create a cluster.
</InfoBox>

<InfoBox>
Enterprise version users should choose the <i>"Use System Gateway"</i> option.
</InfoBox>

In addition to the default cloud account already associated with the private cloud gateway, new user cloud accounts can be created for the different vSphere users.

| Property | Description |
|---|---|
|Account Name | Custom name for the cloud account |
| Private cloud gateway | Reference to a running cloud gateway|
| vCenter Server | IP or FQDN of the vCenter server|
| Username | vCenter username|
| Password | vCenter password|

## Creating a VMware cloud gateway

<InfoBox>
For Enterprise version users, a system gateway is provided out of the box. However, additional gateways can be created as needed to isolate datacenters.
</InfoBox>

Setting up a cloud gateway involves initiating the install from the tenant portal, deploying gateway installer VM in vSphere, and launching the cloud gateway from the tenant portal.

By default, 4GB of memory is allocated for private gateways. Please ensure that this memory allocation is increased based on the number of clusters that need to be created.

## Tenant Portal - Initiate Install

<InfoBox>
This step does not apply to Enterprise version users.
</InfoBox>

* As a tenant administrator, navigate to the *Private Cloud Gateway* page under settings and invoke the dialogue to create a new private cloud gateway.
* Note down the link to the Spectro Cloud Gateway Installer OVA and PIN displayed on the dialogue.

## vSphere - Deploy Gateway Installer

<InfoBox>
This step does not apply to Enterprise version users.
</InfoBox>

* Initiate deployment of a new OVF template by providing a link to the installer OVA as the URL.
* Proceed through the OVF deployment wizard by choosing the desired name, placement, compute, storage, and network options.
* At the 'Customize Template' step, specify Spectro Cloud properties as follows:

| Parameter | Value | Remarks |
|---|---|---|
|Installer Name | Desired Spectro Cloud Gateway Name | The name will be used to identify the gateway instance. Typical environments may only require a single gateway to be set up, however, multiple gateways might be required for managing clusters in multiple vCenters. Choose a name that can easily identify the environment that this gateway instance is being configured for.|
| Console endpoint | URL to Spectro Cloud management platform portal | https://console.spectrocloud.com by default |
|Pairing Code | PIN displayed on the Spectro Cloud management platform portal's 'Create a new gateway' dialogue. | |
| SSH Public Key | Optional key, useful for troubleshooting purposes (Recommended) | Enables SSH access to the VM as 'ubuntu' user |

Additional properties that are required to be set only for a Proxy Environment. Each of the proxy properties may or may not have the same value but all the three properties are mandatory.

| Parameter | Value | Remarks |
|---|---|---|
|HTTP PROXY | The endpoint for the HTTP proxy server | This setting will be propagated to all the nodes launched in the proxy network. Eg., http://USERNAME:PASSWORD@PROXYIP:PROXYPORT |
| HTTPS PROXY | The endpoint for the HTTPS proxy server | This setting will be propagated to all the nodes launched in the proxy network. Eg., http://USERNAME:PASSWORD@PROXYIP:PROXYPORT |
| NO Proxy | A comma-separated list of vCenter server, local network CIDR, hostnames, domain names that should be excluded from proxying | This setting will be propagated to all the nodes to bypass the proxy server . Eg., vcenter.company.com, .company.org, 10.10.0.0/16 |

* Finish the OVF deployment wizard and wait for the OVA to be imported and Virtual Machine to be deployed.
* Power on the Virtual Machine.

## Tenant Portal - Launch Cloud Gateway

* Close the 'Create New Gateway' dialogue if still open or navigate to the Private Cloud Gateway page under settings in case you have navigated away or been logged out.
* Wait for a gateway widget to be displayed on the page and for the "Configure" option to be available. The IP address of the installer VM will be displayed on the gateway widget. This may take a few minutes after the virtual machine is powered on. Failure of the installer to register with the Spectro Cloud management platform portal within 10 mins of powering on the Virtual Machine on vSphere, might be indicative of an error. Please follow the troubleshooting steps to identify and resolve the issue.
* Click on the "Configure" button to invoke the Spectro Cloud Configuration dialogue. Provide vCenter credentials and proceed to the next configuration step.
* Choose the desired values for Datacenter, Compute Cluster, Datastore, Network, Resource pool, and Folder. Optionally provide one or more SSH Keys and/or NTP server addresses.
* Choose the IP Allocation Scheme - Static IP or DHCP. If static IP is selected, an option to create an IP pool is enabled. Proceed to create an IP pool by providing an IP range (start and end IP addresses) or a subnet. The IP addresses from this IP Pool will be assigned to the gateway cluster. By default, the IP Pool is available for use by other tenant clusters. This can be prevented by enabling the "*Restrict to a single cluster*" button. A detailed description of all the fields involved in the creation of an IP pool can be found [here](/clusters?clusterType=vmware_cluster#ipaddressmanagement).
* Click on Confirm, to initiate provisioning of the gateway cluster. The status of the cluster on the UI should change to 'Provisioning' and eventually 'Running' when the gateway cluster is fully provisioned. This process might take several minutes (typically 8 to 10 mins). You can observe a detailed provisioning sequence on the cluster details page, by clicking on the gateway widget on the UI. If provisioning of the gateway cluster runs into errors or gets stuck, relevant details can be found on the summary tab or the events tab of the cluster details page. In certain cases where provisioning of the gateway cluster is stuck or failed due to invalid configuration, the process can be reset from the Cloud Gateway Widget on the UI.
* Once the Gateway transitions to the 'Running' state, it is fully provisioned and ready to bootstrap tenant cluster requests.

## vSphere - Clean up installer

* Power off installer OVA which was initially imported at the start of this installation process.

<InfoBox>
Gateway cluster installation automatically creates a cloud account behind the scenes using the credentials entered at the time of deploying the gateway cluster. This account may be used for the provisioning of clusters across all tenant Projects.<p></p>
A Pack registry instance is set up on the gateway cluster by default and it is registered as a private pack registry under Settings/Pack Registries. You can read more about Pack Registries <a href="/registries-and-packs">here</a>.
</InfoBox>

## Troubleshooting

### Gateway installer - Unable to register with the tenant portal

The installer VM, when powered on, goes through a bootstrap process and registers itself with the tenant portal. This process typically takes 5 to 10 mins. Failure of the installer to  register with the tenant portal within this duration might be indicative of a bootstrapping error. SSH into the installer virtual machine using the key provided during OVA import and inspect the log file located at *'/var/log/cloud-init-output.log'*. This log file will contain error messages in the event there are failures with connecting to the Spectro Cloud management platform portal, authenticating, or downloading installation artifacts. A common cause for these errors is that the Spectro Cloud management platform console endpoint or the pairing code is typed incorrectly. Ensure that the tenant portal console endpoint does not have a trailing slash. If these properties were incorrectly specified, power down and delete the installer VM and re-launch with the correct values.

Another potential issue is a lack of outgoing connectivity from the VM. The installer VM needs to have outbound connectivity directly or via a proxy. Adjust proxy settings (if applicable) to fix the connectivity or power down and delete the installer VM and relaunch in a network that enables outgoing connections.

If the above steps do not resolve your issues, copy the following script to the installer VM and execute to generate a logs archive. Open a support ticket and attach the logs archive to the ticket to allow the Spectro Cloud Support team to troubleshoot and provide further guidance:

```bash
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

### Gateway Cluster - Provisioning stalled/failure

Installation of the gateway cluster may run into errors or might get stuck in the provisioning state for a variety of reasons like lack of infrastructure resources, IP addresses not being available, unable to perform NTP sync, etc. While these are most common, some of the other issues might be related to the underlying VMware environment. The Cluster Details page, which can be accessed by clicking anywhere on the gateway widget, contains details of every orchestration step including an indication of the current task being executed. Any intermittent errors will be displayed on this page next to the relevant orchestration task. The events tab on this page also provides a useful resource to look at lower -evel operations being performed for the various orchestration steps. If you think that the orchestration is stuck or failed due to an invalid selection of infrastructure resources or an intermittent problem with the infrastructure, you may reset the gateway by clicking on the 'Reset' button on the gateway widget. This will reset the gateway state to 'Pending' allowing you to reconfigure the gateway and start provisioning of a new gateway cluster. If the problem persists, please contact Spectro support via the Service Desk.

## Upgrading a VMware cloud gateway

Spectro Cloud maintains the OS image and all configurations for the cloud gateway. Periodically, the OS images, configurations, or other components need to be upgraded to resolve security or functionality issues. Spectro Cloud releases such upgrades when required and communication about the same is presented in the form of an upgrade notification on the gateway.

Administrators should review the changes and apply them at a suitable time. Upgrading a cloud gateway does not result in any downtime for the tenant clusters. During the upgrade process, the provisioning of new clusters might be temporarily unavailable. New cluster requests are queued while the gateway is being upgraded, and are processed as soon as the gateway upgrade is complete.

## Deleting a VMware cloud gateway

The following steps need to be performed to delete a cloud gateway.

* As a tenant administrator, navigate to the *Private Cloud Gateway* page under settings.
* Invoke the ‘Delete’ action on the cloud gateway instance that needs to be deleted.
* The system performs a validation to ensure there are no running tenant clusters associated with the gateway instance being deleted. If such instances are found, the system presents an error. Delete relevant running tenant clusters and retry the deletion of the cloud gateway.
* Delete the gateway Virtual Machines from vSphere.

## Resizing a VMware cloud gateway

A Cloud gateway can be set up as a 1-node or a 3-node cluster.  For production environments, it is recommended that 3 nodes are set up. A cloud gateway can be initially set up with 1 node and resized to 3 nodes at a later time. The following steps need to be performed to resize a 1-node cloud gateway cluster to a 3-node gateway cluster:

* As a tenant administrator, navigate to the *Private Cloud Gateway* page under settings.

* Invoke the resize action for the relevant cloud gateway instance.

* Update the size from 1 to 3.

* The gateway upgrade begins shortly after the update. Two new nodes are created on vSphere and the gateway is upgraded to a 3-node cluster.

<InfoBox>
Scaling a 3-node cluster down to a 1-node cluster is not permitted.<p></p> A load balancer instance is launched even for a 1-node gateway to support future expansion.
</InfoBox>

## IP Address Management

Spectro cloud supports DHCP as well as Static IP based allocation strategies for the VMs that are launched during cluster creation. IP Pools can be defined using a range or a subnet. Administrators can define one or more IP pools linked to a private cloud gateway. Clusters created using a private cloud gateway can select from the IP pools linked to the corresponding private cloud gateway. By default, IP Pools are be shared across multiple clusters, but can optionally be restricted to a cluster. Following is a description of various IP Pool properties:

| Property | Description |
|---|---|
| Name | Descriptive name for the IP Pool. This name will be displayed for IP Pool selection when static IP is chosen as the IP allocation strategy |
| Network Type | Select 'Range' to provide a start and an end IP address. IPs within this range will become part of this pool. Alternately select 'Subnet' to provide the IP range in CIDR format.|
| Start | First IP address for a range based IP Pool E.g. 10.10.183.1|
| End | Last IP address for a range based IP Pool.  E.g. 10.10.183.100 |
| Subnet | CIDR to allocate a set of IP addresses for a subnet based IP Pool.  E.g. 10.10.183.64/26 |
| Subnet Prefix | Network subnet prefix. E.g. /18|
| Gateway | Network Gateway E.g. 10.128.1.1 |
| Nameserver addresses | A comma-separated list of name servers. Eg. 8.8.8.8 |
| Restrict to a Single Cluster | Select this option to reserve the pool for the first cluster that uses this pool. By default, IP pools can be shared across clusters.|

## Creating a VMware Cluster

The following steps need to be performed to provision a new VMware cluster:-

* Provide basic cluster information like name, description, and tags. Tags are currently not propagated to the VMs deployed on the cloud/data center environments.
* Select a cluster profile created for the VMware environment. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide a vSphere Cloud account and placement information.
    * Cloud Account - Select the desired cloud account. VMware cloud accounts with credentials need to be pre-configured in project settings. An account is auto-created as part of the cloud gateway setup and is available for provisioning of tenant clusters if permitted by the administrator.
    * Datacenter -The vSphere datacenter where the cluster nodes will be launched.
    * Folder - The vSphere VM Folder where the cluster nodes will be launched.
    * SSH Keys (Optional) - Public key to configure remote SSH access to the nodes (User: spectro).
    * NTP Server (Optional) - Setup time synchronization for all the running nodes.
    * IP Allocation strategy - DHCP or Static IP
* Configure the master and worker node pools. A master and a worker node pool are configured by default.
    * Name - A descriptive name for the node pool.
    * Size - Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5.
    * Allow worker capability (master pool) - To workloads to be provisioned on master nodes.
    * CPU - Number of CPUs to be allocated to the nodes.
    * Memory - Amount of memory in GB to be allocated to the nodes.
    * Disk - Storage disk size in GB to be attached to the node.
    * One or more placement domains. VMs are distributed across multiple placement domains on a round-robin basis. Currently, only one placement domain is supported for a master pool.
	    * Compute Cluster - A Compute cluster under the selected Datacenter.
	    * Datastore - The vSphere storage in the selected Datacenter.
	    * Network - The vSphere Network in the selected Datacenter, to enable connectivity for the cluster nodes.
	    * Resource Pool- The vSphere resource pool where the cluster nodes will be launched.
	    * IP Pool - An IP pool to be used for allocation IP addresses to cluster VMs. Required only for Static IP allocation. IP pools need to be predefined for private cloud gateways.  
    
* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>
New worker pools may be added if it is desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with 4 CPUs, 8GB of memory for general-purpose workloads, and another worker pool with 8CPU, 16 GB of memory for advanced workloads that demand larger resources.
</InfoBox>

## Deleting a VMware Cluster

The deletion of a VMware cluster results in the removal of all Virtual machines and associated storage disks created for the cluster. The following tasks need to be performed to delete a VMware cluster:

* Select the cluster to be deleted from the cluster view and navigate to the cluster overview page
* Invoke a delete action available on the page
* Confirm delete action
* Cluster status is updated to ‘Deleting’ while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to ‘Deleted’ and it is removed from the list of clusters.

<InfoBox>
Delete action is only available for clusters that are fully provisioned. For clusters that are still in the process of being provisioned, ‘Abort’ action is available to stop provisioning and delete all resources.
</InfoBox>

## Scaling a VMware Cluster

Scaling a cluster up or down involves changing the size of node pools. The following steps need to be performed to scale up/down a VMware cluster:

* Access the ‘Nodes’ view of the cluster
* For the desired node pool change the size directly from the nodes panel or by editing node pool settings.
* After the node pool configuration is updated, the scale-up/down operation is initiated in a few minutes.
* Provisioning status is updated with the ongoing progress of the scale operation.

<InfoBox>
The master node pool may be scaled from 1 to 3 or 3 to 5 nodes. Scale down operation is not supported for master nodes.
</InfoBox>

## Reconfiguring VMware Nodes

The following steps need to be performed to reconfigure worker pool nodes: -

* Access the 'Nodes' view for the cluster.
* Edit the settings of the desired node pool.
* Change the CPU, Memory, and Disk size to the desired settings.
* Save the node pool settings. After the node pool settings are updated, the node pool reconfiguration begins within a few minutes. The older nodes in the node pool are deleted.one by one and replaced by new nodes launched with new instance type configured.
* Provisioning status is updated with the ongoing progress of nodes being deleted and added.

## Adding a VMware worker pool

The following steps need to be performed to add a new worker node pool to a cluster:-

* Invoke the option to ‘Add Node Pool’ from the cluster’s node information page.
* Provide node pool settings as follows:-
    * A descriptive name for the node pool.
    * The number of nodes in the node pool.
    * CPU, Memory, and Disk settings for all the nodes in the node pool.
    * Save the node pool settings. The new worker pool settings are updated and cluster updates begin within a few minutes. Provisioning status is updated with the ongoing progress of tasks related to the addition of new nodes.

## Removing a VMware worker pool

The following steps need to be performed to remove a worker pool from the cluster:-

* Access the ‘Nodes’ view of the cluster.
* Delete the desired worker pool and confirm the deletion.
* Upon confirmation, the worker node deletion begins in a few minutes.

</Tabs.TabPane>
</Tabs>
