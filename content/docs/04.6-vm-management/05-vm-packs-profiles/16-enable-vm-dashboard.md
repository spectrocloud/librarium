---
title: "Enable Spectro VM Dashboard"
metaTitle: "Enable Spectro VM Dashboard"
metaDescription: "Learn how to apply a profile to enable the Spectro VM Dashboard."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

To enable the Spectro VM Dashboard, apply the profile you created to your cluster. 


# Prerequisites

- A cluster profile with the **Spectro VM Dashboard** add-on pack configured. Check out the [Create Spectro VM Dashboard Profile](/vm-management/vm-packs-profiles/create-vm-dashboard-profile) guide to learn more.


- Two defined cluster role bindings for every user: ``spectro-list-namespaces``and ``spectro-list-vmtemplates``.


- Additional cluster roles, based on the user's persona, must be associated with the user by specifying a cluster role binding or a namespace-restricted role binding:

    <br />

    - ``spectro-vm-admin``

    - ``spectro-vm-power-user``

    - ``spectro-vm-user``

    - ``spectro-vm-viewer``

    Alternatively, you can use standard Kubernetes roles ``cluster-admin``, ``admin``, ``edit``, and ``view`` instead of defining bindings based on ``spectro-vm-*`` roles.


- Assigned permissions to access Palette clusters. 


# Enable the VM Dashboard

1. Log in to [Palette](https://console.spectrocloud.com).


2. From the left **Main Menu**, click **Clusters** and select your cluster. 


3. Navigate to the **Profiles** tab and click **+** next to **Addon Layers**, then select the profile you created.


4. Click on **Settings** and choose **RBAC** to add role bindings. Refer to [Create a Role Binding](/clusters/cluster-management/cluster-rbac#createrolebindings) for guidance. Refer to [VM User Roles and Permissions](/vm-management/vm-roles-permissions) for a list of Cluster Roles and equivalent Palette Roles.


5. Click **Confirm** to update the cluster.
	
The cluster status displays as **Upgrading** on the cluster overview page. Updating can take several minutes depending on your environment. You can track events from the **Events** tab.


# Validate

When the cluster is finished upgrading, ensure the cluster status displays as **Running** and that a new tab labeled **Virtual Machines** appears on the Cluster's page. 

# Next Steps

Now you are ready to deploy a VM. Go ahead and review the [Deploy VM From a Template](/vm-management/create-manage-vm/standard-vm-operations/deploy-vm-from-template) guide to get started with the deployment process.
	

# Resources

- [VM User Roles and Permissions](/vm-management/vm-roles-permissions)
