---
title: "Project Scope Permissions"
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

The Global Project Scope holds a cluster of resources in a logical grouping to that specific project. Users and Teams, with specific Roles, can be associated with the Project(s) you create. Below is a list of Roles types within the Project Scope. 


1. [Cloud Account Admin](/08-user-management/4-roles-permissions-and-project-scope#cloud-account-admin)
2. [Cloud Account Editor](/08-user-management/4-roles-permissions-and-project-scope#cloud-account-editor)
3. [Cloud Account Viewer](/08-user-management/4-roles-permissions-and-project-scope#cloud-account-viewer)
4. [Cluster Admin](/08-user-management/4-roles-permissions-and-project-scope#cluster-admin)
5. [Cluster Profile Admin](/08-user-management/4-roles-permissions-and-project-scope#cluster-profile-admin)
6. [Cluster Profile Editor](/08-user-management/4-roles-permissions-and-project-scope#cluster-profile-editor)
7. [Cluster Profile Viewer](/08-user-management/4-roles-permissions-and-project-scope#cluster-profile-viewer)
8. [Cluster Viewer](/08-user-management/4-roles-permissions-and-project-scope#cluster-viewer)
9. [Project Admin](/08-user-management/4-roles-permissions-and-project-scope#project-administrator)
10. [Project Editor](/08-user-management/4-roles-permissions-and-project-scope#project-editor)
11. [Project Viewer](/08-user-management/4-roles-permissions-and-project-scope#project-viewer)
12. [Workspace Admin](/08-user-management/4-roles-permissions-and-project-scope#workspace-admin)
13. [Workspace Operator](/08-user-management/4-roles-permissions-and-project-scope#workspace-operator)

Palette security principle of least privilege
Each user is assigned Roles and Permissions to the scopes, resources, and components.  

Project Role Permissions
Permission types are pervasive
- Get
- List
- Create
- Update
- Publish

There are two ways assign permissions. Select from the Global Roles list under Tenant Settings or create your own, if you need to extend your permissions.

<br />
<br />
<br />

# Project

<br />
<br />
<br />

<Tabs>

<Tabs.TabPane tab="Admin" key="Project Admin">
<br />

## Project Administrator

The Project Administrator can manage a project where the user has ProjectAdmin role. This applies to that specific project.

**<center>Permissions</center>**

|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
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
| **project**        | √       | √        |            | √          |            |            |             |            |             |
| **sshKey**         | √       | √        | √          | √          | √          |            |             |            |             |
| **workspace**      | √       | √        | √          | √          | √          |            |             | √          | √           |


</Tabs.TabPane>

<Tabs.TabPane tab="Editor" key="Project Editor">

<br />

## Project Editor

The Project Editor user can perform edit operations within a project, but the user is not able to create and delete operations. 

**<center>Permissions</center>**

|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **audit**          | √       | √        |            |            |            |            |             |            |             |
| **cloudaccount**   | √       | √        |            | √          |            |            |             |            |             |
| **cloudconfig**    | √       | √        | √          | √          |            |            |             |            |             |
| **cluster**        | √       | √        |            | √          |            | √          |             |            |             |
| **clusterProfile** | √       | √        |            | √          |            |            | √           |            |             |
| **clusterRbac**    | √       | √        |            | √          |            |            |             |            |             |
| **dnsMapping**     | √       | √        |            | √          |            |            |             |            |             |
| **edgehost**       | √       | √        |            | √          |            |            |             |            |             |
| **location**       | √       | √        |            | √          |            |            |             |            |             |
| **machine**        | √       | √        |            | √          | √          |            |             |            |             |
| **packRegistry**   | √       | √        |            | √          |            |            |             |            |             |
| **privateGateway** | √       | √        |            | √          |            |            |             |            |             |
| **project**        | √       | √        |            | √          |            |            |             |            |             |
| **sshKey**         | √       | √        |            | √          |            |            |             |            |             |
| **workspace**      | √       | √        |            | √          |            |            |             | √          | √           |

<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Viewer" key="Project Viewer">

<br />

## Project Viewer

The Project Viewer user will be able to view all the resources within a project, but is unable to modify a project.

**<center>Permissions</center>**

|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **audit**          | √       | √        |            |            |            |            |             |            |             |
| **cloudaccount**   | √       | √        |            |            |            |            |             |            |             |
| **cloudconfig**    | √       | √        | √          |            |            |            |             |            |             |
| **cluster**        | √       | √        |            |            |            | √          |             |            |             |
| **clusterProfile** | √       | √        |            |            |            |            |             |            |             |
| **clusterRbac**    | √       | √        |            |            |            |            |             |            |             |
| **dnsMapping**     | √       | √        |            |            |            |            |             |            |             |
| **edgehost**       | √       | √        |            |            |            |            |             |            |             |
| **location**       | √       | √        |            |            |            |            |             |            |             |
| **machine**        | √       | √        |            |            |            |            |             |            |             |
| **packRegistry**   | √       | √        |            |            |            |            |             |            |             |
| **privateGateway** | √       | √        |            |            |            |            |             |            |             |
| **project**        | √       | √        |            |            |            |            |             |            |             |
| **sshKey**         | √       | √        |            |            |            |            |             |            |             |
| **workspace**      | √       | √        |            |            |            |            |             |            |             |



</Tabs.TabPane>

</Tabs>

<br />


# Cluster Profile

The user with these permissions is able to manage the Cluster Profiles within a project.

<br />
<br />
<br />

<Tabs>

<Tabs.TabPane tab="Cluster Profile Admin" key="Cluster Profile Admin">
<br />

## Cluster Profile Admin

The user with these permissions can create and modify within the project.  

**<center>Permissions</center>**

|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **clusterProfile** | √       | √        | √          | √          | √          |            | √           |            |             |
| **packRegistry**   | √       | √        |            |            |            |            |             |            |             |

<br />


</Tabs.TabPane>

<Tabs.TabPane tab="Cluster Profile Editor" key="Cluster Profile Editor">

<br />

## Cluster Profile Editor

**<center>Permissions</center>**

|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **clusterProfile** | √       | √        | √          | √          |            |            |             |            |             |
| **packRegistry**   | √       | √        |            |            |            |            |             |            |             |

<br />


</Tabs.TabPane>

<Tabs.TabPane tab="Cluster Profile Viewer" key="Cluster Profile Viewer">

<br />

## Cluster Profile Viewer

**<center>Permissions</center>**

|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **clusterProfile** | √       | √        |            |            |            |            |             |            |             |
| **packRegistry**   | √       | √        |            |            |            |            |             |            |             |


<br />

</Tabs.TabPane>

</Tabs>

<br />

# Cluster

<br />

<Tabs>

<Tabs.TabPane tab="Cluster Admin" key="Cluster Admin">

<br />

## Cluster Admin

**<center>Permissions</center>**

|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **cloudaccount**   | √       | √        |            |            |            |            |             |            |             |
| **cloudconfig**    | √       | √        | √          | √          | √          | √          |             |            |             |
| **cluster**        | √       | √        | √          | √          | √          |            |             |            |             |
| **clusterProfile** | √       | √        |            |            |            |            |             |            |             |
| **clusterRbac**    | √       | √        | √          | √          | √          |            |             |            |             |
| **dnsMapping**     | √       | √        | √          | √          | √          |            |             |            |             |
| **edgehost**       | √       | √        | √          | √          | √          |            |             |            |             |
| **location**       | √       | √        | √          | √          | √          |            |             |            |             |
| **machine**        | √       | √        | √          | √          | √          |            |             |            |             |
| **packRegistry**   | √       | √        |            |            |            |            |             |            |             |
| **privateGateway** | √       | √        |            |            |            |            |             |            |             |
| **sshKey**         | √       | √        | √          | √          | √          |            |             |            |             |

<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Cluster Editor" key="Cluster Editor">

<br />

## Cluster Editor
    
**<center>Permissions</center>**

|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **cloudaccount**   | √       | √        |            |            |            |            |             |            |             |
| **cloudconfig**    | √       | √        | √          |            |            |            |             |            |             |
| **cluster**        | √       | √        |            | √          |            | √          |             |            |             |
| **clusterProfile** | √       | √        |            |            |            |            |             |            |             |
| **clusterRbac**    | √       | √        | √          |            |            |            |             |            |             |
| **dnsMapping**     | √       | √        | √          |            |            |            |             |            |             |
| **edgehost**       | √       | √        | √          |            |            |            |             |            |             |
| **location**       | √       | √        | √          |            |            |            |             |            |             |
| **machine**        | √       | √        | √          | √          |            |            |             |            |             |
| **packRegistry**   | √       | √        |            |            |            |            |             |            |             |
| **privateGateway** | √       | √        |            |            |            |            |             |            |             |
| **sshKey**         | √       | √        | √          | √          |            |            |             |            |             |

<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Cluster Viewer" key="Cluster Viewer">

<br />

## Cluster Viewer
    
**<center>Permissions</center>**

|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **cloudaccount**   | √       | √        |            |            |            |            |             |            |             |
| **cloudconfig**    | √       | √        |            |            |            |            |             |            |             |
| **cluster**        | √       | √        |            |            |            | √          |             |            |             |
| **clusterProfile** | √       | √        |            |            |            |            |             |            |             |
| **clusterRbac**    | √       | √        |            |            |            |            |             |            |             |
| **dnsMapping**     | √       | √        |            |            |            |            |             |            |             |
| **edgehost**       | √       | √        |            |            |            |            |             |            |             |
| **location**       | √       | √        |            |            |            |            |             |            |             |
| **machine**        | √       | √        |            |            |            |            |             |            |             |
| **packRegistry**   | √       | √        |            |            |            |            |             |            |             |
| **privateGateway** | √       | √        |            |            |            |            |             |            |             |
| **sshKey**         | √       | √        | √          |            |            |            |             |            |             |

<br />

</Tabs.TabPane>

</Tabs>

<br />



# Cloud Account

The user holding these permissions is able to manage the Cloudaccounts within a project.


<br />

<Tabs>

<Tabs.TabPane tab="Cloud Account Admin" key="Cloud Account Admin">

<br />

## Cloud Account Admin

**<center>Permissions</center>**

|                  | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------------- | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **cloudaccount** | √       | √        | √          | √          | √          |            |             |            |             |

<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Cloud Account Editor" key="Cloud Account Editor">

<br />


## Cloud Account Editor

**<center>Permissions</center>**

|                  | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------------- | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **cloudaccount** | √       | √        |            | √          |            |            |             |            |             |


<br />


</Tabs.TabPane>

<Tabs.TabPane tab="Cloud Account Viewer" key="Cloud Account Viewer">

<br />

## Cloud Account Viewer

**<center>Permissions</center>**

|                  | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------------- | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **cloudaccount** | √       | √        |            |            |            |            |             |            |             |

<br />

</Tabs.TabPane>

</Tabs>

<br />


# Workspace


<br />

<Tabs>

<Tabs.TabPane tab="Workspace Admin" key="Workspace Admin">

<br />

## Workspace Admin

**<center>Permissions</center>**

|               | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------- | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **workspace** | √       | √        | √          | √          | √          |            |             | √          | √           |


<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Workspace Operator" key="Workspace Operator">

<br />

## Workspace Operator
**<center>Permissions</center>**

|               | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------- | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **workspace** | √       | √        |            |            |            |            |             | √          | √           |


<br />

</Tabs.TabPane>

</Tabs>