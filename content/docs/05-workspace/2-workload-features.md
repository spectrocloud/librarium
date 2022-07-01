---
title: "Workspace Management"
metaTitle: "The additional features to optimize workspace performance"
metaDescription: "How to get unified view of workloads in logically grouped namespaces and clusters"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';



# Manage Palette Workspace

Palette supports several Day-2 operations to manage the end-to-end lifecycle of the Kubernetes clusters through Workspaces. It also provides several capabilities across new and imported clusters to keep your clusters secure, compliant, up to date, and perform ongoing management operations like Backup and Restore. Additionally, you can have visibility into the workloads running inside your cluster and cluster costs.

The following sections describe these capabilities in detail:

<br />

------------------------

<Tabs>
<Tabs.TabPane tab="Workload Visibility" key="Workload Visibility">


#  Workload Visibility

Workspace provides visibility into workloads deployed across clusters. 

|**Resource**|**Description availed from Workspace**|
|---|-----|
|**Namespaces**|Cluster Specific namespaces with CPU and Memory utilization.|
|**Pods**|Lists all the pods running on a particular namespace with cluster names with the detailed health status, age, and resource utilization of each of them.|
|**Deployments**|All the running deployments specific to clusters belonging to the Workspace with namespace to which these deployments belong, pods details, replicas, and age are enumerated|
|**DaemonSets**|DaemonSet resource utilization is described, with details on namespaces, pods, and age of individual Daemon sets|
|**StatefulSets**|All the active StatefulSets specific to clusters belonging to the Workspace with corresponding namespace, pods details, replicas, and age are enumerated|

</Tabs.TabPane>

<Tabs.TabPane tab="Schedule Backups" key="Schedule Backups">


# Workspace Backup and Restore

Palette users can create cluster backups from within a workspace (usually consisting of multiple clusters) and restore them later time as desired. Palette allows granular controls within a workspace for users to perform specific tasks within the workspace, without having the ability to update workspace details. To provide granular access within a workspace for specific actions, Palette provides the following two Roles:

## Workspace Operator

Users assigned the **Workspace Operator** Role can only perform Backup and Restore actions within the Workspace.

## Workspace Admin

A Role that has all administrative permissions and privileges within the Workspace.

## Create your Workspace Roles

To create your **Workspace Role**, follow the steps below:

1. Log in to the Palette Management Console as **Tenant Admin**.


2. Go to the **Users and Teams** option.


