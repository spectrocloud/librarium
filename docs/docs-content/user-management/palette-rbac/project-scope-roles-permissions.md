---
sidebar_label: "Project Scope Roles and Permissions"
title: "Project Roles"
description: "The list of Global Project Roles under Project Scope"
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["user-management", "rbac"]
---

<!-- prettier-ignore-start -->


The Global Project Scope holds a group of resources, in a logical grouping, to a specific project. Users and Teams with
specific Roles can be associated with the Project, Cluster, or Cluster Profile you create.

Palette has adopted the security principle of least privilege. Each user is assigned Roles and Permissions to the
Scopes, Resources, and Components. The Permissions format is `resourceKey.operation`, where **resourceKey** refers to a
resource or the API functionality, and _operation_ refers to the action or activity allowed.

To view a list of the predefined roles and permissions, go to **Tenant Settings** > **Roles**, and you will find the
list of **Global Roles**. If you need to extend your permissions, use the **Create Role** option.

Below is the predefined list of Roles and Permissions for the Global Project Scope:

## App Deployment


| Role Name             | Description                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------- |
| App Deployment Admin  | Provides administrative privilege to perform all the App operations on App resources.    |
| App Deployment Editor | Allows the user to perform edit operations on an App but not to create or delete an App. |
| App Deployment Viewer | Allows the user to view all the App resources but not to make modifications.             |

<Accordion>
<AccordionPanel title="App Deployment Admin">
- appDeployment.create
- appDeployment.delete
- appDeployment.get
- appDeployment.list
- appDeployment.update
- appProfile.get
- appProfile.list
- cloudaccount.get
- cloudaccount.list
- clusterGroup.get
- clusterGroup.list
- location.create
- location.delete
- location.get
- location.list
- location.update
- machine.get
- machine.list
- macro.create
- macro.delete
- macro.get
- macro.list
- macro.update
- packRegistry.get
- packRegistry.list
- project.get
- project.list
- sshKey.create
- sshKey.delete
- sshKey.get
- sshKey.list
- sshKey.update
- tag.update
- virtualCloudconfig.create
- virtualCloudconfig.delete
- virtualCloudconfig.get
- virtualCloudconfig.list
- virtualCloudconfig.update
- virtualCluster.create
- virtualCluster.delete
- virtualCluster.get
- virtualCluster.list
- virtualCluster.update
</AccordionPanel>
<AccordionPanel title="App Deployment Editor">
- appDeployment.get
- appDeployment.list
- appDeployment.update
- appProfile.get
- appProfile.list
- cloudaccount.get
- cloudaccount.list
- clusterGroup.get
- clusterGroup.list
- location.get
- location.list
- location.update
- machine.get
- machine.list
- macro.get
- macro.list
- macro.update
- packRegistry.get
- packRegistry.list
- project.get
- project.list
- sshKey.get
- sshKey.list
- sshKey.update
- tag.update
- virtualCloudconfig.get
- virtualCloudconfig.list
- virtualCloudconfig.update
- virtualCluster.get
- virtualCluster.list
- virtualCluster.update
</AccordionPanel>
<AccordionPanel title="App Deployment Viewer">
- appDeployment.get
- appDeployment.list
- appProfile.get
- appProfile.list
- cloudaccount.get
- cloudaccount.list
- clusterGroup.get
- clusterGroup.list
- location.get
- location.list
- machine.get
- machine.list
- macro.get
- macro.list
- packRegistry.get
- packRegistry.list
- project.get
- project.list
- sshKey.get
- sshKey.list
- virtualCloudconfig.get
- virtualCloudconfig.list
- virtualCluster.get
- virtualCluster.list
</AccordionPanel>
</Accordion>

## App Profile



| Role Names         | Description                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| App Profile Admin  | Provides administrative privilege to perform all the App operations on App profile resources.          |
| App Profile Editor | Allows the user to perform edit operations on App profiles but not to create or delete an App profile. |
| App Profile Viewer | Allows the user to view all the App profile resources but not to modify them.                          |

