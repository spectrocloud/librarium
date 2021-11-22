---
title: "Adding a workspace"
metaTitle: "Adding a workspace"
metaDescription: "How to create multi-cluster workspace in Spectro Cloud"
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';


# Prerequisites

* One or more running workload clusters within the project

# Create your Workspace

## Basic Information
Provide basic information for the Workspace such as:

* Unique Name
* Optional Description
* Optional Tag

## Associate Clusters

* Select cluster(s) to be added to the Workspace. Palette clusters, as well as brownfield clusters, could be added to your Workspace.
* Configure the Cluster Role Binding (Optional). Optionally role bindings could be created on all Workspace clusters.
  * In step 2 of new workspace creation, select ‘Add Cluster Role Binding.’
  * Provide the name of the role for which the cluster role binding needs to be created. The role should be pre-existing or an in-built system role. Palette does not create cluster roles.  
  * Subjects for the cluster role binding can be groups, users, or service accounts.

|Subject type |Subject name |Subject namespace|
|-------------|-------------|-----------------|
|User|a valid path segment name|NA|
|Group|a valid path segment name|NA|
|Service Account|a valid path segment name|Granting super-user access to all service accounts cluster-wide is strongly discouraged. Hence Grant a role to all service accounts in a namespace|
------------
  
## Associate Namespaces
  
* Enter one or more namespaces that need to be part of the Workspace. The combination of Workspace and cluster is unique across workspaces in a project. Palette ensures that all the namespaces are created for all the clusters in the workspaces, in case they are not pre-existing.
* Add resource quota for the namespaces by specifying CPU and Memory limits (Optional).
* Configure the Role Binding (Optional). The following information is required for each role binding:
   * Select a namespace
   * Specific name for the role which is pre-existing
   * Make the selection of Subjects from the drop-down (User, Group, or ServiceAccount)

For the subject selected, provide a valid path segment name. For the subject, ServiceAccount select namespace name as granting super-user access to all service accounts cluster-wide is strongly discouraged due to security concerns.
   * Confirm the information provided to complete the configuration of role binding.
  
