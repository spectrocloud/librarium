---
title: "Policies"
metaTitle: "Features of Spectro Cloud  Clusters"
metaDescription: "Spectro Cloud Features"
icon: "cogs"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';



# Cluster Policies

Cluster policies provide various cluster management and governance operations that can be performed to keep clusters up-to-date, conformant and secure. These operations can be performed on a sheduled basis or on demand as required.  

<Tabs identifier="Feature Name">

<Tabs. TabPane tab="OS Patching" key="OS">

## OS Patching

Spectro Cloud deploys Kubernetes clusters using pre-built VM images. The operating system on these images is the latest patch version at the time of building the image for the supported major-minor streams. As an example, if Ubuntu 18.04 is selected for the OS layer during provisioning, the OS on the cluster nodes might be 18.04.3 LTE, assuming that was the latest at the time the VM image was built. However, newer versions continue to be published in the uptstream repositories as improvements, bug fixes and security patches are released. OS Patching, allows operating system on the running clusters nodes to be updated to the latest patch version so that it is up-to-date with the latest fixes. In our example, lets assume 18.04.4 LTE and 18.04.5 LTE are released overtime to fix important security issues. OS Patching operation will identify 18.04.5 as the latest version and upgrade to it on the cluster nodes. 
 
This operation is not available for managed Kubernetes Services like EKS, AKS and GKE. 

###  OS Patching Options
Following choices are available for patching the operating system to the latest version: 

#### Patch OS on Boot
During the cluster creation, while configuring the cluster (Cluster Configuration), the user can select “Patch OS on boot”. In this case the operating system on all cluster nodes will be updated to the latest when the cluster VMs are initially deployed.

#### OS Patching Schedule
Besides patching on boot, the users also have the option to set a sechedule for OS patching. Patching schecule can be set initially when creating a cluster as well as at any given point later. Following scheduling options are provided:

* Every week on Sunday at midnight.
* Every two weeks at midnight.
* Every month on the 1st at midnight.
* Every two months on the 1st at midnight.
* Custom os patch for exact month,day,hour and minute of user’s choice.

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

</Tabs. TabPane>

<Tabs. TabPane tab="Scans" key="Scans">

 ## Scans

Spectro Cloud provisions compliance, security and conformance scans on tenant clusters. These scans ensures cluster adherence to specific compliance and security standards. It also detects potential vulnerabilities by perforing penetration tests. Spectro Cloud supports 3 types of scans. Each scan generates reports with details specific to the type of scan. Multiple scans of each type can be run overtime. Spectro Cloud keeps a history of previous scans for comparison purposes. 


The following types of scans are supported:

### Configuration Security

This scan examines the compliance of deployed Kubernetes security features against the CIS Kubernetes Benchmarks. CIS Kubernetes Benchmarks are consensus-driven security guidelines for the Kubernetes. Different releases of Kubernetes are covered by different releases of the CIS benchmark. By default, Kubernetes configuration security will determine the test set to run based on the Kubernetes version running on the cluster under scan. Internally, Spectro Cloud leverages an open source tool called Kube Bench from Aqua Security to perform this scan. Scans are run against master and worker nodes of the Kubernetes cluster and a combined report is displayed on the UI. Users can filter the report to view only the master or worker results if required. 

All the tests in the report are marked as Scored or Not Scored. The ones marked Not Scored are those that cannot be automatically run and its suggested that these are tested manually. 

### Penetration Testing

Kubernetes penetration testing scans Kubernetes related open-ports for any configuration issues that can leave the tenant clusters exposed to attackers. It hunts for security issues in your Kubernetes clusters and increases awareness and visibility of the security controls in Kubernetes environments. The scan gives a full report on the cluster security concerns. Internally Spectro Cloud leverages an open source tool called Kube Hunter from Aqua Security to perfom this scan. Scans are run in 2 modes, Internal and External. In the internal mode, tests are run against the internal endpoint of the API server where as in external mode, the external public facing end point is used for testing. A combined report of vulnerabilities found in both modes are shown on the Spectro Cloud UI. Users can filter the report to view just the internal or external report if required. 

### Conformance Testing

Kubernetes conformance testing is about validating your Kubernetes configuration to ensure that, they are conformant to the CNCF specifications. Spectro Cloud leverages an open source tool called Sonobuoy to perform this scan.  Based on the type of cloud (public, private) and the type of deployment infrastructure (IaaS, managed cloud service), a subset of relevant tests are automatically selected for execution. Each test can take up to 2 hours to complete. If a cluster has a single worker node, a few tests may fail due to lack of resources. For accurate assessment of conformance for a distribution of Kubernetes, it is recommented that you set up a cluster with at least 2 worker nodes. These tests are not destructive tests, however they do launch several workloads in test namespaces as part of the tests. The consumption of cluster resources during the duration of the test run increases and may impact other workloads running on the cluster. 


The scan summary of total passed and failed tests is displayed while the test is in progress. A full summary of the tests that were run is displayed after the completion of the report. 


## Scan Options

Following options are available for running cluster scans:
   
### On Demand 

Cluster scan of any type can be started by navigating to the scans tab of a cluster on the UI. The scan shows up as 'initiated' and transitions to 'Completed' when the scan is complete. 

### Scheduled

A schedule can be set for each type of scan at the time of depoying the cluster initially. The schedule can also be (re)set at a later point.

### Schedule Options Available

* Custom your compliance scan for exact month,day,hour and minute of user choice
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


</Tabs. TabPane>

<Tabs. TabPane tab="Backup and Restore" key="bku">

 ## Backup and Restore

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
    * STS - Provide the ARN and Exteral ID of the IAM role that has permission to perform all S3 operations. The STS role provided in the backup location should have trust setup with the account used to launch the cluster itself and should have the permission to assume role. 
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

Backups can be scheduled or initiated on demand as required. The following informations are required for configuring a backup:

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

Backups created manually or as part of schedule are listed under Backup/Restore page of the cluster. Restore operation can be initiated by selecting the restore option for a specific backup. You would be prompted to select a target cluster where you would like the backup to be restored. The progress of the restore can be tracked from the target cluster's backup/restore page. The Restore can be done to the cluster which are running on the same project.

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

</Tabs. TabPane>
</Tabs>
