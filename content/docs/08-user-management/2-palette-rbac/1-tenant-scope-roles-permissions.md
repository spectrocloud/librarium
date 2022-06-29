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

Below is the list of Roles and Permissions that already predefined for the Global Tenant Scope for the following resources:

1. [Tenant](/user-management/palette-rbac/tenant-scope-roles-permissions#tenants)
2. [Cluster Profile](/user-management/palette-rbac/tenant-scope-roles-permissions#tenantclusterprofileadmin)
3. [Role](/user-management/palette-rbac/tenant-scope-roles-permissions#tenantroleadmin)
4. [Team](/user-management/palette-rbac/tenant-scope-roles-permissions#tenantteamadmin)
5. [User](/user-management/palette-rbac/tenant-scope-roles-permissions#tenantuseradminrole)

<br />
<br />
<br />


# Tenants 
----------------------------

|Role Names   | Description  |
|---|---|
|Tenant Admin  |The Tenant Administrator role allows the user to create projects and manage projects within the tenant, covered under all operations related to cluster profiles|
|Tenant Viewer||   |
|Tenant Project Admin|The role with access to |

<Tabs>

<Tabs.TabPane tab="Tenant Admin" key="Tenant Admin">

<br />

## Tenant Admin

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

## Cluster Profile 

----------------------------

|Role Names   | Description  |
|---|---|
|Tenant Cluster Profile Admin  |   |

|                    | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **clusterProfile** | √          | √          | √       | √        | √          |            | √           |            |             |
| **macro**          | √          | √          | √       | √        | √          |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |

<br />
<br />
<br />

## Tenant Role 

----------------------------

|Role Names   | Description  |
|---|---|
|Tenant Role Admin  |   |

|          | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| -------- | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **role** | √          | √          | √       | √        | √          |            |             |            |             |


<br />
<br />
<br />

## Tenant Team

----------------------------

|Role Names   | Description  |
|---|---|
|Tenant Team Admin |   |

|            | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------- | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **apiKey** |            |            | √       | √        |            |            |             |            |             |
| **audit**  |            |            | √       | √        |            |            |             |            |             |
| **team**   | √          | √          | √       | √        | √          |            |             |            |             |
| **user**   |            |            | √       | √        |            |            |             |            |             |


<br />
<br />
<br />

## Tenant User

----------------------------

|Role Names   | Description  |
|---|---|
|Tenant User Admin Role|A user can manage user operations in the tenant scope|



|            | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------- | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **apiKey** | √          | √          | √       | √        | √          |            |             |            |             |
| **audit**  |            |            | √       | √        |            |            |             |            |             |
| **user**   | √          | √          | √       | √        | √          |            |             |            |             |



<br />
<br />
<br />
