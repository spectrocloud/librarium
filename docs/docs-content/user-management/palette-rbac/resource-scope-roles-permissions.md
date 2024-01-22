---
sidebar_label: "Palette Resource Roles"
title: "Palette Global and Custom Resource Roles "
description: "Palette contains global resource roles and supports the ability to create custom resource roles."
hide_table_of_contents: false
sidebar_position: 20
tags: ["user-management", "rbac"]
---

Palette support two types of resource roles, global resource roles and custom resource roles:

<br />

- Global Resource Roles are a set of roles built in and available to you.

- Custom Resource Roles, are roles you can create in Palette using a set of permissions and operations.

To learn how to create a custom role. Review the [Create Custom Role](#palette-custom-resource-roles) guide.

## Palette Global Resource Roles

Palette provides the following built-in global resource roles:

<br />

- [Cluster](#cluster)

  - Resource Cluster Admin

  - Resource Cluster Editor

  - Resource Cluster Viewer

- [Cluster Profile](#cluster-profile)

  - Resource Cluster Profile Admin

  - Resource Cluster Profile Editor

  - Resource Cluster Profile Viewer

<br />

## Cluster

<br />

| Role Names              | Description                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resource Cluster Admin  | A cluster admin in Project scope has all the privileges related to cluster operation                                                                    |
| Resource Cluster Editor | A cluster editor in Project scope has the privileges to update, delete,get and list cluster resources. This role is not privileged for cluster creation |
| Resource Cluster Viewer | A cluster viewer in Project scope is a read-only privilege to cluster operations                                                                        |

<br />

<Tabs>

<TabItem label="Resource Cluster Admin" value="Resource Cluster Admin">

<br />

### Resource Cluster Admin

<br />
<table>
  <tr>
    <td width="400">
      <b>resourceKeys</b>
    </td>
    <td>
      <b>Operations</b>
    </td>
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

</TabItem>
<TabItem label="Resource Cluster Editor" value="Resource Cluster Editor">

<br />

### Resource Cluster Editor

<br />
<table>
  <tr>
    <td width="400">
      <b>resourceKeys</b>
    </td>
    <td>
      <b>Operations</b>
    </td>
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

</TabItem>
<TabItem label="Resource Cluster Viewer" value="Resource Cluster Viewer">

<br />

### Resource Cluster Viewer

<br />
<table>
  <tr>
    <td width="400">
      <b>resourceKeys</b>
    </td>
    <td>
      <b>Operations</b>
    </td>
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

</TabItem>
</Tabs>

<br />

## Cluster Profile

The user with these permissions can manage the Cluster Profiles within a project.

<br />

| Role Names             | Description                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| Cluster Profile Admin  | Cluster Profile Admin role has admin privileges to all the cluster profile operations         |
| Cluster Profile Editor | Cluster Profile Editor role has privileges to edit and list operations on the cluster profile |
| Cluster Profile Viewer | Cluster Profile Viewer role has read-only privileges to cluster profiles                      |

<br />

<Tabs>
<TabItem label="Resource Cluster Profile Admin" value="Resource Cluster Profile Admin">
<br />

### Resource Cluster Profile Admin

<br />
<table>
  <tr>
    <td width="400">
      <b>resourceKeys</b>
    </td>
    <td>
      <b>Operations</b>
    </td>
  </tr>
</table>
<hr />

|                    | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **clusterProfile** | √          | √          | √       | √        | √          |            | √           |            |             |
| **macro**          | √          | √          | √       | √        | √          |            |             |            |             |
| **packRegistry**   | √          | √          |         |          |            |            |             |            |             |

<br />

</TabItem>
<TabItem label="Resource Cluster Profile Editor" value="Resource Cluster Profile Editor">

<br />

### Resource Cluster Profile Editor

<br />
<table>
  <tr>
    <td width="400">
      <b>resourceKeys</b>
    </td>
    <td>
      <b>Operations</b>
    </td>
  </tr>
</table>
<hr />

|                    | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **clusterProfile** |            |            | √       | √        | √          |            | √           |            |             |
| **macro**          |            |            | √       | √        | √          |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |

<br />

</TabItem>
<TabItem label="Resource Cluster Profile Viewer" value="Resource Cluster Profile Viewer">

<br />

### Resource Cluster Profile Viewer

<br />
<table>
  <tr>
    <td width="400">
      <b>resourceKeys</b>
    </td>
    <td>
      <b>Operations</b>
    </td>
  </tr>
</table>
<hr />

|                    | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **clusterProfile** |            |            | √       | √        |            |            |             |            |             |
| **macro**          |            |            | √       | √        |            |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |

<br />

</TabItem>
</Tabs>

<br />

## Palette Custom Resource Roles

<br />

The following is a list of platform permissions and operations supported by Palette. Use these permissions to
[create custom role](../new-user.md#create-custom-role) to control the cluster access. For every **Resource Keys**
available **operations** can be added as per your requirements.

<br />

## List of Custom Permissions

<br />
<table>
  <tr>
    <td width="400">
      <b>resourceKeys</b>
    </td>
    <td>
      <b>Operations</b>
    </td>
  </tr>
</table>
<hr />

|                    | **Create** | **Delete** | **Get** | **List** | **Update** | **Import** | **Publish** | **Backup** | **Restore** |
| ------------------ | ---------- | ---------- | ------- | -------- | ---------- | ---------- | ----------- | ---------- | ----------- |
| **cloudaccount**   |            |            | √       | √        |            |            |             |            |             |
| **cloudconfig**    |            | √          | √       | √        | √          |            |             |            |             |
| **cluster**        |            | √          | √       | √        | √          |            |             |            |             |
| **clusterProfile** |            | √          | √       | √        | √          |            | √           |            |             |
| **dnsMapping**     |            |            | √       | √        |            |            |             |            |             |
| **location**       |            |            | √       | √        |            |            |             |            |             |
| **machine**        |            |            | √       | √        |            |            |             |            |             |
| **macro**          |            |            | √       | √        |            |            |             |            |             |
| **packRegistry**   |            |            | √       | √        |            |            |             |            |             |

## Resources

[Resource Scope Matrix](palette-rbac.md#resource-scope-matrix)
