---
title: "Tenant Scope Roles and Permissions"
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

Tenant is an isolated workspace within the Spectro system. Users and Teams with specific Roles can be associated with the Tenant(s) you create.

Palette has adopted the security principle of least privilege. Each user is assigned Roles and Permissions to the scopes, resources, and components. The Permissions format is `resourceKey`.`operation`, where resourceKey refers to resource or the API functionality, and *operation* refers to the action or activity allowed. 

To view a list of the predefined roles and permissions, go to **Tenant Settings** > **Roles**, and you will find the list of **Global Roles**. If you need to extend your permissions, use the **Create Role** option. 

Below is the list of Roles and Permissions that already predefined for the Global Tenant Scope.

<br />
<br />
<br />


# Tenants 
----------------------------
<Tabs>

<Tabs.TabPane tab="Tenant Admin" key="Tenant Admin">

<br />

## Tenant Admin

Tenant is an isolated workspace within the Palette system dedicated to a customer. The Tenant Administrator Role allows the user to create profiles and manage projects within the tenant.

<br / >
<table>
    <tr>
        <td width="400"><b>resourceKeys</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />

|                    | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **apiKey**         | √          | √          | √       | √        | √          |            |             |            |             |
| **audit**          |            |            | √       | √        |            |            |             |            |             |
| **cloudaccount**   | √          | √          | √       | √        | √          |            |             |            |             |
| **cloudconfig**    | √          | √          | √       | √        | √          |            |             |            |             |
| **cluster**        | √          | √          | √       | √        | √          | √          |             |            |             |
| **clusterProfile** | √          | √          | √       | √        | √          |            | √           |            |             |
| **clusterRbac**    | √          | √          | √       | √        | √          |            |             |            |             |
| **dnsMapping**     | √          | √          | √       | √        | √          |            |             |            |             |
| **edgehost**       | √          | √          | √       | √        | √          |            |             |            |             |
| **location**       | √          | √          | √       | √        | √          |            |             |            |             |
| **machine**        | √          | √          | √       | √        | √          |            |             |            |             |
| **macro**          | √          | √          | √       | √        | √          |            |             |            |             |
| **packRegistry**   | √          | √          | √       | √        | √          |            |             |            |             |
| **privateGateway** | √          | √          | √       | √        | √          |            |             |            |             |
| **project**        | √          | √          | √       | √        | √          |            |             |            |             |
| **role**           | √          | √          | √       | √        | √          |            |             |            |             |
| **sshKey**         | √          | √          | √       | √        | √          |            |             |            |             |
| **team**           | √          | √          | √       | √        | √          |            |             |            |             |
| **user**           | √          | √          | √       | √        | √          |            |             |            |             |
| **workspace**      | √          | √          | √       | √        | √          |            |             | √          | √           |

<br />
<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Tenant Viewer" key="Tenant Viewer Role">


## Tenant Viewer

<br / >
<table>
    <tr>
        <td width="400"><b>resourceKeys</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />

 |                    | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
 | ------------------ | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
 | **apiKey**         |            |            | √       | √        |            |            |             |            |             |
 | **audit**          |            |            | √       | √        |            |            |             |            |             |
 | **cloudaccount**   |            |            | √       | √        |            |            |             |            |             |
 | **cloudconfig**    |            |            | √       | √        |            |            |             |            |             |
 | **cluster**        |            |            | √       | √        |            |            |             |            |             |
 | **clusterProfile** |            |            | √       | √        |            |            |             |            |             |
 | **clusterRbac**    |            |            | √       | √        |            |            |             |            |             |
 | **dnsMapping**     |            |            | √       | √        |            |            |             |            |             |
 | **edgehost**       |            |            | √       | √        |            |            |             |            |             |
 | **location**       |            |            | √       | √        |            |            |             |            |             |
 | **machine**        |            |            | √       | √        |            |            |             |            |             |
 | **macro**          |            |            | √       | √        |            |            |             |            |             |
 | **packRegistry**   |            |            | √       | √        |            |            |             |            |             |
 | **privateGateway** |            |            | √       | √        |            |            |             |            |             |
 | **project**        |            |            | √       | √        |            |            |             |            |             |
 | **role**           |            |            | √       | √        |            |            |             |            |             |
 | **sshKey**         |            |            | √       | √        |            |            |             |            |             |
 | **team**           |            |            | √       | √        |            |            |             |            |             |
 | **user**           |            |            | √       | √        |            |            |             |            |             |
 | **workspace**      |            |            | √       | √        |            |            |             |            |             |


