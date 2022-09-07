---
title: "Lock Clusters"
metaTitle: "Lock Clusters on Palette"
metaDescription: "Lock Clusters on Palette"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Overview

Palette supports the **Cluster(s) Lock** feature to exclude a cluster or a group of clusters from getting upgraded when Palette is upgraded. The use cases of this feature are:

<br />

* Lock Single Cluster
* Lock all the Clusters within the Project Scope
* Lock all Clusters within the Tenant Scope

<br />

## Lock Single Cluster

Individual cluster under Project scope and Tenant scope can be locked to restrict them from the Palette upgrades. To lock a cluster follow the below steps:
<br />

1. Log in to Palette console as Tenant or Project administrator.


2. Go to the `Clusters` page from the left ribbon menu and select the cluster to be locked.


3. From the cluster details page, click `Settings -> Cluster Settings`


4. Toggle the `Lock Cluster` button to lock the cluster so that the cluster management services are not upgraded on the upgrade of the Palette.


5. To unlock the cluster, toggle the ‘Lock Cluster’ back and deselect. 

<br />

## Lock all the Clusters within the Project Scope

All the clusters under a Project can be locked to restrict them from the Palette upgrades. To lock all clusters under Project scope:

1. Log in to Palette console as Project administrator.


2. Select `Project Settings` from the left ribbon menu.


3. From`Project Settings` page, select `Cluster Settings` and toggle the `Lock all clusters` button. This restricts all the clusters under that project scope from being upgraded from cluster management services upgrade on the upgrade of the Palette.


4. To unlock the clusters, toggle the ‘Lock all Clusters’ back and deselect. 

## Lock all Clusters within the Tenant Scope


All the clusters under a Tenant can be locked to restrict them from the Palette upgrades. To lock all clusters under a Tenant scope:

<br />

1. Log in to the Palette console as a `Tenant administrator`.


2. Select `Tenant Settings` from the left ribbon menu.


3. From `Tenant Settings,` select `Cluster Settings` and toggle the `Lock all clusters` button.This restricts all the clusters under that tenant scope from being upgraded from cluster management services upgrade on the upgrade of the Palette.


4. To unlock the clusters, toggle the `Lock all Clusters` back and deselect. 




