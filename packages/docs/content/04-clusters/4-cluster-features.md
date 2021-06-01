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
Following choices are vailable for patching the operating system to the latest version: -

#### Patch OS on Boot
During the cluster creation, while configuring the cluster (Cluster Configuration) , the user can select “Patch OS on boot”. In this case the operating system on all cluster nodes will be updated to the latest when the cluster VMs are initially deployed.

#### OS Patching Schedule
Besides patching on boot, the users also have the opetion to set a sechedule for OS patching. Patching schecule can be set initially when creating a cluster as well as at any given point later. Following scheduling options are provided: -

* Every week on Sunday at midnight.
* Every two weeks at midnight.
* Every month on the 1st at midnight.
* Every two months on the 1st at midnight.
* Never.
* Custom os patch for exact month,day and hour and minute of user’s choice.

#### Patch Now
This options provides a way to perform an immediate update to the latest version. 

### Steps

* During Cluster Creation
<InfoBox>
Cluster Configuration -> “OS Patching Schedule” or "Patch on Boot".
</InfoBox>

* For a Running Cluster
<InfoBox>
Clusters -> Settings -> Machine Management -> "OS Patching Schedule" or "Patch Now".
</InfoBox>

</Tabs. TabPane>

<Tabs. TabPane tab="Scans" key="scan">

 ## Scans

Spectro Cloud provides a way to run compliance, security and conformance scans on tenant clusters. These scans ensure clusters adhere to specific compliance and security standards. It also detects potential vulnerabilities by perforing penetration tests. Spectro Cloud supports 3 types of scans. Each scan generates reports with details specific to the type of scan. Multiple scans of each type can be run overtime. Spectro Cloud keeps a history of previous scans for comparison purposes. 


The following types of scans are supported: -

### Configuration Security

This scan examines the compliance of deployed Kubernetes security features against the CIS Kubernetes Benchmarks. CIS Kubernetes Benchmarks are consensus-driven security guideline for the Kubernetes. Different releases of Kubernetes are covered by different releases of the CIS benchmark. By default, Kubernetes configuration security will determine the test set to run based on the Kubernetes version running on the cluster under scan. Internally, Spectro Cloud leverages an open source tool called Kube Bench from Aqua Security to perform this scan. Scans are run against master and worker nodes of the Kubernetes cluster and a combined report is displayed on the UI. Users can filter the report to view only the master or worker results if required. 

All the tests in the report are marked as Scored or Not Scored. The ones marked Not Scored are those that cannot be automatically run and its suggested that these are tested manually. 

### Penetration Testing

Kubernetes penetration testing scans Kubernetes related open-ports for any configuration issues that can leave the tenant clusters exposed to attackers. It hunts for security issues in your Kubernetes clusters and increases awareness and visibility of the security controls in Kubernetes environments. The scan gives a full report on the cluster security concerns. Internally Spectro Cloud leverages an open source tool called Kube Hunter from Aqua Security to perfom this scan. Scans are run in 2 modes, Internal and External. In the internal mode, tests are run against the internal endpoint of the API server where as in external mode, the external public facing end point is used for testing. A combined report of vulnerabilities found in both modes are shown on the Spectro Cloud UI. Users can filter the report to view just the internal or external report if required. 

### Conformance Testing

Kubernetes conformance testing is about validating your kubernetes configuration to ensure they are conformant to the CNCF specifications. Spectro Cloud leverages an open source tool called Sonobuoy to perform this test.  Based on the type of cloud (public, private) and the type of deployment infrastrcture (IaaS, managed cloud service), a subset of relevant tests are automatically selected for execution. Each test can take up to 2 hours to complete. If a cluster has a single worker node, a few tests may fail due to lack of resources. For accurate assement of conformance for a distribution of Kubernetes it is recommned that you set up a cluster with at least 2 worked nodes. These tests are not destructuve tests, however they do launch several workloads in test namespaces as part of the tests. The consumption of cluster resources during the duration of the test run increases and may impact other workloads running on the cluster. 


The scan summay of total passed and failed tests is displayed while the test is in progress. A full summary of the tests that were run is displayed after the completion of the report. 


## Scan Options

Following options are avaialable for performing running cluster scans: -
   
### On Demand 

Cluster scan of any type can be started by navigating to the scans tab of a cluster on the UI. The scan shows up as 'initiated' and transitions to 'Completed' when the scan is complete. 

