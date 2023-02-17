---
title: "Enable Disk Backup on Virtual Clusters"
metaTitle: "Enable Disk Backup on Virtual Clusters."
metaDescription: "Learn how to configure disk and volume backup for virtual clusters in a cluster group."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Overview

Palette [Virtual Clusters](/clusters/palette-virtual-clusters) are a capability that cluster groups support and that you can enable when creating a cluster group. By default, the virtual cluster settings in a cluster group disable disk backups. You can back up all the volumes within a virtual cluster using the following steps. 

# Prerequisites

* A project or tenant backup location. Refer to the [cluster backup and restore](/clusters/cluster-management/backup-restore#clusterbackupandrestore) document to learn how to configure a backup location.

* Cluster group modification [permissions](/user-management/palette-rbac).

* A cluster group. Review the [create a cluster group](/clusters/cluster-groups/create-cluster-group) for additional guidance.


<InfoBox>

You can also enable virtual cluster disk backup during the cluster group creation process.

</InfoBox>


# Enable Backup for Virtual Clusters

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Cluster Groups**.


3. Select a cluster group to enable virtual cluster disk backup.


4. Click **Settings** and expand the **Settings** Menu.


5. To enable disk backup you need to change the following configurations in the **Advanced Config** section.

    - Set `syncer.extraArgs.rewrite-host-paths` to `true`
    ```yaml
    syncer:
    extraArgs:
        - --rewrite-host-paths=true
    ```
    - Set `hostpathMapper.enabled` to `true`
    ```yaml
    hostpathMapper:
        enabled: true
    ```
    - Set `podSecurityStandard` to `privileged`
    ```yaml
    isolation:
    podSecurityStandard: privileged
    ```

<WarningBox>

Setting the `podSecurityStandard` to `privileged` can introduce privilege escalations. We recommend you discuss this with your security system administrator.

</WarningBox>

7. Save your changes.


All virtual clusters deployed in this cluster group will now include disk storage during backup operations.

# Validation


You can validate the disk backups are occurring by deploying a virtual cluster and taking a backup. 

1. Log in to [Palette](https://console.spectrocloud.com).


2. Deploy a virtual cluster in your cluster group that has the disk backup settings enabled. Refer to the [Deploy a Virtual Cluster to a Cluster Group](/clusters/palette-virtual-clusters/deploy-virtual-cluster) guide to learn how to deploy Palette Virtual clusters.


3. Create a backup of your virtual cluster and include all disks. Use the [Create a Cluster Backup](/clusters/cluster-management/backup-restore#createaclusterbackup) guide for additional guidance.


4. Access the backup location's blob storage and review the backup files.

Example of a backup that includes the virtual cluster disks.
![Example image of a backup that includes disks](/clusters_cluster-groups_cluster-group-backups_backup-overview.png)