<Accordion>
<AccordionPanel title=" App Profile Admin">
- appProfile.create
- appProfile.delete
- appProfile.get
- appProfile.list
- appProfile.update
- macro.create
- macro.delete
- macro.get
- macro.list
- macro.update
- packRegistry.get
- packRegistry.list
- project.get
- project.list
</AccordionPanel>
<AccordionPanel title=" App Profile Editor">
- appProfile.get
- appProfile.list
- appProfile.update
- macro.get
- macro.list
- macro.update
- packRegistry.get
- packRegistry.list
- project.get
- project.list
</AccordionPanel>
<AccordionPanel title=" App Profile Viewer">
- appProfile.get
- appProfile.list
- macro.get
- macro.list
- packRegistry.get
- packRegistry.list
- project.get
- project.list
</AccordionPanel>
</Accordion>

## Project


| Role Names     | Description                                                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Project Admin  | The Project Admin role is a closure of all the project operations. It is a administrative privilege for the project resources |
| Project Editor | The Project Editor role can perform edit operations within a project, but the user is not able to create or delete a project  |
| Project Viewer | The Project Viewer will be able to view all the resources within a project, but not privileged to make modifications          |

<Accordion>
    <AccordionPanel title="Project Admin">
    - appDeployment.create
    - appDeployment.delete
    - appDeployment.get
    - appDeployment.list
    - appDeployment.update
    - appProfile.create
    - appProfile.delete
    - appProfile.get
    - appProfile.list
    - appProfile.update
    - audit.get
    - audit.list
    - cloudaccount.create
    - cloudaccount.delete
    - cloudaccount.get
    - cloudaccount.list
    - cloudaccount.update
    - cloudconfig.create
    - cloudconfig.delete
    - cloudconfig.get
    - cloudconfig.list
    - cloudconfig.update
    - cluster.create
    - cluster.delete
    - cluster.get
    - cluster.import
    - cluster.list
    - cluster.update
    - clusterGroup.create
    - clusterGroup.delete
    - clusterGroup.get
    - clusterGroup.list
    - clusterGroup.update
    - clusterProfile.create
    - clusterProfile.delete
    - clusterProfile.get
    - clusterProfile.list
    - clusterProfile.publish
    - clusterProfile.update
    - dnsMapping.create
    - dnsMapping.delete
    - dnsMapping.get
    - dnsMapping.list
    - dnsMapping.update
    - edgehost.create
    - edgehost.delete
    - edgehost.get
    - edgehost.list
    - edgehost.update
    - location.create
    - location.delete
    - location.get
    - location.list
    - location.update
    - machine.create
    - machine.delete
    - machine.get
    - machine.list
    - machine.update
    - macro.create
    - macro.delete
    - macro.get
    - macro.list
    - macro.update
    - packRegistry.get
    - packRegistry.list
    - privateGateway.create
    - privateGateway.delete
    - privateGateway.get
    - privateGateway.list
    - privateGateway.update
    - project.get
    - project.list
    - project.update
    - sshKey.create
    - sshKey.delete
    - sshKey.get
    - sshKey.list
    - sshKey.update
    - tag.update
    - virtualCloudconfig.create
    - virtualCloudconfig.delete
    - virtualCloudconfig.get
    - virtualCloudconfig.list
    - virtualCloudconfig.update
    - virtualCluster.create
    - virtualCluster.delete
    - virtualCluster.get
    - virtualCluster.list
    - virtualCluster.update
    - virtualMachine.clone
    - virtualMachine.create
    - virtualMachine.delete
    - virtualMachine.get
    - virtualMachine.list
    - virtualMachine.migrate
    - virtualMachine.pause
    - virtualMachine.restart
    - virtualMachine.resume
    - virtualMachine.snapshotCreate
    - virtualMachine.snapshotDelete
    - virtualMachine.snapshotGet
    - virtualMachine.snapshotList
    - virtualMachine.snapshotUpdate
    - virtualMachine.start
    - virtualMachine.stop
    - virtualMachine.update
    - workspace.backup
    - workspace.create
    - workspace.delete
    - workspace.get
    - workspace.list
    - workspace.restore
    - workspace.update
    </AccordionPanel>
    <AccordionPanel title="Project Editior">
    - appDeployment.get
    - appDeployment.list
    - appDeployment.update
    - appProfile.get
    - appProfile.list
    - appProfile.update
    - audit.get
    - audit.list
    - cloudaccount.get
    - cloudaccount.list
    - cloudaccount.update
    - cloudconfig.create
    - cloudconfig.get
    - cloudconfig.list
    - cloudconfig.update
    - cluster.get
    - cluster.list
    - cluster.update
    - clusterGroup.get
    - clusterGroup.list
    - clusterGroup.update
    - clusterProfile.get
    - clusterProfile.list
    - clusterProfile.publish
    - clusterProfile.update
    - dnsMapping.get
    - dnsMapping.list
    - dnsMapping.update
    - edgehost.get
    - edgehost.list
    - edgehost.update
    - location.get
    - location.list
    - location.update
    - machine.delete
    - machine.get
    - machine.list
    - machine.update
    - macro.get
    - macro.list
    - macro.update
    - packRegistry.get
    - packRegistry.list
    - privateGateway.get
    - privateGateway.list
    - privateGateway.update
    - project.get
    - project.list
    - project.update
    - sshKey.get
    - sshKey.list
    - sshKey.update
    - tag.update
    - virtualCloudconfig.get
    - virtualCloudconfig.list
    - virtualCloudconfig.update
    - virtualCluster.get
    - virtualCluster.list
    - virtualCluster.update
    - virtualMachine.get
    - virtualMachine.list
    - virtualMachine.pause
    - virtualMachine.restart
    - virtualMachine.resume
    - virtualMachine.snapshotCreate
    - virtualMachine.snapshotDelete
    - virtualMachine.snapshotGet
    - virtualMachine.snapshotList
    - virtualMachine.snapshotUpdate
    - virtualMachine.start
    - virtualMachine.stop
    - virtualMachine.update
    - workspace.backup
    - workspace.get
    - workspace.list
    - workspace.restore
    - workspace.update
    </AccordionPanel>
    <AccordionPanel title="Project Viewer">
    - appDeployment.get
    - appDeployment.list
    - appProfile.get
    - appProfile.list
    - audit.get
    - audit.list
    - cloudaccount.get
    - cloudaccount.list
    - cloudconfig.get
    - cloudconfig.list
    - cluster.get
    - cluster.list
    - clusterGroup.get
    - clusterGroup.list
    - clusterProfile.get
    - clusterProfile.list
    - dnsMapping.get
    - dnsMapping.list
    - edgehost.get
    - edgehost.list
    - location.get
    - location.list
    - machine.get
    - machine.list
    - macro.get
    - macro.list
    - packRegistry.get
    - packRegistry.list
    - privateGateway.get
    - privateGateway.list
    - project.get
    - project.list
    - sshKey.get
    - sshKey.list
    - virtualCloudconfig.get
    - virtualCloudconfig.list
    - virtualCluster.get
    - virtualCluster.list
    - workspace.get
    - workspace.list
    </AccordionPanel>
