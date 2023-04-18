---
title: "VM User Roles and Permissions"
metaTitle: "VM User Roles and Permissions"
metaDescription: "Learn about roles and permissions to apply to VMs when using Spectro VM Dashboard."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

You must configure roles and role binding before any user, including you as administrator, can access the VM Management functionality in Palette. There are two sets of roles: Cluster Roles and Palette Roles, along with the required bindings configuration.

Palette provides the following four out-of-the-box Cluster roles for VM Management. The table also lists the corresponding Palette roles. 

<br />

| Cluster Role  | Description | Restrictions | Palette Role |
|-----------|-------------|-----------|-----------|
| ``spectro-vm-admin`` | Has admin privileges to manage the Kubernetes cluster, VMs, and templates.| None | - Cluster Admin or Editor<br/>- Cluster Profile Admin or Editor<br />- Virtual Machine Admin
| ``spectro-vm-power-user`` | Can perform most VM operations, but does not handle infrastructure aspects. | - Cannot manage or administer the Kubernetes cluster.<br />- Cannot manage or update VM templates. | - Cluster Viewer<br />- Virtual Machine Power User |
| ``spectro-vm-user`` | Primarily uses VMs created by others. | - Cannot launch new VMs or clone existing ones.<br />- Cannot resize or delete.<br />- Cannot migrate VMs from one node to another. | - Cluster Viewer<br />- Virtual Machine User 
| ``spectro-vm-viewer`` | A view-only role. | Cannot perform any of the operations offered to the above users.| - Cluster Viewer<br />- Virtual Machine Viewer


<br />

<WarningBox>

These roles are currently only relevant to access VM Management APIs. To access the Virtual Machines console, users must have permissions to access the host clusters. These permissions can be granted through the [default Kubernetes roles](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings) Admin/Editor/Viewer.

</WarningBox>

<br />

You can create additional roles based on the permissions granularity that Palette offers. Palette provides the ability to specify bindings to configure granular Role-Based Access Control (RBAC) rules.

<br />


You can configure namespaces and RBAC from within a cluster or from a Palette workspace that contains a cluster group. In a cluster group all RoleBindings must occur at the namespace level. For details, review the [Cluster RBAC](/clusters/cluster-management/cluster-rbac/) and [workspace RBAC](/workspace/#rolebasedaccesscontrol(rbac)) guides.  

Palette leverages Regex Pattern matching so you can select multiple namespaces to apply role bindings. To learn more, checkout [Regex for Namespaces](/workspace/workload-features).


<br />

<br />

<br />

<br />




