---
title: "Tenant Scope Permissions"
metaTitle: "Tenant Roles"
metaDescription: "The list of Global Tenant Roles under Tenant Scope"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Global Tenant Scope

A Tenant is an isolated workspace within the Spectro system dedicated to a customer.

The Global Tenant Scope holds all the tenant resources of an organization. Each Tenant Scope is separate from the other.  Users and Teams with specific Roles can be associated with the Tenant Scope. Below is a list of Roles types within the Tenant Scope. 

1. [Tenant Admin](/08-user-management/5-roles-permissions-and-tenant-scope#tenant-administrator-role)
2. [Tenant Viewer](/08-user-management/5-roles-permissions-and-tenant-scope#Tenant-Viewer)
1. [Tenan Project Admin](/08-user-management/5-roles-permissions-and-tenant-scope#tenant-project-admin)
1. [Tenant Cluster Profile Admin](/content/docs/08-user-management/5-roles-permissions-and-tenant-scope#tenant-cluster-profile-admin)
1. [Tenant Role Admin](/content/docs/08-user-management/5-roles-permissions-and-tenant-scope#tenant-role-admin)
1. [Tenant Team Admin](/content/docs/08-user-management/5-roles-permissions-and-tenant-scope#tenant-team-admin)
1. [Tenant User Admin](/content/docs/08-user-management/5-roles-permissions-and-tenant-scope#tenant-user-admin)

Each user is assigned Roles and Permissions to the scopes, resources, and components.


<br />
<br />
<br />

<Tabs>

<Tabs.TabPane tab="Administrator Role" key="Tenant Admin">

<br />

## Tenant Administrator Role

Tenant is an isolated workspace within the Palette system dedicated to a customer. The Tenant Administrator Role allows the user to create profiles and manage projects within the tenant.

**<center>Permissions</center>**

|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **apiKey**         | √       | √        | √          | √          | √          |            |             |            |             |
| **audit**          | √       | √        |            |            |            |            |             |            |             |
| **cloudaccount**   | √       | √        | √          | √          | √          |            |             |            |             |
| **cloudconfig**    | √       | √        | √          | √          | √          |            |             |            |             |
| **cluster**        | √       | √        | √          | √          | √          | √          |             |            |             |
| **clusterProfile** | √       | √        | √          | √          | √          |            | √           |            |             |
| **clusterRbac**    | √       | √        | √          | √          | √          |            |             |            |             |
| **dnsMapping**     | √       | √        | √          | √          | √          |            |             |            |             |
| **edgehost**       | √       | √        | √          | √          | √          |            |             |            |             |
| **location**       | √       | √        | √          | √          | √          |            |             |            |             |
| **machine**        | √       | √        | √          | √          | √          |            |             |            |             |
| **packRegistry**   | √       | √        | √          | √          | √          |            |             |            |             |
| **privateGateway** | √       | √        | √          | √          | √          |            |             |            |             |
| **project**        | √       | √        | √          | √          | √          |            |             |            |             |
| **role**           | √       | √        | √          | √          | √          |            |             |            |             |
| **sshKey**         | √       | √        | √          | √          | √          |            |             |            |             |
| **team**           | √       | √        | √          | √          | √          |            |             |            |             |
| **user**           | √       | √        | √          | √          | √          |            |             |            |             |
| **workspace**      | √       | √        | √          | √          | √          |            |             | √          | √           |



<br />
<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Tenant Viewer" key="Tenant Viewer">

<br />

**<center>Permissions</center>**

|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **apiKey**         | √       | √        |            |            |            |            |             |            |             |
| **audit**          | √       | √        |            |            |            |            |             |            |             |
| **cloudaccount**   | √       | √        |            |            |            |            |             |            |             |
| **cloudconfig**    | √       | √        |            |            |            |            |             |            |             |
| **cluster**        | √       | √        |            |            |            |            |             |            |             |
| **clusterProfile** | √       | √        |            |            |            |            |             |            |             |
| **clusterRbac**    | √       | √        |            |            |            |            |             |            |             |
| **dnsMapping**     | √       | √        |            |            |            |            |             |            |             |
| **edgehost**       | √       | √        |            |            |            |            |             |            |             |
| **location**       | √       | √        |            |            |            |            |             |            |             |
| **machine**        | √       | √        |            |            |            |            |             |            |             |
| **packRegistry**   | √       | √        |            |            |            |            |             |            |             |
| **privateGateway** | √       | √        |            |            |            |            |             |            |             |
| **project**        | √       | √        |            |            |            |            |             |            |             |
| **role**           | √       | √        |            |            |            |            |             |            |             |
| **sshKey**         | √       | √        |            |            |            |            |             |            |             |
| **team**           | √       | √        |            |            |            |            |             |            |             |
| **user**           | √       | √        |            |            |            |            |             |            |             |
| **workspace**      | √       | √        |            |            |            |            |             |            |             |



</Tabs.TabPane>

<Tabs.TabPane tab="Project Admin" key="Tenant Project Admin">

<br />

## Tenant Project Admin Role 

**<center>Permissions</center>**
    
|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **apiKey**         | √       | √        | √          | √          | √          |            |             |            |             |
| **audit**          | √       | √        |            |            |            |            |             |            |             |
| **cloudaccount**   | √       | √        | √          | √          | √          |            |             |            |             |
| **cloudconfig**    | √       | √        | √          | √          | √          |            |             |            |             |
| **cluster**        | √       | √        | √          | √          | √          | √          |             |            |             |
| **clusterProfile** | √       | √        | √          | √          | √          |            | √           |            |             |
| **clusterRbac**    | √       | √        | √          | √          | √          |            |             |            |             |
| **dnsMapping**     | √       | √        | √          | √          | √          |            |             |            |             |
| **edgehost**       | √       | √        | √          | √          | √          |            |             |            |             |
| **location**       | √       | √        | √          | √          | √          |            |             |            |             |
| **machine**        | √       | √        | √          | √          | √          |            |             |            |             |
| **packRegistry**   | √       | √        | √          | √          | √          |            |             |            |             |
| **privateGateway** | √       | √        | √          | √          | √          |            |             |            |             |
| **project**        | √       | √        | √          | √          | √          |            |             |            |             |
| **sshKey**         | √       | √        | √          | √          | √          |            |             |            |             |
| **workspace**      | √       | √        | √          | √          | √          |            |             | √          | √           |


</Tabs.TabPane>

</Tabs>

<br />
<br />
<br />

<Tabs>

<Tabs.TabPane tab="Cluster Profile Admin" key="Tenant Cluster Profile Admin">

<br />

## Tenant Cluster Profile Admin Roles

**<center>Permissions</center>**

|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **clusterProfile** | √       | √        | √          | √          | √          |            | √           |            |             |
| **packRegistry**   | √       | √        | √          | √          | √          |            |             |            |             |


<br />
<br />
<br />


</Tabs.TabPane>

<Tabs.TabPane tab="Role Admin" key="Tenant Role Admin">

<br />

## Tenant Role Admin Role


**<center>Permissions</center>**

|          | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| -------- | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **role** | √       | √        | √          | √          | √          |            |             |            |             |


<br />
<br />
<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Team Admin" key="Tenant Team Admin">

<br />

## Tenant Team Admin Role

**<center>Permissions</center>**

|            | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------- | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **apiKey** | √       | √        | √          | √          | √          |            |             |            |             |
| **audit**  | √       | √        |            |            |            |            |             |            |             |
| **team**   | √       | √        | √          | √          | √          |            |             |            |             |
| **user**   | √       | √        | √          | √          | √          |            |             |            |             |


<br />
<br />
<br />

</Tabs.TabPane>

<Tabs.TabPane tab="User Admin" key="Tenant User Admin">

<br />

## Tenant User Admin Role
A user can manage user operations in the tenant scope.


**<center>Permissions</center>**

|            | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------- | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **apiKey** | √       | √        | √          | √          | √          |            |             |            |             |
| **audit**  | √       | √        |            |            |            |            |             |            |             |
| **user**   | √       | √        | √          | √          | √          |            |             |            |             |



<br />
<br />
<br />

</Tabs.TabPane>

</Tabs>