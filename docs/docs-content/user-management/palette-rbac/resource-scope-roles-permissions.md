---
sidebar_label: "Resource Roles"
title: "Resource Roles "
description: "Palette contains global resource roles and supports the ability to create custom resource roles."
hide_table_of_contents: false
sidebar_position: 50
tags: ["user-management", "rbac"]
---

A Resource role is scoped at the project level and has a set of permissions that define the actions a user can perform
on Palette resources within a project. Resource roles have limited resource keys available compared to Project or Tenant
roles. You can use Resource roles to achieve Attribute-Based Access Control (ABAC) by pairing them with
[Resource filters](../../tenant-settings/filters.md)

All resource roles must be paired with a Filter when assigned to a User or Team. The combination of a Resource role and
a Resource filter allows you to control access based on a tag value.

For example, a Resource role that grants all cluster permissions, `cluster.*`, can be assigned to a user for a specific
project, with a Resource filter where the tag value is `claims`. This user will have full access to all clusters in the
project that have the tag `claims`.

:::tip

Create your own custom Resource role if none of the predefined roles meet your requirements. Refer to the
[Create a Custom Role](./create-custom-role.md#create-a-custom-resource-role) guide for more information.

:::

## Default Resource Roles

Palette comes with a set of immutable predefined Resource roles out-of-the-box that you can assign to users or teams. To
review the permissions associated with each Resource role, click on the role name to expand the list of permissions.

### Cluster

| Role Name               | Description                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resource Cluster Admin  | A cluster admin in Project scope has all the privileges related to cluster operation                                                                    |
| Resource Cluster Editor | A cluster editor in Project scope has the privileges to update, delete,get and list cluster resources. This role is not privileged for cluster creation |
| Resource Cluster Viewer | A cluster viewer in Project scope is a read-only privilege to cluster operations                                                                        |

<Accordion>
<AccordionPanel title="Resource Cluster Admin">

- cloudaccount.get
- cloudaccount.list
- cloudconfig.delete
- cloudconfig.get
- cloudconfig.list
- cloudconfig.update
- cluster.adminKubeconfigDownload
- cluster.delete
- cluster.get
- cluster.list
- cluster.update
- clusterProfile.delete
- clusterProfile.get
- clusterProfile.list
- clusterProfile.update
- dnsMapping.get
- dnsMapping.list
- location.get
- location.list
- machine.get
- machine.list
- macro.get
- macro.list
- packRegistry.get
- packRegistry.list
- sshKey.get
- sshKey.list
- virtualCloudconfig.delete
- virtualCloudconfig.get
- virtualCloudconfig.list
- virtualCloudconfig.update
- virtualCluster.delete
- virtualCluster.get
- virtualCluster.list
- virtualCluster.update
- virtualMachine.clone
- virtualMachine.create
- virtualMachine.delete
- virtualMachine.get
- virtualMachine.list
- virtualMachine.migrate
- virtualMachine.pause
- virtualMachine.restart
- virtualMachine.resume
- virtualMachine.snapshotCreate
- virtualMachine.snapshotDelete
- virtualMachine.snapshotGet
- virtualMachine.snapshotList
- virtualMachine.snapshotUpdate
- virtualMachine.start
- virtualMachine.stop
- virtualMachine.update

</AccordionPanel>
<AccordionPanel title="Resource Cluster Editor">

- cloudaccount.get
- cloudaccount.list
- cloudconfig.get
- cloudconfig.list
- cloudconfig.update
- cluster.get
- cluster.list
- cluster.update
- clusterProfile.get
- clusterProfile.list
- clusterProfile.update
- dnsMapping.get
- dnsMapping.list
- location.get
- location.list
- machine.get
- machine.list
- macro.get
- macro.list
- packRegistry.get
- packRegistry.list
- sshKey.get
- sshKey.list
- virtualCloudconfig.get
- virtualCloudconfig.list
- virtualCloudconfig.update
- virtualCluster.get
- virtualCluster.list
- virtualCluster.update
- virtualMachine.get
- virtualMachine.list
- virtualMachine.pause
- virtualMachine.restart
- virtualMachine.resume
- virtualMachine.snapshotCreate
- virtualMachine.snapshotDelete
- virtualMachine.snapshotGet
- virtualMachine.snapshotList
- virtualMachine.snapshotUpdate
- virtualMachine.start
- virtualMachine.stop
- virtualMachine.update

</AccordionPanel>
<AccordionPanel title="Resource Cluster Viewer">

- cloudaccount.get
- cloudaccount.list
- cloudconfig.get
- cloudconfig.list
- cluster.get
- cluster.list
- clusterProfile.get
- clusterProfile.list
- dnsMapping.get
- dnsMapping.list
- location.get
- location.list
- machine.get
- machine.list
- macro.get
- macro.list
- packRegistry.get
- packRegistry.list
- sshKey.get
- sshKey.list
- virtualCloudconfig.get
- virtualCloudconfig.list
- virtualCluster.get
- virtualCluster.list
- virtualMachine.get
- virtualMachine.list

</AccordionPanel>
</Accordion>

### Cluster Profile

| Role Name                       | Description                                                              |
| ------------------------------- | ------------------------------------------------------------------------ |
| Resource Cluster Profile Admin  | A role has admin privileges to all the cluster profile operations        |
| Resource Cluster Profile Editor | A role has privileges to edit and list operations on the cluster profile |
| Resource Cluster Profile Viewer | A role has read-only privileges to cluster profiles                      |

<Accordion>
<AccordionPanel title="Resource Cluster Profile Admin">

- clusterProfile.delete
- clusterProfile.get
- clusterProfile.list
- clusterProfile.publish
- clusterProfile.update
- macro.get
- macro.list
- packRegistry.get
- packRegistry.list

</AccordionPanel>
<AccordionPanel title="Resource Cluster Profile Editor">

- clusterProfile.get
- clusterProfile.list
- clusterProfile.publish
- clusterProfile.update
- macro.get
- macro.list
- packRegistry.get
- packRegistry.list

</AccordionPanel>
<AccordionPanel title="Resource Cluster Profile Viewer">

- clusterProfile.get
- clusterProfile.list
- macro.get
- macro.list
- packRegistry.get
- packRegistry.list

</AccordionPanel>
</Accordion>

## Resources

- [Permissions](./permissions.md)
