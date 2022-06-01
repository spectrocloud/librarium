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

The Global Project Scope holds a cluster of resources in a logical grouping to that specific project. Users and Teams with specific Roles can be associated with the Project(s) you create. Below is a list of Roles types within the Project Scope. 


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


Each user is assigned Roles and Permissions to the scopes, resources, and components.  

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

|                    |         |          |            | **Permissions** |            |            |             |             |            |
| :----------------- | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|                    | **Get** | **List** | **Delete** |   **Backup**    | **Import** | **Create** | **Publish** | **Restore** | **Update** |
|                    |         |          |            |                 |            |            |             |             |            |
| **cloudaccount**   |    √    |          |            |                 |            |     √      |             |             |            |
| **cluster**        |    √    |          |            |                 |     √      |     √      |             |             |            |
| **clusterProfile** |         |          |     √      |                 |            |     √      |      √      |             |     √      |
| **clusterRbac**    |    √    |    √     |     √      |                 |            |            |             |             |     √      |
| **dnsMapping**     |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |
| **edgehost**       |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |
| **location**       |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |
| **machine**        |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |
| **privateGateway** |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |
| **project**        |    √    |    √     |            |                 |            |            |             |             |     √      |
| **sshKey**         |    √    |    √     |     √      |                 |            |     √      |             |      √      |     √      |
| **workspace**      |    √    |    √     |     √      |        √        |            |     √      |             |             |     √      |
| **packRegistry**   |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |

</Tabs.TabPane>

<Tabs.TabPane tab="Editor" key="Project Editor">
<br />

## Project Editor

|                    |         |          |            | **Permissions** |            |            |             |             |            |
| :----------------- | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|                    | **Get** | **List** | **Delete** |   **Backup**    | **Import** | **Create** | **Publish** | **Restore** | **Update** |
| **audit**          |    √    |    √     |            |                 |            |            |             |             |            |
| **cloudaccount**   |    √    |    √     |            |                 |            |            |             |             |     √      |
| **cloudconfig**    |    √    |    √     |            |                 |            |     √      |             |             |     √      |
| **cluster**        |    √    |    √     |            |        √        |     √      |            |             |             |            |
| **clusterProfile** |    √    |    √     |            |                 |            |            |      √      |             |     √      |
| **clusterRbac**    |    √    |    √     |            |                 |            |            |             |             |     √      |
| **dnsMapping**     |    √    |    √     |            |                 |            |            |             |             |     √      |
| **edgehost**       |    √    |    √     |            |                 |            |            |             |             |     √      |
| **location**       |    √    |    √     |            |                 |            |            |             |             |     √      |
| **machine**        |    √    |    √     |     √      |                 |            |            |             |             |     √      |
| **packRegistry**   |    √    |    √     |            |                 |            |            |             |             |     √      |
| **privateGateway** |    √    |    √     |            |                 |            |            |             |             |     √      |
| **project**        |    √    |    √     |            |                 |            |            |             |             |     √      |
| **sshKey**         |    √    |    √     |            |                 |            |            |             |             |     √      |
| **workspace**      |    √    |    √     |            |        √        |            |            |             |      √      |     √      |

<br />
<br />
<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Viewer" key="Project Viewer">

<br />

## Project Viewer

