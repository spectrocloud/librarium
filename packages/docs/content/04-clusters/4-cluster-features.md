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

<Tabs. TabPane tab="Compliance Scan" key="scan">


## Compliance Scans

Spectro Cloud provides Compliance Scans for the tenant clusters. Compliance Scans are built to recognize the adherence of the user’s framework to a specific compliance policy, configuration settings or security guidance. It also detects potential vulnerabilities in the 
users framework. Spectro Cloud facilitates 3 types of compliance scans. Each scan generates reports highlighting the system’s security status. The section below will encapsulate the different options of Compliance Scan encouraged by Spectro Cloud for its tenant clusters.

### Scan Options

The different scan option available are:

### Kubernetes Configuration Security

This scan examines the compliance of deployed Kubernetes security features with CIS Kubernetes Benchmarks. CIS Kubernetes Benchmarks are consensus-driven security guideline for the Kubernetes.Different releases of Kubernetes are covered by different releases of the CIS benchmark. By default, Kubernetes configuration security will determine the test set to run based on the Kubernetes version running on the machine under scan.

The scan output can be viewed as Node Summary document with following details:
  *  [PASS] indicates that the test was run successfully, and passed.
  *  [FAIL] indicates that the test was run successfully, and failed. The remediation output describes how to correct the configuration, or includes an error message describing why the test could not be run.
  *  [WARN] means this test needs further attention, for example it is a test that needs to be run manually. Check the remediation output for further information.
  *  [STATE],[TEST_ID] and [DESCRIPTION] on individual test run.
  *  Provision to filter and view test status based on master configuration and worker pool. 
### Kubernetes Penetration Testing

Kubernetes penetration testing scans Kubernetes related open-ports for any configuration issues that can leave the tenant clusters exposed to attackers. It hunts for security issues in your Kubernetes clusters and increases awareness and visibility of the security controls in Kubernetes environments. The scan gives a full report on the cluster security concerns.

The scan output can be viewed as a report with following details:
  * [Severity] in terms of  LOW, MEDIUM or HIGH
  * [Test ID] indicates the type of test conducted.
  * [Description] of the Test ID
  * Provision to filter and view test status based on In-Cluster and Remote Cluster configuration.

### Kubernetes Conformance Testing

Kubernetes Conformance testing is about validating your kubernetes configuration. This scan aids in understanding the state of a Kubernetes cluster by running a choice of configuration tests in attainable and non-corrosive form. This scan supports Kubernetes v1.17 or later and is independent of Kubernetes releases.

The use cases considered are:
  * Integrated end-to-end (e2e).
  * Workload debugging.
  * Custom data collection via extensible plugins. 

The scan output can be viewed as Node Summary document with following details:
   * Total:  PASS,FAIL and SKIPPED
   * [PASS] indicates that the test was run successfully, and passed.
   * [FAIL] indicates that the test was run successfully, and failed. The remediation output describes how to correct the configuration, or includes
   * [Skipped] indicates that the test was skipped.
   * Describes the state, path and description of individual test run.
   * Provision to filter and view test status based on end to end integration and Systemd.

### Configure the Scan

Spectro Cloud provides two possible ways to configure scans for the tenant clusters.
   * On Demand Scans
   * Scheduled Scans

#### On Demand Scan

Schedule your scans for the running cluster on demand.

<InfoBox>

__Schedule your Scan__

Select the cluster to scan -> Settings -> Cluster Settings -> Scan Policies -> Enable and schedule scans of your choice.

__Immediate Scan__

Select the cluster to scan -> Scan(top panel) -> Run Scan

</InfoBox>

#### Scheduled Scan

Desired scan for the tenant cluster is scheduled along with cluster creation. 

<InfoBox>

Add New Cluster -> Cluster Policies -> Scan Policies -> Enable and schedule desired scans

</InfoBox>

### Schedule Options Available

* Custom your compliance scan for exact month,day,hour and minute of user choice.
* Every week on Sunday at midnight.
* Every two weeks at midnight.
* Every month on the 1st at midnight.
* Every two months on the 1st at midnight.
* Never.



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
