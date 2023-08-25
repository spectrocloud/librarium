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

A backup location is an object storage, such as AWS Simple Storage Service (S3) buckets, where you store and retrieve the backup files. Before you create a backup, the initial step is to configure a backup location in Palette. You can configure a backup location in a public cloud or a data center environment. A backup location can be the same or different than the cluster deployment location. Palette supports the following object storages as the backup location.

- Amazon Web Services (AWS) S3 bucket

- Google Cloud Platform (GCP) bucket

- MinIO S3 bucket

- Azure blob storage
<br />

## Add a Backup Location - Overview

You can add a backup location in the same cloud account where you deployed the Kubernetes cluster or a different one. In either case, you must create an Identity Access Management (IAM) entity in the cloud account and generate the access credentials for the IAM entity. 
Next, you share the access credentials with Palette. 
Palette uses the access credentials to authenticate itself while accessing the bucket. 
Palette supports the following access credentials to authenticate with the different cloud account types.
<br />

|**Backup Location Provider**|**Does Palette supports long-term credentials?**|**Does Palette supports on-demand temporary security credentials or tokens?**|
|---|---|---|
|AWS|✅|✅|
|GCP|✅|❌|
|MinIO|✅|❌|
|Azure|✅|❌|


You can use the long-term access credentials for all backup location providers. AWS, GCP, and Azure offer different types of long-term credentials for access. You do not use Palette's instance identity while generating the access credentials. The long-term credentials remain valid until you explicitly revoke or rotate them from your cloud account. Refer to the [Add a Backup Location using Access Credentials](/clusters/cluster-management/backup-restore/add-backup-location) guide for more detials. 


However, if you use AWS's on-demand temporary security credentials service, the Security Token Service (STS), there are certain conditions you must fulfill to create and restore a backup. Refer to the [Add a Backup Location using Security Token Service](/clusters/cluster-management/backup-restore/add-backup-location-sts) guide for more details. 
<br />


# Resources
The following resources will help you configure a backup location and create and restore a cluster backup.
<br />

- [Add a Backup Location using Access Credentials](/clusters/cluster-management/backup-restore/add-backup-location)


- [Add a Backup Location using Security Token Service](/clusters/cluster-management/backup-restore/add-backup-location-sts)


- [Create a Cluster Backup](/clusters/cluster-management/backup-restore/create-backup)


- [Restore a Cluster Backup](/clusters/cluster-management/backup-restore/restore-backup)