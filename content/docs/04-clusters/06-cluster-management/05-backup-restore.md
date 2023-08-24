---
title: "Backup and Restore"
metaTitle: "Backup and Restore"
metaDescription: "An overview of the cluster backup and restore concepts."
hideToC: false
fullWidth: false
---


import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Cluster Backup and Restore

A backup is a persistent state of Kubernetes resources, ranging from objects such as Pods, DaemonSets, Services, to persistent volumes. A backup allows you to save the current state of a cluster and restore it at a later point in time if needed. You can restore a backup to the same or a different cluster. 


You can schedule and take a backup of a specific cluster or an entire [workspace](/workspace). Also, you can maintain multiple backups of a cluster or a workspace. The sub-pages for this topic provide instructions for creating and restoring a cluster backup. You can refer to the [Manage Palette Workspace](/workspace/workload-features#managepaletteworkspace) guide to learn more about backup and restore actions for a workspace. 
<br />

## Backup Location

A backup location is an object storage where you store and retrieve the backup files. Before you create a backup, the initial step is to configure a backup location in Palette. You can configure a backup location in a public cloud or a data center environment. A backup location can be the same or different than the cluster deployment location. Palette supports the following object storages as the backup location.

- Amazon Web Services (AWS) Simple Storage Service (S3) bucket

- Google Cloud Platform (GCP) bucket

- MinIO S3 bucket

- Azure blob storage

One of the main prerequisites to configuring a backup location is that the storage bucket is created where you want to store the backup files. For example, if you configure the backup location in AWS, you will need an S3 bucket. Another example is if you configure the backup location in Azure, you will need a container in the Azure Storage account.

After creating the storage bucket, you define the access permissions for the storage bucket and associate the permissions with an Identity Access Management (IAM) entity. Depending on your cloud or data center platform, the IAM entity can be a user, service principal, or role,  Next, you generate the access credentials for the IAM entity. When you configure a backup location in Palette, you provide Palette the access credentials so that it can assume the IAM to perform the bucket-related operations.  
<br />

## Advanced Use Case
An advanced use case is to back up the cluster to a location different from the cluster deployment cloud account. In this scenario, you will authorize Palette to access another account that contains the backup location. Additionally, you must also authorize the cluster to access the backup location.  The following diagram illustrates the order of operations you must complete in Palette.
<br />

1. When you register a primary cloud account in Palette, you authorize Palette to deploy clusters in the cloud account. This guide refers to the primary cloud account as the cluster deployment location.


2. You update the storage bucket's access management policy to authorize Palette to access the storage bucket. 


3. If you create the storage bucket in a separate AWS account and use the STS method to validate the AWS account. In that case, you update the storage bucket's access management policy to authorize the cluster to access the storage bucket.


![A diagram highlighting the use-case when the backup cloud account is different from the cluster deployment cloud account.](/clusters_cluster-management_backup-restore_separate-cloud-accounts.png)


For example, suppose you have deployed a cluster in an AWS cloud account and want to create a backup in a MinIO account. The AWS cloud account is the cluster deployment location, and the MinIO account is the backup location. 


In this example, you will first register the AWS cloud account with Palette. You can refer to the [Add AWS Account](/clusters/public-cloud/aws/add-aws-accounts) guide to learn more. In this step, you will use the AWS Identity and Access Management (IAM) access credentials method or the Security Token Service (STS) method to add an AWS account. In either method, you update the IAM policies in the AWS console to allow Palette to perform specific actions, as outlined in the [Required IAM Policies](/clusters/public-cloud/aws/required-iam-policies) guide. The IAM policies ensure that Palette is authorized and has sufficient permissions to deploy clusters in the cloud account. 


Next, you will add the MinIO account as the backup location. You can refer to the [Add a Backup Location](/clusters/cluster-management/backup-restore/add-backup-location) guide to learn more about adding a backup location. MinIO uses Policy-Based Access Control (PBAC) to control which IAM identities can access the resources and what actions the IAM identities are authorized to perform on the specific resources. The IAM identities are also called *principals*. In this step, you will define an IAM policy in your MinIO account to authorize the principal to access the MinIO bucket and perform the required actions. You will also generate and provide an IAM access key to Palette. Palette becomes the principal when it accesses the MinIO bucket using your access key. Since Palette already has the authorization to administer your cluster in AWS, and you shared the MinIO access key with Palette, the policy *indirectly* authorizes the cluster to access the MinIO bucket. You can learn more about MinIO access management in the [MinIO object storage for Kubernetes](https://min.io/docs/minio/kubernetes/upstream/administration/identity-access-management.html) official documentation.
<br />

<InfoBox>

If you create the backup location in a separate AWS account and use the STS method to validate the backup location. In that case, you must define an explicit trust relationship to authorize the cluster to access the storage bucket. Refer to the [Add a Backup Location](/clusters/cluster-management/backup-restore/add-backup-location) guide to learn more about adding an AWS S3 bucket as the backup location. 

</InfoBox>
<br />

To summarize, you must establish authorization between the three entities - the backup location, the cloud deployment location, and the Palette SaaS account per the guidelines of your cloud service provider. For instance, if you configure the backup in AWS, you can use STS, IAM roles, and a trust relationship. A trust relationship is only required if you use the STS method to validate the backup location from Palette. However, if you use IAM access credentials to validate the backup location, you do not need to define the trust relationship. In the case of Azure, you can use Shared Access Signatures (SAS), AD roles, and service principal identities. Similarly, you can use service accounts, credentials, and IAM roles for GCP.  


# Resources
The following resources will help you configure a backup location and create and restore a cluster backup.
<br />

- [Add a Backup Location](/clusters/cluster-management/backup-restore/add-backup-location)


- [Create a Cluster Backup](/clusters/cluster-management/backup-restore/create-backup)


- [Restore a Cluster Backup](/clusters/cluster-management/backup-restore/restore-backup)