### Scheduled

A schedule can be set for each type of scan at the time of depoying the cluster initially. The schedule can also be (re)set at a later point

### Schedule Options Available

* Custom your compliance scan for exact month,day,hour and minute of user choice
* Every week on Sunday at midnight
* Every two weeks at midnight
* Every month on the 1st at midnight
* Every two months on the 1st at midnight

## Steps

<InfoBox>

__Schedule your Scan__

Select the cluster to scan -> Settings -> Cluster Settings -> Scan Policies -> Enable and schedule scans of your choice.

__Immediate Scan__

Select the cluster to scan -> Scan(top panel) -> Run Scan

</InfoBox>


Scans can be scheduled at the time of deployment  from the 'Cluster Polocies' step of the cluster creation wizard. 

<InfoBox>

Add New Cluster -> Cluster Policies -> Scan Policies -> Enable and schedule desired scans

</InfoBox>

</Tabs. TabPane>

<Tabs. TabPane tab="Backup and Restore" key="bku">


## Backup and Restore

Spectro Cloud provides a convenient backup option for the tenant clusters that compresses and backs up Kubernetes objects to object storage. A snapshot is created for the persistent volumes  of the workload cluster to AWS S3 object storage. In the case of an outrage the cluster’s objects and Persistent Volumes  could be restored to a previous state. Spectro Cloud allows you to use AWS Simple Storage Service to snapshot your Persistent Volumes, and Spaces to back up your Kubernetes objects and restore them when a disaster strikes.

### Configure your Backup

The backup location needs to be configured using AWS S3 buckets. The following Backup Restore policies need to be included for the S3 location trust certification.

``` json
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

### Create the Backup Location.

<InfoBox>
Go to Project Settings -> Backup locations  -> Add a New Backup location.
</InfoBox>
Complete all the steps of the add backup location wizard. Provide values for various fields as follows:

* Location Name : Name of your choice
* Location Provider : AWS only
* Certificate : Optional
* S3 Bucket : s3 bucket name created in AWS
* Configuration: region={region-name},s3ForcePathStyle={true/false},s3Url=
* Make your choice of validation using credentials or STS.

### Create Backup

The backup can be created on demand for a running cluster, or could be scheduled during cluster creation.

#### On Demand Backup
<InfoBox>
Select the cluster to Backup -> Settings -> Cluster Settings ->Schedule Backups 
</InfoBox>

#### Scheduled Backup 
<InfoBox> 
Cluster creation -> Policies -> Backup Policies
</InfoBox>

To create your backup fill the following details to the open wizard:

* Backup Prefix /Backup Name: 
For scheduled backup, a name will be generated internally, add a prefix of our choice to append with the generated name.
For On Demand backup a name of user choice can be used.
* Select the backup location: Attach the backup location created.
* Backup Schedule: Create a backup schedule of your choice from the drop down, applicable only to scheduled backup.
* Expiry Date : Select an end date to finish the backup in months or customize in hours.
* Include all disks : select or deselect on your choice.
* Include Cluster Resources : select or deselect on your choice.
* Namespaces : An optional namespace.
* Validate and review these details to create your back up. 

### Backup Scheduling Options:
* Custom your backup for the exact month,day and hour and minute of the user's choice.
* Every week on Sunday at midnight.
* Every two weeks at midnight.
* Every month on the 1st at midnight.
* Every two months on the 1st at midnight.
* Never.

### Restore the Cluster

The completed backup report can be viewed from Cluster Page -> Backup -> Backup -> Click Completed

A report of the scan can  be viewed as a detailed summary:
* Backup Name: The name given while creating the backup.
* Backup Status : Completed/ In Progress.
* Created On : Date and time  of Creation.
* Expiry Time: Date and time of backup expiry.
* Namespace: Optional namespace, if created.
* Delete Backup : Option to delete the backup.
* Restore Backup: Option to restore the cluster in case of system failure.

<WarningBox>
Backups created to or from EKS clusters will require storage class GP2 to be created mandatorily.
</WarningBox>

<WarningBox>
While restoring your backup to a new cluster,the S3 policy needs to have the Worker Pool of the new cluster added as a trusted entity. 
</WarningBox>

</Tabs. TabPane>
</Tabs>
