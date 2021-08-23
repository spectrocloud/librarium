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

# OS Patching

Spectro Cloud deploys Kubernetes clusters using pre-built VM images. The operating system on these images is the latest patch version at the time of building the image for the supported major-minor streams. As an example, if Ubuntu 18.04 is selected for the OS layer during provisioning, the OS on the cluster nodes might be 18.04.3 LTE, assuming that was the latest at the time the VM image was built. However, newer versions continue to be published in the upstream repositories as improvements, bug fixes and security patches are released. OS Patching allows operating system on the running clusters nodes to be updated to the latest patch version so that it is up-to-date with the latest fixes. In our example, lets assume 18.04.4 LTE and 18.04.5 LTE are released overtime to fix important security issues. OS Patching operation will identify 18.04.5 as the latest version and upgrade to it on the cluster nodes. 
 
This operation is not available for managed Kubernetes Services like EKS, AKS and GKE. 

###  OS Patching Options
Following choices are available for patching the operating system to the latest version: 

#### Patch OS on Boot
During the cluster creation, while configuring the cluster (Cluster Configuration), the user can select “Patch OS on boot”. In this case the operating system on all cluster nodes will be updated to the latest when the cluster VMs are initially deployed.

#### OS Patching Schedule
Besides patching on boot, the users also have the option to set a schedule for OS patching. Patching schedule can be set initially when creating a cluster as well as at any given point later. Following scheduling options are provided:

* Every week on Sunday at midnight.
* Every two weeks at midnight.
* Every month on the 1st at midnight.
* Every two months on the 1st at midnight.
* Custom os patch for an exact month, day, hour and minute of user’s choice.

#### Patch Now
This option provides a way to perform an immediate update to the latest version. 

### Steps:

|  **During Cluster Creation**       |
| -----------------------------------|
|Cluster Configuration -> “OS Patching Schedule” or "Patch on Boot" |



| **For a Running Cluster**|
|--------------------------|
|On demand Patching: Clusters -> Settings -> Machine Management -> On-Demand Update|
|Scheduled Patching: Clusters -> Settings -> Cluster Settings -> Machine Management -> “OS Patching Schedule”|


 # Scans

Spectro Cloud provides a way to run compliance, security and conformance scan on tenant clusters. These scans ensure cluster adherence to specific compliance and security standards. It also detects potential vulnerabilities by performing penetration tests. Spectro Cloud supports 3 types of scans. Each scan generates reports with details specific to the type of scan. Multiple scans of each type can be run over time. Spectro Cloud keeps a history of previous scans for comparison purposes. 


The following types of scans are supported:

### Configuration Security

This scan examines the compliance of deployed Kubernetes security features against the CIS Kubernetes Benchmarks. CIS Kubernetes Benchmarks are consensus-driven security guidelines for the Kubernetes. Different releases of Kubernetes are covered by different releases of the CIS benchmark. By default, Kubernetes configuration security will determine the test set to run based on the Kubernetes version running on the cluster under scan. Internally, Spectro Cloud leverages an open source tool called Kube Bench from Aqua Security to perform this scan. Scans are run against master and worker nodes of the Kubernetes cluster and a combined report is displayed on the UI. Users can filter the report to view only the master or worker results if required. 

All the tests in the report are marked as Scored or Not Scored. The ones marked Not Scored are those that cannot be automatically run and it is suggested that these are tested manually. 

### Penetration Testing

Kubernetes penetration testing scans Kubernetes related open-ports for any configuration issues that can leave the tenant clusters exposed to attackers. It hunts for security issues in your Kubernetes clusters and increases awareness and visibility of the security controls in Kubernetes environments. The scan gives a full report on the cluster security concerns. Internally Spectro Cloud leverages an open source tool called Kube Hunter from Aqua Security to perform this scan. Scans are run in 2 modes, Internal and External. In the internal mode, tests are run against the internal endpoint of the API server where as in external mode, the external public facing endpoint is used for testing. A combined report of vulnerabilities found in both modes is shown on the Spectro Cloud UI. Users can filter the report to view just the internal or external report if required. 

### Conformance Testing

