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

* Select one or more cluster(s) to be added to the workspace. You can select cluters deployed through Palette as well as imported clusters.
* Configure the Cluster Role Binding (Optional). These bindings will be created on all clusters that are part of the workspace.
  * In step 2 of new workspace creation, select ‘Add Cluster Role Binding.’
  * Provide the name of the role for which the cluster role binding needs to be created. The role should pre-exist or in-built system role. Palette does not create cluster roles.  
  * Subjects for the cluster role binding. Subjects can be groups, users, or service accounts.

|Subject type |Subject name |Subject namespace|
|-------------|-------------|-----------------|
|User|a valid path segment name|NA|
|Group|a valid path segment name|NA|
|Service Account|a valid path segment name|Granting super-user access to all service accounts cluster-wide is strongly discouraged. Hence Grant a role to all service accounts in a namespace|
------------
  
## Associate Namespaces
  
* Enter one or more namespaces that need to be part of the workspace. The combination of workspace and cluster is unique across workspaces in a project. Palette ensures all the namespaces are created in all the clusters in the workspaces, in case they are not pre-existing.
* Add resoruce quota for the namespaces by speciying CPU and Memory limits (Optional)
* Configure the Role Binding (Optional)
  * The following information is required for each role binding:
      * Select a namespace
      * Specific name for the role. The role should be pre-existing.
      * Make the selection of Subjects from the drop-down (User, Group, or ServiceAccount). For the subject selected, provide a valid path segment name. For the subject, ServiceAccount select namespace name as granting super-user access to all service accounts cluster-wide is strongly discouraged due to security concerns.
      * Confirm the information provided to complete the configuration of role binding.
  
