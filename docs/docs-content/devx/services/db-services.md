---
sidebar_label: "Databases"
title: "Databases"
description: "Explore Palette Dev Engine Database Services"
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["devx", "app mode", "pde"]
---

Palette Dev Engine facilitates database service setup, operation, and scaling without installing physical hardware,
software, or performance configurations. Instead, Palette takes care of all the administrative and maintenance tasks so
that you can use and access the database quickly.

For a list of all the supported databases, refer to the [Available Services](service-listings/service-listings.mdx)
resource and select the **Database** filter.

## Database Deployment

Palette leverages several Kubernetes built-in workload resources such as Deployment, ReplicaSet, DaemondSet,
StatefulSet, etc. To take advantage of the persistence of the data storage, Palette deploys database services as
[StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/).

StatefulSet lets you run one or more related pods that track the state. The database service workload records data
persistently through a StatefulSet that matches each pod with a
[PersistentVolume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/). The database service running in the
pods that belong to the StatefulSet can replicate data to other pods in the same StatefulSet to improve the overall
resilience of the service.

## Storage

You must allocate storage to the database service based on the available storage within the Virtual Cluster.

:::warning

By default, cluster groups are configured not to back up the disk storage. This default behavior affects database
services because a backup would not include the storage disk. To learn more, refer to
[Enable Disk Backup on Virtual Clusters](../../clusters/cluster-groups/cluster-group-backups.md).

:::

## Version Update

You can make changes to the app profile services, such as version updates, manifest updates, app service additions, and
removals. [App Profile Service update](../../profiles/app-profiles/modify-app-profiles/version-app-profile.md) will
generate an update notification on all the apps created from the app profile. Update notifications include all the
changes applied to the profile since the initial creation or the previous update. You can apply the update to the apps
individually at any time.

## Output Variables

Each database service has a set of exposed output variables. These output variables can be used to establish service
connectivity with other service layers of the app profile by consuming the information.

The following code snippet is an example of the output variables exposed by the MongoDB service. Check out the
[service listings](service-listings/service-listings.mdx) page to learn more about each service.

<br />

```hideClipboard
env:
   - name: USER_NAME
     value: "{{.spectro.app.$appDeploymentName.mongodb-1.USERNAME}}"
   - name: PASSWORD
     value: "{{.spectro.app.$appDeploymentName.mongodb-1.PASSWORD}}"
   - name: MONGO_URI
     value: "{{.spectro.app.$appDeploymentName.mongodb-1.MONGO_URI}}"
   - name: MONGO_URI_SRV
     value: "{{.spectro.app.$appDeploymentName.mongodb-1.MONGO_URI_SRV}}"
```

<br />

:::info

The service connectivity follows a fixed hierarchy in Palette. The connectivity is established for higher-level services
using the output variable. Higher-level refers to the service added to the app profile after adding the database
service.

:::

<br />

## Connect to a DB Service

Applications and clients can connect to a Palette database service by using the information exposed in the output
variables. Check out the [Service Connectivity](connectivity.md) documentation to learn more about connecting to a
database service.
