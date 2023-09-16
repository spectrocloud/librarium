---
sidebar_label: "Workspace Management"
title: "The additional features to optimize workspace performance"
description: "How to get unified view of workloads in logically grouped namespaces and clusters"
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["workspace"]
---



# Manage Palette Workspace

Palette supports several day 2 operations to manage the end-to-end lifecycle of the Kubernetes clusters through Workspaces. It also provides several capabilities across new and imported clusters to keep your clusters secure, compliant, up to date, and perform ongoing management operations like Backup and Restore. Additionally, you can have visibility into the workloads running inside your cluster and cluster costs.

The following sections describe these capabilities in detail:

<br />

------------------------

<Tabs queryString="object-storage">
<TabItem label="Workload Visibility" value="Workload Visibility">


##  Workload Visibility

Workspace provides visibility into workloads deployed across clusters. 

|**Resource**|**Description availed from Workspace**|
|---|-----|
|**Namespaces**|Cluster Specific namespaces with CPU and Memory utilization.|
|**Pods**|Lists all the pods running on a particular namespace with cluster names with the detailed health status, age, and resource utilization of each of them.|
|**Deployments**|All the running deployments specific to clusters belonging to the Workspace with namespace to which these deployments belong, pods details, replicas, and age are enumerated|
|**DaemonSets**|DaemonSet resource utilization is described, with details on namespaces, pods, and age of individual Daemon sets|
|**StatefulSets**|All the active StatefulSets specific to clusters belonging to the Workspace with corresponding namespace, pods details, replicas, and age are enumerated|
|**Jobs**|A Job creates one or more Pods and will continue to retry execution of the Pods until a specified number of them successfully terminate.|
|**CronJobs**|Cron Jobs are regularly scheduled actions or jobs such as backups, report generation, etc.    Each of these jobs will recur as scheduled.|
|**RoleBinding**|A role binding grants the permissions defined in a role to a user or set of users. |
|**ClusterRoleBinding**|A Cluster Role binding defines the permissions defined across a cluster.|
</TabItem>

<TabItem label="Backups and Restore" value="Backups and Restore">


## Workspace Backup and Restore

Palette users can create cluster backups from within a workspace (usually consisting of multiple clusters) and restore them later time as desired. Palette allows granular controls within a workspace for users to perform specific tasks within the workspace, without having the ability to update workspace details. To provide granular access within a workspace for specific actions, Palette provides the following two Roles:

## Workspace Operator

Users assigned the **Workspace Operator** Role can only perform Backup and Restore actions within the Workspace.

## Workspace Admin

A Role that has all administrative permissions and privileges within the Workspace.

## Create your Workspace Roles

To create your **Workspace Role**, follow the steps below:

1. Log in to the Palette Management Console as **Tenant Admin**.


2. Go to the **Users and Teams** option.


3. From the listed users, select the user to be assigned with Workspace Roles. See here for [User Creation](../user-management/new-user.md).


4. Select the **Workspace Roles** tab and click **+ New Workspace Role** to create a new role.


5. Fill the following information into the **Add Roles to User-Name** wizard:
   * Project
   * Workspace
   * Choose the role from the options:
      * Workspace Admin
      * Workspace Operator


6. Confirm the information provided to complete the wizard.


7. The user set with the Workspace Role can take Workspace-wide Backups and Restores in compliance with their permissions and privileges.

Palette leverages the BackUps to the following locations:

<br />

#### Amazon Web Services (AWS) S3 Buckets: [Prerequisites](#amazon-web-services-aws-s3-buckets-prerequisitesbucketasbackuplocation-configure-your-backup)bucketasbackuplocation), [Configure your Backup](#configure-your-backup-in-aws-s3)

#### Google Cloud Platform (GCP) Buckets: [Prerequisites](#google-cloud-platform-gcp-buckets-prerequisites-configure-your-backup), [Configure your Backup](#configure-your-backup-in-gcp-bucket)