</Accordion>

## Cluster Profile



The user with these permissions can manage the Cluster Profiles within a project.

| Role Names             | Description                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| Cluster Profile Admin  | Cluster Profile Admin role has admin privileges to all the cluster profile operations         |
| Cluster Profile Editor | Cluster Profile Editor role has privileges to edit and list operations on the cluster profile |
| Cluster Profile Viewer | Cluster Profile Viewer role has read-only privileges to cluster profiles                      |



<Accordion>
<AccordionPanel title="Cluster Profile Admin">
- clusterProfile.create
- clusterProfile.delete
- clusterProfile.get
- clusterProfile.list
- clusterProfile.publish
- clusterProfile.update
- macro.create
- macro.delete
- macro.get
- macro.list
- macro.update
- packRegistry.get
- packRegistry.list
- project.get
- project.list
- tag.update
</AccordionPanel>
<AccordionPanel title="Cluster Profile Editor">
- clusterProfile.get
- clusterProfile.list
- clusterProfile.publish
- clusterProfile.update
- macro.get
- macro.list
- macro.update
- packRegistry.get
- packRegistry.list
- project.get
- project.list
- tag.update
</AccordionPanel>
<AccordionPanel title="Cluster Profile Viewer">
- clusterProfile.get
- clusterProfile.list
- macro.get
- macro.list
- packRegistry.get
- packRegistry.list
- project.get
- project.list
</AccordionPanel>
</Accordion>


## Cluster



