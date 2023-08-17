---
title: "Add Roles and Role Bindings"
metaTitle: "Add Roles and Role Bindings"
metaDescription: "Learn how to configure user roles and cluster role bindings for Virtual Machines managed by Palette Virtual Machine Orchestrator."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

You must configure roles and cluster role bindings before users can access Palette Virtual Machine Orchestrator. Refer to [VM User Roles and Permissions](/vm-management/vm-roles-permissions) for a list of Cluster Roles and equivalent Palette Roles. 


# Prerequisites

- A cluster profile with the **Virtual Machine Orchestrator** add-on pack configured. Check out the [Create a VMO Profile](/vm-management/vm-packs-profiles/create-vmo-profile) guide to learn more.


- Two defined cluster role bindings for every user: ``spectro-list-namespaces``and ``spectro-list-vmtemplates``.


- Additional cluster roles, based on the user's persona, must be associated with the user by specifying a cluster role binding or a namespace-restricted role binding:

    <br />

    - ``spectro-vm-admin``

    - ``spectro-vm-power-user``

    - ``spectro-vm-user``

    - ``spectro-vm-viewer``

    Alternatively, you can use standard Kubernetes roles ``cluster-admin``, ``admin``, ``edit``, and ``view`` instead of defining bindings based on ``spectro-vm-*`` roles.


- Assigned permissions to access Palette clusters. 


# Add Roles and Role Bindings

1. Log in to [Palette](https://console.spectrocloud.com).


2. From the left **Main Menu**, click **Clusters** and select your cluster. 


3. Navigate to the **Profiles** tab and click **+** next to **Addon Layers**.


4. Select the VMO profile you created.


5. Click on **Settings** and choose **RBAC** to add role bindings. Refer to [Create a Role Binding](/clusters/cluster-management/cluster-rbac#createrolebindings) for guidance. Refer to [VM User Roles and Permissions](/vm-management/vm-roles-permissions) for a list of Cluster Roles and equivalent Palette Roles.


6. Click **Confirm** to update the cluster.
	
The cluster status displays as **Updating** on the **Cluster Overview** page. Updating can take several minutes depending on your environment. You can track events from the **Events** tab.


# Validate

To verify role creation and role binding is successful, review the [Validation](/clusters/cluster-management/cluster-rbac#validate) steps in [Cluster Role Binding](/clusters/cluster-management/cluster-rbac#createrolebindings).


# Next Steps

Now you are ready to deploy a VM. Review the [Deploy VM From a Template](/vm-management/create-manage-vm/standard-vm-operations/deploy-vm-from-template) guide to get started with the deployment process.
	

# Resources

- [VM User Roles and Permissions](/vm-management/vm-roles-permissions)
