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

Below is the predefined list of Roles and Permissions for the Global Project Scope:

<br />


# App Deployment
--------------------------------

|Role Name   | Description  |
|---|---|
|App Deployment Admin |Provides administrative privilege to perform all the App operations on App resources. |
|App Deployment Editor|Allows the user to perform edit operations on an App but not to create or delete an App.|
|App Deployment Viewer|Allows the user to view all the App resources but not to make modifications.|

<br />
<br />

<Tabs>
<Tabs.TabPane tab="App Deployment Admin" key="App Deployment Admin">
<br />

## App Deployment Admin

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
| **appDeployment**  | √          | √          | √       | √        | √          |            |             |            |             |
| **appProfile**     |            |            | √       | √        |            |            |             |            |             |
| **cloudaccount**   |            |            | √       | √        |            |            |             |            |             |
| **clusterGroup**   |            |            | √       | √        |            |            |             |            |             |
| **location**       | √          | √          | √       | √        | √          |            |             |            |             |
| **machine**        |            |            | √       | √        |            |            |             |            |             |
| **macro**          | √          | √          | √       | √        | √          |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |
| **project**        |            |            | √       | √        |            |            |             |            |             |
| **sshKey**         | √          | √          | √       | √        | √          |            |             |            |             |
| **tag**            |            |            |         |          | √          |            |             |            |             |
| **virtualCloudconfig**| √       | √          | √       | √        | √          |            |             |            |             |
| **virtualCluster** | √          | √          | √       | √        | √          |            |             |            |             |



</Tabs.TabPane>
<Tabs.TabPane tab="App Deployment Editor" key="App Deployment Editor">

<br />

## App Deployment Editor

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
| **appDeployment**  |            |            | √       | √        | √          |            |             |            |             |
| **appProfile**     |            |            | √       | √        |            |            |             |            |             |
| **cloudaccount**   |            |            | √       | √        |            |            |             |            |             |
| **clusterGroup**   |            |            | √       | √        |            |            |             |            |             |
| **location**       |            |            | √       | √        | √          |            |             |            |             |
| **machine**        |            |            | √       | √        |            |            |             |            |             |
| **macro**          |            |            | √       | √        |            |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |
| **project**        |            |            | √       | √        |            |            |             |            |             |
| **sshKey**         |            |            | √       | √        | √          |            |             |            |             |
| **tag**            |            |            |         |          | √          |            |             |            |             |
| **virtualCloudconfig**|         |            | √       | √        | √          |            |             |            |             |
| **virtualCluster** |            |            | √       | √        | √          |            |             |            |             |

<br />


</Tabs.TabPane>
<Tabs.TabPane tab="App Deployment Viewer" key="App Deployment Viewer">

<br />

## App Deployment Viewer 

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
| **appDeployment**  |            |            | √       | √        |            |            |             |            |             |
| **appProfile**     |            |            | √       | √        |            |            |             |            |             |
| **cloudaccount**   |            |            | √       | √        |            |            |             |            |             |
| **clusterGroup**   |            |            | √       | √        |            |            |             |            |             |
| **location**       |            |            | √       | √        |            |            |             |            |             |
| **machine**        |            |            | √       | √        |            |            |             |            |             |
| **macro**          |            |            | √       | √        |            |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |
| **project**        |            |            | √       | √        |            |            |             |            |             |
| **sshKey**         |            |            | √       | √        |            |            |             |            |             |
| **virtualCloudconfig**|         |            | √       | √        |            |            |             |            |             |
| **virtualCluster** |            |            | √       | √        |            |            |             |            |             |


</Tabs.TabPane>
</Tabs>

<br />


# App Profile
--------------------------------

|Role Names   | Description  |
|---|---|
|App Profile Admin |Provides administrative privilege to perform all the App operations on App profile resources. |
|App Profile Editor|Allows the user to perform edit operations on App profiles but not to create or delete an App profile.|
|App Profile Viewer|Allows the user to view all the App profile resources but not to modify them.|

<br />
<br />

<Tabs>
<Tabs.TabPane tab="App Profile Admin" key="App Profile Admin">
<br />

## App Profile Admin

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
| **appProfile**     | √          | √          | √       | √        | √          |            |             |            |             |
| **macro**          | √          | √          | √       | √        | √          |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |
| **project**        |            |            | √       | √        |            |            |             |            |             |

</Tabs.TabPane>
<Tabs.TabPane tab="App Profile Editor" key="App Profile Editor">

<br />

## App Profile Editor

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
| **appProfile**     |            |            | √       | √        | √          |            |             |            |             |
| **macro**          |            |            | √       | √        | √          |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |
| **project**        |            |            | √       | √        |            |            |             |            |             |

<br />