| Role Names     | Description                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster Admin  | A cluster admin in Project scope has all the privileges related to cluster operation                                                                    |
| Cluster Editor | A cluster editor in Project scope has the privileges to update, delete,get and list cluster resources. This role is not privileged for cluster creation |
| Cluster Viewer | A cluster viewer in Project scope is a read-only privilege to cluster operations                                                                        |



<Accordion>
<AccordionPanel title="Cluster Admin">
- cloudaccount.get
- cloudaccount.list
- cloudconfig.create
- cloudconfig.delete
- cloudconfig.get
- cloudconfig.list
- cloudconfig.update
- cluster.create
- cluster.delete
- cluster.get
- cluster.import
- cluster.list
- cluster.update
- clusterGroup.get
- clusterGroup.list
- clusterProfile.get
- clusterProfile.list
- dnsMapping.create
- dnsMapping.delete
- dnsMapping.get
- dnsMapping.list
- dnsMapping.update
- edgehost.create
- edgehost.delete
- edgehost.get
- edgehost.list
- edgehost.update
- location.create
- location.delete
- location.get
- location.list
- location.update
- machine.create
- machine.delete
- machine.get
- machine.list
- machine.update
- macro.create
- macro.delete
- macro.get
- macro.list
- macro.update
- packRegistry.get
- packRegistry.list
- privateGateway.get
- privateGateway.list
- project.get
- project.list
- sshKey.create
- sshKey.delete
- sshKey.get
- sshKey.list
- sshKey.update
- tag.update
- virtualCloudconfig.create
- virtualCloudconfig.delete
- virtualCloudconfig.get
- virtualCloudconfig.list
- virtualCloudconfig.update
- virtualCluster.create
- virtualCluster.delete
- virtualCluster.get
- virtualCluster.list
- virtualCluster.update
- virtualMachine.clone
- virtualMachine.create
- virtualMachine.delete
- virtualMachine.get
- virtualMachine.list
- virtualMachine.migrate
- virtualMachine.pause
- virtualMachine.restart
- virtualMachine.resume
- virtualMachine.snapshotCreate
- virtualMachine.snapshotDelete
- virtualMachine.snapshotGet
- virtualMachine.snapshotList
- virtualMachine.snapshotUpdate
- virtualMachine.start
- virtualMachine.stop
- virtualMachine.update
</AccordionPanel>
<AccordionPanel title="Cluster Editor">
- cloudaccount.get
- cloudaccount.list
- cloudconfig.get
- cloudconfig.list
- cloudconfig.update
- cluster.get
- cluster.list
- cluster.update
- clusterGroup.get
- clusterGroup.list
- clusterProfile.get
- clusterProfile.list
- dnsMapping.get
- dnsMapping.list
- dnsMapping.update
- edgehost.get
- edgehost.list
- edgehost.update
- location.get
- location.list
- location.update
- machine.delete
- machine.get
- machine.list
- machine.update
- macro.get
- macro.list
- macro.update
- packRegistry.get
- packRegistry.list
- privateGateway.get
- privateGateway.list
- project.get
- project.list
- sshKey.get
- sshKey.list
- sshKey.update
- tag.update
- virtualCloudconfig.get
- virtualCloudconfig.list
- virtualCloudconfig.update
- virtualCluster.get
- virtualCluster.list
- virtualCluster.update
- virtualMachine.get
- virtualMachine.list
- virtualMachine.pause
- virtualMachine.restart
- virtualMachine.resume
- virtualMachine.snapshotCreate
- virtualMachine.snapshotDelete
- virtualMachine.snapshotGet
- virtualMachine.snapshotList
- virtualMachine.snapshotUpdate
- virtualMachine.start
- virtualMachine.stop
- virtualMachine.update
</AccordionPanel>
<AccordionPanel title="Cluster Viewer">
- cloudaccount.get
- cloudaccount.list
- cloudconfig.get
- cloudconfig.list
- cluster.get
- cluster.list
- clusterGroup.get
- clusterGroup.list
- clusterProfile.get
- clusterProfile.list
- dnsMapping.get
- dnsMapping.list
- edgehost.get
- edgehost.list
- location.get
- location.list
- machine.get
- machine.list
- macro.get
- macro.list
- packRegistry.get
- packRegistry.list
- privateGateway.get
- privateGateway.list
- project.get
- project.list
- sshKey.get
- sshKey.list
- virtualCloudconfig.get
- virtualCloudconfig.list
- virtualCluster.get
- virtualCluster.list
- virtualMachine.get
- virtualMachine.list
</AccordionPanel>
</Accordion>




