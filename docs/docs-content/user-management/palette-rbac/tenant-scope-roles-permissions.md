---
sidebar_label: "Tenant Roles"
title: "Tenant Roles"
description: "Learn about the predefined roles and permissions for the Tenant scope in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["user-management", "tenant", "rbac"]
---

Palette provides the following Tenant roles out-of-the-box. These roles are predefined and cannot be modified. You can
assign these roles to users and teams. The roles are categorized based on the resources they can manage. Each of these
roles is scoped at the tenant level. This means the permissions granted to a user or team span across all projects. If
you need to narrow the scope down to a single project or a handful of projects, consider using a
[Project](./project-scope-roles-permissions.md) role instead.

:::tip

Create your own custom tenant role if none of the predefined roles meet your requirements. Refer to the
[Create a Custom Role](./create-custom-role.md#tenant-roles) guide for more information.

:::

## Default Tenant Roles

Palette comes with a set of immutable predefined Tenant roles out-of-the-box that you can assign to users or teams. To
review the permissions associated with each Tenant role, click on the role name to expand the list of permissions.

### Admin

| Role Name     | Description                                               |
| ------------- | --------------------------------------------------------- |
| Tenant Admin  | Grants access to all resources in all projects.           |
| Tenant Viewer | Provides a read only access to all the project resources. |

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
- edgeToken.create
- edgeToken.delete
- edgeToken.get
- edgeToken.list
- edgeToken.update
- edgehost.create
- edgehost.delete
- edgehost.get
- edgehost.list
- edgehost.sshUpdate
- edgehost.sshUserUpdate
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
- clusterPair.get
- clusterPair.list
- clusterProfile.get
- clusterProfile.list
- clusterTemplate.get
- clusterTemplate.list
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
- spcPolicy.get
- spcPolicy.list
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

### Cluster Group

| Role Name                   | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| Tenant Cluster Group Admin  | Allows the user to create and manage cluster groups in all projects.        |
| Tenant Cluster Group Editor | Allows the user to view, access, and update cluster groups in all projects. |
| Tenant Cluster Group Viewer | Grants read-only access to cluster groups in all projects.                  |

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

### Cluster Profile

| Role Name                    | Description                                                            |
| ---------------------------- | ---------------------------------------------------------------------- |
| Tenant Cluster Profile Admin | Allows the user to create and manage cluster profiles in all projects. |

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

### Project

| Role Name            | Description                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Tenant Project Admin | Grants the user complete access to all the project resources. Unlike the Tenant Admin role, this role cannot create projects, users, and teams. |

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
- edgeToken.create
- edgeToken.delete
- edgeToken.get
- edgeToken.list
- edgeToken.update
- edgehost.create
- edgehost.delete
- edgehost.get
- edgehost.list
- edgehost.sshUpdate
- edgehost.sshUserUpdate
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
</Accordion>

### Role

| Role Name         | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| Tenant Role Admin | This role allows the user to create, update, and delete roles. |

<Accordion>
<AccordionPanel title="Tenant Role Admin">

- role.create
- role.delete
- role.get
- role.list
- role.update

</AccordionPanel>
</Accordion>

### Team

| Role Name         | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| Tenant Team Admin | This role grants the user complete access to all the team resources. |

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

### User

| Role Name              | Description                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| Tenant User Admin Role | This role grants the user complete access to all user operations. |

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

## Resources

- [Permissions](./permissions.md)