</Tabs.TabPane>
<Tabs.TabPane tab="App Profile Viewer" key="App Profile Viewer">

<br />

## App Profile Viewer 

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
| **appProfile**     |            |            | √       | √        |            |            |             |            |             |
| **macro**          |            |            | √       | √        |            |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |
| **project**        |            |            | √       | √        |            |            |             |            |             |


</Tabs.TabPane>
</Tabs>

<br />


# Project
--------------------------------

|Role Names   | Description  |
|---|---|
|Project Admin |The Project Admin role is a closure of all the project operations. It is a administrative privilege for the project resources |
|Project Editor|The Project Editor role can perform edit operations within a project, but the user  is not able to create or delete a project|
|Project Viewer|The Project Viewer will be able to view all the resources within a project, but not privileged to make modifications|

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
| **tag**            |            |            |         |          | √          |            |             |            |             |
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
| **tag**            |            |            |         |          | √          |            |             |            |             |
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
|Cluster Profile Admin |Cluster Profile Admin role has admin privileges to all the cluster profile operations|
|Cluster Profile Editor|Cluster Profile Editor role has privileges to edit and list operations on the cluster profile|
|Cluster Profile Viewer|Cluster Profile Viewer role has read-only privileges to cluster profiles|

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
| **tag**            |            |            |         |          | √          |            |             |            |             |

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
| **tag**            |            |            |         |          | √          |            |             |            |             |

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
|Cluster Admin  | A cluster admin in Project scope has all the privileges related to cluster operation|
|Cluster Editor | A cluster editor in Project scope has the privileges to update, delete,get and list cluster resources. This role is not privileged for cluster creation |
|Cluster Viewer | A cluster viewer in Project scope is a read-only privilege to cluster operations |

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
| **tag**            |            |            |         |          | √          |            |             |            |             |
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
| **tag**            |            |            |         |          | √          |            |             |            |             |
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
|Cluster Account Admin  | An administrative access to cloud account operations|
|Cluster Account Editor | An editor access to cloud cloud account operations  |
|Cluster Account Viewer |  A read-only role for cloud account operations |

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
|Workspace Admin  | Administrator role to workspace operations|
|Workspace Editor | Editor role to workspace operations |

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


# Virtual Cluster
--------------------------------

|Role Names   | Description  |
|---|---|
|Virtual Cluster Admin |Provides administrative privilege to perform all virtual cluster operations on App resources.|
|Virtual Cluster Editor|Allows the user to perform edit operations on a virtual cluster but not to create or delete a virtual cluster.|
|Virtual Cluster Viewer|Allows the user to view all the virtual cluster resources but not to modify them.|

<br />
<br />

<Tabs>
<Tabs.TabPane tab="Virtual Cluster Admin" key="Virtual Cluster Admin">
<br />

## Virtual Cluster Admin

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
| **clusterGroup**   |            |            | √       | √        |            |            |             |            |             |
| **location**       |            |            | √       | √        |            |            |             |            |             |
| **macro**          | √          | √          | √       | √        | √          |            |             |            |             |
| **project**        |            |            | √       | √        |            |            |             |            |             |
| **tag**            |            |            |         |          | √          |            |             |            |             |
| **virtualCloudconfig**| √       | √          | √       | √        | √          |            |             |            |             |
| **virtualCluster** | √          | √          | √       | √        | √          |            |             |            |             |



</Tabs.TabPane>
<Tabs.TabPane tab="Virtual Cluster Editor" key="Virtual Cluster Editor">

<br />

## Virtual Cluster Editor

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
| **clusterGroup**   |            |            | √       | √        |            |            |             |            |             |
| **location**       |            |            | √       | √        |            |            |             |            |             |
| **macro**          |            |            | √       | √        | √          |            |             |            |             |
| **project**        |            |            | √       | √        |            |            |             |            |             |
| **tag**            |            |            |         |          | √          |            |             |            |             |
| **virtualCloudconfig**|         |            | √       | √        | √          |            |             |            |             |
| **virtualCluster** |            |            | √       | √        | √          |            |             |            |             |

<br />


</Tabs.TabPane>
<Tabs.TabPane tab="App Deployment Viewer" key="App Deployment Viewer">

<br />

## Virtual Cluster Viewer 

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
| **clusterGroup**   |            |            | √       | √        |            |            |             |            |             |
| **location**       |            |            | √       | √        |            |            |             |            |             |
| **macro**          |            |            | √       | √        |            |            |             |            |             |
| **project**        |            |            | √       | √        |            |            |             |            |             |
| **virtualCloudconfig**|         |            | √       | √        |            |            |             |            |             |
| **virtualCluster** |            |            | √       | √        |            |            |             |            |             |

<br />


</Tabs.TabPane>
</Tabs>

<br />

<br />
<br />
<br />
