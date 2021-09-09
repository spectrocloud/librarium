---
title: "Manage Clusters"
metaTitle: "Managing Cluster Update Events on Spectro Cloud"
metaDescription: "Events and Notifications on Cluster Updates"
icon: "envelope-open-text"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';





# Manage Clusters

Spectro Cloud brings forth a lot of cluster management activities for our tenant clusters to escalate the availability as well as to troubleshoot.This includes:

* Cluster actions on the running clusters to scale the cluster resources.

We provides several options to manage Kubernetes clusters on an ongoing basis. These include options to scale up/down the cluster by adding/reducing the number of nodes in a node pool, add additional worker pools, resize nodes in a node pool by modifying the instance type, and add additional fault domains such as availability zones to a node pool.

* Cluster Updates 

In Spectro Cloud, majority of the updates are rolled out through Cluster Profiles. Updates such as addition of a new layer, changes to the pack version, removal of an existing layer, changes to the layer settings or attached manifests, etc. result in update notifications on all the clusters that were instantiated from that cluster profile.  Users can check, confirm and incorporate the updates to their running clusters at an appropriate time.

* Cluster activities for updates and troubleshooting.
 
Cluster activities provide various cluster management and governance operations that can be performed to keep clusters up-to-date, conformant and secure. These operations can be performed on a scheduled basis or on-demand as required. These includes OS patching, compliance scans and back up and restore. 


<Tabs identifier="manage">


<Tabs. TabPane tab="Scale Up/Down" key="scale">

# Scaling a Cluster
Scaling a cluster up or down involves changing the size of node pools. The following steps need to be performed to scale up/down a cluster:
* Access the ‘Nodes’ view of the cluster
* For the desired node pool change the size directly from the nodes panel or by editing node pool settings.
* After the node pool configuration is updated, the scale-up/down operation is initiated in a few minutes.
* Provisioning status is updated with the ongoing progress of the scale operation.

<InfoBox>
The master node pool may be scaled from 1 to 3 or 3 to 5 nodes, etc. Scale-down operation is not supported for master nodes.
</InfoBox>

## Reconfiguring the Cluster Nodes
  
The following steps need to be performed to reconfigure worker pool nodes: 
* Access the 'Nodes' view for the cluster.
* Edit the settings of the desired node pool.
* Change the number of nodes, rolling update setting, availability zones, flavor, and Disk size to the desired settings.
* Save the node pool settings. After the node pool settings are updated, the node pool reconfiguration begins within a few minutes. The older nodes in the node pool are deleted one by one and replaced by new nodes launched with a new instance type configured.
* Provisioning status is updated with the ongoing progress of nodes being deleted and added.

## Adding a New Worker Pool

The following steps need to be performed to add a new worker node pool to a cluster:-
* Invoke the option to ‘Add Node Pool’ from the cluster’s node information page.
* Provide node pool settings as follows:-
    * A descriptive name for the node pool.
    * The number of nodes in the node pool.
    * Rolling update setting, availability zones, flavor, and Disk size settings.
    * Save the node pool settings. The new worker pool settings are updated and cluster updates begin within a few minutes. Provisioning status is updated with the ongoing progress of tasks related to the addition of new nodes.


## Removing a Worker Pool
The following steps need to be performed to remove a worker pool from the cluster:
* Access the ‘Nodes’ view of the cluster.    
* Delete the desired worker pool and confirm the deletion.
* Upon confirmation, the worker node deletion begins in a few minutes.

</Tabs. TabPane>

<Tabs. TabPane tab="Cluster Updates" key="cluster-updates">

# Cluster Updates
Spectro Cloud ensures the complete life cycle utilization of its cluster for the users by promoting strong day 2 operations. In this context, cluster updates and integrations are extremely important. In Spectro Cloud, majority of the updates are rolled out through Cluster Profiles. Updates such as addition of a new layer, changes to the pack version, removal of an existing layer, changes to the layer settings or attached manifests, etc. result in update notifications on all the clusters that were instantiated from that cluster profile.  Users can check, confirm and incorporate the updates to their running clusters at an appropriate time.

Additionally, users may changes like overriding pack settings or manifest settings directly on the clusters. 
 
## Instructions:
* Navigate to the cluster profiles page and choose the profile to be updated. 
* Make the desired changes. These include add/delete layers, change pack version, change pack values etc. Save your changes. 
* On the Clusters page, observe the  ‘Updates Available’ tag on every cluster that was previously launched using the updated cluster profile.
* Click on one of the clusters to be updated to invoke the cluster details page. 
* An update notification in the form of a button called ‘Updates Available’ can be seen on the right top of the screen. Click the button to open the update  notifications dialog.
* A notification is created for each change made to the profile. Review all notifications. Depending on the nature of the change, additional action might be required for certain notifications. There are typical scenarios, where the settings or attached manifests for a pack are directly updated on the cluster which results in a conflict with the new incoming changes from the profile. For such cases, the updated profile settings and modified cluster settings are shown side by side, with the differences highlighted. Resolve all of the conflicts. When there has been no update to the pack settings or manifests, the incoming changes from the profile are automatically merged. A side by side comparison between the original cluster settings and the merged cluster settings is still displayed in such cases for review purposes. However, users may choose to further customize settings from this dialog. 
* Once all the notifications are reviewed and conflicts, if any, are resolved, confirm updates to apply changes to the cluster. 
* The system starts the update process in a few seconds. Depending upon the nature of the change, a rolling update of the clusters nodes may take place. The UI updates with detailed status of the upgrade. 
* Repeat this process for other clusters to be upgraded.


