---
title: "Project Scope Roles and Permissions"
metaTitle: "Project Roles"
metaDescription: "The list of Global Project Roles under Project Scope"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Global Project Scope

The Global Project Scope holds a group of resources, in a logical grouping, to a specific project. Users and Teams with specific Roles can be associated with the Project, Cluster, or Cluster Profile you create.

Palette has adopted the security principle of least privilege. Each user is assigned Roles and Permissions to the Scopes, Resources, and Components. The Permissions format is `resourceKey.operation`, where **resourceKey** refers to a resource or the API functionality, and *operation* refers to the action or activity allowed. 

To view a list of the predefined roles and permissions, go to **Tenant Settings** > **Roles**, and you will find the list of **Global Roles**. If you need to extend your permissions, use the **Create Role** option. 

Below is the predefined list of Roles and Permissions for the Global Project Scope for the following Resources:

<br />

* [Project](/user-management/palette-rbac/project-scope-roles-permissions#project)
* [Cluster Profile](/user-management/palette-rbac/project-scope-roles-permissions#clusterprofile)
* [Cluster](/user-management/palette-rbac/project-scope-roles-permissions#cluster)
* [Cloud Account](/user-management/palette-rbac/project-scope-roles-permissions#cloudaccount)
* [Workspace](/user-management/palette-rbac/project-scope-roles-permissions#workspace)

<br />

# Project
--------------------------------

|Role Names   | Description  |
|---|---|
|Project Admin  | The Project Administrator can manage a project, where the user has the Project Admin role. The permission applies to this specific project|
|Project Editor|The Project Editor user can perform edit operations within a project, but the user is not able to create or delete operations|
|Project Viewer|The Project Viewer will be able to view all the resources within a project, but is unable to modify a project|

<br />
<br />

<Tabs>
<Tabs.TabPane tab="Project Admin" key="Project Admin">
<br />

## Project Admin

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
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |
| **privateGateway** | √          | √          | √       | √        | √          |            |             |            |             |
| **project**        |            |            | √       | √        | √          |            |             |            |             |
| **sshKey**         | √          | √          | √       | √        | √          |            |             |            |             |
| **workspace**      | √          | √          | √       | √        | √          |            |             | √          | √           |

</Tabs.TabPane>
<Tabs.TabPane tab="Project Editor" key="Project Editor">

<br />

## Project Editor

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
| **audit**          |            |            | √       | √        |            |            |             |            |             |
| **cloudaccount**   |            |            | √       | √        | √          |            |             |            |             |
| **cloudconfig**    | √          |            | √       | √        | √          |            |             |            |             |
| **cluster**        |            |            | √       | √        | √          |            |             |            |             |
| **clusterProfile** |            |            | √       | √        | √          |            | √           |            |             |
| **clusterRbac**    |            |            | √       | √        | √          |            |             |            |             |
| **dnsMapping**     |            |            | √       | √        | √          |            |             |            |             |
| **edgehost**       |            |            | √       | √        | √          |            |             |            |             |
| **location**       |            |            | √       | √        | √          |            |             |            |             |
| **machine**        |            | √          | √       | √        | √          |            |             |            |             |
| **macro**          |            |            | √       | √        | √          |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |
| **privateGateway** |            |            | √       | √        | √          |            |             |            |             |
| **project**        |            |            | √       | √        | √          |            |             |            |             |
| **sshKey**         |            |            | √       | √        | √          |            |             |            |             |
| **workspace**      |            |            | √       | √        | √          |            |             | √          | √           |

<br />


</Tabs.TabPane>
<Tabs.TabPane tab="Project Viewer" key="Project Viewer">

<br />

## Project Viewer 

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
| **audit**          | √          |            |         |          | √          |            |             |            |             |
| **cloudaccount**   | √          |            |         |          | √          |            |             |            |             |
| **cloudconfig**    | √          |            |         |          | √          |            |             |            |             |
| **cluster**        | √          |            |         |          | √          |            |             |            |             |
| **clusterProfile** | √          |            |         |          | √          |            |             |            |             |
| **dnsMapping**     | √          |            |         |          | √          |            |             |            |             |
| **edgehost**       | √          |            |         |          | √          |            |             |            |             |
| **location**       | √          |            |         |          | √          |            |             |            |             |
| **machine**        | √          |            |         |          | √          |            |             |            |             |
| **macro**          | √          |            |         |          | √          |            |             |            |             |
| **packRegistry**   | √          |            |         |          | √          |            |             |            |             |
| **privateGateway** | √          |            |         |          | √          |            |             |            |             |
| **project**        | √          |            |         |          | √          |            |             |            |             |
| **sshKey**         | √          |            |         |          | √          |            |             |            |             |
| **workspace**      | √          |            |         |          | √          |            |             |            |             |


</Tabs.TabPane>
</Tabs>

<br />


# Cluster Profile
-----------------------------

The user with these permissions can manage the Cluster Profiles within a project.

<br />

|Role Names| Description  |
|---|---|
|Cluster Profile Admin |The user with these permissions can create and modify the Palette cluster profile.     |
|Cluster Profile Editor|   |
|Cluster Profile Viewer|  |

<br />

<Tabs>
<Tabs.TabPane tab="Cluster Profile Admin" key="Cluster Profile Admin">
<br />

## Cluster Profile Admin

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
| **packRegistry**   | √          | √          |         |          |            |            |             |            |             |

<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Cluster Profile Editor" key="Cluster Profile Editor">

<br />

## Cluster Profile Editor

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
| **clusterProfile** |            |            | √       | √        | √          |            | √           |            |             |
| **macro**          |            |            | √       | √        | √          |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |

<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Cluster Profile Viewer" key="Cluster Profile Viewer">

<br />

## Cluster Profile Viewer

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
| **clusterProfile** |            |            | √       | √        |            |            |             |            |             |
| **macro**          |            |            | √       | √        |            |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |

<br />

</Tabs.TabPane>
</Tabs>

<br />

# Cluster
--------------------------------------
<br />

<br />

|Role Names| Description  |
|---|---|
|Cluster Admin  |   |
|Cluster Editor |   |
|Cluster Viewer |   |

<br />

<Tabs>

<Tabs.TabPane tab="Cluster Admin" key="Cluster Admin">

<br />

## Cluster Admin

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
| **cloudaccount**   |            |            | √       | √        |            |            |             |            |             |
| **cloudconfig**    | √          | √          | √       | √        | √          |            |             |            |             |
| **cluster**        | √          | √          | √       | √        | √          | √          |             |            |             |
| **clusterProfile** | √          | √          |         |          |            |            |             |            |             |
| **clusterRbac**    | √          | √          | √       | √        | √          |            |             |            |             |
| **dnsMapping**     | √          | √          | √       | √        | √          |            |             |            |             |
| **edgehost**       | √          | √          | √       | √        | √          |            |             |            |             |
| **location**       | √          | √          | √       | √        | √          |            |             |            |             |
| **machine**        | √          | √          | √       | √        | √          |            |             |            |             |
| **macro**          | √          | √          | √       | √        | √          |            |             |            |             |
| **packRegistry**   | √          | √          |         |          |            |            |             |            |             |
| **privateGateway** | √          | √          |         |          |            |            |             |            |             |
| **sshKey**         | √          | √          | √       | √        | √          |            |             |            |             |

<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Cluster Editor" key="Cluster Editor">

<br />

## Cluster Editor
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
| **cloudaccount**   |            |            | √       | √        |            |            |             |            |             |
| **cloudconfig**    |            |            | √       | √        | √          |            |             |            |             |
| **cluster**        |            |            | √       | √        | √          |            |             |            |             |
| **clusterProfile** |            |            | √       | √        |            |            |             |            |             |
| **clusterRbac**    |            |            | √       | √        | √          |            |             |            |             |
| **dnsMapping**     |            |            | √       | √        | √          |            |             |            |             |
| **edgehost**       |            |            | √       | √        | √          |            |             |            |             |
| **location**       |            |            | √       | √        | √          |            |             |            |             |
| **machine**        |            | √          | √       | √        | √          |            |             |            |             |
| **macro**          |            |            | √       | √        | √          |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |
| **privateGateway** |            |            | √       | √        |            |            |             |            |             |
| **sshKey**         |            |            | √       | √        | √          |            |             |            |             |

<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Cluster Viewer" key="Cluster Viewer">

<br />

## Cluster Viewer
    
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
| **sshKey**         |            |            | √       | √        |            |            |             |            |             |

<br />

</Tabs.TabPane>
</Tabs>

<br />

# Cloud Account
-----------------------------

<br />

|Role Names| Description |
|---|---|
|Cluster Account Admin  |   |
|Cluster Account Editor||   |
|Cluster Account Viewer||.  |

<br />


<Tabs>
<Tabs.TabPane tab="Cluster Account Admin" key="Cloud Account Admin">

<br />

## Cluster Account Admin

<br / >
<table>
    <tr>
        <td width="400"><b>resourceKeys</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />

|                  | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------------- | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **cloudaccount** | √          | √          | √       | √        | √          |            |             |            |             |

<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Cluster Account Editor" key="Cluster Account Editor">

<br />

## Cluster Account Editor
<br / >
<table>
    <tr>
        <td width="400"><b>resourceKeys</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />

|                  | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------------- | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **cloudaccount** |            |            | √       | √        | √          |            |             |            |             |
 
<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Cluster Account Viewer" key="Cluster Account Viewer">

<br />

## Cluster Account Viewer 

<br / >
<table>
    <tr>
        <td width="400"><b>resourceKeys</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />

|                  | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------------- | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **cloudaccount** |            |            | √       | √        |            |            |             |            |             |

<br />

</Tabs.TabPane>
</Tabs>

# Workspace
------------------------------------

<br />

|Role Names| Description  |
|---|---|
|Workspace Admin  |   |
|Workspace Editor||   |

<br />

<Tabs>
<Tabs.TabPane tab="Workspace Admin" key="Workspace Admin">

<br />

## Workspace Admin 
<br / >
<table>
    <tr>
        <td width="400"><b>resourceKeys</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />

|               | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------- | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **workspace** | √          | √          | √       | √        | √          |            |             | √          | √           |


<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Workspace Operator" key="Workspace Operator">

<br />

## Workspace Operator

<br / >
<table>
    <tr>
        <td width="400"><b>resourceKeys</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />

|               | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------- | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **workspace** |            |            | √       | √        |            |            |             | √          | √           |

<br />
<br />
<br />

</Tabs.TabPane>
</Tabs>

<br />
<br />
<br />