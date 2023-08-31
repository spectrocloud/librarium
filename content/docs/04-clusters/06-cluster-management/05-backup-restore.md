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

Palette supports backup and restore capabilities for Kubernetes clusters.

A backup is a persistent state of Kubernetes resources, ranging from objects such as Pods, DaemonSets, and Services to persistent volumes. A backup allows you to save the current state of a cluster and restore it at a later point in time if needed. You can restore a backup to the same or a different cluster. 

You can schedule and take a backup of a specific cluster or an entire [Workspace](/workspace). You can also maintain multiple backups of a cluster or a workspace. 

<br />

## Get Started


To get started with creating a backup, check out the  [Add a Backup Location using Static Credentials](/clusters/cluster-management/backup-restore/add-backup-location-static) or [Add a Backup Location using Dynamic Credentials](/clusters/cluster-management/backup-restore/add-backup-location-dynamic) guide.


<br />

<InfoBox>

If you are using a Workspace, refer to the [Manage Palette Workspace](/workspace/workload-features#managepaletteworkspace) guide to learn more about backup and restore actions for a workspace.

</InfoBox>

 




## What is a Backup Location?

A backup location is an object storage, such as an AWS Simple Storage Service (S3) bucket, where you store and retrieve the backup files. Before you create a backup, the initial step is configuring a backup location. You can configure a backup location in a public cloud or a data center environment and add it in Palette. Palette supports the following object storage solutions as a backup location.

<br />

- Amazon Web Services (AWS) S3 bucket


- Google Cloud Platform (GCP) bucket


- MinIO S3 bucket


- Azure blob storage


<br />


<InfoBox>

Palette uses the open-source, Velero, to provide backup and restore capabilities. You can learn more about Velero by checking out their [Restore Reference](https://velero.io/docs/main/restore-reference/) and [Backup Reference](https://velero.io/docs/main/backup-reference/) documentation.  


</InfoBox>


You can add a backup location to the same cloud account you deploy Kubernetes clusters or use a different account. Both authentication methods require an Identity Access Management (IAM) entity in the cloud account and access credentials for the IAM entity. 


## Backup Locations and Credentials


Palette uses the access credentials to authenticate itself while accessing the storage bucket. Palette supports static credentials for all cloud service providers. You can also dynamic credentials with the backup and restore workflow. 

Review the table below to learn more about what cloud providers and credentials methods are supported.

<br />

|**Service Provider**|**Static Credentials Support**|**Dynamic Credentials Support**|
|---|---|---|
|AWS|✅|✅ |
|GCP|✅|❌|
|MinIO|✅|❌|
|Azure|✅|❌|

To learn more about adding a backup location, check out the [Add a Backup Location using Static Credentials](/clusters/cluster-management/backup-restore/add-backup-location-static) or [Add a Backup Location using Dynamic Credentials](/clusters/cluster-management/backup-restore/add-backup-location-dynamic) guide.




# Resources



- [Add a Backup Location using Static Credentials](/clusters/cluster-management/backup-restore/add-backup-location-static)


- [Add a Backup Location using Dynamic Credentials](/clusters/cluster-management/backup-restore/add-backup-location-dynamic)


- [Create a Cluster Backup](/clusters/cluster-management/backup-restore/create-cluster-backup)


- [Restore a Cluster Backup](/clusters/cluster-management/backup-restore/restore-cluster-backup)