</Tabs.TabPane>
<Tabs.TabPane tab="Tenant Project Admin" key="Tenant Project Admin">

<br />

## Tenant Project Admin 

<br / >
<table>
    <tr>
        <td width="400"><b>resourceKeys</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />

|                    | **Create** | **Get** | **Delete** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ---------- | ------- | ---------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **apiKey**         |            | √       |            | √        |            |            |             |            |             |
| **audit**          |            | √       |            | √        |            |            |             |            |             |
| **cloudaccount**   | √          | √       | √          | √        | √          |            |             |            |             |
| **cloudconfig**    | √          | √       | √          | √        | √          |            |             |            |             |
| **cluster**        | √          | √       | √          | √        | √          | √          |             |            |             |
| **clusterProfile** | √          | √       | √          | √        | √          |            | √           |            |             |
| **clusterRbac**    | √          | √       | √          | √        | √          |            |             |            |             |
| **dnsMapping**     | √          | √       | √          | √        | √          |            |             |            |             |
| **edgehost**       | √          | √       | √          | √        | √          |            |             |            |             |
| **location**       | √          | √       | √          | √        | √          |            |             |            |             |
| **machine**        | √          | √       | √          | √        | √          |            |             |            |             |
| **macro**          | √          | √       | √          | √        | √          |            |             |            |             |
| **packRegistry**   | √          | √       | √          | √        | √          |            |             |            |             |
| **privateGateway** | √          | √       | √          | √        | √          |            |             |            |             |
| **project**        | √          | √       | √          | √        | √          |            |             |            |             |
| **sshKey**         | √          | √       | √          | √        | √          |            |             |            |             |
| **workspace**      | √          | √       | √          | √        | √          |            |             | √          | √           |


</Tabs.TabPane>
</Tabs>

<br />
<br />
<br />

<Tabs>
<Tabs.TabPane tab="Tenant Cluster Profile Admin" key="Tenant Cluster Profile Admin">

<br />

## Tenant Cluster Profile Admin
<br / >
<table>
    <tr>
        <td width="400"><b>resourceKeys</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />

|                    | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **clusterProfile** | √          | √          | √       | √        | √          |            | √           |            |             |
| **macro**          | √          | √          | √       | √        | √          |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |


<br />
<br />
<br />


</Tabs.TabPane>
<Tabs.TabPane tab="Tenant Role Admin" key="Tenant Role Admin">

<br />

## Tenant Role Admin Role

<br / >
<table>
    <tr>
        <td width="400"><b>resourceKeys</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />


|          | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| -------- | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **role** | √          | √          | √       | √        | √          |            |             |            |             |


<br />
<br />
<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Tenant Team Admin" key="Tenant Team Admin">

<br />

## Tenant Team Admin

<br / >
<table>
    <tr>
        <td width="400"><b>resourceKeys</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />

|            | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------- | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **apiKey** |            |            | √       | √        |            |            |             |            |             |
| **audit**  |            |            | √       | √        |            |            |             |            |             |
| **team**   | √          | √          | √       | √        | √          |            |             |            |             |
| **user**   |            |            | √       | √        |            |            |             |            |             |


<br />
<br />
<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Tenant User Admin" key="Tenant User Admin">

<br />

## Tenant User Admin Role
A user can manage user operations in the tenant scope.

<br / >
<table>
    <tr>
        <td width="400"><b>resourceKeys</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />

|            | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------- | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **apiKey** | √          | √          | √       | √        | √          |            |             |            |             |
| **audit**  |            |            | √       | √        |            |            |             |            |             |
| **user**   | √          | √          | √       | √        | √          |            |             |            |             |

<br />
<br />
<br />

</Tabs.TabPane>
</Tabs>

<br />
<br />
<br />
