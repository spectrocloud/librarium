---
title: "RBAC and NS Support"
metaTitle: "Cluster Level RBAC and NS Support"
metaDescription: "Cluster Level RBAC and NS Support for Access Control"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';

# Overview
RoleBindings and ClusterRoleBindings are important Role-Based Access Control (RBAC) concepts which can be enabled within a cluster to provide cluster-centric access control. If the cluster is already associated with one or more Workspaces then users are not allowed to configure RBAC again at the cluster level. The Palette RBAC contains resources that represent a set of additive permissions. The rules can be configured in two levels:

**Role** sets access permissions within a namespace. During Role creation, the namespace to which it belongs needs to be specified.

**Cluster Role** is a non-namespaced resource that sets permissions of the cluster-scoped resources.

<InfoBox>
To define a role within a namespace, use Role. To define a role cluster-wide, use ClusterRole.
</InfoBox>

**RoleBinding** is binding or associating a Role with a Subject. RoleBinding is used for granting permission to a Subject. RoleBinding holds a list of subjects (users, groups, or service accounts), and a reference to the role being granted. Role and RoleBinding are used in namespaced scoped.

**ClusterRoleBinding** is binding or associating a ClusterRole with a Subject (users, groups, or service accounts). ClusterRole and ClusterRoleBinding function similar Role and RoleBinding with a wider scope. ClusterRoleBinding grants access cluster-wide as well as multiple namespaces.
## Define a Cluster Level RBAC
Cluster Level RBAC is set during the cluster creation process. During the cluster creation, while configuring the cluster (Cluster Settings), the user can select RBAC from the left menu. There are two available options for setting up RBAC:
* **Cluster** to create a RoleBinding with cluster-wide scope (ClusterRoleBinding).
* **Namespaces** to create a RoleBinding within namespaces scope (RoleBinding).
Palette users can make the choice of role creation based on their resource requirements. 

### Steps to set up Cluster Roles Binding (Cluster)
* Select Cluster Settings -> RBAC -> Cluster
* Click on “Add new binding” to open the “Add Cluster Role Binding” wizard. Fill in the following details:
  * Role Name : Define a custom role name to identify the cluster role
  * Subjects : Subjects are a group of users, services, or teams using the Kubernetes API. It defines the operations a user, service, or a team can perform. There are three types of subjects:
    * Subject Type:
      * Users: These are global, and meant for humans or processes living outside the cluster.
      * Groups: Set of users.
      * Service Accounts: Kubernetes uses service accounts to authenticate and authorize requests by pods to the Kubernetes API server. These are namespaced and meant for intra-cluster processes running inside pods.
   * Subject Name: Custom name to identify a subject.
A single RoleBinding can have multiple subjects.
“Confirm” the information to complete the creation of the ClusterRoleBinding. 

### Steps to set up Namespace Based RolesBinding (Namespaces)
Users can now allocate CPU and Memory quota for each namespace at the cluster level. 
* Select Cluster Settings -> RBAC -> Namespace
* Create a namespace with a custom name and add it to the list of the namespace by clicking on “add to the list”
* Allocate resources to the created namespace (CPU and Memory).
* Click on “Add new binding” to open the “Add ClusterRoleBinding” wizard. Fill in the following details:
  * Namespace: Select the namespace from the drop down (the list will display the namespaces created during the previous step.
  * Role Type: Select the role type from the drop down. Either Role or Cluster Role.

<InfoBox>
A RoleBinding may reference any Role in the same namespace. Alternatively, a RoleBinding can reference a ClusterRole and bind that ClusterRole to the namespace of the RoleBinding. If you want to bind a ClusterRole to all the namespaces in your cluster, you use a ClusterRoleBinding.
</InfoBox>

* Role Name: Define a custom role name to identify the cluster role
* Subjects: Subjects are a group of users, services, or team using the Kubernetes API. It defines the operations a user, service, or a group can perform. There are three types of subjects:
  * Subject Type:
    * Users: These are global, and meant for humans or processes living outside the cluster.
    * Groups: Set of users.
    * Service Accounts: Kubernetes uses service accounts to authenticate and authorize requests by pods to the Kubernetes API server. These are namespaced and meant for intra-cluster processes running inside pods.
  * Subject Name: Custom name to identify a subject.
A single RoleBinding can have multiple subjects. “Confirm” the information to complete the creation of the RoleBinding . 

### RBAC Manangement on Running Clusters
To edit/add RoleBindings to a running cluster:
Clusters -> select the cluster -> Settings -> Cluster Settings -> select RBAC from left menu.
### Use Cases
* Use Role and a RoleBinding to scope security to a single namespace.
* Use ClusterRole and RoleBinding to scope security to several or all namespaces.
* Use ClusterRole and ClusterRoleBinding to scope security to all namespaces OR cluster-scoped resources.

