---
sidebar_label: "Permissions"
title: "Permissions"
description: "Review the available permissions in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 25
tags: ["user-management", "permissions", "rbac"]
---

All actions in Palette are controlled by permissions. Permissions are assigned to roles, and roles are assigned to users
or teams. Each Palette component has a corresponding _resource key_ and a set of operations that can be performed on
that component.

Palette components are managed at different scopes. The available scopes are Tenant and Project. The Tenant scope is
global and applies to all projects within the tenant. The Project scope is specific to a project.

## Components and Resource Keys

The following table lists the available Palette components, their corresponding resource keys, and the applicable Role
scopes you can assign permissions to.

| Component            | Resource Key         | Tenant Role Scope | Project Role Scope | Resource Role Scope | Description                                                                |
| -------------------- | -------------------- | ----------------- | ------------------ | ------------------- | -------------------------------------------------------------------------- |
| API Key              | `apiKey`             | ✅                |                    |                     | API Key related operations                                                 |
| Audit                | `audit`              | ✅                |                    |                     | Audit log access                                                           |
| App Deployment       | `appDeployment`      | ✅                | ✅                 |                     | Application deployment and management in the context of Palette Dev Engine |
| App Profile          | `appProfile`         |                   | ✅                 |                     | Management of Application profiles                                         |
| Cloud Account        | `cloudaccount`       | ✅                | ✅                 | ✅                  | Cloud account creation and management                                      |
| Cloud Config         | `cloudconfig`        | ✅                | ✅                 | ✅                  | Cluster level cloud configuration                                          |
| Cluster              | `cluster`            | ✅                | ✅                 | ✅                  | Creation and management of Palette workload clusters                       |
| Cluster Group        | `clusterGroup`       | ✅                | ✅                 |                     | Creation and management of cluster groups                                  |
| Cluster Profile      | `clusterProfile`     | ✅                | ✅                 | ✅                  | Creation and management of Palette cluster profiles                        |
| DNS Mapping          | `dnsMapping`         |                   | ✅                 | ✅                  | Domain Name Server mapping services creation and management                |
| Edge Host            | `edgehost`           | ✅                | ✅                 |                     | Edge host deployment and management                                        |
| Edge Host Token      | `edgeToken`          | ✅                |                    |                     | Edge host registration token management                                    |
| Filter               | `filter`             | ✅                |                    |                     | Creation and management of resource filters                                |
| Location             | `location`           | ✅                | ✅                 | ✅                  | Location services related to backup and restore                            |
| Macro                | `macro`              | ✅                | ✅                 | ✅                  | Key value management for Palette resources                                 |
| Machine              | `machine`            | ✅                | ✅                 | ✅                  | Palette node pool management                                               |
| Private Gateway      | `privateGateway`     | ✅                |                    |                     | Private Cloud Gateway creation and maintenance                             |
| Registry             | `packRegistry`       | ✅                | ✅                 | ✅                  | Creation and management of registries                                      |
| Role                 | `role`               | ✅                |                    |                     | Creation and management of Palette roles                                   |
| Project              | `project`            | ✅                | ✅                 |                     | Creation and management of Palette projects                                |
| Tag                  | `tag`                | ✅                | ✅                 |                     | Creation and management of tags                                            |
| Team                 | `team`               | ✅                |                    |                     | Creation and management of user teams                                      |
| User                 | `user`               | ✅                |                    |                     | Creation and management of users                                           |
| Virtual Cloud Config | `virtualCloudConfig` |                   | ✅                 |                     | Allows the user to deploy and manage applications in virtual clusters      |
| Virtual Cluster      | `virtualCluster`     |                   | ✅                 |                     | Creation and management of virtual clusters                                |
| Virtual Machine      | `virtualMachine`     |                   | ✅                 |                     | Creation and management of virtual machines                                |
| Workspace            | `workspace`          |                   | ✅                 |                     | Workspace operations including backup and restore                          |

## Operations

To review the operations that can be performed on each component, click on the Palette component name below to display
the list of operations.

<Accordion>
<AccordionPanel title="API Keys">

- create
- get
- list
- update
- delete

</AccordionPanel>
<AccordionPanel title="Audit">

- get
- list

</AccordionPanel>
<AccordionPanel title="App Deployment">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="App Profile">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Cloud Account">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Cloud Config">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Cluster">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Cluster Group">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Cluster Profile">

- create
- delete
- get
- list
- update
- publish

</AccordionPanel>
<AccordionPanel title="DNS Mapping">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Edge Host">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Edge Host Token">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Filter">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Location">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Macro">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Machine">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Private Gateway">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Project">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Role">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Registry">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Tag">

- update

</AccordionPanel>
<AccordionPanel title="Team">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="User">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Virtual Cloud Config">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Virtual Cluster">

- create
- delete
- get
- list
- update

</AccordionPanel>
<AccordionPanel title="Virtual Machine">

- create
- delete
- get
- list
- update
- clone
- migrate
- pause
- restart
- resume
- snapshotCreate
- snapshotDelete
- snapshotGet
- snapshotList
- snapshotUpdate
- start
- stop

</AccordionPanel>
<AccordionPanel title="Workspace">

- create
- delete
- get
- list
- update
- restore
- backup

</AccordionPanel>
</Accordion>