#### MinIO S3 Buckets: [Prerequisites](#minio-s3-buckets-prerequisites-configure-your-backup), [Configure your Backup](#configure-your-backup-in-minio)

#### Azure Blob: [Prerequisites](#azure-blob-prerequisites-configure-your-backup), [Configure your Backup](#configure-your-backup-in-azure-azure-blob)

## Prerequisites

## For an Amazon Web Services (AWS) Bucket as Backup Location

* The AWS S3 permissions listed in the next section need to be configured in the AWS account to provision Backup through Palette.

* Pre-create a bucket at the AWS or MinIO object-store.

## For a Google Cloud Platform (GCP) Backup Location

* GCP service account with a **Storage Admin** role.

* Pre-create a bucket at the GCP object storage.

## For MinIO S3 Backup

* S3 bucket with Read/Write Access

* A unique access key (username) and corresponding secret key (password) from MinIO Console. 

* Service provider certificate (Optional)

#### For Azure Blob Backup

* An active Azure cloud account with the following pieces of information noted down:
  * Tenant Id
  * Client Id
  * Subscription Id
  * Client Secret created


* An [Azure storage account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal) created with the following information to be noted down for Palette use:
  * Storage Name: Custom name given to the Azure storage created.
  * Stock-keeping unit


* A container to be created in the Azure Storage account

## Backup Locations

AWS Simple Cloud Storage (S3) and other S3 compliant object stores such as MinIO and GCP Buckets are currently supported as backup locations. These locations can be configured and managed under the **Project** > **Settings** option and can be selected as a backup location, while backing up any cluster in the project.