## Examples - Update Notifications

|Update Type     |Description|Notification Example                   |
|:---------------|:---------|:-----------------------|
Pack Version Upgrade |The existing pack version is upgraded to a different version in the cluster profile     |Kubernetes version is updated 1.18.16 > 1.20.0|
|Pack Values Update |The existing pack values are updated in the cluster profile       |Kubernetes  1.20.0 values are updated|
|Add Pack|Add a new pack to the cluster profile    |New Kibana 7.2.4 layer is added|
|Delete Pack|Delete the existing pack from the cluster profile      |Kibana 7.2.4 layer is deleted|
|Attach Pack Manifest|Delete the existing pack from the cluster profile      |Manifest security is attached to the pack Kubernetes|
|Update Pack Manifest|The attached pack manifest content is updated in the cluster profile|manifest security is updated in the pack Kubernetes|
|Delete Pack Manifest |The attached pack manifest is deleted from the cluster profile|manifest security is deleted in the pack Kubernetes|

**Note:**
Prior to applying the notifications that result from a profile update, if the corresponding changes are reverted, the notification is automatically cleared. 
 
## Examples - Notification settings

As described above, when notifications originate from changes to pack settings or manifest, they are accompanied with a settings dialog with a split pane showing differences in values. Following are a few examples of such scenarios:

|Values Updated    |Values overridden in Clusters   |Settings displayed (LHS)   |Settings displayed (RHS)   |Auto Merged  | Action  |
|:---------------|:---------|:--------------------|:--------|:-------|:--------|
|Pack Values|No|Original pack settings| Updated pack settings| Yes| Review and/or modify if desired|
|Attached Manifests|No|Original Manifests| Updated Manifests| Yes| Review and/or modify if desired|
|Pack Values|Yes|Updated settings from Cluster Profile| Current settings from cluster| No| Resolve all conflicts|
|Attached Manifests|Yes|Updated settings from Cluster Profile| Current settings from cluster| No| Resolve all conflicts|
|Pack Version Changed|No|Original pack settings| Updated pack settings| Yes| Review and/or modify if desired|
|Pack Version Changed|Yes|Updated settings from Cluster Profile| Current settings from cluster| No| Resolve all conflicts|


</Tabs. TabPane>

<Tabs. TabPane tab="OS Patching" key="ospatching">

# OS Patching

Spectro Cloud deploys Kubernetes clusters using pre-built VM images. The operating system on these images is the latest patch version at the time of building the image for the supported major-minor streams. As an example, if Ubuntu 18.04 is selected for the OS layer during provisioning, the OS on the cluster nodes might be 18.04.3 LTE, assuming that was the latest at the time the VM image was built. However, newer versions continue to be published in the upstream repositories as improvements, bug fixes and security patches are released. OS Patching allows operating system on the running clusters nodes to be updated to the latest patch version so that it is up-to-date with the latest fixes. In our example, let's assume 18.04.4 LTE and 18.04.5 LTE are released over time to fix important security issues. OS Patching operation will identify 18.04.5 as the latest version and upgrade to it on the cluster nodes. 
 
This operation is not available for managed Kubernetes Services like EKS, AKS and GKE. 

###  OS Patching Options
Following choices are available for patching the operating system to the latest version: 

#### Patch OS on Boot
During the cluster creation, while configuring the cluster (Cluster Configuration), the user can select “Patch OS on boot”. In this case, the operating system on all cluster nodes will be updated to the latest when the cluster VMs are initially deployed.

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

</Tabs. TabPane>



<Tabs. TabPane tab="Compliance Scan" key="scans">

 # Compliance Scans

Spectro Cloud provides a way to run compliance, security and conformance scans on tenant clusters. These scans ensure cluster adherence to specific compliance and security standards. It also detects potential vulnerabilities by performing penetration tests. Spectro Cloud supports 3 types of scans. Each scan generates reports with details specific to the type of scan. Multiple scans of each type can be run over time. Spectro Cloud keeps a history of previous scans for comparison purposes. 


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

</Tabs. TabPane>


<Tabs. TabPane tab="Back-Up and Restore" key="backup">

 # Backup and Restore

Spectro Cloud provides a convenient backup option to backup the Kubernetes cluster state into an object storage and restore it at a later point in time if required to the same or a different cluster. Besides backing up Kubernetes native objects like Pods, DaemonSets, Services, etc, persistent volumes can also be optionally snapshotted and maintained as part of the backup. Internally, Spectro Cloud leverages an open source tool called Velero to provide these capabilities. Multiple backups of a cluster can be maintained simultaneously. 

### Backup Locations

AWS S3 and other S3 compliant object stores such as MinIO are currently supported as backup locations. These locations can be configured and managed from the 'Settings' option under 'Project' and can be selected as  backup location while backing up any cluster in the project. 

The following details are required to configure a backup location:

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

</Tabs. TabPane>



</Tabs>

