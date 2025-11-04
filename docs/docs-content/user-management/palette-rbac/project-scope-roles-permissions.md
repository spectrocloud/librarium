---
sidebar_label: "Project Roles"
title: "Project Roles"
description: "Learn about the predefined roles available in Palette for managing resources within a project scope."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["user-management", "project", "rbac"]
---

Palette provides the following Project roles out-of-the-box. These roles are predefined and cannot be modified. You can
assign these roles to users and teams to manage the resources within the project scope. The roles are categorized based
on the resources they can manage. If you need to manage resources across multiple projects, consider using a
[Tenant](./tenant-scope-roles-permissions.md) role instead.

:::tip

Create your own custom project role if none of the predefined roles meet your requirements. Refer to the
[Create a Custom Role](./create-custom-role.md#project-roles) guide for more information.

:::

## Default Project Roles

Palette comes with a set of immutable predefined Project roles out-of-the-box that you can assign to users or teams. To
review the permissions associated with each Project role, click on the role name to expand the list of permissions.

### App Deployment

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

### App Profile

| Role Name          | Description                                                                                            |
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

### Cloud Account

| Role Name            | Description                                           |
| -------------------- | ----------------------------------------------------- |
| Cloud Account Admin  | An administrative access to cloud account operations. |
| Cloud Account Editor | An editor access to cloud account operations.         |
| Cloud Account Viewer | A read-only role for cloud account operations.        |

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

### Cluster

| Role Name      | Description                                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster Admin  | A cluster admin in the Project scope has all the privileges related to the cluster operation.                                                                  |
| Cluster Editor | A cluster editor in the Project scope has the privileges to update, delete, get, and list cluster resources. This role is not privileged for cluster creation. |
| Cluster Viewer | A cluster viewer in Project scope is a read-only privilege to cluster operations.                                                                              |

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
- clusterPair.create
- clusterPair.delete
- clusterPair.get
- clusterPair.list
- clusterPair.update
- clusterProfile.get
- clusterProfile.list
- clusterTemplate.get
- clusterTemplate.list
- dnsMapping.create
- dnsMapping.delete
- dnsMapping.get
- dnsMapping.list
- dnsMapping.update
- edgehost.create
- edgehost.delete
- edgehost.get
- edgehost.list
- edgehost.sshUpdate
- edgehost.sshUserUpdate
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
- spcPolicy.get
- spcPolicy.list
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
- clusterPair.get
- clusterPair.list
- clusterPair.update
- clusterProfile.get
- clusterProfile.list
- clusterTemplate.get
- clusterTemplate.list
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
- spcPolicy.get
- spcPolicy.list
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
- clusterPair.get
- clusterPair.list
- clusterProfile.get
- clusterProfile.list
- clusterTemplate.get
- clusterTemplate.list
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
- spcPolicy.get
- spcPolicy.list
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

### Cluster Profile

| Role Name              | Description                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| Cluster Profile Admin  | Cluster Profile Admin role has admin privileges to all the cluster profile operations.         |
| Cluster Profile Editor | Cluster Profile Editor role has privileges to edit and list operations on the cluster profile. |
| Cluster Profile Viewer | Cluster Profile Viewer role has read-only privileges to cluster profiles.                      |

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

<br />

### Project

| Role Name      | Description                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Project Admin  | The Project Admin role is a closure of all the project operations. It is an administrative privilege for the project resources. |
| Project Editor | The Project Editor role can perform edit operations within a project, but the user is not able to create or delete a project.   |
| Project Viewer | The Project Viewer will be able to view all the resources within a project, but is not privileged to make modifications.        |

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
- clusterPair.create
- clusterPair.delete
- clusterPair.get
- clusterPair.list
- clusterPair.update
- clusterProfile.create
- clusterProfile.delete
- clusterProfile.get
- clusterProfile.list
- clusterProfile.publish
- clusterProfile.update
- clusterTemplate.create
- clusterTemplate.delete
- clusterTemplate.get
- clusterTemplate.list
- clusterTemplate.update
- dnsMapping.create
- dnsMapping.delete
- dnsMapping.get
- dnsMapping.list
- dnsMapping.update
- edgehost.create
- edgehost.delete
- edgehost.get
- edgehost.list
- edgehost.sshUpdate
- edgehost.sshUserUpdate
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
- spcPolicy.create
- spcPolicy.delete
- spcPolicy.get
- spcPolicy.list
- spcPolicy.update
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
<AccordionPanel title="Project Editor">

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
- clusterPair.get
- clusterPair.list
- clusterPair.update
- clusterProfile.get
- clusterProfile.list
- clusterProfile.publish
- clusterProfile.update
- clusterTemplate.get
- clusterTemplate.list
- clusterTemplate.update
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
- spcPolicy.get
- spcPolicy.list
- spcPolicy.update
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
- clusterPair.get
- clusterPair.list
- clusterProfile.get
- clusterProfile.list
- clusterTemplate.get
- clusterTemplate.list
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
- spcPolicy.get
- spcPolicy.list
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

### Project Cluster Group

| Role Name                    | Description                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Project Cluster Group Admin  | Provides administrative privilege to perform all the operations on the cluster group resources.            |
| Project Cluster Group Editor | Allows the user to perform edit operations on a cluster group but not to create or delete a cluster group. |
| Project Cluster Group Viewer | Allows the user to view all the cluster group resources but not to modify them.                            |

<Accordion>
<AccordionPanel title="Project Cluster Group Admin">

- cluster.get
- cluster.list
- clusterGroup.create
- clusterGroup.delete
- clusterGroup.get
- clusterGroup.list
- clusterGroup.update
- project.get
- project.list
- tag.update

</AccordionPanel>
<AccordionPanel title="Project Cluster Group Editor">

- cluster.get
- cluster.list
- clusterGroup.get
- clusterGroup.list
- clusterGroup.update
- project.get
- project.list
- tag.update

</AccordionPanel>
<AccordionPanel title="Project Cluster Group Viewer">

- cluster.get
- cluster.list
- clusterGroup.get
- clusterGroup.list
- project.get
- project.list

</AccordionPanel>
</Accordion>

### Virtual Cluster

| Role Name              | Description                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| Virtual Cluster Admin  | Provides administrative privilege to perform all virtual cluster operations on App resources.                  |
| Virtual Cluster Editor | Allows the user to perform edit operations on a virtual cluster but not to create or delete a virtual cluster. |
| Virtual Cluster Viewer | Allows the user to view all the virtual cluster resources but not to modify them.                              |

<Accordion>
<AccordionPanel title="Virtual Cluster Admin">

- clusterGroup.get
- clusterGroup.list
- location.get
- location.list
- macro.create
- macro.delete
- macro.get
- macro.list
- macro.update
- project.get
- project.list
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
<AccordionPanel title="Virtual Cluster Editor">

- clusterGroup.get
- clusterGroup.list
- location.get
- location.list
- macro.get
- macro.list
- macro.update
- project.get
- project.list
- tag.update
- virtualCloudconfig.get
- virtualCloudconfig.list
- virtualCloudconfig.update
- virtualCluster.get
- virtualCluster.list
- virtualCluster.update

</AccordionPanel>
<AccordionPanel title="Virtual Cluster Viewer">

- clusterGroup.get
- clusterGroup.list
- location.get
- location.list
- macro.get
- macro.list
- project.get
- project.list
- virtualCloudconfig.get
- virtualCloudconfig.list
- virtualCluster.get
- virtualCluster.list

</AccordionPanel>
</Accordion>

### Virtual Machine

| Role Name                  | Description                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| Virtual Machine Admin      | Provides administrative privilege to perform all the virtual machine operations.              |
| Virtual Machine Power User | Provides the user with the ability to most of the virtual machine operations.                 |
| Virtual Machine User       | Provides the user with the ability to perform non-destructive operations on virtual machines. |
| Virtual Machine Viewer     | Provides the user with the ability to view virtual machines.                                  |

<Accordion>
<AccordionPanel title="Virtual Machine Admin">

- project.get
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
<AccordionPanel title="Virtual Machine Power User">

- project.get
- virtualMachine.clone
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
<AccordionPanel title="Virtual Machine User">

- project.get
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
<AccordionPanel title="Virtual Machine Viewer">

- project.get
- virtualMachine.get
- virtualMachine.list

</AccordionPanel>
</Accordion>

### Workspace

| Role Name        | Description                                 |
| ---------------- | ------------------------------------------- |
| Workspace Admin  | Administrator role to workspace operations. |
| Workspace Editor | Editor role to workspace operations.        |

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

## Resources

- [Permissions](./permissions.md)
