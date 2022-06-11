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

The Global Project Scope holds a cluster of resources in a logical grouping to that specific project. Users and Teams with specific Roles can be associated with the Project(s) you create.

Palette has adopted the security principle of least privilege. Each user is assigned Roles and Permissions to the scopes, resources, and components. The Permission's format is `component`.`operation` where component refers to resource or API functionality. 

Permissions are of format component.operation where component refers to resource or API functionality. There are two ways to assign permissions. The first method is to select from the **Global Roles** list under **Tenant Settings** or **Create Role**, if you need to extend your permissions.


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

## Project Administrator Role

The Project Administrator can manage a project where the user has the ProjectAdmin role. This applies to that specific project.
<br / >
<table>
    <tr>
        <td width="400"><b>Components</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />

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

## Project Editor Role

The Project Editor user can perform edit operations within a project, but the user is not able to create and delete operations. 
<br / >
<table>
    <tr>
        <td width="400"><b>Components</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />

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

## Project Viewer Role

The Project Viewer user will be able to view all the resources within a project, but is unable to modify a project.
<br / >
<table>
    <tr>
        <td width="400"><b>Components</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />

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

The user with these permissions can manage the Cluster Profiles within a project.

<br />
<br />
<br />

<Tabs>

<Tabs.TabPane tab="Cluster Profile Admin" key="Cluster Profile Admin">
<br />

## Cluster Profile Admin Role

The user with these permissions can create and modify the project.  
<br / >
<table>
    <tr>
        <td width="400"><b>Components</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />


|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **clusterProfile** | √       | √        | √          | √          | √          |            | √           |            |             |
| **packRegistry**   | √       | √        |            |            |            |            |             |            |             |

<br />


</Tabs.TabPane>

<Tabs.TabPane tab="Cluster Profile Editor" key="Cluster Profile Editor">

<br />

## Cluster Profile Editor Role

<br / >
<table>
    <tr>
        <td width="400"><b>Components</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />


|                    | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **clusterProfile** | √       | √        | √          | √          |            |            |             |            |             |
| **packRegistry**   | √       | √        |            |            |            |            |             |            |             |

<br />


</Tabs.TabPane>

<Tabs.TabPane tab="Cluster Profile Viewer" key="Cluster Profile Viewer">

<br />

## Cluster Profile Viewer Role

<br / >
<table>
    <tr>
        <td width="400"><b>Components</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />


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

## Cluster Admin Role

<br / >
<table>
    <tr>
        <td width="400"><b>Components</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />


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

## Cluster Editor Role
<br / >
<table>
    <tr>
        <td width="400"><b>Components</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />


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

## Cluster Viewer Role
    
<br / >
<table>
    <tr>
        <td width="400"><b>Components</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />


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

The user holding these permissions is able to manage the Cloud Accounts within a project.


<br />

<Tabs>

<Tabs.TabPane tab="Cloud Account Admin" key="Cloud Account Admin">

<br />

## Cloud Account Admin Role

<br / >
<table>
    <tr>
        <td width="400"><b>Components</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />


|                  | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------------- | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **cloudaccount** | √       | √        | √          | √          | √          |            |             |            |             |

<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Cloud Account Editor" key="Cloud Account Editor">

<br />


## Cloud Account Editor Role
<br / >
<table>
    <tr>
        <td width="400"><b>Components</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />


|                  | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ---------------- | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **cloudaccount** | √       | √        |            | √          |            |            |             |            |             |


<br />


</Tabs.TabPane>

<Tabs.TabPane tab="Cloud Account Viewer" key="Cloud Account Viewer">

<br />

## Cloud Account Viewer Role

<br / >
<table>
    <tr>
        <td width="400"><b>Components</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />


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

## Workspace Admin Role
<br / >
<table>
    <tr>
        <td width="400"><b>Components</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />


|               | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------- | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **workspace** | √       | √        | √          | √          | √          |            |             | √          | √           |


<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Workspace Operator" key="Workspace Operator">

<br />

## Workspace Operator Role
<br / >
<table>
    <tr>
        <td width="400"><b>Components</b></td>
        <td><b>Operations</b></td>
    </tr>
</table>
<hr />


|               | **Get** | **List** | **Create** | **Update** | **Delete** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------- | ------- | -------- | ---------- | ---------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **workspace** | √       | √        |            |            |            |            |             | √          | √           |


<br />

</Tabs.TabPane>

</Tabs>