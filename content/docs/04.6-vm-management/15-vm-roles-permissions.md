---
title: "VM User Roles and Permissions"
metaTitle: "VM User Roles and Permissions"
metaDescription: "Learn how to "
icon: "users"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Palette RBAC has several built-in roles that can be assigned to users and teams. Role assignments are the way you control access to Palette resources.

The Global Tenant Scope holds all the tenant resources of Palette. The list of Role types within the Tenant Scope are as follows:

Palette provides four out-of-the-box roles to give permissions for VM Management:

<br />

TABLE

<br />

Note: those out-of-the-box roles are merely provided as an example, other roles can be created based on the permissions granularity offered by Palette. Palette provides the ability to specify bindings to configure granular Role-Based Access Control (RBAC) rules.

<WarningBox>

You must configure role binding before any user, including you as administrator, can access the VM Management functionality in Palette.

</WarningBox>


You can configure namespaces and RBAC from within a cluster or from a Palette Workspace that contains a cluster group. In a cluster group all roleBindings must occur at the namespace level. For details, review the [Cluster RBAC](/clusters/cluster-management/cluster-rbac/) and [workspace RBAC](/workspace/#rolebasedaccesscontrol(rbac)) guides.  

Palette leverages Regex Pattern matching so you can select multiple namespaces to apply role binding. Check out [Regex for Namespaces](/workspace/workload-features) to learn more.