|                    |         |          |            | **Permissions** |            |            |             |             |            |
| :----------------- | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|                    | **Get** | **List** | **Delete** |   **Backup**    | **Import** | **Create** | **Publish** | **Restore** | **Update** |
| **audit**          |    √    |    √     |            |                 |            |            |             |             |            |
| **cloudaccount**   |    √    |    √     |            |                 |            |            |             |             |            |
| **cloudconfig**    |         |    √     |            |                 |            |     √      |             |             |            |
| **cluster**        |    √    |    √     |            |                 |     √      |            |             |             |            |
| **clusterProfile** |    √    |    √     |            |                 |            |            |             |             |            |
| **clusterRbac**    |    √    |    √     |            |                 |            |            |             |             |            |
| **dnsMapping**     |    √    |    √     |            |                 |            |            |             |             |            |
| **edgehost**       |    √    |    √     |            |                 |            |            |             |             |            |
| **location**       |    √    |    √     |            |                 |            |            |             |             |            |
| **machine**        |    √    |    √     |            |                 |            |            |             |             |            |
| **packRegistry**   |    √    |    √     |            |                 |            |            |             |             |            |
| **privateGateway** |    √    |    √     |            |                 |            |            |             |             |            |
| **project**        |    √    |    √     |            |                 |            |            |             |             |            |
| **sshKey**         |    √    |    √     |            |                 |            |            |             |             |            |
| **workspace**      |    √    |    √     |            |                 |            |            |             |             |            |


</Tabs.TabPane>

</Tabs>

<br />
<br />
<br />

# Cluster Profile

<br />
<br />
<br />

<Tabs>

<Tabs.TabPane tab="Cluster Profile Admin" key="Cluster Profile Admin">
<br />

## Cluster Profile Admin

|                    |         |          |            | **Permissions** |            |            |             |             |            |
| :----------------- | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|                    | **Get** | **List** | **Delete** |   **Backup**    | **Import** | **Create** | **Publish** | **Restore** | **Update** |
| **clusterProfile** |    √    |    √     |     √      |                 |            |     √      |      √      |             |            |
| **packRegistry**   |    √    |    √     |            |                 |            |            |             |             |            |

<br />
<br />
<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Cluster Profile Editor" key="Cluster Profile Editor">
<br />

## Cluster Profile Editor

|                    |         |          |            | **Permissions** |            |            |             |             |            |
| :----------------- | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|                    | **Get** | **List** | **Delete** |   **Backup**    | **Import** | **Create** | **Publish** | **Restore** | **Update** |
| **clusterProfile** |    √    |    √     |            |                 |            |            |      √      |             |     √      |
| **packRegistry**   |    √    |    √     |            |                 |            |            |             |             |            |


</Tabs.TabPane>

<Tabs.TabPane tab="Cluster Profile Viewer" key="Cluster Profile Viewer">
<br />

## Cluster Profile Viewer

|                    |         |          |            | **Permissions** |            |            |             |             |            |
| :----------------- | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|                    | **Get** | **List** | **Delete** |   **Backup**    | **Import** | **Create** | **Publish** | **Restore** | **Update** |
| **clusterProfile** |    √    |    √     |            |                 |            |            |             |             |            |
| **packRegistry**   |    √    |    √     |            |                 |            |            |             |             |            |

<br />
<br />
<br />

</Tabs.TabPane>

</Tabs>


# Cluster

<br />
<br />
<br />

<Tabs>

<Tabs.TabPane tab="Cluster Admin" key="Cluster Admin">
<br />

## Cluster Admin

|                    |         |          |            | **Permissions** |            |            |             |             |            |
| :----------------- | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|                    | **Get** | **List** | **Delete** |   **Backup**    | **Import** | **Create** | **Publish** | **Restore** | **Update** |
| **cloudaccount**   |    √    |    √     |            |                 |            |            |             |             |            |
| **cloudconfig**    |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |
| **cluster**        |    √    |    √     |     √      |                 |     √      |     √      |             |             |     √      |
| **clusterProfile** |    √    |    √     |            |                 |            |            |             |             |            |
| **clusterRbac**    |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |
| **dnsMapping**     |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |
| **edgehost**       |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |
| **location**       |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |
| **machine**        |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |
| **packRegistry**   |    √    |    √     |            |                 |            |            |             |             |            |
| **privateGateway** |    √    |    √     |            |                 |            |            |             |             |            |
| **sshKey**         |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |

</Tabs.TabPane>

<Tabs.TabPane tab="Cluster Viewer" key="Cluster Viewer">
<br />

## Cluster Viewer

