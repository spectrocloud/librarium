---
title: "About Roles and Permissions"
metaTitle: "About Roles and Permissions"
metaDescription: "Details about scopes, permissions and roles within Spectro Cloud"
icon: ""
hideToC: true
fullWidth: false
---

# Permissions

Permissions are of the format `component.operation` where *&lt;component&gt;* refers to a resource. Every resource can exist in multiple scopes. For more details, please refer to the [RBAC's Resource Scope Matrix](/user-management/rbac). As mentioned previously, a *permission* contains multiple *scopes.*

| Component | Operations | Scopes |
|---|:---:|---:|
|cloudaccount | create, get, list, update, delete | project |
| packregistry | create, get, list, update, delete | project |
| role | create, get, list, update, delete | project, tenant |
| user | create, get, list, update, delete | tenant |
| team | create, get, list, update, delete | tenant |
| project | create, get, list, update, delete | tenant, project |
| clusterprofile | create, get, list, update, delete, publish | project, tenant|

The permission will be shown as *cloudaccount.create*, *cloudaccount.get*.

## Roles

Roles are collections of permissions in a particular scope.

| Role | Permissions | Scope | Remarks |
| --- | --- | --- | :---: |
| TenantUserAdmin | user.* | tenant | A user can manage user operations in the tenant scope |
| TenantTeamAdmin | team.* | tenant | |
| TenantClusterProfileAdmin | clusterprofile.* | tenant | |
| TenantRoleAdmin | role.* | tenant | |
| TenantProjectAdmin | project.* | tenant | A user can manage all the projects |
| TenantAdmin | user.&#42; team.&#42; clusterprofile.&#42; role.&#42; project.&#42; | tenant | |
| ProjectAdmin | project.* (except &#42;.create and &#42;.delete) clusterprofile.* spectrocluster.* cloudaccount.* | project | A user can manage a project where the user has ProjectAdmin role. This applies to that specific project |
| ProjectEditor | (except &#42;.create and &#42;.delete) clusterprofile.&#42; spectrocluster.&#42; cloudaccount.* | project | Except for the create and delete operations, the user can perform edit operations withing a project |
| ProjectViewer | clusterprofile.get, clusterprofile.list, spectrocluster.get, spectrocluster.list, cloudaccount.get, cloudaccount.list | project | The user is able to view all the resources within a project |
| ClusterProfileAdmin | clusterprofile.* | project | The user is able to manage the cluster profiles within a project |
| ClusterProfileEditor | clusterprofile.* (except &#42;.create and &#42;.delete) | project | |
| ClusterProfileViewer | clusterprofile.get, clusterprofile.list | project | |
| CloudAccountAdmin | cloudaccount.* | project | The user is able to manage the cloudaccounts within a project |
| CloudAccountEditor | cloudaccount.* (except &#42;.create and &#42;.delete) | project | |
| CloudAccountViewer | cloudaccount.get, cloudaccount.list | project | |
