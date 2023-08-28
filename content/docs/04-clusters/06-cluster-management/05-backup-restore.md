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
<br />

## Backup Location

A backup location is an object storage, such as an AWS Simple Storage Service (S3) bucket, where you store and retrieve the backup files. Before you create a backup, the initial step is configuring a backup location. You can configure a backup location in a public cloud or a data center environment and add it in Palette. Palette supports the following object storages as the backup location.

- Amazon Web Services (AWS) S3 bucket

- Google Cloud Platform (GCP) bucket

- MinIO S3 bucket

- Azure blob storage
<br />

## Overview - Add a Backup Location

You can add a backup location in the same cloud account where you deployed the Kubernetes cluster or a different one. In either case, you must create an Identity Access Management (IAM) entity in the cloud account and generate the access credentials for the IAM entity. 
Next, you share the access credentials with Palette. Palette uses the access credentials to authenticate itself while accessing the bucket. Palette supports the long-term credentials for all cloud service providers, whereas it supports the on-demand temporary security credentials only for AWS. The table below summarizes the Palette-supported access credentials methods for different cloud service providers.
<br />

|**Cloud Service Provider**|**Does Palette supports long-term access credentials?**|**Does Palette supports on-demand temporary security credentials or tokens?**|
|---|---|---|
|AWS|✅|✅ |
|GCP|✅|❌|
|MinIO|✅|❌|
|Azure|✅|❌|


You can use the long-term access credentials for all cloud service providers. The long-term credentials remain valid until you explicitly revoke or rotate them from your cloud account. Refer to the [Add a Backup Location using Access Credentials](/clusters/cluster-management/backup-restore/add-backup-location) guide for more details. 


You can use the on-demand temporary security credentials only for AWS. AWS's on-demand temporary security credentials service is called the Security Token Service (STS). If you use the STS, there are certain conditions you must fulfill before adding a backup location. Refer to the [Add a Backup Location using Security Token Service](/clusters/cluster-management/backup-restore/add-backup-location-sts) guide for more details. 
<br />


# Resources
The following resources will help you add a backup location and create and restore a cluster backup.
<br />

- [Add a Backup Location using Access Credentials](/clusters/cluster-management/backup-restore/add-backup-location)


- [Add a Backup Location using Security Token Service](/clusters/cluster-management/backup-restore/add-backup-location-sts)


- [Create a Cluster Backup](/clusters/cluster-management/backup-restore/create-backup)


- [Restore a Cluster Backup](/clusters/cluster-management/backup-restore/restore-backup)