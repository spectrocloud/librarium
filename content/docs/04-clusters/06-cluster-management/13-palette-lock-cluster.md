---
title: "Platform Settings"
metaTitle: "Platform Settings"
metaDescription: "Platform Settings on Palette"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Manage Platform Settings

* [Pause Platform Updates](/clusters/cluster-management/palette-lock-cluster#pauseplatformupdates)
* [Auto Remediation](/clusters/cluster-management/palette-lock-cluster#autoremediation)

# Pause Platform Updates

Palette supports the **Pause Platform Updates** feature to exclude a cluster or a group of clusters from getting upgraded when Palette is upgraded. The use cases of this feature are:

<br />

* Pause Updates for Single Cluster
* Pause Updates for all the Clusters within the Project Scope
* Pause Updates for all Clusters within the Tenant Scope

<br />

## Pause Updates for Single Cluster

Individual cluster under Project scope and Tenant scope can be locked to restrict them from the Palette upgrades. To lock a cluster follow the below steps:
<br />

1. Log in to Palette console as Tenant or Project administrator.


2. Go to the `Clusters` page from the left ribbon menu and select the cluster to be paused with updates.


3. From the cluster details page, click `Settings -> Cluster Settings`


4. Toggle the `Pause Platform Updates` button to pause updates of the cluster so that the cluster management services are not upgraded on the upgrade of the Palette.


5. To unpause the cluster updates, toggle the `Pause Platform Updates` back and deselect. 

<br />

## Pause Updates for all the Clusters within the Project Scope

All the clusters under a Project can be paused for updates to restrict them from the Palette upgrades. To pause updates for all clusters under Project scope:

1. Log in to Palette console as Project administrator.


2. Select `Project Settings` from the left ribbon menu.


3. From `Project Settings` page, select `Platform Updates` and toggle the `Pause Platform Updates` button. This restricts all the clusters under that project scope from being upgraded from cluster management services upgrade on the upgrade of the Palette.


4. To unpause the clusters updates, toggle the `Pause Platform Updates` back and deselect. 

## Pause Updates for all Clusters within the Tenant Scope


All the clusters under a Tenant can be update paused to restrict them from the Palette upgrades. To lock all clusters under a Tenant scope:

<br />

1. Log in to the Palette console as a `Tenant administrator`.


2. Select `Tenant Settings` from the left ribbon menu.


3. From `Tenant Settings,` select `Platform Updates` and toggle the `Pause Platform Updates` button.This restricts all the clusters under that tenant scope from being upgraded from cluster management services upgrade on the upgrade of the Palette.


4. To unlock the clusters, toggle the `Pause Platform Updates` back and deselect. 


# Auto Remediation

Palette provides Cluster Auto Remediation as a node reconciliation operation. When Cluster Auto Remediation is on, unhealthy nodes in all the Palette-provisioned clusters will automatically be replaced with new nodes. Turning off this feature will disable auto remediation. 
This feature can work under the scope of:

* Tenant

* Project

To enable auto remediation:
 
* Login to Palette console as Tenant/Project admin.

* Go to `Tenant Settings`/`Project Settings` as per the user scope.

* Select `Platform Settings` from the left menu and toggle `Cluster Auto Remediation` toggle button.

<InfoBox>
This does not apply to EKS, AKS or TKE clusters.
</InfoBox>
