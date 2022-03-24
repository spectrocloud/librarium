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

RoleBindings and ClusterRoleBindings are Role-Based Access Control (RBAC) concepts that allow granular control over cluster-wide resources as well as namespaced resources. Palette provides the ability to specify these bindings to configure granular RBAC rules. Palette also can define new namespaces for the cluster and manage (remove, assign quota, assign role bindings, etc.) them.

Users can configure namespaces and RBAC directly from within a cluster or from a workspace that contains a collection of homogenous clusters that need to be managed as a group.

<InfoBox>
Please note that namespace management and RBAC can only be performed from within a cluster, as long as the cluster is not part of any workspace. Once a cluster is made part of a workspace, these actions can only be performed from the workspace.
</InfoBox>

**Role** sets access permissions within a namespace. During Role creation, the namespace it belongs to needs to be specified.

**Cluster Role** is a non-namespaced resource that sets permissions of the cluster-scoped resources.

<InfoBox>
Palette does not provide a way for roles to be configured natively through its platform. However, you may choose to create roles using a manifest layer in the cluster profile. RBAC management only allows you to specify bindings.
</InfoBox>

**RoleBinding** is binding or associating a Role with a Subject. RoleBinding is used for granting permission to a Subject. In addition, RoleBinding holds a list of subjects (users, groups, or service accounts) and references the role being granted. Role and RoleBinding are used in namespaced scoped.

**ClusterRoleBinding** binds or associates a ClusterRole with a Subject (users, groups, or service accounts). ClusterRole and ClusterRoleBinding function similar Role and RoleBinding with a broader scope. ClusterRoleBinding grants access cluster-wide as well as multiple namespaces.

# New clusters

While configuring the cluster (Cluster Settings) during the cluster creation, the user can select RBAC from the left menu. There are two available options for setting up RBAC:

* **Cluster** to create a RoleBinding with cluster-wide scope (ClusterRoleBinding).
* **Namespaces** to create a RoleBinding within namespaces scope (RoleBinding).
Palette users can choose role creation based on their resource requirements.

## Configure cluster role bindings

* Select Cluster Settings -> RBAC -> Cluster
* Click on “Add new binding” to open the “Add Cluster Role Binding” wizard. Fill in the following details:
  * Role Name: Define a custom role name to identify the cluster role
  * Subjects: Subjects are a group of users, services, or teams using the Kubernetes API. It defines the operations a user, service, or a team can perform. There are three types of subjects:
    * Subject Type:
      * Users: These are global and meant for humans or processes living outside the cluster.
      * Groups: Set of users.
      * Service Accounts: Kubernetes uses service accounts to authenticate and authorize requests by pods to the Kubernetes API server. These are namespaced and meant for intra-cluster processes running inside pods.
  * Subject Name: Custom name to identify a subject.
A single RoleBinding can have multiple subjects.
“Confirm” the information to complete the creation of the ClusterRoleBinding.

## Configure role bindings

Users can now allocate CPU and Memory quotas for each namespace at the cluster level.

* Select Cluster Settings -> RBAC -> Namespace.
* Create a namespace with a custom name and add it to the list of the namespace by clicking on “add to the list”.
* Allocate resources to the created namespace (CPU and Memory).
* Click on “Add new binding” to open the “Add ClusterRoleBinding” wizard. Fill in the following details:
  * Namespace: Select the namespace from the drop-down (the list will display the namespaces created during the previous step.
  * Role Type: Select the role type from the drop-down. Either Role or Cluster Role.

<InfoBox>
A RoleBinding may reference any Role in the same namespace. Alternatively, a RoleBinding can reference a ClusterRole and bind that ClusterRole to the namespace of the RoleBinding. For example, if you want to bind a ClusterRole to all the namespaces in your cluster, you use a ClusterRoleBinding.
</InfoBox>

* Role Name: Define a custom role name to identify the cluster role
* Subjects: Subjects are a group of users, services, or teams using the Kubernetes API. It defines the operations a user, service, or group can perform. There are three types of subjects:
  * Subject Type:
    * Users: These are global, and meant for humans or processes living outside the cluster.
    * Groups: Set of users.
    * Service Accounts: Kubernetes uses service accounts to authenticate and authorize requests by pods to the Kubernetes API server. These are namespaced and meant for intra-cluster processes running inside pods.
  * Subject Name: Custom name to identify a subject.
A single RoleBinding can have multiple subjects. “Confirm” the information to complete the creation of the RoleBinding.

# Running Clusters

You can manage namespaces and RBAC for a running cluster by invoking the RBAC management page as follows:
Clusters -> select the cluster -> Settings -> Cluster Settings -> select RBAC from left menu.

Configure settings as described above.

# Use Cases

* Use Role and a RoleBinding to scope security to a single namespace.
* Use ClusterRole and RoleBinding to scope security to several or all namespaces.
* Use ClusterRole and ClusterRoleBinding to scope security to all namespaces OR cluster-scoped resources.
