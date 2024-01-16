---
sidebar_label: "Enterprise  Management"
title: "Enterprise  Management"
description: "Learn how to manage your enterprise clusters."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["self-hosted", "enterprise"]
---



Palette supports several Day-2 operations to manage the end-to-end lifecycle of the Kubernetes clusters launched through Palette On-Premises Enterprise Mode. It provides several capabilities across clusters to keep your clusters secure, compliant, up-to-date, and perform ongoing management operations like backup/restore and cluster migration across Private Cloud Gateway (PCGs).


<Tabs queryString="pcg">

<TabItem label="Palette PCG Migration" value="Palette PCG Migration">


## Palette PCG Migration

Palette enables PCG migration to route the traffic between PCGs to ensure uninterrupted PCG service availability. If a PCG goes unhealthy, it can be deleted after migrating the clusters launched through that PCG to another healthy PCG. This ensures that cluster operations such as deletion are carried out without interruption.  

## When Will You Migrate

The possible conditions of PCG migration are:

* Unhealthy PCG to healthy PCG


* Healthy PCG to healthy PCG


## How to Migrate a PCG Traffic 

To migrate the traffic from a PCG:
<br />

1. Log in as **Tenant Admin** to the Palette Console.


2. From the **Tenant Settings**, go to the **Private Cloud Gateways** tab to list all PCGs.


3. Click the 'Kebab' menu (three-dot ellipsis) towards the PCG to be migrated to see the drop-down option of **Migrate**.


4. Click the **Migrate** option to open the wizard to select your destination PCG.


5. The wizard will display the drop-down list of all healthy PCGs to which traffic can be migrated. Select the PCG of your choice from the drop-down.


6. Confirm the migration operation to get a UI confirmation of the successful migration. 


7. Once the migration is completed, the unhealthy/source PCG can be deleted successfully. Clear the residual resources manually to complete the deletion process.


8. The **Audit Logs** gives the migration update.

</TabItem>

<TabItem label="Backup and Restore" value="Backup and Restore">

## Backup and Restore for Enterprise Clusters

Palette provides convenient backup options to backup the Enterprise Kubernetes cluster state into object storage. It restores it at a later point in time if required to the same or a different cluster. Besides backing up Kubernetes native objects like Pods, DaemonSets, Services, etc., a snapshot of the persistent volume is taken and maintained as part of the backup. The two options of backup creation are:

* FTP


* S3

FTP mode backup is sending the backup data of your enterprise cluster to a dedicated FTP server using the File Transfer Protocol (FTP).

S3 buckets for backup make it trivial for everyone to use Amazon’s infrastructure for remote backups and secure cluster objects online. In addition, this feature provides the advantages of scheduling, strong encryption, compression, easy access to your backup files. 

### Instructions

1. Log in to enterprise mode as administrator:

  	* https://system_IP/system
  	* Username: admin
  	* Password: custom password


2. Select **Administration** from left panel.


3. On the **Administration** page, select **Backup/Restore** from the top ribbon.


4. Complete the backup configuration wizard to complete the mode of backup creation.


5. Select the mode of backup from the two available options: 
    * FTP 
	* S3


### FTP

The following information is filled to create a backup location in FTP mode:

1. Provide the ftp:// server details.


2. The directory name for the backup storage.


3. Username and Password to log in to the server.


4. Scheduling details of the backup.
	* **Interval** specifies the number of days between two consecutive backups.
	* **Retention period** for backup in days.
	* **Hours of the day** (UTC 0 to 23 hours) specifies the time of the specified day to take the backup.


5. This configuration is saved and used for creating an FTP backup by clicking the **+Create FTP backup** button on the top-right corner of the page.


6. The configuration can be edited as per the requirements.


7. Delete/Restore a specific backup from the actions panel.

:::info
The saved configuration details can be used to create multiple backup locations. 
Any changes can be made to the existing configuration and saved for reuse. 
:::

### S3 Backup Location

:::warning

An AWS S3 bucket created is a prerequisite.

The following permissions need to be enabled.

:::

#### Permission Sets
Ensure that the IAM user or the `root` user role created should have the following two IAM policies included:

**EC2-Policy**

```json
{
  "Version": "2012-10-17",
  "Statement": [
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
        "<EC2-LOG-GROUP-ARN>;"
      ]
    }
  ]
}
```


**S3-Policy**

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
      "Resource": "<S3-LOG-GROUP-ARN>"
    }
  ]
}
```

The following information is needed:


* AWS Account Access key


* AWS Account Secret Key


* AWS Region


* AWS Bucket name


* Folder name to which the backup is stored in the S3 bucket


* Scheduling details of the backup,
	* **Interval** specifies the number of days between two consecutive backups.
	* **Retention period** of backup in days.
	* **Hours of the day** (UTC 0 to 23 hours) specifies the time of the specified day to take the backup.


* Validate the information and save the configurations.


* The saved configuration is used for creating an S3 backup by clicking the **+Create S3 backup** button on the top-right corner of the page.


* Once the backup is created, the details such as Backup uid, Mode, Status, Finish Time, and Actions is viewed from the console for the individual backup.


* Delete/Restore a specific backup from the actions panel. 


:::info
The saved configuration details can be used to create multiple backup locations. Any changes can be made to the existing configuration and saved for reuse. 
:::


</TabItem>

</Tabs>