### Configure your Backup in AWS S3 

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
                    "arn:aws:s3:::BUCKET-NAME/*"
                ]
            },
            {
                "Effect": "Allow",
                "Action": [
                    "s3:ListBucket"
                ],
                "Resource": [
                    "arn:aws:s3:::BUCKET-NAME"
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


## Configure your Backup in MinIO

The following details are required to configure a backup location in AWS:

1. **Location Name**: Name of your choice.


2. **Location Provider**: Minio


3. **Certificate**: Optionally required for MinIO.


4. **S3 Bucket**: S3 bucket name must be pre-created on the MinIO object-store.


5. **Region**: Region in which the S3 bucket is created. Example: us-east-1 


6. **S3 URL**: Url of the MinIO object storage console. Example: `http://12.123.234.567:0000`


7. **Force S3 path style** : To force S3 pathstyle addressing or else the url will be converted to virtual-hosted style addressing with bucket name appended to the url.This is an optional setting.


8. **Authenticate** using MinIo access key and secret access key.


9. Click **Create** to complete the location creation wizard. 

## Configure your Backup in Azure: Azure Blob

The following details are required to configure a backup location in Azure:

1. **Location Name**: A custom name for the storage location getting created.


2. **Location Provider:** Select **Azure** from the drop-down.


3. **Container Name:** The container created in Azure Storage.


4. **Storage Name**: Name of the Azure storage created.


5. **Stock-Keeping Unit**: Information from the Azure storage.


6. **Resource Group:** Azure Resource Group name


7. **Tenant ID:** Azure Account Credential.


8. **Client ID:** Azure Account Credential.


9. **Subscription ID**: Azure Account Credential.


10. **Client Secret:** Secret created in the Azure console needs to be validated.


11. Click **Create** to complete the location creation wizard.


## Add a Backup Location

Go to **Project Settings** > **Backup locations** > **Add a New Backup location**.

## Create a Workspace Backup

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

## Restore a Backup

Backups created manually or as part of the schedule are listed under the Backup/Restore page of the cluster. 

1. Restore operation can be initiated by selecting the restore option for a specific backup. 


2. Next, you will be prompted to select a target cluster where you would like the backup to be restored. The progress of the restore operation can be tracked from the target cluster's Backup/Restore page. 


3. Finally, restore operations can be done to the cluster running on the same project.



## Restore Your Backup

To initiate a restore operation:
<br />

1. Log in to the Palette console as the **Project Admin** and go to **Workspaces** page.


2. Select the **Workspace Name** to be restored.


3. From the selected Workspace overview, select **Backups** from the top menu.


4. The Backup option lists all the backups scheduled for the selected Workspace. Towards the name of the backup, click the meatball (three horizontal dots) button to open the restore wizard.


5. Click on the **Restore Backup** option to complete the wizard:
   * Choose of the namespaces to be restored
   * Three options are available to filter the resources to be restored:
     * **Include Cluster Resources** - To restore all the cluster scoped resources.
     * **Preserve Node Ports** - To preserve ports for node port service running in the cluster.
     * **Restore PVs** - To restore the persistent volumes.
        
   **Note**: Check **Include Cluster Resource** and **Restore PVs** options together.


6. Make the appropriate choice of resources as per user requirements to complete the wizard.


</TabItem>


<TabItem label="Workspace Quota" value="Workspace Quota">

## Workspace Quota
 
Palette enables the users to limit resource usage within the workspace optionally. The Quota is specified in terms of the maximum CPU and memory. Therefore, the resource utilization within the namespace should be below the Quota allocated across all the clusters.

<br />

## To set your Resource Quota:

1. During [Step: 3 Associate Namespaces](adding-a-new-workspace#3-associate-namespaces) of Namespace creation, **Workspace Quota** can be set by giving the **Maximum CPU** and **Maximum Memory**. Then, all the clusters launched within the Namespace can use the set Quota. 


2. Namespace Quota can be set for an already deployed workspace as:
   `Workspace Settings -> Namespaces -> Workspace Quota`

### Workspace Quota Notes:

* The quota allocated to the workspace scope is split across all the namespaces under that workspace per their resource requirements.


* The palette allows quotas to be allocated to individual namespaces under a specific workspace. In that case, individual clusters belonging to that namespace can utilize the quota per their resource requirements. When a namespace is allocated with a quota, all the clusters belonging to that namespace get allocated with that resource quota individually. 

    **Example**: If Namespace palette-ns belongs to two (2) clusters, p1 and p2, and palette-ns is allocated a quota of 1 CPU and 1 Gb memory, each of p1 and p2 gets allocated 1 CPU and 1 GB memory individually.


* Palette allows quota to be allocated to individual clusters under a specific workspace. In that case, the allocated quota should not exceed the namespace quota.


* To set an unlimited quota, set the quota value as -1.
   * If -1 is set as the quota for a cluster, then we cannot set a quota for the workspace to which the cluster belongs.
   * If -1 is set as the quota for a Workspace, then we cannot set a quota for the clusters belonging that Workspace.
   

</TabItem>
<TabItem label="Regex for Namespaces" value="Regex for Namespaces">

## Regex for Namespaces

Palette leverages Regex Pattern matching to select multiple namespaces to apply Role binding concurrently. When we have many namespaces to be configured for role binding, the user can provide a Regex pattern matching multiple namespaces instead of giving a single namespace. This will help select all the namespaces matching the given Regex pattern to be selected together for role binding. 

## Use Cases

1. A Regex pattern that start and end with " / ", will select all the workspace names matching the given Regex pattern.

   **Example:** `/^palette-ns/`
<br />

2. A Regex pattern that starts with `negation symbol(~)`, will select all the namespaces that *does not match* with the regex expression given.

   **Example:** `~/^(kube|cluster|capi|jet|cert)[-].+/`

**Note**: No spaces to be added between the `~` operator and the `expression`.
 
</TabItem>

<TabItem label="Workspace Role Binding" value="Workspace Role Binding">

## Workspace Role Binding

Workspace Role Binding is a Project scope operation. There are two available options for setting up Roll Binding for a Workspace:

* **Cluster** to create a RoleBinding with cluster-wide scope (ClusterRoleBinding).


* **Namespaces** to create a RoleBinding within namespaces scope (RoleBinding).

Palette users can choose role creation based on their resource requirements.

## Configure cluster role bindings

* Login to Palette as Project admin and select the Workspace to which the Role Binding need to configured.


* Select Settings -> Cluster


* Select the clusters from the workspace to Role Bind.


* Click on “Add new binding” to open the “Add Cluster Role Binding” wizard. Fill in the following details:
  * Role Name: Define a custom role name to identify the cluster role
  * Subjects: Subjects are a group of users, services, or teams using the Kubernetes API. It defines the operations a user, service, or a team can perform. There are three types of subjects:
    * Subject Type:
      * Users: These are global and meant for humans or processes living outside the cluster.
      * Groups: Set of users.
      * Service Accounts: Kubernetes uses service accounts to authenticate and authorize requests by pods to the Kubernetes API server. These are namespaced and meant for intra-cluster processes running inside pods.
  * Subject Name: Custom name to identify a subject.
A single RoleBinding can have multiple subjects.


* “Confirm” the information to complete the creation of the ClusterRoleBinding.

## Configure role bindings: Namespace Scope

Users can now allocate CPU and Memory [quotas](#workspace-quota) for each **namespace** at the cluster level.

* Login to Palette as Project admin and select the Workspace to which the Role Binding need to be configured.


* Select Cluster Settings -> Namespace.


* Create a namespace with a custom name and add it to the list of the namespace by clicking on “add to the list”.


* [Allocate resources](workload-features.md#workspace-quota) to the created namespace (CPU and Memory).


* Click on “Add new binding” to open the “Add ClusterRoleBinding” wizard. Fill in the following details:
  * Namespace: Select the namespace from the drop-down Menu. The list will display the namespaces created during the previous step.
  * Role Type: Select the role type from the drop-down. Either Role or Cluster Role.

:::info
A RoleBinding may reference any Role in the same namespace. Alternatively, a RoleBinding can reference a ClusterRole and bind that ClusterRole to the namespace of the RoleBinding. For example, if you want to bind a ClusterRole to all the namespaces in your cluster, you use a ClusterRoleBinding.
:::

* Role Name: Define a custom role name to identify the cluster role


* Subjects: Subjects are a group of users, services, or teams using the Kubernetes API. It defines the operations a user, service, or group can perform. There are three types of subjects:
  * Subject Type:
    * Users: These are global, and meant for humans or processes living outside the cluster.
    * Groups: Set of users.
    * Service Accounts: Kubernetes uses service accounts to authenticate and authorize requests by pods to the Kubernetes API server. These are name spaced and meant for intra-cluster processes running inside pods.
  * Subject Name: Custom name to identify a subject.
A single RoleBinding can have multiple subjects. 


* “Confirm” the information to complete the creation of the RoleBinding.

</TabItem>

<TabItem label="Restricted Container Images" value="Restricted Container Images">


## Restricted Container Images

Palette users can restrict a few container images from getting deployed into a specific Namespace. This helps the tenants from accidentally installing a delisted or unwanted container to that specific namespace.

<br />

## Restrict container images to a workspace 

 To restrict a container image for a particular namespace within the workspace:

1. During [Step: 4 Settings](adding-a-new-workspace.md#4-settings) of workspace creation, select the **Container Images** tab from the left ribbon. 


2. Click on **+ Add New Container Image** and provide the **Namespace** and **Restricted Images**. Multiple images can be restricted within a namespace by separating them with commas.
<br />

## Restrict container images to a deployed workspace 

The user can add a list of restricted images to an already deployed workspace as:

1. **Workspace Settings** > **Container Images**


2. Click on **Add New Container Image** and provide the **Namespace** and **Restricted Images**. Multiple images can be restricted within a Namespace by separating them with commas.

</TabItem>
</Tabs>





