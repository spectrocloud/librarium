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

The Global Tenant Scope holds all the tenant resources of an organization. Each Tenant Scope is separate from the other.  Users and Teams with specific Roles can be associated with the Tenant Scope. Below is a list of Roles types within the Tenant Scope. 

1. [Tenant Admin](/08-user-management/5-roles-permissions-and-tenant-scope#tenant-administrator-role)
2. [Tenant Cluster Profile Admin](/content/docs/08-user-management/5-roles-permissions-and-tenant-scope#tenant-cluster-profile-admin)
3. [Tenant Role Admin](/content/docs/08-user-management/5-roles-permissions-and-tenant-scope#tenant-role-admin)
4. [Tenant Team Admin](/content/docs/08-user-management/5-roles-permissions-and-tenant-scope#tenant-team-admin)
5. [Tenant User Admin](/content/docs/08-user-management/5-roles-permissions-and-tenant-scope#tenant-user-admin)


<br />
<br />
<br />

<Tabs>

<Tabs.TabPane tab="Admin" key="Tenant Admin">

<br />
<br />
<br />

## Tenant Administrator Role

|           |     |         |          |            | **Permissions** |            |            |             |             |            |
| --- | :------- | :-: | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|                    |     | **Get** | **List** | **Delete** | **Backup**      | **Import** | **Create** | **Publish** | **Restore** | **Update** |
|   **Type**                  |     |         |          |            |                 |            |            |             |             |            |
| **apiKey**         |     |         | √        | √          |                 |            |            |             |             | √          |
| **audit**          |     |    √    |          |            |                 |            |            |             |             |            |
| **cloudaccount**   |     |         | √        | √          |                 |            | √          |             |             | √          |
| **cloudconfig**    |     |         | √        | √          |                 |            | √          |             |             | √          |
| **cluster**        |     |         | √        | √          |                 | √          | √          |             |             | √          |
| **clusterProfile** |     |         | √        | √          |                 |            | √          |             | √           | √          |
| **clusterRbac**    |     |         | √        | √          |                 |            | √          |             |             | √          |
| **dnsMapping**     |     |         | √        | √          |                 |            | √          |             |             | √          |
| **edgehost**       |     |         | √        | √          |                 |            | √          |             |             | √          |
| **location**       |     |         | √        | √          |                 |            | √          |             |             | √          |
| **machine**        |     |         | √        | √          |                 |            | √          |             |             | √          |
| **packRegistry**   |     |         | √        | √          |                 |            | √          |             |             | √          |
| **privateGateway** |     |         | √        | √          |                 |            | √          |             |             | √          |
| **project**        |     |         | √        | √          |                 |            | √          |             |             | √          |
|  **role**          |     |         | √        | √          |                 |            | √          |             |    | √          |
| **sshKey**         |     |         | √        | √          |                 |            | √          |             |             | √          |
| **team**           |     |         | √        | √          |                 |            | √          |             |             | √          |
| **user**           |     |         | √        | √          |                 |            | √          |             |             | √          |
| **workspace**      |     |         | √        |            | √               |            | √          |             | √           | √          |
|                    |     |         |          |            |                 |            |            |             |             |            |

<br />
<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Cluster Profile Admin" key="Tenant Cluster Profile Admin">

<br />
<br />
<br />

## Tenant Cluster Profile Admin

|            |     |         |          |            | **Permissions** |            |            |             |             |            |
| --- | :------- | :-: | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|                    |     | **Get** | **List** | **Delete** | **Backup**      | **Import** | **Create** | **Publish** | **Restore** | **Update** |
| **apiKey**         |     | √       | √        |            |                 |            |            |             |             |            |
| **audit**          |     | √       | √        |            |                 |            |            |             |             |            |
| **cloudaccount**   |     | √       | √        |            |                 |            |            |             |             |            |
| **cloudconfig**    |     | √       | √        |            |                 |            |            |             |             |            |
| **cluster**        |     | √       | √        |            |                 |            |            |             |             |            |
| **clusterProfile** |     | √       | √        |            |                 |            |            |             |             |            |
| **clusterRbac**    |     | √       | √        |            |                 |            |            |             |             |            |
| **dnsMapping**     |     | √       | √        |            |                 |            |            |             |             |            |
| **edgehost**       |     | √       | √        |            |                 |            |            |             |             |            |
| **location**       |     | √       | √        |            |                 |            |            |             |             |            |
| **machine**        |     | √       | √        |            |                 |            |            |             |             |            |
| **packRegistry**   |     | √       | √        |            |                 |            |            |             |             |            |
| **privateGateway** |     | √       | √        |            |                 |            |            |             |             |            |
| **project**        |     | √       | √        |            |                 |            |            |             |             |            |
| **role**           |     | √       | √        |            |                 |            |            |             |             |            |
| **sshKey**         |     | √       | √        |            |                 |            |            |             |             |            |
| **team**           |     | √       | √        |            |                 |            |            |             |             |            |
| **user**           |     | √       | √        |            |                 |            |            |             |             |            |
| **workspace**      |     | √       | √        |            |                 |            |            |             |             |            |

<br />
<br />
<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Role Admin" key="Tenant Role Admin">

<br />
<br />
<br />

## Tenant Role Admin

<br />
<br />
<br />

|  |     |             |           |              | **Permissions**   |              |              |               |               |              |
| :------- | :-: | : --------: | :-------: | :----------: |:---------------:|:----------:| :----------: | :-----------: | :-----------: | :----------: |
|          |     | **List**    | **Get**   | **Delete**   | **Backup**        | **Import**   | **Create**   | **Publish**   | **Restore**   | **Update**   |
|          |     |             |           |              |                   |              |              |               |               |              |
| **role** |     | √           | √         | √            |                   |              |              | √             |               | √            |

<br />
<br />
<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Team Admin" key="Tenant Team Admin">

<br />
<br />
<br />

## Tenant Team Admin

<br />
<br />
<br />

|  |     |         |          |            | **Permissions** |            |            |             |             |            |
| --- | :------- | :-: | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|          |     | **Get** | **List** | **Delete** | **Backup**      | **Import** | **Create** | **Publish** | **Restore** | **Update** |
| **apiKey**   |     | √       | √        | √          |                 |            | √          |             |             | √          |
| **audit**    |     | √       | √        |            |                 |            |            |             |             |            |
| **team**     |     | √       | √        | √          |                 |            | √          |             |             | √          |
| **user**     |     | √       | √        | √          |                 |            | √          |             |             | √          |

<br />
<br />
<br />

</Tabs.TabPane>

<Tabs.TabPane tab="User Admin" key="Tenant User Admin">

<br />
<br />
<br />

## Tenant User Admin

<br />
<br />
<br />

|   |     |         |          |            | **Permissions** |            |            |             |             |            |
| :------- | :-: | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|             |     | **Get** | **List** | **Delete** |   **Backup**    | **Import** | **Create** | **Publish** | **Restore** | **Update** |
|**apiKey**   |     |    √    |    √     |     √      |                 |            |            |      √      |             |     √      |
|**audit**    |     |    √    |    √     |            |                 |            |            |             |             |            |
|**user**     |     |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |

<br />
<br />
<br />

</Tabs.TabPane>

</Tabs>