3. From the listed users, select the user to be assigned with Workspace Roles. See here for [User Creation](/projects/#projects).


4. Select the **Workspace Roles** tab and click **+ New Workspace Role** to create a new role.


5. Fill the following information into the **Add Roles to User-Name** wizard:
   * Project
   * Workspace
   * Choose the role from the options:
      * Workspace Admin
      * Workspace Operator


6. Confirm the information provided to complete the wizard.


7. The user set with the Workspace Role can take Workspace-wide Backups and Restores in compliance with their permissions and privileges.

# Prerequisites

## For an Amazon Web Services (AWS) Bucket as Backup Location

* The AWS S3 permissions listed in the next section need to be configured in the AWS account to provision Backup through Palette.

* Pre-create a bucket at the AWS or MinIO object-store.

## For a Google Cloud Platform (GCP) Backup Location

* GCP service account with a **Storage Admin** role.

* Pre-create a bucket at the GCP object storage.

# Backup Locations

AWS Simple Cloud Storage (S3) and other S3 compliant object stores such as MinIO and GCP Buckets are currently supported as backup locations. These locations can be configured and managed under the **Project** > **Settings** option and can be selected as a backup location, while backing up any cluster in the project.

## Configure your Backup in AWS S3 

The following details are required to configure a backup location in AWS:

1. **Location Name** - Name of your choice.


2. **Location Provider** - AWS (This is currently the only choice on the UI. Choose this option when backing up to AWS S3 or any S3 compliance object store).


3. **Certificate** - Required for MinIO.


4. **S3 Bucket** - S3 bucket name must be pre-created on the object-store.


5. **Configuration** - region={region-name},s3ForcePathStyle={true/false},s3Url={S3 URL}. S3 URL need not be provided for AWS S3.


6. **Account Information** - Details of the account which hosts the S3 bucket to be specified as Credentials or STS.
     * Credentials - Provide access key and secret key.
     * STS - Provide the ARN and External ID of the IAM role that has permission to perform all S3 operations. The STS role provided in the backup location should have a trust set up with the account used to launch the cluster itself and should have the permission to assume the role.


7. Palette mandates the AWS S3 Permissions while users use the static role to provision worker nodes.

### AWS S3 Permissions

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

### Trust Setup Example

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

## Configure your Backup in GCP Bucket

These locations can be configured and managed from the **Settings** option under **Project** and can be selected as a backup location while backing up any cluster in the project.

The following details are required to configure a backup location in GCP:

1. **Location Name** - Name of your choice.


2. **Location Provider** - Google Cloud (Choose this option when backing up to the GCP bucket object store).


3. **Bucket** - The name of the bucket name pre-created on the object store.


4. **JSON Credentials** - For external authentication of the GCP storage.


## Add a Backup Location

Go to **Project Settings** > **Backup locations** > **Add a New Backup location**.

# Create a Workspace Backup

Backups can be scheduled or initiated in an on demand basis, during the workspace creation. The following information is required for configuring a Workspace Backup, on demand-

1. **Backup Prefix / Backup Name**: For scheduled backup, a name will be generated internally, add a prefix of our choice to append with the generated name. For an on demand backup, a name of user choice can be used.


2. Select the Backup location.


3. **Backup Schedule** - Create a backup schedule of your choice from the dropdown list, applicable only to scheduled backups.


4. **Expiry Date** - Select an expiry date for the backups. The backup will be automatically removed on the expiry date.


5. **Include all disks** - Optionally, backup persistent disks as part of the backup.


6. **Include Cluster Resources** - Select or deselect on your choice.


|On Demand Backup   |
|-------------------|
|Select the **Workspace to Backup** > **Settings** > **Schedule Backups**|


|Scheduled Backup |
|-----------------|
|**Workspace Creation** > **Policies** > **Backup Policies**|


## Backup Scheduling Options

Both the cluster and workspace backup support the following scheduling options:

* Customize your backup for the exact month, day, hour, and minute of the user's choice.
* Every week on Sunday at midnight
* Every two weeks at midnight
* Every month on the 1st at midnight
* Every two months on the 1st at midnight

# Restore a Backup

Backups created manually or as part of the schedule are listed under the Backup/Restore page of the cluster. 

1. Restore operation can be initiated by selecting the restore option for a specific backup. 


2. Next, you will be prompted to select a target cluster where you would like the backup to be restored. The progress of the restore operation can be tracked from the target cluster's Backup/Restore page. 


3. Finally, restore operations can be done to the cluster running on the same project.



</Tabs.TabPane>


<Tabs.TabPane tab="Workspace Quota" key="Workspace Quota">

# Workspace Quota
 
Palette enables the users to limit resource usage within the workspace optionally. The Quota is specified in terms of the maximum CPU and memory. Therefore, the resource utilization within the namespace should be below the Quota allocated across all the clusters.

<br />

## To set your Namespace Quota:

1. During [Step: 3 Associate Namespaces](/workspace/adding-a-new-workspace#3.associatenamespaces) of Namespace creation, **Workspace Quota** can be set by giving the **Maximum CPU** and **Maximum Memory**. Then, all the clusters launched within the Namespace can use the set Quota. 


2. Namespace Quota can be set for an already deployed workspace as:
   `Workspace Settings -> Namespaces -> Workspace Quota`

</Tabs.TabPane>

<Tabs.TabPane tab="Restricted Container Images" key="Restricted Container Images">


# Restricted Container Images

Palette users can restrict a few container images from getting deployed into a specific Namespace. This helps the tenants from accidentally installing a delisted or unwanted container to that specific namespace.

<br />

## Restrict container images to a workspace 

 To restrict a container image for a particular namespace within the workspace:

1. During [Step: 4 Settings](/workspace/adding-a-new-workspace#4.settings) of workspace creation, select the **Container Images** tab from the left ribbon. 


2. Click on **+ Add New Container Image** and provide the **Namespace** and **Restricted Images**. Multiple images can be restricted within a namespace by separating them with commas.
<br />

## Restrict container images to a deployed workspace 

The user can add a list of restricted images to an already deployed workspace as:

1. **Workspace Settings** > **Container Images**


2. Click on **Add New Container Image** and provide the **Namespace** and **Restricted Images**. Multiple images can be restricted within a Namespace by separating them with commas.



</Tabs.TabPane>
</Tabs>

<br />
<br />
<br />





