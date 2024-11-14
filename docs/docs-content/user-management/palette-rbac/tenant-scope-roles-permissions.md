---
sidebar_label: "Tenant Roles"
title: "Tenant Roles"
description: "Learn about the predefined roles and permissions for the Tenant scope in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["user-management", "teanant", "rbac"]
---

<!-- prettier-ignore-start -->


Palette provides the following tenant roles out-of-the-box. These roles are predefined and cannot be modified. You can assign these roles to users and teams. The roles are categorized based on the resources they can manage. Each of these roles is scoped at the tenant level. This means the permissions granted to a user or team span across all projects. If you need to narrow the scope down to a single project or a handful of projects, consider using a [Project](./project-scope-roles-permissions.md) role instead.

:::tip

Create your own custom tenant role if none of the predefined roles meet your requirements. You can create a custom role by combining the required permissions from the various resources;. Refer to the [Resource Scope Matrix](./palette-rbac.md#resource-scope-matrix) for the list of permissions available for each resource.

:::

To review the permissions associated with each role, click on the role name to expand the list of permissions.

## Admin


| Role Names           | Description                                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Tenant Admin         | Allows the user to create projects and manage projects within the tenant, covered under all operations related to projects |
| Tenant Viewer        | Provides a read only access to all the project resources                                                                   |


<Accordion>
<AccordionPanel title="Tenant Admin">
- apiKey.create
- apiKey.delete
- apiKey.get
- apiKey.list
- apiKey.update
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
- edgeToken.create
- edgeToken.delete
- edgeToken.get
- edgeToken.list
- edgeToken.update
- edgehost.create
- edgehost.delete
- edgehost.get
- edgehost.list
- edgehost.update
- filter.create
- filter.delete
- filter.get
- filter.list
- filter.update
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
- packRegistry.create
- packRegistry.delete
- packRegistry.get
- packRegistry.list
- packRegistry.update
- privateGateway.create
- privateGateway.delete
- privateGateway.get
- privateGateway.list
- privateGateway.update
- project.create
- project.delete
- project.get
- project.list
- project.update
- role.create
- role.delete
- role.get
- role.list
- role.update
- sshKey.create
- sshKey.delete
- sshKey.get
- sshKey.list
- sshKey.update
- tag.update
- team.create
- team.delete
- team.get
- team.list
- team.update
- user.create
- user.delete
- user.get
- user.list
- user.update
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
<AccordionPanel title="Tenant Viewer">
- apiKey.get
- apiKey.list
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
- edgeToken.get
- edgeToken.list
- edgehost.get
- edgehost.list
- filter.get
- filter.list
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
- role.get
- role.list
- sshKey.get
- sshKey.list
- team.get
- team.list
- user.get
- user.list
- virtualCloudconfig.get
- virtualCloudconfig.list
- virtualCluster.get
- virtualCluster.list
- virtualMachine.get
- virtualMachine.list
- workspace.get
- workspace.list
</AccordionPanel>
</Accordion>


## Cluster Group



| Role Names                   | Description                                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Tenant Cluster Group Admin  | Allows the user to create and manage cluster groups within the tenant, covered under all operations related to cluster groups |
| Tenant Cluster Group Editor | The role can perform edit operations related to a cluster group, but the user is not able to create or delete a cluster group |
| Tenant Cluster Group Viewer | Provides a read only access to all the cluster group resources                                                                |

<Accordion>
<AccordionPanel title="Tenant Cluster Group Admin">
- cluster.get
- cluster.list
- clusterGroup.create
- clusterGroup.delete
- clusterGroup.get
- clusterGroup.list
- clusterGroup.update
- tag.update
</AccordionPanel>
<AccordionPanel title="Tenant Cluster Group Editor">
- cluster.get
- cluster.list
- clusterGroup.get
- clusterGroup.list
- clusterGroup.update
- tag.update
</AccordionPanel>
<AccordionPanel title="Tenant Cluster Group Viewer">
- cluster.get
- cluster.list
- clusterGroup.get
- clusterGroup.list
</AccordionPanel>
</Accordion>


## Cluster Profile


<Accordion>
<AccordionPanel title="Tenant Cluster Profile Admin">
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
- tag.update
</AccordionPanel>
</Accordion>


## Project

| Role Names                   | Description                                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Tenant Project Admin | The role with complete access to an existing project                                                                       |


<Accordion>
<AccordionPanel title="Tenant Project Admin">
- apiKey.get
- apiKey.list
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
- edgeToken.create
- edgeToken.delete
- edgeToken.get
- edgeToken.list
- edgeToken.update
- edgehost.create
- edgehost.delete
- edgehost.get
- edgehost.list
- edgehost.update
- filter.create
- filter.delete
- filter.get
- filter.list
- filter.update
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
- packRegistry.create
- packRegistry.delete
- packRegistry.get
- packRegistry.list
- packRegistry.update
- privateGateway.create
- privateGateway.delete
- privateGateway.get
- privateGateway.list
- privateGateway.update
- project.create
- project.delete
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
</Accordion>


## Role

| Role Names        | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| Tenant Role Admin | A role which has complete access to all the role permissions. |



<Accordion>
<AccordionPanel title="Tenant Role Admin">
- role.create
- role.delete
- role.get
- role.list
- role.update
</AccordionPanel>
</Accordion>






## Team



| Role Names        | Description                                                           |
| ----------------- | --------------------------------------------------------------------- |
| Tenant Team Admin | A role that has complete access to all the team related operations. |


<Accordion>
<AccordionPanel title="Tenant Team Admin">
- apiKey.get
- apiKey.list
- audit.get
- audit.list
- team.create
- team.delete
- team.get
- team.list
- team.update
- user.get
- user.list
</AccordionPanel>
</Accordion>






## User 



| Role Names             | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| Tenant User Admin Role | A role that has complete access to all the user related operations. |


<Accordion>
<AccordionPanel title="Tenant User Admin">
- apiKey.create
- apiKey.delete
- apiKey.get
- apiKey.list
- apiKey.update
- audit.get
- audit.list
- user.create
- user.delete
- user.get
- user.list
- user.update
</AccordionPanel>
</Accordion>


<!-- prettier-ignore-end -->
