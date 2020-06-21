---
title: "Clusters"
metaTitle: "Creating clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
icon: "clusters"
hideToC: false
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Overview

Kubernetes clusters in Spectro Cloud are instantiated from cluster profiles. A cluster definition in Spectro Cloud consists of a reference to a cluster profile, cloud configuration, and cluster size and placement confuguration. The following high level tasks are performed as part of the cluster creation:

* Orchestration of compute, network and storage resources on the cloud environments along with the required placement infrastructure.
* Installation and configuration of various Kubernetes components like Kubelet, API servers, etcd, scheduler, etc.
* Installation and configuration of cloud specific network (CNI) and storage (CSI) plugins.
* Securing of the cluster infrastructure and configuration in accordance with relevant OS, Kubernetes and cloud security best practices.
* Deployment of additional add-ons such as Prometheus, Permissions Manager, Vault, etc., as specified in the cluster profile.

# Images

Spectro Cloud provides VM images for cluster compute infrastructure out of the box for the most recent versions of operating systems such as Ubuntu, CentOS, RHEL. These images are security hardened based on the respective CIS Benchmarks. Kubernetes components such as kubelet, kubeadm, etc. are pre-installed in these images. The specific image for a cluster is derived from the Operating System and Kubernetes packs configured in the cluster profile.

The out of the box images are hosted either in the public cloud (AWS - AMI, Azure - VHD) or Spectro Cloud's storage repository (vSphere - OVA). During provisioning, the image is copied (if missing) to the desired cloud region or downloaded onto a private datacenter.

#  Customization

Spectro Cloud provides various forms of customization options for VM images. All these customization options require a private pack registry to be setup with customized OS packs.

## Customize out of the box images

Spectro Cloud's out of the box images are security hardened and have Kubernetes components pre-installed. Additional components can be installed on the images at runtime by defining one or more Ansible roles in the customized OS pack. Spectro Cloud’s orchestration engine creates a new image by instantiating a VM instance from the out of box image and executing the specified Ansible roles on the instance. This custom image is used for cluster provisioning. The customized image is tagged with a unique signature generated from the pack definition so that it can be reused for future cluster provisioning requests.

## Bring your own Image

Users can bring used their own OS image by building custom OS packs and providing a reference to the desired image in pack annotations. These images can be:

* Pre-configured with all desired OS packages and Kubernetes components for the desired version installed. No Ansible roles are specified in the OS pack. The “skip k8s installation” option in the OS pack is set to true. (`"skipK8sInstall": "true"`)

* Base images with none of the desired packages or Kubernetes components installed. Ansible roles are specified in the OS pack to install additional packages. The “skip K8s installation” option in the OS pack is set to false (`"skipK8sInstall": "false"`)

* A combination of the two options above.

Spectro Cloud’s orchestration engine examines the OS pack configuration and determines if customization is required. If customization is required, a VM instance is launched from the image reference provided in the pack. Installation of Kubernetes components and/or execution of additional Ansible roles is performed on this VM instance. A VM image is then created from this instance and used for cluster provisioning. The customized image is tagged with a unique signature generated from the pack definition so that it can be reused for future cluster provisioning requests.

# Security

Spectro Cloud secures the Kubernetes clusters provisioned by following security best practices at the OS, Kubernetes and Cloud Infrastructure level.

## Operating System

Spectro Cloud’s out of the box VM images are hardened in accordance with the relevant OS CIS benchmark. Additionally, the images are scanned for vulnerabilities regularly and fixes are applied to these images when available from the provider. The upgraded images are released in the form to updated OS packs in Spectro Cloud’s pack registry and are available to the users to apply to their existing clusters at the time convenient to them.

## Kubernetes

Kubernetes components and configuration are hardened in accordance with the Kubernetes CIS Benchmark. Spectro Cloud executes Kubebench, a CIS Benchmark scanner by Aqua Security, for every Kubernetes  pack to ensure the master and worker nodes are configured in a secure fashion.

## Cloud

Spectro Cloud follows security best practices recommended by the various cloud providers when provisioning and configuring the compute, network and storage infrastructure for the Kubernetes clusters. These include practices such as isolating master and worker nodes in dedicated network domains, limiting access through use constructs like security groups. etc.

<WarningBox>
  The security measures mentioned above are implemented for Spectro Cloud’s out of the box OS and
  Kubernetes packs. For customized OS Kubernetes packs, users are responsible for taking the
  relevant measures to secure their clusters.
</WarningBox>

# Day-2 Management

Spectro Cloud provides several options to manage Kubernetes clusters on an ongoing basis. These include options to scale up/down the cluster by adding/reducing number of nodes in a node pool, add additional worker pools, resize nodes in a node pool by modifying the instance type, and add additional fault domains such as availability zones to a node pool.

<WarningBox>
  Cluster management operations result in the update of cluster definitions in Spectro Cloud’s database. The updated definition is retrieved by the management agent running in the cluster. The  cluster control plane subsequently reconciles the changes to bring associated clusters to their desired state.
</WarningBox>

# Updates

Spectro Cloud supports various kids of updates to running clusters. Based on the nature of the change, one of the following two mechanisms can be used to apply cluster updates to the cluster.

## Cluster update notifications

Fundamental changes to the cluster’s definition, such as upgrading Kubernetes versions, installing new packs, uninstalling previously installed packs, and updating default pack configuration, need to be applied to the cluster profile. These changes result in update notifications on the clusters and can be propagated to the clusters at an appropriate time. The update notification consists of detailed information about all the changes applied to the profile since initial installation or since previous update. 

Updates to pack configuration may result in a conflict, if the configuration was previously overridden in the cluster. The conflicts are presented to the user and need to be resolved before changes are applied to the cluster.

## Configuration overrides

Configuration for packs can be updated in a cluster at any time. The changes are applied immediately to the cluster.

# Troubleshooting

Typically when a cluster lifecycle action such as provisioning, upgrade or deletion runs into a failure, it does not result in an outright error on the cluster. The Spectro Cloud orchestration engine follows the reconciliation pattern wherein the system repeatedly tries to perform various orchestration tasks to bring the cluster to its desired state until it succeeds. Initial cluster provisioning or subsequent updates can run into a variety of issues related to cloud infrastructure availability, lack of resources, networking issues, etc.

## Cluster conditions

Spectro Cloud maintains specific milestones in a lifecycle and presents them as “conditions”. Examples include: Creating Infrastructure, Adding Control Plane Node, Customizing Image etc. The active condition gives an indication for what task Spectro Cloud’s orchestration system is trying to perform. If a task results in failures, the condition is marked as failed, with relevant error messages. Reconciliation however continues behind the scenes and continuous attempts are made to perform the task. Failed conditions are a great source of troubleshooting provisioning issues. 

For example, failure to create a virtual machine in AWS due to the vCPU limit being exceeded would cause this error is shown to the end users. They could choose to bring down some workloads in the AWS cloud to free up space. The next time a VM creation task is attempted, it would succeed and the condition would be marked as a success.

## Event Stream

Spectro Cloud maintains an event stream with low level details of the various orchestration tasks being performed. This event stream is a good source for identifying issues in the event an operation does not complete for a long time.

<WarningBox>
  Due to Spectro Cloud’s reconciliation logic, intermittent errors show up in the event stream. As an example, after launching a node, errors might show up in the event stream regarding being unable to reach the node. However the errors clear up once the node comes up.
</WarningBox>

<WarningBox>
Error messages that persist over a long time or errors indicating issues with underlying infrastructure are an indication of a real problem.
</WarningBox>