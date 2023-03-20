---
title: "Enable Spectro VM Dashboard"
metaTitle: "Enable Spectro VM Dashboard"
metaDescription: "Learn how to"
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Enable the VM Dashboard on your MAAS cluster by applying the profile with the Spectro VM Dashboard add-on pack to it. 


# Prerequisites

- A cluster profile with the Spectro VM Dashboard add-on configured.


- Two defined cluster role bindings for every user: ``spectro-list-namespaces``and ``spectro-list-vmtemplates``.


- Additional cluster roles, based on the user's persona, must be associated with the user by specifying a cluster role binding or a namespace-restricted role binding:

    <br />

    - ``spectro-vm-admin``

    - ``spectro-vm-power-user``

    - ``spectro-vm-user``

    - ``spectro-vm-viewer``

    Alternatively, you can use standard Kubernetes roles ``cluster-admin``, ``admin``, ``edit``, and ``view`` instead of defining bindings based on ``spectro-vm-*`` roles.


- Assigned permissions to access Palette clusters. 


Refer to [Create a Role Binding](/clusters/cluster-management/cluster-rbac#createrolebindings) for role creation guidance and to [VM User Roles and Permissions](/vm-management/vm-roles-permissions) for a list of Cluster Roles and equivalent Palette Roles.



# Enablement

1. From the left **Main Menu**, click **Clusters** and select your MAAS cluster. 


2. Go to the **Profiles** tab and click **+** next to **Addon Layers**, then select the profile you created.


3. Click **Confirm** to update the cluster.
	
The cluster status displays as **Upgrading** on the cluster overview page. Updating can take 10-20 minutes depending on your environment. You can track events from the **Events** tab.

When the cluster is finished upgrading, its status displays as **Running** and a new tab labeled **Virtual Machines** appears on the Clusters page. 
	

# Resources

- [VM User Roles and Permissions](/vm-management/vm-roles-permissions)