Kubernetes conformance testing is about validating your Kubernetes configuration to ensure that, they are conformant to the CNCF specifications. Spectro Cloud leverages an open source tool called Sonobuoy to perform this scan.  Based on the type of cloud (public, private) and the type of deployment infrastructure (IaaS, managed cloud service), a subset of relevant tests are automatically selected for execution. Each test can take up to 2 hours to complete. If a cluster has a single worker node, a few tests may fail due to lack of resources. For accurate assessment of conformance for a distribution of Kubernetes, it is recommended that you set up a cluster with at least 2 worker nodes. These tests are not destructive however, they do launch several workloads in test namespaces as part of the tests. The consumption of cluster resources during the duration of the test run increases and may impact other workloads running on the cluster. 


The scan summary of total passed and failed tests is displayed while the test is in progress. A full summary of the tests that were run is displayed after the completion of the report. 


## Scan Options

Following options are available for running cluster scans:
   
### On Demand 

Cluster scan of any type can be started by navigating to the scans tab of a cluster on the UI. The scan shows up as 'initiated' and transitions to 'Completed' when the scan is complete. 

### Scheduled

A schedule can be set for each type of scan at the time of deploying the cluster initially. The schedule can also be (re)set at a later point.

### Schedule Options Available

* Custom your compliance scan for an exact month,day,hour and minute of user choice
* Every week on Sunday at midnight
* Every two weeks at midnight
* Every month on the 1st at midnight
* Every two months on the 1st at midnight

### Steps:


|__Schedule your Scan__|
|----------------------|
|Select the cluster to scan -> Settings -> Cluster Settings -> Scan Policies -> Enable and schedule scans of your choice|


|__Immediate Scan__|
|------------------|
|Select the cluster to scan -> Scan(top panel) -> Run Scan|


|__During Cluster Deployment__|
|-----------------------------|
|Add New Cluster -> Cluster Policies -> Scan Policies -> Enable and schedule desired scans|



 # Backup and Restore

Spectro Cloud provides a convenient backup option to backup Kubernetes cluster state into an object storage and restore it at a later point in time if required to the same or a different cluster. Besides backing up Kubernetes native objects like Pods, DaemonSets, Services, etc, persistent volumes can also be optionally snapshotted and maintained as part of the backup. Internally, Spectro Cloud leverages an open source tool called Velero to provide these capabilities. Multiple backups of a cluster can be maintained simultaneously. 

### Backup Locations

AWS S3 and other S3 compliant object stores such as MinIO are currently supported as backup locations. These locations can be configured and managed from the 'Settings' option under 'Project' and can be selected as  backup location while backing up any cluster in the project. 

The following details are required in order to configure a backup location:

* Location Name : Name of your choice.
* Location Provider : AWS (This is currently the only choice on the UI. Choose this option when backing up to AWS S3 or any S3 compliance object store).
* Certificate : Required for MinIO.
* S3 Bucket : S3 bucket name that must be pre-created on the object store.
* Configuration: region={region-name},s3ForcePathStyle={true/false},s3Url={S3 URL}. S3 URL need not be provided for AWS S3.
* Account Information - Details of the account which hosts the S3 bucket to be specified as Credentials or STS.

    * Credentials - Provide access key and secret key. 
    * STS - Provide the ARN and External ID of the IAM role that has permission to perform all S3 operations. The STS role provided in the backup location should have trust setup with the account used to launch the cluster itself and should have the permission to assume the role. 
    #### AWS S3 Permissions:

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "ec2:DescribeVolumes",
                    "ec2:DescribeSnapshots",
                    "ec2:CreateTags",
                    "ec2:CreateVolume",
                    "ec2:CreateSnapshot",
                    "ec2:DeleteSnapshot"
                ],
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": [
                    "s3:GetObject",
                    "s3:DeleteObject",
                    "s3:PutObject",
                    "s3:AbortMultipartUpload",
                    "s3:ListMultipartUploadParts"
                ],
                "Resource": [
                    "arn:aws:s3:::${BUCKET}/*"
                ]
            },
            {
                "Effect": "Allow",
                "Action": [
                    "s3:ListBucket"
                ],
                "Resource": [
                    "arn:aws:s3:::${BUCKET}"
                ]
            }
        ]
    }
     
    ```

    #### Trust Setup Example:

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "AWS": "arn:aws:iam::141912899XX99:root"
          },
          "Action": "sts:AssumeRole",
          "Condition": {}
        }
      ]
    }
    ```


### Create  backup

Backups can be scheduled or initiated on demand as required. The following information are required for configuring a backup:

* Backup Prefix /Backup Name: 
	* For scheduled backup, a name will be generated internally, add a prefix of our choice to append with the generated name.
	* For On Demand backup, a name of user choice can be used.
* Select the backup location.
* Backup Schedule: Create a backup schedule of your choice from the drop down, applicable only to scheduled backups.

* Expiry Date : Select an expiry date for the backups. The backup will be automatically removed on the expiry date. 
* Include all disks : Optionally backup persistent disks as part of the backup.
* Include Cluster Resources : Select or deselect on your choice.
* Namespaces : Provide namespaces that need to be backed up. If left empty then all the Namespaces will be backed up.


### Backup Scheduling Options:
* Customize your backup for the exact month,day,hour and minute of the user's choice.
* Every week on Sunday at midnight.
* Every two weeks at midnight.
* Every month on the 1st at midnight.
* Every two months on the 1st at midnight.

### Restore Backup

Backups created manually or as part of schedule are listed under Backup/Restore page of the cluster. Restore operation can be initiated by selecting the restore option for a specific backup. You would be prompted to select a target cluster where you would like the backup to be restored. The progress of the restore can be tracked from the target cluster's backup/restore page. The Restore can be done to the cluster which is running on the same project.

<WarningBox>
When restoring backups to a cluster running on a cloud that is different from the source cluster, there might be some manual steps required. As an example, you might need to pre-create a storage class on the cluster before initiating restore. This is applicable to the clusters which are created on EKS to other clouds or Vice versa.
</WarningBox>

<WarningBox>
When restoring your backup to a cluster launched using a cloud account different from the one used for source account, permissions needs to be granted  before restore is initiated to the new cluster.  
</WarningBox>


### Steps:

|Add a Backup Location|
|---------------------|
|Go to Project Settings -> Backup locations  -> Add a New Backup location|

|On Demand Backup   |
|-------------------|
|Select the cluster to Backup -> Settings -> Cluster Settings ->Schedule Backups| 


|Scheduled Backup |
|-----------------|
|Cluster Creation -> Policies -> Backup Policies|

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

* Cluster events are retained for the last 1000 events.

* Due to Spectro Cloud’s reconciliation logic, intermittent errors show up in the event stream. As an example, after launching a node, errors might show up in the event stream regarding being unable to reach the node. However, the errors clear up once the node comes up.<p></p>
  Error messages that persist over a long time or errors indicating issues with underlying infrastructure are an indication of a real problem.

</InfoBox>

## Download Cluster Logs

At times it might be required to work with the Spectro Cloud support team to troubleshoot an issue. Spectro Cloud provides the ability to aggregate logs from the clusters it manages. Problems that occur during the orchestration lifecycle may require access to the various containers, nodes, and Kube system logs. Spectro Cloud automates this log collection process and provides an easy download option from the Spectro Cloud UI console. Hence reduces the burden on the operator to login into various cluster nodes individually and fetch these logs.

### To Collect the logs:

* Select the running cluster
* Go to settings and, select download logs.
* Choose the desired log from the below options:
    * Kube-System Logs 
        -  Logs of all the Kubernetes components.
    * Spectro Cloud Logs
        -  Spectro namespace logs for the last one hour.
    * Node Logs
        -  Contains the Spectro log, system log, and the cloud-init log information collected for the last ten thousand lines of code.
* Click Download Logs.
* The message “The request was sent successfully. The download will be available soon.”  gets displayed on the UI.
* Have an average wait time of 5 minutes.
* At the end of this short log fetching interval, the message “The logs archive for {Cluster-name} was created successfully will be displayed on the UI.
* Click [Download "cluster-name" logs] to download the logs folder to your local machine.
* UnZip and rename the logs folder as per customer choice.


<InfoBox>

* Audit logs are retained for the last 1 year.

* In addition to the log contents briefed above, the folder will also contain a Manifest.yaml file describing the CRDs, Deployments, Pods, ConfigMap, Events, and Nodes details of the cluster.

* Spectro Cloud recommends its users attach these logs along with the Support Request for accelerated troubleshooting.

* Expect an average log fetching time of 5 minutes for the ready-to-download message to appear on the UI, once the download log is clicked.

* The downloaded Zip file will be by default named as spectro_logs.zip, the users can unzip and choose a name of convenience.

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

