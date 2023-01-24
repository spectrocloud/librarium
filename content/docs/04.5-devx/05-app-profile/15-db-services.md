---
title: "Database Services"
metaTitle: "Palette Dev Engine Database Services"
metaDescription: "Explore Palette Dev Engine Database Services"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

Palette Dev Engine facilitates database service setup, operation, and scaling without installing physical hardware, software, or performance configurations. Instead, all the administrative and maintenance tasks are taken care of by Palette so that you can use and access the database quickly. Palette also offers control preferences based on the database service provider offerings and your preferences.

Palette Dev Engine supports the following database services:

* MongoDB


* MySQL


* PostgreSQL


* Redis

## DB Deployment 

Palette leverages several Kubernetes built-in workload resources such as Deployment, ReplicaSet, DaemondSet, StatefulSet, etc. 

To take advantage of the persistence of the data storage, Palette deploys DB services as [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/).StatefulSet lets you run one or more related Pods that do track state. The DB Service workload records data persistently; therefore, Palette runs a StatefulSet that matches each Pod with a [PersistentVolume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/). The DB service running in the Pods for that StatefulSet can replicate data to other Pods in the same StatefulSet to improve the overall resilience of the service.


## Storage

Allocate storage(GiB) to the database service based on the available storage within the Virtual Cluster for App deployment. 

## Version Update

You can make changes to the app profile services, such as version updates, manifest updates, app tier additions, and removals. [App Profile Service update](/devx/app-profile/versioning-app-profile#updateanappprofile)
will generate an update notification on all the apps created from the app profile. Update notifications include all the changes applied to the profile since the initial creation or the previous update. You can apply the update to the Apps individually at any time.

## Output Variables

Each Database service has a set of output variables. These output variables are used to establish Database connectivity with other service layers of the app profile.

**Note:** The DB service connectivity follows a fixed hierarchy in Palette. The DB connectivity is established for higher-level services using the output variable. Higher-level refers to the service added to the app profile after adding the DB service. 



<br />