|                    |         |          |            | **Permissions** |            |            |             |             |            |
| :----------------- | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|                    | **Get** | **List** | **Delete** |   **Backup**    | **Import** | **Create** | **Publish** | **Restore** | **Update** |
| **cloudaccount**   |    √    |    √     |            |                 |            |            |             |             |            |
| **cloudconfig**    |    √    |    √     |            |                 |            |            |             |             |            |
| **cluster**        |    √    |    √     |            |                 |     √      |            |             |             |            |
| **clusterProfile** |    √    |    √     |            |                 |            |            |             |             |            |
| **clusterRbac**    |    √    |    √     |            |                 |            |            |             |             |            |
| **dnsMapping**     |    √    |    √     |            |                 |            |            |             |             |            |
| **edgehost**       |    √    |    √     |            |                 |            |            |             |             |            |
| **location**       |    √    |    √     |            |                 |            |            |             |             |            |
| **machine**        |    √    |    √     |            |                 |            |            |             |             |            |
| **packRegistry**   |    √    |    √     |            |                 |            |            |             |             |            |
| **privateGateway** |    √    |    √     |            |                 |            |            |             |             |            |
| **sshKey**         |    √    |    √     |            |                 |            |     √      |             |             |            |



</Tabs.TabPane>

</Tabs>
<br />
<br />
<br />


# Cloud Account
<br />
<br />
<br />

<Tabs>

<Tabs.TabPane tab="Cloud Account Admin" key="Cloud Account Admin">
<br />

## Cloud Account Admin

|                  |         |          |            | **Permissions** |            |            |             |             |            |
| :--------------- | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|                  | **Get** | **List** | **Delete** |   **Backup**    | **Import** | **Create** | **Publish** | **Restore** | **Update** |
| **cloudaccount** |    √    |    √     |     √      |                 |            |     √      |             |             |     √      |

</Tabs.TabPane>

<Tabs.TabPane tab="Cloud Account Editor" key="Cloud Account Editor">
<br />


## Cloud Account Editor

|                  |         |          |            | **Permissions** |            |            |             |             |            |
| :--------------- | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|                  | **Get** | **List** | **Delete** |   **Backup**    | **Import** | **Create** | **Publish** | **Restore** | **Update** |
| **cloudaccount** |    √    |    √     |            |                 |            |            |             |             |     √      |

<br />
<br />
<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Cloud Account Viewer" key="Cloud Account Viewer">
<br />

## Cloud Account Viewer

|                  |         |          |            | **Permissions** |            |            |             |             |            |
| :--------------- | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|                  | **Get** | **List** | **Delete** |   **Backup**    | **Import** | **Create** | **Publish** | **Restore** | **Update** |
| **cloudaccount** |    √    |    √     |            |                 |            |            |             |             |            |

<br />
<br />
<br />

</Tabs.TabPane>

</Tabs>
<br />
<br />
<br />


# Workspace
<br />
<br />
<br />

<Tabs>

<Tabs.TabPane tab="Workspace Admin" key="Workspace Admin">
<br />

## Workspace Admin

|               |         |          |            | **Permissions** |            |            |             |             |            |
| :------------ | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|               | **Get** | **List** | **Delete** |   **Backup**    | **Import** | **Create** | **Publish** | **Restore** | **Update** |
| **workspace** |    √    |    √     |     √      |        √        |            |     √      |             |      √      |     √      |

<br />
<br />
<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Workspace Operator" key="Workspace Operator">

<br />

## Workspace Operator

|               |         |          |            | **Permissions** |            |            |             |             |            |
| :------------ | :-----: | :------: | :--------: | :-------------: | :--------: | :--------: | :---------: | :---------: | :--------: |
|               | **Get** | **List** | **Delete** |   **Backup**    | **Import** | **Create** | **Publish** | **Restore** | **Update** |
| **workspace** |    √    |    √     |            |        √        |            |            |             |      √      |            |

<br />
<br />
<br />

</Tabs.TabPane>

</Tabs>