## Cloud Account




| Role Names             | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| Cluster Account Admin  | An administrative access to cloud account operations |
| Cluster Account Editor | An editor access to cloud cloud account operations   |
| Cluster Account Viewer | A read-only role for cloud account operations        |


<Accordion>
<AccordionPanel title="Cluster Account Admin">
- cloudaccount.create
- cloudaccount.delete
- cloudaccount.get
- cloudaccount.list
- cloudaccount.update
- project.get
- project.list
</AccordionPanel>
<AccordionPanel title="Cluster Account Editor">
- cloudaccount.get
- cloudaccount.list
- cloudaccount.update
- project.get
- project.list
</AccordionPanel>
<AccordionPanel title="Cluster Account Viewer">
- cloudaccount.get
- cloudaccount.list
- project.get
- project.list
</AccordionPanel>
</Accordion>


## Workspace



| Role Names       | Description                                |
| ---------------- | ------------------------------------------ |
| Workspace Admin  | Administrator role to workspace operations |
| Workspace Editor | Editor role to workspace operations        |



<Accordion>
<AccordionPanel title="Workspace Admin">
- cluster.list
- location.list
- project.get
- project.list
- tag.update
- workspace.backup
- workspace.create
- workspace.delete
- workspace.get
- workspace.list
- workspace.restore
- workspace.update
</AccordionPanel>
<AccordionPanel title="Workspace Operator">
- cluster.list
- location.list
- project.get
- project.list
- workspace.backup
- workspace.get
- workspace.list
- workspace.restore
</AccordionPanel>
</Accordion>




## Virtual Cluster



| Role Names             | Description                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| Virtual Cluster Admin  | Provides administrative privilege to perform all virtual cluster operations on App resources.                  |
| Virtual Cluster Editor | Allows the user to perform edit operations on a virtual cluster but not to create or delete a virtual cluster. |
| Virtual Cluster Viewer | Allows the user to view all the virtual cluster resources but not to modify them.                              |



### Virtual Cluster Admin

|                        | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------------------- | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **clusterGroup**       |            |            | ✅      | ✅       |            |            |             |            |             |
| **location**           |            |            | ✅      | ✅       |            |            |             |            |             |
| **macro**              | ✅         | ✅         | ✅      | ✅       | ✅         |            |             |            |             |
| **project**            |            |            | ✅      | ✅       |            |            |             |            |             |
| **tag**                |            |            |         |          | ✅         |            |             |            |             |
| **virtualCloudconfig** | ✅         | ✅         | ✅      | ✅       | ✅         |            |             |            |             |
| **virtualCluster**     | ✅         | ✅         | ✅      | ✅       | ✅         |            |             |            |             |



### Virtual Cluster Editor

|                        | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------------------- | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **clusterGroup**       |            |            | ✅      | ✅       |            |            |             |            |             |
| **location**           |            |            | ✅      | ✅       |            |            |             |            |             |
| **macro**              |            |            | ✅      | ✅       | ✅         |            |             |            |             |
| **project**            |            |            | ✅      | ✅       |            |            |             |            |             |
| **tag**                |            |            |         |          | ✅         |            |             |            |             |
| **virtualCloudconfig** |            |            | ✅      | ✅       | ✅         |            |             |            |             |
| **virtualCluster**     |            |            | ✅      | ✅       | ✅         |            |             |            |             |



### Virtual Cluster Viewer

|                        | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------------------- | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **clusterGroup**       |            |            | ✅      | ✅       |            |            |             |            |             |
| **location**           |            |            | ✅      | ✅       |            |            |             |            |             |
| **macro**              |            |            | ✅      | ✅       |            |            |             |            |             |
| **project**            |            |            | ✅      | ✅       |            |            |             |            |             |
| **virtualCloudconfig** |            |            | ✅      | ✅       |            |            |             |            |             |
| **virtualCluster**     |            |            | ✅      | ✅       |            |            |             |            |             |



<!-- prettier-ignore-end -->
