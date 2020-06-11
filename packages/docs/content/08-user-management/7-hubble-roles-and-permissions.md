---
title: "Hubble Roles and Permissions"
metaTitle: "Hubble Roles and Permissions"
metaDescription: "Details about scopes, permissions and roles within Spectro Cloud's dev engine called Hubble"
icon: ""
hideToC: true
fullWidth: false
---

# Hubble Roles and Permissions

## Permissions

Permissions are of the format `component.operation` where *&lt;component&gt;* refers to a resource or an API functionality. The component is the singular word of the API URI's first resource component which comes are the version detail.

For e. g.: In */v1alpha1/spectroclusters/* the component will be *spectrocluster*.

Every resource can exist in multiple scopes. For more details, please refer to the [RBAC's Resource Scope Matrix](/user-management/rbac). As mentioned previously, a *permission* contains multiple *scopes.* The Hubble permission model will be of the following format:

```go
    type Permission struct {
                Component       string
                Operations      []string
                DisplayName     string
                Scope           []AclScope
    }
```
| Component | Operations | Scopes |
|---|:---:|---:|
|cloudaccount | create, get, list, update, delete | project |
| packregistry | create, get, list, update, delete | project |
| gitregistry | create, get, list, update, delete | project |
| role | create, get, list, update, delete | project, tenant, system |
| user | create, get, list, update, delete | tenant |
| team | create, get, list, update, delete | tenant |
| tenant | create, get, list, update, delete | system |
| project | create, get, list, update, delete | tenant, project |
| clusterprofile | create, get, list, update, delete, <br /> publish | project, tenant, system |
| spectrocluster | create, get, list, update, delete, <br /> activate | project |

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
| SpectroClusterAdmin | spectrocluster.* | project | The user is able to manage the spectroclusters within a project |
| SpectroClusterEditor | spectrocluster.* (except &#42;.create and &#42;.delete) | project | |
| SpectroClusterViewer | spectrocluster.get, spectrocluster.list | project | |
| CloudAccountAdmin | cloudaccount.* | project | The user is able to manage the cloudaccounts within a project |
| CloudAccountEditor | cloudaccount.* (except &#42;.create and &#42;.delete) | project | |
| CloudAccountViewer | cloudaccount.get, cloudaccount.list | project | |

> A System User (SuperAdmin) by default will get all the permissions on the system scoped resource.
