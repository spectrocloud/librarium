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

After creating the storage bucket, you define the access permissions for the storage bucket and associate the permissions with an Identity Access Management (IAM) entity. Depending on your cloud or data center platform, the IAM entity can be a user, service principal, or role,  Next, you generate the access credentials for the IAM entity. When you configure a backup location in Palette, you provide Palette the access credentials so that it can assume the IAM entity's role to perform the bucket-related operations.  


# Resources
The following resources will help you configure a backup location and create and restore a cluster backup.
<br />

- [Add a Backup Location](/clusters/cluster-management/backup-restore/add-backup-location)


- [Create a Cluster Backup](/clusters/cluster-management/backup-restore/create-backup)


- [Restore a Cluster Backup](/clusters/cluster-management/backup-restore/restore-backup)