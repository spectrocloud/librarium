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

A backup is a persistent state of Kubernetes resources, ranging from objects such as Pods, DaemonSets, and Services to persistent volumes. A backup allows you to save the current state of a cluster and restore it at a later point in time if needed. You can restore a backup to the same or a different cluster. 

You can schedule and take a backup of a specific cluster or an entire [workspace](/workspace). Also, you can maintain multiple backups of a cluster or a workspace. The sub-pages for this topic provide instructions for creating and restoring a cluster backup. You can refer to the [Manage Palette Workspace](/workspace/workload-features#managepaletteworkspace) guide to learn more about backup and restore actions for a workspace. 


Palette leverages an open-source tool called Velero to provide backup and restore capabilities. You can refer to Velero's official documentation, [Restore Reference](https://velero.io/docs/main/restore-reference/) and [Backup Reference](https://velero.io/docs/main/backup-reference/), to learn more.  
<br />

## Backup Location

A backup location is an object storage, such as an AWS Simple Storage Service (S3) bucket, where you store and retrieve the backup files. Before you create a backup, the initial step is configuring a backup location. You can configure a backup location in a public cloud or a data center environment and add it in Palette. Palette supports the following object storages as the backup location.

- Amazon Web Services (AWS) S3 bucket

- Google Cloud Platform (GCP) bucket

- MinIO S3 bucket

- Azure blob storage
<br />


You can add a backup location to the same cloud account you deploy Kubernetes clusters or use a different account. In either case, you must create an Identity Access Management (IAM) entity in the cloud account and generate the access credentials for the IAM entity. 
Next, you share the access credentials with Palette. Palette uses the access credentials to authenticate itself while accessing the storage bucket. Palette supports static credentials for all cloud service providers. Review the table below to learn more about what cloud providers and credentials methods are supported.
<br />

|**Service Provider**|**Static Credentials Support**|**Dynamic Credentials Support**|
|---|---|---|
|AWS|✅|✅ |
|GCP|✅|❌|
|MinIO|✅|❌|
|Azure|✅|❌|


You can use static credentials for all supported cloud providers. Static credentials remain valid until you explicitly revoke or rotate the credentials. For more details, refer to the [Add a Backup Location using Static Credentials](/clusters/cluster-management/backup-restore/add-backup-location-static) guide. 


You can use dynamic credentials only for AWS. AWS's dynamic credentials service is called the Security Token Service (STS). If you use the STS, there are certain conditions you must fulfill before adding a backup location. Refer to the [Add a Backup Location using Dynamic Credentials](/clusters/cluster-management/backup-restore/add-backup-location-dynamic) guide for more details. 
<br />


# Resources
The following resources will help you add a backup location and create and restore a cluster backup.
<br />

- [Add a Backup Location using Static Credentials](/clusters/cluster-management/backup-restore/add-backup-location-static)


- [Add a Backup Location using Dynamic Credentials](/clusters/cluster-management/backup-restore/add-backup-location-dynamic)


- [Create a Cluster Backup](/clusters/cluster-management/backup-restore/create-cluster-backup)


- [Restore a Cluster Backup](/clusters/cluster-management/backup-restore/restore-cluster-backup)